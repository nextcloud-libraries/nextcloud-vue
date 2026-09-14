<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description

This components provides a wrapper around the native browser datetime picker. <br>
This is an input with some type of date e.g. https://html.spec.whatwg.org/multipage/input.html#local-date-and-time-state-(type=datetime-local). <br>
All available types are: 'date', 'datetime-local', 'month', 'time' and 'week', please check them here: https://html.spec.whatwg.org/multipage/input.html#  <br>

### Examples

```vue
<template>
	<div>
		<span>Picked date: {{ value || 'null' }}</span>
		<hr/>
		<div class="flex">
			<NcSelect v-bind="props" v-model="type" />
			<NcDateTimePickerNative
				v-model="value"
				:label="label"
				:type="type" />
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				props: {
					clearable: false,
					inputLabel: 'Picker type',
					options: [
						'date',
						'datetime-local',
						'month',
						'time',
						'week',
					],
				},
				type: 'datetime-local',
				value: new Date(),
				label: 'Select a new date or time',
			}
		},
	}
</script>
<style scoped>
.flex {
	display: flex;
	gap: 4px;
}
</style>
```

#### Usage: type='datetime-local' with min date and max date
```vue
<template>
	<div>
		<span>Picked date: {{ value || 'null' }}</span>
		<NcDateTimePickerNative
			v-model="value"
			:min="yesterdayDate"
			:max="someDate"
			:label="label"
			type="datetime-local" />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				value: new Date(),
				label: 'Please select a new date',
				yesterdayDate: new Date(new Date().setDate(new Date().getDate() - 1)),
				someDate: new Date(new Date().setDate(new Date().getDate() + 7)),
			}
		},
	}
</script>
```

</docs>

<script setup lang="ts">
import type { VueClassType } from '../../utils/VueTypes.ts'

import { computed } from 'vue'
import NcInputField from '../NcInputField/NcInputField.vue'
import { t } from '../../l10n.ts'
import { createElementId } from '../../utils/createElementId.ts'

defineOptions({ inheritAttrs: false })

/**
 * The selected value is interpreted in the browser's local timezone.
 * The component converts between the native input value and a JavaScript
 * `Date` using that local timezone context.
 * If your app needs to work in a specific timezone other than the
 * browser's local one (for example UTC or an IANA timezone), you
 * must convert the value yourself.
 *
 * For example, serializing the resulting `Date` with `toISOString()`
 * will produce the corresponding UTC timestamp.
 *
 * Pass null to clear the input field.
 */
const modelValue = defineModel<Date | null>({ default: null })

const props = withDefaults(defineProps<{
	/**
	 * HTML class of the element
	 */
	class?: VueClassType

	/**
	 * ID of the input element
	 */
	id?: string

	/**
	 * Class to add to the input field.
	 * Necessary to use NcDateTimePickerNative in the NcActionInput component.
	 */
	inputClass?: VueClassType

	/**
	 * type attribute of the input field
	 * default type: String
	 * The type of the input element, it can be `date`, `datetime-local`, `month`, `time`, `week`
	 */
	type?: 'date' | 'datetime-local' | 'month' | 'time' | 'week'

	/**
	 * Visual label of the input
	 */
	label?: string

	/**
	 * min attribute of the input field
	 */
	min?: Date | null

	/**
	 * max attribute of the input field
	 */
	max?: Date | null

	/**
	 * Flag to hide the label.
	 * The hidden input label for accessibility purposes.
	 */
	hideLabel?: boolean
}>(), {
	class: undefined,
	id: () => createElementId(),
	inputClass: '',
	label: () => t('Please choose a date'),
	max: null,
	min: null,
	modelValue: null,
	type: 'date',
})

const formattedValue = computed(() => modelValue.value ? formatValue(modelValue.value) : '')
const formattedMax = computed(() => props.max ? formatValue(props.max) : undefined)
const formattedMin = computed(() => props.min ? formatValue(props.min) : undefined)

// Forward the props NcInputField owns (class, id, inputClass, type, …). label,
// min and max are handled explicitly in the template as they need transforming.
const ncInputFieldPropNames = new Set(Object.keys(NcInputField.props))
const propsToForward = computed(() => Object.fromEntries(Object.entries(props).filter(([key]) => ncInputFieldPropNames.has(key))))

