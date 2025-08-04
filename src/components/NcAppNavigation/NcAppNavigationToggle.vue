<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<script setup lang="ts">
import { mdiMenu, mdiMenuOpen } from '@mdi/js'
import { computed } from 'vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { t } from '../../l10n.ts'
import NcButton from '../NcButton/index.ts'

/**
 * Tracks whether the toggle has been clicked or not.
 * If it has been clicked, switches between the different MenuIcons
 * and emits a boolean indicating its opened status
 */
const open = defineModel<boolean>('open', { required: true })

const title = computed(() => open.value ? t('Close navigation') : t('Open navigation'))
</script>

<template>
	<div class="app-navigation-toggle-wrapper">
		<NcButton
			class="app-navigation-toggle"
			aria-controls="app-navigation-vue"
			:aria-expanded="open ? 'true' : 'false'"
			:aria-label="title"
			:title
			variant="tertiary"
			@click="open = !open">
			<template #icon>
				<NcIconSvgWrapper :path="open ? mdiMenuOpen : mdiMenu" />
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
