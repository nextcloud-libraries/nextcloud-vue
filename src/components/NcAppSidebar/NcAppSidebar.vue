<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { FocusTrap } from 'focus-trap'
import type { Slot } from 'vue'

import { vOnClickOutside as vClickOutside } from '@vueuse/components'
import { createFocusTrap } from 'focus-trap'
import { computed, getCurrentInstance, inject, onBeforeUnmount, provide, ref, useTemplateRef, warn, watch } from 'vue'
import IconArrowRight from 'vue-material-design-icons/ArrowRight.vue'
import IconClose from 'vue-material-design-icons/Close.vue'
import IconDockRight from 'vue-material-design-icons/DockRight.vue'
import IconStar from 'vue-material-design-icons/Star.vue'
import IconStarOutline from 'vue-material-design-icons/StarOutline.vue'
import NcAppSidebarTabs from './NcAppSidebarTabs.vue'
import { useIsSmallMobile } from '../../composables/useIsMobile/index.ts'
import vFocus from '../../directives/Focus/index.ts'
import { t } from '../../l10n.ts'
import { createElementId } from '../../utils/createElementId.ts'
import { getTrapStack } from '../../utils/focusTrap.ts'
import { isSlotPopulated } from '../../utils/isSlotPopulated.ts'
import { logger } from '../../utils/logger.ts'
import NcActions from '../NcActions/index.js'
import NcAppSidebarHeader from '../NcAppSidebarHeader/index.ts'
import NcButton from '../NcButton/index.ts'
import { CONTENT_SELECTOR_KEY } from '../NcContent/constants.ts'
import NcEmptyContent from '../NcEmptyContent/index.ts'
import NcLoadingIcon from '../NcLoadingIcon/index.ts'

/**
 * Enable the favourite icon if not null.
 * Without `v-model:starred` the state is toggled locally.
 */
const isStarred = defineModel<boolean | null>('starred', { default: null })

const {
	active = '',
	background = '',
	compact = false,
	empty = false,
	forceMenu = false,
	forceTabs = false,
	linkifyName = false,
	loading = false,
	name,
	nameEditable = false,
	namePlaceholder = '',
	noToggle = false,
	open = true,
	starLoading = false,
	subname = '',
	subtitle = '',
	title = '',
	toggleAttrs = undefined,
	toggleClasses = '',
} = defineProps<{
	/**
	 * The active tab
	 */
	active?: string

	/**
	 * Main text of the sidebar
	 */
	name: string

	/**
	 * Allow to edit the sidebar name.
	 */
	nameEditable?: boolean

	/**
	 * Placeholder in the edit field if the name is editable.
	 */
	namePlaceholder?: string

	/**
	 * Secondary name of the sidebar (subline)
	 */
	subname?: string

	/**
	 * Title to display for the subname.
	 */
	subtitle?: string

	/**
	 * Url to the top header background image
	 * Applied with css
	 */
	background?: string

	/**
	 * Show loading spinner instead of the star icon
	 */
	starLoading?: boolean

	/**
	 * Show loading spinner instead of tabs
	 */
	loading?: boolean

	/**
	 * Display the sidebar in compact mode
	 */
	compact?: boolean

	/**
	 * Only display close button and default slot content.
	 * Don't display other header content and primary and secondary actions.
	 * Useful when showing the EmptyContent component as content.
	 */
	empty?: boolean

	/**
	 * Force the actions to display in a three dot menu
	 */
	forceMenu?: boolean

	/**
	 * Force the tab navigation to display even if there is only one tab
	 */
	forceTabs?: boolean

	/**
	 * Linkify the name
	 */
	linkifyName?: boolean

	/**
	 * Title to display for the name.
	 * Can be set to the same text in case it's too long.
	 */
	title?: string

	/**
	 * Allow to conditionally show the sidebar
	 * You can also use `v-if` on the sidebar, but using the open prop allow to keep
	 * the sidebar inside the DOM for performance if it is opened and closed multiple times.
	 *
	 * When using the `open` property to close the sidebar a built-in toggle button will be shown to reopen it,
	 * similar to the app navigation. You can remove this button with the `no-toggle` prop.
	 *
	 * @default true
	 */
	open?: boolean

	/**
	 * Custom classes to assign to the sidebar toggle button.
	 * If needed this can be used to assign styles to the button using `:deep()` selector.
	 */
	toggleClasses?: string | unknown[] | Record<string, unknown>

	/**
	 * Custom attrs to assign to the sidebar toggle button.
	 */
	toggleAttrs?: Record<string, unknown>

	/**
	 * Do not add the built-in toggle button with `open` prop.
	 */
	noToggle?: boolean
}>()

const emit = defineEmits<{
	/**
	 * The user clicked to close the sidebar
	 *
	 * @param event - The close button click event (if any)
	 */
	close: [event?: Event]

	/**
	 * The sidebar is closed and the transition is complete
	 *
	 * @param element - The sidebar element (not set if the sidebar is unmounted)
	 */
	closed: [element?: Element]

	/**
	 * The sidebar is opened and the transition is complete
	 *
	 * @param element - The sidebar element
	 */
	opened: [element: Element]

	/**
	 * The active tab changed
	 *
	 * @param active - The id of the active tab
	 */
	'update:active': [active: string]

	/**
	 * Emitted when the name value changes
	 *
	 * @param name - The new name
	 */
	'update:name': [name: string]

	/**
	 * Emitted when the nameEditable value changes
	 *
	 * @param nameEditable - The new editable state
	 */
	'update:nameEditable': [nameEditable: boolean]

	/**
	 * Current open state emitted after the transitions are finished
	 *
	 * @param open - The new open state
	 */
	'update:open': [open: boolean]

	/**
	 * The figure / background header has been clicked.
	 * The figure is only styled as clickable if there is a listener for this event.
	 *
	 * @param event - The click or keyboard event
	 */
	figureClick: [event: MouseEvent | KeyboardEvent]

	/**
	 * Emitted when the name edit input has been submitted
	 *
	 * @param event - The submit event (not set if submitted by clicking outside)
	 */
	submitName: [event?: Event]

	/**
	 * Emitted when the name edit has been cancelled
	 */
	dismissEditing: []
}>()

