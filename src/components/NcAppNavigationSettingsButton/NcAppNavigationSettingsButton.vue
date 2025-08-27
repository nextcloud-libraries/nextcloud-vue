<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
The component to be used as a settings button in the `<NcAppNavigation>` to open `<NcAppSettingsDialog>`.
</docs>

<template>
	<div class="app-navigation-settings-button">
		<NcButton class="app-navigation-settings-button__button"
			type="tertiary"
			alignment="start"
			wide
			@click.stop="emit('click', $event)">
			<template #icon>
				<IconCog :size="20" />
			</template>
			<span class="app-navigation-settings-button__text">
				{{ name }}
			</span>
		</NcButton>
	</div>
</template>

<script setup>
import { t } from '../../l10n.js'
import NcButton from '../NcButton/index.js'
import IconCog from 'vue-material-design-icons/Cog.vue'

defineProps({
	/**
	 * The name of the settings button. For example, "Files Settings" or "Talk Settings".
	 */
	name: {
		type: String,
		required: false,
		default: t('Settings'),
	},
})

const emit = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.app-navigation-settings-button {
	padding: var(--default-grid-baseline);

	&__text {
		// Make the settings button less presentative, like app navigation items
		font-weight: normal;
	}
}
</style>
