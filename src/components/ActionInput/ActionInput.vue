<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  - @author Marco Ambrosini <marcoambrosini@pm.me>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<docs>
This component is made to be used inside of the [Actions](#Actions) component slots.
All undocumented attributes will be bound to the input or the datepicker. e.g. `maxlength`, `not-before`...

```
<Actions>
	<ActionInput icon="icon-edit" value="This is an input" />
	<ActionInput icon="icon-edit">This is the placeholder</ActionInput>
	<ActionInput icon="icon-close" :disabled="true" value="This is a disabled input" />
	<ActionInput icon="icon-edit" type="date">Please pick a date</ActionInput>
</Actions>
```
</docs>

<template>
	<li class="action" :class="{ 'action--disabled': disabled }">
		<span :class="{ 'action-input--picker': isDatePickerType , 'action-input-picker--disabled': disabled}"
			class="action-input"
			@mouseleave="onLeave">
			<!-- @slot Manually provide icon -->
			<slot name="icon">
				<span :class="[isIconUrl ? 'action-input__icon--url' : icon]"
					:style="{ backgroundImage: isIconUrl ? `url(${icon})` : null }"
					class="action-input__icon" />
			</slot>

			<!-- form and input -->
			<form ref="form"
				class="action-input__form"
				:disabled="disabled"
				@submit.prevent="onSubmit">

				<DatetimePicker v-if="isDatePickerType"
					ref="datetimepicker"
					:value="value"
					:placeholder="text"
					:disabled="disabled"
					:type="isDatePickerType"
					:input-class="['mx-input', { focusable: isFocusable }]"
					class="action-input__picker"
					v-bind="$attrs"
					@input="onInput"
					@change="onChange" />

				<template v-else>
					<input :id="id" type="submit" class="action-input__submit">

					<input :type="type"
						:value="value"
						:placeholder="text"
						:disabled="disabled"
						v-bind="$attrs"
						:class="{ focusable: isFocusable }"
						class="action-input__input"
						@input="onInput"
						@change="onChange">
					<!-- allow the custom font to inject a ::before
						not possible on input[type=submit] -->
					<label v-show="!disabled" :for="id" class="action-input__label" />
				</template>
			</form>
		</span>
	</li>
</template>

<script>
import ActionGlobalMixin from '../../mixins/actionGlobal'
import GenRandomId from '../../utils/GenRandomId'
import DatetimePicker from '../DatetimePicker'

export default {
	name: 'ActionInput',

	components: { DatetimePicker },

	mixins: [ActionGlobalMixin],

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
		 * Icon to show with the action, can be either a CSS class or an URL
		 */
		icon: {
			type: String,
			default: '',
			required: true,
		},
		/**
		 * type attribute of the input field
		 */
		type: {
			type: String,
			default: 'text',
			validator(type) {
				return ['date', 'datetime-local', 'month',
					'number', 'password', 'search', 'tel',
					'text', 'time', 'url', 'week'].indexOf(type) > -1
			},
		},
		/**
		 * value attribute of the input field
		 */
		value: {
			type: [String, Date, Number],
			default: '',
		},
		/**
		 * disabled state of the input field
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		isIconUrl() {
			try {
				return new URL(this.icon)
			} catch (error) {
				return false
			}
		},

		isDatePickerType() {
			switch (this.type) {
			case 'date':
			case 'month':
			case 'time':
				return this.type

			case 'datetime-local':
				return 'datetime'
			}
			return false
		},
		/**
		 * determines if the action is focusable
		 * @returns {boolean} is the action focusable ?
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
		onInput(event) {
			/**
			 * Emitted on input events of the text field
			 * @type {Event|Date}
			 */
			this.$emit('input', event)
			/**
			 * Emitted when the inputs value changes
			 * ! DatetimePicker only send the value
			 * @type {string|Date}
			 */
			this.$emit('update:value', event.target ? event.target.value : event)
		},
		onSubmit(event) {
			event.preventDefault()
			event.stopPropagation()
			if (!this.disabled) {
				/**
				 * Emitted on submit of the input field
				 * @type {Event}
				 */
				this.$emit('submit', event)
			} else {
				// ignore submit
				return false
			}
		},
		onChange(event) {
			/**
			 * Emitted on change of the input field
			 * @type {Event}
			 */
			this.$emit('change', event)
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../fonts/scss/iconfont-vue';
@import '../../assets/inputs';
@import '../../assets/action';
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

	// do not change the opacity of the datepicker
	&:not(.action-input--picker) {
		opacity: $opacity_normal;
		&:hover,
		&:focus {
			opacity: $opacity_full;
		}
	}

	// only change for the icon then
	&--picker {
		.action-input__icon {
			opacity: $opacity_normal;
		}
		&:hover .action-input__icon,
		&:focus .action-input__icon {
			opacity: $opacity_full;
		}
	}

	& > span {
		cursor: pointer;
		white-space: nowrap;
	}

	&__icon {
		min-width: 0; /* Overwrite icons*/
		min-height: 0;
		/* Keep padding to define the width to
			assure correct position of a possible text */
		padding: #{$clickable-area / 2} 0 #{$clickable-area / 2} $clickable-area;

		background-position: #{$icon-margin} center;
		background-size: $icon-size;
	}

	// Forms & text inputs
	&__form {
		display: flex;
		align-items: center;
		flex: 1 1 auto;

		margin: $input-margin 0;
		padding-right: $icon-margin;
	}

	&__submit {
		position: absolute;
		left: -10000px;
		top: auto;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	&__label {
		display: flex;
		align-items: center;
		justify-content: center;

		width: #{$clickable-area - $input-margin * 2};
		height: #{$clickable-area - $input-margin * 2};
		box-sizing: border-box;
		margin: 0 0 0 -8px;
		padding: 7px 6px;

		cursor: pointer;

		opacity: $opacity_full;
		color: var(--color-text-lighter);
		border: 1px solid var(--color-border-dark);
		border-left-color: transparent;
		border-radius: 0 var(--border-radius) var(--border-radius) 0;
		/* Avoid background under border */
		background-color: var(--color-main-background);
		background-clip: padding-box;

		font-size: $icon-size;

		@include iconfont('confirm');
	}

	/* Inputs inside popover supports text, submit & reset */
	&__input {
		flex: 1 1 auto;

		min-width: $clickable-area * 3;
		min-height: #{$clickable-area - $input-margin * 2}; /* twice the element margin-y */
		max-height: #{$clickable-area - $input-margin * 2}; /* twice the element margin-y */
		margin: 0;

		// if disabled, change cursor
		&:disabled {
			cursor: default;
		}

		/* only show confirm borders if input is not focused */
		&:not(:active):not(:hover):not(:focus) {
			&:invalid {
				& + .action-input__label {
					border-color: var(--color-error);
					border-left-color: transparent;
				}
			}
			&:not(:disabled) + .action-input__label {
				&:active,
				&:hover,
				&:focus {
					border-color: var(--color-primary-element);
					border-radius: var(--border-radius);
				}
			}
		}
		&:active,
		&:hover,
		&:focus {
			&:not(:disabled) + .action-input__label {
				/* above previous input */
				z-index: 2;

				border-color: var(--color-primary-element);
				border-left-color: transparent;
			}
		}
	}

	&__picker::v-deep { // stylelint-disable-line
		.mx-input {
			margin: 0;
		}
	}
}

// if a form is the last of the list
// add the same bottomMargin as the right padding
// for visual balance
li:last-child > .action-input {
	margin-bottom: $icon-margin - $input-margin;
}

// same for first item
li:first-child > .action-input {
	margin-top: $icon-margin - $input-margin;
}

</style>
