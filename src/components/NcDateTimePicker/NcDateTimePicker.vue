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

<docs>
> We're wrapping the awesome datepicker library here https://github.com/mengxiong10/vue2-datepicker
> Please check there for all the available options.

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
			range
			type="date" />
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
	<DatePicker ref="datepicker"
		:append-to-body="appendToBody"
		:clearable="clearable"
		:format="format ? format : formatTypeMap"
		:formatter="formatter"
		:lang="lang ? lang : defaultLang"
		:minute-step="minuteStep"
		:placeholder="placeholder ? placeholder : defaultPlaceholder"
		:popup-class="{ 'show-week-number': showWeekNumber }"
		:show-week-number="showWeekNumber"
		:type="type"
		:value="value"
		v-bind="$attrs"
		v-on="$listeners"
		@select-year="handleSelectYear"
		@select-month="handleSelectMonth"
		@update:value="$emit('update:value', value)">
		<template #icon-calendar>
			<NcPopover v-if="showTimezoneSelect"
				:shown.sync="showTimezonePopover"
				popover-base-class="timezone-select__popper">
				<template #trigger>
					<button class="datetime-picker-inline-icon"
						:class="{'datetime-picker-inline-icon--highlighted': highlightTimezone}"
						@mousedown.stop.prevent="() => {}">
						<Web :size="20" />
					</button>
				</template>

				<div class="timezone-popover-wrapper__label">
					<strong>
						{{ t('Please select a time zone:') }}
					</strong>
				</div>
				<NcTimezonePicker v-model="tzVal"
					class="timezone-popover-wrapper__timezone-select"
					@input="$emit('update:timezone-id', arguments[0])" />
			</NcPopover>
			<CalendarBlank v-else :size="20" />
		</template>
		<template v-for="(_, slot) of $scopedSlots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</DatePicker>
</template>

<script>
import { t } from '../../l10n.js'

import NcTimezonePicker from '../NcTimezonePicker/index.js'
import NcPopover from '../NcPopover/index.js'

import CalendarBlank from 'vue-material-design-icons/CalendarBlank.vue'
import Web from 'vue-material-design-icons/Web.vue'

import {
	getFirstDay,
	getDayNames,
	getDayNamesShort,
	getDayNamesMin,
	getMonthNames,
	getMonthNamesShort,
} from '@nextcloud/l10n'

import DatePicker from 'vue2-datepicker'

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
		'update:timezone-id',
	],

	data() {
		return {
			showTimezonePopover: false,
			tzVal: this.timezoneId,
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

		/**
		 * If format is not provided, try to match the type
		 * or fallback to 'date'
		 *
		 * @return {string}
		 */
		formatTypeMap() {
			return formatMap[this.type] ?? formatMap.date
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
				} catch (error) {
					console.error('Invalid value', value, year)
				}
			}
		},

		handleSelectMonth(month) {
			const value = this.$refs.datepicker.currentValue
			if (value) {
				try {
					const date = new Date(new Date(value).setMonth(month))
					this.$refs.datepicker.selectDate(date)
				} catch (error) {
					console.error('Invalid value', value, month)
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
.v-popper--theme-dropdown.v-popper__popper.timezone-select__popper .v-popper__wrapper {
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
	z-index: 100001;
}
</style>