defineSlots<{
	/**
	 * Tabs (NcAppSidebarTab components) or any other content of the sidebar
	 */
	default?: Slot

	/**
	 * Alternative to the default header info: use for bare NcAppSidebar with tabs.
	 * NcAppSidebarHeader would be required to use for accessibility reasons.
	 * This will be overridden by `empty` prop.
	 */
	info?: Slot

	/**
	 * Custom header figure, alternative to the `background` prop
	 */
	header?: Slot

	/**
	 * Custom tertiary actions of the header (left of the name), replaces the favorite button
	 */
	'tertiary-actions'?: Slot

	/**
	 * Secondary actions of the header (NcAction* components) shown in a menu next to the name
	 */
	'secondary-actions'?: Slot

	/**
	 * Alternative to the `subname` prop can be used for more complex content.
	 * It will be rendered within a `p` tag.
	 */
	subname?: Slot

	/**
	 * Additional description shown below the header
	 */
	description?: Slot

	/**
	 * Custom icon for the toggle button, defaults to the dock-right icon from MDI
	 */
	'toggle-icon'?: Slot
}>()

defineExpose({
	focus,
	focusActiveTabContent,
})

const ncContentSelector = inject(CONTENT_SELECTOR_KEY, undefined)

const headerRef = ref<HTMLElement | null>(null)
provide('NcAppSidebar:header:ref', headerRef)

const uid = createElementId()
const isMobile = useIsSmallMobile()

const changeNameTranslated = t('Change name')
const closeTranslated = t('Close sidebar')
const favoriteTranslated = t('Favorite')

const sidebarElement = useTemplateRef('sidebar')
const toggleButton = useTemplateRef('toggle')
const closeButtonInstance = useTemplateRef('closeButton')
const tabsInstance = useTemplateRef('tabs')

const instance = getCurrentInstance()!

const canStar = computed(() => isStarred.value !== null)

let focusTrap: FocusTrap | null = null
let elementToReturnFocus: HTMLElement | null = null
/** Whether `opened` was emitted without a matching `closed` */
let isOpened = false

watch(isMobile, toggleFocusTrap)
watch(() => open, checkToggleButtonContainerAvailability)

preserveElementToReturnFocus()
checkToggleButtonContainerAvailability()

onBeforeUnmount(() => {
	// Make sure that the 'closed' event is dispatched even if this element is destroyed before the 'after-leave' event is received.
	if (isOpened) {
		isOpened = false
		emit('closed')
	}
	focusTrap?.deactivate()
})

/**
 * Check if the parent listens to `figure-click`.
 * Called on render, as listeners of declared events are neither reactive props nor attrs.
 */
function hasFigureClickListener() {
	const props = instance.vnode.props
	return !!(props?.onFigureClick || props?.onFigureClickOnce)
}

/**
 * Save the element that had focus before the sidebar was opened to return back on close
 */
function preserveElementToReturnFocus() {
	if (document.activeElement && document.activeElement !== document.body) {
		elementToReturnFocus = document.activeElement as HTMLElement

		// Special case for menus (NcActions)
		// If a sidebar was opened from a menu item, we want to return focus to the menu trigger instead of the item
		if (elementToReturnFocus.getAttribute('role') === 'menuitem') {
			const menu = elementToReturnFocus.closest('[role="menu"]')
			const menuTrigger = menu?.id
				? document.querySelector<HTMLElement>(`[aria-controls="${CSS.escape(menu.id)}"]`)
				: null
			if (menuTrigger) {
				elementToReturnFocus = menuTrigger
			}
		}
	}
}

/**
 * Create the focus trap if not already done
 */
function initFocusTrap() {
	if (focusTrap) {
		return focusTrap
	}

	focusTrap = createFocusTrap([
		// The sidebar itself
		sidebarElement.value!,
		// Nextcloud Server header navigation
		document.querySelector<HTMLElement>('#header'),
	].filter((element) => element !== null), {
		allowOutsideClick: true,
		fallbackFocus: closeButtonInstance.value!.$el,
		trapStack: getTrapStack(),
		escapeDeactivates: false,
	})
	return focusTrap
}

/**
 * Activate focus trap if it is currently needed, otherwise deactivate
 */
function toggleFocusTrap() {
	if (open && isMobile.value) {
		initFocusTrap().activate()
	} else {
		focusTrap?.deactivate()
	}
}

/**
 * Close the sidebar on pressing the escape key on mobile
 *
 * @param event - The key down event
 */
function onKeydownEsc(event: KeyboardEvent) {
	if (isMobile.value) {
		event.stopPropagation()
		closeSidebar()
	}
}

/**
 * Handle the sidebar open transition finished
 *
 * @param element - The sidebar element
 */
function onAfterEnter(element: Element) {
	// Focus sidebar on open only if it was opened by a user interaction
	if (elementToReturnFocus) {
		focus()
	}

	toggleFocusTrap()
	isOpened = true
	emit('opened', element)
}

/**
 * Handle the sidebar close transition finished
 *
 * @param element - The sidebar element
 */
function onAfterLeave(element: Element) {
	isOpened = false
	emit('closed', element)

	toggleFocusTrap()

	// Return focus to the element that had focus before the sidebar was opened
	elementToReturnFocus?.focus({ focusVisible: true } as FocusOptions)
	elementToReturnFocus = null
}

/**
 * Used to tell parent component the user asked to close the sidebar
 *
 * @param event - The close button click event
 */
function closeSidebar(event?: Event) {
	emit('close', event)
	emit('update:open', false)
}

/**
 * Toggle the favourite state
 * and emit to the parent component
 */
function toggleStarred() {
	isStarred.value = !isStarred.value
}

/**
 * Request to edit the name, the name input is focused by `v-focus` when it is shown
 */
