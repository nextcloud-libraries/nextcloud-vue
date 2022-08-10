<!--
  - @copyright Copyright (c) 2021 Christoph Wurst <christoph@winzerhof-wurst.at>
  -
  - @author Christoph Wurst <christoph@winzerhof-wurst.at>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<docs>
### Example
```vue
<template>
	<span>
		<TimezonePicker v-model="tz" />
	</span>
</template>
<script>
export default {
	data() {
		return {
			tz: 'Hawaiian Standard Time',
		}
	},
}
</script>
```
</docs>

<template>
	<Multiselect :value="selectedTimezone"
		:options="options"
		:multiple="false"
		:group-select="false"
		:placeholder="placeholder"
		group-values="regions"
		group-label="continent"
		track-by="timezoneId"
		label="label"
		open-direction="above"
		@input="change" />
</template>

<script>
import {
	getReadableTimezoneName,
	getSortedTimezoneList,
} from './timezone.js'
import getTimezoneManager from './timezoneDataProviderService.js'
import Multiselect from '../Multiselect/index.js'
import { t } from '../../l10n.js'

export default {
	name: 'TimezonePicker',
	components: {
		Multiselect,
	},
	props: {
		/**
		 * An array of additional timezones to include with the standard database. Useful if there is a custom timezone, e.g. read from user data
		 */
		additionalTimezones: {
			type: Array,
			default: () => [],
		},
		/**
		 * The selected timezone. Use v-model for two-way binding. The default timezone is floating, which means a time independent of timezone. See https://icalendar.org/CalDAV-Access-RFC-4791/7-3-date-and-floating-time.html for details.
		 */
		value: {
			type: String,
			default: 'floating',
		},
	},
	emits: ['input'],
	computed: {
		placeholder() {
			return t('Type to search time zone')
		},
		selectedTimezone() {
			for (const additionalTimezone of this.additionalTimezones) {
				if (additionalTimezone.timezoneId === this.value) {
					return additionalTimezone
				}
			}

			return {
				label: getReadableTimezoneName(this.value),
				timezoneId: this.value,
			}
		},
		options() {
			const timezoneManager = getTimezoneManager()
			return getSortedTimezoneList(timezoneManager.listAllTimezones(), this.additionalTimezones)
		},
	},
	methods: {
		change(newValue) {
			if (!newValue) {
				return
			}

			/**
			 * Two-way binding of the value prop. Use v-model="selectedTimezone" for two-way binding
			 */
			this.$emit('input', newValue.timezoneId)
		},
	},
}
</script>

<style lang="scss" scoped>
:deep(.multiselect__tags) {
	border: none !important; // Remove the Multiselect border
}
</style>
