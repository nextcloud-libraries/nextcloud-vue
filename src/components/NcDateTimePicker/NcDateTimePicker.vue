<!--
  - SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
In general it is recommended to use the native date picker (see `NcDateTimePickerNative` which is based on `<input type="date">`).
But some use cases are not covered by the native date selector, like selecting ranges or selecting a timezone.
For those cases this component can be used.

### General examples
```vue
<template>
	<div class="wrapper">
		<fieldset class="type-select">
			<legend>Picker mode</legend>
			<NcCheckboxRadioSwitch v-model="type" type="radio" value="date">Date</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="type" type="radio" value="datetime">Date and time</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="type" type="radio" value="week">Week</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="type" type="radio" value="month">Month</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="type" type="radio" value="year">Year</NcCheckboxRadioSwitch>
		</fieldset>
		<NcDateTimePicker
			v-model="time"
			:type />
		<span>{{ time }}</span>
	</div>
</template>
<script>
export default {
	data() {
		return {
			type: 'date',
			time: new Date('2022-10-10 10:10:10'),
		}
	},
}
</script>
<style scoped>
.wrapper {
	display: flex;
	flex-direction: column;
}

.type-select {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
</style>
```

### Example with confirm button

By default the date is applied as soon as you select the day in the calendar.
Sometimes - especially when selecting date and time - it is required to only emit the selected date when the flow is finished.
For this the `confirm` prop can be used, this will add a confirmation button to the selector.

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

The most common use case for the `NcDateTimePicker` is picking a range, as this is not supported by the native date picker.

When selecting the range picker type, the model value type will change from `Date` to `[Date, Date]`.
Meaning an array with two dates is used, the first date is the range start and the second date is the range end.

