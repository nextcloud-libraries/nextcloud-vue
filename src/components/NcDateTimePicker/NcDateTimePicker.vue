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
			<NcCheckboxRadioSwitch v-model="type" type="radio" value="range">Date</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="type" type="radio" value="range-datetime">Date and time</NcCheckboxRadioSwitch>
		</fieldset>

		<NcDateTimePicker
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
			time: [new Date(2025, 3, 18), new Date(2025, 3, 21)],
			type: 'range',
		}
	},
	methods: {
		formatDate(date) {
			const text = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
			if (this.type === 'range') {
				return text
			}
			return `${text} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
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
			:show-timezone-select="true"
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
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcTimezonePicker from '../NcTimezonePicker/NcTimezonePicker.vue'

const props = withDefaults(defineProps<{
	/**
	 * Aria label for the input box.
	 * @default 'Datepicker input'
	 */
	ariaLabel?: string

	/**
	 * Aria label for the date picker menu.
	 * @default 'Datepicker menu'
	 */
	ariaLabelMenu?: string

	/**
	 * Allow to clear the input.
	 */
	clearable?: boolean

	/**
	 * Do not auto-apply the date but require clicking the confirmation button.
	 * @default false
	 */
	confirm?: boolean

	/**
	 * Default increment step for minutes in the time picker.
	 * @default 10
	 */
	minuteStep?: number

	/**
	 * Preview format for the picker input field.
	 * @default 'yyyy-MM-dd HH:mm'
	 * @see https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
	 */
	format?: string

	/**
	 * The locale to use for formatting the shown dates.
	 * By default the users current Nextcloud locale is used.
	 */
	locale?: string

	/**
	 * The value to initialize, but also two-way bind the selected date. The date is – like the `Date` object in
	 * JavaScript – tied to UTC. The selected time zone does not have an influence of the selected time and date
	 * value. You have to translate the time yourself when you want to factor in time zones.
	 *
	 * When using the range picker then an array containing the start and end date needs to be passed.
	 */
	modelValue?: Date | [Date, Date]

	/**
	 * Optional custom placeholder for the input box.
	 */
	placeholder?: string

	showTimezoneSelect?: boolean

	/**
	 * Type of the picker.
	 * The 'range' type will enable a range picker for dates,
	 * while 'range-datetime' will allow picking a date range with times.
	 * @default 'date'
	 */
	type?: 'date' | 'datetime' | 'time' | 'week' | 'month' | 'year' | 'range' | 'range-datetime'

	appendToBody?: boolean

	showWeekNumber?: boolean
}>(), {
	ariaLabel: t('Datepicker input'),
	ariaLabelMenu: t('Datepicker menu'),
	format: undefined,
	locale: getCanonicalLocale(),
	minuteStep: 10,
	timezoneId: 'UTC',
	modelValue: undefined,
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
	 */
	'update:modelValue': [Date | [Date, Date]]
	'update:timezoneId': [string]
}>()

const value = computed(() => {
	if (props.modelValue === undefined && props.clearable) {
		return props.modelValue
	}

	if (props.type === 'week') {
		const date = props.modelValue instanceof Date ? props.modelValue : new Date()
		const end = new Date(date)
		end.setUTCDate(date.getUTCDate() + 6)
		return [date, end]
	} else if (props.type.startsWith('range')) {
		if (props.modelValue === undefined) {
			const start = new Date()
			const end = new Date(start)
			end.setUTCDate(start.getUTCDate() + 7)
			return [start, end]
		}
		return props.modelValue
	} else if (props.type === 'year') {
		const date = props.modelValue instanceof Date ? props.modelValue : new Date()
		return date.getUTCFullYear()
	} else if (props.type === 'month') {
		const date = props.modelValue instanceof Date ? props.modelValue : new Date()
		return { year: date.getUTCFullYear(), month: date.getUTCMonth() }
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
	} else if (props.type.startsWith('range')) {
		return t('Select time range')
	}
	// should not be reached
	return t('Select date and time')
})

const realFormat = computed(() => {
	if (props.format) {
		return props.format
	} else if (props.type === 'datetime' || props.type === 'range-datetime') {
		return 'yyyy-MM-dd HH:mm'
	} else if (props.type === 'date' || props.type === 'range') {
		return 'yyyy-MM-dd'
	} else if (props.type === 'week') {
		return 'RR-II'
	} else if (props.type === 'month') {
		return 'yyyy-MM'
	} else if (props.type === 'year') {
		return 'yyyy'
	}
	return undefined
})

const pickerType = computed(() => ({
	timePicker: props.type === 'time',
	yearPicker: props.type === 'year',
	monthPicker: props.type === 'month',
	weekPicker: props.type === 'week',
	range: props.type.startsWith('range'),
	enableTimePicker: !(props.type === 'date' || props.type === 'range'),
	flow: props.type === 'datetime'
		? ['calendar', 'time'] as ['calendar', 'time']
		: undefined,
}))

/**
 * Called on model value update of the library.
 * @param value The value emitted from the underlying library
 */
function onUpdateModelValue(value: Date | [Date, Date] | number | { month: number, year: number }): void {
	let date = value as Date | [Date, Date]
	if (props.type === 'month') {
		const data = value as { month: number, year: number }
		date = new Date(data.year, data.month, 1)
	} else if (props.type === 'year') {
		date = new Date(value as number, 0)
	} else if (props.type === 'week') {
		date = value[0]
	}
	emit('update:modelValue', date)
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
		<template #clear-icon>
			<NcIconSvgWrapper inline :path="mdiClose" :size="20" />
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
