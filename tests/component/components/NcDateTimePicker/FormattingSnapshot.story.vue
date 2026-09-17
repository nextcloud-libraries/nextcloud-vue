<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<pre>{{ snapshotString }}</pre>
</template>

<script setup lang="ts">
import type { Locale } from 'date-fns/locale'

import { format as dateFnsLocale } from 'date-fns/format'
import * as allDateFnsLocales from 'date-fns/locale'
import { getDateFormat, getDateTimeFormat, getMonthFormat, getTimeFormat, getYearFormat } from '../../../../src/components/NcDateTimePicker/format.ts'

const date = new Date(2000, 0, 2, 3, 4)
const dateRange = [new Date(2000, 0, 1), new Date(2000, 0, 7)] as const
const timeRange = [new Date(2000, 0, 1, 2, 3), new Date(2000, 0, 1, 8, 9)] as const
const dateTimeRange = [new Date(2000, 0, 1, 2, 3), new Date(2000, 0, 7, 8, 9)] as const

const snapshot = {

}

function format(date: Date, formatStr: string, locale: Locale) {
	return dateFnsLocale(date, formatStr, { locale })
}

function formatRange(dates: readonly [Date, Date], formatStr: string, locale: Locale) {
	return format(dates[0], formatStr, locale) + ' - ' + format(dates[1], formatStr, locale)
}

const displayNames = new Intl.DisplayNames(['en'], { type: 'language' })
for (const dateFnsLocale of Object.values(allDateFnsLocales)) {
	snapshot[dateFnsLocale.code] = {
		localeName: displayNames.of(dateFnsLocale.code),
		date: format(date, getDateFormat(dateFnsLocale), dateFnsLocale),
		dateRange: formatRange(dateRange, getDateFormat(dateFnsLocale), dateFnsLocale),
		time: format(date, getTimeFormat(), dateFnsLocale),
		timeRange: formatRange(timeRange, getTimeFormat(), dateFnsLocale),
		dateTime: format(date, getDateTimeFormat(dateFnsLocale), dateFnsLocale),
		dateTimeRange: formatRange(dateTimeRange, getDateTimeFormat(dateFnsLocale), dateFnsLocale),
		month: format(date, getMonthFormat(dateFnsLocale), dateFnsLocale),
		year: format(date, getYearFormat(dateFnsLocale), dateFnsLocale),
	}
}

const snapshotString = JSON.stringify(snapshot, null, 2)
</script>
