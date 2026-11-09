<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component shows the pagination of a paged list or table: buttons to the first, previous, next, last and numbered pages. The "…" between the numbers opens a field to go to any page.

It does not load or slice any data itself: pass `total-items`, bind `v-model:page`, and show the items of that page. A page holds 25 items, unless you pass another `page-size`.

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
			:page-size="pageSize"
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

### Choosing the page size

To let users choose how many items a page holds, pass the sizes to offer in `page-size-options` and bind `v-model:page-size`. The sizes are then offered in a menu after the pages. Choosing another size goes back to the first page.

```vue
<template>
	<NcPagination
		v-model:page="page"
		v-model:page-size="pageSize"
		:page-size-options="[10, 25, 50, 100]"
		:total-items="1000" />
</template>

<script>
export default {
	data() {
		return {
			page: 20,
			pageSize: 25,
		}
	},
}
</script>
```

### Pages as links

When the page is kept in the URL, pass `page-href` or, with Vue Router, `page-to`: a function that returns the link of a page. The pages and the first, previous, next and last buttons are then links that can be opened in a new tab or copied, and a disabled button is rendered without a link. A link does not change the page itself: pass the page from the URL as `page`. Only a page entered after "…", a changed page size, or a page that no longer exists emits `update:page`, so replace the URL then.

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
		<span v-if="compact" :class="$style.ncPagination__info">
			{{ rangeText }}
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
				<li v-for="item in visiblePages" :key="item">
					<!-- The skipped pages: a menu with a field to go to any page -->
					<NcActions
						v-if="typeof item === 'string'"
						:aria-label="t('Go to page')"
						:open="openMenu === item"
						@update:open="(open) => toggleMenu(item, open)">
						<NcActionInput
							v-model="jumpTarget"
							type="number"
							:label="t('Go to page')"
							:min="1"
							:max="totalPages"
							@submit="jumpToPage" />
					</NcActions>
					<NcButton
						v-else
						v-bind="linkProps(item)"
						:aria-current="item === page ? 'page' : undefined"
						:aria-label="t('Page {page}', { page: item })"
						:variant="item === page ? 'secondary' : 'tertiary'"
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

		<div v-if="!compact && pageSizeOptions.length > 0" :class="$style.ncPagination__end">
			<NcActions
				:aria-label="t('Items per page')"
				:open="openMenu === 'pageSize'"
				@update:open="(open) => toggleMenu('pageSize', open)">
				<NcActionCaption :name="t('Items per page')" />
				<NcActionRadio
					v-for="size in pageSizeOptions"
					:key="size"
					:name="pageSizeRadioName"
					:value="size"
					:modelValue="pageSize"
					@update:modelValue="setPageSize">
					{{ size }}
				</NcActionRadio>
			</NcActions>
		</div>
	</nav>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

import { mdiChevronLeft, mdiChevronRight, mdiPageFirst, mdiPageLast } from '@mdi/js'
import { computed, inject, nextTick, ref, useTemplateRef, watch, watchPostEffect } from 'vue'
import { routerKey } from 'vue-router'
import NcActionCaption from '../NcActionCaption/NcActionCaption.vue'
import NcActionInput from '../NcActionInput/NcActionInput.vue'
import NcActionRadio from '../NcActionRadio/NcActionRadio.vue'
import NcActions from '../NcActions/NcActions.vue'
import NcButton from '../NcButton/NcButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { t } from '../../l10n.ts'
import { createElementId } from '../../utils/createElementId.ts'

/**
 * The current page, starting at 1.
 * When the page does not exist, it moves to the last page there is, except while `totalItems` is `0`, for example while the items load.
 */
const page = defineModel<number>('page', {
	default: 1,
	validator: (value: number) => Number.isInteger(value) && value >= 1,
})

/**
 * The number of items shown per page. Choosing another size in the menu goes back to the first page.
 */
const pageSize = defineModel<number>('pageSize', {
	default: 25,
	validator: (value: number) => Number.isInteger(value) && value >= 1,
})

const props = withDefaults(defineProps<{
	/**
	 * The total number of items over all pages.
	 */
	totalItems: number

	/**
	 * The page sizes to offer in a menu after the pages, for example `[10, 25, 50, 100]`.
	 * Without them there is no menu, and every page holds `pageSize` items.
	 *
	 * @default []
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
	 * Takes precedence over `pageHref`. Without a router it is ignored.
	 */
	pageTo?: (page: number) => RouteLocationRaw
}>(), {
	pageSizeOptions: () => [],
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
// Like NcButton: `page-to` only makes links with a router, else the pages stay buttons
const hasVueRouterContext = inject(routerKey, null) !== null
const isLink = computed(() => Boolean(props.pageHref || (props.pageTo && hasVueRouterContext)))

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

// The compact layout has no page numbers, so it shows which items are visible
const rangeText = computed(() => {
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
	return { href: props.pageHref?.(target), to: hasVueRouterContext ? props.pageTo?.(target) : undefined }
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

// The open menu: the page sizes or one of the "…" menus, so choosing closes it
const openMenu = ref<string | null>(null)
// The page typed after "…"
const jumpTarget = ref<number | string>('')
const pageSizeRadioName = 'nc-pagination-size-' + createElementId()

/**
 * Open or close a menu.
 *
 * @param menu - The menu
 * @param open - Whether it is open now
 */
function toggleMenu(menu: string, open: boolean) {
	openMenu.value = open ? menu : null
	jumpTarget.value = ''
}

/**
 * Go to the page typed after "…". Also when the pages are links, as there is no link to
 * follow then: the page is emitted, for the URL to follow it.
 */
function jumpToPage() {
	const target = Number(jumpTarget.value)
	if (!Number.isInteger(target) || target < 1 || target > totalPages.value) {
		return
	}
	toggleMenu('', false)
	if (target !== page.value) {
		page.value = target
	}
}

/**
 * Change the page size, and go back to the first page.
 *
 * @param size - The newly chosen page size
 */
function setPageSize(size: number | string) {
	toggleMenu('', false)
	if (typeof size === 'number' && size !== pageSize.value) {
		pageSize.value = size
		page.value = 1
	}
}
</script>

<style lang="scss" module>
// Three columns of which the outer two share the space equally, so the page buttons
// stay centered with the page size menu after them
.ncPagination {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	gap: calc(4 * var(--default-grid-baseline));
	padding-block: calc(3 * var(--default-grid-baseline));
}

.ncPagination__info {
	color: var(--color-text-maxcontrast);
	white-space: nowrap;
}

.ncPagination__nav {
	display: flex;
	grid-column: 2;
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
	grid-column: 3;
	justify-content: flex-end;
}

// The range on one side and the two buttons on the other
.ncPagination_compact {
	display: flex;
	justify-content: space-between;

	.ncPagination__info {
		font-size: var(--font-size-small);
	}
}
</style>
