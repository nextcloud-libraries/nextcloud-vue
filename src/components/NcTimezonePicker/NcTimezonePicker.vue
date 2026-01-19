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

<script setup lang="ts">
import type {
	IContinent,
	IRegion,
	ITimezone,
} from '@nextcloud/timezones'

import {
	getReadableTimezoneName,
	getSortedTimezoneList,
} from '@nextcloud/timezones'
import { computed } from 'vue'
import { useModelMigration } from '../../composables/useModelMigration.ts'
import { t } from '../../l10n.js'
import { createElementId } from '../../utils/createElementId.ts'
import NcSelect from '../NcSelect/index.js'
import getTimezoneManager from './timezoneDataProviderService.ts'

const props = withDefaults(defineProps<{
	/**
	 * An array of additional timezones to include with the standard database. Useful if there is a custom timezone, e.g. read from user data
	 */
	additionalTimezones?: ITimezone[]
	/**
	 * Removed in v9 - use `modelValue` (`v-model`) instead
	 *
	 * @deprecated
	 */
	value?: string
	/**
	 * The selected timezone. Use v-model for two-way binding. The default timezone is floating, which means a time independent of timezone. See https://icalendar.org/CalDAV-Access-RFC-4791/7-3-date-and-floating-time.html for details.
	 */
	modelValue?: string
	/**
	 * ID of the inner vue-select element, can be used for labels like: `vs-${uid}__combobox`
	 */
	uid?: string
}>(), {
	additionalTimezones: () => [],
	value: undefined,
	modelValue: 'floating',
	uid: createElementId(),
})

defineEmits<{
	/**
	 * Removed in v9 - use `update:modelValue` (`v-model`) instead
	 *
	 * @deprecated
	 */
	(event: 'input', value: string): void
	/**
	 * Two-way binding of the value prop. Use v-model="selectedTimezone" for two-way binding
	 */
	(event: 'update:modelValue', value: string): void
	/** Same as update:modelValue for Vue 2 compatibility */
	(event: 'update:model-value', value: string): void
}>()

/**
 * The selected timezone.
 * Use v-model for two-way binding.
 * The default timezone is floating, which means a time independent of timezone. See https://icalendar.org/CalDAV-Access-RFC-4791/7-3-date-and-floating-time.html for details.
 */
const model = useModelMigration<string>('value', 'input')

const selectedTimezone = computed({
	set(timezone: IRegion) {
		model.value = timezone.timezoneId
	},
	get(): IRegion {
		for (const additionalTimezone of props.additionalTimezones) {
			if (additionalTimezone.timezoneId === model.value) {
				return {
					cities: [],
					...additionalTimezone,
				}
			}
		}

		return {
			label: getReadableTimezoneName(model.value),
			timezoneId: model.value,
			cities: [],
		}
	},
})

const options = computed(() => {
	const timezoneManager = getTimezoneManager()
	const timezoneList: IContinent[] = getSortedTimezoneList(
		timezoneManager.listAllTimezones(),
		props.additionalTimezones,
		t('Global'), // TRANSLATORS: This refers to global timezones in the timezone picker
	)
	/**
	 * Since NcSelect does not support groups,
	 * we create an object with the grouped timezones and continent labels.
	 *
	 * NOTE for now we are removing the grouping from the fields to fix an accessibility issue
	 * in the future, other options can be introduced to better display the different areas
	 */
	const timezonesGrouped: IRegion[] = []
	for (const group of Object.values(timezoneList)) {
		// Add an entry as group label
		// const continent = `tz-group__${group.continent}`
		// timezonesGrouped.push({
		// label: group.continent,
		// continent,
		// timezoneId: continent,
		// regions: group.regions,
		// })
		timezonesGrouped.push(...group.regions)
	}
	return timezonesGrouped
})

/**
 * Returns whether this is a continent label,
 * or an actual timezone. Continent labels are not selectable.
 *
 * @param option The option
 */
function isSelectable(option: IRegion): boolean {
	return !option.timezoneId.startsWith('tz-group__')
}

/**
 * Function to filter the timezone list.
 * We search in the timezoneId, so both continent and region names can be matched.
 *
 * @param option - The timezone option
 * @param label - The label of the timezone
 * @param search - The search string
 */
function filterBy(option: IContinent | IRegion, label: string, search: string): boolean {
	// We split the search term in case one searches "<continent> <region>".
	const terms = search.trim().split(' ')

	// For the continent labels, we have to check if one region matches every search term.
	if ('continent' in option) {
		return option.regions.some((region) => {
			return matchTimezoneId(region.timezoneId, terms)
		})
	}

	// For a region, every search term must be found.
	return matchTimezoneId(option.timezoneId, terms)
}

/**
 * @param timezoneId - The timezone id to check
 * @param terms - Terms to validate
 */
function matchTimezoneId(timezoneId: string, terms: string[]): boolean {
	return terms.every((term) => timezoneId.toLowerCase().includes(term.toLowerCase()))
}
</script>

<template>
	<NcSelect
		v-model="selectedTimezone"
		:aria-label-combobox="t('Search for time zone')"
		:clearable="false"
		:filter-by="filterBy"
		:multiple="false"
		:options="options"
		:placeholder="t('Type to search time zone')"
		:selectable="isSelectable"
		:uid="uid"
		label="label" />
</template>
