<!--
 - @copyright Copyright (c) 2019 Christoph Wurst <christoph@winzerhof-wurst.at>
 -
 - @author Christoph Wurst <christoph@winzerhof-wurst.at>
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 - @author Marco Ambrosini <marcoambrosini@icloud.com>
 -
 - @license GNU AGPL version 3 or any later version
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->
<docs>
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
			<div v-if="$scopedSlots.default" class="app-navigation__body">
				<!-- @slot Content within the nav, do NOT add NcModal/NcDialog inside this slot -->
				<slot />
			</div>

			<!-- List for Navigation li-items -->
			<ul v-if="$scopedSlots.list" class="app-navigation__list">
				<slot name="list" />
			</ul>

			<!-- Footer for e.g. AppNavigationSettings -->
			<slot name="footer" />
		</nav>
		<NcAppNavigationToggle :open="open" @update:open="toggleNavigation" />
	</div>
</template>

<script>
import { useIsMobile } from '../../composables/useIsMobile/index.js'
import { getTrapStack } from '../../utils/focusTrap.js'
import { emit, subscribe, unsubscribe } from '@nextcloud/event-bus'
import { createFocusTrap } from 'focus-trap'

import NcAppNavigationToggle from '../NcAppNavigationToggle/index.js'
import Vue from 'vue'

export default {
	name: 'NcAppNavigation',

	components: {
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
		toggleNavigation(state) {
			// Early return if alreay in that state
			if (this.open === state) {
				emit('navigation-toggled', {
					open: this.open,
				})
				return
			}

			this.open = (typeof state === 'undefined') ? !this.open : state
			const bodyStyles = getComputedStyle(document.body)
			const animationLength = parseInt(bodyStyles.getPropertyValue('--animation-quick')) || 100

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
			if (this.isMobile) {
				this.toggleNavigation(false)
			}
		},
	},
}
</script>

<style lang="scss">
.app-navigation,
.app-content {
	/** Distance of the app naviation toggle and the first navigation item to the top edge of the app content container */
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
	max-width: calc(100vw - (var(--app-navigation-padding) + var(--default-clickable-area) + var(--default-grid-baseline)));
	position: relative;
	top: 0;
	left: 0;
	padding: 0px;
	// Above appcontent
	z-index: 1800;
	height: 100%;
	box-sizing: border-box;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	flex-grow: 0;
	flex-shrink: 0;
	background-color:  var(--color-main-background-blur, var(--color-main-background));
	-webkit-backdrop-filter: var(--filter-background-blur, none);
	backdrop-filter: var(--filter-background-blur, none);

	&--close {
		transform: translateX(-100%);
		position: absolute;
	}

	&__body {
		position: relative;
		height: 100%;
		width: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	&__content > ul,
	&__list {
		position: relative;
		height: 100%;
		width: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: var(--default-grid-baseline, 4px);
		padding: var(--app-navigation-padding);
	}
	&__content {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
}

// add extra border for high contrast mode
[data-themes*='highcontrast'] {
	.app-navigation {
		border-right: 1px solid var(--color-border);
	}
}

// When on mobile, we make the navigation slide over the appcontent
@media only screen and (max-width: $breakpoint-mobile) {
	.app-navigation:not(.app-navigation--close) {
		position: absolute;
	}
}
</style>
