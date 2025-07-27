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

* Using v-model for both color and open state and emitting an event that updates the color

```vue
<template>
	<div class="container1">
		<NcButton @click="open = !open"> Click Me </NcButton>
		<NcColorPicker v-model="color" v-model:open="open" v-slot="{ attrs }">
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

<script setup lang="ts">
import { Chrome as VueChrome } from '@ckpack/vue-color'
import { computed, ref } from 'vue'
import { Color, defaultPalette } from '../../utils/colors.ts'
import { createElementId } from '../../utils/createElementId.ts'
import { t } from '../../l10n.ts'

import IconArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'
import IconCheck from 'vue-material-design-icons/Check.vue'
import IconDotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue'
import NcButton from '../NcButton/index.ts'
import NcPopover from '../NcPopover/index.js'
import logger from '../../utils/logger.ts'

const HEX_REGEX = /^#([a-f0-9]{3}|[a-f0-9]{6})$/i

const props = withDefaults(defineProps<{
	/**
	 * Set to `true` to enable advanced fields including HEX, RGB, and HSL
	 */
	advancedFields?: boolean

	/**
	 * Selector for the popover container
	 */
	container?: string | Element

	/**
	 * Provide a custom array of colors to show.
	 * Can be either an array of string hexadecimal colors,
	 * or an array of object with a `color` property with hexadecimal color string,
	 * and a `name` property for accessibility.
	 *
	 * @type {string[] | {color: string, name: string}[]}
	 */
	palette?: string[] | Color[]

	/**
	 * Limit selectable colors to only the provided palette
	 */
	paletteOnly?: boolean
}>(), {
	container: 'body',
	palette: () => [...defaultPalette],
})

/**
 * A HEX color that represents the initial value of the picker
 */
const currentColor = defineModel<string>({ required: true })

/**
 * The open state of the color picker.
 */
const open = defineModel<boolean>('open')

const emit = defineEmits<{
	/**
	 * Emitted when the submit button was pressed.
	 * The payload is the same as the current modelValue.
	 */
	submit: [string]

	/**
	 * The color picker was fully closed and all transitions are finished.
	 */
	closed: []

	/**
	 * @deprecated - use the `closed` event instead.
	 */
	close:[]
}>()

/**
 * Unique id used to identify different color pickers
 */
const id = createElementId()

/**
 * Is the advanced picker is open
 */
const advanced = ref(false)

/**
 * Normalized palette by converting array of hex colors to color objects
 */
const normalizedPalette = computed(() => {
	let palette = props.palette
	for (const color of palette) {
		if ((typeof color === 'string' && !color.match(HEX_REGEX))
			|| (typeof color === 'object' && !color.color?.match(HEX_REGEX))) {
			logger.error('[NcColorPicker] Invalid palette passed', { color })
			palette = [...defaultPalette]
			break
		}
	}

	return palette.map((item) => ({
		color: typeof item === 'object' ? item.color : item,
		name: typeof item === 'object' && item.name
			? item.name
			: t('A color with a HEX value {hex}', { hex: item.color }),
	}))
})

const contrastColor = computed(() => {
	const black = '#000000'
	const white = '#FFFFFF'
	return calculateLuma(currentColor.value) > 0.5 ? black : white
})

/**
 * Submit a picked colour and close picker
 * @param hideCallback - callback to close popover
 */
function handleConfirm(hideCallback: () => void) {
	emit('submit', currentColor.value)
	hideCallback()
	advanced.value = false
}

/**
 * Pick a colour
 *
 * @param color - The picked color
 */
function pickColor(color: string | Color | { hex: string }) {
	if (typeof color !== 'string') {
		color = 'hex' in color ? color.hex : color.color
	}
	currentColor.value = color
}

/**
 * Calculate luminance of provided hex color
 *
 * @param color - The hex color
 */
function calculateLuma(color: string) {
	const [red, green, blue] = hexToRGB(color)
	return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255
}

/**
 * Convert hex color to RGB
 *
 * @param hex - The hex color
 */
function hexToRGB(hex: string) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
		: [0, 0, 0]
}

/**
 * Callback when all transistions of the closing popover are finished
 */
function onClosed() {
	emit('close')
	emit('closed')
}
</script>

<template>
	<NcPopover v-model:shown="open"
		:container="container"
		popup-role="dialog"
		@apply-hide="onClosed">
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
							<IconCheck v-if="color === currentColor" :size="20" :fill-color="contrastColor" />
							<input type="radio"
								class="hidden-visually"
								:aria-label="name"
								:name="`color-picker-${id}`"
								:checked="color === currentColor"
								@click="pickColor(color)">
						</label>
					</div>
					<VueChrome v-else
						v-model="currentColor"
						class="color-picker__advanced"
						:disable-alpha="true"
						:disable-fields="!advancedFields"
						@update:model-value="pickColor" />
				</Transition>
				<div v-if="!paletteOnly" class="color-picker__navigation">
					<NcButton v-if="advanced"
						:aria-label="t('Back')"
						variant="tertiary"
						@click="advanced = false">
						<template #icon>
							<IconArrowLeft :size="20" />
						</template>
					</NcButton>
					<NcButton v-else
						:aria-label="t('More options')"
						variant="tertiary"
						@click="advanced = true">
						<template #icon>
							<IconDotsHorizontal :size="20" />
						</template>
					</NcButton>
					<NcButton variant="primary"
						@click="handleConfirm(slotProps.hide)">
						{{ t('Choose') }}
					</NcButton>
				</div>
			</div>
		</template>
	</NcPopover>
</template>

<style lang="scss" scoped>
.color-picker {
	display: flex;
	overflow: hidden;
	align-content: flex-end;
	flex-direction: column;
	justify-content: space-between;
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
			border-radius: 17px;
		}

		&-body {
			padding: 14px 0 0 0;
			background-color: var(--color-main-background);

			.vc-input__input {
				--input-border-radius: var(--border-radius-element);
				--input-border-width-offset: calc(var(--border-width-input-focused, 2px) - var(--border-width-input, 2px));
				width: 100%;
				height: var(--default-clickable-area);
				margin: 0;
				padding-inline: calc(var(--border-radius-element) + var(--input-border-width-offset));
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
				margin-inline: calc(var(--border-radius-element) - var(--default-grid-baseline));
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
			margin-inline-start: 6px;
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
