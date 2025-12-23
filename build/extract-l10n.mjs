/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { GettextExtractor, HtmlExtractors, JsExtractors } from 'gettext-extractor'

const extractor = new GettextExtractor()

const jsParser = extractor.createJsParser([
	JsExtractors.callExpression('t', {
		arguments: {
			text: 0,
		},
	}),
	JsExtractors.callExpression('n', {
		arguments: {
			text: 0,
			textPlural: 1,
		},
	}),
])
	.parseFilesGlob('./src/**/*.@(ts|js)')

extractor.createHtmlParser([
	HtmlExtractors.embeddedJs('*', jsParser),
	HtmlExtractors.embeddedAttributeJs(/:[a-z]+/, jsParser),
])
	.parseFilesGlob('./src/**/*.vue')

const messages = extractor.getMessages()

/**
 * remove references to avoid conflicts but save them for code splitting
 *
 * @type {Record<string,string[]>}
 */
export const context = messages.map((msg) => {
	// mapping of translation ID -> filename(s) [id, filename1:filename2:...]
	const idUsage = [
		msg.text ?? '',
		// get the reference file names only (split off line number), remove duplicates and sort them
		[...new Set(msg.references.map((ref) => ref.split(':')[0] ?? ''))].sort().join(':'),
	]
	// remove reference to avoid conflicts on transifex
	msg.references = []
	return idUsage
}).reduce((localContext, [id, usage]) => {
	// add translation bundles to their usage context (filenames -> [ids])
	if (usage in localContext) {
		localContext[usage].push(id)
		return localContext
	} else {
		localContext[usage] = [id]
	}
	return localContext
}, {})

extractor.savePotFile('./l10n/messages.pot')

extractor.printStats()
