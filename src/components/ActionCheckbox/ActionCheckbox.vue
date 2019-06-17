<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
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

<template>
	<li>
		<span class="action-checkbox">
			<input :id="id" :disabled="disabled" :checked="checked"
				type="checkbox" class="focusable checkbox action-checkbox__checkbox"
				@keydown.enter.exact.prevent="checkInput" @change="onChange">
			<label ref="label" :for="id" class="action-checkbox__label">{{ text }}</label>

			<!-- fake slot to gather inner text -->
			<slot v-if="false" />
		</span>
	</li>
</template>

<script>
import ActionGlobalMixin from 'Mixins/actionGlobal'
import GenRandomId from 'Utils/GenRandomId'

export default {
	name: 'ActionCheckbox',

	mixins: [ActionGlobalMixin],

	props: {
		/**
		 * id attribute of the checkbox element
		 */
		id: {
			type: String,
			default: () => 'action-' + GenRandomId(),
			validator: id => id.trim() !== ''
		},
		/**
		 * checked state of the the checkbox element
		 */
		checked: {
			type: Boolean,
			default: false
		},
		/**
		 * disabled state of the checkbox element
		 */
		disabled: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		checkInput(event) {
			// by clicking we also trigger the change event
			this.$refs.label.click()
		},
		onChange(event) {
			/**
			 * Emitted when the checkbox state is changed
			 * @type {boolean}
			 */
			this.$emit('change', event)
		}
	}
}
</script>

<style lang="scss" scoped>
@import '~Assets/action';
@include action-active;

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
	line-height: $clickable-area;

	/* checkbox/radio fixes */
	&__checkbox {
		position: absolute;
		top: auto;
		left: -10000px;

		overflow: hidden;

		width: 1px;
		height: 1px;
		&:focus + .action-checkbox__label {
			opacity: $opacity_full;
		}
	}

	&__label {
		display: flex;
		// align checkbox to text
		align-items: baseline;

		width: 100%;
		padding: 0 !important;
		padding-right: $icon-margin;

		opacity: $opacity_normal;
		// checkbox-width is 12px, border is 2
		// (44 - 14 - 2) / 2 = 14
		&::before {
			margin: 0 14px 0 !important;
		}
	}

	&:hover,
	&:focus {
		.action-checkbox__label {
			opacity: $opacity_full;
		}
	}
}

</style>
