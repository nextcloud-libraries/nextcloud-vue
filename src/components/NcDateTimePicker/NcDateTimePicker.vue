<!--
  - SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
> In version 8 we were wrapping the awesome [vue2 datepicker library](https://github.com/mengxiong10/vue2-datepicker),
> were you could use all of there options even with this component.
> In version 9 and above this component will no longer be a transparent wrapper,
> as such only the documented properties below will work.

### Defaults
- cleareable: false
- minute-step: 10

### Example
```vue
<template>
	<span>
		<NcDateTimePicker
			v-model="time"
			type="datetime" />
		{{ time }}
	</span>
</template>
<script>
export default {
	data() {
		return {
			time: new Date('2022-10-10 10:10:10'),
		}
	},
}
</script>
```

### Example with confirm button
```vue
<template>
	<span>
		<NcDateTimePicker
			v-model="time"
			type="datetime"
			confirm />
		{{ time }}
	</span>
</template>
<script>
	export default {
		data() {
			return {
				time: null,
			}
		},
	}
</script>
```

### Range picker
```vue
<template>
	<span>
		<NcDateTimePicker
			v-model="time"
			type="date-range" />
		{{ time }}
	</span>
</template>
<script>
export default {
	data() {
		return {
			time: null,
		}
	},
}
</script>
```

### Time zone aware date picker

The datepicker can optionally include a picker for the preferred time zone. The selected time does not factor in the
picked time zone, but you will have to convert it yourself when necessary.

```vue
<template>
	<span>
		<NcDateTimePicker
			v-model="time"
			type="datetime"
			:show-timezone-select="true"
			:timezone-id.sync="tz" /><br>
		{{ time }} | {{ tz }}
	</span>
</template>
<script>
export default {
	data() {
		return {
			time: undefined,
			tz: 'Europe/Berlin',
		}
	},
}
</script>
```
</docs>

<template>
	<DatePicker
		ref="datepicker"
		:append-to-body="appendToBody"
		:clearable="clearable"
		:format="internalFormat"
		:formatter="internalFormatter"
		:lang="lang ? lang : defaultLang"
		:minute-step="minuteStep"
		:placeholder="placeholder ? placeholder : defaultPlaceholder"
		:popup-class="{ 'show-week-number': showWeekNumber }"
		:range="internalRange"
		:show-week-number="showWeekNumber"
		:type="realType"
		:value="model"
		v-bind="$attrs"
		v-on="$listeners"
		@select-year="handleSelectYear"
		@select-month="handleSelectMonth"
		@input="model = $event">
		<template #icon-calendar>
			<NcPopover
				v-if="showTimezoneSelect"
				popup-role="dialog"
				:shown.sync="showTimezonePopover"
				popover-base-class="timezone-select__popper">
				<template #trigger="{ attrs }">
					<button
						class="datetime-picker-inline-icon"
						:class="{ 'datetime-picker-inline-icon--highlighted': highlightTimezone }"
						v-bind="attrs"
						@mousedown.stop.prevent="() => {}">
						<Web :size="20" />
					</button>
				</template>

				<div
					role="dialog"
					:aria-labelledby="timezoneDialogHeaderId">
					<div class="timezone-popover-wrapper__label">
						<strong :id="timezoneDialogHeaderId">
							{{ t('Please select a time zone:') }}
						</strong>
					</div>
					<NcTimezonePicker
						v-model="tzVal"
						class="timezone-popover-wrapper__timezone-select"
						@input="$emit('update:timezone-id', arguments[0])" />
				</div>
			</NcPopover>
			<CalendarBlank v-else :size="20" />
		</template>
		<template v-for="(_, slot) of $scopedSlots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</DatePicker>
</template>

<script>
import {
	getDayNames,
	getDayNamesMin,
	getDayNamesShort,
	getFirstDay,
	getMonthNames,
	getMonthNamesShort,
} from '@nextcloud/l10n'
import DatePicker from 'vue2-datepicker'
import CalendarBlank from 'vue-material-design-icons/CalendarBlank.vue'
import Web from 'vue-material-design-icons/Web.vue'
import { useModelMigration } from '../../composables/useModelMigration.ts'
import { t } from '../../l10n.js'
import GenRandomId from '../../utils/GenRandomId.js'
import { logger } from '../../utils/logger.ts'
import NcPopover from '../NcPopover/index.js'
import NcTimezonePicker from '../NcTimezonePicker/index.js'

import './index.scss'

const formatMap = {
	date: 'YYYY-MM-DD',
	datetime: 'YYYY-MM-DD H:mm:ss',
	year: 'YYYY',
	month: 'YYYY-MM',
	time: 'H:mm:ss',
	week: 'w',
}

export default {
	name: 'NcDateTimePicker',

	components: {
		CalendarBlank,
		DatePicker,
		NcPopover,
		NcTimezonePicker,
		Web,
	},

	inheritAttrs: false,

	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
	},

	props: {
		/**
		 * Allow to clear the input.
		 */
		clearable: {
			type: Boolean,
			default: false,
		},

		/**
		 * Default increment step for minutes in the time picker.
		 */
		minuteStep: {
			type: Number,
			default: 10,
		},

		/**
		 * Since 8.25.0: Support 'date-range', 'time-range' and 'datetime-range' values.
		 */
		type: {
			type: String,
			default: 'date',
			validator: (type) => ['date', 'time', 'datetime', 'week', 'month', 'year', 'date-range', 'time-range', 'datetime-range'].includes(type),
		},

		/**
		 * Either `moment.js` formatting tokens or a function taking a Date object and returning a string.
		 * Warning: In v9 this will change the accepted token format to standardized Unicode tokens instead!
		 */
		format: {
			type: [String, Function],
			default: null,
		},

		/**
		 * @deprecated use `format` instead
		 */
		formatter: {
			type: Object,
			default: null,
		},

		/**
		 * The locale to use for formatting the shown dates.
		 * By default the users current Nextcloud locale is used.
		 */
		lang: {
			type: Object,
			default: null,
		},

		/**
		 * Removed in v9 - use `modelValue` (`v-model`) instead
		 *
		 * @deprecated
		 */
		// eslint-disable-next-line
		value: {
			default: undefined,
		},

		/**
		 * The value to initialize, but also two-way bind the selected date. The date is – like the `Date` object in
		 * JavaScript – tied to UTC. The selected time zone does not have an influence of the selected time and date
		 * value. You have to translate the time yourself when you want to factor in time zones.
		 */
		// eslint-disable-next-line
		modelValue: {
			default: () => new Date(),
		},

		/**
		 * The preselected IANA time zone ID for the time zone picker, only relevant in combination with `:show-timezone-select="true"`. Example: `Europe/Berlin`. The prop supports two-way binding through the .sync modifier.
		 */
		timezoneId: {
			type: String,
			default: 'UTC',
		},

		/**
		 * Include a timezone picker within the menu.
		 * Please note that the dates are still bound to the locale timezone
		 * and any conversion needs to be done by the app itself.
		 */
		showTimezoneSelect: {
			type: Boolean,
			default: false,
		},

		/**
		 * If set to true the timezone select icon will be highlighted.
		 */
		highlightTimezone: {
			type: Boolean,
			default: false,
		},

		/**
		 * If set to true the menu will be placed on the `<body>`
		 * instead of default placement on the picker.
		 */
		appendToBody: {
			type: Boolean,
			default: false,
		},

		/**
		 * Show the ISO week numbers within the calendar.
		 */
		showWeekNumber: {
			type: Boolean,
			default: false,
		},

		/**
		 * Optional custom placeholder for the input box.
		 */
		placeholder: {
			type: String,
			default: null,
		},

		/**
		 * @deprecated use the 'date-range' or 'datetime-range' type instead.
		 */
		range: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 *
		 * @deprecated
		 */
		'update:value',
		'update:modelValue',
		/** Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
		'update:timezone-id',
	],

	setup() {
		const model = useModelMigration('value', 'update:value')
		return {
			model,
			timezoneDialogHeaderId: `timezone-dialog-header-${GenRandomId()}`,
		}
	},

	data() {
		return {
			showTimezonePopover: false,
			tzVal: this.timezoneId,
		}
	},

	computed: {
		realType() {
			return this.type.split('-')[0]
		},

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

				monthFormat: 'MMMM',
			}
		},

		/**
		 * Translated placeholder
		 *
		 * @return {string}
		 */
		defaultPlaceholder() {
			if (this.realType === 'time') {
				return t('Pick a time')
			}
			if (this.realType === 'month') {
				return t('Pick a month')
			}
			if (this.realType === 'year') {
				return t('Pick a year')
			}
			if (this.realType === 'week') {
				return t('Pick a week')
			}
			if (this.realType === 'date') {
				return t('Pick a date')
			}
			return t('Pick a date and a time')
		},

		/**
		 * Is the range picker enabled
		 */
		internalRange() {
			return this.range || this.type.endsWith('-range')
		},

		internalFormat() {
			if (this.format && typeof this.format === 'string') {
				return this.format
			}
			return formatMap[this.realType] || formatMap.date
		},

		/**
		 * The formatter used for the vue-datepicker to fix nextcloud-libraries/nextcloud-vue#5044
		 */
		internalFormatter() {
			/**
			 * Get the ISO week number of the date
			 *
			 * @param {Date} date The date to format
			 */
			const getWeek = (date) => {
				// Adjust to nearest Thursday
				const firstThursday = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
				firstThursday.setUTCDate(firstThursday.getUTCDate() + 4 - (firstThursday.getUTCDay() || 7))

				const yearStart = new Date(Date.UTC(firstThursday.getUTCFullYear(), 0, 1))

				// Full weeks to nearest Thursday
				return Math.ceil((((firstThursday - yearStart) / 86400000) + 1) / 7)
			}

			return {
				getWeek,
				// wrape the format if it is a function
				...(typeof this.format === 'function' ? { stringify: this.format } : {}),
				// allow to override it by users using the `formatter` prop
				...(this.formatter ?? {}),
			}
		},
	},

	methods: {
		t,

		handleSelectYear(year) {
			const value = this.$refs.datepicker.currentValue
			if (value) {
				try {
					const date = new Date(new Date(value).setFullYear(year))
					this.$refs.datepicker.selectDate(date)
				} catch {
					logger.error('Invalid value', value, year)
				}
			}
		},

		handleSelectMonth(month) {
			const value = this.$refs.datepicker.currentValue
			if (value) {
				try {
					const date = new Date(new Date(value).setMonth(month))
					this.$refs.datepicker.selectDate(date)
				} catch {
					logger.error('Invalid value', value, month)
				}
			}
		},

		/**
		 * Toggles the visibility of the time zone popover
		 */
		toggleTimezonePopover() {
			if (!this.showTimezoneSelect) {
				// Just a click on the icon, but not for time zones -> ignore
				return
			}

			this.showTimezonePopover = !this.showTimezonePopover
		},
	},
}
</script>

