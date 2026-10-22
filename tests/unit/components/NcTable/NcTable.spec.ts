/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { NcTableColumn, NcTableRowKey, NcTableSort } from '../../../../src/components/NcTable/index.ts'

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
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
				props: { columns, rows },
				slots: { 'cell-team.name': ({ row, value }: { row: { name: string }, value: unknown }) => `${row.name}: ${value ?? '-'}` },
			})
			expect(bodyText(wrapper).map((row) => row[1])).toEqual(['Alice: Files', 'Bram: Talk', 'Chen: -'])
		})

		it('replaces a header with its header slot', () => {
			const wrapper = mount(NcTable, {
				props: { columns, rows },
				slots: { 'header-name': ({ column }: { column: NcTableColumn }) => column.label.toUpperCase() },
			})
			expect(wrapper.get('thead th').text()).toBe('NAME')
			expect(wrapper.get('thead th').find('button').exists()).toBe(false)
		})

		it('adds an actions column with the row actions slot', () => {
			const wrapper = mount(NcTable, {
				props: { columns, rows },
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

		it('shows the empty state without rows', () => {
			const wrapper = mountBound({ rows: [] })
			expect(wrapper.get('tbody td').text()).toBe('No results')
		})

		it('shows the empty slot without rows', () => {
			const wrapper = mount(NcTable, {
				props: { columns, rows: [] },
				slots: { empty: () => 'Nothing here yet' },
			})
			expect(wrapper.get('tbody td').text()).toBe('Nothing here yet')
		})

		it('spans the empty state over the selection and actions columns', () => {
			const wrapper = mount(NcTable, {
				props: { columns, rows: [], selectable: true },
				slots: { rowActions: () => 'x' },
			})
			expect(wrapper.get('tbody td').attributes('colspan')).toBe('5')
		})
	})

	describe('selection', () => {
		it('adds a checkbox per row and one for all rows', () => {
			const wrapper = mountBound({ selectable: true })
			const labels = wrapper.findAllComponents(NcCheckboxRadioSwitch).map((checkbox) => checkbox.props('ariaLabel'))
			expect(labels).toEqual(['Select all rows', 'Select row', 'Select row', 'Select row'])
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
				props: { columns, rows },
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
			const wrapper = mount(NcTable, { attachTo: document.body, props: { columns, rows, caption: 'Team members' } })
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
