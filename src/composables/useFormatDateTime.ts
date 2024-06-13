/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MaybeRef } from 'vue'
import { getCanonicalLocale, getLanguage } from '@nextcloud/l10n'
import { computed, onUnmounted, ref, toValue, watchEffect } from 'vue'
import { t } from '../l10n.js'

const FEW_SECONDS_AGO = {
	long: t('a few seconds ago'),
	short: t('seconds ago'), // FOR TRANSLATORS: Shorter version of 'a few seconds ago'
	narrow: t('sec. ago'), // FOR TRANSLATORS: If possible in your language an even shorter version of 'a few seconds ago'
}

interface FormatDateOptions {
	/**
	 * The format used for displaying, or if relative time is used the format used for the title
	 */
	format?: Intl.DateTimeFormatOptions
	/**
	 * Ignore seconds when displaying the relative time and just show `a few seconds ago`
	 */
	ignoreSeconds?: boolean
	/**
	 * Wether to display the timestamp as time from now
	 */
	relativeTime?: false | 'long' | 'short' | 'narrow'
}

/**
 * Composable for formatting time stamps using current users locale and language
 *
 * @param {import('vue').MaybeRef<Date | number>} timestamp Current timestamp
 * @param {object} opts Optional options
 * @param {Intl.DateTimeFormatOptions} opts.format The format used for displaying, or if relative time is used the format used for the title (optional)
 * @param {boolean} opts.ignoreSeconds Ignore seconds when displaying the relative time and just show `a few seconds ago`
 * @param {false | 'long' | 'short' | 'narrow'} opts.relativeTime Wether to display the timestamp as time from now (optional)
 */
export function useFormatDateTime(
	timestamp: MaybeRef<Date|number> = Date.now(),
	opts: MaybeRef<FormatDateOptions> = {},
) {
	// Current time as Date.now is not reactive
	const currentTime = ref(Date.now())
	// The interval ID for the window
	let intervalId: number|undefined

	const options = ref({
		format: {
			timeStyle: 'medium',
			dateStyle: 'short',
		} as Intl.DateTimeFormatOptions,
		relativeTime: 'long' as const,
		ignoreSeconds: false,
		...toValue(opts),
	})
	const wrappedOptions = computed<Required<FormatDateOptions>>(() => ({ ...toValue(opts), ...options.value }))

	/** ECMA Date object of the timestamp */
	const date = computed(() => new Date(toValue(timestamp)))

	const formattedFullTime = computed<string>(() => {
		const formatter = new Intl.DateTimeFormat(getCanonicalLocale(), wrappedOptions.value.format)
		return formatter.format(date.value)
	})

	/** Time string formatted for main text */
	const formattedTime = computed<string>(() => {
		if (wrappedOptions.value.relativeTime !== false) {
			const formatter = new Intl.RelativeTimeFormat(getLanguage(), { numeric: 'auto', style: wrappedOptions.value.relativeTime })

			const diff = date.value.getTime() - currentTime.value
			const seconds = diff / 1000
			if (Math.abs(seconds) <= 90) {
				if (wrappedOptions.value.ignoreSeconds) {
					return FEW_SECONDS_AGO[wrappedOptions.value.relativeTime]
				} else {
					return formatter.format(Math.round(seconds), 'second')
				}
			}
			const minutes = seconds / 60
			if (Math.abs(minutes) <= 90) {
				return formatter.format(Math.round(minutes), 'minute')
			}
			const hours = minutes / 60
			if (Math.abs(hours) <= 24) {
				return formatter.format(Math.round(hours), 'hour')
			}
			const days = hours / 24
			if (Math.abs(days) <= 6) {
				return formatter.format(Math.round(days), 'day')
			}
			const weeks = days / 7
			if (Math.abs(weeks) <= 4) {
				return formatter.format(Math.round(weeks), 'week')
			}
			const months = days / 30
			if (Math.abs(months) <= 12) {
				return formatter.format(Math.round(months), 'month')
			}
			return formatter.format(Math.round(days / 365), 'year')
		}
		return formattedFullTime.value
	})

	// Set or clear interval if relative time is dis/enabled
	watchEffect(() => {
		window.clearInterval(intervalId)
		intervalId = undefined
		if (wrappedOptions.value.relativeTime) {
			intervalId = window.setInterval(() => { currentTime.value = Date.now() }, 1000)
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
