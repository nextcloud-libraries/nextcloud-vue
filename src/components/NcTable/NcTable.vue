<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders a table of rows and columns, with sortable column headers, selectable rows, and loading and empty states. Use it for lists of records where people compare values across rows; for a simple list of items, use `NcListItem` instead.

Pass the columns as `columns` and the data as `rows`. Each row needs a unique value under `row-key`, `id` by default. A column `key` may be a dotted path such as `owner.name`.

The component does not load, sort or filter any data itself. Bind the sorting with `v-model:sort`: a click on a sortable header cycles it through ascending, descending and unsorted, and the table emits the new sorting. Sort or load the rows accordingly.

With `selectable`, every row gets a checkbox and the header a checkbox for all rows. Bind the keys of the selected rows with `v-model:selected`. Each checkbox is labeled with the name of its row, the value of the first column unless `row-label` returns another one. The selection outlives `rows`: keys of rows that are filtered out or on another page stay selected, also when all rows are selected or deselected, and the checkbox for all rows only looks at the rows that are shown. Remove those keys from `selected` when the selection should only hold rows that are shown.

Give every table a `caption`. It names the table for assistive technology and is not shown. When the table is wider than its container, it scrolls sideways and can be reached with the keyboard to do so.

### Usage

```vue
<template>
	<NcTable
		v-model:sort="sort"
		caption="Team members"
		:columns="columns"
		:rows="sortedRows" />
</template>

<script>
export default {
	data() {
		return {
			sort: { key: 'name', order: 'asc' },
			columns: [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'role', label: 'Role', sortable: true },
				{ key: 'team.name', label: 'Team' },
				{ key: 'tickets', label: 'Open tickets', sortable: true, align: 'end' },
			],
			rows: [
				{ id: 1, name: 'Alice Peters', role: 'Developer', team: { name: 'Files' }, tickets: 4 },
				{ id: 2, name: 'Bram de Vries', role: 'Designer', team: { name: 'Talk' }, tickets: 12 },
				{ id: 3, name: 'Chen Li', role: 'Developer', team: { name: 'Files' }, tickets: 0 },
				{ id: 4, name: 'Dana Kowalski', role: 'Support', team: { name: 'Calendar' }, tickets: 7 },
			],
		}
	},

	computed: {
		sortedRows() {
			if (!this.sort) {
				return this.rows
			}
			const { key, order } = this.sort
			const direction = order === 'asc' ? 1 : -1
			return [...this.rows].sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * direction)
		},
	},
}
</script>
```

### Selection, custom cells and row actions

Override a cell with the `#cell-<key>` slot, which receives the row and its value. The `#rowActions` slot adds a trailing column, for example for an `NcActions` menu per row.

A click on a row, outside the controls in it, emits `rowClick`. It is a shortcut for mouse users only: a row cannot be focused, so keyboard and screen reader users cannot click it. Always give a row a real link or button for its main action as well, for example in the name cell, and use a link when the action navigates, so it can be opened in a new tab. A click that ends a text selection does not emit `rowClick`.

```vue
<template>
	<div>
		<p>Selected: {{ selected.join(', ') || 'none' }}</p>
		<NcTable
			v-model:selected="selected"
			caption="Documents"
			selectable
			:columns="columns"
			:rows="rows"
			@row-click="(row) => opened = row.name">
			<template #cell-name="{ row, value }">
				<NcButton variant="tertiary" @click="opened = row.name">
					{{ value }}
				</NcButton>
			</template>
			<template #cell-status="{ value }">
				<NcChip :text="value" :variant="value === 'Published' ? 'success' : 'secondary'" no-close />
			</template>
			<template #rowActions="{ row }">
				<NcActions>
					<NcActionButton close-after-click @click="opened = row.name">
						Open
					</NcActionButton>
				</NcActions>
			</template>
		</NcTable>
		<p v-if="opened">Opened: {{ opened }}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			selected: [],
			opened: '',
			columns: [
				{ key: 'name', label: 'Name' },
				{ key: 'status', label: 'Status' },
				{ key: 'modified', label: 'Modified', description: 'The last time the document was saved' },
			],
			rows: [
				{ id: 'a', name: 'Annual report.md', status: 'Published', modified: '12 Oct 2026' },
				{ id: 'b', name: 'Budget 2027.ods', status: 'Draft', modified: '14 Oct 2026' },
				{ id: 'c', name: 'Roadmap.md', status: 'Draft', modified: '16 Oct 2026' },
			],
		}
	},
}
</script>
```

