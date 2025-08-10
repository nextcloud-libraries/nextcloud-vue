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
import { getCanonicalLocale } from '@nextcloud/l10n'
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
		offset: 0,
		localeOffset: '',
		time: '',
	}))
})

const options = computed(() => {
	const timezones = getTimezones()
	const now = new Date()
	console.time('Adding current time to timezones')
	const result = timezones.map((option) => ({
		...option,
		time: now.toLocaleString(getCanonicalLocale(), { timeZone: option.timezoneId, hour: '2-digit', minute: '2-digit' }),
	}))
	console.timeEnd('Adding current time to timezones')
	result.unshift(...formattedAdditionalTimezones.value)
	return result
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

// Getting all the timezones with the current user language takes around 250ms on the first run
// To prevent the lag on the first open, calculating them in an idle callback
// TODO: maybe it is better to load it on open? More laggy, but doesn't load the page when not needed
requestIdleCallback(() => {
	getTimezones()
})
</script>

<template>
	<NcSelect
		v-model="modelValue"
		:aria-label-combobox="t('Search for timezone')"
		:clearable="false"
		:filter-by
		:multiple="false"
		:options
		:placeholder="t('Type to search time zone')"
		:uid
		:reduce="(option) => option.timezoneId"
		label="label">
		<template #option="option">
			<span :class="$style.timezoneOption">
				<span :class="$style.timezoneOption__row">
					<span>{{ option.label }}</span>
					<span :class="$style.timezoneOption__time">{{ option.time }}</span>
				</span>
				<span :class="[$style.timezoneOption__row, $style.timezoneOption__subline]">
					<span :class="$style.timezoneOption__id">{{ option.timezoneId }}</span>
					<span :class="$style.timezoneOption__offset">{{ option.localeOffset }}</span>
				</span>
			</span>
		</template>
	</NcSelect>
</template>

<style lang="scss" module>
/* Dirty hack to override the padding of vue-select options */
li:has(> .timezoneOption) {
	padding: calc(1 * var(--default-grid-baseline));
}

.timezoneOption {
	display: flex;
	flex-direction: column;
	white-space: break-spaces;
}

.timezoneOption__row {
	display: flex;
	justify-content: space-between;
	gap: calc(1 * var(--default-grid-baseline));
}

.timezoneOption__subline {
	color: var(--color-text-maxcontrast);
	font-size: var(--font-size-small, 13px);
}

.timezoneOption__offset,
.timezoneOption__time {
	white-space: nowrap;
}

.timezoneOption__time {
	font-size: var(--font-size-small, 13px);
}

.timezoneOption__id {
	/* Timezone ID can be long without spaces, like America/North_Dakota/New_Salem */
	overflow-wrap: anywhere;
}
</style>
