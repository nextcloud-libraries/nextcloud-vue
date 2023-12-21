// Markdown guide: https://www.markdownguide.org/basic-syntax/
// Reference tests: https://github.com/nextcloud-deps/CDMarkdownKit/tree/master/CDMarkdownKitTests

import { mount } from 'cypress/vue'
import NcRichText from '../../src/components/NcRichText/NcRichText.vue'

describe('NcRichText', () => {
	describe('renders with markdown', () => {
		describe('normal text', () => {
			it('XML-like text (escaped and unescaped)', () => {
				mount(NcRichText, {
					props: {
						text: '<span>text&lt;/span&gt;',
						useMarkdown: true,
					},
				})

				cy.get('p').should('have.text', '<span>text</span>')
			})
		})

		describe('headings', () => {
			it('heading (with hash (#) syntax divided with space from text)', () => {
				const testCases = [
					{ tag: 'h1', input: '# heading 1', output: 'heading 1' },
					{ tag: 'h2', input: '## heading 2', output: 'heading 2' },
					{ tag: 'h3', input: '### heading 3', output: 'heading 3' },
					{ tag: 'h4', input: '#### heading 4', output: 'heading 4' },
					{ tag: 'h5', input: '##### heading 5', output: 'heading 5' },
					{ tag: 'h6', input: '###### heading 6', output: 'heading 6' },
				]

				mount(NcRichText, {
					props: {
						text: testCases.map(i => i.input).join('\n'),
						useMarkdown: true,
					},
				})

				testCases.forEach((item) => {
					cy.get(item.tag).should('have.text', item.output)
				})
			})

			it('ignored heading (with hash (#) syntax padded to the text)', () => {
				mount(NcRichText, {
					props: {
						text: '#heading',
						useMarkdown: true,
					},
				})

				cy.get('h1').should('not.exist')
			})

			it('heading 1 (with equal (=) syntax on the next line)', () => {
				mount(NcRichText, {
					props: {
						text: 'heading 1\n==',
						useMarkdown: true,
					},
				})

				cy.get('h1').should('have.text', 'heading 1')
			})

			it('heading 2 (with dash (-) syntax on the next line)', () => {
				mount(NcRichText, {
					props: {
						text: 'heading 2\n--',
						useMarkdown: true,
					},
				})

				cy.get('h2').should('have.text', 'heading 2')
			})
		})

		describe('bold text', () => {
			it('bold text (single with asterisk syntax)', () => {
				mount(NcRichText, {
					props: {
						text: '**bold asterisk**',
						useMarkdown: true,
					},
				})

				cy.get('strong').should('have.text', 'bold asterisk')
			})

			it('bold text (single with underscore syntax)', () => {
				mount(NcRichText, {
					props: {
						text: '__bold underscore__',
						useMarkdown: true,
					},
				})

				cy.get('strong').should('have.text', 'bold underscore')
			})

			it('bold text (several in line with different syntax)', () => {
				const outputs = ['bold underscore', 'bold asterisk']
				mount(NcRichText, {
					props: {
						text: 'normal text __bold underscore__ normal text **bold asterisk** normal text',
						useMarkdown: true,
					},
				})

				cy.get('strong').each((item, index, list) => {
					expect(list).have.length(2)
					expect(item).have.text(outputs[index])
				})
			})

			it('bold text (between normal texts with asterisk syntax)', () => {
				mount(NcRichText, {
					props: {
						text: 'text**bold**text',
						useMarkdown: true,
					},
				})

				cy.get('strong').should('have.text', 'bold')
			})

			it('ignored bold text (between normal texts with underscore syntax)', () => {
				mount(NcRichText, {
					props: {
						text: 'text__bold__text',
						useMarkdown: true,
					},
				})

				cy.get('strong').should('not.exist')
			})

			it('normal text (between bold texts with asterisk syntax)', () => {
				const outputs = ['bold asterisk', 'bold asterisk']
				mount(NcRichText, {
					props: {
						text: '**bold asterisk**normal text**bold asterisk**',
						useMarkdown: true,
					},
				})

				cy.get('strong').each((item, index, list) => {
					expect(list).have.length(2)
					expect(item).have.text(outputs[index])
				})
			})
		})

		describe('italic text', () => {
			it('italic text (single with asterisk syntax)', () => {
				mount(NcRichText, {
					props: {
						text: '*italic asterisk*',
						useMarkdown: true,
					},
				})

				cy.get('em').should('have.text', 'italic asterisk')
			})

			it('italic text (single with underscore syntax)', () => {
				mount(NcRichText, {
					props: {
						text: '_italic underscore_',
						useMarkdown: true,
					},
				})

				cy.get('em').should('have.text', 'italic underscore')
			})

			it('italic text (several in line with different syntax)', () => {
				const outputs = ['italic underscore', 'italic asterisk']
				mount(NcRichText, {
					props: {
						text: 'normal text _italic underscore_ normal text *italic asterisk* normal text',
						useMarkdown: true,
					},
				})

				cy.get('em').each((item, index, list) => {
					expect(list).have.length(2)
					expect(item).have.text(outputs[index])
				})
			})

			it('italic text (between normal texts with asterisk syntax)', () => {
				mount(NcRichText, {
					props: {
						text: 'text*italic*text',
						useMarkdown: true,
					},
				})

				cy.get('em').should('have.text', 'italic')
			})

			it('ignored italic text (between normal texts with underscore syntax)', () => {
				mount(NcRichText, {
					props: {
						text: 'text_italic_text',
						useMarkdown: true,
					},
				})

				cy.get('em').should('not.exist')
			})

			it('normal text (between italic texts with asterisk syntax)', () => {
				const outputs = ['italic asterisk', 'italic asterisk']
				mount(NcRichText, {
					props: {
						text: '*italic asterisk*normal text*italic asterisk*',
						useMarkdown: true,
					},
				})

				cy.get('em').each((item, index, list) => {
					expect(list).have.length(2)
					expect(item).have.text(outputs[index])
				})
			})
		})

		describe('inline code', () => {
			it('inline code (single with backticks syntax)', () => {
				mount(NcRichText, {
					props: {
						text: 'normal text `inline code` normal text',
						useMarkdown: true,
					},
				})

				cy.get('code').should('have.text', 'inline code')
			})

			it('inline code (single with double backticks syntax)', () => {
				mount(NcRichText, {
					props: {
						text: 'normal text ``inline code`` normal text',
						useMarkdown: true,
					},
				})

				cy.get('code').should('have.text', 'inline code')
			})

			it('inline code (single with triple backticks syntax)', () => {
				mount(NcRichText, {
					props: {
						text: 'normal text ```inline code``` normal text',
						useMarkdown: true,
					},
				})

				cy.get('code').should('have.text', 'inline code')
			})

			it('inline code (several in line )', () => {
				const outputs = ['inline code 1', 'inline code 2']
				mount(NcRichText, {
					props: {
						text: 'normal text `inline code 1`normal text ``inline code 2`` normal text',
						useMarkdown: true,
					},
				})

				cy.get('code').each((item, index, list) => {
					expect(list).have.length(2)
					expect(item).have.text(outputs[index])
				})
			})

			it('inline code (between normal texts)', () => {
				mount(NcRichText, {
					props: {
						text: 'text`inline code`text',
						useMarkdown: true,
					},
				})

				cy.get('code').should('have.text', 'inline code')
			})

			it('inline code (with ignored bold, italic, XML-like syntax))', () => {
				mount(NcRichText, {
					props: {
						text: '`inline code **bold text** _italic text_ <span>text&lt;/span&gt;`',
						useMarkdown: true,
					},
				})

				cy.get('code').should('have.text', 'inline code **bold text** _italic text_ <span>text</span>')
			})
		})

		describe('multiline code', () => {
			it('multiline code (with triple backticks syntax)', () => {
				mount(NcRichText, {
					props: {
						text: '```\nmultiline code\n```',
						useMarkdown: true,
					},
				})

				cy.get('pre').should('have.text', 'multiline code\n')
			})

			it('multiline code (ignored info)', () => {
				mount(NcRichText, {
					props: {
						text: '```vue\nmultiline code\n```',
						useMarkdown: true,
					},
				})

				cy.get('pre').should('have.text', 'multiline code\n')
			})

			it('empty multiline code', () => {
				mount(NcRichText, {
					props: {
						text: '``````',
						useMarkdown: true,
					},
				})

				cy.get('pre').should('have.text', '')
			})

			it('empty multiline code (with new line)', () => {
				mount(NcRichText, {
					props: {
						text: '```\n```',
						useMarkdown: true,
					},
				})

				cy.get('pre').should('have.text', '')
			})

			it('multiline code (with several lines)', () => {
				mount(NcRichText, {
					props: {
						text: '```\nline 1\nline 2\nline 3\n```',
						useMarkdown: true,
					},
				})

				cy.get('pre').should('have.text', 'line 1\nline 2\nline 3\n')
				cy.get('code').should('have.text', 'line 1\nline 2\nline 3\n')
			})

			it('multiline code (with ignored bold, italic, inline code, XML-like syntax)', () => {
				mount(NcRichText, {
					props: {
						text: '```\n**bold text**\n_italic text_\n`inline code`\n<span>text&lt;/span&gt;\n```',
						useMarkdown: true,
					},
				})

				cy.get('pre').should('have.text', '**bold text**\n_italic text_\n`inline code`\n<span>text</span>\n')
			})
		})

		describe('blockquote', () => {
			it('blockquote (with greater then (>) syntax - normal)', () => {
				mount(NcRichText, {
					props: {
						text: '> blockquote',
						useMarkdown: true,
					},
				})

				cy.get('blockquote').should('have.text', '\nblockquote\n')
			})

			it('blockquote (with greater then (&gt;) syntax - escaped)', () => {
				mount(NcRichText, {
					props: {
						text: '&gt; blockquote',
						useMarkdown: true,
					},
				})

				cy.get('blockquote').should('have.text', '\nblockquote\n')
			})

			it('blockquote (with bold, italic text, inline code)', () => {
				mount(NcRichText, {
					props: {
						text: '> blockquote **bold text** _italic text_ `inline code`',
						useMarkdown: true,
					},
				})

				cy.get('blockquote').should('have.text', '\nblockquote bold text italic text inline code\n')
				cy.get('strong').should('have.text', 'bold text')
				cy.get('em').should('have.text', 'italic text')
				cy.get('code').should('have.text', 'inline code')
			})

			it('blockquote (with several lines)', () => {
				mount(NcRichText, {
					props: {
						text: '> line 1\nline 2\n line 3',
						useMarkdown: true,
					},
				})

				cy.get('blockquote').should('have.text', '\nline 1\nline 2\nline 3\n')
			})

			it('blockquote (divided from normal text)', () => {
				mount(NcRichText, {
					props: {
						text: 'normal text\n> line 1\nline 2\n\nnormal text',
						useMarkdown: true,
					},
				})

				cy.get('blockquote').should('have.text', '\nline 1\nline 2\n')
			})

			it('blockquote (with several paragraphs)', () => {
				mount(NcRichText, {
					props: {
						text: '> line 1\n>\n> line 3',
						useMarkdown: true,
					},
				})

				cy.get('blockquote').should('have.text', '\nline 1\nline 3\n')
			})

			it('blockquote (with nested blockquote)', () => {
				mount(NcRichText, {
					props: {
						text: '> blockquote\n>\n>> nested blockquote',
						useMarkdown: true,
					},
				})

				cy.get('blockquote').children('blockquote').should('have.text', '\nnested blockquote\n')
			})
		})

		describe('lists', () => {
			it('ordered list (with number + `.` syntax divided with space from text)', () => {
				const testCases = [
					{ input: '1. item 1', output: 'item 1' },
					{ input: '2. item 2', output: 'item 2' },
					{ input: '3. item 3', output: 'item 3' },
				]

				mount(NcRichText, {
					props: {
						text: testCases.map(i => i.input).join('\n'),
						useMarkdown: true,
					},
				})

				cy.get('ol').should('exist')
				cy.get('li').each((item, index, list) => {
					expect(list).have.length(testCases.length)
					expect(item).have.text(testCases[index].output)
				})
			})

			it('unordered list (with unite syntax divided with space from text)', () => {
				const testCases = [
					{ input: '* item 1', output: 'item 1' },
					{ input: '* item 2', output: 'item 2' },
					{ input: '* item 3', output: 'item 3' },
				]

				mount(NcRichText, {
					props: {
						text: testCases.map(i => i.input).join('\n'),
						useMarkdown: true,
					},
				})

				cy.get('ul').should('exist')
				cy.get('li').each((item, index, list) => {
					expect(list).have.length(testCases.length)
					expect(item).have.text(testCases[index].output)
				})
			})

			it('unordered lists (with different syntax divided with space from text)', () => {
				const testCases = [
					{ input: '* item 1', output: 'item 1' },
					{ input: '+ item 2', output: 'item 2' },
					{ input: '- item 3', output: 'item 3' },
				]

				mount(NcRichText, {
					props: {
						text: testCases.map(i => i.input).join('\n'),
						useMarkdown: true,
					},
				})

				cy.get('ul').each((item, index, list) => {
					expect(list).have.length(testCases.length)
					expect(item).have.text('\n' + testCases[index].output + '\n')
				})
			})
		})

		describe('dividers', () => {
			it('dividers (with different syntax)', () => {
				mount(NcRichText, {
					props: {
						text: '***\n---\n___',
						useMarkdown: true,
					},
				})

				cy.get('hr').should('have.length', 3)
			})
		})
	})
})
