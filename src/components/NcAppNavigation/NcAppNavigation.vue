<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
```vue
<template>
	<div class="styleguide-nc-content">
		<NcAppNavigation>
			<template #search>
				<div class="navigation__header">
					<NcAppNavigationSearch v-model="searchValue" label="Search …" />
					<NcActions>
						<NcActionButton close-after-click @click="showModal = true">
							<template #icon>
								<IconCog />
							</template>
							App settings (close after click)
						</NcActionButton>
						<NcActionButton @click="showModal = true">
							<template #icon>
								<IconCog />
							</template>
							App settings (handle only click)
						</NcActionButton>
					</NcActions>
				</div>
			</template>
			<template #list>
				<NcAppNavigationItem v-for="item in items" :key="item" :name="item">
					<template #icon>
						<IconCheck :size="20" />
					</template>
				</NcAppNavigationItem>
			</template>
			<template #footer>
				<div class="navigation__footer">
					<NcButton wide @click="showModal = true">
						<template #icon>
							<IconCog />
						</template>
						App settings
					</NcButton>
					<NcModal v-if="showModal" name="Modal for focus-trap check" @close="showModal = false">
						<div class="modal-content">
							<h4>Focus-trap should be locked inside the modal</h4>
							<NcTextField v-model="modalValue" label="Focus me" />
						</div>
					</NcModal>
				</div>
			</template>
		</NcAppNavigation>
	</div>
</template>

<script>
	import IconCheck from 'vue-material-design-icons/Check'
	import IconCog from 'vue-material-design-icons/Cog'

	export default {
		components: {
			IconCheck,
			IconCog,
		},
		provide() {
			return {
				'NcContent:setHasAppNavigation': () => {},
			}
		},
		data() {
			return {
				items: Array.from({ length: 5 }, (v, i) => `Item ${i+1}`),
				searchValue: '',
				modalValue: '',
				showModal: false,
			}
		},
	}
</script>

<style scoped>
	/* Mock NcContent */
	.styleguide-nc-content {
		position: relative;
		height: 300px;
		background-color: var(--color-background-plain);
		overflow: hidden;
	}

	.navigation__header,
	.navigation__footer {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px;
	}

	.modal-content {
		height: 120px;
		padding: 10px;
	}
</style>
```

The navigation bar can be open and closed from anywhere in the app using the
nextcloud event bus.

### Install the event bus package

```bash
npm i -S @nextcloud/event-bus
```

### Usage

#### Open the navigation

```js static
import { emit } from '@nextcloud/event-bus'
emit('toggle-navigation', {
	open: true,
})
```

#### Close the navigation

```js static
import { emit } from '@nextcloud/event-bus'
emit('toggle-navigation', {
	open: false,
})
```

</docs>

<script setup lang="ts">
import type { FocusTrap } from 'focus-trap'
import type { Slot } from 'vue'

import { emit, subscribe, unsubscribe } from '@nextcloud/event-bus'
import { createFocusTrap } from 'focus-trap'
import { inject, onMounted, onUnmounted, ref, useTemplateRef, warn, watch, watchEffect } from 'vue'
import NcAppNavigationList from '../NcAppNavigationList/NcAppNavigationList.vue'
import NcAppNavigationToggle from './NcAppNavigationToggle.vue'
import { useIsMobile } from '../../composables/useIsMobile/index.ts'
import { getTrapStack } from '../../utils/focusTrap.ts'
import { HAS_APP_NAVIGATION_KEY } from '../NcContent/constants.ts'

const props = defineProps<{
	/**
	 * The aria label to describe the navigation
	 */
	ariaLabel?: string

	/**
	 * aria-labelledby attribute to describe the navigation
	 */
	ariaLabelledby?: string
}>()

defineSlots<{
	/**
	 * The main content of the navigation.
	 * If no list is passed to the `#list` slot, stretched vertically.
	 */
	default?: Slot
	/**
	 * Footer for e.g. `NcAppNavigationSettings`
	 */
	footer?: Slot
	/**
	 * List for Navigation list items.
	 * Stretched between the main content and the footer
	 */
	list?: Slot
	/**
	 * For in-app search you can pass a `NcAppNavigationSearch` component as the slot content.
	 */
	search?: Slot
}>()

let focusTrap: FocusTrap
const setHasAppNavigation = inject(
	HAS_APP_NAVIGATION_KEY,
	() => warn('NcAppNavigation is not mounted inside NcContent, this is probably an error.'),
	false,
)

const appNavigationContainer = useTemplateRef('app-navigation-container-key')
const isMobile = useIsMobile()
const open = ref(!isMobile.value)

watchEffect(() => {
	if (!props.ariaLabel && !props.ariaLabelledby) {
		warn('NcAppNavigation requires either `ariaLabel` or `ariaLabelledby` to be set for accessibility.')
	}
})

watch(isMobile, () => {
	open.value = !isMobile.value
})

watch(open, () => {
	toggleFocusTrap()
})

onMounted(() => {
	setHasAppNavigation(true)
	subscribe('toggle-navigation', toggleNavigationByEventBus)
	// Emit an event with the initial state of the navigation
	emit('navigation-toggled', {
		open: open.value,
	})

	focusTrap = createFocusTrap(appNavigationContainer.value!, {
		allowOutsideClick: true,
		fallbackFocus: appNavigationContainer.value!,
		trapStack: getTrapStack(),
		escapeDeactivates: false,
	})
	toggleFocusTrap()
})

