<!--
  - SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div
		id="app-settings"
		v-click-outside="clickOutsideConfig"
		:class="{ open }">
		<div id="app-settings__header">
			<NcButton
				:aria-controls="contentId"
				:aria-expanded="open ? 'true' : 'false'"
				class="settings-button"
				alignment="start"
				variant="tertiary"
				wide
				@click="open = !open">
				<template #icon>
					<NcIconSvgWrapper class="settings-button__icon" :path="isLegacy32 ? mdiCog : mdiCogOutline" />
				</template>
				{{ name }}
			</NcButton>
		</div>
		<Transition name="slide-up">
			<div v-show="open" :id="contentId">
				<slot />
			</div>
		</Transition>
	</div>
</template>

<script>
import { mdiCog, mdiCogOutline } from '@mdi/js'
import { vOnClickOutside as ClickOutside } from '@vueuse/components'
import NcButton from '../NcButton/NcButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { t } from '../../l10n.js'
import { clickOutsideOptions } from '../../mixins/index.js'
import GenRandomId from '../../utils/GenRandomId.js'
import { isLegacy32 } from '../../utils/legacy.ts'

export default {
	directives: {
		ClickOutside,
	},

	components: {
		NcButton,
		NcIconSvgWrapper,
	},

	mixins: [
		clickOutsideOptions,
	],

	props: {
		/**
		 * Text of the button
		 *
		 * @default 'Settings'
		 */
		name: {
			type: String,
			required: false,
			default: t('Settings'),
		},
	},

	setup() {
		const contentId = GenRandomId()
		return {
			contentId,
			isLegacy32,
			mdiCog,
			mdiCogOutline,
		}
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
			padding-inline: 0 calc((var(--default-clickable-area) - 16px) / 2) !important;

			:deep(.button-vue__text) {
				font-weight: normal !important;
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
