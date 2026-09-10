/*
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
/* eslint-disable no-console */

/**
 * Automates the "📤 Releasing a new version" steps from README.md, up to and
 * including the release commit (pushing and opening the PR stay manual).
 *
 * Prompts are arrow-key selects (↑/↓ + Enter, no typing). Before each step
 * (unless --yes is passed) it will:
 *   1. Check out and pull the latest changes of the base branch (main or stableX)
 *   2. Show GitHub's categorised changes since the last tag, then bump the
 *      version (`npm version <type> --no-git-tag-version`). The bump type is
 *      inferred from those changes (💥 Breaking → major, 🚀 Enhancements →
 *      minor, otherwise patch) and offered as the default; pass an explicit
 *      [patch|minor|major] argument to override it.
 *   3. Create the release branch `chore/release-<version>`
 *   4. Prepend those (formatted) release notes to CHANGELOG.md, then stage and
 *      commit the release (`chore(release): <version>`, signed off)
 *
 * Requirements: git, gh (authenticated), npm.
 *
 * Usage:
 *   npm run release -- [patch|minor|major] [options]
 *   node build/release.mjs [patch|minor|major] [options]
 *
 * The [patch|minor|major] argument is optional — when omitted the bump is
 * detected from the categorised changes since the last tag.
 *
 * Options:
 *   -b, --base <branch>   Branch to base the release on (e.g. main, stable8).
 *                         Defaults to the currently checked-out branch.
 *   -y, --yes             Auto-confirm every step (no prompts); uses the
 *                         detected bump unless one is given explicitly
 *   -h, --help            Show this help
 */

import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { c, confirm as confirmPrompt, tryRead as readCommand, run as runCommand, select } from './cli-utils.mjs'
import { formatChangelog } from './format-changelog.mjs'

const REPO_SLUG = 'nextcloud-libraries/nextcloud-vue'
const REPO_URL = `https://github.com/${REPO_SLUG}`
const ROOT = join(import.meta.dirname, '..')

// Bind the generic runners to the repository root, so every git/gh/npm call
// operates on this repository regardless of the caller's working directory.
const run = (cmd, args, options = {}) => runCommand(cmd, args, { cwd: ROOT, ...options })
const tryRead = (cmd, args) => readCommand(cmd, args, { cwd: ROOT })

/**
 * Fetch GitHub's categorised release notes for the range `previousTag..target`.
 * The tag need not exist yet — the notes only depend on the range's commits.
 *
 * @param {string} tagName tag label for the notes (may be a placeholder)
 * @param {string} previousTag the previous release tag
 * @param {string} target branch or commit the release is built from
 * @return {string} the generated markdown body
 */
function generateNotes(tagName, previousTag, target) {
	return run(
		'gh',
		[
			'api',
			`repos/${REPO_SLUG}/releases/generate-notes`,
			'-f',
			`tag_name=${tagName}`,
			'-f',
			`target_commitish=${target}`,
			'-f',
			`previous_tag_name=${previousTag}`,
			'--jq',
			'.body',
		],
		{ capture: true },
	)
}

/**
 * Strip GitHub boilerplate (leading HTML comment, trailing "Full Changelog"
 * line and trailing blank lines) so the notes match the CHANGELOG.md style.
 *
 * @param {string} rawBody the raw generated notes body
 * @return {string} the cleaned markdown
 */
function cleanNotes(rawBody) {
	return rawBody
		.split('\n')
		.filter((line) => !line.startsWith('<!--') && !line.startsWith('**Full Changelog**:'))
		.join('\n')
		.trim()
}

/**
 * Condense the "### Other Changes" section to the CHANGELOG.md style: collapse
 * Transifex PRs into one "Updated translations" line, and add an "Updated
 * dependencies" line when the range has dependency-bump commits.
 *
 * @param {string} notes the cleaned release notes
 * @param {boolean} hasDependencyBumps whether the git log contains bump commits
 * @return {string} the condensed release notes
 */
