<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders the pagination of a paged list or table. It shows the current position, buttons to move to the first, previous, next or last page or to a numbered page, and a selector for the number of items per page. When all items fit on one page, only the position and the page size selector are shown.

The component does not load or slice any data itself. Pass the number of items in `total-items`, bind the current page with `v-model:page` and the page size with `v-model:page-size`, and load or slice the items accordingly.

Long page ranges are shortened with ellipses, so at most seven page buttons are shown at a time. The pagination is a `nav` landmark, labeled "Pagination" unless `aria-label` is set.

When the page size is changed with the selector, the pagination goes back to the first page. When the current page does not exist, because the number of items shrank or a page that does not exist was passed, it moves to the last page there is. While `total-items` is `0`, for example while the items are still loading, the current page is left as it is.

When a page or first, previous, next or last button that has keyboard focus disappears or becomes disabled, the focus moves to the current page, or in the compact layout to the other button.

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
	margin: 0;
	padding: 0;
	list-style: none;
	border-top: 1px solid var(--color-border);
}

.items li {
	padding: calc(3 * var(--default-grid-baseline)) calc(4 * var(--default-grid-baseline));
	border-bottom: 1px solid var(--color-border);
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

### Pages as links

When the page is kept in the URL, pass `page-href` or, with Vue Router, `page-to`: a function that returns the link of a page. The pages and the first, previous, next and last buttons are then links that can be opened in a new tab or copied, and a disabled button is rendered without a link. A link does not change the page itself: pass the page from the URL as `page`. Only a changed page size, or a page that no longer exists, emits `update:page`, so replace the URL then.

```html static
<template>
	<NcPagination
		:page="Number($route.query.page ?? 1)"
		:page-to="(page) => ({ query: { ...$route.query, page } })"
		:total-items="totalItems"
		@update:page="(page) => $router.replace({ query: { ...$route.query, page } })" />
</template>
```
</docs>

<template>
	<nav
		ref="nav"
		:class="[$style.ncPagination, { [$style.ncPagination_compact]: compact }]"
		:aria-label="ariaLabel">
		<span :class="$style.ncPagination__info">
			{{ infoText }}
		</span>

		<div v-if="totalPages > 1" :class="$style.ncPagination__nav">
			<NcButton
				v-if="!compact"
				v-bind="linkProps(1, isFirstPage)"
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
				v-bind="linkProps(page - 1, isFirstPage)"
				:aria-label="t('Previous page')"
				:title="t('Previous page')"
				:disabled="isFirstPage"
				variant="tertiary"
				@click="goToPage(page - 1)">
				<template #icon>
					<NcIconSvgWrapper directional :path="mdiChevronLeft" />
				</template>
			</NcButton>

			<ul v-if="!compact" :class="$style.ncPagination__pages">
				<li
					v-for="item in visiblePages"
					:key="item"
					:aria-hidden="typeof item === 'string' ? 'true' : undefined">
					<span
						v-if="typeof item === 'string'"
						:class="$style.ncPagination__ellipsis">
						…
					</span>
					<NcButton
						v-else
						v-bind="linkProps(item)"
						:aria-current="item === page ? 'page' : undefined"
						:aria-label="t('Page {page}', { page: item })"
						:variant="item === page ? 'primary' : 'tertiary'"
						@click="goToPage(item)">
						{{ item }}
					</NcButton>
				</li>
			</ul>

			<NcButton
				v-bind="linkProps(page + 1, isLastPage)"
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
				v-bind="linkProps(totalPages, isLastPage)"
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

		<div v-if="!compact" :class="$style.ncPagination__end">
			<NcSelect
				v-if="pageSizeOptions.length > 0"
				:class="$style.ncPagination__pageSize"
				:clearable="false"
				:inputLabel="t('Items per page')"
				:modelValue="pageSize"
				:options="pageSizeOptions"
				@update:modelValue="setPageSize" />
		</div>
	</nav>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

import { mdiChevronLeft, mdiChevronRight, mdiPageFirst, mdiPageLast } from '@mdi/js'
import { computed, nextTick, useTemplateRef, watch, watchPostEffect } from 'vue'
import NcButton from '../NcButton/NcButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcSelect from '../NcSelect/NcSelect.vue'
import { t } from '../../l10n.ts'

/**
 * The current page, starting at 1.
 */
const page = defineModel<number>('page', {
	default: 1,
	validator: (value: number) => Number.isInteger(value) && value >= 1,
})

/**
 * The number of items shown per page.
 */
const pageSize = defineModel<number>('pageSize', {
	default: 20,
	validator: (value: number) => Number.isInteger(value) && value >= 1,
})

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

	/**
	 * Returns the URL of a page, to render the pages as links.
	 * A link does not change the page itself: pass the page from the URL as `page`.
	 */
	pageHref?: (page: number) => string

	/**
	 * Returns the Vue Router route of a page, to render the pages as router links.
	 * A link does not change the page itself: pass the page from the route as `page`.
	 * Takes precedence over `pageHref`.
	 */
	pageTo?: (page: number) => RouteLocationRaw
}>(), {
	pageSizeOptions: () => [10, 20, 50, 100],
	ariaLabel: t('Pagination'),
	pageHref: undefined,
	pageTo: undefined,
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

const navElement = useTemplateRef<HTMLElement>('nav')

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / Math.max(1, pageSize.value))))
const isFirstPage = computed(() => page.value <= 1)
const isLastPage = computed(() => page.value >= totalPages.value)
const isLink = computed(() => Boolean(props.pageHref || props.pageTo))

