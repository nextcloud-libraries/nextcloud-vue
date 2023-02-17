<!--
 - @copyright Copyright (c) 2020 Marco Ambrosini <marcoambrosini@icloud.com>
 -
 - @author Marco Ambrosini <marcoambrosini@icloud.com>
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
General purpose button component. See props for different options.
[Use material design icons only for icons](https://www.npmjs.com/package/vue-material-design-icons) and remember to set their size to 20.

### Usage
### Custom icon slot
To be used with `vue-material-design-icons` only. For icon classes use the `default-icon` slot.
It can be used with one or multiple actions.
```
<template>
<div class="wrapper">
	<!-- Style selector -->
	<div class="grid">
		<NcCheckboxRadioSwitch :checked.sync="style" value="text" name="style" type="radio">Text only</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="style" value="icon" name="style" type="radio">Icon only</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="style" value="icontext" name="style" type="radio">Icon and text</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="disabled" type="checkbox">Disabled</NcCheckboxRadioSwitch>
		<!--<NcCheckboxRadioSwitch :checked.sync="readonly" type="checkbox">Read-only</NcCheckboxRadioSwitch>-->
	</div>

	<h5>Standard buttons</h5>
	<div class="grid">
		<p>Tertiary, no background</p>
		<p>Tertiary</p>
		<p>Secondary</p>
		<p>Primary</p>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:readonly="readonly"
			type="tertiary-no-background">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
			<template v-if="style.indexOf('text') !== -1">Example text</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:readonly="readonly"
			type="tertiary">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
			<template v-if="style.indexOf('text') !== -1">Example text</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:readonly="readonly">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					title=""
					:size="20" />
			</template>
			<template v-if="style.indexOf('text') !== -1">Example text</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:readonly="readonly"
			type="primary">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
			<template v-if="style.indexOf('text') !== -1">Example text</template>
		</NcButton>
	</div>

	<!-- Wide button -->
	<h5>Wide button</h5>
	<NcButton
		:disabled="disabled"
		:readonly="readonly"
		:wide="true"
		text="Example text">
		<template #icon>
			<Video
				title=""
				:size="20" />
		</template>
		Example text
	</NcButton>

	<!-- Special buttons -->
	<h5>Special buttons</h5>
	<div class="grid">
		<p>Success</p>
		<p>Warning</p>
		<p>Error</p>
		<p> - </p>
		<NcButton
			:disabled="disabled"
			:readonly="readonly"
			type="success">
			<template #icon>
				<Video
					:size="20" />
			</template>
			Example text
		</NcButton>
		<NcButton
			:disabled="disabled"
			:readonly="readonly"
			type="warning">
			<template #icon>
				<Video
					title=""
					:size="20" />
			</template>
			Example text
		</NcButton>
		<NcButton
			:disabled="disabled"
			:readonly="readonly"
			type="error">
			<template #icon>
				<Video
					:size="20" />
			</template>
			Example text
		</NcButton>
		<p> - </p>
	</div>
</div>

</template>
<script>
import Video from 'vue-material-design-icons/Video'

export default {
	components: {
		Video,
	},
	data() {
		return {
			toggled: false,
			disabled: false,
			readonly: false,
			style: 'icontext',
		}
	}
}
</script>

<style lang="scss" scoped>
.wrapper {
	padding: 0 12px;
}

.grid {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: repeat(auto-fill, auto);
	position: relative;
	margin: 12px 0;
}

h5 {
	font-weight: bold;
	margin: 40px 0 20px 0;
}

p {
	text-align: center;
	margin: 4px 0 12px 0;
	color: var(--color-text-maxcontrast)
}

button {
	margin: auto;
}
</style>
```
</docs>

<script>

export default {
	name: 'NcButton',

	props: {
		/**
		 * Toggles the disabled state of the button on and off.
		 */
		disabled: {
			type: Boolean,
			default: false,
		},

		/**
		 * Specifies the button type
		 * Accepted values: primary, secondary, tertiary, tertiary-no-background, tertiary-on-primary, error, warning, success. If left empty,
		 * the default button style will be applied.
		 */
		type: {
			type: String,
			validator(value) {
				return ['primary', 'secondary', 'tertiary', 'tertiary-no-background', 'tertiary-on-primary', 'error', 'warning', 'success'].indexOf(value) !== -1
			},
			default: 'secondary',
		},

		/**
		 * Specifies the button native type
		 * Accepted values: submit, reset, button. If left empty,
		 * the default "button" type will be used.
		 */
		nativeType: {
			type: String,
			validator(value) {
				return ['submit', 'reset', 'button'].indexOf(value) !== -1
			},
			default: 'button',
		},

		/**
		 * Specifies whether the button should span all the available width.
		 * By default, buttons span the whole width of the container.
		 */
		wide: {
			type: Boolean,
			default: false,
		},

		/**
		 * Always try to provide an aria-label to your button. Make it more
		 * specific than the button's title by provide some more context. E.g. if
		 * the title of the button is "send" in the Mail app, the aria label could
		 * be "Send email".
		 */
		ariaLabel: {
			type: String,
			default: null,
		},

		/**
		 * Providing the href attribute turns the button component into an `a`
		 * element.
		 */
		href: {
			type: String,
			default: null,
		},

		/**
		 * Providing the to attribute turns the button component into a `router-link`
		 * element. Takes precedence over the href attribute.
		 */
		to: {
			type: [String, Object],
			default: null,
		},

		/**
		 * Pass in `true` if you want the matching behaviour of `router-link` to
		 * be non-inclusive: https://router.vuejs.org/api/#exact
		 */
		exact: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		// Determines whether the root element is an a,
		// a router-link or a button
		rootElement() {
			if (this.to) {
				return 'router-link'
			}
			if (this.href) {
				return 'a'
			}
			return 'button'
		},
	},

	/**
	 * The render function to display the component
	 *
	 * @param {Function} h The function to create VNodes
	 * @return {object|undefined} The created VNode
	 */
	render(h) {
		const text = this.$slots.default?.[0]?.text.trim()

		const hasText = !!text
		const hasIcon = this.$slots?.icon

		/**
		 * Always fill either the text prop or the ariaLabel one.
		 */
		if (!text && !this.ariaLabel) {
			console.warn('You need to fill either the text or the ariaLabel props in the button component.', {
				text,
				ariaLabel: this.ariaLabel,
			},
			this)
		}

		return h(this.rootElement(),
			{
				class: [
					'button-vue',
					{
						'button-vue--icon-only': hasIcon && !hasText,
						'button-vue--text-only': hasText && !hasIcon,
						'button-vue--icon-and-text': hasIcon && hasText,
						[`button-vue--vue-${this.type}`]: this.type,
						'button-vue--wide': this.wide,
					},
				],
				attrs: {
					'aria-label': this.ariaLabel,
					disabled: this.disabled,
					type: this.href ? null : this.nativeType,
					role: this.href ? 'button' : null,
					href: (!this.to && this.href) ? this.href : null,
					...this.$attrs,
				},
				props: {
					to: this.to ? this.to : null,
					tag: this.to ? 'button' : null,
					exact: this.exact,
				},
				on: {
					...this.$listeners,
				},
				nativeOn: {
					...this.$listeners,
				},
			},
			[
				h('span', { class: 'button-vue__wrapper' }, [
					hasIcon ? h('span', { class: 'button-vue__icon' }, [this.$slots.icon]) : null,
					hasText ? h('span', { class: 'button-vue__text' }, [text]) : null,
				]),
			]
		)
	},
}

</script>

<style lang="scss" scoped>

.button-vue {
	position: relative;
	width: fit-content;
	overflow: hidden;
	border: 0;
	padding: 0;
	font-size: var(--default-font-size);
	font-weight: bold;
	min-height: $clickable-area;
	min-width: $clickable-area;
	display: flex;
	align-items: center;
	justify-content: center;

	// Cursor pointer on element and all children
	cursor: pointer;
	& *,
	span {
		cursor: pointer;
	}
	border-radius: math.div($clickable-area, 2);
	transition-property: color, border-color, background-color;
	transition-duration: 0.1s;
	transition-timing-function: linear;

	// No outline feedback for focus. Handled with a toggled class in js (see data)
	&:focus {
		outline: none;
	}

	&:disabled {
		cursor: default;
		& * {
			cursor: default;
		}
		opacity: $opacity_disabled;
		// Gives a wash out effect
		filter: saturate($opacity_normal);
	}

	// Default button type
	color: var(--color-primary-light-text);
	background-color: var(--color-primary-light);
	&:hover:not(:disabled) {
		background-color: var(--color-primary-light-hover);
	}

	// Back to the default color for this button when active
	// TODO: add ripple effect
	&:active {
		background-color: var(--color-primary-element-light);
	}

	&__wrapper {
		display: inline-flex;
		align-items: center;
		justify-content: space-around;
	}

	&__icon {
		height: $clickable-area;
		width: $clickable-area;
		min-height: $clickable-area;
		min-width: $clickable-area;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	&__text {
		font-weight: bold;
		margin-bottom: 1px;
		padding: 2px 0;
	}

	// Icon-only button
	&--icon-only {
		width: $clickable-area !important;
	}

	// Text-only button
	&--text-only {
		padding: 0 12px;
		& .button-vue__text {
			margin-left: 4px;
			margin-right: 4px;
		}
	}

	// Icon and text button
	&--icon-and-text {
		padding: 0 16px 0 4px;
	}

	// Wide button spans the whole width of the container
	&--wide {
		width: 100%;
	}

	&:focus-visible {
		outline: 2px solid var(--color-main-text) !important;
		&.button-vue--vue-tertiary-on-primary {
			outline: 2px solid var(--color-primary-text);
			border-radius: var(--border-radius);
			background-color: transparent;
		}
	}

	// Button types

	// Primary
	&--vue-primary {
		background-color: var(--color-primary-element);
		color: var(--color-primary-text);
		&:hover:not(:disabled) {
			background-color: var(--color-primary-element-hover);
		}
		// Back to the default color for this button when active
		// TODO: add ripple effect
		&:active {
			background-color: var(--color-primary-element);
		}
	}

	// Secondary
	&--vue-secondary {
		color: var(--color-primary-light-text);
		background-color: var(--color-primary-light);
		&:hover:not(:disabled) {
			color: var(--color-primary-light-text);
			background-color: var(--color-primary-light-hover);
		}
	}

	// Tertiary
	&--vue-tertiary {
		color: var(--color-main-text);
		background-color: transparent;
		&:hover:not(:disabled) {
			background-color: var(--color);
			background-color: var(--color-background-hover);
		}
	}

	// Tertiary, no background
	&--vue-tertiary-no-background {
		color: var(--color-main-text);
		background-color: transparent;
		&:hover:not(:disabled) {
			background-color: transparent;
		}
	}

	// Tertiary on primary color (like the header)
	&--vue-tertiary-on-primary {
		color: var(--color-primary-text);
		background-color: transparent;

		&:hover:not(:disabled) {
			background-color: transparent;
		}
	}

	// Success
	&--vue-success {
		background-color: var(--color-success);
		color: white;
		&:hover:not(:disabled) {
			background-color: var(--color-success-hover);
		}
		// Back to the default color for this button when active
		// : add ripple effect
		&:active {
			background-color: var(--color-success);
		}
	}

	// Warning
	&--vue-warning {
		background-color: var(--color-warning);
		color: white;
		&:hover:not(:disabled) {
			background-color: var(--color-warning-hover);
		}
		// Back to the default color for this button when active
		// TODO: add ripple effect
		&:active {
			background-color: var(--color-warning);
		}
	}

	// Error
	&--vue-error {
		background-color: var(--color-error);
		color: white;
		&:hover:not(:disabled) {
			background-color: var(--color-error-hover);
		}
		// Back to the default color for this button when active
		// TODO: add ripple effect
		&:active {
			background-color: var(--color-error);
		}
	}
}

</style>
