<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template>
	<span class="action-checkbox">
		<input :id="id" :disabled="disabled" :checked="checked"
			type="checkbox" class="checkbox action-checkbox__checkbox"
			@change="onChange">
		<label :for="id" class="action-checkbox__label">{{ text }}</label>

		<!-- fake slot to gather inner text -->
		<slot v-if="false" />
	</span>
</template>

<script>
import GenRandomId from 'Utils/GenRandomId'

export default {
	name: 'ActionCheckbox',

	props: {
		id: {
			type: String,
			default: 'checkbox-' + GenRandomId()
		},
		checked: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		text() {
			return this.$slots.default[0].text
		}
	},

	methods: {
		onChange(event) {
			this.$emit('change', event)
		}
	}
}
</script>

<style lang="scss" scoped>
.action-checkbox {
	display: flex;
	align-items: flex-start;

	width: 100%;
	height: auto;
	margin: 0;
	padding: 0;

	cursor: pointer;
	white-space: nowrap;

	opacity: .7;
	color: var(--color-main-text);
	border: 0;
	border-radius: 0; // otherwise Safari will cut the border-radius area
	background-color: transparent;
	box-shadow: none;

	font-weight: normal;
	line-height: $popoveritem-height;

	&:hover,
	&:focus {
		opacity: 1;
	}

	/* checkbox/radio fixes */
	&__checkbox {
		position: absolute;
		left: -10000px;
		top: auto;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	&__label {
		display: flex;
		// align checkbox to text
		align-items: baseline;

		width: 100%;
		padding: 0;
		padding-right: 14px;
		// checkbox-width is 10px, border is 2
		// (44 - 10 - 2) / 2 = 16
		&::before {
			margin: 0 16px 0 !important;
		}
	}
}

</style>
