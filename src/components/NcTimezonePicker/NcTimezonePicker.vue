<!--
  - SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Example
```vue
<template>
	<span>
		<NcTimezonePicker v-model="tz" />
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
	<NcSelect
		:aria-label-combobox="t('Search for time zone')"
		:clearable="false"
		:filter-by="filterBy"
		:multiple="false"
		:options="options"
		:placeholder="placeholder"
		:selectable="isSelectable"
		:uid="uid"
		:value="selectedTimezone"
		label="label"
		@option:selected="change" />
</template>

<script>
import { useModelMigration } from '../../composables/useModelMigration.ts'
import { t } from '../../l10n.js'
import GenRandomId from '../../utils/GenRandomId.js'
import NcSelect from '../NcSelect/index.js'
import {
	getReadableTimezoneName,
	getSortedTimezoneList,
} from './timezone.js'
import getTimezoneManager from './timezoneDataProviderService.js'

export default {
	name: 'NcTimezonePicker',
	components: {
		NcSelect,
	},

	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
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
		 * Removed in v9 - use `modelValue` (`v-model`) instead
		 *
		 * @deprecated
		 */
		value: {
			type: String,
			default: undefined,
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

	emits: [
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 *
		 * @deprecated
		 */
		'input',
		/**
		 * Two-way binding of the value prop. Use v-model="selectedTimezone" for two-way binding
		 */
		'update:modelValue',
		/** Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
	],

	setup() {
		const model = useModelMigration('value', 'input')
		return {
			model,
		}
	},

	computed: {
		placeholder() {
			return t('Type to search time zone')
		},

		selectedTimezone() {
			for (const additionalTimezone of this.additionalTimezones) {
				if (additionalTimezone.timezoneId === this.model) {
					return additionalTimezone
				}
			}

			return {
				label: getReadableTimezoneName(this.model),
				timezoneId: this.model,
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
			Object.values(timezoneList).forEach((group) => {
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

			this.model = newValue.timezoneId
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
				return option.regions.some((region) => {
					return this.matchTimezoneId(region.timezoneId, terms)
				})
			}

			// For a region, every search term must be found.
			return this.matchTimezoneId(option.timezoneId, terms)
		},

		matchTimezoneId(timezoneId, terms) {
			return terms.every((term) => timezoneId.toLowerCase().includes(term.toLowerCase()))
		},
	},
}
</script>