/**
 * Returns Object with string values of a Date
 *
 * @param value - The selected value
 */
function getReadableDate(value: Date) {
	const yyyy = value.getFullYear().toString().padStart(4, '0')
	const MM = (value.getMonth() + 1).toString().padStart(2, '0')
	const dd = value.getDate().toString().padStart(2, '0')
	const hh = value.getHours().toString().padStart(2, '0')
	const mm = value.getMinutes().toString().padStart(2, '0')

	return { yyyy, MM, dd, hh, mm }
}

/**
 * Returns preformatted value for the input field
 *
 * @param value - The selected value
 */
function formatValue(value: Date): string {
	const { yyyy, MM, dd, hh, mm } = getReadableDate(value)
	if (props.type === 'datetime-local') {
		return `${yyyy}-${MM}-${dd}T${hh}:${mm}`
	} else if (props.type === 'date') {
		return `${yyyy}-${MM}-${dd}`
	} else if (props.type === 'month') {
		return `${yyyy}-${MM}`
	} else if (props.type === 'time') {
		return `${hh}:${mm}`
	} else if (props.type === 'week') {
		const startDate = new Date(Number.parseInt(yyyy), 0, 1)
		const daysSinceBeginningOfYear = Math.floor((value.getTime() - startDate.getTime())
			/ (24 * 60 * 60 * 1000))
		const weekNumber = Math.ceil(daysSinceBeginningOfYear / 7)
		return `${yyyy}-W${weekNumber}`
	}
	return ''
}

/**
 * Handle the input event.
 *
 * The component renders through NcInputField for a visually identical design.
 * The `@input` listener is merged onto NcInputField's inner <input> via $attrs,
 * so this receives the native event and keeps access to `valueAsNumber`.
 *
 * @param event - The input event payload
 */
function onInput(event: Event): void {
	const input = event.target as HTMLInputElement
	if (!input || isNaN(input.valueAsNumber)) {
		modelValue.value = null
	} else if (props.type === 'time') {
		const time = input.value

		const { yyyy, MM, dd } = getReadableDate(modelValue.value || new Date())
		modelValue.value = new Date(`${yyyy}-${MM}-${dd}T${time}`)
	} else if (props.type === 'month') {
		const MM = (new Date(input.value).getMonth() + 1).toString().padStart(2, '0')
		const { yyyy, dd, hh, mm } = getReadableDate(modelValue.value || new Date())
		modelValue.value = new Date(`${yyyy}-${MM}-${dd}T${hh}:${mm}`)
	} else {
		const timezoneOffsetSeconds = new Date(input.valueAsNumber).getTimezoneOffset() * 1000 * 60
		const inputDateWithTimezone = input.valueAsNumber + timezoneOffsetSeconds
		modelValue.value = new Date(inputDateWithTimezone)
	}
}
</script>

<template>
	<NcInputField
		v-bind="{ ...$attrs, ...propsToForward }"
		class="native-datetime-picker"
		:label="hideLabel ? undefined : label"
		:labelOutside="hideLabel"
		:aria-label="hideLabel ? label : undefined"
		:modelValue="formattedValue"
		:min="formattedMin"
		:max="formattedMax"
		@input="onInput" />
</template>

<style lang="scss" scoped>
// NcInputField provides the full visual design (border, height, radius, floating
// label). We only add native-picker color-scheme theming so the browser renders
// the calendar/clock popover matching the active Nextcloud theme.
// `.native-datetime-picker` is applied to NcInputField's inner <input> via $attrs.
[data-theme-light],
[data-themes*=light] {
	:deep(.native-datetime-picker) {
		color-scheme: light;
	}
}

[data-theme-dark],
[data-themes*=dark] {
	:deep(.native-datetime-picker) {
		color-scheme: dark;
	}
}

[data-theme-default],
[data-themes*=default] {
	@media (prefers-color-scheme: light) {
		:deep(.native-datetime-picker) {
			color-scheme: light;
		}
	}
	@media (prefers-color-scheme: dark) {
		:deep(.native-datetime-picker) {
			color-scheme: dark;
		}
	}
}
</style>
