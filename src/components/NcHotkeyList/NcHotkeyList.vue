<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

import { t } from '../../l10n.ts'
import { createElementId } from '../../utils/createElementId.ts'

const {
	label = undefined,
} = defineProps<{
	/**
	 * Heading list label to use when there are multiple lists of shortcuts
	 */
	label?: string
}>()

defineSlots<{
	/**
	 * Shortcuts described via <NcHotkey> components
	 */
	default?: Slot
}>()

const labelId = `NcHotkeyList_${createElementId()}`
</script>

<template>
	<div :class="$style.hotkeyList">
		<div :id="labelId" :class="[$style.hotkeyList__heading, { 'hidden-visually': !label }]">
			{{ label || t('Keyboard shortcuts') }}
		</div>
		<ul :aria-labelledby="labelId">
			<slot />
		</ul>
	</div>
</template>

<style module>
.hotkeyList {
	--form-element-label-offset: calc(var(--border-radius-element) + var(--default-grid-baseline));
}

.hotkeyList__heading {
	font-weight: bold;
	margin-inline: var(--form-element-label-offset);
}
</style>

<docs>
## General

List of keyboard shortcuts for the `<NcAppSettingsShortcutsSection>`.

```vue
<template>
	<NcHotkeyList>
		<NcHotkey label="New File" hotkey="Ctrl N" />
		<NcHotkey label="Open File" hotkey="Ctrl O" />
		<NcHotkey label="Save File" hotkey="Ctrl S" />
	</NcHotkeyList>
</template>
```

## Groups

The hotkey list can have an optional heading label. This is useful when there are multiple groups of shortcuts in an app with many shortcuts.

```vue
<template>
	<section>
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
	</section>
</template>
```
</docs>
