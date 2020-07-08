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
Usually, you will provide a name prop to bind the radio together.
So that only one of each name set can be selected at the same time.

```vue
	<Actions>
		<ActionRadio @change="alert('(un)checked !')" name="uniqueId">First choice</ActionRadio>
		<ActionRadio value="second" name="uniqueId" @change="alert('(un)checked !')">Second choice</ActionRadio>
		<ActionRadio :checked="true" name="uniqueId" @change="alert('(un)checked !')">Third choice (checked)</ActionRadio>
		<ActionRadio :disabled="true" name="uniqueId" @change="alert('(un)checked !')">Second choice (disabled)</ActionRadio>
	</Actions>
```
</docs>

<template>
	<li class="action" :class="{ 'action--disabled': disabled }">
		<span class="action-radio">
			<input :id="id"
				ref="radio"
				:disabled="disabled"
				:checked="checked"
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
import ActionGlobalMixin from '../../mixins/actionGlobal'
import GenRandomId from '../../utils/GenRandomId'

export default {
	name: 'ActionRadio',

	mixins: [ActionGlobalMixin],

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
		 * checked state of the the radio element
		 */
		checked: {
			type: Boolean,
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

	computed: {
		/**
		 * determines if the action is focusable
		 * @returns {boolean} is the action focusable ?
		 */
		isFocusable() {
			return !this.disabled
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
			 * @type {boolean}
			 */
			this.$emit('update:checked', this.$refs.radio.checked)

			/**
			 * Emitted when the radio state is changed
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
	line-height: $clickable-area;

	/* checkbox/radio fixes */
	&__radio {
		position: absolute;
		top: auto;
		left: -10000px;

		overflow: hidden;

		width: 1px;
		height: 1px;
		&:focus + .action-radio__label {
			opacity: $opacity_full;
		}
	}

	&__label {
		display: flex;
		align-items: center; // align radio to text

		width: 100%;
		padding: 0 !important;
		padding-right: $icon-margin !important;

		opacity: $opacity_normal;
		// radio-width is 12px, border is 2
		// (44 - 14 - 2) / 2 = 14
		&::before {
			margin: 0 14px 0 !important;
		}
	}

	&--disabled {
		&,
		.action-radio__label {
			cursor: pointer;
		}
	}

	&:not(.action-radio--disabled):hover,
	&:not(.action-radio--disabled):focus {
		.action-radio__label {
			opacity: $opacity_full;
		}
	}
}

</style>
