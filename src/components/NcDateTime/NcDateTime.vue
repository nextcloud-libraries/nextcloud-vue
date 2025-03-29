<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
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
		:title="formattedFullTime"
		v-text="formattedTime" />
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { useFormatDateTime } from '../../composables/useFormatDateTime.ts'

const props = withDefaults(defineProps<{
	/**
	 * The timestamp to display, either an unix timestamp (in milliseconds) or a Date object
	 */
	timestamp: Date | number

	/**
	 * The format used for displaying, or if relative time is used the format used for the title (optional)
	 */
	format?: Intl.DateTimeFormatOptions

	/**
	 * Wether to display the timestamp as time from now (optional)
	 *
	 * - `false`: Disable relative time
	 * - `'long'`: Long text, like *2 seconds ago* (default)
	 * - `'short'`: Short text, like *2 sec. ago*
	 * - `'narrow'`: Even shorter text (same as `'short'` on some languages)
	 */
	relativeTime?: false | 'long' | 'short' | 'narrow'

	/**
	 * Ignore seconds when displaying the relative time and just show `a few seconds ago`
	 */
	ignoreSeconds?: boolean
}>(), {
	format: () => ({ timeStyle: 'medium', dateStyle: 'short' }),
	relativeTime: 'long',
})

const {
	formattedTime,
	formattedFullTime,
} = useFormatDateTime(toRef(() => props.timestamp), props)
</script>
