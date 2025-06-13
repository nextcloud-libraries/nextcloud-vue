<!--
  - SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description

This is a simple input checkbox, radio and switch design.
Please have a look at proper usage and recommendations: https://material.io/components/checkboxes

Note: All generic attributes on the component, except `class` and `style`, are passed to the inner `input` element *(for the button type the attributes are passed to the `button` element)*.

### Standard checkbox
```vue
<template>
	<div>
		<NcCheckboxRadioSwitch v-model="sharingEnabled">Enable sharing</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="sharingEnabled" :disabled="true">Enable sharing (disabled)</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :model-value="sharingEnabled" :loading="loading" @update:model-value="onToggle">Enable sharing (with request loading)</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="sharingEnabled">
			Enable sharing. This can contain a long multiline text, that will be wrapped in a second row. It is generally not advised to have such long text inside of an element
		</NcCheckboxRadioSwitch>
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
		<NcCheckboxRadioSwitch v-model="sharingPermission" value="r" name="sharing_permission_radio" type="radio">Default permission read</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="sharingPermission" value="rw" name="sharing_permission_radio" type="radio">Default permission read+write</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="sharingPermission" value="rws" name="sharing_permission_radio" type="radio">
			Default permission read+write+share. This can contain a long multiline text, that will be wrapped in a second row. It is generally not advised to have such long text inside of an element
		</NcCheckboxRadioSwitch>
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
		<h4>Horizontal</h4>
		<div style="display: flex">
			<NcCheckboxRadioSwitch
				:button-variant="true"
				v-model="sharingPermission"
				value="r"
				name="sharing_permission_radio"
				type="radio"
				button-variant-grouped="horizontal">
				Default permission read
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:button-variant="true"
				v-model="sharingPermission"
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
				v-model="sharingPermission"
				value="r"
				name="sharing_permission_radio"
				type="radio"
				button-variant-grouped="vertical">
				Default permission read
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:button-variant="true"
				v-model="sharingPermission"
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
				v-model="enableSettings"
				value="y"
				name="sharing_permission_radio"
				type="radio"
				button-variant-grouped="horizontal">
				Enable settings
				<template #icon><CheckIcon :size="20"></template>
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:button-variant="true"
				v-model="enableSettings"
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
				v-model="enableSettings"
				value="y"
				name="sharing_permission_radio"
				type="radio"
				button-variant-grouped="vertical">
				Enable settings
				<template #icon><CheckIcon :size="20"></template>
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:button-variant="true"
				v-model="enableSettings"
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

### Standard checkbox set
```vue
<template>
	<div>
		<NcCheckboxRadioSwitch :disabled="true" v-model="sharingPermission" value="r" name="sharing_permission">Permission read</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="sharingPermission" value="w" name="sharing_permission">Permission write</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="sharingPermission" value="d" name="sharing_permission">Permission delete</NcCheckboxRadioSwitch>
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
		<NcCheckboxRadioSwitch v-model="sharingEnabled" type="switch">Enable sharing</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="sharingEnabled" type="switch" :disabled="true">Enable sharing (disabled)</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="sharingEnabled" type="switch">
			Enable sharing. This can contain a long multiline text, that will be wrapped in a second row. It is generally not advised to have such long text inside of an element
		</NcCheckboxRadioSwitch>
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
	<component :is="computedWrapperElement"
		:id="wrapperId ?? (isButtonType ? id : null)"
		:aria-label="isButtonType && ariaLabel ? ariaLabel : undefined"
		class="checkbox-radio-switch"
		:class="[
			$props.class,
			{
				['checkbox-radio-switch-' + type]: type,
				'checkbox-radio-switch--checked': isChecked,
				'checkbox-radio-switch--disabled': disabled,
				'checkbox-radio-switch--indeterminate': hasIndeterminate ? indeterminate : false,
				'checkbox-radio-switch--button-variant': buttonVariant,
				'checkbox-radio-switch--button-variant-v-grouped': buttonVariant && buttonVariantGrouped === 'vertical',
				'checkbox-radio-switch--button-variant-h-grouped': buttonVariant && buttonVariantGrouped === 'horizontal',
				'button-vue': isButtonType,
			},
		]"
		:style
		:type="isButtonType ? 'button' : null"
		v-bind="isButtonType ? $attrs : {} "
		v-on="isButtonType ? listeners : {}">
		<input v-if="!isButtonType"
			:id="id"
			:aria-labelledby="!isButtonType && !ariaLabel ? `${id}-label` : null"
			:aria-label="ariaLabel || undefined"
			class="checkbox-radio-switch__input"
			:disabled="disabled"
			:type="inputType"
			:value="value"
			:checked="isChecked"
			:indeterminate.prop="hasIndeterminate ? indeterminate : null"
			:required="required"
			:name="name"
			v-bind="$attrs"
			v-on="listeners">
		<NcCheckboxContent :id="!isButtonType ? `${id}-label` : undefined"
			class="checkbox-radio-switch__content"
			icon-class="checkbox-radio-switch__icon"
			text-class="checkbox-radio-switch__text"
			:type="type"
			:indeterminate="hasIndeterminate ? indeterminate : false"
			:button-variant="buttonVariant"
			:is-checked="isChecked"
			:loading="loading"
			:icon-size
			@click="onToggle">
			<template #icon>
				<!-- @slot The checkbox/radio icon, you can use it for adding an icon to the button variant -->
				<slot name="icon" />
			</template>

			<template v-if="!!$slots.default" #default>
				<!-- @slot The checkbox/radio label -->
				<slot />
			</template>
		</NcCheckboxContent>
	</component>
