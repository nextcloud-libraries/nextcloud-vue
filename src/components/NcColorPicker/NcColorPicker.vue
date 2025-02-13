<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description

This component allows the user to choose a color. It consists of 2
actual pickers:

- One simple picker with a predefined palette of colors;
- One more advanced picker that provides the full color spectrum;

### Usage

* Using v-model and passing in an HTML element that will be treated as a trigger:

```vue
<template>
	<div class="container0">
		<NcColorPicker v-model="color">
			<NcButton> Click Me </NcButton>
		</NcColorPicker>
		<NcColorPicker v-model="color" :palette="customPalette">
			<NcButton> Click Me for a custom palette </NcButton>
		</NcColorPicker>
		<div :style="{'background-color': color}" class="color0" />
	</div>
</template>
<script>
export default {
	data() {
		return {
			color: '#0082c9',
			customPalette: [
				'#E40303',
				'#FF8C00',
				'#FFED00',
				'#008026',
				'#24408E',
				'#732982',
				'#5BCEFA',
				'#F5A9B8',
				'#FFFFFF',
				'#F5A9B8',
				'#5BCEFA',
			],
		}
	}
}
</script>
<style>
.container0 {
	display: flex;
	gap: 20px;
}

.color0 {
	width: 100px;
	height: 34px;
	border-radius: 6px;
}
</style>
```

* Using v-bind for both color and open state and emitting an event that updates the color

```vue
<template>
	<div class="container1">
		<NcButton @click="open = !open"> Click Me </NcButton>
		<NcColorPicker :model-value="color" @update:model-value="updateColor" :shown.sync="open" v-slot="{ attrs }">
			<div v-bind="attrs" :style="{'background-color': color}" class="color1" />
		</NcColorPicker>
	</div>
</template>
<script>
export default {
	data() {
		return {
			color: '#0082c9',
			open: false
		}
	},
	methods: {
		updateColor(e) {
			this.color = e
		}
	}
}
</script>
<style>
.container1 {
	display: flex;
	gap: 20px;
}

.color1 {
	width: 100px;
	height: 34px;
	border-radius: 6px;
}
</style>
```

* Using advanced fields including HEX, RGB, and HSL:

```vue
<template>
	<div class="container0">
		<NcColorPicker v-model="color"
			:advanced-fields="true">
			<NcButton> Click Me </NcButton>
		</NcColorPicker>
		<div :style="{'background-color': color}" class="color0" />
	</div>
</template>
<script>
export default {
	data() {
		return {
			color: '#0082c9'
		}
	}
}
</script>
<style>
.container0 {
	display: flex;
	gap: 20px;
}

.color0 {
	width: 100px;
	height: 34px;
	border-radius: 6px;
}
</style>
```
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
		<template #default="slotProps">
			<div role="dialog"
				class="color-picker"
				aria-modal="true"
				:aria-label="t('Color picker')"
				:class="{ 'color-picker--advanced-fields': advanced && advancedFields }">
				<Transition name="slide" mode="out-in">
					<div v-if="!advanced" class="color-picker__simple">
						<label v-for="({ color, name }, index) in normalizedPalette"
							:key="index"
							:style="{ backgroundColor: color }"
							class="color-picker__simple-color-circle"
							:class="{ 'color-picker__simple-color-circle--active' : color === currentColor }">
							<Check v-if="color === currentColor" :size="20" :fill-color="contrastColor" />
							<input type="radio"
								class="hidden-visually"
								:aria-label="name"
								:name="`color-picker-${uid}`"
								:checked="color === currentColor"
								@click="pickColor(color)">
						</label>
					</div>
					<Chrome v-else
						v-model="currentColor"
						class="color-picker__advanced"
						:disable-alpha="true"
						:disable-fields="!advancedFields"
						@input="pickColor" />
				</Transition>
				<div v-if="!paletteOnly" class="color-picker__navigation">
					<NcButton v-if="advanced"
						type="tertiary"
						:aria-label="ariaBack"
						@click="handleBack">
						<template #icon>
							<ArrowLeft :size="20" />
						</template>
					</NcButton>
					<NcButton v-else
						type="tertiary"
						:aria-label="ariaMore"
						@click="handleMoreSettings">
						<template #icon>
							<DotsHorizontal :size="20" />
						</template>
					</NcButton>
					<NcButton type="primary"
						@click="handleConfirm(slotProps.hide)">
						{{ t('Choose') }}
					</NcButton>
				</div>
			</div>
		</template>
	</NcPopover>
</template>

<script>
import NcButton from '../NcButton/index.js'
import NcPopover from '../NcPopover/index.js'
import { t } from '../../l10n.js'
import { defaultPalette } from '../../utils/GenColors.js'

import GenRandomId from '../../utils/GenRandomId.js'

import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'
import Check from 'vue-material-design-icons/Check.vue'
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue'

import { Chrome } from 'vue-color'
import { useModelMigration } from '../../composables/useModelMigration.ts'

const HEX_REGEX = /^#([a-f0-9]{3}|[a-f0-9]{6})$/i

