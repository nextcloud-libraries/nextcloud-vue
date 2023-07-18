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
		<NcCheckboxRadioSwitch :checked.sync="sharingEnabled">Enable sharing</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="sharingEnabled" :disabled="true">Enable sharing (disabled)</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked="sharingEnabled" :loading="loading" @update:checked="onToggle">Enable sharing (with request loading)</NcCheckboxRadioSwitch>
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
		<NcCheckboxRadioSwitch :checked.sync="sharingPermission" value="r" name="sharing_permission_radio" type="radio">Default permission read</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="sharingPermission" value="rw" name="sharing_permission_radio" type="radio">Default permission read+write</NcCheckboxRadioSwitch>
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

### Standard radio set with alternative button style
```vue
<template>
	<div>
		<NcCheckboxRadioSwitch :checked.sync="sharingPermission" value="r" name="sharing_permission_radio" type="radio" :button-variant="true" button-variant-grouped="vertical">Default permission read</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="sharingPermission" value="rw" name="sharing_permission_radio" type="radio" :button-variant="true" button-variant-grouped="vertical">Default permission read+write</NcCheckboxRadioSwitch>
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
		<NcCheckboxRadioSwitch :disabled="true" :checked.sync="sharingPermission" value="r" name="sharing_permission">Permission read</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="sharingPermission" value="w" name="sharing_permission">Permission write</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="sharingPermission" value="d" name="sharing_permission">Permission delete</NcCheckboxRadioSwitch>
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
		<NcCheckboxRadioSwitch :checked.sync="sharingEnabled" type="switch">Enable sharing</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="sharingEnabled" type="switch" :disabled="true">Enable sharing (disabled)</NcCheckboxRadioSwitch>
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
	<component :is="wrapperElement"
		:class="{
			['checkbox-radio-switch-' + type]: type,
			'checkbox-radio-switch--checked': isChecked,
			'checkbox-radio-switch--disabled': disabled,
			'checkbox-radio-switch--indeterminate': indeterminate,
			'checkbox-radio-switch--button-variant': buttonVariant,
			'checkbox-radio-switch--button-variant-v-grouped': buttonVariant && buttonVariantGrouped === 'vertical',
			'checkbox-radio-switch--button-variant-h-grouped': buttonVariant && buttonVariantGrouped === 'horizontal',
		}"
		:style="cssVars"
		class="checkbox-radio-switch">
		<label :for="id" class="checkbox-radio-switch__label">
			<input :id="id"
				:checked="isChecked"
				:disabled="disabled"
				:indeterminate="indeterminate"
				:name="name"
				:type="inputType"
				:value="value"
				class="checkbox-radio-switch__input"
				@change="onToggle">
			<NcLoadingIcon v-if="loading" class="checkbox-radio-switch__icon" />
			<component :is="checkboxRadioIconElement"
				v-else-if="!buttonVariant"
				:size="size"
				class="checkbox-radio-switch__icon" />

			<!-- @slot The checkbox/radio label -->
			<slot />
		</label>
	</component>
</template>

<script>
import NcLoadingIcon from '../NcLoadingIcon/index.js'
import GenRandomId from '../../utils/GenRandomId.js'
import l10n from '../../mixins/l10n.js'

import CheckboxBlankOutline from 'vue-material-design-icons/CheckboxBlankOutline.vue'
import MinusBox from 'vue-material-design-icons/MinusBox.vue'
import CheckboxMarked from 'vue-material-design-icons/CheckboxMarked.vue'
import RadioboxMarked from 'vue-material-design-icons/RadioboxMarked.vue'
import RadioboxBlank from 'vue-material-design-icons/RadioboxBlank.vue'
import ToggleSwitchOff from 'vue-material-design-icons/ToggleSwitchOff.vue'
import ToggleSwitch from 'vue-material-design-icons/ToggleSwitch.vue'

export const TYPE_CHECKBOX = 'checkbox'
export const TYPE_RADIO = 'radio'
export const TYPE_SWITCH = 'switch'

export default {
	name: 'NcCheckboxRadioSwitch',

	components: {
		NcLoadingIcon,
	},

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
		 * Type of the input. checkbox, radio or switch
		 */
		type: {
			type: String,
			default: 'checkbox',
			validator: type => type === TYPE_CHECKBOX || type === TYPE_RADIO || type === TYPE_SWITCH,
		},

		/**
		 * Toggle the alternative button style
		 */
		buttonVariant: {
			type: Boolean,
			default: false,
		},

		/**
		 * Are the elements are all direct siblings?
		 * If so they will be grouped horizontally or vertically
		 * Possible values are `no`, `horizontal`, `vertical`.
		 */
		buttonVariantGrouped: {
			type: String,
			default: 'no',
			validator: v => ['no', 'vertical', 'horizontal'].includes(v),
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

	emits: ['update:checked'],

	computed: {
		/**
		 * Icon size
		 *
		 @return {number}
		 */
		size() {
			return this.type === TYPE_SWITCH
				? 36
				: 24
		},

		/**
		 * Css local variables for this component
		 *
		 * @return {object}
		 */
		cssVars() {
			return {
				'--icon-size': this.size + 'px',
			}
		},

		/**
		 * Return the input type.
		 * Switch is not an official type
		 *
		 * @return {string}
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
		 *
		 * @return {boolean}
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
		 *
		 * @return {Node[]}
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
		position: absolute;
		z-index: -1;
		opacity: 0 !important; // We need !important, or it gets overwritten by server style
		width: var(--icon-size);
		height: var(--icon-size);
	}

	&__label {
		display: flex;
		position: relative;
		align-items: center;
		user-select: none;
		min-height: $clickable-area;
		border-radius: $clickable-area;
		padding: 4px $icon-margin;
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
			color: var(--color-main-text)
		}
	}

	&:not(&--disabled) &__label:hover,
	&:not(&--disabled) &__label:focus-within {
		outline: 2px solid var(--color-main-text);
		box-shadow: 0 0 0 4px var(--color-main-background);
	}

	// Switch specific rules
	&-switch:not(&--checked) &__icon {
		color: var(--color-text-maxcontrast);
	}

	// If switch is checked AND disabled, use the fade primary colour
	&-switch.checkbox-radio-switch--disabled.checkbox-radio-switch--checked &__icon {
		color: var(--color-primary-element-light);
	}

	&--button-variant &__label {
		border-radius: 0;
		width: 100%;
		margin: 0;
	}

	&--button-variant:not(&--button-variant-v-grouped):not(&--button-variant-h-grouped) {
		border-radius: var(--border-radius-large);
	}

	&--button-variant-v-grouped {
		&:first-of-type {
			border-top-left-radius: var(--border-radius-large);
			border-top-right-radius: var(--border-radius-large);
		}
		&:last-of-type {
			border-bottom-left-radius: var(--border-radius-large);
			border-bottom-right-radius: var(--border-radius-large);
		}

		// avoid double borders between elements
		& + &:not(&.checkbox-radio-switch--checked) {
			border-top: 0;
		}
		& + &.checkbox-radio-switch--checked {
			// as the selected element has all borders:
			// small trick to cover the previous bottom border (only if there is one)
			margin-top: -2px;
		}
	}

	&--button-variant-h-grouped {
		&:first-of-type {
			border-top-left-radius: var(--border-radius-large);
			border-bottom-left-radius: var(--border-radius-large);
		}
		&:last-of-type {
			border-top-right-radius: var(--border-radius-large);
			border-bottom-right-radius: var(--border-radius-large);
		}

		// avoid double borders between elements
		& + &:not(&.checkbox-radio-switch--checked) {
			border-left: 0;
		}
		& + &.checkbox-radio-switch--checked {
			// as the selected element has all borders:
			// small trick to cover the previous bottom border (only if there is one)
			margin-left: -2px;
		}
	}

	&--button-variant.checkbox-radio-switch {
		border: 2px solid var(--color-border-dark);
		// better than setting border-radius on labels (producing a small gap)
		overflow: hidden;

		&--checked {
			font-weight: bold;
			border: 2px solid var(--color-primary-element-light);

			&:hover {
				border: 2px solid var(--color-primary-element);
			}

			label {
				background-color: var(--color-background-dark);
			}
		}
	}
}
</style>
