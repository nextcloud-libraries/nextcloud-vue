<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
> We're wrapping the awesome datepicker library here https://primevue.org/datepicker/
> Please check there for all the available options.

### Defaults
/// TODO

### Example
```vue
<template>
	<NcDatePicker v-model="date"/>
</template>
<script>
	export default {
		data() {
			return {
				date: {},
			}
		},
	}
</script>
```

</docs>

<template>
	<DatePicker v-model="value" showIcon iconDisplay="input">
		<template #inputicon="slotProps">
			<CalendarBlank :size="20" @click="slotProps.clickCallback"/>
		</template>
	</DatePicker>
</template>

<script>

import { t } from '../../l10n.js'
import DatePicker from 'primevue/datepicker';

import CalendarBlank from 'vue-material-design-icons/CalendarBlank.vue'

import {
	getFirstDay,
	getDayNames,
	getDayNamesShort,
	getDayNamesMin,
	getMonthNames,
	getMonthNamesShort,
} from '@nextcloud/l10n'


const formatMap = {
	date: 'YYYY-MM-DD',
	datetime: 'YYYY-MM-DD H:mm:ss',
	year: 'YYYY',
	month: 'YYYY-MM',
	time: 'H:mm:ss',
	week: 'w',
}

export default {
	name: 'NcDatePicker',

	components: {
		CalendarBlank,
		DatePicker,
	},

	inheritAttrs: true,

	props: {
		clearable: {
			type: Boolean,
			default: false,
		},

		minuteStep: {
			type: Number,
			default: 10,
		},

		type: {
			type: String,
			default: 'date',
		},

		format: {
			type: String,
			default: null,
		},

		formatter: {
			type: Object,
			default: null,
		},

		lang: {
			type: Object,
			default: null,
		},

		/**
		 * The value to initialize, but also two-way bind the selected date. The date is – like the `Date` object in
		 * JavaScript – tied to UTC. The selected time zone does not have an influence of the selected time and date
		 * value. You have to translate the time yourself when you want to factor in time zones.
		 */
		// eslint-disable-next-line
		value: {
			default: () => new Date(),
		},

		/**
		 * The preselected IANA time zone ID for the time zone picker, only relevant in combination with `:show-timezone-select="true"`. Example: `Europe/Berlin`. The prop supports two-way binding through the .sync modifier.
		 */
		timezoneId: {
			type: String,
			default: 'UTC',
		},

		showTimezoneSelect: {
			type: Boolean,
			default: false,
		},

		highlightTimezone: {
			type: Boolean,
			default: false,
		},

		appendToBody: {
			type: Boolean,
			default: false,
		},

		showWeekNumber: {
			type: Boolean,
			default: false,
		},

		placeholder: {
			type: String,
			default: null,
		},
	},

	emits: [
		'update:value',
	],

	data() {
		return {
		}
	},

	computed: {
		/**
		 * Datepicker language
		 * https://github.com/mengxiong10/vue2-datepicker/blob/master/locale.md
		 *
		 * @return {object}
		 */
		defaultLang() {
			return {
				formatLocale: {
					months: getMonthNames(),
					monthsShort: getMonthNamesShort(),
					weekdays: getDayNames(),
					weekdaysShort: getDayNamesShort(),
					weekdaysMin: getDayNamesMin(),
					// 0 = sunday, 1 = monday
					firstDayOfWeek: getFirstDay(),
				},
				monthFormat: 'MMM',
			}
		},

		/**
		 * Translated placeholder
		 *
		 * @return {string}
		 */
		defaultPlaceholder() {
			if (this.type === 'time') {
				return t('Pick a time')
			}
			if (this.type === 'month') {
				return t('Pick a month')
			}
			if (this.type === 'year') {
				return t('Pick a year')
			}
			if (this.type === 'week') {
				return t('Pick a week')
			}
			if (this.type === 'date') {
				return t('Pick a date')
			}
			return t('Pick a date and a time')
		},

	},

	methods: {
		t,
	},
}
</script>

<style lang="scss" scoped>

</style>
