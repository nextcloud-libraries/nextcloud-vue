<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to be used inside of the [NcActions](#NcActions) component slots.
Usually, you will provide a name prop to bind the radio together.
So that only one of each name set can be selected at the same time.

```vue
<template>
	<div>
		<NcActions>
			<NcActionRadio v-for="option in radioOptions"
				:key="option.value"
				:value="option.value"
				:disabled="option.disabled"
				name="uniqueId"
				v-model="radioValue">
				{{ option.label }}
			</NcActionRadio>
		</NcActions>
		<span>Selected value: {{ radioValue }}</span>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				radioOptions: [
					{ value: 'first', label: 'First choice', disabled: false },
					{ value: 'second', label: 'Second choice', disabled: false },
					{ value: 'third', label: 'Third choice', disabled: false },
					{ value: 'fourth', label: 'Fourth choice (disabled)', disabled: true },
				],
				radioValue: 'first',
			}
		},
	}
</script>
```
</docs>

<template>
	<li class="action" :class="{ 'action--disabled': disabled }" :role="isInSemanticMenu && 'presentation'">
		<label class="action-radio" :role="isInSemanticMenu && 'menuitemradio'" :aria-checked="isInSemanticMenu && isChecked.toString()">
			<span class="action-radio__icon">
				<input
					:id="id"
					v-model="model"
					type="radio"
					class="action-radio__input"
					:class="{ focusable: !disabled }"
					:value="value"
					:name="name"
					:disabled="disabled"
					@change="$emit('change', $event)">
				<NcIconSvgWrapper :path="isChecked ? mdiRadioboxMarked : mdiRadioboxBlank" :size="20" />
			</span>
			<span class="action-radio__text">{{ text }}</span>
		</label>
	</li>
</template>

<script>
import { mdiRadioboxBlank, mdiRadioboxMarked } from '@mdi/js'
import Vue from 'vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { useModelMigration } from '../../composables/useModelMigration.ts'
import ActionGlobalMixin from '../../mixins/actionGlobal.js'
import GenRandomId from '../../utils/GenRandomId.js'

export default {
	name: 'NcActionRadio',

	components: {
		NcIconSvgWrapper,
	},

	mixins: [ActionGlobalMixin],

	inject: {
		isInSemanticMenu: {
			from: 'NcActions:isSemanticMenu',
			default: false,
		},
	},

	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
	},

	props: {
		/**
		 * id attribute of the radio element
		 */
		id: {
			type: String,
			default: () => 'action-' + GenRandomId(),
			validator: (id) => id.trim() !== '',
		},

		/**
		 * Removed in v9 - use `modelValue` (`v-model`) instead
		 *
		 * @deprecated
		 */
		checked: {
			type: Boolean,
			// eslint-disable-next-line vue/no-boolean-default
			default: undefined,
		},

		/**
		 * Checked state of the radio element
		 * Boolean type removed in v9 - use String | Number instead
		 */
		modelValue: {
			type: [Boolean, String, Number],
			default: false,
		},

		/**
		 * Define if this radio is part of a set.
		 * Checking the radio will disable all the
		 * others with the same name.
		 */
		name: {
			type: String,
			required: true,
		},

		/**
		 * value of the radio input
		 */
		value: {
			type: [String, Number],
			default: '',
		},

		/**
		 * disabled state of the radio element
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 *
		 * @deprecated
		 */
		'update:checked',
		/**
		 * The radio state is changed
		 *
		 * @type {boolean}
		 */
		'update:modelValue',
		/** Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
		'change',
	],

	setup(props) {
		if (typeof props.modelValue === 'boolean') {
			Vue.util.warn('[NcActionRadio] Boolean type of `modelValue` is deprecated and will be removed in next versions')
		}

		const model = useModelMigration('checked', 'update:checked')
		return {
			model,
			mdiRadioboxBlank,
			mdiRadioboxMarked,
		}
	},

	computed: {
		isChecked() {
			return this.model === this.value
		},
	},

	methods: {
		toggleInput() {
			// by clicking we also trigger the change event
			this.$refs.label.click()
		},

		onChange(event) {
			/**
			 * Emitted when the radio state is changed
			 *
			 * @type {Event}
			 */
			this.$emit('change', event)
		},
	},
}
</script>

<style lang="scss" scoped>
@use '../../assets/action.scss' as *;
@include action-active;
@include action--disabled;
@include action-item('radio');

.action:has(:focus-visible) {
	outline: 2px solid currentColor;
}

.action-radio {
	&__icon {
		color: var(--color-primary-element);
	}

	&__input {
		width: 20px;
		height: 20px;
		margin: auto;
		position: absolute;
		z-index: -1;
		opacity: 0 !important;
	}
}
</style>
