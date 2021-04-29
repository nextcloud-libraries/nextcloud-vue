<!--
  - @copyright Copyright (c) 2021 John Molakvoæ <skjnldsv@protonmail.com>
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<docs>

### General description

This is a simple input checkbox, radio and switch design.
Please have a look at proper usage and recommendations: https://material.io/components/checkboxes

### Standard checkbox
```vue
<template>
	<div>
		<CheckboxRadioSwitch :checked.sync="sharingEnabled">Enable sharing</CheckboxRadioSwitch>
		<CheckboxRadioSwitch :checked.sync="sharingEnabled" :disabled="true">Enable sharing (disabled)</CheckboxRadioSwitch>
		<CheckboxRadioSwitch :checked="sharingEnabled" :loading="loading" @update:checked="onToggle">Enable sharing (with request loading)</CheckboxRadioSwitch>
		<br>
		sharingEnabled: {{ sharingEnabled }}
	</div>
</template>
<script>
export default {
	data() {
		return {
			loading: false,
			sharingEnabled: false,
		}
	},
	methods: {
		onToggle() {
			this.loading = true

			setTimeout(() => {
				this.sharingEnabled = !this.sharingEnabled
				this.loading = false
			}, 1000)
		}
	}
}
</script>
```

### Standard radio set
```vue
<template>
	<div>
		<CheckboxRadioSwitch :checked.sync="sharingPermission" value="r" name="sharing_permission_radio" type="radio">Default permission read</CheckboxRadioSwitch>
		<CheckboxRadioSwitch :checked.sync="sharingPermission" value="rw" name="sharing_permission_radio" type="radio">Default permission read+write</CheckboxRadioSwitch>
		<br>
		sharingPermission: {{ sharingPermission }}
	</div>
</template>
<script>
export default {
	data() {
		return {
			sharingPermission: 'r',
		}
	}
}
</script>
```

### Standard checkbox set
```vue
<template>
	<div>
		<CheckboxRadioSwitch :disabled="true" :checked.sync="sharingPermission" value="r" name="sharing_permission">Permission read</CheckboxRadioSwitch>
		<CheckboxRadioSwitch :checked.sync="sharingPermission" value="w" name="sharing_permission">Permission write</CheckboxRadioSwitch>
		<CheckboxRadioSwitch :checked.sync="sharingPermission" value="d" name="sharing_permission">Permission delete</CheckboxRadioSwitch>
		<br>
		sharingPermission: {{ sharingPermission }}
	</div>
</template>
<script>
export default {
	data() {
		return {
			sharingPermission: ['r', 'd'],
		}
	}
}
</script>
```

### Standard switch
```vue
<template>
	<div>
		<CheckboxRadioSwitch :checked.sync="sharingEnabled" type="switch">Enable sharing</CheckboxRadioSwitch>
		<CheckboxRadioSwitch :checked.sync="sharingEnabled" type="switch" :disabled="true">Enable sharing (disabled)</CheckboxRadioSwitch>
		<br>
		sharingEnabled: {{ sharingEnabled }}
	</div>
</template>
<script>
export default {
	data() {
		return {
			sharingEnabled: true,
		}
	},
}
</script>
```

</docs>

<template>
	<element :is="wrapperElement"
		:class="{
			['checkbox-radio-switch-' + type]: type,
			'checkbox-radio-switch--checked': isChecked,
			'checkbox-radio-switch--disabled': disabled,
			'checkbox-radio-switch--indeterminate': indeterminate,
		}"
		:style="cssVars"
		class="checkbox-radio-switch">
		<input :id="id"
			:checked="isChecked"
			:disabled="disabled"
			:indeterminate="indeterminate"
			:name="name"
			:type="inputType"
			:value="value"
			class="checkbox-radio-switch__input"
			@change="onToggle">

		<label :for="id" class="checkbox-radio-switch__label">
			<div v-if="loading" class="icon-loading-small checkbox-radio-switch__icon" />
			<icon :is="checkboxRadioIconElement"
				v-else
				:size="size"
				class="checkbox-radio-switch__icon"
				title=""
				decorative />

			<!-- @slot The checkbox/radio label -->
			<slot />
		</label>
	</element>
</template>

<script>
import CheckboxBlankOutline from 'vue-material-design-icons/CheckboxBlankOutline'
import MinusBox from 'vue-material-design-icons/MinusBox'
import CheckboxMarked from 'vue-material-design-icons/CheckboxMarked'
import RadioboxMarked from 'vue-material-design-icons/RadioboxMarked'
import RadioboxBlank from 'vue-material-design-icons/RadioboxBlank'
import ToggleSwitchOff from 'vue-material-design-icons/ToggleSwitchOff'
import ToggleSwitch from 'vue-material-design-icons/ToggleSwitch'

import GenRandomId from '../../utils/GenRandomId'
import l10n from '../../mixins/l10n'

export const TYPE_CHECKBOX = 'checkbox'
export const TYPE_RADIO = 'radio'
export const TYPE_SWITCH = 'switch'

