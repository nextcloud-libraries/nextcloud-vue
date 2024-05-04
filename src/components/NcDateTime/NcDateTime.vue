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
	<span
		class="nc-datetime"
		:data-timestamp="timestamp"
		:title="formattedFullTime"
		v-text="formattedTime" />
</template>

<script>
import { computed } from 'vue'
import { useFormatDateTime } from '../../composables/useFormatDateTime.ts'

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

	setup(props) {
		const timestamp = computed(() => props.timestamp)
		const { formattedTime, formattedFullTime } = useFormatDateTime(
			timestamp,
			props,
		)
		return {
			formattedTime,
			formattedFullTime,
		}
	},
}
</script>