<style lang="scss" scoped>
.mx-datepicker :deep(.mx-input-wrapper .mx-input) {
	background-clip: border-box;
}

.datetime-picker-inline-icon {
	opacity: .3;
	border: none;
	background-color: transparent;
	border-radius: 0;
	padding: 0 !important;
	margin: 0;

	&--highlighted {
		opacity: .7;
	}

	&:focus,
	&:hover {
		opacity: 1;
	}
}
</style>

<style lang="scss">
// We overwrite the popover base class, so we can style
// the popover for the timezone select only.
.v-popper--theme-nc-popover-8.v-popper__popper.timezone-select__popper .v-popper__wrapper {
	border-radius: var(--border-radius-large);

	.v-popper__inner {
		padding: 4px;
		border-radius: var(--border-radius-large);

		.timezone-popover-wrapper {
			&__label {
				padding: 4px 0;
				padding-left: 14px; // Left-align with NcSelect text
			}

			// We overwrite the border radius of the input to account for the popover border-radius minus the padding
			&__timezone-select.v-select {
				&.select {
					min-width: 246px;
					left: -8px !important;
				}
				.vs__dropdown-toggle {
					border-radius: calc(var(--border-radius-large) - 4px);
				}

				&.vs--open {
					.vs__dropdown-toggle {
						border-bottom-left-radius: 0;
						border-bottom-right-radius: 0;
					}
					&.select--drop-up .vs__dropdown-toggle {
						border-radius: 0 0 calc(var(--border-radius-large) - 4px) calc(var(--border-radius-large) - 4px);
					}
				}
			}
		}
	}
}

// TODO: This should be scoped or targeted by a specific selector, but the NcSelect component does not allow this yet.
.vs__dropdown-menu--floating {
	// Higher z-index than the popover in which the NcSelect is located.
	z-index: 100001 !important;
}
</style>
