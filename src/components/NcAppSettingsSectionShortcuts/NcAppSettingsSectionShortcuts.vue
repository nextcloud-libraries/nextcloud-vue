<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

import NcAppSettingsSection from '../NcAppSettingsSection/NcAppSettingsSection.vue'
import { t } from '../../l10n.ts'

defineSlots<{
	/**
	 * Shortcuts described via <NcHotkeyList> components
	 */
	default?: Slot
}>()
</script>

<template>
	<NcAppSettingsSection id="keyboard-shortcuts" :name="t('Keyboard shortcuts')">
		<div :class="$style.appSettingsSectionShortcuts">
			<slot />
		</div>
	</NcAppSettingsSection>
</template>

<style module>
.appSettingsSectionShortcuts {
	display: flex;
	flex-direction: column;
	gap: calc(4 * var(--default-grid-baseline));
}
</style>

<docs>
A special `NcAppSettingsSection` for listing keyboard shortcuts using `<NcHotkeyList>` and `<NcHotkey>` components with predefined heading and gap between hotkey lists.

```vue
<script>
export default {
	data() {
		return {
			open: false,
		}
	},
}
</script>

<template>
	<div>
		<NcButton @click="open = true">App Settings</NcButton>
		<NcAppSettingsDialog v-model:open="open" name="Application settings" show-navigation>
			<NcAppSettingsSectionShortcuts>
				<NcHotkeyList label="Actions">
					<NcHotkey label="File actions" hotkey="A" />
					<NcHotkey label="Rename" hotkey="F2" />
					<NcHotkey label="Delete" hotkey="Delete" />
					<NcHotkey label="Add or remove favorite" hotkey="S" />
					<NcHotkey label="Manage tags" hotkey="T" />
				</NcHotkeyList>

				<NcHotkeyList label="Selection">
					<NcHotkey label="Select all files" hotkey="Control A" />
					<NcHotkey label="Deselect all" hotkey="Escape" />
					<NcHotkey label="Select or deselect" hotkey="Control Space" />
					<NcHotkey label="Select a range" hotkey="Control Shift Space" />
				</NcHotkeyList>

				<NcHotkeyList label="Navigation">
					<NcHotkey label="Go to parent folder" hotkey="Alt ArrowUp" />
					<NcHotkey label="Go to file above" hotkey="ArrowUp" />
					<NcHotkey label="Go to file below" hotkey="ArrowDown" />
					<NcHotkey label="Go left in grid" hotkey="ArrowLeft" />
					<NcHotkey label="Go right in grid" hotkey="ArrowRight" />
				</NcHotkeyList>

				<NcHotkeyList label="View">
					<NcHotkey label="Toggle grid view" hotkey="V" />
					<NcHotkey label="Open file sidebar" hotkey="D" />
					<NcHotkey label="Show those shortcuts" hotkey="?" />
				</NcHotkeyList>
			</NcAppSettingsSectionShortcuts>
		</NcAppSettingsDialog>
	</div>
</template>
```
</docs>
