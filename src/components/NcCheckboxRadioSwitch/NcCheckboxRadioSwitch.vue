<!--
  - @copyright Copyright (c) 2021 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  - @author Ferdinand Thiessen <opensource@fthiessen.de>
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

### Standard radio set with alternative button style
```vue
<template>
	<div>
		<h4>Horizontal</h4>
		<div style="display: flex">
			<NcCheckboxRadioSwitch
				:button-variant="true"
				:checked.sync="sharingPermission"
				value="r"
				name="sharing_permission_radio"
				type="radio"
				button-variant-grouped="horizontal">
				Default permission read
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:button-variant="true"
				:checked.sync="sharingPermission"
				value="rw"
				name="sharing_permission_radio"
				type="radio"
				button-variant-grouped="horizontal">
				Default permission read+write
			</NcCheckboxRadioSwitch>
		</div>
		<h4>Vertically</h4>
		<div style="width: fit-content">
			<NcCheckboxRadioSwitch
				:button-variant="true"
				:checked.sync="sharingPermission"
				value="r"
				name="sharing_permission_radio"
				type="radio"
				button-variant-grouped="vertical">
				Default permission read
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:button-variant="true"
				:checked.sync="sharingPermission"
				value="rw"
				name="sharing_permission_radio"
				type="radio"
				button-variant-grouped="vertical">
				Default permission read+write
			</NcCheckboxRadioSwitch>
		</div>
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

### Radio set with button style and icons
```vue
<template>
	<div>
		<h4>Horizontal</h4>
		<div style="display: flex">
			<NcCheckboxRadioSwitch
				:button-variant="true"
				:checked.sync="enableSettings"
				value="y"
				name="sharing_permission_radio"
				type="radio"
				button-variant-grouped="horizontal">
				Enable settings
				<template #icon><CheckIcon :size="20"></template>
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:button-variant="true"
				:checked.sync="enableSettings"
				value="n"
				name="sharing_permission_radio"
				type="radio"
				button-variant-grouped="horizontal">
				Disable settings
				<template #icon><CancelIcon :size="20"></template>
			</NcCheckboxRadioSwitch>
		</div>
		<h4>Vertically</h4>
		<div style="width: fit-content">
			<NcCheckboxRadioSwitch
				:button-variant="true"
				:checked.sync="enableSettings"
				value="y"
				name="sharing_permission_radio"
				type="radio"
				button-variant-grouped="vertical">
				Enable settings
				<template #icon><CheckIcon :size="20"></template>
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:button-variant="true"
				:checked.sync="enableSettings"
				value="n"
				name="sharing_permission_radio"
				type="radio"
				button-variant-grouped="vertical">
				Disable settings
				<template #icon><CancelIcon :size="20"></template>
			</NcCheckboxRadioSwitch>
		</div>
		Settings enabled: {{ enableSettings === 'y' ? 'yes' : 'no' }}
	</div>
</template>
<script>
import CheckIcon from 'vue-material-design-icons/Check.vue'
import CancelIcon from 'vue-material-design-icons/Cancel.vue'
export default {
	components: {
		CheckIcon,
		CancelIcon,
	},
	data() {
		return {
			enableSettings: 'n',
		}
	}
}
</script>
```

### Checkbox buttons
Sometimes you need to toggle a state, using a button is not good as it does not show the current state for accessibility.
Therefor you can use a checkbox with the button styling:

```vue
<template>
	<div>
		<h4>Checkbox buttons</h4>
		<div style="display: flex; gap: 12px;">
			<NcCheckboxRadioSwitch
				:button-variant="buttonVariant"
				:disabled="disabled"
				:checked.sync="isStarred"
				type="checkbox">
				Favorite
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:button-variant="buttonVariant"
				:disabled="disabled"
				:checked.sync="isStarred"
				type="checkbox">
				<template #icon>
					<IconStar v-if="isStarred" :size="20" />
					<IconStarOutline v-else :size="20" />
				</template>
				Favorite
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:button-variant="buttonVariant"
				:disabled="disabled"
				:checked.sync="isStarred"
				icon-only
				type="checkbox">
				<template #icon>
					<IconStar v-if="isStarred" :size="20" />
					<IconStarOutline v-else :size="20" />
				</template>
				Favorite
			</NcCheckboxRadioSwitch>
		</div>
		<hr />
		<NcCheckboxRadioSwitch :checked.sync="disabled" type="checkbox">Disabled</NcCheckboxRadioSwitch>
		<div style="display: flex; gap: 6px;">
			<NcCheckboxRadioSwitch :checked.sync="buttonVariant" value="primary" name="button_variant" type="radio">Primary</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch :checked.sync="buttonVariant" value="secondary" name="button_variant" type="radio">Secondary</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch :checked.sync="buttonVariant" value="tertiary" name="button_variant" type="radio">Tertiary</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch :checked.sync="buttonVariant" value="tertiary-no-background" name="button_variant" type="radio">Tertiary without background</NcCheckboxRadioSwitch>
		</div>
	</div>
