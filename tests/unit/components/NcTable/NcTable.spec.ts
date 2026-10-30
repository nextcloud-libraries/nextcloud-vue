/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { NcTableColumn, NcTableRowKey, NcTableSort } from '../../../../src/components/NcTable/index.ts'

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import NcCheckboxRadioSwitch from '../../../../src/components/NcCheckboxRadioSwitch/NcCheckboxRadioSwitch.vue'
import NcTable from '../../../../src/components/NcTable/NcTable.vue'

const columns: NcTableColumn[] = [
	{ key: 'name', label: 'Name', sortable: true },
	{ key: 'team.name', label: 'Team' },
	{ key: 'tickets', label: 'Tickets', sortable: true, align: 'end' },
]

const rows = [
	{ id: 1, name: 'Alice', team: { name: 'Files' }, tickets: 4 },
	{ id: 2, name: 'Bram', team: { name: 'Talk' }, tickets: 12 },
	{ id: 3, name: 'Chen', team: null, tickets: 0 },
]

/**
 * The text of every body cell, row by row.
 *
 * @param wrapper - The mounted table
 */
function bodyText(wrapper: ReturnType<typeof mount>) {
	return wrapper.findAll('tbody tr').map((row) => row.findAll('td').map((cell) => cell.text()))
}

/**
 * Mount the table with sort and selection bound like v-model does.
 *
 * @param props - Extra props
 */
function mountBound(props: Record<string, unknown> = {}) {
	const wrapper = mount(NcTable, {
		props: {
			columns,
			rows,
			caption: 'Team members',
			...props,
			'onUpdate:sort': (sort: NcTableSort | null) => wrapper.setProps({ sort }),
			'onUpdate:selected': (selected: NcTableRowKey[]) => wrapper.setProps({ selected }),
		},
	})
	return wrapper
}

