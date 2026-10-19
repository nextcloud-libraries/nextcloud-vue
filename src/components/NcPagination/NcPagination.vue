<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders the pagination of a paged list or table. It shows the current position, buttons to move to the first, previous, next or last page or to a numbered page, and a selector for the number of items per page. When all items fit on one page, only the position and the page size selector are shown.

The component does not load or slice any data itself. Pass the number of items in `total-items`, bind the current page with `v-model:page` and the page size with `v-model:page-size`, and load or slice the items accordingly.

Long page ranges are shortened with ellipses, so at most seven page buttons are shown at a time. The pagination is a `nav` landmark, labeled "Pagination" unless `aria-label` is set.

When the page size is changed with the selector, the pagination goes back to the first page. When the number of items shrinks so that the current page no longer exists, it moves to the last page there is. While `total-items` is `0`, for example while the items are still loading, the current page is left as it is.

### Usage

```vue
<template>
	<div>
		<ul class="items">
			<li v-for="item in visibleItems" :key="item">
				Item {{ item }}
			</li>
		</ul>
		<NcPagination
			v-model:page="page"
			v-model:page-size="pageSize"
			:total-items="items.length" />
	</div>
</template>

<script>
export default {
	data() {
		return {
			items: Array.from({ length: 237 }, (_, index) => index + 1),
			page: 1,
			pageSize: 10,
		}
	},

	computed: {
		visibleItems() {
			const start = (this.page - 1) * this.pageSize
			return this.items.slice(start, start + this.pageSize)
		},
	},
}
</script>

<style scoped>
.items {
	display: flex;
	flex-wrap: wrap;
	gap: 4px 16px;
}
</style>
```

### Compact

The compact layout only shows the visible item range and the previous and next buttons. Use it where space is limited, for example in a dashboard widget or a sidebar.

```vue
<template>
	<NcPagination
		v-model:page="page"
		compact
		:page-size="5"
		:total-items="42" />
</template>

<script>
export default {
	data() {
		return {
			page: 1,
		}
	},
}
</script>
```

### Without page size selector

Pass an empty `page-size-options` array to hide the page size selector, for example when the page size is fixed by the server.

```vue
<template>
	<NcPagination
		v-model:page="page"
		:page-size="25"
		:page-size-options="[]"
		:total-items="1000" />
</template>

<script>
export default {
	data() {
		return {
			page: 20,
		}
	},
}
</script>
```
</docs>

<template>
	<nav
		class="nc-pagination"
		:class="{ 'nc-pagination--compact': compact }"
		:aria-label="ariaLabel">
		<span class="nc-pagination__info">
			{{ infoText }}
		</span>

		<div v-if="totalPages > 1" class="nc-pagination__nav">
			<NcButton
				v-if="!compact"
				:aria-label="t('First page')"
				:title="t('First page')"
				:disabled="isFirstPage"
				variant="tertiary"
				@click="goToPage(1)">
				<template #icon>
					<NcIconSvgWrapper directional :path="mdiPageFirst" />
				</template>
			</NcButton>
			<NcButton
				:aria-label="t('Previous page')"
				:title="t('Previous page')"
				:disabled="isFirstPage"
				variant="tertiary"
				@click="goToPage(page - 1)">
				<template #icon>
					<NcIconSvgWrapper directional :path="mdiChevronLeft" />
				</template>
			</NcButton>

			<ul v-if="!compact" class="nc-pagination__pages">
				<li v-for="item in visiblePages" :key="item">
					<span
						v-if="typeof item === 'string'"
						class="nc-pagination__ellipsis"
						aria-hidden="true">
						…
					</span>
					<NcButton
						v-else
						:aria-current="item === page ? 'page' : undefined"
						:aria-label="t('Page {page}', { page: item })"
						:variant="item === page ? 'primary' : 'tertiary'"
						@click="goToPage(item)">
						{{ item }}
					</NcButton>
				</li>
			</ul>

			<NcButton
				:aria-label="t('Next page')"
				:title="t('Next page')"
				:disabled="isLastPage"
				variant="tertiary"
				@click="goToPage(page + 1)">
				<template #icon>
					<NcIconSvgWrapper directional :path="mdiChevronRight" />
				</template>
			</NcButton>
			<NcButton
				v-if="!compact"
				:aria-label="t('Last page')"
				:title="t('Last page')"
				:disabled="isLastPage"
				variant="tertiary"
				@click="goToPage(totalPages)">
				<template #icon>
					<NcIconSvgWrapper directional :path="mdiPageLast" />
				</template>
			</NcButton>
		</div>

		<NcSelect
			v-if="!compact && pageSizeOptions.length > 0"
			class="nc-pagination__page-size"
			:clearable="false"
			:inputLabel="t('Items per page')"
			:modelValue="pageSize"
			:options="pageSizeOptions"
			@update:modelValue="setPageSize" />
	</nav>
