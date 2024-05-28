<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<span :id="!isButtonType ? `${id}-label` : undefined"
		class="checkbox-content"
		:class="{
			['checkbox-content-' + type]: true,
			'checkbox-content--button-variant': buttonVariant,
			'checkbox-content--has-text': !!$slots.default,
		}">
		<!--
			label can't be used here because of shift+click firefox bug
			https://bugzilla.mozilla.org/show_bug.cgi?id=559506
		-->
		<span :class="{
				'checkbox-content__icon': true,
				'checkbox-content__icon--checked': isChecked,
				[iconClass]: true
			}"
			:aria-hidden="true"
			inert>
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

		<span v-if="$slots.default" :class="['checkbox-content__text', textClass]">
			<!-- @slot The checkbox/radio label -->
			<slot />
		</span>
	</span>
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

export const TYPE_CHECKBOX = 'checkbox'
export const TYPE_RADIO = 'radio'
export const TYPE_SWITCH = 'switch'
export const TYPE_BUTTON = 'button'

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
		 *
		 * @type {'checkbox'|'radio'|'switch'|'button'}
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
		 * Indeterminate state
		 */
		indeterminate: {
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
	padding: 4px calc(($clickable-area - var(--icon-height)) / 2);
	// Set to 100% to make text overflow work on button style
	width: 100%;
	// but restrict to content so plain checkboxes / radio switches do not expand
	max-width: fit-content;

	&__text {
		flex: 1 0;

		&:empty {
			// hide text if empty to ensure checkbox outline is a circle instead of oval
			display: none;
		}
	}

	&__icon > * {
		width: var(--icon-size);
		height: var(--icon-size);
	}

	&--button-variant {
		.checkbox-content__icon:not(.checkbox-content__icon--checked) > * {
			color: var(--color-primary-element);
		}

		.checkbox-content__icon--checked > * {
			color: var(--color-primary-element-text);
		}
	}

	&--has-text {
		padding-right: $icon-margin;
	}

	&:not(&--button-variant) {
		.checkbox-content__icon > * {
			color: var(--color-primary-element);
		}
	}

	&, * {
		cursor: pointer;
		flex-shrink: 0;
	}
}
</style>