export default {
	name: 'CheckboxRadioSwitch',

	mixins: [l10n],

	props: {

		/**
		 * Unique id attribute of the input
		 */
		id: {
			type: String,
			default: () => 'checkbox-radio-switch-' + GenRandomId(),
			validator: id => id.trim() !== '',
		},

		/**
		 * Input name. Required for radio, optional for checkbox
		 */
		name: {
			type: String,
			default: null,
		},

		/**
		 * Type of the input. Checkbox or radio
		 */
		type: {
			type: String,
			default: 'checkbox',
			validator: type => type === TYPE_CHECKBOX || type === TYPE_RADIO || type === TYPE_SWITCH,
		},

		/**
		 * Checked state. To be used with `:value.sync`
		 */
		checked: {
			type: [Boolean, Array, String],
			default: false,
		},

		/**
		 * Value to be synced on check
		 */
		value: {
			type: String,
			default: null,
		},

		/**
		 * Disabled state
		 */
		disabled: {
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
		 * Wrapping element tag
		 */
		wrapperElement: {
			type: String,
			default: 'span',
		},
	},

	computed: {
		/**
		 * Icon size
		 @returns {number}
		 */
		size() {
			return this.type === TYPE_SWITCH
				? 36
				: 24
		},

		/**
		 * Css local variables for this component
		 * @returns {Object}
		 */
		cssVars() {
			return {
				'--icon-size': this.size + 'px',
			}
		},

		/**
		 * Return the input type.
		 * Switch is not an official type
		 * @returns {string}
		 */
		inputType() {
			if (this.type === TYPE_RADIO) {
				return TYPE_RADIO
			}
			return TYPE_CHECKBOX
		},

		/**
		 * Check if that entry is checked
		 * If value is defined, we use that as the checked value
		 * If not, we expect true/false in this.checked
		 * @returns {boolean}
		 */
		isChecked() {
			if (this.value !== null) {
				if (Array.isArray(this.checked)) {
					return [...this.checked].indexOf(this.value) > -1
				}
				return this.checked === this.value
			}
			return this.checked === true
		},

		/**
		 * Returns the proper Material icon depending on the select case
		 * @returns {Component}
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

	mounted() {
		if (this.name && this.type === TYPE_CHECKBOX) {
			if (!Array.isArray(this.checked)) {
				throw new Error('When using groups of checkboxes, the updated value will be an array.')
			}
		}

		// https://material.io/components/checkboxes#usage
		if (this.name && this.type === TYPE_SWITCH) {
			throw new Error('Switches are not made to be used for data sets. Please use checkboxes instead.')
		}

		// https://material.io/components/checkboxes#usage
		if (typeof this.checked !== 'boolean' && this.type === TYPE_SWITCH) {
			throw new Error('Switches can only be used with boolean as checked prop.')
		}
	},

	methods: {
		onToggle() {
			if (this.disabled) {
				return
			}

			// If this is a radio, there can only be one value
			if (this.type === TYPE_RADIO) {
				this.$emit('update:checked', this.value)
				return
			}

			// If this is a radio, there can only be one value
			if (this.type === TYPE_SWITCH) {
				this.$emit('update:checked', !this.isChecked)
				return
			}

			// If the initial value was a boolean, let's keep it that way
			if (typeof this.checked === 'boolean') {
				this.$emit('update:checked', !this.isChecked)
				return
			}

			// Dispatch the checked values as an array if multiple, or single value otherwise
			const values = this.getInputsSet()
				.filter(input => input.checked)
				.map(input => input.value)
			this.$emit('update:checked', values)
		},

		/**
		 * Get the input set based on this name
		 * @returns {Node[]}
		 */
		getInputsSet() {
			return [...document.getElementsByName(this.name)]
		},
	},
}
</script>

<style lang="scss" scoped>
$spacing: 4px;

.checkbox-radio-switch {
	display: flex;

	&__input {
		position: fixed;
		z-index: -1;
		top: -5000px;
		left: -5000px;
		opacity: 0;
	}

	&__label {
		display: flex;
		align-items: center;
		user-select: none;
		height: $clickable-area;
		border-radius: $clickable-area;
		padding: 0 $icon-margin;
		margin: 0 #{-$icon-margin};

		&, * {
			cursor: pointer;
		}
	}

	&__icon {
		margin-right: $spacing;
		// Remove the left margin of material design icons to align text
		margin-left: -2px;
		color: var(--color-primary-element);
		width: var(--icon-size);
		height: var(--icon-size);
	}

	&--disabled &__label {
		opacity: $opacity_disabled;
		.checkbox-radio-switch__icon {
			color: var(--color-text-light)
		}
	}

	&:not(&--disabled) &__input:hover + &__label,
	&:not(&--disabled) &__input:focus + &__label {
		background-color: var(--color-primary-light);
	}

	// Switch specific rules
	&-switch:not(&--checked) &__icon {
		color: var(--color-text-lighter);
	}

	// If  switch is checked AND disabled, use the fade primary colour
	&-switch.checkbox-radio-switch--disabled.checkbox-radio-switch--checked &__icon {
		color: var(--color-primary-element-light);
	}
}

</style>
