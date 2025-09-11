<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import Vue, { computed, provide, ref } from 'vue'
import { createElementId } from '../../utils/createElementId.ts'
import { INSIDE_RADIO_GROUP_KEY } from './useNcRadioGroup.ts'

const props = defineProps<{
	/**
	 * Label of the radio group (accessible name).
	 * It can be hidden visually if needed using `hidden-label` prop.
	 */
	label: string

	/**
	 * If set the label of the button group will not be shown visually but only for accessibility purposes.
	 */
	labelHidden?: boolean

	/**
	 * Optional visual description of the radio group.
	 */
	description?: string

	/**
	 * The currently selected value
	 */
	modelValue?: string
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', v: string): void
}>()

const descriptionId = createElementId()
const buttonVariant = ref<boolean>()

provide(INSIDE_RADIO_GROUP_KEY, computed(() => ({
	modelValue: props.modelValue,
	onUpdate,
	register,
})))

/**
 * Register a child component
 *
 * @param isButton - Whether the registered child component is a button or normal radio
 */
function register(isButton: boolean): void {
	if (buttonVariant.value !== undefined && buttonVariant.value !== isButton) {
		Vue.util.warn('[NcRadioGroup] Mixing NcCheckboxRadioSwitch and NcRadioGroupButton is not possible!')
	}
	buttonVariant.value = isButton
}

/**
 * Handle updating the current model value
 *
 * @param value - The new value
 */
function onUpdate(value: string) {
	emit('update:modelValue', value)
}
</script>

<script lang="ts">
export default {
	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
	},
}
</script>

<template>
	<fieldset
		:aria-describedby="description ? descriptionId : undefined"
		:class="[{
			[$style.radioGroup_buttonVariant]: buttonVariant,
		}, $style.radioGroup]">
		<legend :class="[$style.radioGroup__label, { 'hidden-visually': labelHidden }]">
			{{ label }}
		</legend>
		<p v-if="description" :id="descriptionId" :class="$style.radioGroup__description">
			{{ description }}
		</p>
		<div :class="$style.radioGroup__wrapper">
			<!-- @slot Slot for the included radio buttons (`NcCheckboxRadioSwitch`).
				 The `type` prop of the `NcCheckboxRadioSwitch` will be automatically set (and forced) to `radio`.
				 If you want the button variant, then you have to use `NcRadioGroupButton`.-->
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

.radioGroup__label {
	font-size: 1.2em;
	font-weight: bold;
	margin-inline-start: var(--border-radius-element);
}

.radioGroup__description {
	color: var(--color-text-maxcontrast);
	margin-block-end: var(--default-grid-baseline);
	margin-inline-start: var(--border-radius-element);
}

.radioGroup__wrapper {
	display: flex;
	flex-direction: column;

	> * {
		flex: 1 0 1px;
	}
}

.radioGroup__label + .radioGroup__wrapper {
	// when there is no description we need to add some margin between wrapper and label
	margin-block-start: var(--default-grid-baseline);
}

.radioGroup_buttonVariant .radioGroup__wrapper {
	flex-direction: row;
	gap: var(--default-grid-baseline);
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
			<NcRadioGroup v-model="alignment" label="Example alignment" label-hidden>
				<NcRadioGroupButton label="Start" value="start" />
				<NcRadioGroupButton label="Center" value="center" />
				<NcRadioGroupButton label="End" value="end" />
			</NcRadioGroup>
		</div>

		<br>

		<h4>With icons</h4>
		<div style="max-width: 250px">
			<NcRadioGroup v-model="alignment" label="Example alignment with icons" label-hidden>
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
