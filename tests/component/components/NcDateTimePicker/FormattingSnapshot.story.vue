<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<pre>{{ snapshotString }}</pre>
</template>

<script setup lang="ts">
import { getDateFormat, getDateRangeFormat, getDateTimeFormat, getDateTimeRangeFormat, getMonthFormat, getTimeFormat, getTimeRangeFormat, getYearFormat } from '../../../../src/components/NcDateTimePicker/format.ts'
import allLocales from './allLocales.ts'

const date = new Date(2000, 0, 2, 3, 4)
const dateRange = [new Date(2000, 0, 1), new Date(2000, 0, 7)]
const timeRange = [new Date(2000, 0, 1, 2, 3), new Date(2000, 0, 1, 8, 9)]
const dateTimeRange = [new Date(2000, 0, 1, 2, 3), new Date(2000, 0, 7, 8, 9)]

const snapshot = {

}

for (const locale of allLocales) {
	const localeCode = locale.code.replaceAll('_', '-')
	if (Intl.DateTimeFormat.supportedLocalesOf([localeCode]).length === 0) {
		continue
	}
	snapshot[localeCode] = {
		localeName: locale.name,
		date: getDateFormat(localeCode)(date),
		dateRange: getDateRangeFormat(localeCode)(dateRange),
		time: getTimeFormat(localeCode)(date),
		timeRange: getTimeRangeFormat(localeCode)(timeRange),
		dateTime: getDateTimeFormat(localeCode)(date),
		dateTimeRange: getDateTimeRangeFormat(localeCode)(dateTimeRange),
		month: getMonthFormat(localeCode)(date),
		year: getYearFormat(localeCode)(date),
	}
}

const snapshotString = JSON.stringify(snapshot, null, 2)
</script>