function condenseOtherChanges(notes, hasDependencyBumps) {
	const lines = notes.split('\n')
	let start = lines.findIndex((line) => line.startsWith('### Other Changes'))

	// Create the section if it is missing but there are bumps to record.
	if (start === -1) {
		if (!hasDependencyBumps) {
			return notes
		}
		const contribIndex = lines.findIndex((line) => line.startsWith('## New Contributors'))
		if (contribIndex === -1) {
			lines.push('', '### Other Changes')
			start = lines.length - 1
		} else {
			lines.splice(contribIndex, 0, '### Other Changes', '')
			start = contribIndex
		}
	}

	// The section body runs until the next heading (or the end of the notes).
	let end = lines.length
	for (let i = start + 1; i < lines.length; i++) {
		if (/^#{2,3} /.test(lines[i])) {
			end = i
			break
		}
	}

	const head = lines.slice(0, start + 1)
	const tail = lines.slice(end)
	let body = lines.slice(start + 1, end)

	// Collapse all Transifex PRs into a single "Updated translations" line.
	const hasTranslations = body.some((line) => /transifex/i.test(line))
	body = body.filter((line) => !/transifex/i.test(line))

	// Append the summary lines at the end of the section.
	while (body.length && body[body.length - 1].trim() === '') {
		body.pop()
	}
	if (hasDependencyBumps) {
		body.push('* Updated dependencies')
	}
	if (hasTranslations) {
		body.push('* Updated translations')
	}

	const rebuilt = [...head, ...body]
	if (tail.length) {
		rebuilt.push('', ...tail)
	}
	return rebuilt.join('\n')
}

/**
 * Infer the semver bump from the highest-priority section in the notes:
 * 💥 Breaking Changes → major, 🚀 Enhancements → minor, everything else → patch.
 * Only a suggestion — the maintainer confirms or overrides it.
 *
 * @param {string} notes the categorised release notes
 * @return {'patch'|'minor'|'major'} the inferred bump
 */
function detectBump(notes) {
	if (/^#{2,3} .*\bBreaking Changes\b/im.test(notes)) {
		return 'major'
	}
	if (/^#{2,3} .*\bEnhancements\b/im.test(notes)) {
		return 'minor'
	}
	return 'patch'
}

// --- Argument parsing ------------------------------------------------------
let bump = null
let autoYes = false
let baseArg = null

const argv = process.argv.slice(2)
for (let i = 0; i < argv.length; i++) {
	const arg = argv[i]
	if (['patch', 'minor', 'major'].includes(arg)) {
		bump = arg
	} else if (arg === '-b' || arg === '--base') {
		baseArg = argv[++i]
		if (!baseArg) {
			c.err(`Missing branch name after '${arg}'.`)
			process.exit(1)
		}
	} else if (arg.startsWith('--base=')) {
		baseArg = arg.slice('--base='.length)
	} else if (arg === '-y' || arg === '--yes') {
		autoYes = true
	} else if (arg === '-h' || arg === '--help') {
		// Print the JSDoc block that documents usage as help text.
		const self = await readFile(new URL(import.meta.url), 'utf-8')
		const block = self.match(/\/\*\*[\s\S]*?Usage:[\s\S]*?\*\//)?.[0] ?? ''
		console.info(block
			.split('\n')
			.slice(1, -1)
			.map((l) => l.replace(/^\s*\*\s?/, ''))
			.join('\n'))
		process.exit(0)
	} else {
		c.err(`Unknown argument: ${arg}`)
		process.exit(1)
	}
}

// --- Interactive prompts (bound to this run's --yes toggle) ----------------

/**
 * Ask a yes/no question, honouring the --yes toggle.
 *
 * @param {string} question the prompt to display
 * @return {Promise<boolean>} true when the user confirms
 */
function confirm(question) {
	return confirmPrompt(question, { autoYes })
}

/**
 * Ask which semver bump to apply via an arrow-key select. Honours the --yes
 * toggle (returns fallback).
 *
 * @param {string} fallback the bump highlighted first / used with --yes
 * @return {Promise<'patch'|'minor'|'major'>} the chosen bump
 */
function chooseBump(fallback) {
	return select('Release type?', [
		{ label: 'patch', value: 'patch' },
		{ label: 'minor', value: 'minor' },
		{ label: 'major', value: 'major' },
	], { defaultValue: fallback, autoYes })
}

/** Abort the release because a mandatory step was skipped. */
function skipAbort() {
	c.err('Step skipped — aborting release. No further changes made.')
	process.exit(1)
}

// --- Pre-flight ------------------------------------------------------------
for (const bin of ['git', 'gh', 'npm']) {
	if (tryRead(bin, ['--version']) === null) {
		c.err(`Required command '${bin}' not found in PATH.`)
		process.exit(1)
	}
}

if (tryRead('git', ['status', '--porcelain'])) {
	c.err('Working tree is not clean. Commit or stash your changes first.')
	run('git', ['status', '--short'])
	process.exit(1)
}

if (tryRead('gh', ['auth', 'status']) === null) {
	c.err("GitHub CLI is not authenticated. Run 'gh auth login' first.")
	process.exit(1)
}

const currentBranch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { capture: true })
const baseBranch = baseArg ?? currentBranch
c.info(`Release type : ${bump}`)
c.info(`Base branch  : ${baseBranch}${baseArg && baseArg !== currentBranch ? ` (currently on '${currentBranch}')` : ''}`)
c.info(`Repository   : ${REPO_SLUG}`)
c.info(`Prompts      : ${autoYes ? 'OFF (--yes)' : 'ON (confirm each step)'}`)
console.info('')

