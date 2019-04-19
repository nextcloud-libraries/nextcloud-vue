<!--
 - @copyright Copyright (c) 2019 Christoph Wurst <christoph@winzerhof-wurst.at>
 -
 - @author Christoph Wurst <christoph@winzerhof-wurst.at>
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

<template>
	<div id="app-content" class="no-snapper" :style="opened ? 'transform: translateX(300px)' : ''">
		<AppNavigationToggle :aria-expanded="opened" aria-controls="app-navigation"
			@click="toggleNavigation" />
		<slot />
	</div>
</template>

<script>
import Hammer from 'hammerjs'
import AppNavigationToggle from '../AppNavigationToggle'

export default {
	name: 'AppContent',
	components: {
		AppNavigationToggle
	},
	data() {
		return {
			// closed by default on mobile mode
			opened: false
		}
	},
	mounted() {
		this.mc = new Hammer(this.$el)
		this.mc.on('swipeleft swiperight', e => {
			this.handleSwipe(e)
		})
	},
	unmounted() {
		this.mc.off('swipeleft swiperight')
		this.mc.destroy()
	},
	methods: {
		/**
		 * Toggle the navigation
		 *
		 * @param {Boolean} [state] set the state instead of inverting the current one
		 */
		toggleNavigation(state) {
			this.opened = state || !this.opened
			this.opened
				? document.body.classList.add('nav-open')
				: document.body.classList.remove('nav-open')
		},
		// handle the swipe event
		handleSwipe(e) {
			const minSwipeX = 70
			const touchzone = 40
			const startX = e.srcEvent.pageX - e.deltaX
			const hasEnoughDistance = Math.abs(e.deltaX) > minSwipeX
			if (hasEnoughDistance && startX < touchzone) {
				this.toggleNavigation(true)
			} else if (this.opened && hasEnoughDistance && startX < touchzone + 300) {
				this.toggleNavigation(false)
			}
		}
	}
}
</script>
<style lang="scss" scoped>
#app-content {
	z-index: 1000;
	background-color: var(--color-main-background);
	position: relative;
	flex-basis: 100vw;
	min-height: 100%;
	will-change: transform;
	transition: transform var(--animation-quick);
}
</style>
