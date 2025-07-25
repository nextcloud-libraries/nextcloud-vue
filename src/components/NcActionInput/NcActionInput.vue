<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to be used inside of the [NcActions](#NcActions) component slots.

It is recommended to not only provide a placeholder, but also a label.
The label should describe what input is expected and the placehold what format the input should have.

All undocumented attributes will be bound to the input, the datepicker or the select component, e.g. `maxlength`, `not-before`.
For the `NcSelect` component, all events will be passed through. Please see the `NcSelect` component's documentation for more details and examples.
```vue
	<template>
		<NcActions>
			<NcActionInput v-model="text" :label-outside="true" label="Label outside the input">
				<template #icon>
					<Pencil :size="20" />
				</template>
			</NcActionInput>
			<NcActionInput v-model="text" :show-trailing-button="false" label="Input without trailing button">
				<template #icon>
					<Pencil :size="20" />
				</template>
			</NcActionInput>
			<NcActionInput v-model="text" label="Input with placeholder">
				<template #icon>
					<Pencil :size="20" />
				</template>
				This is the placeholder
			</NcActionInput>
			<NcActionInput type="password" v-model="text" label="Password with visible label">
				<template #icon>
					<Key :size="20" />
				</template>
				Password placeholder
			</NcActionInput>
			<NcActionInput type="password" v-model="text" :show-trailing-button="false">
				<template #icon>
					<Key :size="20" />
				</template>
				Password placeholder
			</NcActionInput>
			<NcActionInput type="color" v-model="color" label="Favorite color">
				<template #icon>
					<Eyedropper :size="20" />
				</template>
				Color placeholder
			</NcActionInput>
			<NcActionInput label="Visible label" v-model="text">
				<template #icon>
					<Pencil :size="20" />
				</template>
				Input with visible label
			</NcActionInput>
			<NcActionInput :disabled="true" label="This is a disabled input">
				<template #icon>
					<Close :size="20" />
				</template>
			</NcActionInput>
			<NcActionInput type="date" isNativePicker v-model="date">
				<template #icon>
					<Pencil :size="20" />
				</template>
				Please pick a date
			</NcActionInput>
			<NcActionInput type="date" v-model="date">
				<template #icon>
					<Pencil :size="20" />
				</template>
				Please pick a date
			</NcActionInput>
			<NcActionInput
				type="multiselect"
				input-label="Fruit selection"
				:options="['Apple', 'Banana', 'Cherry']">
				<template #icon>
					<Pencil :size="20" />
				</template>
				Please pick a fruit
			</NcActionInput>
			<NcActionInput
				v-model="multiSelected"
				type="multiselect"
				input-label="Fruit selection"
				track-by="id"
				:append-to-body="true"
				:multiple="true"
				:options="[{label:'Apple', id: 'apple'}, {label:'Banana', id: 'banana'}, {label:'Cherry', id: 'cherry'}]">
				<template #icon>
					<Pencil :size="20" />
				</template>
				Please pick a fruit object
			</NcActionInput>
		</NcActions>
	</template>
	<script>
	import Close from 'vue-material-design-icons/Close'
	import Eyedropper from 'vue-material-design-icons/Eyedropper'
	import Key from 'vue-material-design-icons/Key'
	import Pencil from 'vue-material-design-icons/Pencil'

	export default {
		components: {
			Close,
			Eyedropper,
			Key,
			Pencil,
		},
		data() {
			return {
				color: '#0082C9',
				date: new Date(),
				text: 'This is the input text',
				multiSelected: [],
			}
		},
	}
	</script>
```
</docs>

<template>
	<li class="action" :class="[{ 'action--disabled': disabled }, $props.class ]">
		<span :class="{
				'action-input-picker--disabled': disabled,
				'action-input--visible-label': labelOutside && label,
			}"
			class="action-input"
			@mouseleave="onLeave">
			<span class="action-input__icon-wrapper">
				<!-- @slot Manually provide icon -->
				<slot name="icon">
					<span :class="[isIconUrl ? 'action-input__icon--url' : icon]"
						:style="{ backgroundImage: isIconUrl ? `url(${icon})` : null }"
						aria-hidden="true"
						class="action-input__icon" />
				</slot>
			</span>

			<!-- form and input -->
			<form ref="form"
				class="action-input__form"
				:disabled="disabled"
				@submit.prevent="onSubmit">
				<div class="action-input__container">
					<label v-if="label && labelOutside"
						class="action-input__text-label"
						:class="{ 'action-input__text-label--hidden': !labelOutside}"
						:for="inputId">
						{{ label }}
					</label>
					<div class="action-input__input-container">

						<NcDateTimePicker v-if="datePickerType"
							ref="datetimepicker"
							:model-value="modelValue"
							style="z-index: 99999999999;"
							:placeholder="text"
							:disabled="disabled"
							:type="datePickerType"
							:input-class="['mx-input', { focusable: isFocusable }]"
							class="action-input__datetimepicker"
							v-bind="$attrs"
							@update:model-value="onUpdateModelValue" />

						<NcDateTimePickerNative v-else-if="isNativePicker"
							:id="idNativeDateTimePicker"
							:model-value="modelValue"
							:type="nativeDatePickerType"
							:input-class="{ focusable: isFocusable }"
							class="action-input__datetimepicker"
							v-bind="$attrs"
							@update:model-value="onUpdateModelValue" />

						<NcSelect v-else-if="isMultiselectType"
							:model-value="modelValue"
							:placeholder="text"
							:disabled="disabled"
							:append-to-body="false"
							:input-class="{ focusable: isFocusable }"
							class="action-input__multi"
							v-bind="$attrs"
							@update:model-value="onUpdateModelValue" />

						<NcPasswordField v-else-if="type==='password'"
							:id="inputId"
							:model-value="modelValue"
							:label="label"
							:label-outside="!label || labelOutside"
							:placeholder="text"
							:disabled="disabled"
							:input-class="{ focusable: isFocusable }"
							:show-trailing-button="showTrailingButton && !disabled"
							v-bind="$attrs"
							@update:model-value="onUpdateModelValue" />

						<div v-else-if="type === 'color'" class="action-input__container">
							<label v-if="label && type === 'color'"
								class="action-input__text-label"
								:class="{ 'action-input__text-label--hidden': !labelOutside}"
								:for="inputId">
								{{ label }}
							</label>
							<div class="action-input__input-container">
								<NcColorPicker id="inputId"
									:model-value="modelValue"
									class="colorpicker__trigger"
									v-bind="$attrs"
									@update:model-value="onUpdateModelValue"
									@submit="$refs.form.requestSubmit()">
									<button :style="{'background-color': modelValue}"
										class="colorpicker__preview"
										:class="{ focusable: isFocusable }" />
								</NcColorPicker>
							</div>
						</div>

						<NcTextField v-else
							:id="inputId"
							:model-value="modelValue"
							:label="label"
							:label-outside="!label || labelOutside"
							:placeholder="text"
							:disabled="disabled"
							:input-class="{ focusable: isFocusable }"
							:type="type"
							trailing-button-icon="arrowRight"
							:trailing-button-label="trailingButtonLabel"
							:show-trailing-button="showTrailingButton && !disabled"
							v-bind="$attrs"
							@trailing-button-click="$refs.form.requestSubmit()"
							@update:model-value="onUpdateModelValue" />
					</div>
				</div>
			</form>
		</span>
	</li>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import NcDateTimePickerNative from '../NcDateTimePickerNative/index.ts'
