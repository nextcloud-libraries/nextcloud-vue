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
import { useModelMigration } from '../../composables/useModelMigration.ts'
import { t } from '../../l10n.js'
import { createElementId } from '../../utils/createElementId.ts'
import NcSelect from '../NcSelect/index.js'
import { getTimezones } from './timezoneUtils.ts'

type ITimezone = {
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
		v-model="model"
		:aria-label-combobox="t('Search for time zone')"
		:clearable="false"
		:filter-by="filterBy"
		:multiple="false"
		:options="options"
		:placeholder="t('Type to search time zone')"
		:uid="uid"
		:reduce="(option) => option.timezoneId"
		label="label" />
</template>
