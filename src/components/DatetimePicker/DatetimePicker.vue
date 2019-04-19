<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template>
	<DatePicker
		v-bind="$attrs"
		:minute-step="10"
		:clearable="false"
		:value="value"
		v-on="$listeners"
		@update:value="$emit('update:value', value)" />
</template>

<script>
import DatePicker from 'vue2-datepicker/lib/datepicker'

/**
 * remove leading zeros on hours and minutes
 * https://github.com/mengxiong10/vue2-datepicker/blob/65c5762227649430f14158c01401a8486a881336/src/panel/time.js#L38
 */
DatePicker.components.CalendarPanel.components.PanelTime.methods.stringifyText = function(data) {
	return data
}

/**
 * hijack the display function and avoid the
 * top and left original positionning
 * https://github.com/mengxiong10/vue2-datepicker/blob/65c5762227649430f14158c01401a8486a881336/src/index.vue#L431
 */
DatePicker.methods.displayPopup = function() {
	const popupElmt = this.$el.querySelector('.mx-datepicker-popup')
	if (popupElmt && !popupElmt.classList.contains('popovermenu')) {
		popupElmt.className += ' popovermenu menu-center open'
	}
}

export default {
	name: 'DatetimePicker',

	components: {
		DatePicker
	},

	inheritAttrs: false,

	props: {
		// eslint-disable-next-line
		value: {
			default() {
				return new Date()
			}
		}
	}
}
</script>
