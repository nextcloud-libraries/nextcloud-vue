<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

```ts static
import { formatDateTime } from '@nextcloud/vue/functions/formatDateTime'
```

Format a `Date` object or a timestamp as a humanized string, also called relative time.
Examples of such strings: *"last year"*, *"in one month"*, *"3 hours ago"*.

## Definitions

```ts static
/**
 * Format a given time as "relative time" also called "humanizing".
 *
 * @param timestamp Timestamp or Date object
 * @param options Options for the formatting
 */
declare function formatDateTime(
	timestamp: Date|number = Date.now(),
	options: FormatDateOptions = {},
): string;

interface FormatDateOptions {
  /**
	 * Ignore seconds when displaying the relative time and just show `a few seconds ago`.
   *
	 * @default false
	 */
	ignoreSeconds?: boolean

	/**
	 * The relative time formatting option to use.
   *
	 * @default 'long
	 */
	relativeTime?: 'long' | 'short' | 'narrow'

	/**
	 * Language to use.
   *
	 * @default 'current language'
	 */
	language?: string
}
```
