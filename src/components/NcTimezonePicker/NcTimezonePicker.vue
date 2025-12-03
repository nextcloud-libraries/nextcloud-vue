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
			tz: 'Europe/Berlin',
		}
	},
}
</script>
```
</docs>

<script setup lang="ts">
import { computed } from 'vue'
import NcSelect from '../NcSelect/NcSelect.vue'
import { t } from '../../l10n.ts'
import { createElementId } from '../../utils/createElementId.ts'
import { getTimezones } from './timezoneUtils.ts'

export type ITimezone = {
	/**
	 * Time zone ID in IANA format, e.g. "Europe/Berlin", or "floating" for a time independent of timezone, or a custom timezone ID
	 */
	timezoneId: string
	/**
	 * Localized label of the timezone, e.g. "Central European Standard Time"
	 */
	label: string
	/**
	 * Continent the timezone if any, e.g. "Europe" (not localized)
	 */
	continent: string
}

/**
 * The selected timezone.
 * Use v-model for two-way binding.
 * The default timezone is floating, which means a time independent of timezone. See https://icalendar.org/CalDAV-Access-RFC-4791/7-3-date-and-floating-time.html for details.
 */
const modelValue = defineModel<string>({ default: 'floating' })

const props = withDefaults(defineProps<{
	/**
	 * An array of additional timezones to include with the standard database. Useful if there is a custom timezone, e.g. read from user data
	 */
	additionalTimezones?: ITimezone[]

	/**
	 * ID of the inner vue-select element, can be used for labels like: `vs-${uid}__combobox`
	 */
	uid?: string
}>(), {
	additionalTimezones: () => [],
	uid: createElementId(),
})

const formattedAdditionalTimezones = computed(() => {
	return props.additionalTimezones.map(({ timezoneId, label }) => ({
		timezoneId,
		label,
	}))
})

const options = computed(() => {
	const timezones = getTimezones()
	timezones.unshift(...formattedAdditionalTimezones.value)
	return timezones
})

/**
 * NcSelect's filterBy prop to search timezone by any option property
 *
 * @param option - The timezone option
 * @param label - The label of the timezone
 * @param search - The search string
 */
function filterBy(option: ITimezone, label: string, search: string): boolean {
	const terms = search.trim().split(/\s+/)
	const values = Object.values(option)
	return terms.every((term) => {
		return values.some((value) => value.toLowerCase().includes(term.toLowerCase()))
	})
}
</script>

<template>
	<NcSelect
		v-model="modelValue"
		:aria-label-combobox="t('Search for time zone')"
		:clearable="false"
		:filter-by
		:multiple="false"
		:options
		:placeholder="t('Type to search time zone')"
		:uid
		:reduce="(option) => option.timezoneId"
		label="label" />
</template>
