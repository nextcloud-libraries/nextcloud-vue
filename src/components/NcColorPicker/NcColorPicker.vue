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
	height: 40px;
	border-radius: 6px;
}
</style>
```

* Using v-model for both color and open state and emitting an event that updates the color

```vue
<template>
	<div class="container1">
		<NcButton @click="open = !open"> Click Me </NcButton>
		<NcColorPicker v-model="color" v-model:shown="open" @submit="open = false" v-slot="{ attrs }">
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
	}
}
</script>
<style>
.container1 {
	display: flex;
}

.color1 {
	width: 100px;
	height: 40px;
	margin-left: 20px;
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
}

.color0 {
	width: 100px;
	height: 40px;
	margin-left: 20px;
	border-radius: 6px;
}
</style>
```
</docs>

<template>
	<NcPopover popup-role="dialog"
		:container="container"
		@apply-hide="handleClose">
		<template #trigger="slotProps">
			<slot v-bind="slotProps" />
		</template>
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
					@update:model-value="pickColor" />
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
					@click="handleConfirm">
					{{ t('Choose') }}
				</NcButton>
			</div>
		</div>
	</NcPopover>
</template>

<script>
import NcButton from '../NcButton/index.ts'
import NcPopover from '../NcPopover/index.js'
import { t } from '../../l10n.js'
import { defaultPalette } from '../../utils/GenColors.js'

import GenRandomId from '../../utils/GenRandomId.js'

import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'
import Check from 'vue-material-design-icons/Check.vue'
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue'

import { Chrome } from '@ckpack/vue-color'
import { defineComponent } from 'vue'

const HEX_REGEX = /^#([a-f0-9]{3}|[a-f0-9]{6})$/i

export default defineComponent({
	name: 'NcColorPicker',

	components: {
		ArrowLeft,
		Check,
		Chrome,
		DotsHorizontal,
		NcButton,
		NcPopover,
	},

	props: {
		/**
		 * A HEX color that represents the initial value of the picker
		 */
		modelValue: {
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
		'update:modelValue',
	],

	data() {
		return {
			currentColor: this.modelValue,
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
		modelValue(color) {
			this.currentColor = color
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
			this.$emit('submit', this.currentColor)
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
		pickColor(color) {
			if (typeof color !== 'string') {
				color = this.currentColor.hex
			}
			this.currentColor = color

			/**
			 * Emits a hexadecimal string e.g. '#ffffff'
			 */
			this.$emit('update:modelValue', color)

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
})

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
	&-enter-from {
		transform: translateX(-50%);
		opacity: 0;
	}
	&-enter-to {
		transform: translateX(0);
		opacity: 1;
	}
	&-leave-from {
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
