<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to be used in the Nextcloud top header.

```
<template>
	<div id="nextcloud-header">
		<NcHeaderMenu id="search"
			aria-label="Search">
			<template #trigger>
				<Magnify />
			</template>
			<div>
				<NcTextField label="Search for files, comments, contacts…"
					style="padding-inline: 8px;"
					type="search"
					v-model="query" />
				<NcEmptyContent
					name="Search"
					:description="query ? `No results for '${query}'` : 'Start typing to search'">
					<template #icon>
						<Magnify />
					</template>
				</NcEmptyContent>
			</div>
		</NcHeaderMenu>
	</div>
</template>
<script>
import Magnify from 'vue-material-design-icons/Magnify'

export default {
	components: {
		Magnify,
	},
	data() {
		return {
			query: '',
		}
	},
}
</script>
<style>
#nextcloud-header {
	display: flex;
	justify-content: right;
	background-color: var(--color-primary);
	height: var(--header-height, 50px);
	padding-inline-end: 12px;
}
</style>
```
</docs>

<template>
	<component :is="wrapperTag"
		:id="id"
		ref="headerMenu"
		:aria-labelledby="isNav ? triggerId : null"
		:class="{ 'header-menu--opened': isOpened }"
		class="header-menu"
		@focusout="onFocusOut">
		<!-- Trigger -->
		<NcButton :id="isNav ? triggerId : null"
			ref="triggerButton"
			type="tertiary-no-background"
			class="header-menu__trigger"
			:aria-label="ariaLabel"
			:aria-describedby="description ? descriptionId : null"
			:aria-controls="`header-menu-${id}`"
			:aria-expanded="isOpened.toString()"
			size="large"
			@click.prevent="toggleMenu">
			<template #icon>
				<slot name="trigger" />
			</template>
		</NcButton>

		<span v-if="description"
			:id="descriptionId"
			class="header-menu__description hidden-visually">
			{{ description }}
		</span>

		<!-- Visual triangle -->
		<div v-show="isOpened" class="header-menu__caret" />

		<!-- Menu opened content -->
		<div v-show="isOpened"
			:id="`header-menu-${id}`"
			class="header-menu__wrapper">
			<div ref="contentContainer" class="header-menu__content">
				<slot />
			</div>
		</div>
	</component>
</template>

<script setup lang="ts">
import type { FocusTrap } from 'focus-trap'

import { onClickOutside } from '@vueuse/core'
import { createFocusTrap } from 'focus-trap'
import { computed, nextTick, ref, useTemplateRef, watch, type Slot } from 'vue'
import { getTrapStack } from '../../utils/focusTrap.js'
import { useHotKey } from '../../composables/index.js'

import GenRandomId from '../../utils/GenRandomId.js'
import NcButton from '../NcButton/index.ts'

const {
	excludeClickOutsideSelectors = [],
	open = false,
	isNav = false,
} = defineProps<{
	/**
	 * Unique id for this menu
	 */
	id: string

	/**
	 * aria-label attribute of the menu open button
	 */
	ariaLabel?: string

	/**
	 * Current menu open state
	 */
	open?: boolean

	/**
	 * Pass `true` if the header menu is used for website navigation
	 *
	 * The wrapper tag will be set to `nav` and its `aria-labelledby`
	 * will be associated with the menu open button
	 */
	isNav?: boolean

	/**
	 * Additional visually hidden description text for the menu
	 * open button
	 */
	description?: string

	/**
	 * A query-selector or an array of query-selectors
	 * to be ignored when clicking outside an element
	 */
	excludeClickOutsideSelectors?: string | string[]
}>()

const emit = defineEmits<{
	/** Emitted when the menu is fully closed (animation done) */
	closed: []

	/** Emitted when the menu is fully opened (animation done) */
	opened: []

	/** Updated open state */
	'update:open': [v: boolean]
}>()

defineSlots<{
	/** The menu content */
	default: Slot
	/** Icon trigger slot. Make sure the svg path is at least 16px. Usually mdi icon works at 20px */
	trigger: Slot
}>()

