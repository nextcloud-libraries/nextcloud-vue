<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="app-navigation-toggle-wrapper">
		<NcButton class="app-navigation-toggle"
			aria-controls="app-navigation-vue"
			:aria-expanded="open ? 'true' : 'false'"
			:aria-keyshortcuts="disableKeyboardShortcuts ? '' : 'n'"
			:aria-label="label"
			:title="label"
			@click="toggleNavigation">
			<template #icon>
				<MenuOpenIcon v-if="open" :size="20" />
				<MenuIcon v-else :size="20" />
			</template>
		</NcButton>
	</div>
</template>

<script>
import NcButton from '../NcButton/index.ts'
import { t } from '../../l10n.js'

import MenuIcon from 'vue-material-design-icons/Menu.vue'
import MenuOpenIcon from 'vue-material-design-icons/MenuOpen.vue'

export default {
	name: 'NcAppNavigationToggle',

	components: {
		NcButton,
		MenuIcon,
		MenuOpenIcon,
	},

	props: {
		/**
		 * Tracks whether the toggle has been clicked or not.
		 * If it has been clicked, switches between the different MenuIcons
		 * and emits a boolean indicating its opened status
		 */
		open: {
			type: Boolean,
			required: true,
		},
	},

	emits: ['update:open'],

	computed: {
		label() {
			return this.open ? t('Close navigation') : t('Open navigation')
		},
	},
	methods: {
		/**
		 * Once the toggle has been clicked, emits the toggle status
		 * so parent components can gauge the status of the navigation button
		 */
		toggleNavigation() {
			this.$emit('update:open', !this.open)
		},
	},
}
</script>

<style scoped lang="scss">
.app-navigation-toggle-wrapper {
	position: absolute;
	top: var(--app-navigation-padding);
	inset-inline-end: calc(0px - var(--app-navigation-padding));
	margin-inline-end: calc(-1 * var(--default-clickable-area));
}

button.app-navigation-toggle {
	background-color: var(--color-main-background);
}
</style>
