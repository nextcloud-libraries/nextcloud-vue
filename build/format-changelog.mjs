/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
/* eslint-disable no-console */

import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

/**
 * Run against CHANGELOG.md if executed as:
 * - package.json script | `npm run prerelease:format-changelog`
 * - Node.js script | `node build/format-changelog.mjs`
 */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	await formatChangelogFile()
}

/**
 * Rewrite GitHub-style "by @user in <pr-url>" references into changelog links
 * that also work outside of GitHub, e.g.
 *   by @foo in https://github.com/nextcloud-libraries/nextcloud-vue/pull/42
 * becomes
 *   [\#42](…/pull/42) \([foo](https://github.com/foo)\)
 *
 * @param {string} content the changelog (or release notes) markdown
 * @return {string} the formatted markdown
 */
export function formatChangelog(content) {
	return content.replaceAll(
		/by @([^ ]+) in ((https:\/\/github.com\/)nextcloud-libraries\/nextcloud-vue\/pull\/(\d+))/g,
		'[\\#$4]($2) \\([$1]($3$1)\\)',
	)
}

/** Format the CHANGELOG.md file in place. */
async function formatChangelogFile() {
	console.info('🔎 checking format of CHANGELOG.md')

	const file = join(import.meta.dirname, '..', 'CHANGELOG.md')
	const content = await readFile(file, { encoding: 'utf-8' })
	const formatted = formatChangelog(content)

	if (formatted !== content) {
		console.info('✏️ fixing format')
		await writeFile(file, formatted)
		console.info('🎉 done')
	} else {
		console.info('✅ no formatting needed - done.')
	}
}