import NcPasswordField from '../NcPasswordField/index.ts'
import NcTextField from '../NcTextField/index.ts'
import ActionGlobalMixin from '../../mixins/actionGlobal.js'
import { createElementId } from '../../utils/createElementId.ts'
import { t } from '../../l10n.ts'

export default {
	name: 'NcActionInput',

	components: {
		NcDateTimePickerNative,
		NcPasswordField,
		NcTextField,
		// Lazy load components with more than 50kB bundle size impact
		NcColorPicker: defineAsyncComponent(() => import('../NcColorPicker/index.ts')),
		NcDateTimePicker: defineAsyncComponent(() => import('../NcDateTimePicker/index.js')),
		NcSelect: defineAsyncComponent(() => import('../NcSelect/index.js')),
	},

	mixins: [ActionGlobalMixin],

	inheritAttrs: false,

	props: {
		/**
		 * id attribute of the checkbox element
		 */
		id: {
			type: String,
			default: () => 'action-' + createElementId(),
			validator: id => id.trim() !== '',
		},
		/**
		 * id attribute of the text input element
		 */
		inputId: {
			type: String,
			default: () => 'action-input-' + createElementId(),
			validator: id => id.trim() !== '',
		},
		/**
		 * Icon to show with the action, can be either a CSS class or an URL
		 */
		icon: {
			type: String,
			default: '',
		},
		/**
		 * type attribute of the input field
		 */
		type: {
			type: String,
			default: 'text',
			validator(type) {
				return ['date', 'datetime-local', 'month', 'multiselect',
					'number', 'password', 'search', 'tel',
					'text', 'time', 'url', 'week', 'color',
					'email'].indexOf(type) > -1
			},
		},
		/**
		 * id attribute for the native date time picker
		 */
		idNativeDateTimePicker: {
			type: String,
			default: 'date-time-picker_id',
		},
		/**
		 * Flag to use a native date time picker
		 */
		isNativePicker: {
			type: Boolean,
			default: false,
		},
		/**
		 * The visible input label for accessibility purposes.
		 */
		label: {
			type: String,
			default: null,
		},
		/**
		 * If you want to show the label just above the
		 * input field, pass in `true` to this prop.
		 */
		labelOutside: {
			type: Boolean,
			default: true,
		},
		/**
		 * value attribute of the input field
		 */
		modelValue: {
			type: [String, Date, Number, Array],
			default: '',
		},
		/**
		 * disabled state of the input field
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
		/**
		 * aria-label attribute of the input field
		 */
		ariaLabel: {
			type: String,
			default: '',
		},
		/**
		 * Attribute forwarded to the underlying NcPasswordField and NcTextField
		 */
		showTrailingButton: {
			type: Boolean,
			default: true,
		},
		/**
		 * Trailing button label forwarded to the underlying NcTextField
		 */
		trailingButtonLabel: {
			type: String,
			default: t('Submit'),
		},
		/**
		 * CSS class to apply to the root element.
		 */
		class: {
			type: [String, Array, Object],
			default: '',
		},
	},

	emits: [
		'submit',
		'update:modelValue',
	],

	computed: {
		isIconUrl() {
			try {
				return new URL(this.icon)
			} catch (error) {
				return false
			}
		},

		isMultiselectType() {
			return this.type === 'multiselect'
		},

		nativeDatePickerType() {
			switch (this.type) {
			case 'date':
			case 'month':
			case 'time':
			case 'week':
			case 'datetime-local':
				return this.type
			}
			return false
		},

		datePickerType() {
			if (!this.isNativePicker) {
				switch (this.type) {
				case 'date':
				case 'month':
				case 'time':
					return this.type

				case 'datetime-local':
					return 'datetime'
				}
			}
			return false
		},
		/**
		 * determines if the action is focusable
		 *
		 * @return {boolean} is the action focusable ?
		 */
		isFocusable() {
			return !this.disabled
		},
	},

	methods: {
		// closing datepicker popup on mouseleave = unfocus
		onLeave() {
			if (this.$refs.datetimepicker && this.$refs.datetimepicker.$refs.datepicker) {
				this.$refs.datetimepicker.$refs.datepicker.closePopup()
			}
		},
		onSubmit(event) {
			event.preventDefault()
			event.stopPropagation()
			if (!this.disabled) {
				/**
				 * Emitted on submit of the input field
				 *
				 * @type {Event}
				 */
				this.$emit('submit', event)
			} else {
				// ignore submit
				return false
			}
		},
		onUpdateModelValue(event) {
			/**
			 * Emitted on update of the model value
			 *
			 * @type {Event}
			 */
			this.$emit('update:modelValue', event)
		},
	},
}
</script>