</template>

<script>
import NcCheckboxContent, { TYPE_BUTTON, TYPE_CHECKBOX, TYPE_RADIO, TYPE_SWITCH } from './NcCheckboxContent.vue'
import { createElementId } from '../../utils/createElementId.ts'
import { t, n } from '../../l10n.js'

export default {
	name: 'NcCheckboxRadioSwitch',

	components: {
		NcCheckboxContent,
	},

	// We need to pass attributes to the input element
	inheritAttrs: false,

	props: {
		/**
		 * Unique id attribute of the input
		 */
		id: {
			type: String,
			default: () => 'checkbox-radio-switch-' + createElementId(),
			validator: id => id.trim() !== '',
		},

		/**
		 * Unique id attribute of the wrapper element
		 */
		wrapperId: {
			type: String,
			default: null,
		},

		/**
		 * Input name. Required for radio, optional for checkbox, and ignored
		 * for button.
		 */
		name: {
			type: String,
			default: null,
		},

		/**
		 * Required if no text is set.
		 * The aria-label is forwarded to the input or button.
		 */
		ariaLabel: {
			type: String,
			default: '',
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
		 * Are the elements are all direct siblings?
		 * If so they will be grouped horizontally or vertically
		 *
		 * @type {'no'|'horizontal'|'vertical'}
		 */
		buttonVariantGrouped: {
			type: String,
			default: 'no',
			validator: v => ['no', 'vertical', 'horizontal'].includes(v),
		},

		/**
		 * Checked state. To be used with `v-model:value`
		 */
		modelValue: {
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
		 * Required state
		 */
		required: {
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
		 *
		 * When `type` is set to `button` this will be ignored
		 *
		 * Defaults to `span`
		 */
		wrapperElement: {
			type: String,
			default: null,
		},

		/**
		 * The class(es) to pass to the wrapper / root element of the component
		 */
		class: {
			type: [String, Array, Object],
			default: '',
		},

		/**
		 * The style to pass to the wrapper / root element of the component
		 */
		style: {
			type: [String, Array, Object],
			default: '',
		},
	},

	emits: ['update:modelValue'],

	computed: {
		isButtonType() {
			return this.type === TYPE_BUTTON
		},

		computedWrapperElement() {
			if (this.isButtonType) {
				return 'button'
			}
			if (this.wrapperElement !== null) {
				return this.wrapperElement
			}
			return 'span'
		},

		listeners() {
			if (this.isButtonType) {
				return {
					click: this.onToggle,
				}
			}
			return {
				change: this.onToggle,
			}
		},

		iconSize() {
			return this.type === TYPE_SWITCH
				? 36
				: 20
		},

		cssIconSize() {
			return this.iconSize + 'px'
		},

		cssIconHeight() {
			return this.type === TYPE_SWITCH
				? '16px'
				: this.cssIconSize
		},

		/**
		 * Return the input type.
		 * Switch is not an official type
		 *
		 * @return {string}
		 */
		inputType() {
			const nativeTypes = [
				TYPE_CHECKBOX,
				TYPE_RADIO,
				TYPE_BUTTON,
			]
			if (nativeTypes.includes(this.type)) {
				return this.type
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
				if (Array.isArray(this.modelValue)) {
					return [...this.modelValue].indexOf(this.value) > -1
				}
				return this.modelValue === this.value
			}
			return this.modelValue === true
		},

		hasIndeterminate() {
			return [
				TYPE_CHECKBOX,
				TYPE_RADIO,
			].includes(this.inputType)
		},
	},

	mounted() {
		if (this.name && this.type === TYPE_CHECKBOX) {
			if (!Array.isArray(this.modelValue)) {
				throw new Error('When using groups of checkboxes, the updated value will be an array.')
			}
		}

		// https://material.io/components/checkboxes#usage
		if (this.name && this.type === TYPE_SWITCH) {
			throw new Error('Switches are not made to be used for data sets. Please use checkboxes instead.')
		}

		// https://material.io/components/checkboxes#usage
		if (typeof this.modelValue !== 'boolean' && this.type === TYPE_SWITCH) {
			throw new Error('Switches can only be used with boolean as modelValue prop.')
		}
	},

	methods: {
		t,
		n,

		onToggle(event) {
			if (this.disabled || event.target.tagName.toLowerCase() === 'a') {
				return
			}

			// If this is a radio, there can only be one value
			if (this.type === TYPE_RADIO) {
				this.$emit('update:modelValue', this.value)
				return
			}

			// If this is a radio, there can only be one value
			if (this.type === TYPE_SWITCH) {
				this.$emit('update:modelValue', !this.isChecked)
				return
			}

			// If the initial value was a boolean, let's keep it that way
			if (typeof this.modelValue === 'boolean') {
				this.$emit('update:modelValue', !this.modelValue)
				return
			}

			// Dispatch the checked values as an array if multiple, or single value otherwise
			const values = this.getInputsSet()
				.filter(input => input.checked)
				.map(input => input.value)

			if (values.includes(this.value)) {
				this.$emit('update:modelValue', values.filter((v) => v !== this.value))
			} else {
				this.$emit('update:modelValue', [...values, this.value])
			}
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
	--icon-size: v-bind('cssIconSize');
	--icon-height: v-bind('cssIconHeight');
	--checkbox-radio-switch--border-radius: var(--border-radius-element, calc(var(--default-clickable-area) / 2));
	// keep inner border width in mind
	--checkbox-radio-switch--border-radius-outer: calc(var(--checkbox-radio-switch--border-radius) + 2px);
	// general setup
	display: flex;
	align-items: center;
	color: var(--color-main-text);
	background-color: transparent;
	font-size: var(--default-font-size);
	line-height: var(--default-line-height);
	padding: 0;
	position: relative;

	&__input {
		position: absolute;
		z-index: -1;
		opacity: 0 !important; // We need !important, or it gets overwritten by server style
		width: var(--icon-size);
		height: var(--icon-size);
	}

	&__input:focus-visible + &__content,
	&__input:focus-visible {
		outline: 2px solid var(--color-main-text);
		border-color: var(--color-main-background);
		outline-offset: -2px;
	}

	&--disabled &__content {
		opacity: .5;

		:deep(.checkbox-radio-switch__icon) > * {
			color: var(--color-main-text)
		}
		&.checkbox-content,
		&.checkbox-content :deep(*:not(a)) {
			cursor: default !important;
		}
	}

	&:not(&--disabled, &--checked):focus-within &__content,
	&:not(&--disabled, &--checked) &__content:hover {
		background-color: var(--color-background-hover);
	}

	&--checked:not(&--disabled):focus-within &__content,
	&--checked:not(&--disabled) &__content:hover {
		background-color: var(--color-primary-element-hover);
	}

	&--checked:not(&--button-variant):not(&--disabled):focus-within &__content,
	&--checked:not(&--button-variant):not(&--disabled) &__content:hover {
		background-color: var(--color-primary-element-light-hover);
	}

	// Switch specific rules
	&-switch:not(&--checked) :deep(.checkbox-radio-switch__icon) > * {
		color: var(--color-text-maxcontrast);
	}

	// If switch is checked AND disabled, use the fade primary colour
	&-switch.checkbox-radio-switch--disabled.checkbox-radio-switch--checked :deep(.checkbox-radio-switch__icon) > * {
		color: var(--color-primary-element-light);
	}

	&--button-variant.checkbox-radio-switch {
		background-color: var(--color-main-background);
		border: 2px solid var(--color-border-maxcontrast);
		overflow: hidden;

		&--checked {
			font-weight: bold;

			.checkbox-radio-switch__content {
				background-color: var(--color-primary-element);
				color: var(--color-primary-element-text);
			}
		}
	}

	// Text overflow of button style
	&--button-variant :deep(.checkbox-radio-switch__text) {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
	}

	// Set icon color for non active elements to main text color
	&--button-variant:not(&--checked) :deep(.checkbox-radio-switch__icon) > * {
		color: var(--color-main-text);
	}

	// Hide icon container if empty to remove virtual padding
	&--button-variant :deep(.checkbox-radio-switch__icon:empty) {
		display: none;
	}

	&--button-variant:not(&--button-variant-v-grouped):not(&--button-variant-h-grouped),
	&--button-variant &__content {
		border-radius: var(--checkbox-radio-switch--border-radius);
	}

	/* Special rules for vertical button groups */
	&--button-variant-v-grouped &__content {
		flex-basis: 100%;
		// vertically grouped buttons should all have the same width
		max-width: unset;
	}
	&--button-variant-v-grouped {
		&:first-of-type {
			border-start-start-radius: var(--checkbox-radio-switch--border-radius-outer);
			border-start-end-radius: var(--checkbox-radio-switch--border-radius-outer);
		}
		&:last-of-type {
			border-end-start-radius: var(--checkbox-radio-switch--border-radius-outer);
			border-end-end-radius: var(--checkbox-radio-switch--border-radius-outer);
		}

		// remove borders between elements
		&:not(:last-of-type) {
			border-bottom: 0!important;
			.checkbox-radio-switch__content {
				margin-bottom: 2px;
			}
		}
		&:not(:first-of-type) {
			border-top: 0!important;
		}
	}

	/* Special rules for horizontal button groups */
	&--button-variant-h-grouped {
		&:first-of-type {
			border-start-start-radius: var(--checkbox-radio-switch--border-radius-outer);
			border-end-start-radius: var(--checkbox-radio-switch--border-radius-outer);
		}
		&:last-of-type {
			border-start-end-radius: var(--checkbox-radio-switch--border-radius-outer);
			border-end-end-radius: var(--checkbox-radio-switch--border-radius-outer);
		}

		// remove borders between elements
		&:not(:last-of-type) {
			border-inline-end: 0!important;
			.checkbox-radio-switch__content {
				margin-inline-end: 2px;
			}
		}
		&:not(:first-of-type) {
			border-inline-start: 0!important;
		}
	}
	&--button-variant-h-grouped :deep(.checkbox-radio-switch__text) {
		text-align: center;
		display: flex;
		align-items: center;
	}
	&--button-variant-h-grouped &__content {
		flex-direction: column;
		justify-content: center;
		width: 100%;
		margin: 0;
		gap: 0;
	}
}
</style>