### Loading and empty

```vue
<template>
	<div style="display: grid; gap: 16px">
		<NcTable caption="Loading" loading :columns="columns" :rows="[]" />
		<NcTable caption="Empty" :columns="columns" :rows="[]">
			<template #empty>
				No documents yet. Upload one to see it here.
			</template>
		</NcTable>
	</div>
</template>

<script>
export default {
	data() {
		return {
			columns: [
				{ key: 'name', label: 'Name' },
				{ key: 'modified', label: 'Modified' },
			],
		}
	},
}
</script>
```
</docs>

<template>
	<div :class="$style.ncTable">
		<div
			ref="scrollElement"
			:class="$style.ncTable__scroll"
			:tabindex="overflowing ? 0 : undefined"
			:role="overflowing ? 'group' : undefined"
			:aria-label="overflowing ? caption : undefined">
			<table :class="$style.ncTable__table" :aria-busy="loading ? 'true' : undefined">
				<caption v-if="caption" class="hidden-visually">
					{{ caption }}
				</caption>
				<thead>
					<tr>
						<th v-if="selectable" scope="col" :class="$style.ncTable__check">
							<NcCheckboxRadioSwitch
								:modelValue="allSelected"
								:indeterminate="someSelected"
								:disabled="loading || rows.length === 0"
								:aria-label="t('Select all rows')"
								@update:modelValue="toggleAll" />
						</th>
						<th
							v-for="column in columns"
							:key="column.key"
							scope="col"
							:class="[$style.ncTable__header, { [$style.ncTable__header_sortable]: column.sortable }, alignClass(column)]"
							:style="column.width ? { width: column.width } : undefined"
							:aria-sort="ariaSort(column)"
							:title="column.description || undefined">
							<!-- @slot `header-<key>`: the header of column `<key>`, replacing its sort button. Receives the `column`. -->
							<slot :name="'header-' + column.key" :column="column">
								<NcButton
									v-if="column.sortable"
									:class="$style.ncTable__sort"
									:alignment="sortAlignment(column)"
									variant="tertiary"
									@click="toggleSort(column)">
									<template #icon>
										<NcIconSvgWrapper
											:class="{ [$style.ncTable__sortIcon_idle]: !isSorted(column) }"
											:path="sortIcon(column)"
											:size="20" />
									</template>
									{{ column.label }}
								</NcButton>
								<span v-else>{{ column.label }}</span>
							</slot>
						</th>
						<th v-if="slots.rowActions" scope="col" :class="$style.ncTable__actions">
							<span class="hidden-visually">{{ t('Actions') }}</span>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="loading">
						<td :colspan="columnCount" :class="$style.ncTable__state">
							<slot name="loading">
								<NcLoadingIcon :size="32" :name="t('Loading …')" />
							</slot>
						</td>
					</tr>
					<tr v-else-if="rows.length === 0">
						<td :colspan="columnCount" :class="$style.ncTable__state">
							<slot name="empty">
								{{ t('No results') }}
							</slot>
						</td>
					</tr>
					<template v-else>
						<tr
							v-for="row in rows"
							:key="keyOf(row)"
							:class="[$style.ncTable__row, { [$style.ncTable__row_selected]: isSelected(row), [$style.ncTable__row_clickable]: hasRowClickListener() }]"
							@click="onRowClick(row, $event)">
							<!-- A click on the checkbox lands on its visual box, not on the input, so it is stopped here -->
							<td v-if="selectable" :class="$style.ncTable__check" @click.stop>
								<NcCheckboxRadioSwitch
									:modelValue="isSelected(row)"
									:aria-label="checkboxLabel(row)"
									@update:modelValue="toggleRow(row, $event)" />
							</td>
							<td
								v-for="column in columns"
								:key="column.key"
								:class="[$style.ncTable__cell, alignClass(column)]">
								<!-- @slot `cell-<key>`: the cell of column `<key>`. Receives the `row` and its `value`. -->
								<slot :name="'cell-' + column.key" :row="row" :value="valueOf(row, column)">
									{{ displayValue(valueOf(row, column)) }}
								</slot>
							</td>
							<td v-if="slots.rowActions" :class="$style.ncTable__actions">
								<slot name="rowActions" :row="row" />
							</td>
						</tr>
					</template>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Slot } from 'vue'

