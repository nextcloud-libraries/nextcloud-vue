<!--
  - @copyright 2023 Christopher Ng <chrng8@gmail.com>
  -
  - @author Christopher Ng <chrng8@gmail.com>
  -
  - @license AGPL-3.0-or-later
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
-->

<template>
	<component :is="wrapperElement"
		:for="!isButtonType ? id : null"
		class="checkbox-content">
		<span :class="['checkbox-content__icon', iconClass]"
			:aria-hidden="true">
			<!-- @slot The checkbox/radio icon, you can use it for adding an icon to the button variant
					@binding {bool} checked The input checked state
					@binding {bool} loading The loading state
			-->
			<slot name="icon"
				:checked="isChecked"
				:loading="loading">
				<NcLoadingIcon v-if="loading" />
				<component :is="checkboxRadioIconElement"
					v-else-if="!buttonVariant"
					:size="size" />
			</slot>
		</span>

		<span :class="['checkbox-content__text', textClass]">
			<!-- @slot The checkbox/radio label -->
			<slot />
		</span>
	</component>
</template>

<script>
import CheckboxBlankOutline from 'vue-material-design-icons/CheckboxBlankOutline.vue'
import MinusBox from 'vue-material-design-icons/MinusBox.vue'
import CheckboxMarked from 'vue-material-design-icons/CheckboxMarked.vue'
import RadioboxMarked from 'vue-material-design-icons/RadioboxMarked.vue'
import RadioboxBlank from 'vue-material-design-icons/RadioboxBlank.vue'
import ToggleSwitchOff from 'vue-material-design-icons/ToggleSwitchOff.vue'
import ToggleSwitch from 'vue-material-design-icons/ToggleSwitch.vue'

import NcLoadingIcon from '../NcLoadingIcon/index.js'

import { TYPE_BUTTON, TYPE_CHECKBOX, TYPE_RADIO, TYPE_SWITCH } from './NcCheckboxRadioSwitch.vue'

export default {
	name: 'NcCheckboxContent',

	components: {
		NcLoadingIcon,
	},

	props: {
		/**
		 * Unique id attribute of the input to label
		 */
		id: {
			type: String,
			default: null,
		},

		/**
		 * Class for the icon element
		 */
		iconClass: {
			type: [String, Object],
			default: null,
		},

		/**
		 * Class for the text element
		 */
		textClass: {
			type: [String, Object],
			default: null,
		},

		/**
		 * Type of the input. checkbox, radio, switch, or button.
		 *
		 * Only use button when used in a `tablist` container and the
		 * `tab` role is set.
		 */
		type: {
			type: String,
			default: 'checkbox',
			validator: type => [
				TYPE_CHECKBOX,
				TYPE_RADIO,
				TYPE_SWITCH,
				TYPE_BUTTON,
			].includes(type),
		},

		/**
		 * Toggle the alternative button style
		 */
		buttonVariant: {
			type: Boolean,
			default: false,
		},

		/**
		 * True if the entry is checked
		 */
		isChecked: {
			type: Boolean,
			default: false,
		},

		/**
		 * Loading state
		 */
		loading: {
			type: Boolean,
			default: false,
		},

		/**
		 * Icon size
		 */
		size: {
			type: Number,
			default: 24,
		},
	},

	computed: {
		isButtonType() {
			return this.type === TYPE_BUTTON
		},

		wrapperElement() {
			if (this.isButtonType) {
				return 'span'
			}
			return 'label'
		},

		/**
		 * Returns the proper Material icon depending on the select case
		 *
		 * @return {object}
		 */
		checkboxRadioIconElement() {
			if (this.type === TYPE_RADIO) {
				if (this.isChecked) {
					return RadioboxMarked
				}
				return RadioboxBlank
			}

			// Switch
			if (this.type === TYPE_SWITCH) {
				if (this.isChecked) {
					return ToggleSwitch
				}
				return ToggleSwitchOff
			}

			// Checkbox
			if (this.indeterminate) {
				return MinusBox
			}
			if (this.isChecked) {
				return CheckboxMarked
			}
			return CheckboxBlankOutline
		},
	},
}
</script>

<style lang="scss" scoped>
.checkbox-content {
	display: flex;
	align-items: center;
	flex-direction: row;
	gap: 4px;
	user-select: none;
	min-height: $clickable-area;
	border-radius: $clickable-area;
	padding: 4px $icon-margin;
	// Set to 100% to make text overflow work on button style
	width: 100%;
	// but restrict to content so plain checkboxes / radio switches do not expand
	max-width: fit-content;

	&__text {
		&:empty {
			// hide text if empty to ensure checkbox outline is a circle instead of oval
			display: none;
		}
	}

	&__icon > * {
		color: var(--color-primary-element);
		width: var(--icon-size);
		height: var(--icon-size);
	}

	&, * {
		cursor: pointer;
	}
}
</style>