function editName() {
	emit('update:nameEditable', true)
}

/**
 * Focus the sidebar
 */
function focus() {
	if (!open && !noToggle) {
		toggleButton.value?.$el.focus()
		return
	}

	try {
		headerRef.value!.focus()
	} catch {
		warn('NcAppSidebar should have focusable header for accessibility reasons. Use NcAppSidebarHeader component.')
	}
}

/**
 * Focus the active tab
 */
function focusActiveTabContent() {
	// If a tab is focused then probably a new trigger element moved the focus to the sidebar
	preserveElementToReturnFocus()

	tabsInstance.value?.focusActiveTabContent()
}

/**
 * Check if the toggle button container is available
 */
function checkToggleButtonContainerAvailability() {
	// Toggle button must be rendered, but there is no element to teleport it to
	if (open === false && !noToggle && !ncContentSelector) {
		logger.warn('[NcAppSidebar] It looks like you want to use NcAppSidebar with the built-in toggle button. This feature is only available when NcAppSidebar is used in NcContent.')
	}
}

/**
 * Emit name change event to parent component
 *
 * @param event - The input event
 */
function onNameInput(event: Event) {
	emit('update:name', (event.target as HTMLInputElement).value)
}

/**
 * Emit when the name form edit confirm button is pressed in order
 * to change the name.
 *
 * @param event - The submit event
 */
function onSubmitName(event?: Event) {
	// Disable editing
	emit('update:nameEditable', false)
	emit('submitName', event)
}

/**
 * Cancel editing the name
 */
function onDismissEditing() {
	// Disable editing
	emit('update:nameEditable', false)
	emit('dismissEditing')
}
</script>

<template>
	<transition
		appear
		name="slide-right"
		@afterEnter="onAfterEnter"
		@afterLeave="onAfterLeave">
		<aside
			v-show="open"
			id="app-sidebar-vue"
			ref="sidebar"
			class="app-sidebar"
			:aria-labelledby="`app-sidebar-vue-${uid}__header`"
			@keydown.esc="onKeydownEsc">
			<!--
				We cannot render toggle button inside sidebar (aside#app-sidebar-vue), because it is hidden then the toggle is needed.
				But we also need transition with the sidebar to be the root of this component to use it as a single UI element, allowing to use `v-show`.
				So we cannot render the toggle button directly in this component.
				As a simple solution - render it in the content to keep correct position.
			-->
			<Teleport v-if="ncContentSelector && !open && !noToggle" :to="ncContentSelector">
				<NcButton
					ref="toggle"
					:aria-label="t('Open sidebar')"
					class="app-sidebar__toggle"
					:class="toggleClasses"
					variant="tertiary"
					v-bind="toggleAttrs"
					@click="emit('update:open', true)">
					<template #icon>
						<slot name="toggle-icon">
							<IconDockRight :size="20" />
						</slot>
					</template>
				</NcButton>
			</Teleport>

			<header
				class="app-sidebar-header"
				:class="{
					'app-sidebar-header--with-figure': isSlotPopulated($slots.header?.()) || background,
					'app-sidebar-header--compact': compact,
				}">
				<slot v-if="!empty" name="info">
					<!-- container for figure and description, allows easy switching to compact mode -->
					<div class="app-sidebar-header__info">
						<!-- sidebar header illustration/figure -->
						<div
							v-if="(isSlotPopulated($slots.header?.()) || background)"
							class="app-sidebar-header__figure"
							:class="{
								'app-sidebar-header__figure--with-action': hasFigureClickListener(),
							}"
							:style="{
								backgroundImage: `url(${background})`,
							}"
							tabindex="0"
							@click="emit('figureClick', $event)"
							@keydown.enter="emit('figureClick', $event)">
							<slot class="app-sidebar-header__background" name="header" />
						</div>

						<!-- sidebar details -->
						<div
							class="app-sidebar-header__desc"
							:class="{
								'app-sidebar-header__desc--with-tertiary-action': canStar || isSlotPopulated($slots['tertiary-actions']?.()),
								'app-sidebar-header__desc--editable': nameEditable && !subname,
								'app-sidebar-header__desc--with-subname--editable': nameEditable && subname,
								'app-sidebar-header__desc--without-actions': !isSlotPopulated($slots['secondary-actions']?.()),
							}">
							<!-- favourite icon -->
							<div v-if="canStar || isSlotPopulated($slots['tertiary-actions']?.())" class="app-sidebar-header__tertiary-actions">
								<slot name="tertiary-actions">
									<NcButton
										v-if="canStar"
										:aria-label="favoriteTranslated"
										:pressed="!!isStarred"
										class="app-sidebar-header__star"
										variant="secondary"
										@click.prevent="toggleStarred">
										<template #icon>
											<NcLoadingIcon v-if="starLoading" />
											<IconStar v-else-if="isStarred" :size="20" />
											<IconStarOutline v-else :size="20" />
										</template>
									</NcButton>
								</slot>
							</div>

							<!-- name -->
							<div class="app-sidebar-header__name-container">
								<div class="app-sidebar-header__mainname-container">
									<!-- main name -->
									<NcAppSidebarHeader
										v-show="!nameEditable"
										class="app-sidebar-header__mainname"
										:name
										:linkify="linkifyName"
										:title
										:tabindex="nameEditable ? 0 : -1"
										@click.self="editName" />
									<template v-if="nameEditable">
										<form
											v-click-outside="() => onSubmitName()"
											class="app-sidebar-header__mainname-form"
											@submit.prevent="onSubmitName">
											<input
												v-focus
												class="app-sidebar-header__mainname-input"
												type="text"
												:placeholder="namePlaceholder"
												:value="name"
												@keydown.esc.stop="onDismissEditing"
												@input="onNameInput">
											<NcButton
												:aria-label="changeNameTranslated"
												type="submit"
												variant="tertiary-no-background">
												<template #icon>
													<IconArrowRight :size="20" />
												</template>
											</NcButton>
										</form>
									</template>
									<!-- header main menu -->
									<NcActions
										v-if="isSlotPopulated($slots['secondary-actions']?.())"
										class="app-sidebar-header__menu"
										:forceMenu="forceMenu">
										<slot name="secondary-actions" />
									</NcActions>
								</div>
								<!-- secondary name -->
								<p
									v-if="subname.trim() !== '' || $slots['subname']"
									:title="subtitle || undefined"
									class="app-sidebar-header__subname">
									<slot name="subname">
										{{ subname }}
									</slot>
								</p>
							</div>
						</div>
					</div>
				</slot>
				<!-- a11y fallback for empty content -->
				<NcAppSidebarHeader
					v-else
					class="app-sidebar-header__mainname--hidden"
					:name
					tabindex="-1" />

				<NcButton
					ref="closeButton"
					:aria-label="closeTranslated"
					:title="closeTranslated"
					class="app-sidebar__close"
					variant="tertiary"
					@click.prevent="closeSidebar">
					<template #icon>
						<IconClose :size="20" />
					</template>
				</NcButton>

				<div v-if="isSlotPopulated($slots.description?.()) && !empty" class="app-sidebar-header__description">
					<slot name="description" />
				</div>
			</header>

			<NcAppSidebarTabs
				v-show="!loading"
				ref="tabs"
				:active="active"
				:forceTabs="forceTabs"
				@update:active="emit('update:active', $event)">
				<slot />
			</NcAppSidebarTabs>

			<NcEmptyContent v-if="loading">
				<template #icon>
					<NcLoadingIcon :size="64" />
				</template>
			</NcEmptyContent>
		</aside>
	</transition>
