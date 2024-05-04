<!--
 - @copyright Copyright (c) 2018 Christoph Wurst <christoph@winzerhof-wurst.at>
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
	<div id="app-settings" v-click-outside="clickOutsideConfig" :class="{ open }">
		<div id="app-settings__header">
			<button
				class="settings-button"
				type="button"
				:aria-expanded="open ? 'true' : 'false'"
				aria-controls="app-settings__content"
				@click="toggleMenu">
				<Cog class="settings-button__icon" :size="20" />
				<span class="settings-button__label">{{ name }}</span>
			</button>
		</div>
		<Transition name="slide-up">
			<div v-show="open" id="app-settings__content">
				<slot />
			</div>
		</Transition>
	</div>
</template>

<script>
import { t } from '../../l10n.js'
import { clickOutsideOptions } from '../../mixins/index.js'

import Cog from 'vue-material-design-icons/Cog.vue'

import { vOnClickOutside as ClickOutside } from '@vueuse/components'

export default {
	directives: {
		ClickOutside,
	},
	components: {
		Cog,
	},
	mixins: [clickOutsideOptions],
	props: {
		name: {
			type: String,
			required: false,
			default: t('Settings'),
		},
	},
	data() {
		return {
			open: false,
		}
	},
	computed: {
		clickOutsideConfig() {
			return [this.closeMenu, this.clickOutsideOptions]
		},
	},
	methods: {
		toggleMenu() {
			this.open = !this.open
		},
		closeMenu() {
			this.open = false
		},
	},
}
</script>
<style lang="scss" scoped>
#app-settings {
	margin-top: auto;
	padding: $app-navigation-settings-margin;

	&__header {
		box-sizing: border-box;
		margin: 0 $app-navigation-settings-margin $app-navigation-settings-margin
			$app-navigation-settings-margin;

		.settings-button {
			display: flex;
			flex: 1 1 0;
			height: $clickable-area;
			width: 100%;
			padding: 0;
			margin: 0;
			background-color: var(--color-main-background);
			box-shadow: none;
			border: 0;
			border-radius: var(--border-radius-pill);
			text-align: left;
			font-weight: normal;
			font-size: 100%;
			color: var(--color-main-text);
			padding-right: 14px;
			line-height: $clickable-area;

			&:hover,
			&:focus {
				background-color: var(--color-background-hover);
			}

			&__icon {
				width: $clickable-area;
				height: $clickable-area;
				min-width: $clickable-area;
			}
			&__label {
				overflow: hidden;
				max-width: 100%;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}

	&__content {
		display: block;
		padding: 10px;

		/* prevent scrolled contents from stopping too early */
		margin-bottom: -$app-navigation-settings-margin;

		/* restrict height of settings and make scrollable */
		max-height: 300px;
		overflow-y: auto;
		box-sizing: border-box;
	}
}

.slide-up-leave-active,
.slide-up-enter-active {
	transition-duration: var(--animation-slow);
	transition-property: max-height, padding;
	overflow-y: hidden !important;
}

.slide-up-enter,
.slide-up-leave-to {
	max-height: 0 !important;
	padding: 0 10px !important;
}
</style>
