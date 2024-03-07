<!--
  - @copyright Copyright (c) 2021 John Molakvoæ <skjnldsv@protonmail.com>
  -
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template>
	<NcButton v-tooltip="title" :aria-label="title" class="app-details-toggle">
		<template #icon>
			<ArrowRight :size="20" />
		</template>
	</NcButton>
</template>

<script>
import NcButton from '../NcButton/index.js'
import { t } from '../../l10n.js'
import Tooltip from '../../directives/Tooltip/index.js'

import { emit } from '@nextcloud/event-bus'

import ArrowRight from 'vue-material-design-icons/ArrowRight.vue'

export default {
	name: 'NcAppContentDetailsToggle',

	directives: {
		tooltip: Tooltip,
	},

	components: {
		NcButton,
		ArrowRight,
	},

	computed: {
		title() {
			return t('Go back to the list')
		},
	},

	beforeMount() {
		this.toggleAppNavigationButton(true)
	},

	beforeDestroy() {
		this.toggleAppNavigationButton(false)
	},

	methods: {
		toggleAppNavigationButton(hide = true) {
			const appNavigationToggle = document.querySelector('.app-navigation .app-navigation-toggle')
			if (appNavigationToggle) {
				appNavigationToggle.style.display = hide ? 'none' : null

				// If we hide the NavigationToggle, we need to make sure the Navigation is also closed
				if (hide === true) {
					emit('toggle-navigation', { open: false })
				}
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.app-details-toggle {
	position: fixed;
	width: $clickable-area;
	height: $clickable-area;
	padding: $icon-margin;
	cursor: pointer;
	opacity: .6;
	transform: rotate(180deg);
	background-color: var(--color-main-background);
	z-index: 2000;

	&:active,
	&:hover,
	&:focus {
		opacity: 1;
	}
}
</style>
