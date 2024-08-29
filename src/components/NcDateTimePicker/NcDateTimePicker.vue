<!--
  - SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
> We're wrapping the awesome datepicker library [@vuepic/vue-datepicker](https://vue3datepicker.com/)
> Please check there for all the available options.

### Defaults
- cleareable: false
- minute-step: 10

### Example
```vue
<template>
	<span>
		<NcDateTimePicker
			v-model="time"
			type="datetime" />
		{{ time }}
	</span>
</template>
<script>
export default {
	data() {
		return {
			time: new Date('2022-10-10 10:10:10'),
		}
	},
}
</script>
```

### Example with confirm button
```vue
<template>
	<span>
		<NcDateTimePicker
			v-model="time"
			type="datetime"
			confirm />
		{{ time }}
	</span>
</template>
<script>
	export default {
		data() {
			return {
				time: null,
			}
		},
	}
</script>
```

### Range picker
```vue
<template>
	<span>
		<NcDateTimePicker
			v-model="time"
			range
			type="date" />
		{{ time }}
	</span>
</template>
<script>
export default {
	data() {
		return {
			time: null,
		}
	},
}
</script>
```

### Time zone aware date picker

The datepicker can optionally include a picker for the preferred time zone. The selected time does not factor in the
picked time zone, but you will have to convert it yourself when necessary.

```vue
<template>
	<span>
		<NcDateTimePicker
			v-model="time"
			type="datetime"
			:show-timezone-select="true"
			v-model:timezone-id="tz" /><br>
		{{ time }} | {{ tz }}
	</span>
</template>
<script>
export default {
	data() {
		return {
			time: undefined,
			tz: 'Europe/Berlin',
		}
	},
}
</script>
```
</docs>

<template>
	<DatePicker ref="datepicker"
		v-model="internalValue"
		:auto-apply="autoApply"
		:clearable="clearable"
		:locale="userLanguage"
		:placeholder="placeholder ?? defaultPlaceholder"
		:six-weeks="sixWeeks"
		:week-start="firstDayOfWeek"
		v-bind="{ ...localizedLabels, ...legacyFallbacks() }">
		<template #input-icon>
			<NcIconSvgWrapper :class="$style.icon" :path="mdiCalendarBlank" />
		</template>
		<template #calendar-icon>
			<NcIconSvgWrapper :class="$style.icon" :path="mdiCalendarBlank" />
		</template>
		<template #clear-icon>
			<NcIconSvgWrapper :class="$style.icon" :path="mdiClose" />
		</template>
		<template #clock-icon>
			<NcIconSvgWrapper :class="$style.icon" :path="mdiClock" />
		</template>
		<template #arrow-left>
			<NcIconSvgWrapper :class="$style.icon" :path="mdiArrowLeft" />
		</template>
		<template #arrow-right>
			<NcIconSvgWrapper :class="$style.icon" :path="mdiArrowRight" />
		</template>
		<template #arrow-up>
			<NcIconSvgWrapper :class="$style.icon" :path="mdiArrowUp" />
		</template>
		<template #arrow-down>
			<NcIconSvgWrapper :class="$style.icon" :path="mdiArrowDown" />
		</template>
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</DatePicker>
</template>

<script setup lang="ts">
import type { NcDateTimePickerEmits, NcDateTimePickerProps } from './types.js'
import type { VueDatePickerProps } from '@vuepic/vue-datepicker'

import {
	getFirstDay,
	getCanonicalLocale,
	getDayNamesMin,
} from '@nextcloud/l10n'
import { t } from '../../l10n.js'
import DatePicker from '@vuepic/vue-datepicker'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { mdiArrowDown, mdiArrowLeft, mdiArrowRight, mdiArrowUp, mdiCalendarBlank, mdiClock, mdiClose } from '@mdi/js'
import { useAttrs } from 'vue'

import '@vuepic/vue-datepicker/dist/main.css'

defineEmits<NcDateTimePickerEmits>()

const props = withDefaults(
	defineProps<NcDateTimePickerProps>(),
	{
		clearable: false,
		sixWeeks: 'fair',
	},
)

const firstDayOfWeek = getFirstDay() as 0|1|2|3|4|5|6
/**
 * Is is called locale on the component, but it is used for translating names.
 * Language -> text
 * Locale -> formatting
 */
const userLanguage = getCanonicalLocale()

const defaultPlaceholder = ''
const internalValue = defineModel<Date>()

// const timezoneDialogHeaderId = `timezone-dialog-header-${getRandomId()}`

// const showTimezonePopover = ref(false)
// const tzVa = ref(props.timezoneId)

const attrs = useAttrs()

/**
 * Set legacy fallbacks for deprecated props.
 * This translates props that were exposed with `@nextcloud/vue` v8 to `@vuepic/vue-datepicker` props.
 *
 * All of those props are deprecated, so:
 * @todo Remove this v10
 */
const legacyFallbacks = (): Partial<VueDatePickerProps> => {
	return {
		partialFlow: attrs.partialFlow ?? props.autoApply,
		teleport: props.appendToBody || attrs.teleport,
		minutesIncrement: attrs.minutesIncrement || props.minuteStep,
		minutesGridIncrement: attrs.minutesGridIncrement || props.minuteStep,
		weekNumbers: attrs.weekNumbers || (props.showWeekNumber ? { type: 'iso' } : null),
	} as Partial<VueDatePickerProps>
}

const localizedLabels = {
	// TRANSLATOR: Like in "Pick a date"
	selectText: t('Pick'),

	cancelText: t('Cancel'),

	// TRANSLATORS: Shown to pick the current date or current time
	nowButtonLabel: t('Now'),

	// TRANSLATORS: The abbreviation shown for "Week number" on a table header
	weekNumName: t('W'),

	dayNames: getDayNamesMin(),

	/*ariaLabels: {
		
	} as VueDatePickerProps['ariaLabels'],*/
}
</script>

<style module lang="scss">
.icon span {
	opacity: 1;
	display: inherit;
}
</style>

<style lang="scss">
// We overwrite the popover base class, so we can style
// the popover for the timezone select only.
.v-popper--theme-dropdown.v-popper__popper.timezone-select__popper .v-popper__wrapper {
	border-radius: var(--border-radius-large);

	.v-popper__inner {
		padding: 4px;
		border-radius: var(--border-radius-large);

		.timezone-popover-wrapper {
			&__label {
				padding: 4px 0;
				padding-left: 14px; // Left-align with NcSelect text
			}

			// We overwrite the border radius of the input to account for the popover border-radius minus the padding
			&__timezone-select.v-select {
				.vs__dropdown-toggle {
					border-radius: calc(var(--border-radius-large) - 4px);
				}

				&.vs--open {
					.vs__dropdown-toggle {
						border-bottom-left-radius: 0;
						border-bottom-right-radius: 0;
					}
					&.select--drop-up .vs__dropdown-toggle {
						border-radius: 0 0 calc(var(--border-radius-large) - 4px) calc(var(--border-radius-large) - 4px);
					}
				}
			}
		}
	}
}

// TODO: This should be scoped or targeted by a specific selector, but the NcSelect component does not allow this yet.
.vs__dropdown-menu--floating {
	// Higher z-index than the popover in which the NcSelect is located.
	z-index: 100001 !important;
}
</style>
