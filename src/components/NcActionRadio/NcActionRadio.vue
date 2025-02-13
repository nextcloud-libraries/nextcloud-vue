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
		<span class="action-radio" role="menuitemradio" :aria-checked="ariaChecked">
			<input :id="id"
				v-model="model"
				:disabled="disabled"
				:name="name"
				:value="value"
				:class="{ focusable: isFocusable }"
				type="radio"
				class="radio action-radio__radio"
				@keydown.enter.exact.prevent="toggleInput"
				@change="onChange">
			<label ref="label" :for="id" class="action-radio__label">{{ text }}</label>

			<!-- fake slot to gather inner text -->
			<slot v-if="false" />
		</span>
	</li>
</template>

<script>
import Vue from 'vue'
import { useModelMigration } from '../../composables/useModelMigration.ts'
import ActionGlobalMixin from '../../mixins/actionGlobal.js'
import GenRandomId from '../../utils/GenRandomId.js'

export default {
	name: 'NcActionRadio',

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
			validator: id => id.trim() !== '',
		},

		/**
		 * Removed in v9 - use `modelValue` (`v-model`) instead
		 * @deprecated
		 */
		checked: {
			type: Boolean,
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
		 * @deprecated
		 */
		'update:checked',
		/**
		 * The radio state is changed
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
		}
	},

	computed: {
		/**
		 * determines if the action is focusable
		 *
		 * @return {boolean} is the action focusable ?
		 */
		isFocusable() {
			return !this.disabled
		},

		/**
		 * aria-checked attribute for role="menuitemcheckbox"
		 *
		 * @return {'true'|'false'|undefined} aria-checked value if needed
		 */
		 ariaChecked() {
			if (this.isInSemanticMenu) {
				return this.model ? 'true' : 'false'
			}
			return undefined
		},
	},

	methods: {
		toggleInput(event) {
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
@import '../../assets/action';
@include action-active;
@include action--disabled;

.action-radio {
	display: flex;
	align-items: flex-start;

	width: 100%;
	height: auto;
	margin: 0;
	padding: 0;

	cursor: pointer;
	white-space: nowrap;

	color: var(--color-main-text);
	border: 0;
	border-radius: 0; // otherwise Safari will cut the border-radius area
	background-color: transparent;
	box-shadow: none;

	font-weight: normal;
	line-height: var(--default-clickable-area);

	/* checkbox/radio fixes */
	&__radio {
		position: absolute;
		inset-inline-start: 0 !important;
		z-index: -1;
		opacity: 0;
	}

	&__label {
		display: flex;
		align-items: center; // align radio to text

		width: 100%;
		padding: 0 !important;
		padding-inline-end: $icon-margin !important;

		// (34 -14) / 2 = 10 same as ncactioncheckbox
		&::before {
			margin: calc((var(--default-clickable-area) - 14px) / 2) !important;
		}
	}

	&--disabled {
		&,
		.action-radio__label {
			cursor: pointer;
		}
	}
}

</style>
