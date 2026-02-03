<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { inject } from 'vue'
import { APP_VERSION, useLocalizedAppName } from '../../utils/appName.ts'
import { APP_SETTINGS_LEGACY_DESIGN_KEY } from './useAppSettingsDialog.ts'

const legacy = inject(APP_SETTINGS_LEGACY_DESIGN_KEY)!

const localizedAppName = useLocalizedAppName()
</script>

<template>
	<div :class="[$style.appSettingsDialogVersion, { [$style.appSettingsDialogVersion__legacy]: legacy }]">
		{{ localizedAppName }} {{ APP_VERSION }}
	</div>
</template>

<style lang="scss" module>
.appSettingsDialogVersion {
    --form-element-label-offset: calc(var(--border-radius-element) + var(--default-grid-baseline));
    color: var(--color-text-maxcontrast);
    margin-block-end: calc(8 * var(--default-grid-baseline));
    margin-inline: var(--form-element-label-offset);
}

.appSettingsDialogVersion__legacy {
    margin-inline: 0;
}
</style>