import { mdiMenuDown, mdiMenuSwap, mdiMenuUp } from '@mdi/js'
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, useCssModule } from 'vue'
import NcButton from '../NcButton/NcButton.vue'
import NcCheckboxRadioSwitch from '../NcCheckboxRadioSwitch/NcCheckboxRadioSwitch.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcLoadingIcon from '../NcLoadingIcon/NcLoadingIcon.vue'
import { t } from '../../l10n.ts'

export type NcTableRowKey = string | number

export interface NcTableColumn {
	/** The key of the value in a row, or a dotted path such as `owner.name` */
	key: string
	/** The header text */
	label: string
	/** Whether a click on the header sorts by this column */
	sortable?: boolean
	/** A CSS width for the column, for example `12em` */
	width?: string
	/** How the column's content is aligned */
	align?: 'start' | 'center' | 'end'
	/** A longer explanation, shown as the header's tooltip */
	description?: string
}

export interface NcTableSort {
	key: string
	order: 'asc' | 'desc'
}

/**
 * The current sorting, or `null` when the rows are not sorted.
 */
const sort = defineModel<NcTableSort | null>('sort', { default: null })

/**
 * The keys of the selected rows.
 */
const selected = defineModel<NcTableRowKey[]>('selected', { default: () => [] })

const props = withDefaults(defineProps<{
	/**
	 * The columns of the table, in order.
	 */
	columns: NcTableColumn[]

	/**
	 * The rows of the table. Every row needs a unique value under `rowKey`.
	 */
	rows: Record<string, unknown>[]

	/**
	 * The name of the property that identifies a row.
	 *
	 * @default 'id'
	 */
	rowKey?: string

	/**
	 * The name of the table for assistive technology. It is not shown.
	 */
	caption?: string

	/**
	 * Whether the rows are loading. Shows a loading state instead of the rows.
	 */
	loading?: boolean

	/**
	 * Whether rows can be selected with a checkbox.
	 */
	selectable?: boolean

	/**
	 * Returns the name of a row, used in the label of its checkbox, such as "Select Annual report.md".
	 * Defaults to the value of the first column.
	 */
	rowLabel?: (row: Record<string, unknown>) => string
}>(), {
	rowKey: 'id',
	caption: undefined,
	rowLabel: undefined,
})

const emit = defineEmits<{
	/**
	 * The sorting changed.
	 *
	 * @param sort - The new sorting, or `null`
	 */
	'update:sort': [sort: NcTableSort | null]

	/**
	 * The selection changed.
	 *
	 * @param selected - The selected row keys
	 */
	'update:selected': [selected: NcTableRowKey[]]

	/**
	 * A row was clicked, outside the controls in it. Only mouse users can do this,
	 * so it must not be the only way to reach a row's action.
	 *
	 * @param row - The clicked row
	 * @param event - The click event
	 */
	rowClick: [row: Record<string, unknown>, event: MouseEvent]
}>()

const slots = defineSlots<{
	/**
	 * The content of the cell of column `<key>`, for example `#cell-status`.
	 */
	[key: `cell-${string}`]: Slot<{ row: Record<string, unknown>, value: unknown }>

	/**
	 * The content of the header of column `<key>`, for example `#header-status`.
	 * It replaces the sort button of a sortable column.
	 */
	[key: `header-${string}`]: Slot<{ column: NcTableColumn }>

	/**
	 * Actions for a row, for example an `NcActions` menu. Adds a trailing column.
	 */
	rowActions?: Slot<{ row: Record<string, unknown> }>

	/**
	 * What is shown while `loading` is set.
	 */
	loading?: Slot

	/**
	 * What is shown when there are no rows.
	 */
	empty?: Slot
}>()

const style = useCssModule()

const columnCount = computed(() => props.columns.length + (props.selectable ? 1 : 0) + (slots.rowActions ? 1 : 0))

/**
 * The key of a row.
 *
 * @param row - The row
 */
