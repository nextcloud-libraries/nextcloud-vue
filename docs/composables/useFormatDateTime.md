<!--
 - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

This composable allows to format a timestamp or `Date` object either as human readable, localized, string or as relative time.

## Definition

```ts static
/**
 * Format a timestamp or date object as relative time.
 *
 * This is a composable wrapper around `formatRelativeTime` from `@nextcloud/l10n`.
 *
 * @param timestamp - The timestamp to format
 * @param opts - Formatting options
 */
declare function useFormatRelativeTime(timestamp: MaybeRefOrGetter<Date | number> = Date.now(), opts: MaybeRefOrGetter<FormatRelativeTimeOptions> = {}): Readonly<Ref<string>>

/**
 * Format a given timestamp or date object as a human readable string.
 *
 * @param timestamp - Timestamp or date object to format
 * @param opts - Formatting options
 */
declare function useFormatTime(timestamp: MaybeRefOrGetter<number | Date>, opts: MaybeRefOrGetter<FormatTimeOptions>): Readonly<Ref<string>>

interface FormatRelativeTimeOptions {
	/**
	 * If set and the time is only a couple of seconds then instead of the number of seconds "a few seconds ago" will be shown
	 *
	 * @default false
	 */
	ignoreSeconds?: boolean

	/**
	 * Language to use for formatting.
	 *
	 * @default The current users language
	 */
	language?: string

	/**
	 * The relative time formatting option to use.
	 *
	 * @default 'long
	 */
	relativeTime?: 'long' | 'short' | 'narrow'

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
	 * @default The current users locale
	 */
	locale?: string

	/**
	 * The format used for displaying.
	 *
	 * @default { timeStyle: 'medium', dateStyle: 'short' }
	 */
	format?: Intl.DateTimeFormatOptions
}
```


## Usage
```js static
import {
	useFormatRelativeTime,
	useFormatTime,
} from '@nextcloud/vue/composables/useFormatDateTime'

const timestamp = Date.now()
const date = new Date('2025-07-03T19:00:00Z')

const relativeTime = useFormatRelativeTime(timestamp, relativeTimeOptions)
const formattedTime = useFormatTime(date, timeOptions)
```

### Example

```vue
<template>
	<div class="container">
		<p class="description">Pick a time to show it formatted</p>
		<NcDateTimePicker v-model="date" confirm type="datetime" />
		<br />
		<p>Relative time: {{ relativeTime }}</p>
		<p>Formatted time: {{ formattedTime }}</p>
	</div>
</template>

<script>
	import { ref } from 'vue'
	import {
		useFormatRelativeTime,
		useFormatTime,
	} from '../../src/composables/useFormatDateTime/index.js'

	export default {
		setup() {
			const date = ref(new Date())

			const relativeTime = useFormatRelativeTime(date)
			const formattedTime = useFormatTime(date)

			return {
				date,
				formattedTime,
				relativeTime,
			}
		},
	}
</script>

<style scoped>
.description {
	margin-block: 10px;
}
</style>
```
