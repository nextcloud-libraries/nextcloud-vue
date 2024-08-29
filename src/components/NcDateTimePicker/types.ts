/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export interface NcDateTimePickerEmits {
	(e: 'update:modelValue', value: Date): void
	(e: 'update:timezoneId', value: string): void
}

/**
 * Properties of the NcDateTimePicker
 */
export interface NcDateTimePickerProps {
	/**
	 * Add a clear icon to the input field to set the value to null
	 * @default false
	 */
	clearable: boolean

	/**
	 * The placeholder to show within the input element.
	 * If not set a default string based on the type will be shown.
	 * @default undefined
	 */
	placeholder?: string

	/**
	 * This prop sets the number of weeks inside the calendar to alway 6 weeks.
	 * This will prevent dynamic calendar height change depending on the month.
	 * See {@link https://vue3datepicker.com/props/look-and-feel/#six-weeks Upstream documentation}
	 *
	 * Pass `false` to disable.
	 *
	 * @default 'fair'
	 */
	sixWeeks: false | 'append' | 'prepend' | 'center' | 'fair'

	/*********************************************
	 ** TODO: Remove this deprecated properties **
	 *********************************************/

	/**
	 * Append the menu to the body instead of the current parent.
	 * @default false
	 * @deprecated Use the `teleport` prop instead. Will be removed with v10.
	 */
	appendToBody?: boolean

	/**
	 * Automatically apply the the selected date without require to press submit.
	 * @default true
	 * @deprecated For backwards compatibility this defaults to true. With v10 this will be removed to default to the upstream default instead.
	 */
	autoApply: boolean

	/**
	 * Set the increment for minutes via arrows in the time picker.
	 * @default 10
	 * @deprecated Use the `minutesIncrement` prop instead. Will be removed with v10.
	 */
	minuteStep: number

	/**
	 * The value to initialize, but also two-way bind the selected date. The date is – like the `Date` object in
	 * JavaScript – tied to UTC. The selected time zone does not have an influence of the selected time and date
	 * value. You have to translate the time yourself when you want to factor in time zones.
	 */
	modelValue: Date

	/**
	 * Enable showing week numbers.
	 * @default false
	 * @deprecated Use the `weekNumbers` prop instead. Will be removed with v10.
	 */
	showWeekNumber?: boolean

/*
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
	},*/

	/**
	 * The preselected IANA time zone ID for the time zone picker, only relevant in combination with `:show-timezone-select="true"`. Example: `Europe/Berlin`. The prop supports two-way binding through v-model directive.
	 */
	/*timezoneId: {
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
	},*/
}
