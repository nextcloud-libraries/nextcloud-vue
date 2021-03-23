<!--
 - @copyright Copyright (c) 2019 Marco Ambrosini <marcoambrosini@pm.me>
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

This component allows the user to choose a color. It consists of 2
actual pickers:

- One simple picker with a predefined palette of colors;
- One more advanced picker that provides the full color spectrum;

### Usage

* Using v-model and passing in an HTML element that will be treated as a trigger:

```vue
<template>
	<div class="container0">
		<ColorPicker v-model="color">
			<button> Click Me </button>
		</ColorPicker>
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

* Using v-bind for both color and open state and emitting an event that updates the color

```vue
<template>
	<div class="container1">
		<button @click="open = !open"> Click Me </button>
		<ColorPicker :value="color" @input="updateColor" :open.sync="open">
			<div :style="{'background-color': color}" class="color1" />
		</ColorPicker>
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
}

.color1 {
	width: 100px;
	height: 40px;
	margin-left: 20px;
	border-radius: 6px;
}
</style>
```

</docs>

<template>
	<Popover v-bind="$attrs" v-on="$listeners" @apply-hide="handleClose">
		<template #trigger>
			<slot />
		</template>
		<div class="color-picker">
			<transition name="slide" mode="out-in">
				<div v-if="!advanced" class="color-picker__simple">
					<button v-for="(color, index) in palette"
						:key="index"
						:style="{'background-color': color }"
						class="color-picker__simple-color-circle"
						:class="{ 'color-picker__simple-color-circle--active' : color === currentColor }"
						type="button"
						@click="pickColor(color)">
						<Check v-if="color === currentColor"
							:size="20"
							title=""
							decorative />
					</button>
				</div>
				<Chrome v-if="advanced"
					v-model="currentColor"
					class="color-picker__advanced"
					:disable-alpha="true"
					:disable-fields="true"
					@input="pickColor" />
			</transition>
			<div class="color-picker__navigation">
				<button v-if="advanced"
					class="color-picker__navigation-button back"
					type="button"
					@click="handleBack">
					<ArrowLeft :size="20" title="" decorative />
				</button>
				<button v-if="!advanced"
					class="color-picker__navigation-button more-settings"
					type="button"
					@click="handleMoreSettings">
					<DotsHorizontal :size="20" title="" decorative />
				</button>
				<button v-if="advanced"
					class="color-picker__navigation-button confirm"
					type="button"
					@click="handleConfirm">
					{{ t('Choose') }}
				</button>
			</div>
		</div>
	</Popover>
</template>

<script>
import ArrowLeft from 'vue-material-design-icons/ArrowLeft'
import Check from 'vue-material-design-icons/Check'
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal'

import { Chrome } from 'vue-color'

import GenColors from '../../utils/GenColors'
import l10n from '../../mixins/l10n'
import Popover from '../Popover'

export default {
	name: 'ColorPicker',

	components: {
		ArrowLeft,
		Check,
		Chrome,
		DotsHorizontal,
		Popover,
	},

	mixins: [l10n],

	props: {
		/**
		* A HEX color that represents the initial value of the picker
		*/
		value: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			currentColor: this.value,
			advanced: false,
			palette: GenColors(4).map(color => {
				return '#' + this.rgbToHex(color.r) + this.rgbToHex(color.g) + this.rgbToHex(color.b)
			}),
		}
	},

	watch: {
		value(color) {
			this.currentColor = color
		},
	},

	methods: {
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
			this.$emit('update:value', color)

			/**
			 * Emits a hexadecimal string e.g. '#ffffff'
			 */
			this.$emit('input', color)

		},
		rgbToHex(color) {
			const hex = color.toString(16)
			return hex.length === 1 ? '0' + hex : hex
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
	padding: 4px;
	border-radius: 3px;
	height: 196px;

	&__simple {
		display: grid;
		grid-template-columns: repeat(4, $clickable-area);
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
			border: none;
			border-radius: 17px;
			font-size: 16px;
			&:hover {
				opacity: .6;
			}
			&--active {
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
		&-button {
			display: flex;
			align-content: center;
			justify-content: center;
			min-width: $clickable-area;
			height: $clickable-area;
			padding: 0;
			margin: 0;
			border: none;
			border-radius: $clickable-area / 2;
			background: none;
			justify-self: flex-end;
			opacity: $opacity_normal;

			&:focus,
			&:hover {
				background-color: $icon-focus-bg;
				opacity: $opacity_full;
			}

			&.confirm {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 4px 8px;
				color: white !important;
				background-color: var(--color-primary);
				&:hover {
					background-color: var(--color-primary-element-light);
				}
			}
			&.more-settings {
				margin-left: auto;
			}
		}
	}
}

::v-deep .vc {
	&-chrome {
		width: 176px;
		height: 13;
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
