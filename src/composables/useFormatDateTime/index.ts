/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FormatDateOptions } from '@nextcloud/l10n'
import type { MaybeRefOrGetter } from '@vueuse/core'
import type { Ref } from 'vue'

import { formatRelativeTime, getCanonicalLocale } from '@nextcloud/l10n'
import { toValue } from '@vueuse/core'
import { computed, onUnmounted, readonly, ref, watchEffect } from 'vue'
import { t } from '../../l10n.js'

interface FormatRelativeTimeOptions extends Partial<Omit<FormatDateOptions, 'ignoreSeconds'>> {
	ignoreSeconds?: boolean

	/**
	 * If set to false the relative time will not be updated anymore.
	 *
	 * @default true - Meaning the relative time will be updated if needed
	 */
	update?: boolean
}

interface FormatTimeOptions {
	/**
	 * Locale to use for formatting.
	 *
	 * @default current locale
	 */
	locale?: string

	/**
	 * The format used for displaying.
	 *
	 * @default { timeStyle: 'medium', dateStyle: 'short' }
	 */
	format?: Intl.DateTimeFormatOptions
}

/**
 * @deprecated
 */
interface LegacyFormatDateTimeOptions {
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

const FEW_SECONDS_AGO = {
	long: t('a few seconds ago'),
	short: t('seconds ago'), // FOR TRANSLATORS: Shorter version of 'a few seconds ago'
	narrow: t('sec. ago'), // FOR TRANSLATORS: If possible in your language an even shorter version of 'a few seconds ago'
}

/**
 * Format a timestamp or date object as relative time.
 *
 * This is a composable wrapper around `formatRelativeTime` from `@nextcloud/l10n`.
 *
 * @param timestamp - The timestamp to format
 * @param opts - Formatting options
 */
export function useFormatRelativeTime(
	timestamp: MaybeRefOrGetter<Date | number> = Date.now(),
	opts: MaybeRefOrGetter<FormatRelativeTimeOptions> = {},
): Readonly<Ref<string>> {
	let timeoutId: number

	/**
	 * ECMA Date object of the timestamp
	 */
	const date = computed(() => new Date(toValue(timestamp)))

	/**
	 * Reactive options for `formatRelativeTime` method
	 */
	const options = computed<FormatDateOptions>(() => {
		const { language, relativeTime, ignoreSeconds } = toValue(opts)
		return {
			...language && { language },
			...relativeTime && { relativeTime },
			ignoreSeconds: ignoreSeconds
				? FEW_SECONDS_AGO[relativeTime || 'long']
				: false,
		}
	})

	/**
	 * The formatted relative time
	 */
	const relativeTime = ref('')
	watchEffect(() => updateRelativeTime())

	/**
	 * Update the relative time string.
	 * This is the callback for the interval.
	 */
	function updateRelativeTime() {
		relativeTime.value = formatRelativeTime(date.value, options.value)

		if (toValue(opts).update !== false) {
			const diff = Math.abs(Date.now() - new Date(toValue(timestamp)).getTime())
			const interval = diff > 120000 || options.value.ignoreSeconds
				? Math.min(diff / 60, 1800000)
				: 1000
			timeoutId = window.setTimeout(updateRelativeTime, interval)
		}
	}

	// when the component is unmounted we also clear the timeout
	onUnmounted(() => timeoutId && window.clearTimeout(timeoutId))

	return readonly(relativeTime)
}

/**
 * Format a given timestamp or date object as a human readable string.
 *
 * @param timestamp - Timestamp or date object to format
 * @param opts - Formatting options
 */
export function useFormatTime(
	timestamp: MaybeRefOrGetter<number | Date>,
	opts: MaybeRefOrGetter<FormatTimeOptions>,
): Readonly<Ref<string>> {
	const options = computed<Required<FormatTimeOptions>>(() => ({
		locale: getCanonicalLocale(),
		format: { dateStyle: 'short', timeStyle: 'medium' },
		...toValue(opts),
	}))

	const formatter = computed(() => new Intl.DateTimeFormat(options.value.locale, options.value.format))

	return computed(() => formatter.value.format(toValue(timestamp)))
}

/**
 * Composable for formatting time stamps using current users locale and language
 *
 * @param timestamp Current timestamp
 * @param opts Optional options
 * @param opts.format The format used for displaying, or if relative time is used the format used for the title (optional)
 * @param opts.ignoreSeconds Ignore seconds when displaying the relative time and just show `a few seconds ago`
 * @param opts.relativeTime Wether to display the timestamp as time from now (optional)
 *
 * @deprecated use `useFormatRelativeTime` or `useFormatTime` instead.
 */
export function useFormatDateTime(
	timestamp: MaybeRefOrGetter<Date | number> = Date.now(),
	opts: MaybeRefOrGetter<LegacyFormatDateTimeOptions> = {},
) {
	const formattedFullTime = useFormatTime(timestamp, opts)
	const relativeTime = useFormatRelativeTime(timestamp, computed(() => {
		const options = toValue(opts)
		return {
			...options,
			relativeTime: typeof options.relativeTime === 'string'
				? options.relativeTime
				: 'long',
		}
	}))

	const formattedTime = computed(() => toValue(opts).relativeTime !== false
		? relativeTime.value
		: formattedFullTime.value,
	)

	return {
		formattedTime,
		formattedFullTime,
	}
}
