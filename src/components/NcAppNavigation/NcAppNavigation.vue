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
				<NcAppNavigationSearch v-model="searchValue">
					<template #actions>
						<NcActions>
							<NcActionButton close-after-click @click="showModal = true">
								<template #icon>
									<IconCog :size="20" />
								</template>
								App settings (close after click)
							</NcActionButton>
							<NcActionButton @click="showModal = true">
								<template #icon>
									<IconCog :size="20" />
								</template>
								App settings (handle only click)
							</NcActionButton>
						</NcActions>
					</template>
				</NcAppNavigationSearch>
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
							<NcTextField :value.sync="modalValue" label="Focus me" />
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

<template>
	<div ref="appNavigationContainer"
		class="app-navigation"
		:class="{'app-navigation--close':!open }">
		<nav id="app-navigation-vue"
			:aria-hidden="open ? 'false' : 'true'"
			:aria-label="ariaLabel || undefined"
			:aria-labelledby="ariaLabelledby || undefined"
			class="app-navigation__content"
			:inert="!open || undefined"
			@keydown.esc="handleEsc">
			<div class="app-navigation__search">
				<!-- @slot For in-app search you can pass a `NcAppNavigationSearch` component as the slot content. -->
				<slot name="search" />
			</div>
			<div class="app-navigation__body" :class="{ 'app-navigation__body--no-list': !$scopedSlots.list }">
				<!-- @slot The main content of the navigation. If no list is passed to the #list slot, stretched vertically. -->
				<slot />
			</div>

			<NcAppNavigationList v-if="$scopedSlots.list" class="app-navigation__list">
				<!-- @slot List for Navigation list items. Stretched between the main content and the footer -->
				<slot name="list" />
			</NcAppNavigationList>

			<!-- @slot Footer for e.g. NcAppNavigationSettings -->
			<slot name="footer" />
		</nav>
		<NcAppNavigationToggle :open="open" @update:open="toggleNavigation" />
	</div>
</template>

<script>
import { createFocusTrap } from 'focus-trap'
import { emit, subscribe, unsubscribe } from '@nextcloud/event-bus'
import { tabbable } from 'tabbable'
import Vue from 'vue'

import { getTrapStack } from '../../utils/focusTrap.js'
import { logger } from '../../utils/logger.ts'
import { useHotKey } from '../../composables/useHotKey/index.js'
import { useIsMobile } from '../../composables/useIsMobile/index.js'

import NcAppNavigationList from '../NcAppNavigationList/index.js'
import NcAppNavigationToggle from '../NcAppNavigationToggle/index.js'

export default {
	name: 'NcAppNavigation',

	components: {
		NcAppNavigationList,
		NcAppNavigationToggle,
	},

	// Injected from NcContent
	inject: {
		setHasAppNavigation: {
			default: () => () => Vue.util.warn('NcAppNavigation is not mounted inside NcContent, this is probably an error.'),
			from: 'NcContent:setHasAppNavigation',
		},
	},

	props: {
		/**
		 * The aria label to describe the navigation
		 */
		ariaLabel: {
			type: String,
			default: '',
		},

		/**
		 * aria-labelledby attribute to describe the navigation
		 */
		ariaLabelledby: {
			type: String,
			default: '',
		},
	},

	setup() {
		return {
			isMobile: useIsMobile(),
		}
	},

	data() {
		return {
			open: !this.isMobile,
			focusTrap: null,
		}
	},

	watch: {
		isMobile() {
			this.open = !this.isMobile
			this.toggleFocusTrap()
		},
		open() {
			this.toggleFocusTrap()
		},
	},

	mounted() {
		this.setHasAppNavigation(true)
		subscribe('toggle-navigation', this.toggleNavigationByEventBus)
		// Emit an event with the initial state of the navigation
		emit('navigation-toggled', {
			open: this.open,
		})

		this.focusTrap = createFocusTrap(this.$refs.appNavigationContainer, {
			allowOutsideClick: true,
			fallbackFocus: this.$refs.appNavigationContainer,
			trapStack: getTrapStack(),
			escapeDeactivates: false,
		})
		this.toggleFocusTrap()

		// N opens + focuses the navigation
		useHotKey('n', this.onKeyDown, {
			prevent: true,
			stop: true,
		})
	},
	unmounted() {
		this.setHasAppNavigation(false)
		unsubscribe('toggle-navigation', this.toggleNavigationByEventBus)
		this.focusTrap.deactivate()
	},

	methods: {
		/**
		 * Toggle the navigation
		 *
		 * @param {boolean} [state] set the state instead of inverting the current one
		 */
		async toggleNavigation(state) {
			// Early return if already in that state
			if (this.open === state) {
				emit('navigation-toggled', {
					open: this.open,
				})
				return
			}

			this.open = (typeof state === 'undefined') ? !this.open : state
			const bodyStyles = getComputedStyle(document.body)
			const animationLength = parseInt(bodyStyles.getPropertyValue('--animation-quick')) || 100

			// If we just opened, we focus the first element
			if (this.open) {
				await this.$nextTick()
				this.focusFirstElement()
			}

			setTimeout(() => {
				emit('navigation-toggled', {
					open: this.open,
				})
			// We wait for 1.5 times the animation length to give the animation time to really finish.
			}, 1.5 * animationLength)
		},

		toggleNavigationByEventBus({ open }) {
			this.toggleNavigation(open)
		},

		/**
		 * Activate focus trap if it is currently needed, otherwise deactivate
		 */
		toggleFocusTrap() {
			if (this.isMobile && this.open) {
				this.focusTrap.activate()
			} else {
				this.focusTrap.deactivate()
			}
		},

		handleEsc() {
			if (this.isMobile && this.open) {
				this.toggleNavigation(false)
			}
		},

		focusFirstElement() {
			const element = tabbable(this.$refs.appNavigationContainer)[0]
			if (element) {
				element.focus()
				logger.debug('Focusing first element in the navigation', { element })
			}
		},

		onKeyDown(event) {
			// toggle the navigation on 'n' key
			if (event.key === 'n') {
				// If the navigation is closed, open it
				if (!this.open) {
					this.toggleNavigation(true)
					return
				}

				// If the navigation is open and the focus is within the navigation, close it
				if (this.isFocusWithinNavigation()) {
					this.toggleNavigation(false)
				}
			}
		},

		isFocusWithinNavigation() {
			const activeElement = document.activeElement
			return this.$refs.appNavigationContainer.contains(activeElement)
		},
	},
}
</script>

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
	box-sizing: border-box;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	flex-grow: 0;
	flex-shrink: 0;
	background-color: var(--color-main-background-blur, var(--color-main-background));
	-webkit-backdrop-filter: var(--filter-background-blur, none);
	backdrop-filter: var(--filter-background-blur, none);

	&--close {
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
		box-sizing: border-box;
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