/** Id of the menu description */
const descriptionId = GenRandomId()
/** Id of the trigger button */
const triggerId = GenRandomId()
/** The active focus trap (if any) */
const focusTrap = ref<FocusTrap>()
/** Is the menu currently opened */
const isOpened = ref(open)
/** HTML tag to use for the header menu */
const wrapperTag = computed(() => isNav ? 'nav' : 'div')

/** The menu content container element */
const contentContainer = useTemplateRef('contentContainer')
/** The overall header menu wrapping element (<nav> or <div>) */
const headerMenu = useTemplateRef<HTMLElement>('headerMenu')
/** The menu trigger button */
const triggerButton = useTemplateRef('triggerButton')

// Handle click outside of the menu -> should close the menu
const ignore = computed(() => Array.isArray(excludeClickOutsideSelectors)
	? excludeClickOutsideSelectors
	: excludeClickOutsideSelectors.split(' '),
)
onClickOutside(headerMenu, () => setMenuState(false), { ignore })

// Pressing escape should close the menu
useHotKey('Escape', () => setMenuState(false), { prevent: true })

// Watch the open prop to adjust the internal opened state
watch(() => open, (state: boolean) => setMenuState(state))

/**
 * Toggle the current menu open state
 */
function toggleMenu() {
	setMenuState(!isOpened.value)
}

/**
 * Set the menu opened state
 * @param state The opened state to set
 */
async function setMenuState(state: boolean) {
	if (state === isOpened.value) {
		return
	}

	isOpened.value = state
	emit('update:open', state)

	// wait one tick to make sure the rendering finished
	await nextTick()
	// either add or clear the focus trap
	await (state ? addFocusTrap() : clearFocusTrap())

	// Emit signal to mark finished toggling
	// @ts-expect-error This seems to be broken in Vue's typescript macro compiler...
	emit(state ? 'opened' : 'closed')
}

/**
 * When this is role navigation, then we cannot apply a focus trap.
 * In this case we close the menu on focus-out.
 */
function onFocusOut(event: FocusEvent) {
	// Is not a navigation
	if (!isNav) {
		return
	}

	// Event target is not a node
	if (!(event.relatedTarget instanceof Node)) {
		return
	}

	if (headerMenu.value?.contains(event.relatedTarget)) {
		setMenuState(false)
	}
}

/**
 * Add focus trap for accessibility.
 * Shall only be used when all children are mounted
 * and available in the DOM. We use $nextTick for that.
 */
async function addFocusTrap() {
	// We cannot add the focus trap on navigation roles
	// also skip if already set
	if (isNav || focusTrap.value) {
		return
	}

	// Init focus trap
	focusTrap.value = createFocusTrap(contentContainer.value!, {
		allowOutsideClick: true,
		trapStack: getTrapStack(),
		fallbackFocus: triggerButton.value?.$el,
	})
	focusTrap.value.activate()
}

/**
 * Deactivate and clear the focus trap
 */
function clearFocusTrap() {
	focusTrap.value?.deactivate()
	focusTrap.value = undefined
}
</script>

<style lang="scss" scoped>
// content inner and outer margin
// Also used for menu top-right positioning
$externalMargin: 8px;

@import './header-menu__trigger';

.header-menu {
	&__wrapper {
		position: fixed;
		z-index: 2000;
		top: var(--header-height);
		inset-inline-end: 0;
		box-sizing: border-box;
		margin: 0 $externalMargin;
		border-radius: 0 0 var(--border-radius) var(--border-radius);
		border-radius: var(--border-radius-large);
		background-color: var(--color-main-background);

		filter: drop-shadow(0 1px 5px var(--color-box-shadow));
	}

	&__carret {
		position: absolute;
		z-index: 2001; // Because __wrapper is 2000.
		bottom: 0;
		inset-inline-start: calc(50% - 10px);
		width: 0;
		height: 0;
		content: ' ';
		pointer-events: none;
		border: 10px solid transparent;
		border-bottom-color: var(--color-main-background);
	}

	&__content {
		overflow: auto;
		width: 350px;
		max-width: calc(100vw - 2 * $externalMargin);
		min-height: calc(var(--default-clickable-area) * 1.5);
		max-height: calc(100vh - var(--header-height) * 2);
		:deep(.empty-content) {
			margin: 12vh 10px;
		}
	}
}
</style>
