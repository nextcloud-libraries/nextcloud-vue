/*!
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
import { confirm as confirmPrompt, print, run, select, tryRead } from './cli-utils.mjs'
import { formatChangelog } from './format-changelog.mjs'

const REPO_SLUG = 'nextcloud-libraries/nextcloud-vue'
const REPO_URL = `https://github.com/${REPO_SLUG}`

// Work in the repository root, whatever the caller's working directory is.
process.chdir(join(import.meta.dirname, '..'))

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
 * Strip GitHub boilerplate (leading HTML comment, "What's Changed" heading,
 * trailing "Full Changelog" line and trailing blank lines) and separate
 * sections with a blank line, so
 * the notes match the CHANGELOG.md style.
 *
 * @param {string} rawBody the raw generated notes body
 * @return {string} the cleaned markdown
 */
function cleanNotes(rawBody) {
	return rawBody
		.split('\n')
		.filter((line) => !line.startsWith('<!--') && line !== '## What\'s Changed' && !line.startsWith('**Full Changelog**:'))
		.join('\n')
		.trim()
		.replace(/([^\n])\n(#{2,3} )/g, '$1\n\n$2')
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
	// cleanNotes puts a blank line before each heading, so the sections split there.
	const sections = notes.split(/\n\n(?=#{2,3} )/).filter(Boolean)
	let index = sections.findIndex((section) => section.startsWith('### Other Changes'))

	// Create the section if it is missing but there are bumps to record.
	if (index === -1) {
		if (!hasDependencyBumps) {
			return notes
		}
		const contributors = sections.findIndex((section) => section.startsWith('## New Contributors'))
		index = contributors === -1 ? sections.length : contributors
		sections.splice(index, 0, '### Other Changes')
	}

	// Collapse all Transifex PRs into a single "Updated translations" line.
	const lines = sections[index].split('\n')
	const hasTranslations = lines.some((line) => /transifex/i.test(line))
	const body = lines.filter((line) => !/transifex/i.test(line))
	if (hasDependencyBumps) {
		body.push('* Updated dependencies')
	}
	if (hasTranslations) {
		body.push('* Updated translations')
	}
	sections[index] = body.join('\n')
	return sections.join('\n\n')
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
			print.err(`Missing branch name after '${arg}'.`)
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
		print.err(`Unknown argument: ${arg}`)
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

/** Abort the release because a mandatory step was skipped. */
function skipAbort() {
	print.err('Step skipped — aborting release. No further changes made.')
	process.exit(1)
}

// --- Pre-flight ------------------------------------------------------------
// Aborting reverts package.json and committing stages it, so local edits must not be there.
if (tryRead('git', ['status', '--porcelain'])) {
	print.err('Working tree is not clean. Commit or stash your changes first.')
	run('git', ['status', '--short'])
	process.exit(1)
}

// Also fails when gh is missing or not logged in. Release notes and the push both need write access.
if (tryRead('gh', ['api', `repos/${REPO_SLUG}`, '--jq', '.permissions.push']) !== 'true') {
	print.err(`No write access to ${REPO_SLUG}. Check that gh is installed and run 'gh auth login'.`)
	process.exit(1)
}

const currentBranch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { capture: true })
const baseBranch = baseArg ?? currentBranch
print.info(`Base branch  : ${baseBranch}${baseArg && baseArg !== currentBranch ? ` (currently on '${currentBranch}')` : ''}`)
print.info(`Repository   : ${REPO_SLUG}`)
print.info(`Prompts      : ${autoYes ? 'OFF (--yes)' : 'ON (confirm each step)'}`)
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
	print.ok(`On '${baseBranch}' with latest changes.`)
} else {
	skipAbort()
}
console.info('')

// --- Step 2: Review changes and choose the version bump --------------------
const prevTag = run('git', ['describe', '--tags', '--abbrev=0'], { capture: true })
const currentVersion = JSON.parse(await readFile('package.json', 'utf-8')).version
print.info(`Current version : ${currentVersion}`)
print.info(`Previous tag    : ${prevTag}`)

// The notes are built once here and reused verbatim for the changelog in step
// 4. `release-preview` is a placeholder tag; GitHub then uses `baseBranch` as
// the range's upper bound, and cleanNotes strips the label anyway.
print.info(`Step 2/4: Fetching changes since ${prevTag} from GitHub…`)
// Dependency bumps are excluded from GitHub's notes; detect them from the log
// so they collapse into a single "Updated dependencies" line.
const commitSubjects = run('git', ['log', `${prevTag}..HEAD`, '--pretty=format:%s'], { capture: true })
const hasDependencyBumps = /\bbump\b/i.test(commitSubjects)
const releaseNotes = formatChangelog(condenseOtherChanges(cleanNotes(generateNotes('release-preview', prevTag, baseBranch)), hasDependencyBumps))
console.info('')
console.info(releaseNotes)
console.info('')
// A bump given on the command line always wins over the detected one.
const detectedBump = detectBump(releaseNotes)
print.info(`Review the changes above. Detected release type: '${detectedBump}'${bump ? `, command line: '${bump}'` : ''}.`)
bump = await select('Release type?', ['patch', 'minor', 'major'].map((value) => ({ label: value, value })), { defaultValue: bump ?? detectedBump, autoYes })

// npm version prints the new version prefixed with 'v', e.g. v9.8.3
const newTag = run('npm', ['version', bump, '--no-git-tag-version'], { capture: true })
print.ok(`New version: ${currentVersion} → ${newTag} (${bump})`)
if (!(await confirm(`  → Does '${newTag}' match what you expect?`))) {
	print.err('Version mismatch. Reverting package.json changes.')
	run('git', ['checkout', '--', 'package.json', 'package-lock.json'])
	skipAbort()
}
console.info('')

// e.g. tag v9.8.3 → branch chore/release-9.8.3
const releaseBranch = `chore/release-${newTag.replace(/^v/, '')}`

// --- Step 3: Create the release branch -------------------------------------
if (tryRead('git', ['show-ref', '--verify', '--quiet', `refs/heads/${releaseBranch}`]) !== null) {
	print.err(`Branch '${releaseBranch}' already exists. Delete it or pick another version.`)
	run('git', ['checkout', '--', 'package.json', 'package-lock.json'])
	process.exit(1)
}

if (await confirm(`Step 3/4: Create and switch to branch '${releaseBranch}'?`)) {
	// The uncommitted version bump is carried over to the new branch.
	run('git', ['checkout', '-b', releaseBranch])
	print.ok(`On branch '${releaseBranch}'.`)
} else {
	print.warn('Reverting version bump.')
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
	const changelogPath = 'CHANGELOG.md'
	const changelog = await readFile(changelogPath, 'utf-8')
	const firstEntry = changelog.search(/^## \[v/m)
	if (firstEntry === -1) {
		print.err('Could not locate an existing "## [vX.Y.Z]" entry in CHANGELOG.md.')
		process.exit(1)
	}
	const updated = changelog.slice(0, firstEntry) + entry + changelog.slice(firstEntry)
	await writeFile(changelogPath, updated)

	print.ok(`Changelog entry prepended for ${newTag}.`)
	print.warn('Review CHANGELOG.md — auto-generated notes usually need manual polishing.')

	// Separate confirmation so the changelog can be polished before committing.
	if (await confirm('  → Stage and commit these changes now?')) {
		run('git', ['add', ...commitFiles])
		run('git', ['commit', '--signoff', '--message', commitMessage]) // --signoff for DCO
		committed = true
		print.ok(`Committed as '${commitMessage}'.`)
	} else {
		print.warn('Skipping commit. Review CHANGELOG.md, then commit manually.')
	}
} else {
	print.warn('Skipping changelog generation. You can edit CHANGELOG.md manually.')
}
console.info('')

// --- Done — push and PR remain manual --------------------------------------
print.ok(`Automated steps complete for ${newTag} on branch '${releaseBranch}'.`)
console.info('')
// The PR body is read from the committed CHANGELOG.md lines, so manual polishing is included.
const prCreate = `git show --format= -U0 ${releaseBranch} -- CHANGELOG.md | sed -n '/^+++/d; s/^+//p' \\
      | gh pr create --base ${baseBranch} --head ${releaseBranch} --title "${commitMessage}" --body-file -`
print.info('Review your changes:')
console.info(committed ? '    git show' : '    git diff; git status')
console.info('')
print.info('Next (manual) steps from README.md:')
if (!committed) {
	console.info(`    git add ${commitFiles.join(' ')}
    git commit --signoff --message "${commitMessage}"`)
}
console.info(`    git push -u origin ${releaseBranch}
    ${prCreate}`)
