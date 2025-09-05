<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

import { computed, provide } from 'vue'
import { INSIDE_RADIO_GROUP_KEY } from './useNcRadioGroup.ts'

const modelValue = defineModel<string>({ required: false, default: '' })

defineProps<{
	/**
	 * If the radio group should be shown as buttons.
	 * When set `NcRadioGroupButton` must be used in the default slot.
	 */
	buttonVariant?: boolean

	/**
	 * Optional visual label of the radio group
	 */
	label?: string
}>()

defineSlots<{
	/**
	 * Slot for the included radio buttons (`NcCheckboxRadioSwitch`).
	 * The `type` prop of the `NcCheckboxRadioSwitch` will be automatically set (and forced) to `radio`.
	 *
	 * If you want the button variant, then you have to use `NcRadioGroupButton`.
	 */
	default?: Slot
}>()

provide(INSIDE_RADIO_GROUP_KEY, computed(() => ({
	modelValue: modelValue.value,
	onUpdate,
})))

/**
 * Handle updating the current model value
 *
 * @param value - The new value
 */
function onUpdate(value: string) {
	modelValue.value = value
}
</script>

<template>
	<fieldset
		:class="[{
			[$style.radioGroup_buttonVariant]: buttonVariant,
		}, $style.radioGroup]">
		<legend v-if="label" :class="$style.radioGroup__label">
			{{ label }}
		</legend>
		<div :class="$style.radioGroup__wrapper">
			<slot />
		</div>
	</fieldset>
</template>

<style module lang="scss">
.radioGroup {
	display: flex;
	flex-direction: column;

	&:not(.radioGroup_buttonVariant) :global(.checkbox-content) {
		max-width: unset !important;
	}
}

.radioGroup__wrapper {
	display: flex;
	flex-direction: column;

	> * {
		flex: 1 0 1px;
	}
}

.radioGroup_buttonVariant .radioGroup__wrapper {
	flex-direction: row;
	gap: var(--default-grid-baseline);
}

.radioGroup__label {
	font-size: 1.2em;
	font-weight: bold;
	margin-inline-start: var(--border-radius-element);
	margin-block-end: var(--default-grid-baseline);
}
</style>

<docs>
## Usage example

### Grouping multiple radio buttons

The radio group allows to group radio buttons into semantical groups.
The `v-model` only needs to be bound to the group component, also the `type` will automatically be set to `radio`.

```vue
<template>
	<NcRadioGroup v-model="selectedSides" class="radio-group" label="Sides">
		<NcCheckboxRadioSwitch value="fries">
			Fries
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch value="salad">
			Salad
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch value="none">
			Nothing
		</NcCheckboxRadioSwitch>
	</NcRadioGroup>
</template>

<script>
export default {
	data() {
		return {
			selectedSides: 'none',
		}
	},
}
</script>

<style scoped>
.radio-group {
	max-width: 400px
}
</style>
```

### Radio buttons with button styling

The radio group also allows to create a button like styling together with the `NcRadioGroupButton` component:

```vue
<template>
	<div>
		<h4>With text labels</h4>
		<div style="max-width: 400px">
			<NcRadioGroup v-model="alignment" button-variant>
				<NcRadioGroupButton label="Start" value="start" />
				<NcRadioGroupButton label="Center" value="center" />
				<NcRadioGroupButton label="End" value="end" />
			</NcRadioGroup>
		</div>

		<br>

		<h4>With icons</h4>
		<div style="max-width: 250px">
			<NcRadioGroup v-model="alignment" button-variant>
				<NcRadioGroupButton aria-label="Start" value="start">
					<template #icon>
						<NcIconSvgWrapper directional :path="mdiAlignHorizontalLeft" />
					</template>
				</NcRadioGroupButton>
				<NcRadioGroupButton aria-label="Center" value="center">
					<template #icon>
						<NcIconSvgWrapper :path="mdiAlignHorizontalCenter" />
					</template>
				</NcRadioGroupButton>
				<NcRadioGroupButton aria-label="End" value="end">
					<template #icon>
						<NcIconSvgWrapper directional :path="mdiAlignHorizontalRight" />
					</template>
				</NcRadioGroupButton>
			</NcRadioGroup>
		</div>
	</div>
</template>

<script>
import { mdiAlignHorizontalCenter, mdiAlignHorizontalLeft, mdiAlignHorizontalRight } from '@mdi/js'

export default {
	setup() {
		return {
			mdiAlignHorizontalCenter,
			mdiAlignHorizontalLeft,
			mdiAlignHorizontalRight,
		}
	},
	data() {
		return {
			alignment: 'center',
		}
	},
}
</script>
```
</docs>