</template>
<script>
import IconStar from 'vue-material-design-icons/Star.vue'
import IconStarOutline from 'vue-material-design-icons/StarOutline.vue'

export default {
	components: {
		IconStar,
		IconStarOutline
	},
	data() {
		return {
			isStarred: false,
			buttonVariant: 'tertiary',
			disabled: false,
		}
	}
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
			[`checkbox-radio-switch--button-variant-${buttonVariant === true ? 'secondary' : buttonVariant}`]: buttonVariant,
			'checkbox-radio-switch--button-variant-grouped': buttonVariant && buttonVariantGrouped !== 'no',
			'checkbox-radio-switch--button-variant-grouped-v': buttonVariant && buttonVariantGrouped === 'vertical',
			'checkbox-radio-switch--button-variant-grouped-h': buttonVariant && buttonVariantGrouped === 'horizontal',
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
		<label :for="id" class="checkbox-radio-switch__label" :title="labelTitle">
			<div class="checkbox-radio-switch__icon">
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
			</div>

			<!-- @slot The checkbox/radio label -->
			<span class="checkbox-radio-switch__label-text" :class="{ 'hidden-visually': buttonVariant && iconOnly }"><slot /></span>
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
		 * Use the label only for acessibility and only show the icon
		 * Only used with `buttonVariant`
		 */
		iconOnly: {
			type: Boolean,
			default: false,
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
		 *
		 * Can be either `false` or any of the available `NcButton` types.
		 */
		buttonVariant: {
			type: [Boolean, String],
			default: false,
			validator: variant => typeof variant === 'boolean' || ['primary', 'secondary', 'tertiary', 'tertiary-no-background'].includes(variant),
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

		/**
		 * The label text is invisible but should be provided for the title
		 */
		labelTitle() {
			if (this.iconOnly) {
				const slot = this.$slots?.default?.[0]
				if (slot) return (slot.text || '').trim()
			}
			return null
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
.checkbox-radio-switch {
	display: flex;

	&__input {
		position: absolute;
		z-index: -1;
		opacity: 0 !important; // We need !important, or it gets overwritten by server style
		width: var(--icon-size);
		height: var(--icon-size);
	}

	&__input:focus-visible + label {
		outline: 2px solid var(--color-primary-element) !important;
	}

	&__label {
		display: flex;
		align-items: center;
		flex-direction: row;
		gap: 4px;
		user-select: none;
		min-height: $clickable-area;
		border-radius: $clickable-area;
		padding-block: 4px;
		padding-inline: $icon-margin;
		// Set to 100% to make text overflow work on button style
		width: 100%;
		// but restrict to content so plain checkboxes / radio switches do not expand
		max-width: fit-content;

		&, * {
			cursor: pointer;
		}
	}

	&__icon > * {
		color: var(--color-primary-element);
		width: var(--icon-size);
		height: var(--icon-size);
	}

	&--disabled &__label {
		opacity: $opacity_disabled;
		// Gives a wash out effect
		filter: saturate($opacity_normal);

		cursor: default;
		&, * {
			cursor: default;
		}
	}

	&:not(&--disabled, &--checked):focus-within &__label,
	&:not(&--disabled, &--checked) &__label:hover {
		background-color: var(--color-background-hover);
	}

	&--checked:not(&--disabled):focus-within &__label,
	&--checked:not(&--disabled) &__label:hover {
		background-color: var(--color-primary-element-light-hover);
	}

	// Switch specific rules
	&-switch:not(&--checked) &__icon > * {
		color: var(--color-text-maxcontrast);
	}

	// If switch is checked AND disabled, use the fade primary colour
	&-switch.checkbox-radio-switch--disabled.checkbox-radio-switch--checked &__icon > * {
		color: var(--color-primary-element-light);
	}

	$border-radius: calc(var(--default-clickable-area) / 2);
	// keep inner border width in mind
	$border-radius-outer: calc($border-radius + 2px);

	/*
	 * The button variant
	 */
	&--button-variant {
		overflow: hidden;

		@mixin variant-style($name, $background, $color, $hover) {
			&-#{$name}:not(&-grouped).checkbox-radio-switch {
				&:focus-within label {
					background-color: $background!important;
				}
				label {
					background-color: $background;
					color: $color;
					* * {
						color: $color;
					}
				}
				&:not(&--disabled) label:hover,
				&:not(&--disabled):focus-within label:hover {
					background-color: $hover!important;
				}
			}
		}

		@include variant-style(primary, var(--color-primary-element), var(--color-primary-element-text), var(--color-primary-element-hover));
		@include variant-style(secondary, var(--color-primary-element-light), var(--color-primary-element-light-text), var(--color-primary-element-light-hover));
		@include variant-style(tertiary, var(--color-main-background), var(--color-main-text), var(--color-background-hover));
		@include variant-style(tertiary-no-background, transparent, var(--color-main-text), unset);

		&:not(&-grouped) {
			border-radius: $border-radius;
			.checkbox-radio-switch {
				&__label {
					// Reduce padding to allow icon only buttons
					padding-inline: 10px;
				}
				&__input:focus-visible + label {
					outline-offset: -2px;
					outline-color: var(--color-main-text)!important;
				}
			}
		}

		.checkbox-radio-switch {
			&__label {
				border-radius: $border-radius;
			}

			// Text overflow of button style
			&__label-text {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 100%;
			}

			// Hide icon container if empty to remove virtual padding
			&__icon:empty {
				display: none;
			}
		}

		&-grouped.checkbox-radio-switch {
			border: 2px solid var(--color-border-dark);

			&--checked {
				font-weight: bold;

				label {
					background-color: var(--color-primary-element-light);
				}
			}
		}
	}

	// Set icon color for non active elements to main text color
	&--button-variant-grouped:not(&--checked) &__icon > * {
		color: var(--color-main-text);
	}

	/* Special rules for vertical button groups */
	&--button-variant-grouped-v &__label {
		flex-basis: 100%;
		// vertically grouped buttons should all have the same width
		max-width: unset;
	}
	&--button-variant-grouped-v {
		&:first-of-type {
			border-top-left-radius: $border-radius-outer;
			border-top-right-radius: $border-radius-outer;
		}
		&:last-of-type {
			border-bottom-left-radius: $border-radius-outer;
			border-bottom-right-radius: $border-radius-outer;
		}

		// remove borders between elements
		&:not(:last-of-type) {
			border-bottom: 0!important;
			.checkbox-radio-switch__label {
				margin-bottom: 2px;
			}
		}
		&:not(:first-of-type) {
			border-top: 0!important;
		}
	}

	/* Special rules for horizontal button groups */
	&--button-variant-grouped-h {
		&:first-of-type {
			border-top-left-radius: $border-radius-outer;
			border-bottom-left-radius: $border-radius-outer;
		}
		&:last-of-type {
			border-top-right-radius: $border-radius-outer;
			border-bottom-right-radius: $border-radius-outer;
		}

		// remove borders between elements
		&:not(:last-of-type) {
			border-right: 0!important;
			.checkbox-radio-switch__label {
				margin-right: 2px;
			}
		}
		&:not(:first-of-type) {
			border-left: 0!important;
		}
	}
	&--button-variant-grouped-h &__label-text {
		text-align: center;
	}
	&--button-variant-grouped-h &__label {
		flex-direction: column;
		justify-content: center;
		width: 100%;
		margin: 0;
		gap: 0;
	}
}
</style>
