<!--
 - @copyright Copyright (c) 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 -
 - @author Ferdinand Thiessen <opensource@fthiessen.de>
 -
 - @license AGPL-3.0-or-later
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<docs>

### General description

This components purpose is to display a timestamp in the users local time format.
It also supports relative time, for examples *6 seconds ago*.

#### Standard usage

Without any optional parameters the timestamp is displayed as a relative datetime and a title with the full date is added.

```vue
<template>
	<NcDateTime :timestamp="timestamp" />
</template>
<script>
	export default {
		data() {
			return {
				timestamp: Date.now(),
			}
		},
	}
</script>
```

#### Ignore seconds

If you do not want the seconds to be counted up until minutes are reached you can simply use the `ignore-seconds` property.

```vue
<template>
	<NcDateTime :timestamp="timestamp" :ignore-seconds="true" />
</template>
<script>
	export default {
		data() {
			return {
				timestamp: Date.now(),
			}
		},
	}
</script>
```

#### Custom date or time format

The component allows to format the full date for the title by settings the `format` property.
It is also possible to disable relative time by setting the `relativeTime` property to `false`.

```vue
<template>
	<div>
		<h4>Short relative time</h4>
		<NcDateTime :timestamp="timestamp" relative-time="short" />

		<h4>Custom title format</h4>
		<NcDateTime :timestamp="timestamp" :format="timeFormat" />

		<h4>Without relative time</h4>
		<NcDateTime :timestamp="timestamp" :format="timeFormat" :relative-time="false" />
	</div>
</template>
<script>
	export default {
		data() {
			return {
				timestamp: Date.now(),
				/** For allowed formats see the Intl.DateTimeFormat options */
				timeFormat: {
					dateStyle: 'short',
					timeStyle: 'full'
				},
			}
		},
	}
</script>
<style>
h4 {
	font-weight: bold;
	margin-top: 12px;
}
</style>
```
</docs>

<template>
	<span class="nc-datetime"
		:data-timestamp="timestamp"
		:title="formattedFullTime">{{ formattedTime }}</span>
</template>

<script>
import { getCanonicalLocale } from '@nextcloud/l10n'
import { t } from '../../l10n.js'

const FEW_SECONDS_AGO = {
	long: t('a few seconds ago'),
	short: t('seconds ago'), // FOR TRANSLATORS: Shorter version of 'a few seconds ago'
	narrow: t('sec. ago'), // FOR TRANSLATORS: If possible in your language an even shorter version of 'a few seconds ago'
}

export default {
	name: 'NcDateTime',

	props: {
		/**
		 * The timestamp to display, either an unix timestamp (in milliseconds) or a Date object
		 */
		timestamp: {
			type: [Date, Number],
			required: true,
		},
		/**
		 * The format used for displaying, or if relative time is used the format used for the title (optional)
		 *
		 * @type {Intl.DateTimeFormatOptions}
		 */
		format: {
			type: Object,
			default: () => ({ timeStyle: 'medium', dateStyle: 'short' }),
		},
		/**
		 * Wether to display the timestamp as time from now (optional)
		 *
		 * - `false`: Disable relative time
		 * - `'long'`: Long text, like *2 seconds ago* (default)
		 * - `'short'`: Short text, like *2 sec. ago*
		 * - `'narrow'`: Even shorter text (same as `'short'` on some languages)
		 */
		relativeTime: {
			type: [Boolean, String],
			default: 'long',
			validator: (v) => v === false || ['long', 'short', 'narrow'].includes(v),
		},
		/**
		 * Ignore seconds when displaying the relative time and just show `a few seconds ago`
		 */
		ignoreSeconds: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			/** Current time in ms */
			currentTime: Date.now(),
			/** ID of the current time interval */
			intervalId: undefined,
		}
	},

	computed: {
		/** ECMA Date object of the timestamp */
		dateObject() {
			return new Date(this.timestamp)
		},
		/** Time string formatted for main text */
		formattedTime() {
			if (this.relativeTime !== false) {
				const formatter = new Intl.RelativeTimeFormat(getCanonicalLocale(), { numeric: 'auto', style: this.relativeTime })

				const diff = this.dateObject - new Date(this.currentTime)
				const seconds = diff / 1000
				if (Math.abs(seconds) <= 90) {
					if (this.ignoreSeconds) {
						return FEW_SECONDS_AGO[this.relativeTime]
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
			return this.formattedFullTime
		},
		formattedFullTime() {
			const formatter = new Intl.DateTimeFormat(getCanonicalLocale(), this.format)
			return formatter.format(this.dateObject)
		},
	},

	watch: {
		/**
		 * Set or clear interval if relative time is dis/enabled
		 *
		 * @param {boolean} newValue The new value of the relativeTime property
		 * @param {boolean} _oldValue The old value of the relativeTime property
		 */
		relativeTime(newValue, _oldValue) {
			window.clearInterval(this.intervalId)
			this.intervalId = undefined
			if (newValue) {
				this.intervalId = window.setInterval(this.setCurrentTime, 1000)
			}
		},
	},

	mounted() {
		// Start the interval for setting the current time if relative time is enabled
		if (this.relativeTime !== false) {
			this.intervalId = window.setInterval(this.setCurrentTime, 1000)
		}
	},

	unmounted() {
		// ensure interval is cleared
		window.clearInterval(this.intervalId)
	},

	methods: {
		/**
		 * Set `currentTime` to the current timestamp, required as Date.now() is not reactive.
		 */
		setCurrentTime() {
			this.currentTime = Date.now()
		},
	},
}
</script>
