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
import { createElementId } from '../../utils/createElementId.ts'
import { t } from '../../l10n.js'

defineOptions({ inheritAttrs: false })

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

/**
 * The date is – like the `Date` object in JavaScript – tied to UTC.
 * The selected time zone does not have an influence of the selected time and date value.
 * You have to translate the time yourself when you want to factor in time zones.
 * Pass null to clear the input field.
 */
const modelValue = defineModel<Date | null>({ default: null })

const formattedValue = computed(() => modelValue.value ? formatValue(modelValue.value) : '')
const formattedMax = computed(() => props.max ? formatValue(props.max) : undefined)
const formattedMin = computed(() => props.min ? formatValue(props.min) : undefined)

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
 * Handle the input event
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
	<div class="native-datetime-picker" :class="$props.class">
		<label class="native-datetime-picker__label"
			:class="{ 'hidden-visually': hideLabel }"
			:for="id">
			{{ label }}
		</label>
		<input :id
			class="native-datetime-picker__input"
			:class="inputClass"
			:type
			:value="formattedValue"
			:min="formattedMin"
			:max="formattedMax"
			v-bind="$attrs"
			@input="onInput">
	</div>
</template>

<style lang="scss" scoped>
.native-datetime-picker {
	display: flex;
	flex-direction: column;

	.native-datetime-picker__label {
		margin-block-end: 2px;
	}

	.native-datetime-picker__input {
		// If border width differs between focused and unfocused we need to compensate to prevent jumping
		--input-border-width-offset: calc(var(--border-width-input-focused, 2px) - var(--border-width-input, 2px));
		width: 100%;
		flex: 0 0 auto;
		margin: 0;
		padding-inline-start: calc(var(--border-radius-large) + var(--input-border-width-offset));
		padding-inline-end: calc(var(--default-grid-baseline) + var(--input-border-width-offset));
		border: var(--border-width-input, 2px) solid var(--color-border-maxcontrast);

		&:active:not([disabled]),
		&:hover:not([disabled]),
		&:focus:not([disabled]),
		&:focus-within:not([disabled]) {
			border-color: var(--color-main-text);
			border-width: var(--border-width-input-focused, 2px);
			box-shadow: 0 0 0 2px var(--color-main-background) !important;
			// Reset padding offset when focused
			--input-border-width-offset: 0px;
		}
	}
}

[data-theme-light],
[data-themes*=light] {
	.native-datetime-picker__input {
		color-scheme: light;
	}
}

[data-theme-dark],
[data-themes*=dark] {
	.native-datetime-picker__input {
		color-scheme: dark;
	}
}

[data-theme-default],
[data-themes*=default] {
	@media (prefers-color-scheme: light) {
		.native-datetime-picker__input {
			color-scheme: light;
		}
	}
	@media (prefers-color-scheme: dark) {
		.native-datetime-picker__input {
			color-scheme: dark;
		}
	}
}
</style>
