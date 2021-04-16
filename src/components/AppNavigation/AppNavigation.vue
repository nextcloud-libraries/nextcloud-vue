<!--
 - @copyright Copyright (c) 2019 Christoph Wurst <christoph@winzerhof-wurst.at>
 -
 - @author Christoph Wurst <christoph@winzerhof-wurst.at>
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 - @author Marco Ambrosini <marcoambrosini@pm.me>
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
	<div
		id="app-navigation-vue"
		class="app-navigation"
		role="navigation"
		:class="{'app-navigation--close':!open }">
		<AppNavigationToggle :open="open" @update:open="toggleNavigation" />
		<slot />

		<!-- List for Navigation li-items -->
		<ul class="app-navigation__list">
			<slot name="list" />
		</ul>

		<!-- Footer for e.g. AppNavigationSettings -->
		<slot name="footer" />
	</div>
</template>

<script>
import { emit, subscribe, unsubscribe } from '@nextcloud/event-bus'
import AppNavigationToggle from '../AppNavigationToggle/AppNavigationToggle'
import isMobile from '../../mixins/isMobile'

export default {
	name: 'AppNavigation',

	components: {
		AppNavigationToggle,
	},

	mixins: [isMobile],

	data() {
		return {
			open: true,
		}
	},

	watch: {
		isMobile() {
			this.open = !this.isMobile
		},
	},

	mounted() {
		subscribe('toggle-navigation', this.toggleNavigationByEventBus)
		// Emit an event with the initial state of the navigation
		emit('navigation-toggled', {
			open: this.open,
		})
	},
	unmounted() {
		this.mc.off('swipeleft swiperight')
		this.mc.destroy()
		unsubscribe('toggle-navigation', this.toggleNavigationByEventBus)
	},

	methods: {
		/**
		 * Toggle the navigation
		 *
		 * @param {Boolean} [state] set the state instead of inverting the current one
		 */
		toggleNavigation(state) {
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
	},
}
</script>

<style lang="scss" scoped>

.app-navigation {
	will-change: transform;
	transition: transform var(--animation-quick), margin var(--animation-quick);
	width: $navigation-width;
	position: sticky;
	position: -webkit-sticky;
	top: $header-height;
	left: 0;
	// Above appcontent
	z-index: 1800;
	height: calc(100vh - #{$header-height});
	box-sizing: border-box;
	background-color: var(--color-main-background);
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	border-right: 1px solid var(--color-border);
	display: flex;
	flex-direction: column;
	flex-grow: 0;
	flex-shrink: 0;

	&--close {
		margin-left: - $navigation-width;
		transform: translateX(-100%);
	}

	//list of navigation items
	ul,
	&__list {
		position: relative;
		height: 100%;
		width: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}
}

// When on mobile, we make the navigation slide over the appcontent
@media only screen and (max-width: $breakpoint-mobile) {
	.app-navigation:not(.app-navigation--close) {
		margin-left: - $navigation-width;
	}
}

</style>
