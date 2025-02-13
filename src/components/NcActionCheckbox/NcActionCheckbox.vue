<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to be used inside of the [NcActions](#NcActions) component slots.

```vue
<template>
	<NcActions>
		<NcActionCheckbox @change="alert('(un)checked !')">First choice</NcActionCheckbox>
		<NcActionCheckbox v-model="checkboxValue" value="second" @change="alert('(un)checked !')">Second choice (v-model)</NcActionCheckbox>
		<NcActionCheckbox :model-value="checkboxValue" @change="alert('(un)checked !')">Third choice (checked)</NcActionCheckbox>
		<NcActionCheckbox :disabled="true" @change="alert('(un)checked !')">Fourth choice (disabled)</NcActionCheckbox>
	</NcActions>
</template>

<script>
export default {
	data() {
		return {
			checkboxValue: false,
		}
	},

	methods: {
		alert(message) {
			alert(message)
		}
	}
}
</script>
```
</docs>

<template>
	<li class="action" :class="{ 'action--disabled': disabled }" :role="isInSemanticMenu && 'presentation'">
		<span class="action-checkbox" :role="isInSemanticMenu && 'menuitemcheckbox'" :aria-checked="ariaChecked">
			<input :id="id"
				ref="checkbox"
				:disabled="disabled"
				:checked="model"
				:value="value"
				:class="{ focusable: isFocusable }"
				type="checkbox"
				class="checkbox action-checkbox__checkbox"
				@keydown.enter.exact.prevent="checkInput"
				@change="onChange">
			<label ref="label" :for="id" class="action-checkbox__label">{{ text }}</label>

			<!-- fake slot to gather inner text -->
			<slot v-if="false" />
		</span>
	</li>
</template>

<script>
import { useModelMigration } from '../../composables/useModelMigration.ts'
import ActionGlobalMixin from '../../mixins/actionGlobal.js'
import GenRandomId from '../../utils/GenRandomId.js'

export default {
	name: 'NcActionCheckbox',

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
		 * id attribute of the checkbox element
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
		 * checked state of the the checkbox element
		 */
		modelValue: {
			type: Boolean,
			default: false,
		},

		/**
		 * value of the checkbox input
		 */
		value: {
			type: [String, Number],
			default: '',
		},

		/**
		 * disabled state of the checkbox element
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'change',
		'check',
		'uncheck',
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 * @deprecated
		 */
		'update:checked',
		/**
		 * Emitted when the checkbox state is changed
		 * @type {boolean}
		 */
		'update:modelValue',
		/** Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
	],

	setup() {
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
		checkInput(event) {
			// by clicking we also trigger the change event
			this.$refs.label.click()
		},
		onChange(event) {
			this.model = this.$refs.checkbox.checked

			/**
			 * Emitted when the checkbox state is changed
			 *
			 * @type {Event}
			 */
			this.$emit('change', event)

			if (this.$refs.checkbox.checked) {
				/**
				 * Emitted when the checkbox is checked
				 *
				 * @type {Event}
				 */
				this.$emit('check')
			} else {
				/**
				 * Emitted when the checkbox is unchecked
				 *
				 * @type {Event}
				 */
				this.$emit('uncheck')
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../assets/action';
@include action-active;
@include action--disabled;

.action-checkbox {
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
	&__checkbox {
		position: absolute;
		inset-inline-start: 0 !important;
		z-index: -1;
		opacity: 0;
	}

	&__label {
		display: flex;
		align-items: center; // align checkbox to text

		width: 100%;
		padding: 0 !important;
		padding-inline-end: $icon-margin !important;

		&::before {
			margin-block: 0 !important;
			margin-inline: calc((var(--default-clickable-area) - 14px) / 2) !important;
		}
	}

	&--disabled {
		&,
		.action-checkbox__label {
			cursor: pointer;
		}
	}
}

</style>
