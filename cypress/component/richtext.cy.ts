/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// Markdown guide: https://www.markdownguide.org/basic-syntax/
// Reference tests: https://github.com/nextcloud-deps/CDMarkdownKit/tree/master/CDMarkdownKitTests

import { mount } from 'cypress/vue2'
import NcRichText from '../../src/components/NcRichText/NcRichText.vue'

describe('NcRichText', () => {
	describe('XML-like text (escaped and unescaped)', () => {
		const TEST = '<span>text</span> &lt;span&gt;text&lt;/span&gt;'
		it('renders normal text as passed', () => {
			mount(NcRichText, {
				propsData: {
					text: TEST,
				},
			})
			cy.get('div.rich-text--wrapper').should('have.text', TEST)
		})
		it('renders with Markdown, escaping XML', () => {
			mount(NcRichText, {
				propsData: {
					text: TEST,
					useMarkdown: true,
				},
			})
			cy.get('p').should('have.text', '<span>text</span> <span>text</span>')
		})
		it('renders with Markdown, escaping XML in code', () => {
			mount(NcRichText, {
				propsData: {
					text: '```\n' + TEST + '\n```',
					useMarkdown: true,
				},
			})
			cy.get('code').should('have.text', '<span>text</span> <span>text</span>' + '\n')
		})
		it('renders with Flavored Markdown, escaping XML', () => {
			mount(NcRichText, {
				propsData: {
					text: TEST,
					useExtendedMarkdown: true,
				},
			})
			cy.get('p').should('have.text', '<span>text</span> <span>text</span>')
		})
		it('renders with Flavored Markdown, escaping XML in code', () => {
			mount(NcRichText, {
				propsData: {
					text: '```\n' + TEST + '\n```',
					useExtendedMarkdown: true,
				},
			})
			cy.get('code').should('have.text', '<span>text</span> <span>text</span>' + '\n')
		})
	})

	describe('renders with markdown', () => {
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
					propsData: {
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
					propsData: {
						text: '#heading',
						useMarkdown: true,
					},
				})

				cy.get('h1').should('not.exist')
			})

			it('heading 1 (with equal (=) syntax on the next line)', () => {
				mount(NcRichText, {
					propsData: {
						text: 'heading 1\n==',
						useMarkdown: true,
					},
				})

				cy.get('h1').should('have.text', 'heading 1')
			})

			it('heading 2 (with dash (-) syntax on the next line)', () => {
				mount(NcRichText, {
					propsData: {
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
					propsData: {
						text: '**bold asterisk**',
						useMarkdown: true,
					},
				})

				cy.get('strong').should('have.text', 'bold asterisk')
			})

			it('bold text (single with underscore syntax)', () => {
				mount(NcRichText, {
					propsData: {
						text: '__bold underscore__',
						useMarkdown: true,
					},
				})

				cy.get('strong').should('have.text', 'bold underscore')
			})

			it('bold text (several in line with different syntax)', () => {
				const outputs = ['bold underscore', 'bold asterisk']
				mount(NcRichText, {
					propsData: {
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
					propsData: {
						text: 'text**bold**text',
						useMarkdown: true,
					},
				})

				cy.get('strong').should('have.text', 'bold')
			})

			it('ignored bold text (between normal texts with underscore syntax)', () => {
				mount(NcRichText, {
					propsData: {
						text: 'text__bold__text',
						useMarkdown: true,
					},
				})

				cy.get('strong').should('not.exist')
			})

			it('normal text (between bold texts with asterisk syntax)', () => {
				const outputs = ['bold asterisk', 'bold asterisk']
				mount(NcRichText, {
					propsData: {
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
					propsData: {
						text: '*italic asterisk*',
						useMarkdown: true,
					},
				})

				cy.get('em').should('have.text', 'italic asterisk')
			})

			it('italic text (single with underscore syntax)', () => {
				mount(NcRichText, {
					propsData: {
						text: '_italic underscore_',
						useMarkdown: true,
					},
				})

				cy.get('em').should('have.text', 'italic underscore')
			})

			it('italic text (several in line with different syntax)', () => {
				const outputs = ['italic underscore', 'italic asterisk']
				mount(NcRichText, {
					propsData: {
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
					propsData: {
						text: 'text*italic*text',
						useMarkdown: true,
					},
				})

				cy.get('em').should('have.text', 'italic')
			})

			it('ignored italic text (between normal texts with underscore syntax)', () => {
				mount(NcRichText, {
					propsData: {
						text: 'text_italic_text',
						useMarkdown: true,
					},
				})

				cy.get('em').should('not.exist')
			})

			it('normal text (between italic texts with asterisk syntax)', () => {
				const outputs = ['italic asterisk', 'italic asterisk']
				mount(NcRichText, {
					propsData: {
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

		describe('strikethrough text', () => {
			it('strikethrough text (with single tilda syntax)', () => {
				mount(NcRichText, {
					propsData: {
						text: '~strikethrough single~',
						useExtendedMarkdown: true,
					},
				})

				cy.get('del').should('have.text', 'strikethrough single')
			})

			it('strikethrough text (with double tilda syntax)', () => {
				mount(NcRichText, {
					propsData: {
						text: '~~strikethrough double~~',
						useExtendedMarkdown: true,
					},
				})

				cy.get('del').should('have.text', 'strikethrough double')
			})

			it('strikethrough text (several in line with different syntax)', () => {
				const outputs = ['strikethrough single', 'strikethrough double']
				mount(NcRichText, {
					propsData: {
						text: 'normal text ~strikethrough single~ normal text ~~strikethrough double~~ normal text',
						useExtendedMarkdown: true,
					},
				})

				cy.get('del').should('have.length', 2)
				cy.get('del').each((item, index) => {
					expect(item).have.text(outputs[index])
				})
			})

			it('strikethrough text (between normal texts with different syntax)', () => {
				mount(NcRichText, {
					propsData: {
						text: 'text~strikethrough~text~~strikethrough~~text',
						useExtendedMarkdown: true,
					},
				})

				cy.get('del').should('have.length', 2)
				cy.get('del').each((item) => {
					expect(item).have.text('strikethrough')
				})
			})
		})

		describe('inline code', () => {
			it('inline code (single with backticks syntax)', () => {
				mount(NcRichText, {
					propsData: {
						text: 'normal text `inline code` normal text',
						useMarkdown: true,
					},
				})

				cy.get('code').should('have.text', 'inline code')
			})

			it('inline code (single with double backticks syntax)', () => {
				mount(NcRichText, {
					propsData: {
						text: 'normal text ``inline code`` normal text',
						useMarkdown: true,
					},
				})

				cy.get('code').should('have.text', 'inline code')
			})

			it('inline code (single with triple backticks syntax)', () => {
				mount(NcRichText, {
					propsData: {
						text: 'normal text ```inline code``` normal text',
						useMarkdown: true,
					},
				})

				cy.get('code').should('have.text', 'inline code')
			})

			it('inline code (several in line )', () => {
				const outputs = ['inline code 1', 'inline code 2']
				mount(NcRichText, {
					propsData: {
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
					propsData: {
						text: 'text`inline code`text',
						useMarkdown: true,
					},
				})

				cy.get('code').should('have.text', 'inline code')
			})

			it('inline code (with ignored bold, italic, XML-like syntax))', () => {
				mount(NcRichText, {
					propsData: {
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
					propsData: {
						text: '```\nmultiline code\n```',
						useMarkdown: true,
					},
				})

				cy.get('pre').should('have.text', 'multiline code\n')
			})

			it('multiline code (ignored info)', () => {
				mount(NcRichText, {
					propsData: {
						text: '```vue\nmultiline code\n```',
						useMarkdown: true,
					},
				})

				cy.get('pre').should('have.text', 'multiline code\n')
			})

			it('empty multiline code', () => {
				mount(NcRichText, {
					propsData: {
						text: '``````',
						useMarkdown: true,
					},
				})

				cy.get('pre').should('have.text', '')
			})

			it('empty multiline code (with new line)', () => {
				mount(NcRichText, {
					propsData: {
						text: '```\n```',
						useMarkdown: true,
					},
				})

				cy.get('pre').should('have.text', '')
			})

			it('multiline code (with several lines)', () => {
				mount(NcRichText, {
					propsData: {
						text: '```\nline 1\nline 2\nline 3\n```',
						useMarkdown: true,
					},
				})

				cy.get('pre').should('have.text', 'line 1\nline 2\nline 3\n')
				cy.get('code').should('have.text', 'line 1\nline 2\nline 3\n')
			})

			it('multiline code (with ignored bold, italic, inline code, XML-like syntax)', () => {
				mount(NcRichText, {
					propsData: {
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
					propsData: {
						text: '> blockquote',
						useMarkdown: true,
					},
				})

				cy.get('blockquote').should('have.text', '\nblockquote\n')
			})

			it('blockquote (with greater then (&gt;) syntax - escaped)', () => {
				mount(NcRichText, {
					propsData: {
						text: '&gt; blockquote',
						useMarkdown: true,
					},
				})

				cy.get('blockquote').should('have.text', '\nblockquote\n')
			})

			it('blockquote (with bold, italic text, inline code)', () => {
				mount(NcRichText, {
					propsData: {
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
					propsData: {
						text: '> line 1\nline 2\n line 3',
						useMarkdown: true,
					},
				})

				cy.get('blockquote').should('have.text', '\nline 1\nline 2\nline 3\n')
			})

			it('blockquote (divided from normal text)', () => {
				mount(NcRichText, {
					propsData: {
						text: 'normal text\n> line 1\nline 2\n\nnormal text',
						useMarkdown: true,
					},
				})

				cy.get('blockquote').should('have.text', '\nline 1\nline 2\n')
			})

			it('blockquote (with several paragraphs)', () => {
				mount(NcRichText, {
					propsData: {
						text: '> line 1\n>\n> line 3',
						useMarkdown: true,
					},
				})

				cy.get('blockquote').should('have.text', '\nline 1\nline 3\n')
			})

			it('blockquote (with nested blockquote)', () => {
				mount(NcRichText, {
					propsData: {
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
					propsData: {
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
					propsData: {
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
					propsData: {
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

		describe('task lists', () => {
			it('task list (with `- [ ]` and `- [x]` syntax divided with space from text)', () => {
				const testCases = [
					{ input: '- [ ] item 1', output: 'item 1', checked: false },
					{ input: '- [x] item 2', output: 'item 2', checked: true },
					{ input: '- [ ] item 3', output: 'item 3', checked: false },
				]

				mount(NcRichText, {
					propsData: {
						text: testCases.map(i => i.input).join('\n'),
						useExtendedMarkdown: true,
					},
				})

				cy.get('ul').should('exist')
				cy.get('li').should('have.length', testCases.length)
				cy.get('li').each((item, index) => {
					// Vue 2.7 renders three non-breaking spaces here for some reason
					expect(item).contain(testCases[index].output)
				})
				cy.get('input:checked').should('have.length', testCases.filter(test => test.checked).length)
			})
		})

		describe('tables', () => {
			it('table (with `-- | --` syntax)', () => {
				mount(NcRichText, {
					propsData: {
						text: 'Table | Column A | Column B\n-- | -- | --\nRow 1 | Value A1 | Value B1\nRow 2 | Value A2 | Value B2',
						useExtendedMarkdown: true,
					},
				})

				cy.get('table').should('exist')
				cy.get('thead').should('exist')
				cy.get('tbody').should('exist')
				cy.get('tr').should('have.length', 3)
				cy.get('th').should('have.length', 3)
				cy.get('td').should('have.length', 6)
			})
		})

		describe('dividers', () => {
			it('dividers (with different syntax)', () => {
				mount(NcRichText, {
					propsData: {
						text: '***\n---\n___',
						useMarkdown: true,
					},
				})

				cy.get('hr').should('have.length', 3)
			})
		})
	})
})
