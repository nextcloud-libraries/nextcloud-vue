<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Description
See [NcInputField](#/Components/NcFields?id=ncinputfield) for a list of all available props.

General purpose text field component.
It is recommended to not only provide a placeholder, but also a label.
The label should describe what input is expected and the placehold what format the input should have.

Note: the inner html `input` element inherits all the attributes from the
NcTextField component so you can add things like `autocomplete`, `maxlength`
and `minlength`.

```
<template>
	<div class="wrapper">
		<NcTextField v-model="text1"
			label="Leading icon and clear trailing button"
			trailing-button-icon="close"
			:show-trailing-button="text1 !== ''"
			@trailing-button-click="clearText">
			<template #icon>
				<Magnify :size="20" />
			</template>
		</NcTextField>
		<NcTextField v-model="text4"
			label="Internal label"
			placeholder="That can be used together with placeholder"
			trailing-button-icon="close"
			:show-trailing-button="text4 !== ''"
			@trailing-button-click="clearText">
			<template #icon>
				<Lock :size="20" />
			</template>
		</NcTextField>
		<NcTextField v-model="text2"
			label="With helper text"
			helper-text="This is an optional message to show e.g. validation errors."
			@trailing-button-click="clearText">
		</NcTextField>
		<NcTextField v-model="text2"
			label="Success state"
			placeholder="Placeholders are possible"
			:success="true"
			@trailing-button-click="clearText">
		</NcTextField>
		<NcTextField v-model="text3"
			label="Error state"
			placeholder="Enter something valid"
			:error="true"
			@trailing-button-click="clearText">
		</NcTextField>
		<NcTextField :model-value=""
			label="Disabled"
			:disabled="true" />
		<NcTextField :model-value=""
			label="Disabled + Success"
			:success="true"
			:disabled="true" />
		<div class="external-label">
			<label for="textField">External label</label>
			<NcTextField v-model="text5"
				id="textField"
				:label-outside="true"
				placeholder="Input with external label"
				@trailing-button-click="clearText" />
		</div>
	</div>
</template>
<script>
import Magnify from 'vue-material-design-icons/Magnify'
import Lock from 'vue-material-design-icons/Lock'
import Close from 'vue-material-design-icons/Close'

export default {
	data() {
		return {
			text1: '',
			text2: '',
			text3: '',
			text4: '',
			text5: '',
		}
	},

	components: {
		Magnify,
		Lock,
		Close,
	},

	methods: {
		clearText() {
			this.text1 = ''
			this.text3 = ''
		}
	}
}
</script>
<style lang="scss" scoped>
.wrapper {
	display: flex;
	gap: 4px;
	align-items: flex-end;
	flex-wrap: wrap;
}

.external-label {
	display: flex;
	gap: 14px;
	width: 100%;
	margin-top: 1rem;
}

.external-label label {
	padding-top: 7px;
	white-space: nowrap;
}
</style>
```
</docs>

<template>
	<NcInputField v-bind="propsToForward"
		ref="inputField"
		v-model="modelValue">
		<template v-if="!!$slots.icon" #icon>
			<slot name="icon" />
		</template>

		<!-- Trailing icon slot, except for search type input as the browser already adds a trailing close icon -->
		<template v-if="type !== 'search'" #trailing-button-icon>
			<Close v-if="trailingButtonIcon === 'close'" :size="20" />
			<ArrowRight v-else-if="trailingButtonIcon === 'arrowRight'" :size="20" />
			<Undo v-else-if="trailingButtonIcon === 'undo'" :size="20" />
		</template>
	</NcInputField>
</template>

<script setup lang="ts">
import type { Slot } from 'vue'
import type { NcInputFieldProps } from '../NcInputField/index.ts'

import { computed, useTemplateRef } from 'vue'
import Close from 'vue-material-design-icons/Close.vue'
import ArrowRight from 'vue-material-design-icons/ArrowRight.vue'
import Undo from 'vue-material-design-icons/UndoVariant.vue'
import NcInputField from '../NcInputField/index.ts'
import { t } from '../../l10n.js'

const props = withDefaults(defineProps<NcInputFieldProps & {
	/**
	 * Specifies which material design icon should be used for the trailing button.
	 */
	trailingButtonIcon?: 'close' | 'arrowRight' | 'undo'

	/**
	 * The `aria-label` to set on the trailing button
	 * If no explicit value is set it will default to the one matching the `trailingButtonIcon`:
	 * - 'Clear text'
	 * - 'Save changes'
	 * - 'Undo changes'
	 */
	trailingButtonLabel?: string
}>(), {
	trailingButtonIcon: 'close',
	trailingButtonLabel: undefined,
})

/**
 * The value of the input field
 * If type is 'number' and a number is passed as value than the type of `update:value` will also be 'number'
 */
const modelValue = defineModel<string | number>('modelValue', { default: '' })

// public API
defineExpose({
	focus,
	select,
})

defineSlots<{
	/**
	 * Leading icon, set the size to 20.
	 */
	icon?: Slot
}>()

const inputField = useTemplateRef('inputField')

const defaultTrailingButtonLabels = {
	undo: t('Undo changes'),
	close: t('Clear text'),
	arrowRight: t('Save changes'),
}

const NcInputFieldPropNames = new Set(Object.keys(NcInputField.props))
const propsToForward = computed<NcInputFieldProps>(() => {
	const sharedProps = Object.fromEntries(
		Object.entries(props)
			.filter(([key]) => NcInputFieldPropNames.has(key)),
	)

	sharedProps.trailingButtonLabel ??= defaultTrailingButtonLabels[props.trailingButtonIcon]
	return sharedProps satisfies NcInputFieldProps
})

/**
 * Focus the input element
 *
 * @param options - Focus options
 * @public
 */
function focus(options?: FocusOptions) {
	inputField.value!.focus(options)
}

/**
 * Select all the text in the input
 *
 * @public
 */
function select() {
	inputField.value!.select()
}
</script>
