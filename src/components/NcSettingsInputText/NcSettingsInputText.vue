<!--
  - SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

```vue
<template>
	<div>
		<NcSettingsInputText v-model="value" label="Label" hint="Hint" />
		<NcSettingsInputText label="Label" model-value="Value" hint="Hint" disabled />
	</div>
</template>

<script>
export default {
	data() {
		return {
			value: ''
		}
	},
}
</script>
```

</docs>

<template>
	<form
		ref="form"
		:disabled="disabled"
		@submit.prevent.stop="onSubmit">
		<div class="input-wrapper">
			<label :for="id" class="action-input__label">{{ label }}</label>
			<input
				:id="id"
				type="text"
				:value="model"
				:disabled="disabled"
				@input="onInput"
				@change="onChange">
			<input
				:id="idSubmit"
				:value="submitTranslated"
				type="submit"
				class="action-input__submit">
			<p v-if="hint" class="hint">
				{{ hint }}
			</p>
		</div>
	</form>
</template>

<script>
import { useModelMigration } from '../../composables/useModelMigration.ts'
import { t } from '../../l10n.js'
import GenRandomId from '../../utils/GenRandomId.js'

export default {
	name: 'NcSettingsInputText',

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		/**
		 * label of the select group element
		 */
		label: {
			type: String,
			required: true,
		},

		/**
		 * hint of the select group input
		 */
		hint: {
			type: String,
			default: '',
		},

		/**
		 * Removed in v9 - use `modelValue` (`v-model`) instead
		 * @deprecated
		 */
		value: {
			type: String,
			default: undefined,
		},

		/**
		 * value of the select group input
		 */
		modelValue: {
			type: String,
			default: '',
		},

		/**
		 * disabled state of the settings select group input
		 */
		disabled: {
			type: Boolean,
			default: false,
		},

		/**
		 * id attribute of the select group element
		 */
		id: {
			type: String,
			default: () => 'settings-input-text-' + GenRandomId(),
			validator: (id) => id.trim() !== '',
		},
	},

	emits: [
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 * @deprecated
		 */
		'update:value',
		/**
		 * Emitted when the inputs value changes
		 *
		 * @type {string}
		 */
		'update:modelValue',
		/* Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
		'input',
		'submit',
		'change',
	],

	setup() {
		const model = useModelMigration('value', 'update:value')
		return {
			model,
		}
	},

	data() {
		return {
			submitTranslated: t('Submit'),
		}
	},

	computed: {
		/**
		 * @return {string}
		 */
		idSubmit() {
			return this.id + '-submit'
		},
	},

	methods: {
		onInput(event) {
			this.$emit('input', event)
			this.model = event.target.value
		},

		onSubmit(event) {
			if (!this.disabled) {
				/**
				 * Emitted on submit of the input field
				 *
				 * @type {Event}
				 */
				this.$emit('submit', event)
			}
		},

		onChange(event) {
			/**
			 * Emitted on change of the input field
			 *
			 * @type {Event}
			 */
			this.$emit('change', event)
		},
	},
}
</script>

<style lang="scss" scoped>

	.input-wrapper {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		width: 100%;
		max-width: 400px;

		& .action-input__label {
			margin-right: 12px;
		}

		// if disabled, change cursor
		&:disabled {
			cursor: default;
		}

		.hint {
			color: var(--color-text-maxcontrast);
			margin-left: 8px;
		}
	}

</style>