</template>

<style lang="scss">
// Allows to use transition over a custom CSS property (CSS Variable)
// Ignored on old browsers resulting in slightly noticeable jump
@property --app-sidebar-offset {
	syntax: '<length>';
	initial-value: 0;
	inherits: true;
}

body {
	/**
	 * The padding between the toggle button and the page border
	 */
	--app-sidebar-padding: calc(var(--default-grid-baseline, 4px) * 2);
	/**
	 * The minimal offset width required to be reserved for the toggle button.
	 * Automatically changes to 0 when there is no toggle button.
	 */
	--app-sidebar-offset: 0;
	// Explicitly disable transition by default to enable it only when sidebar animation is active
	// !important to override styles from an older version, because it's global non-scoped styles
	transition: --app-sidebar-offset 0ms !important;
}

// When AppSidebar is animation is active - also apply transition for the toggle button offset
body:has(.app-sidebar.slide-right-enter-active),
body:has(.app-sidebar.slide-right-leave-active) {
	transition: --app-sidebar-offset var(--animation-slow);
}

body:has(.app-sidebar__toggle) {
	--app-sidebar-offset: calc(var(--app-sidebar-padding) + var(--default-clickable-area));
}
</style>

<style lang="scss" scoped>
$desc-input-padding: 7px;

// name and subname
$desc-name-height: 30px;
$desc-subname-height: 22px;
$desc-height: $desc-name-height + $desc-subname-height;

