<!--
 - @copyright Copyright (c) 2020 Marco Ambrosini <marcoambrosini@pm.me>
 -
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
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<docs>

### General description

The button

### Usage

</docs>

<template>
	<button class="nc-button"
		:disabled="disabled"
		:class="buttonClasses"
		@click="handleClick">
		<div class="nc-button__wrapper">
			<div v-if="hasIcon" class="nc-button__icon">
				<slot />
			</div>
			<span v-if="hasText" class="nc-button__text">{{ text }}</span>
		</div>
	</button>
</template>
<script>

export default {
	name: 'Button',

	props: {

		/**
		 * Type of button, possible values are 'outlined', 'contained' and 'text'
		 */
		type: {
			type: String,
			default: 'outlined',
		},

		/**
		 * The text of the button
		 */
		text: {
			type: String,
			default: '',
		},

		/**
		 * Toggle the disabled state for the button
		 */
		disabled: {
			type: Boolean,
			default: false,
		},

		/**
		 * Specifies the button color
		 * Accepted values: primary, error, warning, success.
		 */
		color: {
			type: String,
			validator(value) {
				return ['primary', 'error', 'warning', 'success', ''].indexOf(value) !== -1
			},
			default: '',
		},

		/**
		 * Specifies whether the button should span all the available width
		 */
		wide: {
			type: Boolean,
			default: false,
		},
	},

	computed: {

		hasText() {
			return this.text
		},

		hasIcon() {
			return this.$slots.default !== undefined
		},

		buttonClasses() {
			const classes = []

			// Type
			switch (this.type) {
			case 'outlined': {
				classes.push('nc-button--outlined')
				break
			}
			case 'contained': {
				classes.push('nc-button--contained')
				break
			}
			case 'text': {
				classes.push('nc-button--text')
			}
			}

			// If icon only, some additional css rules are required
			if (!this.hasText && this.hasIcon) {
				classes.push('nc-button--icon-only')
			}

			// Colors
			if (this.color !== '') {
				classes.push(this.color)
			}

			// Width
			if (this.wide) {
				classes.push('wide')
			}
			return classes
		},
	},

	methods: {
		// Forward the click event to the parent component
		handleClick(event) {
			this.$emit('click', event)
		},
	},
}

</script>

<style lang="scss" scoped>

.nc-button {
	// Remove server rules
	margin: 0;
	border: 0;
	padding: 0;
	// TODO: exclude vue button from server styles
	font-size: var(--default-font-size);
	height: $clickable-area;
	min-width: $clickable-area;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--border-radius-pill);
	transition: background-color 0.1s linear !important;
	transition: border 0.1s linear;

	&__wrapper {
		padding: 0 20px;
		display: inline-flex;
		align-items: center;
		justify-content: space-around;
		}

	&__icon {
		height: 16px;
		width: 16px;
		margin-right: 8px;
	}
	&__text {
		font-weight: bold;
	}

	// ## Types of button

	// ### Icon-only button
	&--icon-only {
		width: $clickable-area;
		.nc-button__wrapper {
			padding: 0;
		}

		.nc-button__icon {
			margin-right: 0;
		}
	}

	// ### Outlined button
	&--outlined {
		// Only one type of outlined button for now
		background-color: var(--color-main-background);
		color: var(--color-primary);
		border: 2px solid var(--color-primary);
		&:hover,
		&:focus {
			background-color: var(--color-primary-light) !important;
			border: 2px solid var(--color-primary) !important; // TODO: remove server rules targeting this;;
		}
	}

	// ### Contained button
	&--contained {
		// 2 variants, regular and primary
		// regular:
		background-color: var(--color-background-dark);
		border-color: var(--color-background-dark);
		&:hover,
			&:focus {
				background-color: var(--color-background-hover);
				border-color: var(--color-background-hover);
			}
		// Variants
		&.primary {
			background-color: var(--color-primary-element);
			border-color: var(--color-primary-element);
			color: var(--color-primary-text);
			&:hover,
			&:focus {
				background-color: var(--color-primary-element-light);
				border-color: var(--color-primary-element-light);
			}
		}
	}

	// ### Text button
	&--text {
		border: none;
		background: transparent;
		// 2 variants, regular and primary
		// regular:
		color: var(--color-main-text);
		&:hover,
		&:focus {
			background-color: var(--color-background-hover) !important;
		}
		&.primary {
			color: var(--color-primary);
			&:hover,
			&:focus {
				color: var(--color-primary) !important;
				background-color: var(--color-primary-light) !important;
			}
		}
	}

	&.wide {
		width: 100%;
	}
}

</style>