<style lang="scss" scoped>
@use '../../assets/inputs.scss';
@use '../../assets/action.scss' as *;
@include action-active;
@include action--disabled;

$input-margin: 4px;

.action-input {
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

	&__icon-wrapper {
		display: flex;
		align-self: center;
		align-items: center;
		justify-content: center;

		&:deep(.material-design-icon) {
			width: var(--default-clickable-area);
			height: var(--default-clickable-area);
			opacity: $opacity_full;

			.material-design-icon__svg {
				vertical-align: middle;
			}
		}
	}

	& > span {
		cursor: pointer;
		white-space: nowrap;
	}

	&__icon {
		min-width: 0; /* Overwrite icons*/
		min-height: 0;
		// Keep padding to define the width to assure correct position of a possible text
		padding: calc(var(--default-clickable-area) / 2) 0 calc(var(--default-clickable-area) / 2) var(--default-clickable-area);

		background-position: #{$icon-margin} center;
		background-size: $icon-size;
	}

	// Forms & text inputs
	&__form {
		display: flex;
		align-items: center;
		flex: 1 1 auto;

		margin: $input-margin 0;
		padding-inline-end: $icon-margin;
	}

	&__container {
		position: relative;
		width: 100%;
	}

	&__input-container {
		display: flex;

		.colorpicker {
			&__trigger,
			&__preview {
				width: 100%;
			}

			&__preview {
				width: 100%;
				height: 36px;
				border-radius: var(--border-radius-element);
				border: 2px solid var(--color-border-maxcontrast);
				box-shadow: none !important;
			}
		}
	}

	&__text-label {
		padding: 4px 0;
		display: block;

		&--hidden {
			position: absolute;
			inset-inline-start: 0;
			width: 1px;
			height: 1px;
			overflow: hidden;
			z-index: -1;
			opacity: 0;
		}
	}

	&__datetimepicker {
		width: 100%;

		:deep(.mx-input) {
			margin: 0;
		}
	}

	&__multi {
		width: 100%;
	}
}

// if a form is the last of the list
// add the same bottomMargin as the right padding
// for visual balance
li:last-child > .action-input {
	padding-bottom: calc($icon-margin - $input-margin);
}

// same for first item
li:first-child > .action-input:not(.action-input--visible-label) {
	padding-top: calc($icon-margin - $input-margin);
}

</style>