function keyOf(row: Record<string, unknown>): NcTableRowKey {
	return row[props.rowKey] as NcTableRowKey
}

/**
 * The value of a column in a row, following a dotted path.
 *
 * @param row - The row
 * @param column - The column
 */
function valueOf(row: Record<string, unknown>, column: NcTableColumn): unknown {
	return column.key.split('.').reduce<unknown>((value, part) => (value === null || value === undefined ? undefined : (value as Record<string, unknown>)[part]), row)
}

/**
 * The text shown for a value without a cell slot.
 *
 * @param value - The value
 */
function displayValue(value: unknown): string {
	if (value === null || value === undefined) {
		return ''
	}
	if (Array.isArray(value)) {
		return value.map(displayValue).join(', ')
	}
	return String(value)
}

/**
 * The class that aligns a column.
 *
 * @param column - The column
 */
function alignClass(column: NcTableColumn): string | undefined {
	if (column.align === 'center') {
		return style.ncTable_alignCenter
	}
	if (column.align === 'end') {
		return style.ncTable_alignEnd
	}
	return undefined
}

/**
 * Whether the rows are sorted by a column.
 *
 * @param column - The column
 */
function isSorted(column: NcTableColumn): boolean {
	return sort.value?.key === column.key
}

/**
 * The value of `aria-sort` for a column.
 *
 * @param column - The column
 */
function ariaSort(column: NcTableColumn): 'ascending' | 'descending' | 'none' | undefined {
	if (!column.sortable) {
		return undefined
	}
	if (!isSorted(column)) {
		return 'none'
	}
	return sort.value!.order === 'asc' ? 'ascending' : 'descending'
}

/**
 * The icon of a sortable header: both directions when not sorted by it.
 *
 * @param column - The column
 */
function sortIcon(column: NcTableColumn): string {
	if (!isSorted(column)) {
		return mdiMenuSwap
	}
	return sort.value!.order === 'asc' ? mdiMenuUp : mdiMenuDown
}

/**
 * Where a sort button puts its text, with the sort icon after it.
 *
 * @param column - The column
 */
function sortAlignment(column: NcTableColumn): 'start-reverse' | 'center-reverse' | 'end-reverse' {
	if (column.align === 'center') {
		return 'center-reverse'
	}
	return column.align === 'end' ? 'end-reverse' : 'start-reverse'
}

/**
 * Move a column's sorting on: ascending, descending, then not sorted.
 *
 * @param column - The column
 */
function toggleSort(column: NcTableColumn) {
	if (!isSorted(column)) {
		sort.value = { key: column.key, order: 'asc' }
	} else if (sort.value!.order === 'asc') {
		sort.value = { key: column.key, order: 'desc' }
	} else {
		sort.value = null
	}
}

const selectedSet = computed(() => new Set(selected.value))
const selectedCount = computed(() => props.rows.filter((row) => selectedSet.value.has(keyOf(row))).length)
const allSelected = computed(() => props.rows.length > 0 && selectedCount.value === props.rows.length)
const someSelected = computed(() => selectedCount.value > 0 && !allSelected.value)

/**
 * Whether a row is selected.
 *
 * @param row - The row
 */
function isSelected(row: Record<string, unknown>): boolean {
	return selectedSet.value.has(keyOf(row))
}

/**
 * The label of a row's checkbox, naming the row so the checkboxes can be told apart.
 *
 * @param row - The row
 */
function checkboxLabel(row: Record<string, unknown>): string {
	const firstColumn = props.columns[0]
	const name = props.rowLabel
		? props.rowLabel(row)
		: (firstColumn ? displayValue(valueOf(row, firstColumn)) : '')
	return name ? t('Select {row}', { row: name }) : t('Select row')
}

/**
 * Select or deselect one row.
 *
 * @param row - The row
 * @param value - Whether it is selected now
 */
function toggleRow(row: Record<string, unknown>, value: unknown) {
	const key = keyOf(row)
	const others = selected.value.filter((selectedKey) => selectedKey !== key)
	selected.value = value ? [...others, key] : others
}

/**
 * Select or deselect all rows. Keys of rows that are not shown stay selected.
 *
 * @param value - Whether all rows are selected now
 */
