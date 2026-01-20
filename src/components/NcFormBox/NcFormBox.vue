<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

import { provide, useCssModule } from 'vue'
import { NC_FORM_BOX_CONTEXT_KEY } from './useNcFormBox.ts'

defineProps<{
	/**
	 * Display the group as a row instead of a column
	 */
	row?: boolean
}>()

defineSlots<{
	/**
	 * Grouped content
	 */
	default?: Slot<{
		/**
		 * Class to add on a custom item to apply the border radius effect
		 */
		itemClass: string
	}>
}>()

const style = useCssModule()

provide(NC_FORM_BOX_CONTEXT_KEY, {
	isInFormBox: true,
	formBoxItemClass: style.ncFormBox__item,
})
</script>

<template>
	<div :class="[$style.ncFormBox, row ? $style.ncFormBox_row : $style.ncFormBox_col]">
		<slot :itemClass="$style.ncFormBox__item" />
	</div>
</template>

<style lang="scss" module>
.ncFormBox {
	display: flex;
	flex-direction: column;
	gap: calc(1 * var(--default-grid-baseline));

	&.ncFormBox_row {
		flex-direction: row;
	}
}

.ncFormBox__item {
	border-radius: var(--border-radius-small) !important;
}

.ncFormBox_col {
	flex-direction: column;

	.ncFormBox__item {
		&:first-child {
			border-start-start-radius: var(--border-radius-element) !important;
			border-start-end-radius: var(--border-radius-element) !important;
		}

		&:last-child {
			border-end-start-radius: var(--border-radius-element) !important;
			border-end-end-radius: var(--border-radius-element) !important;
		}
	}
}

.ncFormBox_row {
	flex-direction: row;

	.ncFormBox__item {
		flex: 1 1;

		&:first-child {
			border-start-start-radius: var(--border-radius-element) !important;
			border-end-start-radius: var(--border-radius-element) !important;
		}

		&:last-child {
			border-end-end-radius: var(--border-radius-element) !important;
			border-start-end-radius: var(--border-radius-element) !important;
		}
	}
}
</style>

<docs>
### General

A container of supported components with a small gap and rounded corners forming a solid group.

Currently supported components:
- **`<NcFormBoxButton>`**: an action button/link with an optional description specially for the `<NcFormBox>` context
- **`<NcFormBoxCopyButton>`**: a special case of a button to copy a text to the clipboard
- **`<NcFormBoxSwitch>`**: a toggle switch replacing `<NcCheckboxRadioSwitch type="switch">` in a box
- **`<NcButton>`**: a general button in case there is a kind of primary action within a box

**Note**: if the group has a semantic meaning, consider wrapping the `<NcFormBox>` into `<NcFormGroup>` component with a label.

```vue
<script>
import { mdiArrowRight, mdiFolderOpenOutline, mdiPlus } from '@mdi/js'

export default {
	setup() {
		return { mdiArrowRight, mdiFolderOpenOutline, mdiPlus }
	},

	data() {
		return {
			text: 'Text',
			switchValue: false,
		}
	},
}
</script>

<template>
	<div style="display: flex; flex-direction: column; gap: calc(6 * var(--default-grid-baseline));">
		<NcFormBox>
			<NcFormBoxCopyButton label="WebDAV URL" value="https://cloud.example.tld/remote.php/dav/files/user" />
		</NcFormBox>

		<NcFormGroup label="Account settings">
			<NcFormBox>
				<NcFormBoxButton label="user@example.com">
					<template #icon>
						<NcIconSvgWrapper :path="mdiArrowRight" inline />
					</template>
				</NcFormBoxButton>
				<NcFormBoxButton label="sales@example.com">
					<template #icon>
						<NcIconSvgWrapper :path="mdiArrowRight" inline />
					</template>
				</NcFormBoxButton>
				<NcButton wide>
					<template #icon>
						<NcIconSvgWrapper :path="mdiPlus" />
					</template>
					Add mail account
				</NcButton>
			</NcFormBox>
		</NcFormGroup>

		<NcFormGroup label="Device settings">
			<NcFormBox>
				<NcFormBoxSwitch v-model="switchValue" label="Turn camera and microphone off by default" />
				<NcFormBoxSwitch v-model="switchValue" label="Blur camera background by default"  />
				<NcFormBoxSwitch
					v-model="switchValue"
					label="Skip device preview before joining a call"
					description="Will always show if recording consent is required" />
			</NcFormBox>
		</NcFormGroup>

		<NcFormBox>
			<NcFormBoxButton
				label="Attachments folder"
				description="/Talk"
				inverted-accent>
				<template #icon>
					<NcIconSvgWrapper :path="mdiFolderOpenOutline" inline />
				</template>
			</NcFormBoxButton>
		</NcFormBox>
	</div>
</template>
```

### Advanced usage

Scoped slot prop `itemClass` can be used to apply the same border radius effect to custom components.
Create an issue if you need a composable to inject the class into a custom component.

```vue
<template>
	<NcFormBox v-slot="{ itemClass }">
		<button class="native-button" :class="itemClass">
			First native button
		</button>
		<button class="native-button" :class="itemClass">
			Second native button
		</button>
		<button class="native-button" :class="itemClass">
			Third native button
		</button>
	</NcFormBox>
</template>

<style scoped>
.native-button {
	/* Remove default server margin around a native button */
	margin: 0 !important;
}
</style>
```
</docs>