</template>

<script setup lang="ts">
import { mdiChevronLeft, mdiChevronRight, mdiPageFirst, mdiPageLast } from '@mdi/js'
import { computed, watch } from 'vue'
import NcButton from '../NcButton/NcButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcSelect from '../NcSelect/NcSelect.vue'
import { t } from '../../l10n.ts'

/**
 * The current page, starting at 1.
 */
const page = defineModel<number>('page', { default: 1 })

/**
 * The number of items shown per page.
 */
const pageSize = defineModel<number>('pageSize', { default: 20 })

const props = withDefaults(defineProps<{
	/**
	 * The total number of items over all pages.
	 */
	totalItems: number

	/**
	 * The page sizes offered in the page size selector.
	 * Pass an empty array to hide the selector.
	 *
	 * @default [10, 20, 50, 100]
	 */
	pageSizeOptions?: number[]

	/**
	 * Only show the visible item range and the previous and next buttons,
	 * for places with limited space such as dashboard widgets.
	 */
	compact?: boolean

	/**
	 * Accessible label of the pagination landmark.
	 *
	 * @default 'Pagination'
	 */
	ariaLabel?: string
}>(), {
	pageSizeOptions: () => [10, 20, 50, 100],
	ariaLabel: t('Pagination'),
})

defineEmits<{
	/**
	 * The current page changed.
	 *
	 * @param page - The new page, starting at 1
	 */
	'update:page': [page: number]

	/**
	 * The number of items per page changed.
	 *
	 * @param pageSize - The new page size
	 */
	'update:pageSize': [pageSize: number]
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / pageSize.value)))
const isFirstPage = computed(() => page.value <= 1)
const isLastPage = computed(() => page.value >= totalPages.value)

// Step back to the last page when the current one no longer exists. While there are
// no items, for example while they load, a page from the URL is left alone. After
// the render, so a page the parent has just changed is already passed down.
watch(totalPages, (pages) => {
	if (props.totalItems > 0 && page.value > pages) {
		page.value = pages
	}
}, { flush: 'post' })

const infoText = computed(() => {
	if (!props.compact) {
		return t('Page {page} of {totalPages}', { page: page.value, totalPages: totalPages.value })
	}

	const from = props.totalItems === 0 ? 0 : (page.value - 1) * pageSize.value + 1
	const to = Math.min(page.value * pageSize.value, props.totalItems)
	return t('{from}–{to} of {total}', { from, to, total: props.totalItems })
})

/**
 * The page numbers to show, with ellipsis markers for skipped ranges.
 * At most seven entries are returned.
 */
const visiblePages = computed<(number | string)[]>(() => {
	const current = page.value
	const total = totalPages.value

	if (total <= 7) {
		return Array.from({ length: total }, (_, index) => index + 1)
	}
	if (current <= 4) {
		return [1, 2, 3, 4, 5, 'ellipsis-end', total]
	}
	if (current >= total - 3) {
		return [1, 'ellipsis-start', total - 4, total - 3, total - 2, total - 1, total]
	}
	return [1, 'ellipsis-start', current - 1, current, current + 1, 'ellipsis-end', total]
})

/**
 * Move to a page, if it exists and is not the current page.
 *
 * @param target - The page to move to
 */
function goToPage(target: number) {
	if (target !== page.value && target >= 1 && target <= totalPages.value) {
		page.value = target
	}
}

/**
 * Change the page size, and go back to the first page.
 *
 * @param size - The newly selected page size
 */
function setPageSize(size: number | null) {
	if (typeof size === 'number' && size !== pageSize.value) {
		pageSize.value = size
		page.value = 1
	}
}
</script>

<style scoped lang="scss">
.nc-pagination {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: calc(2 * var(--default-grid-baseline)) calc(4 * var(--default-grid-baseline));

	&__info {
		color: var(--color-text-maxcontrast);
		white-space: nowrap;
	}

	&__nav {
		display: flex;
		flex-grow: 1;
		align-items: center;
		justify-content: center;
		gap: var(--default-grid-baseline);
	}

	&__pages {
		display: flex;
		align-items: center;
		gap: var(--default-grid-baseline);
	}

	&__ellipsis {
		display: inline-block;
		min-width: var(--default-clickable-area);
		color: var(--color-text-maxcontrast);
		text-align: center;
	}

	&__page-size {
		min-width: 120px;
		margin: 0;
	}

	&--compact {
		flex-wrap: nowrap;

		.nc-pagination__info {
			font-size: var(--font-size-small);
		}

		.nc-pagination__nav {
			flex-grow: 0;
		}
	}
}
</style>
