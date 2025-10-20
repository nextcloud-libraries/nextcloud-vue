<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

import { provide, useCssModule } from 'vue'
import { NC_FORM_GROUP_CONTEXT_KEY } from './useNcFormGroup.ts'

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

provide(NC_FORM_GROUP_CONTEXT_KEY, {
	isInGroup: true,
	formGroupItemClass: style.ncFormGroup__item,
})
</script>

<template>
	<div :class="[$style.ncFormGroup, row ? $style.ncFormGroup_row : $style.ncFormGroup_col]">
		<slot :item-class="$style.ncFormGroup__item" />
	</div>
</template>

<style lang="scss" module>
.ncFormGroup {
	display: flex;
	flex-direction: column;
	gap: calc(1 * var(--default-grid-baseline));

	&.ncFormGroup_row {
		flex-direction: row;
	}
}

.ncFormGroup__item {
	border-radius: var(--border-radius-small) !important;
}

.ncFormGroup_col {
	flex-direction: column;

	.ncFormGroup__item {
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

.ncFormGroup_row {
	flex-direction: row;

	.ncFormGroup__item {
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

Visually group form elements with a small gap and rounded corners forming a solid group for supported components.

**Note**: if the group has a semantic meaning, consider using the `<NcFieldset>` component.

```vue
<script>
export default {
	data() {
		return {
			text: 'Text',
			option: 'One'
		}
	}
}
</script>

<template>
	<NcFormGroup>
		<NcTextField v-model="text" label="Text Field" />
		<NcTextField v-model="text" label="Text Field" />
		<NcTextField v-model="text" label="Text Field" />
		<NcSelect v-model="option" input-label="Select Field" :options="['One', 'Two', 'Three']" />
	</NcFormGroup>
</template>
```

### Advanced usage

Use scoped slots params to apply the item class to custom items.

```vue
<template>
	<div>
		<h4>NcButton without a group</h4>
		<div>
			<NcButton wide>
				First button
			</NcButton>
			<NcButton wide>
				Second button
			</NcButton>
			<NcButton wide>
				Third button
			</NcButton>
		</div>

		<h4>NcButton inside NcFormGroup with scoped-slot</h4>
		<NcFormGroup v-slot="{ itemClass }">
			<NcButton :class="itemClass" wide>
				First button
			</NcButton>
			<NcButton :class="itemClass" wide>
				Second button
			</NcButton>
			<NcButton :class="itemClass" wide>
				Third button
			</NcButton>
		</NcFormGroup>
	</div>
</template>
```
</docs>
