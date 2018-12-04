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
	<datepicker
		v-bind="$attrs"
		:minute-step="10"
		:lang="lang"
		:clearable="false"
		:first-day-of-week="firstDay"
		v-on="$listeners" />
</template>

<script>
import Datepicker from 'vue2-datepicker'

/**
 * hijack the display function and avoid the
 * top and left original positionning
 */
Datepicker.methods.displayPopup = function() {
	const popupElmt = this.$el.querySelector('.mx-datepicker-popup')
	if (popupElmt && !popupElmt.classList.contains('popovermenu')) {
		popupElmt.className += ' popovermenu menu-center open'
	}
}

export default {
	name: 'DatetimePicker',

	components: {
		Datepicker
	},

	inheritAttrs: false,

	computed: {
		firstDay() {
			return window.firstDay
				? window.firstDay
				: 0 // sunday as default
		},
		lang() {
			// fallback to default in case of unavailable data
			return {
				days: window.dayNamesShort
					? window.dayNamesShort			// provided by nextcloud
					: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
				months: window.monthNamesShort
					? window.monthNamesShort		// provided by nextcloud
					: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
				placeholder: {
					date: 'Select Date' // TODO: Translate
				}
			}
		}
	}
}
</script>