// --- Step 1: Check out and pull the base branch ----------------------------
const needsCheckout = baseBranch !== currentBranch
const step1 = needsCheckout
	? `Step 1/4: Check out '${baseBranch}' and pull latest changes from origin?`
	: `Step 1/4: Pull latest changes of '${baseBranch}' from origin?`
if (await confirm(step1)) {
	if (needsCheckout) {
		run('git', ['checkout', baseBranch])
	}
	run('git', ['pull', '--ff-only', 'origin', baseBranch])
	c.ok(`On '${baseBranch}' with latest changes.`)
} else {
	skipAbort()
}
console.info('')

// --- Step 2: Review changes and choose the version bump --------------------
const prevTag = run('git', ['describe', '--tags', '--abbrev=0'], { capture: true })
const currentVersion = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf-8')).version
c.info(`Current version : ${currentVersion}`)
c.info(`Previous tag    : ${prevTag}`)

// The notes are built once here and reused verbatim for the changelog in step
// 4. `release-preview` is a placeholder tag; GitHub then uses `baseBranch` as
// the range's upper bound, and cleanNotes strips the label anyway.
c.info(`Step 2/4: Fetching changes since ${prevTag} from GitHub…`)
// Dependency bumps are excluded from GitHub's notes; detect them from the log
// so they collapse into a single "Updated dependencies" line.
const commitSubjects = run('git', ['log', `${prevTag}..HEAD`, '--pretty=format:%s'], { capture: true })
const hasDependencyBumps = /\bbump\b/i.test(commitSubjects)
const releaseNotes = formatChangelog(condenseOtherChanges(cleanNotes(generateNotes('release-preview', prevTag, baseBranch)), hasDependencyBumps))
console.info('')
console.info(releaseNotes)
console.info('')
c.info('Review the changes above (🚀 Enhancements → minor, 🐛 Fixed bugs → patch, breaking → major).')

// A bump given on the command line always wins over the detected one.
const detectedBump = detectBump(releaseNotes)
if (bump) {
	c.info(`Release type '${bump}' taken from the command line (detected from changes: '${detectedBump}').`)
} else {
	c.info(`Detected release type from the changes above: '${detectedBump}'.`)
}
bump = await chooseBump(bump ?? detectedBump)

// npm version prints the new version prefixed with 'v', e.g. v9.8.3
const newTag = run('npm', ['version', bump, '--no-git-tag-version'], { capture: true })
c.ok(`New version: ${currentVersion} → ${newTag} (${bump})`)
if (!(await confirm(`  → Does '${newTag}' match what you expect?`))) {
	c.err('Version mismatch. Reverting package.json changes.')
	run('git', ['checkout', '--', 'package.json', 'package-lock.json'])
	skipAbort()
}
console.info('')

