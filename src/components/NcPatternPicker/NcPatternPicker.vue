<!--
 - @copyright Copyright (c) 2024 Andrii Rublov <a@rublov.me>
 -
 - @author Andrii Rublov <a@rublov.me>
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
<!-- @todo add docs -->
</docs>

<template>
	<NcPopover popup-role="dialog"
		:container="container"
		v-bind="$attrs"
		v-on="$listeners"
		@apply-hide="handleClose">
		<template #trigger="slotProps">
			<slot v-bind="slotProps" />
		</template>
		<div role="dialog"
			class="color-picker"
			:aria-label="t('Color picker')"
			:class="{ 'color-picker--advanced-fields': advanced && advancedFields }">
			<Transition name="slide" mode="out-in">
				<div v-if="!advanced" class="color-picker__simple">
					<label v-for="({ style, name }, index) in normalizedPalette"
						:key="index"
						:style="style"
						class="color-picker__simple-color-circle"
						:class="{ 'color-picker__simple-color-circle--active' : name === currentPattern }">
						<Check v-if="name === currentPattern" :size="20" :fill-color="contrastColor" />
						<input type="radio"
							class="hidden-visually"
							:aria-label="name"
							:name="`color-picker-${uid}`"
							:checked="name === currentPattern"
							@click="pickPattern(name)">
					</label>
				</div>
			</Transition>
		</div>
	</NcPopover>
</template>

<script>
import NcPopover from '../NcPopover/index.js'
import { t } from '../../l10n.js'
import { defaultPalette } from '../../utils/GenPattern.js'

import GenRandomId from '../../utils/GenRandomId.js'

import Check from 'vue-material-design-icons/Check.vue'

// const HEX_REGEX = /^#([a-f0-9]{3}|[a-f0-9]{6})$/i

export default {
	name: 'NcPatternPicker',

	components: {
		Check,
		NcPopover,
	},

	props: {
		/**
		 * A HEX color that represents the initial value of the picker
		 */
		value: {
			type: String,
			required: true,
		},

		/**
		 * Set to `true` to enable advanced fields including HEX, RGB, and HSL
		 */
		advancedFields: {
			type: Boolean,
			default: false,
		},

		/**
		 * Limit selectable colors to only the provided palette
		 */
		paletteOnly: {
			type: Boolean,
			default: false,
		},

		/**
		 * Provide a custom array of colors to show.
		 * Can be either an array of string hexadecimal colors,
		 * or an array of object with a `color` property with hexadecimal color string,
		 * and a `name` property for accessibility.
		 *
		 * @type {string[] | {color: string, name: string}[]}
		 */
		palette: {
			type: Array,
			default: () => [...defaultPalette],
			// validator: (palette) => palette.every(item =>
			// 	(typeof item === 'string' && HEX_REGEX.test(item))
			// 	|| (typeof item === 'object' && item.color && HEX_REGEX.test(item.color)),
			// ),
		},

		/**
		 * Selector for the popover container
		 */
		container: {
			type: [String, Object, Element, Boolean],
			default: 'body',
		},
	},

	emits: [
		'submit',
		'close',
		'update:open',
		'update:value',
		'input',
	],

	data() {
		return {
			currentPattern: this.value,
			advanced: false,
			ariaBack: t('Back'),
			ariaMore: t('More options'),
		}
	},

	computed: {
		normalizedPalette() {
			return this.palette.map((item) => ({
				style: typeof item === 'object' ? item.style : item,
				name: typeof item === 'object' && item.name
					? item.name
					: t('A pattern with value {pattern}', { style: item.style }),
			}))
		},

		uid() {
			return GenRandomId()
		},
		contrastColor() {
			const black = '#000000'
			const white = '#FFFFFF'
			return black
			// return (this.calculateLuma(this.currentPattern) > 0.5) ? black : white
		},
	},

	watch: {
		value(name) {
			this.currentPattern = name
		},
	},

	methods: {
		t,

		/**
		 * Submit a picked colour and close picker
		 */
		handleConfirm() {
			/**
			 * Emits a hexadecimal string e.g. '#ffffff'
			 */
			this.$emit('submit', this.currentPattern)
			this.handleClose()

			this.advanced = false
		},
		handleClose() {
			/**
			 * Emitted after picker close
			 */
			this.$emit('close')
			this.$emit('update:open', false)
		},

		/**
		 * Inner navigations
		 */
		handleBack() {
			this.advanced = false
		},
		handleMoreSettings() {
			this.advanced = true
		},

		/**
		 * Pick a colour
		 *
		 * @param {string} color the picked color
		 */
		pickPattern(name) {
			// if (typeof pattern !== 'string') {
				// pattern = this.currentPattern.style
			// }
			this.currentPattern = name

			/**
			 * Emits a hexadecimal string e.g. '#ffffff'
			 */
			this.$emit('update:value', name)

			/**
			 * Emits a hexadecimal string e.g. '#ffffff'
			 */
			this.$emit('input', name)

		},

		/**
		 * Calculate luminance of provided hex color
		 *
		 * @param {string} color the hex color
		 */
		 calculateLuma(name) {
			// const [red, green, blue] = this.hexToRGB(color)
			return name
		},

		/**
		 * Convert hex color to RGB
		 *
		 * @param {string} hex the hex color
		 */
		 hexToRGB(hex) {
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
			return result
				? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
				: null
		},
	},
}

</script>

<style lang="scss" scoped>
.color-picker {
	display: flex;
	overflow: hidden;
	align-content: flex-end;
	flex-direction: column;
	justify-content: space-between;
	box-sizing: content-box !important;
	width: 176px;
	padding: 8px;
	border-radius: 3px;

	&--advanced-fields {
		width: 264px;
	}

	&__simple {
		display: grid;
		grid-template-columns: repeat(auto-fit, $clickable-area);
		grid-auto-rows: $clickable-area;

		&-color-circle {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 34px;
			height: 34px;
			min-height: 34px;
			margin: auto;
			padding: 0;
			color: white;
			border: 1px solid rgba(0, 0, 0, 0.25);
			border-radius: 50%;
			font-size: 16px;
			&:focus-within {
				outline: 2px solid var(--color-main-text);
			}
			&:hover {
				opacity: .6;
			}
			&--active {
				width: 38px;
				height: 38px;
				min-height: 38px;
				transition: all 100ms ease-in-out;
				opacity: 1 !important;
			}
		}
	}

	&__advanced {
		box-shadow: none !important;
	}

	&__navigation {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 10px;
	}
}

:deep() .vc {
	&-chrome {
		width: unset;
		background-color: var(--color-main-background);

		&-color-wrap {
			width: 30px;
			height: 30px;
		}

		&-active-color {
			width: 34px;
			height: 34px;
			border-radius: 17px;
		}

		&-body {
			padding: 14px 0 0 0;
			background-color: var(--color-main-background);
			.vc-input__input {
				box-shadow: none;
			}
		}

		&-toggle-btn {
			filter: var(--background-invert-if-dark);
		}

		&-saturation {
			&-wrap {
				border-radius: 3px;
			}

			&-circle {
				width: 20px;
				height: 20px;
			}
		}
	}
}

.slide {
	&-enter {
		transform: translateX(-50%);
		opacity: 0;
	}
	&-enter-to {
		transform: translateX(0);
		opacity: 1;
	}
	&-leave {
		transform: translateX(0);
		opacity: 1;
	}
	&-leave-to {
		transform: translateX(-50%);
		opacity: 0;
	}
	&-enter-active,
	&-leave-active {
		transition: all 50ms ease-in-out;
	}
}

</style>