// Step back to the last page when the current one does not exist, also when mounted
// with one. While there are no items, for example while they load, a page from the
// URL is left alone. After the render, so a page the parent has just changed is
// already passed down.
watchPostEffect(() => {
	if (props.totalItems > 0 && page.value > totalPages.value) {
		page.value = totalPages.value
	}
})

// A focused button that becomes disabled or disappears with the new page drops the
// focus to the body. Remember it before the render and move the focus to the current
// page after, or in the compact layout to the button that is left.
watch(page, async () => {
	const focused = document.activeElement
	if (!(focused instanceof HTMLElement) || !navElement.value?.contains(focused)) {
		return
	}

	await nextTick()
	if (focused.isConnected && !focused.matches(':disabled')) {
		return
	}
	const target = navElement.value?.querySelector<HTMLElement>('[aria-current="page"]')
		?? navElement.value?.querySelector<HTMLElement>('a[href], button:not(:disabled)')
	target?.focus()
})

const infoText = computed(() => {
	if (!props.compact) {
		// While the items load, a page from the URL can lie beyond the single empty page
		const total = props.totalItems === 0 ? Math.max(page.value, totalPages.value) : totalPages.value
		return t('Page {page} of {totalPages}', { page: page.value, totalPages: total })
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
 * The link props of a page button, when the pages are links.
 * A disabled button gets no link, so it stays a disabled button.
 *
 * @param target - The page the button moves to
 * @param disabled - Whether the button is disabled
 */
function linkProps(target: number, disabled = false) {
	if (!isLink.value || disabled) {
		return {}
	}
	return { href: props.pageHref?.(target), to: props.pageTo?.(target) }
}

/**
 * Move to a page, if it exists and is not the current page.
 * Links navigate themselves, so then the page follows the URL instead.
 *
 * @param target - The page to move to
 */
function goToPage(target: number) {
	if (isLink.value) {
		return
	}
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

<style lang="scss" module>
.ncPagination {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: calc(2 * var(--default-grid-baseline)) calc(4 * var(--default-grid-baseline));
	padding-block: calc(3 * var(--default-grid-baseline));
}

// The info and the end share the space left of and right of the page buttons
// equally, so the buttons stay centered whatever the two sides hold
.ncPagination__info {
	flex: 1 1 0;
	color: var(--color-text-maxcontrast);
	white-space: nowrap;
}

.ncPagination__nav {
	display: flex;
	flex: 0 1 auto;
	align-items: center;
	justify-content: center;
	gap: calc(2 * var(--default-grid-baseline));
}

.ncPagination__pages {
	display: flex;
	align-items: center;
	gap: calc(2 * var(--default-grid-baseline));
	margin: 0;
	padding: 0;
	list-style: none;
}

.ncPagination__end {
	display: flex;
	flex: 1 1 0;
	justify-content: flex-end;
}

.ncPagination__ellipsis {
	display: inline-block;
	min-width: var(--default-clickable-area);
	color: var(--color-text-maxcontrast);
	text-align: center;
}

// NcSelect sets a 260px min-width on `.nc-select.v-select.select`, too wide for a page size
.ncPagination__pageSize:global(.nc-select.v-select.select) {
	min-width: calc(5 * var(--default-clickable-area));
	margin: 0;
}

.ncPagination_compact {
	flex-wrap: nowrap;

	.ncPagination__info {
		font-size: var(--font-size-small);
	}

	.ncPagination__nav {
		flex-grow: 0;
	}
}
</style>
