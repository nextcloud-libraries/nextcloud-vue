import { GettextExtractor, JsExtractors, HtmlExtractors } from 'gettext-extractor'

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

/**
 * remove references to avoid conflicts but save them for code splitting
 * @type {Record<string,string[]>}
 */
export const context = extractor.getMessages().map((msg) => {
	const localContext = [msg.text ?? '', [...new Set(msg.references.map((ref) => ref.split(':')[0] ?? ''))].sort().join(':')]
	msg.references = []
	return localContext
}).reduce((p, [id, usage]) => {
	const localContext = { ...(Array.isArray(p) ? {} : p) }
	if (usage in localContext) {
		localContext[usage].push(id)
		return localContext
	 } else {
		localContext[usage] = [id]
	 }
	 return localContext
})

extractor.savePotFile('./l10n/messages.pot')

extractor.printStats()
