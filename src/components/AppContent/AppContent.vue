<!--
 - @copyright Copyright (c) 2019 Christoph Wurst <christoph@winzerhof-wurst.at>
 -
 - @author Christoph Wurst <christoph@winzerhof-wurst.at>
 - @author Marco Ambrosini <marcoambrosini@pm.me>
 - @author John Molakvoæ <skjnldsv@protonmail.com>
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
	<main id="app-content-vue" class="app-content no-snapper">
		<!-- @slot Provide content to the app content -->
		<slot />
	</main>
</template>

<script>
import Hammer from 'hammerjs'
import { emit } from '@nextcloud/event-bus'

/**
 * App content container to be used for the main content of your app
 *
 */
export default {
	name: 'AppContent',

	props: {
		// Allows to disable the control by swipe of the app navigation open state
		allowSwipeNavigation: {
			type: Boolean,
			default: true,
		},
	},

	mounted() {
		if (this.allowSwipeNavigation) {
			this.mc = new Hammer(this.$el, { cssProps: { userSelect: 'text' } })
			this.mc.on('swipeleft swiperight', this.handleSwipe)
		}
	},
	beforeDestroy() {
		this.mc.off('swipeleft swiperight', this.handleSwipe)
	},
	methods: {
		// handle the swipe event
		handleSwipe(e) {
			const minSwipeX = 70
			const touchzone = 40
			const startX = e.srcEvent.pageX - e.deltaX
			const hasEnoughDistance = Math.abs(e.deltaX) > minSwipeX
			if (hasEnoughDistance && startX < touchzone) {
				emit('toggle-navigation', {
					open: true,
				})
			} else if (hasEnoughDistance && startX < touchzone + 300) {
				emit('toggle-navigation', {
					open: false,
				})
			}
		},
	},
}
</script>
<style lang="scss" scoped>

.app-content {
	position: relative;
	z-index: 1000;
	flex-basis: 100vw;
	min-width: 0;
	min-height: 100%;
	// Overriding server styles TODO: cleanup!
	margin: 0 !important;
	background-color: var(--color-main-background);
}

</style>
