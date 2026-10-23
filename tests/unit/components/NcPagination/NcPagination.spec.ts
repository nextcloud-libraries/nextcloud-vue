/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter, RouterLink } from 'vue-router'
import NcPagination from '../../../../src/components/NcPagination/NcPagination.vue'
import NcSelect from '../../../../src/components/NcSelect/NcSelect.vue'

/**
 * The labels of the numbered page buttons and ellipses, in order.
 *
 * @param wrapper - The mounted pagination
 */
function pageItems(wrapper: ReturnType<typeof mount>) {
	return wrapper.findAll('nav > div > ul > li').map((item) => item.text())
}

describe('NcPagination', () => {
	it('renders a labeled navigation landmark', () => {
		const wrapper = mount(NcPagination, { props: { totalItems: 100 } })
		expect(wrapper.element.tagName).toBe('NAV')
		expect(wrapper.attributes('aria-label')).toBe('Pagination')
	})

	it('shows the current page and the number of pages', () => {
		const wrapper = mount(NcPagination, { props: { totalItems: 95, page: 2, pageSize: 10 } })
		expect(wrapper.get('nav > span').text()).toBe('Page 2 of 10')
	})

	it('hides the page buttons when everything fits on one page', () => {
		const wrapper = mount(NcPagination, { props: { totalItems: 5, pageSize: 10 } })
		expect(wrapper.find('button[aria-label="Next page"]').exists()).toBe(false)
		expect(wrapper.get('nav > span').text()).toBe('Page 1 of 1')
	})

	it('shows every page when there are at most seven', () => {
		const wrapper = mount(NcPagination, { props: { totalItems: 70, pageSize: 10 } })
		expect(pageItems(wrapper)).toEqual(['1', '2', '3', '4', '5', '6', '7'])
	})

	it.each([
		[1, 20, ['1', '2', '3', '4', '5', '…', '20']],
		[4, 20, ['1', '2', '3', '4', '5', '…', '20']],
		[5, 20, ['1', '…', '4', '5', '6', '…', '20']],
		[10, 20, ['1', '…', '9', '10', '11', '…', '20']],
		[16, 20, ['1', '…', '15', '16', '17', '…', '20']],
		[17, 20, ['1', '…', '16', '17', '18', '19', '20']],
		[20, 20, ['1', '…', '16', '17', '18', '19', '20']],
		[1, 8, ['1', '2', '3', '4', '5', '…', '8']],
		[4, 8, ['1', '2', '3', '4', '5', '…', '8']],
		[5, 8, ['1', '…', '4', '5', '6', '7', '8']],
	])('shortens the page range around page %i of %i', (page, pages, expected) => {
		const wrapper = mount(NcPagination, { props: { totalItems: pages * 10, pageSize: 10, page } })
		expect(pageItems(wrapper)).toEqual(expected)
	})

	it('hides the ellipses from assistive technology', () => {
		const wrapper = mount(NcPagination, { props: { totalItems: 200, pageSize: 10, page: 10 } })
		const items = wrapper.findAll('nav > div > ul > li')
		expect(items.filter((item) => item.attributes('aria-hidden') === 'true').map((item) => item.text())).toEqual(['…', '…'])
		expect(items[0].attributes('aria-hidden')).toBeUndefined()
	})

	it('marks the current page', () => {
		const wrapper = mount(NcPagination, { props: { totalItems: 50, pageSize: 10, page: 3 } })
		const current = wrapper.findAll('[aria-current="page"]')
		expect(current).toHaveLength(1)
		expect(current[0].text()).toBe('3')
		expect(current[0].attributes('aria-label')).toBe('Page 3')
	})

	it.each([
		['First page', 1],
		['Previous page', 4],
		['Next page', 6],
		['Last page', 10],
	])('moves to the right page with "%s"', async (label, expected) => {
		const wrapper = mount(NcPagination, { props: { totalItems: 100, pageSize: 10, page: 5 } })
		await wrapper.get(`button[aria-label="${label}"]`).trigger('click')
		expect(wrapper.emitted('update:page')).toEqual([[expected]])
	})

	it('moves to a page when its number is clicked', async () => {
		const wrapper = mount(NcPagination, { props: { totalItems: 50, pageSize: 10, page: 1 } })
		await wrapper.get('button[aria-label="Page 4"]').trigger('click')
		expect(wrapper.emitted('update:page')).toEqual([[4]])
	})

	it('does not emit when the current page is clicked', async () => {
		const wrapper = mount(NcPagination, { props: { totalItems: 50, pageSize: 10, page: 2 } })
		await wrapper.get('button[aria-label="Page 2"]').trigger('click')
		expect(wrapper.emitted('update:page')).toBeUndefined()
	})

	it('disables moving back on the first page and forward on the last page', async () => {
		const wrapper = mount(NcPagination, { props: { totalItems: 30, pageSize: 10, page: 1 } })
		expect(wrapper.get('button[aria-label="First page"]').attributes('disabled')).toBeDefined()
		expect(wrapper.get('button[aria-label="Previous page"]').attributes('disabled')).toBeDefined()
		expect(wrapper.get('button[aria-label="Next page"]').attributes('disabled')).toBeUndefined()

		await wrapper.setProps({ page: 3 })
		expect(wrapper.get('button[aria-label="Next page"]').attributes('disabled')).toBeDefined()
		expect(wrapper.get('button[aria-label="Last page"]').attributes('disabled')).toBeDefined()
		expect(wrapper.get('button[aria-label="Previous page"]').attributes('disabled')).toBeUndefined()
	})

	it('emits the new page size when another size is selected', async () => {
		const wrapper = mount(NcPagination, { props: { totalItems: 100, pageSize: 20 } })
		const select = wrapper.getComponent(NcSelect)
		expect(select.props('options')).toEqual([10, 20, 50, 100])
		expect(select.props('modelValue')).toBe(20)

		select.vm.$emit('update:modelValue', 50)
		expect(wrapper.emitted('update:pageSize')).toEqual([[50]])
	})

	it('hides the page size selector without page size options', () => {
		const wrapper = mount(NcPagination, { props: { totalItems: 100, pageSizeOptions: [] } })
		expect(wrapper.findComponent(NcSelect).exists()).toBe(false)
	})

	/**
	 * Mount the pagination with both values bound like v-model does.
	 *
	 * @param props - The initial props
	 * @param props.totalItems - The number of items
	 * @param props.pageSize - The page size
	 * @param props.page - The current page
	 */
	function mountBound(props: { totalItems: number, pageSize: number, page: number }) {
		// A page that does not exist is corrected while mounting, before `wrapper` is assigned
		const wrapper = mount(NcPagination, {
			props: {
				...props,
				'onUpdate:page': (page: number) => Promise.resolve().then(() => wrapper.setProps({ page })),
				'onUpdate:pageSize': (pageSize: number) => Promise.resolve().then(() => wrapper.setProps({ pageSize })),
			},
		})
		return wrapper
	}

	it('goes back to the first page when another page size is selected', async () => {
		const wrapper = mountBound({ totalItems: 237, pageSize: 10, page: 20 })
		wrapper.getComponent(NcSelect).vm.$emit('update:modelValue', 100)
		await flushPromises()
		expect(wrapper.emitted('update:pageSize')).toEqual([[100]])
		expect(wrapper.emitted('update:page')).toEqual([[1]])
	})

	it('moves to the last page when the current page no longer exists', async () => {
		const wrapper = mountBound({ totalItems: 237, pageSize: 10, page: 20 })
		await wrapper.setProps({ totalItems: 15 })
		await flushPromises()
		expect(wrapper.emitted('update:page')).toEqual([[2]])
	})

	it('keeps the current page while there are no items', async () => {
		const wrapper = mountBound({ totalItems: 237, pageSize: 10, page: 20 })
		await wrapper.setProps({ totalItems: 0 })
		await flushPromises()
		expect(wrapper.emitted('update:page')).toBeUndefined()
		expect(wrapper.get('nav > span').text()).toBe('Page 20 of 20')
	})

	it('moves to the last page when the items arrive after there were none', async () => {
		const wrapper = mountBound({ totalItems: 237, pageSize: 10, page: 20 })
		await wrapper.setProps({ totalItems: 0 })
		await flushPromises()
		await wrapper.setProps({ totalItems: 5 })
		await flushPromises()
		expect(wrapper.emitted('update:page')).toEqual([[1]])
		expect(wrapper.get('nav > span').text()).toBe('Page 1 of 1')
	})

	it('moves to the last page when mounted with a page that does not exist', async () => {
		const wrapper = mountBound({ totalItems: 100, pageSize: 10, page: 50 })
		await flushPromises()
		expect(wrapper.emitted('update:page')).toEqual([[10]])
		expect(wrapper.get('button[aria-label="Page 10"]').attributes('aria-current')).toBe('page')
	})

	it('keeps the current page when it still exists', async () => {
		const wrapper = mountBound({ totalItems: 237, pageSize: 10, page: 2 })
		await wrapper.setProps({ totalItems: 150 })
		await flushPromises()
		expect(wrapper.emitted('update:page')).toBeUndefined()
	})

	describe('keyboard focus', () => {
		afterEach(() => {
			document.body.innerHTML = ''
		})

		/**
		 * Mount the pagination in the document, with the page bound like v-model does.
		 *
		 * @param props - The initial props
		 */
		function mountFocusable(props: Record<string, unknown>) {
			const wrapper = mount(NcPagination, {
				attachTo: document.body,
				props: {
					...props,
					'onUpdate:page': (page: number) => wrapper.setProps({ page }),
				},
			})
			return wrapper
		}

		/**
		 * Click a button that has keyboard focus, and wait for the new page.
		 *
		 * @param wrapper - The mounted pagination
		 * @param label - The label of the button
		 */
		async function clickFocused(wrapper: ReturnType<typeof mount>, label: string) {
			const button = wrapper.get<HTMLButtonElement>(`button[aria-label="${label}"]`)
			button.element.focus()
			await button.trigger('click')
			await flushPromises()
		}

		it.each([
			['Next page', 2, 'Page 3'],
			['Last page', 1, 'Page 3'],
			['Previous page', 2, 'Page 1'],
			['First page', 3, 'Page 1'],
		])('moves to the current page when "%s" becomes disabled', async (label, page, expected) => {
			const wrapper = mountFocusable({ totalItems: 30, pageSize: 10, page })
			await clickFocused(wrapper, label)
			expect(document.activeElement?.getAttribute('aria-label')).toBe(expected)
		})

		it('keeps the focus on a button that stays enabled', async () => {
			const wrapper = mountFocusable({ totalItems: 50, pageSize: 10, page: 2 })
			await clickFocused(wrapper, 'Next page')
			expect(document.activeElement?.getAttribute('aria-label')).toBe('Next page')
		})

		it('moves to the other button in the compact layout', async () => {
			const wrapper = mountFocusable({ totalItems: 42, pageSize: 5, page: 8, compact: true })
			await clickFocused(wrapper, 'Next page')
			expect(document.activeElement?.getAttribute('aria-label')).toBe('Previous page')
		})
	})

	describe('pages as links', () => {
		it('renders the pages as links with "pageHref"', () => {
			const wrapper = mount(NcPagination, {
				props: { totalItems: 30, pageSize: 10, page: 2, pageHref: (page: number) => `?page=${page}` },
			})
			expect(wrapper.findAll('a').map((link) => [link.attributes('aria-label'), link.attributes('href')])).toEqual([
				['First page', '?page=1'],
				['Previous page', '?page=1'],
				['Page 1', '?page=1'],
				['Page 2', '?page=2'],
				['Page 3', '?page=3'],
				['Next page', '?page=3'],
				['Last page', '?page=3'],
			])
			expect(wrapper.get('a[aria-current="page"]').text()).toBe('2')
		})

		it('renders a disabled button without a link', () => {
			const wrapper = mount(NcPagination, {
				props: { totalItems: 30, pageSize: 10, page: 1, pageHref: (page: number) => `?page=${page}` },
			})
			for (const label of ['First page', 'Previous page']) {
				const button = wrapper.get(`[aria-label="${label}"]`)
				expect(button.element.tagName).toBe('BUTTON')
				expect(button.attributes('disabled')).toBeDefined()
				expect(button.attributes('href')).toBeUndefined()
			}
		})

		it('leaves the page to the URL when a link is clicked', async () => {
			const wrapper = mount(NcPagination, {
				props: { totalItems: 30, pageSize: 10, page: 1, pageHref: (page: number) => `#page=${page}` },
			})
			await wrapper.get('a[aria-label="Page 3"]').trigger('click')
			expect(wrapper.emitted('update:page')).toBeUndefined()
		})

		it('keeps working buttons with "pageTo" but without a router', async () => {
			const wrapper = mount(NcPagination, {
				props: { totalItems: 30, pageSize: 10, page: 1, pageTo: (page: number) => ({ query: { page } }) },
			})
			expect(wrapper.find('a').exists()).toBe(false)
			await wrapper.get('button[aria-label="Page 3"]').trigger('click')
			expect(wrapper.emitted('update:page')).toEqual([[3]])
		})

		it('renders router links with "pageTo"', async () => {
			const router = createRouter({
				history: createMemoryHistory(),
				routes: [{ path: '/', component: { template: 'List' } }],
			})
			await router.push('/')
			const wrapper = mount(NcPagination, {
				global: { plugins: [router] },
				props: { totalItems: 30, pageSize: 10, page: 1, pageTo: (page: number) => ({ query: { page } }) },
			})
			const link = wrapper.findAllComponents(RouterLink).find((item) => item.attributes('aria-label') === 'Page 3')
			expect(link?.props('to')).toEqual({ query: { page: 3 } })
			expect(link?.attributes('href')).toBe('/?page=3')
		})
	})

	describe('compact', () => {
		it('shows the visible item range instead of the page number', () => {
			const wrapper = mount(NcPagination, { props: { totalItems: 42, pageSize: 5, page: 3, compact: true } })
			expect(wrapper.get('nav > span').text()).toBe('11–15 of 42')
		})

		it('ends the range at the last item on the last page', () => {
			const wrapper = mount(NcPagination, { props: { totalItems: 42, pageSize: 5, page: 9, compact: true } })
			expect(wrapper.get('nav > span').text()).toBe('41–42 of 42')
		})

		it('shows an empty range without items', () => {
			const wrapper = mount(NcPagination, { props: { totalItems: 0, compact: true } })
			expect(wrapper.get('nav > span').text()).toBe('0–0 of 0')
		})

		it('only shows the previous and next buttons', () => {
			const wrapper = mount(NcPagination, { props: { totalItems: 42, pageSize: 5, compact: true } })
			expect(wrapper.findAll('button').map((button) => button.attributes('aria-label'))).toEqual(['Previous page', 'Next page'])
			expect(wrapper.find('nav > div > ul').exists()).toBe(false)
			expect(wrapper.findComponent(NcSelect).exists()).toBe(false)
		})
	})
})