/*
	Sidebar: to be used within #content
	app-content will be shrunk properly
*/
.app-sidebar {
	--app-sidebar-width: clamp(300px, 27vw, 500px);
	--app-sidebar-padding: #{$app-navigation-padding};
	width: var(--app-sidebar-width);

	z-index: 1500;
	top: 0;
	inset-inline-end: 0;
	display: flex;
	overflow-x: hidden;
	overflow-y: auto;
	flex-direction: column;
	flex-shrink: 0;
	height: 100%;
	border-inline-start: 1px solid var(--color-border);
	background: var(--color-main-background);
	// Make close button positioned relative to the header
	position: relative;

	&__toggle {
		position: absolute !important;
		inset-block-start: var(--app-sidebar-padding);
		inset-inline-end: var(--app-sidebar-padding);
		// app-content has z-index 1000 so we need 1001
		z-index: 1001;
	}

	.app-sidebar-header {
		// Variable for custom content to be aware of space taken by close button (from top-right corner)
		--app-sidebar-close-button-offset: calc(var(--default-clickable-area) + var(--app-sidebar-padding));

		> .app-sidebar__close {
			position: absolute;
			z-index: 100;
			top: var(--app-sidebar-padding);
			inset-inline-end: var(--app-sidebar-padding);
			width: var(--default-clickable-area);
			height: var(--default-clickable-area);
		}

		// Compact mode only affects a sidebar with a figure
		&--compact.app-sidebar-header--with-figure {
			.app-sidebar-header__info {
				flex-direction: row;

				.app-sidebar-header__figure {
					--figure-size: calc(#{$desc-height} + var(--app-sidebar-padding));
					z-index: 2;
					width: var(--figure-size);
					height: var(--figure-size);
					margin: calc(var(--app-sidebar-padding) / 2);
					border-radius: 3px;
					flex: 0 0 auto;
				}

				.app-sidebar-header__desc {
					padding-inline-start: 0;
					flex: 1 1 auto;
					min-width: 0;
					padding-inline-end: calc(var(--default-clickable-area) + var(--app-sidebar-close-button-offset));
					padding-top: var(--app-sidebar-padding);

					&.app-sidebar-header__desc--without-actions {
						padding-inline-end: var(--app-sidebar-close-button-offset);
					}

					.app-sidebar-header__tertiary-actions {
						z-index: 3; // above star
						position: absolute;
						top: calc(var(--app-sidebar-padding) / 2);
						inset-inline-start: calc(-1 * var(--default-clickable-area));
						gap: 0; // override gap
					}

					.app-sidebar-header__menu {
						top: var(--app-sidebar-padding);
						inset-inline-end: var(--app-sidebar-close-button-offset); // left of the close button
						position: absolute;
					}
				}
			}
		}

		// sidebar without figure
		&:not(.app-sidebar-header--with-figure) {
			// align the menu with the close button
			.app-sidebar-header__menu {
				position: absolute;
				top: var(--app-sidebar-padding);
				inset-inline-end: var(--app-sidebar-close-button-offset);
			}

			// increase the padding to not overlap the menu
			.app-sidebar-header__desc {
				padding-inline-end: calc(var(--default-clickable-area) + var(--app-sidebar-close-button-offset));

				&.app-sidebar-header__desc--without-actions {
					padding-inline-end: var(--app-sidebar-close-button-offset);
				}
			}
		}

		// the container with the figure and the description
		.app-sidebar-header__info {
			display: flex;
			flex-direction: column;
		}

		// header background
		&__figure {
			width: 100%;
			height: 250px;
			max-height: 250px;
			background-repeat: no-repeat;
			background-position: center;
			background-size: contain;

			&--with-action {
				cursor: pointer;
			}
		}

		// description
		&__desc {
			position: relative;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding-inline: var(--app-sidebar-padding);
			padding-block: var(--app-sidebar-padding) calc(var(--app-sidebar-padding) / 2);
			gap: 0 4px;

			// custom overrides
			&--with-tertiary-action {
				padding-inline-start: 6px;
			}

			&--editable .app-sidebar-header__mainname-form,
			&--with-subname--editable .app-sidebar-header__mainname-form {
				margin-top: -2px;
				margin-bottom: -2px;
			}

			&--with-subname--editable .app-sidebar-header__subname {
				margin-top: -2px;
			}

			.app-sidebar-header__tertiary-actions {
				display: flex;
				height: var(--default-clickable-area);
				width: var(--default-clickable-area);
				justify-content: center;
				flex: 0 0 auto;

				.app-sidebar-header__star {
					// Override default Button component styles
					box-shadow: none;

					&:not([aria-pressed='true']):hover {
						box-shadow: none;
						background-color: var(--color-background-hover);
					}
				}
			}

			// names
			.app-sidebar-header__name-container {
				flex: 1 1 auto;
				display: flex;
				flex-direction: column;
				justify-content: center;
				min-width: 0;

				.app-sidebar-header__mainname-container {
					display: flex;
					align-items: center;
					min-height: var(--default-clickable-area);

					// main name
					.app-sidebar-header__mainname {
						padding: 0;
						min-height: 30px;
						font-size: 20px;
						line-height: $desc-name-height;

						// Needs 'deep' as the link is generated by the linkify directive
						&:deep(.linkified) {
							cursor: pointer;
							text-decoration: underline;
							margin: 0;
						}
					}

					.app-sidebar-header__mainname-form {
						display: flex;
						flex: 1 1 auto;
						align-items: center;

						input.app-sidebar-header__mainname-input {
							flex: 1 1 auto;
							margin: 0;
							padding: $desc-input-padding;
							font-size: 20px;
							font-weight: var(--font-weight-heading, bold);
						}
					}

					// main menu
					.app-sidebar-header__menu {
						margin-inline-start: 5px;
					}
				}

				// shared between main and subname
				.app-sidebar-header__mainname,
				.app-sidebar-header__subname {
					overflow: hidden;
					width: 100%;
					margin: 0;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				// subname
				.app-sidebar-header__subname {
					color: var(--color-text-maxcontrast);
					font-size: var(--default-font-size);
					padding: 0;

					* {
						vertical-align: text-bottom;
					}
				}
			}
		}

		// Hidden a11y fallback
		.app-sidebar-header__mainname--hidden {
			position: absolute;
			top: 0;
			inset-inline-start: 0;
			margin: 0;
			width: 1px;
			height: 1px;
			overflow: hidden;
		}

		// sidebar description slot
		&__description {
			display: flex;
			align-items: center;
			margin: 0 10px;
		}
	}
}

// Make the sidebar full-width on small screens
@media only screen and (max-width: $breakpoint-small-mobile) {
	.app-sidebar {
		position: absolute;
		--app-sidebar-width: 100vw;
	}
}

.slide-right-leave-active,
.slide-right-enter-active {
	transition-duration: var(--animation-slow);
	transition-property: margin-inline-end;
}

.slide-right-enter-to,
.slide-right-leave {
	margin-inline-end: 0;
}

.slide-right-enter-from,
.slide-right-leave-to {
	margin-inline-end: calc(-1 * var(--app-sidebar-width));
}
</style>

<docs>
### Exposed CSS Variables

| Variable                | Description                                                                                                                               |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `--app-sidebar-padding` | The padding between the toggle button and the page border.                                                                                |
| `--app-sidebar-offset`  | The minimal offset width required to be reserved for the toggle button. <br /> Automatically changes to 0 when there is no toggle button. |

### Exposed methods

Only these methods are available on a template ref of the component:

| Method                    | Description                                                                         |
|---------------------------|-------------------------------------------------------------------------------------|
| `focus()`                 | Focus the sidebar header, or the toggle button if the sidebar is closed.            |
| `focusActiveTabContent()` | Focus the content of the active tab.                                                |

Use the props and events (e.g. `v-model:open`, `v-model:starred`) instead of calling internal methods.

### General description

This component provides a way to include the standardised sidebar.
The standard properties like name, subname, starred, etc. allow to automatically
include a standard-header like it's used by the files app.

To conditionally show the sidebar either use `v-if` on the sidebar component,
or use the `open` property of the component to control the state.
Using `v-show` directly will result in usability issues due to internal focus trap handling.

### Standard usage

```vue
<template>
	<div class="content-styleguidist">
		<main id="content-styleguidist-1" />
		<NcAppSidebar
			v-model:open="open"
			:starred="starred"
			name="cat-picture.jpg"
			subname="last edited 3 weeks ago"
			background="https://nextcloud.com/wp-content/uploads/2022/08/nextcloud-logo-icon.svg"
			@figure-click="figureClick">
			<NcAppSidebarTab name="Search" id="search-tab">
				<template #icon>
					<NcIconSvgWrapper :path="mdiMagnify" />
				</template>
				Search tab content
			</NcAppSidebarTab>
			<NcAppSidebarTab name="Settings" id="settings-tab">
				<!-- The active tab uses the filled icon variant -->
				<template #icon="{ selected }">
					<NcIconSvgWrapper :path="mdiCog" v-if="selected" />
					<NcIconSvgWrapper :path="mdiCogOutline" v-else />
				</template>
				Settings tab content
			</NcAppSidebarTab>
			<NcAppSidebarTab name="Sharing" id="share-tab">
				<template #icon="{ selected }">
					<NcIconSvgWrapper :path="mdiShareVariant" v-if="selected" />
					<NcIconSvgWrapper :path="mdiShareVariantOutline" v-else />
				</template>
				Sharing tab content
			</NcAppSidebarTab>
		</NcAppSidebar>
	</div>
</template>

<script>
	import { mdiCog, mdiCogOutline, mdiMagnify, mdiShareVariant, mdiShareVariantOutline } from '@mdi/js'

	export default {
		setup() {
			return {
				mdiCog,
				mdiCogOutline,
				mdiMagnify,
				mdiShareVariant,
				mdiShareVariantOutline,
			}
		},
		provide() {
			return {
				'NcContent:selector': '#content-styleguidist-1',
			}
		},
		data() {
			return {
				open: true,
				starred: false,
			}
		},
		methods: {
			figureClick() {
				alert('figure clicked')
			},
		},
	}
</script>

<style scoped>
	/* This styles just mock NcContent and NcAppContent */
	.content-styleguidist {
		--app-sidebar-padding: 8px;
		--app-sidebar-offset: calc(var(--app-sidebar-padding) + var(--default-clickable-area));
		display: flex;
		position: relative !important;
		/* Just to prevent jumping when the sidebar is hidden */
		min-height: 360px;
		overflow: hidden;

		main {
			width: 100%;
		}
	}

	/* Fix styles on this style guide page */
	@media only screen and (max-width: 512px) {
		:deep(aside) {
			width: calc(100vw - 64px) !important;
		}
	}
</style>
```

### Dynamic tabs

Sidebar tabs and their content can be changed dynamically.

Single tab is rendered without navigation, but it is possible to force it.

```vue
<template>
	<div class="content-styleguidist">
		<main id="content-styleguidist-2">
			<NcCheckboxRadioSwitch v-model="forceTabs">Force tab navigation</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="showTabs[0]">Show search tab</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="showTabs[1]">Show settings tab</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="showTabs[2]">Show sharing tab</NcCheckboxRadioSwitch>
		</main>
		<NcAppSidebar
			v-model:open="open"
			:force-tabs="forceTabs"
			name="cat-picture.jpg"
			subname="last edited 3 weeks ago">
			<NcAppSidebarTab v-if="showTabs[0]" name="Search" id="search-tab">
				<template #icon>
					<NcIconSvgWrapper :path="mdiMagnify" />
				</template>
				Search tab content
			</NcAppSidebarTab>
			<NcAppSidebarTab v-if="showTabs[1]" name="Settings" id="settings-tab">
				<template #icon="{ selected }">
					<NcIconSvgWrapper :path="mdiCog" v-if="selected" />
					<NcIconSvgWrapper :path="mdiCogOutline" v-else />
				</template>
				Settings
			</NcAppSidebarTab>
			<NcAppSidebarTab v-if="showTabs[2]" name="Sharing" id="share-tab">
				<template #icon="{ selected }">
					<NcIconSvgWrapper :path="mdiShareVariant" v-if="selected" />
					<NcIconSvgWrapper :path="mdiShareVariantOutline" v-else />
				</template>
				Sharing tab content
			</NcAppSidebarTab>
		</NcAppSidebar>
	</div>
</template>

<script>
	import { mdiCog, mdiCogOutline, mdiMagnify, mdiShareVariant, mdiShareVariantOutline } from '@mdi/js'

	export default {
		setup() {
			return {
				mdiCog,
				mdiCogOutline,
				mdiMagnify,
				mdiShareVariant,
				mdiShareVariantOutline,
			}
		},
		provide() {
			return {
				'NcContent:selector': '#content-styleguidist-2',
			}
		},
		data() {
			return {
				open: true,
				forceTabs: false,
				showTabs: [true, true, false],
			}
		},
	}
</script>

<style scoped>
	/* This styles just mock NcContent and NcAppContent */
	.content-styleguidist {
		--app-sidebar-padding: 8px;
		--app-sidebar-offset: calc(var(--app-sidebar-padding) + var(--default-clickable-area));
		display: flex;
		position: relative !important;
		/* Just to prevent jumping when the sidebar is hidden */
		min-height: 360px;
		overflow: hidden;

		main {
			width: 100%;
		}
	}

	/* Fix styles on this style guide page */
	@media only screen and (max-width: 512px) {
		:deep(aside) {
			width: calc(100vw - 64px) !important;
		}
	}
</style>
```

### Tabs order and programmatic activation

To customize the order of tabs, ``order`` prop can be used on child components.

``active`` prop on NcAppSidebar can be modified to show required tab as active

```vue
<template>
	<div class="content-styleguidist">
		<main id="content-styleguidist-3">
			<NcSelect v-model="active" :options="['search-tab', 'settings-tab', 'share-tab']"/>
		</main>
		<NcAppSidebar
			name="cat-picture.jpg"
			subname="last edited 3 weeks ago"
			v-model:open="open"
			v-model:active="active">
			<NcAppSidebarTab name="Search" id="search-tab" :order="3">
				<template #icon>
					<NcIconSvgWrapper :path="mdiMagnify" />
				</template>
				Search tab content
			</NcAppSidebarTab>
			<NcAppSidebarTab name="Settings" id="settings-tab" :order="2">
				<template #icon="{ selected }">
					<NcIconSvgWrapper :path="mdiCog" v-if="selected" />
					<NcIconSvgWrapper :path="mdiCogOutline" v-else />
				</template>
				Settings
			</NcAppSidebarTab>
			<NcAppSidebarTab name="Sharing" id="share-tab" :order="1">
				<template #icon="{ selected }">
					<NcIconSvgWrapper :path="mdiShareVariant" v-if="selected" />
					<NcIconSvgWrapper :path="mdiShareVariantOutline" v-else />
				</template>
				Sharing tab content
			</NcAppSidebarTab>
		</NcAppSidebar>
	</div>
</template>

<script>
	import { mdiCog, mdiCogOutline, mdiMagnify, mdiShareVariant, mdiShareVariantOutline } from '@mdi/js'

	export default {
		setup() {
			return {
				mdiCog,
				mdiCogOutline,
				mdiMagnify,
				mdiShareVariant,
				mdiShareVariantOutline,
			}
		},
		provide() {
			return {
				'NcContent:selector': '#content-styleguidist-3',
			}
		},
		data() {
			return {
				open: true,
				active: 'search-tab',
			}
		},
	}
</script>

<style scoped>
	/* This styles just mock NcContent and NcAppContent */
	.content-styleguidist {
		--app-sidebar-padding: 8px;
		--app-sidebar-offset: calc(var(--app-sidebar-padding) + var(--default-clickable-area));
		display: flex;
		position: relative !important;
		/* Just to prevent jumping when the sidebar is hidden */
		min-height: 360px;
		overflow: hidden;

		main {
			width: 100%;
		}
	}

	/* Fix styles on this style guide page */
	@media only screen and (max-width: 512px) {
		:deep(aside) {
			width: calc(100vw - 64px) !important;
		}
	}
</style>
```

### Editable name

```vue
<template>
	<div class="content-styleguidist">
		<main id="content-styleguidist-4" />
		<NcAppSidebar
			v-model:open="open"
			v-model:name="name"
			:name-editable="true"
			name-placeholder="Filename"
			subname="last edited 3 weeks ago">
			<!-- Insert your slots and tabs here -->
		</NcAppSidebar>
	</div>
</template>

<script>
	export default {
		provide() {
			return {
				'NcContent:selector': '#content-styleguidist-4',
			}
		},
		data() {
			return {
				open: true,
				name: 'cat-picture.jpg',
			}
		},
	}
</script>

<style scoped>
	/* This styles just mock NcContent and NcAppContent */
	.content-styleguidist {
		--app-sidebar-padding: 8px;
		--app-sidebar-offset: calc(var(--app-sidebar-padding) + var(--default-clickable-area));
		display: flex;
		position: relative !important;
		/* Just to prevent jumping when the sidebar is hidden */
		min-height: 360px;
		overflow: hidden;

		main {
			width: 100%;
		}
	}

	/* Fix styles on this style guide page */
	@media only screen and (max-width: 512px) {
		:deep(aside) {
			width: calc(100vw - 64px) !important;
		}
	}
</style>
```

### Editable name after click with custom tertiary action

```vue
<template>
	<div class="content-styleguidist">
		<main id="content-styleguidist-5" />
		<NcAppSidebar
			:name="name"
			v-model:open="open"
			v-model:name-editable="nameEditable"
			:name-placeholder="namePlaceholder"
			:subname="subname"
			@update:name="nameUpdate">
			<template #tertiary-actions>
				<form>
					<input type="checkbox" @click="toggledCheckbox"/>
				</form>
			</template>
		</NcAppSidebar>
	</div>
</template>

<script>
	export default {
		provide() {
			return {
				'NcContent:selector': '#content-styleguidist-5',
			}
		},
		data() {
			return {
				open: true,
				name: 'cat-picture.jpg',
				namePlaceholder: 'Filename',
				subname: 'last edited 3 weeks ago',
				nameEditable: false
			}
		},
		methods: {
			nameUpdate(e) {
				this.name = e
			},
			toggledCheckbox() {
				alert('toggle')
			}
		}
	}
</script>

<style scoped>
	/* This styles just mock NcContent and NcAppContent */
	.content-styleguidist {
		--app-sidebar-padding: 8px;
		--app-sidebar-offset: calc(var(--app-sidebar-padding) + var(--default-clickable-area));
		display: flex;
		position: relative !important;
		/* Just to prevent jumping when the sidebar is hidden */
		min-height: 360px;
		overflow: hidden;

		main {
			width: 100%;
		}
	}

	/* Fix styles on this style guide page */
	@media only screen and (max-width: 512px) {
		:deep(aside) {
			width: calc(100vw - 64px) !important;
		}
	}
</style>
```

### Custom subname

Instead of using the `subname` prop you can use the same called slot. This is handy if you need to add accessible information.
Like in the following example where the goal is to show a star icon to mark the file a favorite.
Simply adding `★` would not work as screen readers might not or wrongly announce the icon meaning this information is lost.

A working alternative would be using an icon together with an `aria-label`:

```vue
<template>
	<div class="content-styleguidist">
		<main id="content-styleguidist-6" />
		<NcAppSidebar
			v-model:open="open"
			name="cat-picture.jpg">
			<template #subname>
				<NcIconSvgWrapper inline :path="mdiStar" name="Favorite" />
				123 KiB, a month ago
			</template>
		</NcAppSidebar>
	</div>
</template>

<script>
	import { mdiStar } from '@mdi/js'

	export default {
		setup() {
			return {
				mdiStar,
			}
		},
		provide() {
			return {
				'NcContent:selector': '#content-styleguidist-6',
			}
		},
		data() {
			return {
				open: true,
			}
		},
	}
</script>

<style scoped>
	/* This styles just mock NcContent and NcAppContent */
	.content-styleguidist {
		--app-sidebar-padding: 8px;
		--app-sidebar-offset: calc(var(--app-sidebar-padding) + var(--default-clickable-area));
		display: flex;
		position: relative !important;
		/* Just to prevent jumping when the sidebar is hidden */
		min-height: 360px;
		overflow: hidden;

		main {
			width: 100%;
		}
	}

	/* Fix styles on this style guide page */
	@media only screen and (max-width: 512px) {
		:deep(aside) {
			width: calc(100vw - 64px) !important;
		}
	}
</style>
```

### Empty sidebar for e.g. empty content component.

```vue
<template>
	<div class="content-styleguidist">
		<main id="content-styleguidist-7" />
		<NcAppSidebar
			v-model:open="open"
			name="cat-picture.jpg"
			:empty="true">
			<NcEmptyContent name="Content not found.">
				<template #icon>
					<NcIconSvgWrapper :path="mdiMagnify" />
				</template>
			</NcEmptyContent>
		</NcAppSidebar>
	</div>
</template>

<script>
	import { mdiMagnify } from '@mdi/js'

	export default {
		setup() {
			return {
				mdiMagnify,
			}
		},
		provide() {
			return {
				'NcContent:selector': '#content-styleguidist-7',
			}
		},
		data() {
			return {
				open: true,
			}
		},
	}
</script>

<style scoped>
	/* This styles just mock NcContent and NcAppContent */
	.content-styleguidist {
		--app-sidebar-padding: 8px;
		--app-sidebar-offset: calc(var(--app-sidebar-padding) + var(--default-clickable-area));
		display: flex;
		position: relative !important;
		/* Just to prevent jumping when the sidebar is hidden */
		min-height: 360px;
		overflow: hidden;

		main {
			width: 100%;
		}
	}

	/* Fix styles on this style guide page */
	@media only screen and (max-width: 512px) {
		:deep(aside) {
			width: calc(100vw - 64px) !important;
		}
	}
</style>
```

### Conditionally show the sidebar with `open`

If the sidebar should be shown conditionally, you can use `open` prop to define sidebar visibility.
It automatically shows a toggle button to open the sidebar if it is closed.

You can also use `--app-sidebar-offset` CSS variable to preserve space
for the toggle button, for example, in top bar of `NcAppContent`.

The built-in toggle button can be removed with `no-toggle` prop.

Note: the built-in toggle button is only available then NcAppSidebar is used in NcContent.

```vue
<template>
	<div class="content-styleguidist">
		<main id="content-styleguidist-8">
			<div class="top-bar">
				<NcButton variant="primary">Start a call</NcButton>
			</div>
		</main>
		<NcAppSidebar
			v-model:open="open"
			name="cat-picture.jpg"
			subname="last edited 3 weeks ago">
			<NcAppSidebarTab name="Settings" id="settings-tab">
				<template #icon>
					<NcIconSvgWrapper :path="mdiCog" />
				</template>
				Single tab content
			</NcAppSidebarTab>
		</NcAppSidebar>
	</div>
</template>

<script>
	import { mdiCog } from '@mdi/js'

	export default {
		setup() {
			return {
				mdiCog,
			}
		},
		provide() {
			return {
				'NcContent:selector': '#content-styleguidist-8',
			}
		},
		data() {
			return {
				open: true,
			}
		},
	}
</script>

<style scoped>
	/* This styles just mock NcContent and NcAppContent */
	.content-styleguidist {
		--app-sidebar-padding: 8px;
		--app-sidebar-offset: calc(var(--app-sidebar-padding) + var(--default-clickable-area));
		display: flex;
		position: relative !important;
		/* Just to prevent jumping when the sidebar is hidden */
		min-height: 360px;
		overflow: hidden;

		main {
			width: 100%;
		}
	}

	/* Fix styles on this style guide page */
	@media only screen and (max-width: 512px) {
		:deep(aside) {
			width: calc(100vw - 64px) !important;
		}
	}

	.top-bar {
		display: flex;
		justify-content: flex-end;
		/* preserve space for toggle button */
		padding-inline-end: var(--app-sidebar-offset);
		/* same as on toggle button, but doesn't have to be the same */
		margin: var(--app-sidebar-padding);
	}
</style>
```

### Conditionally show the sidebar programmatically with `v-if`

If the sidebar should be shown conditionally without any explicit toggle button, you can use `v-if`.

**Note about performance**: using `v-if` might result in bad performance and loosing sidebar content state.

**Note about `v-show`**: using `v-show` to hide sidebar will result in usability issues due to active focus trap on mobile.

```vue
<template>
	<div class="content-styleguidist">
		<main id="content-styleguidist-9">
			<div class="top-bar">
				<NcButton @click.prevent="open = !open">
					Toggle sidebar
				</NcButton>
			</div>
		</main>
		<!-- The sidebar -->
		<NcAppSidebar
			v-if="open"
			name="cat-picture.jpg"
			subname="last edited 3 weeks ago"
			@close="open = false">
			<NcAppSidebarTab name="Settings" id="settings-tab">
				<template #icon>
					<NcIconSvgWrapper :path="mdiCog" />
				</template>
				Single tab content
			</NcAppSidebarTab>
		</NcAppSidebar>
	</div>
</template>

<script>
	import { mdiCog } from '@mdi/js'

	export default {
		setup() {
			return {
				mdiCog,
			}
		},
		provide() {
			return {
				'NcContent:selector': '#content-styleguidist-9',
			}
		},
		data() {
			return {
				open: true,
			}
		},
	}
</script>
<style scoped>
	/* This styles just mock NcContent and NcAppContent */
	.content-styleguidist {
		--app-sidebar-padding: 8px;
		--app-sidebar-offset: calc(var(--app-sidebar-padding) + var(--default-clickable-area));
		display: flex;
		position: relative !important;
		/* Just to prevent jumping when the sidebar is hidden */
		min-height: 360px;
		overflow: hidden;

		main {
			width: 100%;
		}
	}

	/* Fix styles on this style guide page */
	@media only screen and (max-width: 512px) {
		:deep(aside) {
			width: calc(100vw - 64px) !important;
		}
	}

	.top-bar {
		display: flex;
		justify-content: flex-end;
		/* preserve space for toggle button */
		padding-inline-end: var(--app-sidebar-offset);
		/* same as on toggle button, but doesn't have to be the same */
		margin: var(--app-sidebar-padding);
	}
</style>
```
</docs>