onUnmounted(() => {
	setHasAppNavigation(false)
	unsubscribe('toggle-navigation', toggleNavigationByEventBus)
	focusTrap.deactivate()
})

/**
 * Toggle the navigation
 *
 * @param state set the state instead of inverting the current one
 */
function toggleNavigation(state?: boolean): void {
	// Early return if already in that state
	if (open.value === state) {
		emit('navigation-toggled', {
			open: open.value,
		})
		return
	}

	open.value = state === undefined ? !open.value : state
	const bodyStyles = getComputedStyle(document.body)
	const animationLength = parseInt(bodyStyles.getPropertyValue('--animation-quick')) || 100

	setTimeout(() => {
		emit('navigation-toggled', {
			open: open.value,
		})
	// We wait for 1.5 times the animation length to give the animation time to really finish.
	}, 1.5 * animationLength)
}

/**
 * Handler for the event-bus navigation event.
 *
 * @param context - The event bus context
 * @param context.open - The new navigation open state
 */
function toggleNavigationByEventBus({ open }: { open: boolean }): void {
	return toggleNavigation(open)
}

/**
 * Activate focus trap if it is currently needed, otherwise deactivate
 */
function toggleFocusTrap(): void {
	if (isMobile.value && open.value) {
		focusTrap.activate()
	} else {
		focusTrap.deactivate()
	}
}

/**
 * Handle hotkey for closing the navigation.
 */
function handleEsc(): void {
	if (isMobile.value) {
		toggleNavigation(false)
	}
}
</script>

<template>
	<div
		ref="app-navigation-container-key"
		class="app-navigation"
		:class="{ 'app-navigation--closed': !open }">
		<nav
			id="app-navigation-vue"
			:aria-hidden="open ? 'false' : 'true'"
			:aria-label="ariaLabel || undefined"
			:aria-labelledby="ariaLabelledby || undefined"
			class="app-navigation__content"
			:inert="!open || undefined"
			@keydown.esc="handleEsc">
			<div class="app-navigation__search">
				<slot name="search" />
			</div>

			<div class="app-navigation__body" :class="{ 'app-navigation__body--no-list': !$slots.list }">
				<slot />
			</div>

			<NcAppNavigationList v-if="$slots.list" class="app-navigation__list">
				<slot name="list" />
			</NcAppNavigationList>

			<slot name="footer" />
		</nav>
		<NcAppNavigationToggle :open @update:open="toggleNavigation" />
	</div>
</template>

<style lang="scss">
.app-navigation,
.app-content {
	/** Distance of the app navigation toggle and the first navigation item to the top edge of the app content container */
	--app-navigation-padding: #{$app-navigation-padding};
}
</style>

<style lang="scss" scoped>
.app-navigation {
	// Set scoped variable override
	// Using --color-text-maxcontrast as a fallback evaluates to an invalid value as it references itself in this scope instead of the variable defined higher up
	--color-text-maxcontrast: var(--color-text-maxcontrast-background-blur, var(--color-text-maxcontrast-default));
	transition: transform var(--animation-quick), margin var(--animation-quick);
	width: $navigation-width;
	// Left toggle button padding + toggle button + right padding from NcAppContent
	--app-navigation-max-width: calc(100vw - (var(--app-navigation-padding) + var(--default-clickable-area) + var(--default-grid-baseline)));
	max-width: var(--app-navigation-max-width);
	position: relative;
	top: 0;
	inset-inline-start: 0;
	padding: 0px;
	// Above NcAppContent
	z-index: 1800;
	height: 100%;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	flex-grow: 0;
	flex-shrink: 0;
	background-color: var(--color-main-background-blur, var(--color-main-background));
	-webkit-backdrop-filter: var(--filter-background-blur, none);
	backdrop-filter: var(--filter-background-blur, none);

	&--closed {
		margin-inline-start: calc(-1 * min($navigation-width, var(--app-navigation-max-width)));
	}

	&__search {
		width: 100%;
	}

	&__body {
		overflow-y: scroll;
	}

	// For legacy purposes support passing a bare list to the content in #default slot and including #footer slot
	// Same styles as NcAppNavigationList
	&__content > ul {
		position: relative;
		width: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: var(--default-grid-baseline, 4px);
		padding: var(--app-navigation-padding);
	}

	// Always stretch the navigation list
	& &__list {
		height: 100%;
	}

	// Stretch the main content if there is no stretched list
	&__body--no-list {
		flex: 1 1 auto;
		overflow: auto;
		height: 100%;
	}

	&__content {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
}

// Add extra border for high contrast mode
[data-themes*="highcontrast"] {
	.app-navigation {
		border-inline-end: 1px solid var(--color-border);
	}
}

// When on mobile, we make the navigation slide over the NcAppContent
@media only screen and (max-width: $breakpoint-mobile) {
	.app-navigation {
		position: absolute;
		border-inline-end: 1px solid var(--color-border);
	}
}

// Put the toggle behind NcAppSidebar on small screens
@media only screen and (max-width: $breakpoint-small-mobile) {
	.app-navigation {
		z-index: 1400;
	}
}

</style>