// e.g. tag v9.8.3 → branch chore/release-9.8.3
const releaseBranch = `chore/release-${newTag.replace(/^v/, '')}`

// --- Step 3: Create the release branch -------------------------------------
if (tryRead('git', ['show-ref', '--verify', '--quiet', `refs/heads/${releaseBranch}`]) !== null) {
	c.err(`Branch '${releaseBranch}' already exists. Delete it or pick another version.`)
	run('git', ['checkout', '--', 'package.json', 'package-lock.json'])
	process.exit(1)
}

if (await confirm(`Step 3/4: Create and switch to branch '${releaseBranch}'?`)) {
	// The uncommitted version bump is carried over to the new branch.
	run('git', ['checkout', '-b', releaseBranch])
	c.ok(`On branch '${releaseBranch}'.`)
} else {
	c.warn('Reverting version bump.')
	run('git', ['checkout', '--', 'package.json', 'package-lock.json'])
	skipAbort()
}
console.info('')

// --- Step 4: Update the changelog and commit the release -------------------
const commitFiles = ['package.json', 'package-lock.json', 'CHANGELOG.md']
const commitMessage = `chore(release): ${newTag}`
let committed = false
if (await confirm(`Step 4/4: Prepend the changelog entry (${prevTag} → ${newTag}) to CHANGELOG.md, then commit?`)) {
	const releaseDate = new Date().toISOString().slice(0, 10)

	// Reuse the release notes fetched in step 2 — the content is identical.
	const entry = [
		`## [${newTag}](${REPO_URL}/tree/${newTag}) (${releaseDate})`,
		`[Full Changelog](${REPO_URL}/compare/${prevTag}...${newTag})`,
		'',
		releaseNotes,
		'',
		'',
	].join('\n')

	// Insert the new entry right before the first existing "## [vX.Y.Z]" heading.
	const changelogPath = join(ROOT, 'CHANGELOG.md')
	const changelog = await readFile(changelogPath, 'utf-8')
	const firstEntry = changelog.search(/^## \[v/m)
	if (firstEntry === -1) {
		c.err('Could not locate an existing "## [vX.Y.Z]" entry in CHANGELOG.md.')
		process.exit(1)
	}
	const updated = changelog.slice(0, firstEntry) + entry + changelog.slice(firstEntry)
	await writeFile(changelogPath, updated)

	c.ok(`Changelog entry prepended for ${newTag}.`)
	c.warn('Review CHANGELOG.md — auto-generated notes usually need manual polishing.')

	// Separate confirmation so the changelog can be polished before committing.
	if (await confirm('  → Stage and commit these changes now?')) {
		run('git', ['add', ...commitFiles])
		run('git', ['commit', '--signoff', '--message', commitMessage]) // --signoff for DCO
		committed = true
		c.ok(`Committed as '${commitMessage}'.`)
	} else {
		c.warn('Skipping commit. Review CHANGELOG.md, then commit manually.')
	}
} else {
	c.warn('Skipping changelog generation. You can edit CHANGELOG.md manually.')
}
console.info('')

// --- Done — push and PR remain manual --------------------------------------
c.ok(`Automated steps complete for ${newTag} on branch '${releaseBranch}'.`)
console.info('')
if (committed) {
	c.info('Review the release commit:')
	console.info('    git show')
	console.info('')
	c.info("Next (manual) steps from README.md — 'push and create PR':")
	console.info(`    git push -u origin ${releaseBranch}
    gh pr create --fill --base ${baseBranch}`)
} else {
	c.info('Review your changes:')
	console.info('    git diff; git status')
	console.info('')
	c.info("Next (manual) steps from README.md — 'Commit, push and create PR':")
	console.info(`    git add ${commitFiles.join(' ')}
    git commit --signoff --message "${commitMessage}"
    git push -u origin ${releaseBranch}
    gh pr create --fill --base ${baseBranch}`)
}
