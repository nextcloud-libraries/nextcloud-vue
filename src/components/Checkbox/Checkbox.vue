<!--
  -
  - @copyright Copyright (c) 2019 Julius Härtl <jus@bitgrid.net>
  - @copyright Copyright (c) 2019 Greta Doci <gretadoci@gmail.com>
  -
  - @author Julius Härtl <jus@bitgrid.net>
  - @author Greta Doci <gretadoci@gmail.com>
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
## One checkbox

```vue
<template>
		<Checkbox
			label="some text"
			v-model="checkedTarget"/>
</template>
```
</docs>

<template>
	<label>
		<input
			:id="id"
			type="checkbox"
			:checked="value"
			:disabled="disabled"
			@change="onChange">
		{{ label }}
	</label>
</template>

<script>
import GenRandomId from '../../utils/GenRandomId'
export default {
	name: 'Checkbox',
	props: {
		/**
		 * id attribute of the checkbox element
		 */
		id: {
			type: String,
			default: () => 'checkbox-' + GenRandomId(5),

		},
		label: {
			type: String,
			required: true,
		},
		/**
		 * value of the checkbox input
		 */
		value: {
			type: Boolean,
			default: true,
		},
		/**
		 * disabled state of the checkbox element
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		onChange(event) {
			/**
			 * Emitted when the checkbox state is changed
			 * @type {boolean}
			 */
			this.$emit('update:value', this.$refs.checkbox.checked)
			this.$emit('input', this.$refs.checkbox.checked)
			/**
			 * Emitted when the checkbox state is changed
			 * @type {Event}
			 */
			this.$emit('change', event)
			if (this.$refs.checkbox.checked) {
				/**
				 * Emitted when the checkbox is checked
				 * @type {Event}
				 */
				this.$emit('check')
			} else {
				/**
				 * Emitted when the checkbox is unchecked
				 * @type {Event}
				 */
				this.$emit('uncheck')
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.checkbox {
	display: flex;
	align-items: flex-start;
	width: 100%;
	height: auto;
	margin: 0;
	padding: 0;
	cursor: pointer;
	white-space: nowrap;
	color: var(--color-main-text);
	border: 0;
	border-radius: 0;
	background-color: transparent;
	box-shadow: none;
	font-weight: normal;
	line-height: $clickable-area;

	&__checkbox {
		position: absolute;
		top: auto;
		left: -10000px;
		overflow: hidden;
		width: 1px;
		height: 1px;
		&:focus + .checkbox__label {
			opacity: $opacity_full;
		}
	}
	&__label {
		display: flex;
		align-items: center; // align checkbox to text
		width: 100%;
		padding: 0 !important;
		padding-right: $icon-margin !important;
		opacity: $opacity_normal;
		&::before {
			margin: 0 14px 0 !important;
		}
	}
	&--disabled {
		&,
		.checkbox__label {
			cursor: pointer;
			display: inline-block;
		}
	}
	&:not(.checkbox--disabled):hover,
	&:not(.checkbox--disabled):focus {
		.checkbox__label {
			opacity: $opacity_full;
		}
	}
}

</style>
