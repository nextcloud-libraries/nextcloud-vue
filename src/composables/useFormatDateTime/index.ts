/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FormatDateOptions } from '../../functions/formatDateTime/index.ts'
import type { Ref } from 'vue'

import { getCanonicalLocale } from '@nextcloud/l10n'
import { computed, onUnmounted, ref, onMounted, watch, unref } from 'vue'
import { formatDateTime } from '../../functions/formatDateTime/index.ts'

interface FormatDateComposableOptions {
	/**
	 * The format used for displaying, or if relative time is used the format used for the title
	 * @default  '{ timeStyle: "medium", dateStyle: "short" }'
	 */
	format?: Intl.DateTimeFormatOptions

	/**
	 * Wether to display the timestamp as time from now.
	 * @default 'long'
	 */
	relativeTime?: false | FormatDateOptions['relativeTime']

	/**
	 * Ignore seconds when displaying the relative time and just show `a few seconds ago`
	 * @default false
	 */
	ignoreSeconds?: boolean
}

type MaybeRef<T> = T | Ref<T>

/**
 * Composable for formatting time stamps using current users locale and language
 *
 * @param timestamp Current timestamp
 * @param opts Options
 */
export function useFormatDateTime(
	timestamp: MaybeRef<Date|number> = Date.now(),
	opts: MaybeRef<FormatDateComposableOptions> = {},
) {
	// Current time as Date.now is not reactive
	const currentTime = ref(Date.now())
	// The interval ID for the window
	let intervalId: number|undefined

	const options = ref<Required<FormatDateComposableOptions>>({
		format: {
			timeStyle: 'medium',
			dateStyle: 'short',
		} as Intl.DateTimeFormatOptions,
		relativeTime: 'long' as const,
		ignoreSeconds: false,
		...unref(opts),
	})

	const wrappedOptions = computed(() => ({ ...unref(opts), ...options.value }))

	/** ECMA Date object of the timestamp */
	const date = computed(() => new Date(unref(timestamp)))

	/** Interval to update the value */
	const updateInterval = computed(() => (
		(wrappedOptions.value.ignoreSeconds || Math.abs(currentTime.value - date.value.getTime()) > 60000)
			? 30000
			: 1000
	))

	const formattedFullTime = computed<string>(() => {
		const formatter = new Intl.DateTimeFormat(getCanonicalLocale(), wrappedOptions.value.format)
		return formatter.format(date.value)
	})

	/** Time string formatted for main text */
	const formattedTime = computed<string>(() => {
		if (wrappedOptions.value.relativeTime !== false) {
			// This access is needed to trigger a re-calculation if the value changed
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const _ = currentTime.value
			return formatDateTime(date.value, wrappedOptions.value as FormatDateOptions)
		}
		return formattedFullTime.value
	})

	// Set or clear interval if relative time is dis/enabled
	watch([wrappedOptions], () => {
		window.clearInterval(intervalId)
		intervalId = undefined
		if (wrappedOptions.value.relativeTime) {
			intervalId = window.setInterval(() => { currentTime.value = Date.now() }, updateInterval.value)
		}
	})

	// Start the interval for setting the current time if relative time is enabled
	onMounted(() => {
		if (wrappedOptions.value.relativeTime !== false) {
			intervalId = window.setInterval(() => { currentTime.value = Date.now() }, updateInterval.value)
		}
	})

	// ensure interval is cleared
	onUnmounted(() => {
		window.clearInterval(intervalId)
	})

	return {
		formattedTime,
		formattedFullTime,
		options,
	}
}