function toggleAll(value: unknown) {
	const shown = new Set(props.rows.map(keyOf))
	const hidden = selected.value.filter((key) => !shown.has(key))
	selected.value = value ? [...hidden, ...shown] : hidden
}

const instance = getCurrentInstance()

/**
 * Whether the parent listens to `rowClick`, so the rows show they can be clicked.
 * Read during the render, so it follows the parent's current listeners.
 */
function hasRowClickListener(): boolean {
	return Boolean(instance?.vnode.props?.onRowClick)
}

/**
 * Report a click on a row, unless it was on a control inside it or ended a text selection.
 *
 * @param row - The row
 * @param event - The click event
 */
function onRowClick(row: Record<string, unknown>, event: MouseEvent) {
	const target = event.target as Element | null
	if (target?.closest('a, button, input, select, textarea, label, [role="button"], [role="checkbox"]')) {
		return
	}
	if (window.getSelection()?.toString()) {
		return
	}
	emit('rowClick', row, event)
}

// The scroll area is only a keyboard stop when it actually scrolls
const scrollElement = ref<HTMLElement>()
const overflowing = ref(false)
let resizeObserver: ResizeObserver | undefined

/**
 * Check whether the table is wider than its container.
 */
function measure() {
	const element = scrollElement.value
	overflowing.value = !!element && element.scrollWidth > element.clientWidth
}

onMounted(() => {
	measure()
	if (typeof ResizeObserver !== 'undefined' && scrollElement.value) {
		resizeObserver = new ResizeObserver(measure)
		resizeObserver.observe(scrollElement.value)
		const table = scrollElement.value.firstElementChild
		if (table) {
			resizeObserver.observe(table)
		}
	}
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<style lang="scss" module>
.ncTable {
	min-width: 0;
}

.ncTable__scroll {
	overflow-x: auto;
	border-radius: var(--border-radius-element);

	&:focus-visible {
		outline: 2px solid var(--color-main-text);
		outline-offset: 2px;
	}
}

.ncTable__table {
	width: 100%;
	border-collapse: collapse;
}

.ncTable__header,
.ncTable__cell,
.ncTable__check,
.ncTable__actions {
	padding-block: var(--default-grid-baseline);
	padding-inline: calc(2 * var(--default-grid-baseline));
	border-bottom: 1px solid var(--color-border);
	text-align: start;
	vertical-align: middle;
}

.ncTable__header {
	height: var(--default-clickable-area);
	color: var(--color-text-maxcontrast);
	font-weight: normal;
	white-space: nowrap;
}

.ncTable__cell {
	height: var(--default-clickable-area);
}

// A sortable header is an NcButton, like the sortable headers of the Files app.
// The cell gives up its own padding to the button, so the label lines up with the
// values below it, and the label keeps the weight and color of a plain header.
.ncTable__header_sortable {
	--font-weight-element: normal;
	padding-inline: 0;
}

.ncTable__header .ncTable__sort:global(.button-vue) {
	--button-padding: calc(2 * var(--default-grid-baseline)) var(--default-grid-baseline);
	color: var(--color-text-maxcontrast);

	&:hover:not(:disabled) {
		color: var(--color-main-text);
	}
}

.ncTable__sortIcon_idle {
	opacity: 0.5;
}

.ncTable__check {
	width: var(--default-clickable-area);
}

.ncTable__actions {
	width: var(--default-clickable-area);
	text-align: end;
}

.ncTable__row:hover > td {
	background-color: var(--color-background-hover);
}

.ncTable__row_clickable {
	cursor: pointer;
}

.ncTable__row_selected > td {
	background-color: var(--color-primary-element-light);
}

.ncTable__row_selected:hover > td {
	background-color: var(--color-primary-element-light-hover);
}

.ncTable__state {
	padding-block: calc(6 * var(--default-grid-baseline));
	color: var(--color-text-maxcontrast);
	text-align: center;
}

.ncTable_alignCenter {
	text-align: center;
}

.ncTable_alignEnd {
	text-align: end;
}

// The sort button is as wide as its content, so it moves to the column's side itself
.ncTable_alignCenter .ncTable__sort:global(.button-vue) {
	margin-inline: auto;
}

.ncTable_alignEnd .ncTable__sort:global(.button-vue) {
	margin-inline-start: auto;
}
</style>
