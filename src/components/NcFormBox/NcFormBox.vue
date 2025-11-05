<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { provide, useCssModule } from 'vue'
import { NC_FORM_BOX_CONTEXT_KEY } from './useNcFormBox.ts'

withDefaults(defineProps<{
	/**
	 * Display the group as a row instead of a column
	 */
	row?: boolean
}>(), {
	row: false,
})

const style = useCssModule()

provide(NC_FORM_BOX_CONTEXT_KEY, {
	isInFormBox: true,
	formBoxItemClass: style.ncFormBox__item,
})
</script>

<template>
	<div :class="[$style.ncFormBox, row ? $style.ncFormBox_row : $style.ncFormBox_col]">
		<!--
			@slot Grouped content
				@binding {string} itemClass - Class to add on a custom item to apply the border radius effect
		  -->
		<slot :item-class="$style.ncFormBox__item" />
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

Visually group form elements with a small gap and rounded corners forming a solid group for supported components.

**Note**: if the group has a semantic meaning, consider using the `<NcFormGroup>` component.

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
	<NcFormBox>
		<NcTextField v-model="text" label="Text Field" />
		<NcTextField v-model="text" label="Text Field" />
		<NcTextField v-model="text" label="Text Field" />
		<NcSelect v-model="option" input-label="Select Field" :options="['One', 'Two', 'Three']" />
	</NcFormBox>
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

		<h4>NcButton inside NcFormBox with scoped-slot</h4>
		<NcFormBox v-slot="{ itemClass }">
			<NcButton :class="itemClass" wide>
				First button
			</NcButton>
			<NcButton :class="itemClass" wide>
				Second button
			</NcButton>
			<NcButton :class="itemClass" wide>
				Third button
			</NcButton>
		</NcFormBox>
	</div>
</template>
```
</docs>
