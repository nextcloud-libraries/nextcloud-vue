/**
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// Markdown guide: https://www.markdownguide.org/basic-syntax/
// Reference tests: https://github.com/nextcloud-deps/CDMarkdownKit/tree/master/CDMarkdownKitTests

import { expect, test } from '@playwright/experimental-ct-vue'
import NcRichText from '../../../../src/components/NcRichText/NcRichText.vue'

test.describe('XML-like text (escaped and unescaped)', () => {
	const TEST = '<span>text</span> &lt;span&gt;text&lt;/span&gt;'
	test('renders normal text as passed', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: TEST,
			},
		})
		await expect(component.getByText(TEST)).toBeVisible()
	})
	test('renders with Markdown, escaping XML', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: TEST,
				useMarkdown: true,
			},
		})
		await expect(component.getByRole('paragraph')).toContainText('<span>text</span> <span>text</span>')
	})
	test('renders with Markdown, escaping XML in code', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '```\n' + TEST + '\n```',
				useMarkdown: true,
			},
		})
		await expect(component.getByRole('code')).toContainText('<span>text</span> <span>text</span>' + '\n')
	})
	test('renders with Flavored Markdown, escaping XML', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: TEST,
				useExtendedMarkdown: true,
			},
		})
		await expect(component.getByRole('paragraph')).toContainText('<span>text</span> <span>text</span>')
	})
	test('renders with Flavored Markdown, escaping XML in code', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '```\n' + TEST + '\n```',
				useExtendedMarkdown: true,
			},
		})
		await expect(component.getByRole('code')).toContainText('<span>text</span> <span>text</span>' + '\n')
	})
})

test.describe('dividers', () => {
	test('dividers with asterisks', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'First\n\n***\n\nsecond',
				useMarkdown: true,
			},
		})

		expect(await component.locator('hr').all()).toHaveLength(1)
	})

	test('dividers with dashes', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'First\n\n---\n\nsecond',
				useMarkdown: true,
			},
		})

		expect(await component.locator('hr').all()).toHaveLength(1)
	})

	test('dividers with underlines', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'First\n\n___\n\nsecond',
				useMarkdown: true,
			},
		})

		expect(await component.locator('hr').all()).toHaveLength(1)
	})
})

test.describe('headings', () => {
	test('heading (with hash (#) syntax divided with space from text)', async ({ mount }) => {
		const testCases = [
			{ tag: 'h1', input: '# heading 1', output: 'heading 1' },
			{ tag: 'h2', input: '## heading 2', output: 'heading 2' },
			{ tag: 'h3', input: '### heading 3', output: 'heading 3' },
			{ tag: 'h4', input: '#### heading 4', output: 'heading 4' },
			{ tag: 'h5', input: '##### heading 5', output: 'heading 5' },
			{ tag: 'h6', input: '###### heading 6', output: 'heading 6' },
		]

		const component = await mount(NcRichText, {
			props: {
				text: testCases.map(i => i.input).join('\n'),
				useMarkdown: true,
			},
		})

		await expect(component.getByRole('heading', { level: 1 })).toHaveText('heading 1')
		await expect(component.getByRole('heading', { level: 2 })).toHaveText('heading 2')
		await expect(component.getByRole('heading', { level: 3 })).toHaveText('heading 3')
		await expect(component.getByRole('heading', { level: 4 })).toHaveText('heading 4')
		await expect(component.getByRole('heading', { level: 5 })).toHaveText('heading 5')
		await expect(component.getByRole('heading', { level: 6 })).toHaveText('heading 6')
	})

	test('ignore heading (with hash (#) syntax padded to the text)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '#heading',
				useMarkdown: true,
			},
		})

		await expect(component.getByRole('heading', { level: 1 })).toHaveCount(0)
		await expect(component.getByText('#heading')).toBeVisible()
	})

	test('render heading 1 (with equal (=) syntax on the next line)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'heading 1\n==',
				useMarkdown: true,
			},
		})

		await expect(component.getByRole('heading', { level: 1 })).toHaveText('heading 1')
	})

	test('render heading 2 (with dash (-) syntax on the next line)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'heading 2\n--',
				useMarkdown: true,
			},
		})

		await expect(component.getByRole('heading', { level: 2 })).toHaveText('heading 2')
	})
})

test.describe('bold text', () => {
	test('bold text (single with asterisk syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '**bold asterisk**',
				useMarkdown: true,
			},
		})

		await expect(component.getByRole('strong')).toHaveText('bold asterisk')
	})

	test('bold text (single with underscore syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '__bold underscore__',
				useMarkdown: true,
			},
		})

		await expect(component.getByRole('strong')).toHaveText('bold underscore')
	})

	test('bold text (several in line with different syntax)', async ({ mount }) => {
		const outputs = ['bold underscore', 'bold asterisk']
		const component = await mount(NcRichText, {
			props: {
				text: 'normal text __bold underscore__ normal text **bold asterisk** normal text',
				useMarkdown: true,
			},
		})

		await expect(component.getByRole('strong')).toHaveCount(2)
		expect(await component.getByRole('strong').allInnerTexts()).toEqual(outputs)
	})

	test('bold text (between normal texts with asterisk syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'text**bold**text',
				useMarkdown: true,
			},
		})

		await expect(component).toHaveText('textboldtext')
		await expect(component.getByRole('strong')).toHaveText('bold')
	})

	test('ignored bold text (between normal texts with underscore syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'text__bold__text',
				useMarkdown: true,
			},
		})

		await expect(component).toHaveText('text__bold__text')
		await expect(component.getByRole('strong')).toHaveCount(0)
	})

	test('normal text (between bold texts with asterisk syntax)', async ({ mount }) => {
		const outputs = ['bold asterisk', 'bold asterisk']
		const component = await mount(NcRichText, {
			props: {
				text: '**bold asterisk**normal text**bold asterisk**',
				useMarkdown: true,
			},
		})

		await expect(component.getByRole('strong')).toHaveCount(2)
		expect(await component.getByRole('strong').allInnerTexts()).toEqual(outputs)
	})
})

test.describe('italic text', () => {
	test('italic text (single with asterisk syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '*italic asterisk*',
				useMarkdown: true,
			},
		})

		await expect(component.locator('em')).toHaveText('italic asterisk')
	})

	test('italic text (single with underscore syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '_italic underscore_',
				useMarkdown: true,
			},
		})

		await expect(component.locator('em')).toHaveText('italic underscore')
	})

	test('italic text (several in line with different syntax)', async ({ mount }) => {
		const outputs = ['italic underscore', 'italic asterisk']
		const component = await mount(NcRichText, {
			props: {
				text: 'normal text _italic underscore_ normal text *italic asterisk* normal text',
				useMarkdown: true,
			},
		})

		expect(await component.locator('em').count()).toBe(2)
		expect(await component.locator('em').allInnerTexts()).toEqual(outputs)
	})

	test('italic text (between normal texts with asterisk syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'text*italic*text',
				useMarkdown: true,
			},
		})

		await expect(component.locator('em')).toHaveText('italic')
	})

	test('ignored italic text (between normal texts with underscore syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'text_italic_text',
				useMarkdown: true,
			},
		})

		await expect(component.getByText('text_italic_text')).toBeVisible()
		await expect(component.locator('em')).toHaveCount(0)
	})

	test('normal text (between italic texts with asterisk syntax)', async ({ mount }) => {
		const outputs = ['italic asterisk', 'italic asterisk']
		const component = await mount(NcRichText, {
			props: {
				text: '*italic asterisk*normal text*italic asterisk*',
				useMarkdown: true,
			},
		})

		expect(await component.locator('em').count()).toBe(2)
		expect(await component.locator('em').allInnerTexts()).toEqual(outputs)
	})
})

test.describe('strikethrough text', () => {
	test('strikethrough text (with single tilda syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '~strikethrough single~',
				useExtendedMarkdown: true,
			},
		})

		await expect(component.locator('del')).toHaveText('strikethrough single')
	})

	test('strikethrough text (with double tilda syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '~~strikethrough double~~',
				useExtendedMarkdown: true,
			},
		})

		await expect(component.locator('del')).toHaveText('strikethrough double')
	})

	test('strikethrough text (several in line with different syntax)', async ({ mount }) => {
		const outputs = ['strikethrough single', 'strikethrough double']
		const component = await mount(NcRichText, {
			props: {
				text: 'normal text ~strikethrough single~ normal text ~~strikethrough double~~ normal text',
				useExtendedMarkdown: true,
			},
		})

		await expect(component.locator('del')).toHaveCount(2)
		expect(await component.locator('del').allInnerTexts()).toEqual(outputs)
	})

	test('strikethrough text (between normal texts with different syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'text~strikethrough~text~~strikethrough~~text',
				useExtendedMarkdown: true,
			},
		})

		await expect(component.locator('del')).toHaveCount(2)
		expect(await component.locator('del').allInnerTexts()).toEqual(['strikethrough', 'strikethrough'])
	})
})

test.describe('inline code', () => {
	test('inline code (single with backticks syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'normal text `inline code` normal text',
				useMarkdown: true,
			},
		})

		await expect(component.locator('code')).toHaveText('inline code')
	})

	test('inline code (single with double backticks syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'normal text ``inline code`` normal text',
				useMarkdown: true,
			},
		})

		await expect(component.locator('code')).toHaveText('inline code')
	})

	test('inline code (single with triple backticks syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'normal text ```inline code``` normal text',
				useMarkdown: true,
			},
		})

		await expect(component.locator('code')).toHaveText('inline code')
	})

	test('inline code (several in line )', async ({ mount }) => {
		const outputs = ['inline code 1', 'inline code 2']
		const component = await mount(NcRichText, {
			props: {
				text: 'normal text `inline code 1`normal text ``inline code 2`` normal text',
				useMarkdown: true,
			},
		})

		expect(await component.locator('code').count()).toBe(2)
		expect(await component.locator('code').allInnerTexts()).toEqual(outputs)
	})

	test('inline code (between normal texts)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'text`inline code`text',
				useMarkdown: true,
			},
		})

		await expect(component.locator('code')).toHaveText('inline code')
	})

	test('inline code (with ignored bold, italic, XML-like syntax))', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '`inline code **bold text** _italic text_ <span>text&lt;/span&gt;`',
				useMarkdown: true,
			},
		})

		await expect(component.locator('code')).toHaveText('inline code **bold text** _italic text_ <span>text</span>')
	})
})

test.describe('multiline code', () => {
	test('multiline code (with triple backticks syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '```\nmultiline code\n```',
				useMarkdown: true,
			},
		})

		await expect(component.locator('pre')).toHaveText('multiline code\n')
	})

	test('multiline code (ignored info)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '```vue\nmultiline code\n```',
				useMarkdown: true,
			},
		})

		await expect(component.locator('pre')).toHaveText('multiline code\n')
	})

	test('empty multiline code', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '``````',
				useMarkdown: true,
			},
		})

		await expect(component.locator('pre')).toBeEmpty()
	})

	test('empty multiline code (with new line)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '```\n```',
				useMarkdown: true,
			},
		})

		await expect(component.locator('pre')).toBeEmpty()
	})

	test('multiline code (with several lines)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '```\nline 1\nline 2\nline 3\n```',
				useMarkdown: true,
			},
		})

		await expect(component.locator('pre')).toHaveText('line 1\nline 2\nline 3\n')
		await expect(component.locator('code')).toHaveText('line 1\nline 2\nline 3\n')
	})

	test('multiline code (with ignored bold, italic, inline code, XML-like syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '```\n**bold text**\n_italic text_\n`inline code`\n<span>text&lt;/span&gt;\n```',
				useMarkdown: true,
			},
		})

		await expect(component.locator('pre')).toHaveText('**bold text**\n_italic text_\n`inline code`\n<span>text</span>\n')
	})
})

test.describe('blockquote', () => {
	test('blockquote (with greater then (>) syntax - normal)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '> blockquote',
				useMarkdown: true,
			},
		})

		await expect(component.locator('blockquote')).toHaveText('\nblockquote\n')
	})

	test('blockquote (with greater then (&gt;) syntax - escaped)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '&gt; blockquote',
				useMarkdown: true,
			},
		})

		await expect(component.locator('blockquote')).toHaveText('\nblockquote\n')
	})

	test('blockquote (with bold, italic text, inline code)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '> blockquote **bold text** _italic text_ `inline code`',
				useMarkdown: true,
			},
		})

		await expect(component.locator('blockquote')).toHaveText('\nblockquote bold text italic text inline code\n')
		await expect(component.locator('strong')).toHaveText('bold text')
		await expect(component.locator('em')).toHaveText('italic text')
		await expect(component.locator('code')).toHaveText('inline code')
	})

	test('blockquote (with several lines)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '> line 1\nline 2\n line 3',
				useMarkdown: true,
			},
		})

		await expect(component.locator('blockquote')).toHaveText('\nline 1\nline 2\nline 3\n')
	})

	test('blockquote (divided from normal text)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'normal text\n> line 1\nline 2\n\nnormal text',
				useMarkdown: true,
			},
		})

		await expect(component.locator('blockquote')).toHaveText('\nline 1\nline 2\n')
	})

	test('blockquote (with several paragraphs)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '> line 1\n>\n> line 3',
				useMarkdown: true,
			},
		})

		await expect(component.locator('blockquote')).toHaveText('\nline 1\nline 3\n')
	})

	test('blockquote (with nested blockquote)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: '> blockquote\n>\n>> nested blockquote',
				useMarkdown: true,
			},
		})

		await expect(component.locator('blockquote blockquote')).toHaveText('nested blockquote')
	})
})

test.describe('lists', () => {
	test('ordered list (with number + `.` syntax divided with space from text)', async ({ mount }) => {
		const testCases = [
			{ input: '1. item 1', output: 'item 1' },
			{ input: '2. item 2', output: 'item 2' },
			{ input: '3. item 3', output: 'item 3' },
		]

		const component = await mount(NcRichText, {
			props: {
				text: testCases.map(i => i.input).join('\n'),
				useMarkdown: true,
			},
		})

		await expect(component.getByRole('list')).toBeVisible()
		await expect(component.locator('ol')).toHaveCount(1)
		await expect(component.getByRole('listitem')).toHaveText(testCases.map(({ output }) => output))
	})

	test('unordered list (with unite syntax divided with space from text)', async ({ mount }) => {
		const testCases = [
			{ input: '* item 1', output: 'item 1' },
			{ input: '* item 2', output: 'item 2' },
			{ input: '* item 3', output: 'item 3' },
		]

		const component = await mount(NcRichText, {
			props: {
				text: testCases.map(i => i.input).join('\n'),
				useMarkdown: true,
			},
		})

		await expect(component.getByRole('list')).toBeVisible()
		await expect(component.locator('ul')).toHaveCount(1)
		await expect(component.getByRole('listitem')).toHaveText(testCases.map(({ output }) => output))
	})

	test('unordered lists (with different syntax divided with space from text)', async ({ mount }) => {
		const testCases = [
			{ input: '* item 1', output: 'item 1' },
			{ input: '+ item 2', output: 'item 2' },
			{ input: '- item 3', output: 'item 3' },
		]

		const component = await mount(NcRichText, {
			props: {
				text: testCases.map(i => i.input).join('\n'),
				useMarkdown: true,
			},
		})

		await expect(component.getByRole('list')).toHaveCount(testCases.length)
		await expect(component.getByRole('listitem')).toHaveText(testCases.map(({ output }) => output))
	})
})

test.describe('task lists', () => {
	test('task list (with `- [ ]` and `- [x]` syntax divided with space from text)', async ({ mount }) => {
		const testCases = [
			{ input: '- [ ] item 1', output: 'item 1', checked: false },
			{ input: '- [x] item 2', output: 'item 2', checked: true },
			{ input: '- [ ] item 3', output: 'item 3', checked: false },
		]

		const component = await mount(NcRichText, {
			props: {
				text: testCases.map(i => i.input).join('\n'),
				useExtendedMarkdown: true,
			},
		})

		await expect(component.getByRole('list')).toBeVisible()
		await expect(component.locator('ul')).toHaveCount(1)
		await expect(component.getByRole('listitem')).toHaveCount(testCases.length)

		for (const [index, testcase] of testCases.entries()) {
			await expect(component.getByRole('listitem').nth(index)).toHaveText(testcase.output)
			await expect(component.getByRole('listitem').nth(index).getByRole('checkbox')).toBeChecked({ checked: testcase.checked })
		}
	})
})

test.describe('tables', () => {
	test('table (with `-- | --` syntax)', async ({ mount }) => {
		const component = await mount(NcRichText, {
			props: {
				text: 'Table | Column A | Column B\n-- | -- | --\nRow 1 | Value A1 | Value B1\nRow 2 | Value A2 | Value B2',
				useExtendedMarkdown: true,
			},
		})

		await expect(component.getByRole('table')).toBeVisible()
		await expect(component.locator('thead')).toHaveCount(1)
		await expect(component.locator('tbody')).toHaveCount(1)

		await expect(component.locator('th')).toHaveCount(3)
		await expect(component.locator('tr')).toHaveCount(3)
		await expect(component.locator('td')).toHaveCount(6)
	})
})
