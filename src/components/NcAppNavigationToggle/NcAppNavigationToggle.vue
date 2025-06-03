<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -
  - This component is only used for the NcAppNavigation component and not exported otherwise.
-->

<script setup lang="ts">
import { computed } from 'vue'
import MenuIcon from 'vue-material-design-icons/Menu.vue'
import MenuOpenIcon from 'vue-material-design-icons/MenuOpen.vue'
import NcButton from '../NcButton/index.ts'
import { t } from '../../l10n.js'

/**
 * Tracks whether the toggle has been clicked or not.
 * If it has been clicked, switches between the different MenuIcons
 * and emits a boolean indicating its opened status
 */
const open = defineModel<boolean>('open', { required: true })

const title = computed(() => open.value ? t('Close navigation') : t('Open navigation'))

/**
 * Once the toggle has been clicked, emits the toggle status
 * so parent components can gauge the status of the navigation button
 */
function toggleNavigation(): void {
	open.value = !open.value
}
</script>

<template>
	<div class="app-navigation-toggle-wrapper">
		<NcButton class="app-navigation-toggle"
			aria-controls="app-navigation-vue"
			:aria-expanded="open ? 'true' : 'false'"
			:aria-label="title"
			:title
			variant="tertiary"
			@click="toggleNavigation">
			<template #icon>
				<MenuOpenIcon v-if="open" :size="20" />
				<MenuIcon v-else :size="20" />
			</template>
		</NcButton>
	</div>
</template>

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
