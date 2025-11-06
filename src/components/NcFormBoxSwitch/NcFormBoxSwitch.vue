<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
export default {
	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
	},
}
</script>

<script setup lang="ts">
import { mdiToggleSwitch, mdiToggleSwitchOff } from '@mdi/js'
import { useVModel } from '@vueuse/core'
import { watch } from 'vue'
import NcFormBoxItem from '../NcFormBox/NcFormBoxItem.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { createElementId } from '../../utils/createElementId.ts'

const props = withDefaults(defineProps<{
	/** Main label */
	label?: string
	/** Optional description below the label, also used for the aria-describedby */
	description?: string
	/** Disabled state */
	disabled?: boolean
	/** Switch toggle model value */
	modelValue: boolean // eslint-disable-line vue/no-unused-properties
}>(), {
	label: undefined,
	description: undefined,
	disabled: false,
})

const emit = defineEmits<{
	/** Switch is toggled ON */
	(event: 'enable'): void
	/** Switch is toggled OFF */
	(event: 'disable'): void
	(event: 'update:modelValue', value: boolean): void
}>()

const model = useVModel(props, 'modelValue', emit)

const inputId = createElementId()

watch(model, () => {
	if (model.value) {
		emit('enable')
	} else {
		emit('disable')
	}
}, {
	// defineModel emits update:modelValue synchronously
	// Watching it synchronously to emit the enable/disable events together with the update:modelValue event
	flush: 'sync',
})
</script>

<template>
	<NcFormBoxItem
		tag="label"
		:for="inputId">
		<template v-if="$slots.default || label" #default>
			<!-- @slot Custom label content -->
			<slot>
				{{ label }}
			</slot>
		</template>
		<template v-if="$slots.description || description" #description>
			<!-- @slot Custom description content -->
			<slot name="description">
				{{ description }}
			</slot>
		</template>
		<template #icon="{ descriptionId }">
			<input
				:id="inputId"
				v-model="model"
				:class="$style.formBoxSwitch__input"
				type="checkbox"
				role="switch"
				:aria-describedby="descriptionId"
				:disabled="disabled">
			<NcIconSvgWrapper
				:path="model ? mdiToggleSwitch : mdiToggleSwitchOff"
				:class="$style.formBoxSwitch__icon"
				:size="34 /* --default-clickable-area */"
				inline />
		</template>
	</NcFormBoxItem>
</template>

<style lang="scss" module>
input.formBoxSwitch__input {
	margin: 0;
	width: var(--default-clickable-area);
	/* Keep it visually hidden but on the position of visual switch icon */
	position: absolute;
	inset-block: 0;
	inset-inline-end: var(--form-element-label-offset);
	z-index: -1;
	opacity: 0 !important;
	/* Override server styles */
	height: auto;
	cursor: inherit;
}

.formBoxSwitch__icon {
	color: var(--color-text-maxcontrast);
}

input:checked + .formBoxSwitch__icon {
	color: var(--color-primary-element);
}
</style>

<docs>
### General

A toggle switch to be used within `<NcFormBox>`.

Like other form box items, it has a label and an optional description.

In addition to the standard `v-model` binding, it emits `enable` and `disable` events when toggled **on** or **off**.

```vue
<script>
export default {
	data() {
		return {
			switchValue: false,
		}
	},
	methods: {
		log: console.log,
	},
}
</script>

<template>
	<NcFormBox>
		<NcFormBoxSwitch v-model="switchValue" label="Turn camera and microphone off by default" />
		<NcFormBoxSwitch
			v-model="switchValue"
			label="Blur camera background by default"
			disabled />
		<NcFormBoxSwitch
			v-model="switchValue"
			label="Skip device preview before joining a call"
			description="Will always show if recording consent is required"
			@update:modelValue="log('Switch toggled', $event, switchValue)"
			@enable="log('Switch enabled', switchValue)"
			@disable="log('Switch disabled', switchValue)"
		/>
		<NcFormBoxSwitch v-model="switchValue" />
	</NcFormBox>
</template>
```
</docs>
