<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

import { computed, provide, ref, warn } from 'vue'
import NcFormBox from '../NcFormBox/NcFormBox.vue'
import NcFormGroup from '../NcFormGroup/NcFormGroup.vue'
import { INSIDE_RADIO_GROUP_KEY } from './useNcRadioGroup.ts'

const modelValue = defineModel<string>({ required: false, default: '' })

defineProps<{
	/**
	 * Label of the radio group (accessible name).
	 * It can be hidden visually if needed using `hide-label` prop.
	 */
	label: string

	/**
	 * If set the label of the button group will not be shown visually but only for accessibility purposes.
	 *
	 * @deprecated Use `hide-label` instead.
	 */
	labelHidden?: boolean

	/**
	 * If set the label of the button group will not be shown visually but only for accessibility purposes.
	 */
	hideLabel?: boolean

	/**
	 * Optional visual description of the radio group.
	 */
	description?: string
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

const buttonVariant = ref<boolean>()

provide(INSIDE_RADIO_GROUP_KEY, computed(() => ({
	register,
	modelValue: modelValue.value,
	onUpdate,
})))

/**
 * Register a child component
 *
 * @param isButton - Whether the registered child component is a button or normal radio
 */
function register(isButton: boolean): void {
	if (buttonVariant.value !== undefined && buttonVariant.value !== isButton) {
		warn('[NcRadioGroup] Mixing NcCheckboxRadioSwitch and NcRadioGroupButton is not possible!')
	}
	buttonVariant.value = isButton
}

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
	<NcFormGroup
		:label
		:description
		:hide-label="labelHidden || hideLabel">
		<NcFormBox v-if="buttonVariant" row>
			<slot />
		</NcFormBox>
		<span v-else :class="$style.radioGroup_checkboxRadioContainer">
			<slot />
		</span>
	</NcFormGroup>
</template>

<style module lang="scss">
.radioGroup_checkboxRadioContainer :global(.checkbox-content) {
	max-width: unset !important;
}
</style>

<docs>
## Usage example

### Grouping multiple radio buttons

The radio group allows to group radio buttons into semantical groups.
The `v-model` only needs to be bound to the group component, also the `type` will automatically be set to `radio`.

```vue
<template>
	<NcRadioGroup v-model="selectedSides" class="radio-group" label="Sides" description="Please choose the sides for your menu.">
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
			<NcRadioGroup v-model="alignment" label="Example alignment" hide-label>
				<NcRadioGroupButton label="Start" value="start" />
				<NcRadioGroupButton label="Center" value="center" />
				<NcRadioGroupButton label="End" value="end" />
			</NcRadioGroup>
		</div>

		<br>

		<h4>With icons</h4>
		<div style="max-width: 250px">
			<NcRadioGroup v-model="alignment" label="Example alignment with icons" hide-label>
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