describe('NcTable', () => {
	it('renders a header cell per column and a row per row', () => {
		const wrapper = mountBound()
		expect(wrapper.findAll('thead th').map((cell) => cell.text())).toEqual(['Name', 'Team', 'Tickets'])
		expect(bodyText(wrapper)).toEqual([
			['Alice', 'Files', '4'],
			['Bram', 'Talk', '12'],
			['Chen', '', '0'],
		])
	})

	it('names the table with its caption', () => {
		const wrapper = mountBound()
		expect(wrapper.get('caption').text()).toBe('Team members')
	})

	it('marks the header cells as column headers', () => {
		const wrapper = mountBound()
		expect(wrapper.findAll('thead th').every((cell) => cell.attributes('scope') === 'col')).toBe(true)
	})

	it('shows the description of a column as its tooltip', () => {
		const wrapper = mountBound({ columns: [{ key: 'name', label: 'Name', description: 'The full name' }] })
		expect(wrapper.get('thead th').attributes('title')).toBe('The full name')
	})

	it('describes a column with its description, outside its name', () => {
		const wrapper = mountBound({
			columns: [
				{ key: 'name', label: 'Name', description: 'The full name' },
				{ key: 'tickets', label: 'Tickets', sortable: true, description: 'Open tickets only' },
			],
		})
		const [plain, sortable] = wrapper.findAll('thead th')
		expect(plain.text()).toBe('Name')
		expect(wrapper.get(`#${plain.attributes('aria-describedby')}`).text()).toBe('The full name')
		expect(sortable.attributes('aria-describedby')).toBeUndefined()
		expect(wrapper.get(`#${sortable.get('button').attributes('aria-describedby')}`).text()).toBe('Open tickets only')
	})

	it('makes the scroll area a named keyboard stop only when the table overflows', async () => {
		const scrollWidth = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(800)
		const clientWidth = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400)
		const wrapper = mountBound()
		await nextTick()
		const scroll = wrapper.get('table').element.parentElement!
		expect(scroll.getAttribute('tabindex')).toBe('0')
		expect(scroll.getAttribute('role')).toBe('group')
		expect(scroll.getAttribute('aria-label')).toBe('Team members')

		clientWidth.mockReturnValue(800)
		const fitting = mountBound()
		await nextTick()
		const fittingScroll = fitting.get('table').element.parentElement!
		expect(fittingScroll.hasAttribute('tabindex')).toBe(false)
		expect(fittingScroll.hasAttribute('role')).toBe(false)
		expect(fittingScroll.hasAttribute('aria-label')).toBe(false)
		scrollWidth.mockRestore()
		clientWidth.mockRestore()
	})

	describe('sorting', () => {
		it('only gives sortable columns a sort button', () => {
			const wrapper = mountBound()
			expect(wrapper.findAll('thead th button').map((button) => button.text())).toEqual(['Name', 'Tickets'])
		})

		it('reports the sorting through aria-sort', () => {
			const wrapper = mountBound({ sort: { key: 'tickets', order: 'desc' } })
			expect(wrapper.findAll('thead th').map((cell) => cell.attributes('aria-sort'))).toEqual(['none', undefined, 'descending'])
		})

		it('cycles a column through ascending, descending and not sorted', async () => {
			const wrapper = mountBound()
			const button = () => wrapper.get('thead th button')
			await button().trigger('click')
			await button().trigger('click')
			await button().trigger('click')
			expect(wrapper.emitted('update:sort')).toEqual([
				[{ key: 'name', order: 'asc' }],
				[{ key: 'name', order: 'desc' }],
				[null],
			])
		})

		it('starts ascending when another column was sorted', async () => {
			const wrapper = mountBound({ sort: { key: 'tickets', order: 'desc' } })
			await wrapper.get('thead th button').trigger('click')
			expect(wrapper.emitted('update:sort')).toEqual([[{ key: 'name', order: 'asc' }]])
		})

		it('does not sort the rows itself', () => {
			const wrapper = mountBound({ sort: { key: 'tickets', order: 'desc' } })
			expect(bodyText(wrapper).map((row) => row[0])).toEqual(['Alice', 'Bram', 'Chen'])
		})
	})

	describe('slots', () => {
		it('renders a cell slot with the row and its value', () => {
			const wrapper = mount(NcTable, {
				props: { caption: 'Team members', columns, rows },
				slots: { 'cell-team.name': ({ row, value }: { row: { name: string }, value: unknown }) => `${row.name}: ${value ?? '-'}` },
			})
			expect(bodyText(wrapper).map((row) => row[1])).toEqual(['Alice: Files', 'Bram: Talk', 'Chen: -'])
		})

		it('replaces a header with its header slot', () => {
			const wrapper = mount(NcTable, {
				props: { caption: 'Team members', columns, rows },
				slots: { 'header-name': ({ column }: { column: NcTableColumn }) => column.label.toUpperCase() },
			})
			expect(wrapper.get('thead th').text()).toBe('NAME')
			expect(wrapper.get('thead th').find('button').exists()).toBe(false)
		})

		it('replaces the header of a column that is not sortable', () => {
			const wrapper = mount(NcTable, {
				props: { caption: 'Team members', columns, rows },
				slots: { 'header-team.name': ({ column }: { column: NcTableColumn }) => `${column.label}!` },
			})
			expect(wrapper.findAll('thead th')[1].text()).toBe('Team!')
		})

		it('passes the sort state and a sort toggle to a header slot', async () => {
			const headerSlot = vi.fn(({ toggleSort }: { toggleSort: () => void }) => h('button', { type: 'button', onClick: toggleSort }, 'Sort'))
			const slotted = mount(NcTable, {
				props: { caption: 'Team members', columns, rows, sort: { key: 'name', order: 'asc' } },
				slots: { 'header-name': headerSlot },
			})
			expect(headerSlot.mock.calls[0][0]).toMatchObject({ sorted: true, sort: { key: 'name', order: 'asc' } })
			await slotted.get('thead th button').trigger('click')
			expect(slotted.emitted('update:sort')).toEqual([[{ key: 'name', order: 'desc' }]])
		})

		it('adds an actions column with the row actions slot', () => {
			const wrapper = mount(NcTable, {
				props: { caption: 'Team members', columns, rows },
				slots: { rowActions: ({ row }: { row: { id: number } }) => h('button', { type: 'button' }, `Open ${row.id}`) },
			})
			expect(wrapper.findAll('thead th')).toHaveLength(4)
			expect(wrapper.findAll('thead th')[3].text()).toBe('Actions')
			expect(bodyText(wrapper)[1][3]).toBe('Open 2')
		})
	})

	describe('states', () => {
		it('shows the loading state instead of the rows', () => {
			const wrapper = mountBound({ loading: true })
			expect(wrapper.get('table').attributes('aria-busy')).toBe('true')
			expect(wrapper.findAll('tbody tr')).toHaveLength(1)
			expect(wrapper.get('tbody td').attributes('colspan')).toBe('3')
		})

		it('shows the loading slot while loading', () => {
			const wrapper = mount(NcTable, {
				props: { caption: 'Team members', columns, rows, loading: true },
				slots: { loading: () => 'Fetching members' },
			})
			expect(wrapper.get('tbody td').text()).toBe('Fetching members')
		})

		it('is not busy when not loading', () => {
			const wrapper = mountBound()
			expect(wrapper.get('table').attributes('aria-busy')).toBeUndefined()
		})

		it('shows the empty state without rows', () => {
			const wrapper = mountBound({ rows: [] })
			expect(wrapper.get('tbody td').text()).toBe('No results')
		})

		it('shows the empty slot without rows', () => {
			const wrapper = mount(NcTable, {
				props: { caption: 'Team members', columns, rows: [] },
				slots: { empty: () => 'Nothing here yet' },
			})
			expect(wrapper.get('tbody td').text()).toBe('Nothing here yet')
		})

		it('spans the empty state over the selection and actions columns', () => {
			const wrapper = mount(NcTable, {
				props: { caption: 'Team members', columns, rows: [], selectable: true },
				slots: { rowActions: () => 'x' },
			})
			expect(wrapper.get('tbody td').attributes('colspan')).toBe('5')
		})
	})

	describe('selection', () => {
		it('adds a checkbox per row and one for all rows', () => {
			const wrapper = mountBound({ selectable: true })
			const labels = wrapper.findAllComponents(NcCheckboxRadioSwitch).map((checkbox) => checkbox.props('ariaLabel'))
			expect(labels).toEqual(['Select all rows', 'Select Alice', 'Select Bram', 'Select Chen'])
		})

		it('names the rows in the checkbox labels with "rowLabel"', () => {
			const wrapper = mountBound({ selectable: true, rowLabel: (row: { name: string, tickets: number }) => `${row.name} (${row.tickets})` })
			const labels = wrapper.findAllComponents(NcCheckboxRadioSwitch).map((checkbox) => checkbox.props('ariaLabel'))
			expect(labels).toEqual(['Select all rows', 'Select Alice (4)', 'Select Bram (12)', 'Select Chen (0)'])
		})

		it('falls back to a generic checkbox label for a row without a name', () => {
			const wrapper = mountBound({ selectable: true, rows: [{ id: 1, name: '' }] })
			expect(wrapper.findAllComponents(NcCheckboxRadioSwitch)[1].props('ariaLabel')).toBe('Select row')
		})

		it('selects and deselects a row', async () => {
			const wrapper = mountBound({ selectable: true })
			await wrapper.findAllComponents(NcCheckboxRadioSwitch)[2].vm.$emit('update:modelValue', true)
			await wrapper.findAllComponents(NcCheckboxRadioSwitch)[2].vm.$emit('update:modelValue', false)
			expect(wrapper.emitted('update:selected')).toEqual([[[2]], [[]]])
		})

		it('marks a selected row', () => {
			const wrapper = mountBound({ selectable: true, selected: [2] })
			expect(wrapper.findAllComponents(NcCheckboxRadioSwitch).map((checkbox) => checkbox.props('modelValue'))).toEqual([false, false, true, false])
		})

		it('shows the select all checkbox as partly checked when some rows are selected', () => {
			const wrapper = mountBound({ selectable: true, selected: [1] })
			const all = wrapper.findAllComponents(NcCheckboxRadioSwitch)[0]
			expect(all.props('modelValue')).toBe(false)
			expect(all.props('indeterminate')).toBe(true)
		})

		it('selects all rows and keeps the keys of rows that are not shown', async () => {
			const wrapper = mountBound({ selectable: true, selected: [99] })
			await wrapper.findAllComponents(NcCheckboxRadioSwitch)[0].vm.$emit('update:modelValue', true)
			expect(wrapper.emitted('update:selected')).toEqual([[[99, 1, 2, 3]]])
		})

		it('deselects all rows and keeps the keys of rows that are not shown', async () => {
			const wrapper = mountBound({ selectable: true, selected: [99, 1, 2, 3] })
			expect(wrapper.findAllComponents(NcCheckboxRadioSwitch)[0].props('modelValue')).toBe(true)
			await wrapper.findAllComponents(NcCheckboxRadioSwitch)[0].vm.$emit('update:modelValue', false)
			expect(wrapper.emitted('update:selected')).toEqual([[[99]]])
		})

		it('warns once when the rows have no key', () => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
			mountBound({ selectable: true, rows: [{ name: 'Alice' }, { name: 'Bram' }] })
			expect(warn.mock.calls.filter(([message]) => String(message).includes('[NcTable] A row has no "id"'))).toHaveLength(1)
			warn.mockRestore()
		})

		it('disables the select all checkbox without rows', () => {
			const wrapper = mountBound({ selectable: true, rows: [] })
			expect(wrapper.getComponent(NcCheckboxRadioSwitch).props('disabled')).toBe(true)
		})
	})

	describe('row click', () => {
		it('reports a click on a row', async () => {
			const wrapper = mountBound()
			await wrapper.findAll('tbody tr')[1].trigger('click')
			expect(wrapper.emitted('rowClick')?.[0][0]).toEqual(rows[1])
		})

		it('ignores a click on a control inside the row', async () => {
			const wrapper = mount(NcTable, {
				props: { caption: 'Team members', columns, rows },
				slots: { rowActions: () => h('button', { type: 'button' }, 'Open') },
			})
			await wrapper.get('tbody tr button').trigger('click')
			expect(wrapper.emitted('rowClick')).toBeUndefined()
		})

		it('selects the row without reporting a row click when its checkbox is clicked', async () => {
			const wrapper = mountBound({ selectable: true, onRowClick: () => {} })
			await wrapper.findAll('tbody .checkbox-content')[0].trigger('click')
			expect(wrapper.emitted('update:selected')).toEqual([[[1]]])
			expect(wrapper.emitted('rowClick')).toBeUndefined()
		})

		it('ignores a click in the selection cell next to the checkbox', async () => {
			const wrapper = mountBound({ selectable: true })
			await wrapper.findAll('tbody td')[0].trigger('click')
			expect(wrapper.emitted('rowClick')).toBeUndefined()
		})

		it('ignores a click that ends a text selection', async () => {
			const wrapper = mount(NcTable, { attachTo: document.body, props: { caption: 'Team members', columns, rows, caption: 'Team members' } })
			const cell = wrapper.findAll('tbody td')[0]
			window.getSelection()!.selectAllChildren(cell.element)
			await cell.trigger('click')
			window.getSelection()!.removeAllRanges()
			expect(wrapper.emitted('rowClick')).toBeUndefined()
			wrapper.unmount()
		})

		it('only shows the rows as clickable when rowClick is listened to', () => {
			const clickable = (wrapper: ReturnType<typeof mount>) => wrapper.get('tbody tr').classes().some((name) => name.includes('clickable'))
			expect(clickable(mountBound())).toBe(false)
			expect(clickable(mountBound({ onRowClick: () => {} }))).toBe(true)
		})
	})
})