export default {
	name: 'NcColorPicker',

	components: {
		ArrowLeft,
		Check,
		Chrome,
		DotsHorizontal,
		NcButton,
		NcPopover,
	},

	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
	},

	props: {
		/**
		 * Removed in v9 - use `modelValue` (`v-model`) instead
		 * @deprecated
		 */
		value: {
			type: String,
			default: undefined,
		},

		/**
		 * A HEX color that represents the initial value of the picker
		 */
		modelValue: {
			type: String,
			default: undefined,
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
			validator: (palette) => palette.every(item =>
				(typeof item === 'string' && HEX_REGEX.test(item))
				|| (typeof item === 'object' && item.color && HEX_REGEX.test(item.color)),
			),
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
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 * @deprecated
		 */
		'update:value',
		/**
		 * Emits a hexadecimal string e.g. '#ffffff'
		 */
		'update:modelValue',
		/** Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
		'input',
	],

	setup() {
		const model = useModelMigration('value', 'update:value', true)
		return {
			model,
		}
	},

	data() {
		return {
			currentColor: this.model,
			advanced: false,
			ariaBack: t('Back'),
			ariaMore: t('More options'),
		}
	},

	computed: {
		normalizedPalette() {
			return this.palette.map((item) => ({
				color: typeof item === 'object' ? item.color : item,
				name: typeof item === 'object' && item.name
					? item.name
					: t('A color with a HEX value {hex}', { hex: item.color }),
			}))
		},

		uid() {
			return GenRandomId()
		},
		contrastColor() {
			const black = '#000000'
			const white = '#FFFFFF'
			return (this.calculateLuma(this.currentColor) > 0.5) ? black : white
		},
	},

	watch: {
		model(color) {
			this.currentColor = color
		},
	},

	methods: {
		t,

		/**
		 * Submit a picked colour and close picker
		 * @param {Function} hideCallback callback to close popover
		 */
		handleConfirm(hideCallback) {
			/**
			 * Emits a hexadecimal string e.g. '#ffffff'
			 */
			this.$emit('submit', this.currentColor)
			hideCallback()

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
		pickColor(color) {
			if (typeof color !== 'string') {
				color = this.currentColor.hex
			}
			this.currentColor = color

			this.model = color

			/**
			 * Emits a hexadecimal string e.g. '#ffffff'
			 */
			this.$emit('input', color)

		},

		/**
		 * Calculate luminance of provided hex color
		 *
		 * @param {string} color the hex color
		 */
		 calculateLuma(color) {
			const [red, green, blue] = this.hexToRGB(color)
			return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255
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
		grid-template-columns: repeat(auto-fit, var(--default-clickable-area));
		grid-auto-rows: var(--default-clickable-area);

		&-color-circle {
			display: flex;
			align-items: center;
			justify-content: center;
			width: calc(var(--default-clickable-area) - 10px);
			height: calc(var(--default-clickable-area) - 10px);
			min-height: calc(var(--default-clickable-area) - 10px);
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
				width: calc(var(--default-clickable-area) - 6px);
				height: calc(var(--default-clickable-area) - 6px);
				min-height: calc(var(--default-clickable-area) - 6px);
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
			width: calc(var(--default-clickable-area) - 10 px);
			height: calc(var(--default-clickable-area) - 10 px);
			border-radius: 17px;
		}

		&-body {
			padding: 14px 0 0 0;
			background-color: var(--color-main-background);

			.vc-input__input {
				--input-border-radius: var(--border-radius-element, var(--border-radius-large));
				--input-border-width-offset: calc(var(--border-width-input-focused, 2px) - var(--border-width-input, 2px));
				width: 100%;
				height: var(--default-clickable-area);
				margin: 0;
				padding-inline: calc(var(--border-radius-large) + var(--input-border-width-offset));
				padding-block: var(--input-border-width-offset);
				border: var(--border-width-input, 2px) solid var(--color-border-maxcontrast);
				border-radius: var(--input-border-radius);
				font-size: var(--default-font-size);
				color: var(--color-main-text);
				box-shadow: none;

				&:active:not([disabled]),
				&:hover:not([disabled]),
				&:focus:not([disabled]) {
					// Reset padding offset when focused
					--input-border-width-offset: 0px;
					border-color: var(--color-main-text);
					border-width: var(--border-width-input-focused, 2px);
					box-shadow: 0 0 0 2px var(--color-main-background) !important;

					& + .vc-input__label {
						color: var(--color-main-text);
					}
				}
			}

			.vc-input__label {
				position: absolute;
				inset-inline: var(--border-width-input-focused, 2px);
				inset-block-start: calc(-1.5 * var(--font-size-small, 13px) / 2);
				max-width: fit-content;
				margin-inline: calc(var(--border-radius-large) - var(--default-grid-baseline));
				margin-block: 0;
				padding-inline: var(--default-grid-baseline);
				font-family: var(--font-face);
				font-size: var(--font-size-small, 13px);
				line-height: 1.5;
				font-weight: 500;
				color: var(--color-text-maxcontrast);
				background-color: var(--color-main-background);
				pointer-events: none;
			}
		}

		&-toggle-btn {
			display: flex;
			justify-content: center;
			align-items: center;
			width: var(--default-clickable-area);
			height: var(--default-clickable-area);
			margin-left: 6px;
			filter: var(--background-invert-if-dark);
		}

		&-toggle-icon {
			width: 24px;
			height: 24px;
			margin: 0;
		}

		&-toggle-icon-highlight {
			width: var(--default-clickable-area);
			height: var(--default-clickable-area);
			inset: 0;
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