```vue
<template>
	<div>
		<fieldset class="type-select">
			<legend>Picker mode</legend>
			<NcCheckboxRadioSwitch v-model="type" type="radio" value="date-range">Date</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="type" type="radio" value="time-range">Time</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="type" type="radio" value="datetime-range">Date and time</NcCheckboxRadioSwitch>
		</fieldset>

		<NcDateTimePicker
			:key="type"
			v-model="time"
			:type />
		<div>
			<div>Start: {{ formatDate(time[0]) }}</div>
			<div>End: {{ formatDate(time[1]) }}</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			time: [new Date(2025, 3, 18, 12, 30), new Date(2025, 3, 21, 13, 30)],
			type: 'date-range',
		}
	},
	methods: {
		formatDate(date) {
			const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
			const timeString = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
			if (this.type === 'date-range') {
				return dateString
			} else if (this.type === 'time-range') {
				return timeString
			}
			return `${dateString} ${timeString}`
		},
	},
}
</script>

<style scoped>
.type-select {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
</style>
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
			show-timezone-select
			v-model:timezone-id="tz" /><br>
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

<script setup lang="ts">
import type {
	// The emitted object for time picker
	TimeObj as LibraryTimeObject,
	// The accepted model value
	ModelValue as LibraryModelValue,
	VueDatePickerProps,
} from '@vuepic/vue-datepicker'

import {
	mdiCalendarBlank,
	mdiChevronDown,
	mdiChevronLeft,
	mdiChevronRight,
	mdiChevronUp,
	mdiClock,
	mdiClose,
} from '@mdi/js'
import {
	getFirstDay,
	getDayNames,
	getDayNamesMin,
	getCanonicalLocale,
} from '@nextcloud/l10n'
import { computed } from 'vue'
import { t } from '../../l10n.js'

import VueDatePicker from '@vuepic/vue-datepicker'
import NcButton from '../NcButton/index.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcTimezonePicker from '../NcTimezonePicker/NcTimezonePicker.vue'

type LibraryFormatOptions = VueDatePickerProps['format']

const props = withDefaults(defineProps<{
	/**
	 * If set to true the menu will be placed on the `<body>`
	 * instead of default placement on the picker.
	 */
	appendToBody?: boolean

	/**
	 * Aria label for the input box.
	 *
	 * @default 'Datepicker input'
	 */
	ariaLabel?: string

	/**
	 * Aria label for the date picker menu.
	 *
	 * @default 'Datepicker menu'
	 */
	ariaLabelMenu?: string

	/**
	 * Allow to clear the input.
	 *
	 * @default false
	 */
	clearable?: boolean

	/**
	 * Do not auto-apply the date but require clicking the confirmation button.
	 * @default false
	 */
	confirm?: boolean

	/**
	 * Preview format for the picker input field.
	 * Can either be a string of Unicode tokens or a function that takes a Date object
	 * or for range picker an array of two dates, and returns the formatted date as string.
	 *
	 * @default Intl.DateTimeFormat is used to format dates and times
	 * @see https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
	 */
	format?: string | ((date: Date) => string) | ((dates: [Date, Date]) => string)

	/**
	 * The locale to use for formatting the shown dates.
	 * By default the users current Nextcloud locale is used.
	 */
	locale?: string

	/**
	 * Default increment step for minutes in the time picker.
	 * @default 10
	 */
	minuteStep?: number

	/**
	 * The value to initialize, but also two-way bind the selected date. The date is – like the `Date` object in
	 * JavaScript – tied to UTC. The selected time zone does not have an influence of the selected time and date
	 * value. You have to translate the time yourself when you want to factor in time zones.
	 *
	 * When using the range picker then an array containing the start and end date needs to be passed.
	 */
	modelValue?: Date | [Date, Date] | null

	/**
	 * Optional custom placeholder for the input box.
	 */
	placeholder?: string

	/**
	 * Include a timezone picker within the menu.
	 * Please note that the dates are still bound to the locale timezone
	 * and any conversion needs to be done by the app itself.
	 *
	 * @default false
	 */
	showTimezoneSelect?: boolean

	/**
	 * Show the ISO week numbers within the calendar.
	 *
	 * @default false
	 */
	showWeekNumber?: boolean

	/**
	 * Type of the picker.
	 * There is some special handling for ranges as those types require a `[Date, Date]` model value.
	 * - The 'date-range' type will enable a range picker for dates
	 * - The 'time-range' allows picking a time range.
	 * - The 'datetime-range' allows picking dates with times assigned.
	 *
	 * @default 'date'
	 */
	type?: 'date' | 'datetime' | 'time' | 'week' | 'month' | 'year' | 'date-range' | 'time-range' | 'datetime-range'
}>(), {
	ariaLabel: t('Datepicker input'),
	ariaLabelMenu: t('Datepicker menu'),
	format: undefined,
	locale: getCanonicalLocale(),
	minuteStep: 10,
	timezoneId: 'UTC',
	modelValue: null,
	// set by fallbackPlaceholder
	placeholder: undefined,
	type: 'date',
})

/**
 * The preselected IANA time zone ID for the time zone picker,
 * only relevant in combination with `show-timezone-select`.
 * The prop supports two-way binding through v-model directive.
 *
 * @example `Europe/Berlin`
 * @default 'UTC'
 */
const timezoneId = defineModel<string>('timezoneId', { default: 'UTC' })

const emit = defineEmits<{
	/**
	 * If range picker is enabled then an array containing start and end date are emitted.
	 * Otherwise the selected date is emitted.
	 * `null` is emitted if `clearable` is set to `true` and the value was cleared.
	 */
	'update:modelValue': [Date | [Date, Date] | null]
	'update:timezoneId': [string]
}>()

/**
 * Mapping of the model-value prop to the format expected by the library.
 * We do not directly pass the prop and adjust the interface to not transparently wrap the library.
 * This has show as beeing a pain in the past when we need to switch underlying libraries.
 */
const value = computed<LibraryModelValue>(() => {
	if (props.modelValue === null && props.clearable) {
		return null
	}

	if (props.type === 'week') {
		const date = props.modelValue instanceof Date ? props.modelValue : new Date()
		const end = new Date(date)
		end.setUTCDate(date.getUTCDate() + 6)
		return [date, end]
	} else if (props.type === 'year') {
		const date = props.modelValue instanceof Date ? props.modelValue : new Date()
		return date.getUTCFullYear()
	} else if (props.type === 'month') {
		const date = props.modelValue instanceof Date ? props.modelValue : new Date()
		return { year: date.getUTCFullYear(), month: date.getUTCMonth() }
	} else if (props.type === 'time' || props.type === 'time-range') {
		const time = [props.modelValue ?? (props.type === 'time-range' ? [new Date(), new Date()] : new Date())].flat()
		// default time range is 1 hour
		if (props.modelValue === undefined && props.type === 'time-range') {
			time[1].setHours(time[1].getHours() + 1)
		}
		const timeValue = time.map((date) => ({
			hours: date.getHours(),
			minutes: date.getMinutes(),
			seconds: date.getSeconds(),
		} as LibraryTimeObject))
		return props.type === 'time' ? timeValue[0] : timeValue
	} else if (props.type.endsWith('-range')) {
		if (props.modelValue === undefined) {
			const start = new Date()
			const end = new Date(start)
			end.setUTCDate(start.getUTCDate() + 7)
			return [start, end]
		}
		return props.modelValue
	}

	// no special handling for other types needed
	return props.modelValue ?? new Date()
})

const placeholderFallback = computed(() => {
	if (props.type === 'date') {
		return t('Select date')
	} else if (props.type === 'time') {
		return t('Select time')
	} else if (props.type === 'datetime') {
		return t('Select date and time')
	} else if (props.type === 'week') {
		return t('Select week')
	} else if (props.type === 'month') {
		return t('Select month')
	} else if (props.type === 'year') {
		return t('Select year')
	} else if (props.type.endsWith('-range')) {
		return t('Select time range')
	}
	// should not be reached
	return t('Select date and time')
})

/**
 * The date (time) formatting to be used by the library.
 * We use the provided format if possible, otherwise we provide a formatting function
 * which uses the browsers Intl API to format the date / time in the current users locale.
 */
const realFormat = computed<LibraryFormatOptions>(() => {
	if (props.format) {
		// we can cast the type here as in this case its either string
		// function `(Date) => string` or `([Date, Date]) => string` where we cast to `(Date[]) => string` here.
		return props.format as LibraryFormatOptions
	} else if (props.type === 'week') {
		// cannot format weeks with Intl.
		return 'RR-II'
	}

	let formatter: Intl.DateTimeFormat | undefined
	if (props.type === 'date' || props.type === 'date-range') {
		formatter = new Intl.DateTimeFormat(getCanonicalLocale(), { dateStyle: 'medium' })
	} else if (props.type === 'time' || props.type === 'time-range') {
		formatter = new Intl.DateTimeFormat(getCanonicalLocale(), { timeStyle: 'short' })
	} else if (props.type === 'datetime' || props.type === 'datetime-range') {
		formatter = new Intl.DateTimeFormat(getCanonicalLocale(), { dateStyle: 'medium', timeStyle: 'short' })
	} else if (props.type === 'month') {
		formatter = new Intl.DateTimeFormat(getCanonicalLocale(), { year: 'numeric', month: '2-digit' })
	} else if (props.type === 'year') {
		formatter = new Intl.DateTimeFormat(getCanonicalLocale(), { year: 'numeric' })
	}

	if (formatter) {
		return (input: Date | [Date, Date]) => Array.isArray(input)
			? formatter.formatRange(input[0], input[1])
			: formatter.format(input)
	}

	// fallback to default formatting
	return undefined
})

const pickerType = computed(() => ({
	timePicker: props.type === 'time' || props.type === 'time-range',
	yearPicker: props.type === 'year',
	monthPicker: props.type === 'month',
	weekPicker: props.type === 'week',
	range: props.type.endsWith('-range') && {
		// do not use partial ranges (meaning after selecting the start [Date, null] will be emitted)
		// if this is needed someday we can enable it,
		// but its not covered by our component interface (props / events) documentation so just disabled for now.
		partialRange: false,
	},
	enableTimePicker: !(props.type === 'date' || props.type === 'date-range'),
	flow: props.type === 'datetime'
		? ['calendar', 'time'] as ['calendar', 'time']
		: undefined,
}))

/**
 * Called on model value update of the library.
 * @param value The value emitted from the underlying library
 */
function onUpdateModelValue(value: LibraryModelValue): void {
	if (value === null) {
		return emit('update:modelValue', null)
	}

	if (props.type === 'time') {
		// time is provided as an object
		emit('update:modelValue', formatLibraryTime(value as LibraryTimeObject))
	} else if (props.type === 'time-range') {
		// same as time but as an array with two elements
		const start = formatLibraryTime(value[0])
		const end = formatLibraryTime(value[1])
		// ensure end is beyond the start
		if (end.getTime() < start.getTime()) {
			end.setDate(end.getDate() + 1)
		}
		emit('update:modelValue', [start, end])
	} else if (props.type === 'month') {
		// month is emitted as an object with month and year attribute
		const data = value as { month: number, year: number }
		emit('update:modelValue', new Date(data.year, data.month, 1))
	} else if (props.type === 'year') {
		// Years are emitted as the numeric year e.g. 2022
		emit('update:modelValue', new Date(value as number, 0))
	} else if (props.type === 'week') {
		// weeks are emitted as [Date, Date]
		emit('update:modelValue', value[0])
	} else {
		// otherwise it already emits the correct format
		emit('update:modelValue', value as Date | [Date, Date])
	}
}

/**
 * Format a vuepick time object to native JS Date object.
 *
 * @param time - The library time value object
 */
function formatLibraryTime(time: LibraryTimeObject): Date {
	const date = new Date()
	date.setHours(time.hours)
	date.setMinutes(time.minutes)
	date.setSeconds(time.seconds)
	return date
}

// Localization

const dayNames = getDayNamesMin()

const weekStart = getFirstDay()

// TRANSLATORS: A very short abbrevation used as a heading for "week number"
const weekNumName = t('W')

const ariaLabels = computed(() => ({
	toggleOverlay: t('Toggle overlay'),
	menu: props.ariaLabelMenu,
	input: props.ariaLabel,
	openTimePicker: t('Open time picker'),
	closeTimePicker: t('Close time Picker'),
	incrementValue: (type: 'hours' | 'minutes' | 'seconds') => {
		if (type === 'hours') {
			return t('Increment hours')
		} else if (type === 'minutes') {
			return t('Increment minutes')
		}
		return t('Increment seconds')
	},
	decrementValue: (type: 'hours' | 'minutes' | 'seconds') => {
		if (type === 'hours') {
			return t('Decrement hours')
		} else if (type === 'minutes') {
			return t('Decrement minutes')
		}
		return t('Decrement seconds')
	},
	openTpOverlay: (type: 'hours' | 'minutes' | 'seconds') => {
		if (type === 'hours') {
			return t('Open hours overlay')
		} else if (type === 'minutes') {
			return t('Open minutes overlay')
		}
		return t('Open seconds overlay')
	},
	amPmButton: t('Switch AM/PM mode'),
	openYearsOverlay: t('Open years overlay'),
	openMonthsOverlay: t('Open months overlay'),
	nextMonth: t('Next month'),
	prevMonth: t('Previous month'),
	nextYear: t('Next year'),
	prevYear: t('Previous year'),
	weekDay: (day: number) => getDayNames()[day],
	clearInput: t('Clear value'),
	calendarIcon: t('Calendar icon'),
	timePicker: t('Time picker'),
	monthPicker: (overlay: boolean) => overlay ? t('Month picker overlay') : t('Month picker'),
	yearPicker: (overlay: boolean) => overlay ? t('Year picker overlay') : t('Year picker'),
}))
</script>

<template>
	<VueDatePicker :aria-labels
		:auto-apply="!confirm"
		class="vue-date-time-picker"
		:cancel-text="t('Cancel')"
		:clearable
		:day-names
		:placeholder="placeholder ?? placeholderFallback"
		:format="realFormat"
		:locale
		:minutes-increment="minuteStep"
		:model-value="value"
		:now-button-label="t('Now')"
		:select-text="t('Pick')"
		six-weeks="fair"
		:teleport="appendToBody || undefined"
		text-input
		:week-num-name
		:week-numbers="showWeekNumber ? { type: 'iso' } : undefined"
		:week-start
		v-bind="pickerType"
		@update:model-value="onUpdateModelValue">
		<template #input-icon>
			<NcIconSvgWrapper :path="mdiCalendarBlank" :size="20" />
		</template>
		<template #clear-icon="{ clear }">
			<NcButton variant="tertiary-no-background"
				@click="clear">
				<template #icon>
					<NcIconSvgWrapper inline :path="mdiClose" :size="20" />
				</template>
			</NcButton>
		</template>
		<template #clock-icon>
			<NcIconSvgWrapper inline :path="mdiClock" :size="20" />
		</template>
		<template #arrow-left>
			<NcIconSvgWrapper inline :path="mdiChevronLeft" :size="20" />
		</template>
		<template #arrow-right>
			<NcIconSvgWrapper inline :path="mdiChevronRight" :size="20" />
		</template>
		<template #arrow-down>
			<NcIconSvgWrapper inline :path="mdiChevronDown" :size="20" />
		</template>
		<template #arrow-up>
			<NcIconSvgWrapper inline :path="mdiChevronUp" :size="20" />
		</template>
		<template v-if="showTimezoneSelect" #action-extra>
			<NcTimezonePicker v-model="timezoneId"
				class="vue-date-time-picker__timezone"
				:append-to-body="false"
				:input-label="t('Timezone')" />
		</template>
	</VueDatePicker>
</template>

<style scoped lang="scss">
@import '@vuepic/vue-datepicker/dist/main.css';

.vue-date-time-picker {
	--dp-border-radius: var(--border-radius-element);
	--dp-input-icon-padding: var(--default-clickable-area);

	.vue-date-time-picker__timezone {
		min-width: unset;
		width: 100%;
	}

	:deep(.icon-vue) {
		opacity: 1 !important;
	}

	// time selector button should have consistent padding
	:deep(.dp--tp-wrap),
	:deep(.dp__action_extra) {
		padding: var(--dp-menu-padding);
		padding-top: 0;
	}

	:deep(.dp__overlay.dp--overlay-absolute) {
		padding: var(--dp-menu-padding);

		.dp__btn.dp__button.dp__button_bottom {
			inset-block-end: 6px;
		}
	}

	:deep(.dp__btn.dp__button.dp__button_bottom),
	:deep(.dp--tp-wrap .dp__button) {
		width: 100%;
	}

	:deep(.dp__btn.dp__button.dp__overlay_action) {
		width: calc(100% - 16px);
	}

	// fix issues caused by Nextcloud server styles
	:deep(input) {
		padding-inline-start: var(--dp-input-icon-padding) !important;
	}
	:deep(.dp__btn) {
		padding: calc((var(--default-clickable-area) - 20px) / 2);
		margin: 0;
	}
	:deep(.dp__inner_nav) {
		height: fit-content;
		width: fit-content;
	}

	// Fix server styles causing buttons to be primary colored
	:deep(.dp--header-wrap .dp__btn:not(.dp__button_bottom)),
	:deep(.dp__time_col .dp__btn) {
		background-color: var(--color-main-background);

		&:hover {
			background-color: var(--color-background-hover);
		}
	}

	// Server styles cause the month and year to be fit-content -> fixing it to be max size.
	:deep(.dp__month_year_select) {
		flex: 1;
	}
	:deep(.dp--time-overlay-btn) {
		font-size: calc(2 * var(--default-font-size)) !important;
	}

	// Adjust padding to prevent horizontal scrolling in time selection
	:deep(.dp__time_input .dp__time_col_reg_block) {
		padding: 0 calc(4 * var(--default-grid-baseline));
	}

	&.dp__theme_dark,
	&.dp__theme_light,
	:deep(.dp__theme_dark),
	:deep(.dp__theme_light) {
		--dp-background-color: var(--color-main-background);
		--dp-text-color: var(--color-main-text);
		--dp-hover-color: var(--color-background-hover);
		--dp-hover-text-color: var(--color-main-text);
		--dp-hover-icon-color: var(--color-main-text);
		--dp-primary-color: var(--color-primary-element);
		--dp-primary-disabled-color: var(--color-primary-element-hover);
		--dp-primary-text-color: var(--color-primary-element-text);
		--dp-secondary-color: var(--color-text-maxcontrast); // this is used for "disabled" dates
		--dp-border-color: var(--color-border);
		--dp-menu-border-color: var(--color-border-dark);
		--dp-border-color-hover: var(--color-border-maxcontrast);
		--dp-border-color-focus: var(--color-border-maxcontrast);
		--dp-disabled-color: var(--color-background-dark);
		--dp-disabled-color-text: var(--color-text-maxcontrast);
		--dp-scroll-bar-background: var(--color-scrollbar);
		--dp-scroll-bar-color: var(--color-scrollbar);
		--dp-success-color: var(--color-success);
		--dp-success-color-disabled: var(--color-success-hover);
		--dp-icon-color: var(--color-main-text);
		--dp-danger-color: var(--color-error);
		--dp-marker-color: var(--color-error);
		--dp-tooltip-color: var(--color-main-text);
		--dp-highlight-color: var(--color-main-text);
	}
}
</style>
