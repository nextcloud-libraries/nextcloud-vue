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
		<NcTimezonePicker v-model="tz" />
		{{ tz }}
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
	<NcSelect :aria-label-combobox="t('Search for time zone')"
		:clearable="false"
		:filter-by="filterBy"
		:model-value="selectedTimezone"
		:multiple="false"
		:options="options"
		:placeholder="placeholder"
		:selectable="isSelectable"
		:uid="uid"
		label="label"
		@option:selected="change" />
</template>

<script>
import {
	getReadableTimezoneName,
	getSortedTimezoneList,
} from './timezone.js'
import getTimezoneManager from './timezoneDataProviderService.js'
import GenRandomId from '../../utils/GenRandomId.js'
import NcSelect from '../NcSelect/index.js'
import { t } from '../../l10n.js'

export default {
	name: 'NcTimezonePicker',
	components: {
		NcSelect,
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
		modelValue: {
			type: String,
			default: 'floating',
		},
		/**
		 * ID of the inner vue-select element, can be used for labels like: `vs-${uid}__combobox`
		 */
		uid: {
			type: [String, Number],
			default: () => `tz-${GenRandomId(5)}`,
		},
	},
	emits: ['update:modelValue'],
	computed: {
		placeholder() {
			return t('Type to search time zone')
		},
		selectedTimezone() {
			for (const additionalTimezone of this.additionalTimezones) {
				if (additionalTimezone.timezoneId === this.modelValue) {
					return additionalTimezone
				}
			}

			return {
				label: getReadableTimezoneName(this.modelValue),
				timezoneId: this.modelValue,
			}
		},
		options() {
			const timezoneManager = getTimezoneManager()
			const timezoneList = getSortedTimezoneList(timezoneManager.listAllTimezones(), this.additionalTimezones)
			/**
			 * Since NcSelect does not support groups,
			 * we create an object with the grouped timezones and continent labels.
			 *
			 * NOTE for now we are removing the grouping from the fields to fix an accessibility issue
			 * in the future, other options can be introduced to better display the different areas
			 */
			let timezonesGrouped = []
			Object.values(timezoneList).forEach(group => {
				// Add an entry as group label
				// timezonesGrouped.push({
				// label: group.continent,
				// timezoneId: `tz-group__${group.continent}`,
				// regions: group.regions,
				// })
				timezonesGrouped = timezonesGrouped.concat(group.regions)
			})
			return timezonesGrouped
		},
	},
	methods: {
		t,

		change(newValue) {
			if (!newValue) {
				return
			}

			/**
			 * Two-way binding of the value prop. Use v-model="selectedTimezone" for two-way binding
			 */
			this.$emit('update:modelValue', newValue.timezoneId)
		},

		/**
		 * Returns whether this is a continent label,
		 * or an actual timezone. Continent labels are not selectable.
		 *
		 * @param {string} option The option
		 * @return {boolean}
		 */
		isSelectable(option) {
			return !option.timezoneId.startsWith('tz-group__')
		},

		/**
		 * Function to filter the timezone list.
		 * We search in the timezoneId, so both continent and region names can be matched.
		 *
		 * @param {object} option The timezone option
		 * @param {string} label The label of the timezone
		 * @param {string} search The search string
		 * @return {boolean}
		 */
		filterBy(option, label, search) {
			// We split the search term in case one searches "<continent> <region>".
			const terms = search.trim().split(' ')

			// For the continent labels, we have to check if one region matches every search term.
			if (option.timezoneId.startsWith('tz-group__')) {
				return option.regions.some(region => {
					return this.matchTimezoneId(region.timezoneId, terms)
				})
			}

			// For a region, every search term must be found.
			return this.matchTimezoneId(option.timezoneId, terms)
		},

		matchTimezoneId(timezoneId, terms) {
			return terms.every(term => timezoneId.toLowerCase().includes(term.toLowerCase()))
		},
	},
}
</script>
