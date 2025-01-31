<!--
  - SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div id="app-settings"
		v-click-outside="clickOutsideConfig"
		:class="{ open }">
		<div id="app-settings__header">
			<button class="settings-button"
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
	mixins: [
		clickOutsideOptions,
	],
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
			return [
				this.closeMenu,
				this.clickOutsideOptions,
			]
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
		margin: 0 $app-navigation-settings-margin $app-navigation-settings-margin $app-navigation-settings-margin;

		.settings-button {
			display: flex;
			flex: 1 1 0;
			height: var(--default-clickable-area);
			width: 100%;
			padding: 0;
			margin: 0;
			background-color: transparent;
			box-shadow: none;
			border: 0;
			border-radius: var(--body-container-radius);
			text-align: start;
			font-weight: normal;
			font-size: 100%;
			color: var(--color-main-text);
			padding-inline-end: 14px;
			line-height: var(--default-clickable-area);

			&:hover,
			&:focus {
				background-color: var(--color-background-hover);
			}

			&__icon {
				width: var(--default-clickable-area);
				height: var(--default-clickable-area);
				min-width: var(--default-clickable-area);
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
