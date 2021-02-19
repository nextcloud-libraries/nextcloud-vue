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
	<button class="nc-button button-vue"
		v-bind="$attrs"
		:class="buttonClassObject"
		@click="handleClick"
		@blur="handleBlur"
		@keyup.tab.exact="handleTabUp">
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

	data() {
		return {
			/**
			 * Keeps track of whether the element's focus status is due to having
			 * tabbed to it. We use this to display a thick 'focus outline' only
			 * when the user is navigating with the keyboard.
			 */
			tabbed: false,
		}
	},

	computed: {

		hasText() {
			return this.text
		},

		hasIcon() {
			return this.$slots.default !== undefined
		},

		buttonClassObject() {
			return {
				'nc-button--outlined': this.type === 'outlined',
				'nc-button--contained': this.type === 'contained',
				'nc-button--text': this.type === 'text',
				// If icon only, some additional css rules are required
				'nc-button--icon-only': !this.hasText && this.hasIcon,
				[this.color]: this.color !== '',
				wide: this.wide,
				tabbed: this.tabbed,
			}

		},
	},

	methods: {
		// Forward the click event to the parent component
		handleClick(event) {
			this.$emit('click', event)
		},

		handleTabUp() {
			this.tabbed = true
		},

		handleBlur(event) {
			this.tabbed = false
		},
	},
}

</script>

<style lang="scss" scoped>

.nc-button {
	border: 0;
	font-size: var(--default-font-size);
	height: $clickable-area;
	min-width: $clickable-area;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--border-radius-pill);
	transition: background-color 0.1s linear !important;
	transition: border 0.1s linear;
	// No outline feedback for focus. Handled with a toggled class in js (see data)
	&:focus {
		outline: none;
	}
	// No active state for buttons
	&:active {
		background-color: unset;
	}

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
		&:hover {
			background-color: var(--color-background-hover);
			border-color: var(--color-background-hover);
		}
		// Variants
		&.primary {
			background-color: var(--color-primary-element);
			border-color: var(--color-primary-element);
			color: var(--color-primary-text);
			&:hover {
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
			&:hover {
				color: var(--color-primary) !important;
				background-color: var(--color-primary-light) !important;
			}
		}
	}

	&.wide {
		width: 100%;
	}

	// We use around our buttons instead of an outline, so that the added "border"
	// coincides with the border of the element.
	&.tabbed {
		box-shadow: 0px 0px 0px 2px var(--color-text-light);
	}
}
</style>
