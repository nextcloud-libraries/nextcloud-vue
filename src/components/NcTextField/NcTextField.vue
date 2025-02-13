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
		<NcTextField label="Disabled"
			:value="text1"
			:disabled="true" />
		<NcTextField label="Disabled + Success"
			:value="text2"
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
	<NcInputField v-bind="propsAndAttrsToForward"
		ref="inputField"
		v-on="$listeners">
		<template v-if="!!$scopedSlots.icon || !!$slots.default || !!$scopedSlots.default" #icon>
			<!-- @slot Leading icon -->
			<slot name="icon">
				<!-- @slot Deprecated, removed in v9: use #icon slot instead. -->
				<slot />
			</slot>
		</template>

		<!-- Trailing icon slot, except for search type input as the browser already adds a trailing close icon -->
		<template v-if="type !== 'search'" #trailing-button-icon>
			<Close v-if="trailingButtonIcon === 'close'" :size="20" />
			<ArrowRight v-else-if="trailingButtonIcon === 'arrowRight'" :size="20" />
			<Undo v-else-if="trailingButtonIcon === 'undo'" :size="20" />
		</template>
	</NcInputField>
</template>

<script>

import NcInputField from '../NcInputField/NcInputField.vue'

import Close from 'vue-material-design-icons/Close.vue'
import ArrowRight from 'vue-material-design-icons/ArrowRight.vue'
import Undo from 'vue-material-design-icons/UndoVariant.vue'

import { t } from '../../l10n.js'
import { useModelMigration } from '../../composables/useModelMigration.ts'

const NcInputFieldProps = new Set(Object.keys(NcInputField.props))

export default {
	name: 'NcTextField',

	components: {
		NcInputField,
		Close,
		ArrowRight,
		Undo,
	},

	// Allow forwarding all attributes
	inheritAttrs: false,

	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
	},

	props: {
		/**
		 * Any [NcInputField](#/Components/NcFields?id=ncinputfield) props
		 */
		// Not an actual prop but needed to show in vue-styleguidist docs
		// eslint-disable-next-line
		' ': {},

		// Reuse all the props from NcInputField for better typing and documentation
		...NcInputField.props,

		/**
		 * The `aria-label` to set on the trailing button
		 * If no explicit value is set it will default to the one matching the `trailingButtonIcon`:
		 * @default 'Clear text'|'Save changes'|'Undo changes'
		 */
		trailingButtonLabel: {
			type: String,
			default: '',
		},

		// Custom props

		/**
		 * Specifies which material design icon should be used for the trailing
		 * button.
		 * @type {'close'|'arrowRight'|'undo'}
		 */
		trailingButtonIcon: {
			type: String,
			default: 'close',
			validator: (value) => [
				'close',
				'arrowRight',
				'undo',
			].includes(value),
		},
	},

	emits: [
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 * @deprecated
		 */
		'update:value',
		'update:modelValue',
		/** Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
	],

	setup() {
		const model = useModelMigration('value', 'update:value')
		return {
			model,
		}
	},

	computed: {
		propsAndAttrsToForward() {
			const predefinedLabels = {
				undo: t('Undo changes'),
				close: t('Clear text'),
				arrowRight: t('Save changes'),
			}

			return {
				// Proxy all the HTML attributes
				...this.$attrs,
				// Proxy original NcInputField's props
				...Object.fromEntries(
					Object.entries(this.$props).filter(([key]) => NcInputFieldProps.has(key)),
				),
				// Adjust aria-label for predefined trailing buttons
				trailingButtonLabel: this.trailingButtonLabel || predefinedLabels[this.trailingButtonIcon],
			}
		},
	},

	methods: {
		/**
		 * Focus the input element
		 *
		 * @public
		 */
		focus() {
			this.$refs.inputField.focus()
		},

		/**
		 * Select all the text in the input
		 *
		 * @public
		 */
		select() {
			this.$refs.inputField.select()
		},
	},
}
</script>
