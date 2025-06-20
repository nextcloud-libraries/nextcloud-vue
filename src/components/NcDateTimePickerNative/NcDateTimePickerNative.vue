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

<template>
	<div class="native-datetime-picker">
		<label class="native-datetime-picker--label"
			:class="{ 'hidden-visually': hideLabel }"
			:for="id">
			{{ label }}
		</label>
		<input :id="id"
			class="native-datetime-picker--input"
			:class="inputClass"
			:type="type"
			:value="formattedValue"
			:min="formattedMin"
			:max="formattedMax"
			v-bind="$attrs"
			@input="onInput">
	</div>
</template>

<script>
import { defineComponent } from 'vue'
import { createElementId } from '../../utils/createElementId.js'

const inputDateTypes = ['date', 'datetime-local', 'month', 'time', 'week']

export default defineComponent({
	name: 'NcDateTimePickerNative',
	inheritAttrs: false,

	props: {
		/**
		 * The date is – like the `Date` object in JavaScript – tied to UTC.
		 * The selected time zone does not have an influence of the selected time and date value.
		 * You have to translate the time yourself when you want to factor in time zones.
		 * Pass null to clear the input field.
		 */
		modelValue: {
			type: Date,
			default: null,
		},

		/**
		 * id attribute of the input field
		 */
		id: {
			type: String,
			default: () => createElementId(),
			validator: id => id.trim() !== '',
		},
		/**
		 * type attribute of the input field
		 * default type: String
		 * The type of the input element, it can be `date`, `datetime-local`, `month`, `time`, `week`
		 */
		type: {
			type: String,
			default: 'date',
			validate: (name) => inputDateTypes.includes(name),
		},
		/**
		 * text inside the label element
		 * default type: String
		 */
		label: {
			type: String,
			default: 'Please choose a date',
		},
		/**
		 * min attribute of the input field
		 * default type: null
		 */
		min: {
			type: [Date, Boolean],
			default: null,
		},
		/**
		 * max attribute of the input field
		 * default type: null
		 */
		max: {
			type: [Date, Boolean],
			default: null,
		},
		/**
		 * Flag to hide the label
		 * default type: String
		 * The hidden input label for accessibility purposes.
		 */
		hideLabel: {
			type: Boolean,
			default: false,
		},
		/**
		 * Class to add to the input field.
		 * Necessary to use NcDateTimePickerNative in the NcActionInput component.
		 */
		inputClass: {
			type: [Object, String],
			default: '',
		},
	},

	emits: [
		'update:modelValue',
	],

	computed: {
		formattedValue() {
			return this.formatValue(this.modelValue)
		},
		formattedMin() {
			if (this.min) {
				return this.formatValue(this.min)
			}
			return false
		},
		formattedMax() {
			if (this.max) {
				return this.formatValue(this.max)
			}
			return false
		},
	},

	methods: {
		/**
		 * Handle the input event
		 *
		 * @param {InputEvent} $event input event payload
		 * @return {Date|null} new chosen Date() or null
		 */
		onInput($event) {
			if (isNaN($event.target.valueAsNumber)) {
				/**
				 * Emitted when the input value changes
				 *
				 * @return {null} null value
				 */
				return this.$emit('update:modelValue', null)
			}
			if (this.type === 'time') {
				const time = $event.target.value
				if (this.modelValue === '' || this.modelValue === null) {
					// this case is because of Chrome bug
					const { yyyy, MM, dd } = this.getReadableDate(new Date())
					/**
					 * Emitted when the input value changes
					 *
					 * @return {Date} new chosen Date()
					 */
					return this.$emit('update:modelValue', new Date(`${yyyy}-${MM}-${dd}T${time}`))
				}
				const { yyyy, MM, dd } = this.getReadableDate(this.modelValue)
				/**
				 * Emitted when the input value changes
				 *
				 * @return {Date} new chosen Date()
				 */
				return this.$emit('update:modelValue', new Date(`${yyyy}-${MM}-${dd}T${time}`))
			} else if (this.type === 'month') {
				const MM = (new Date($event.target.value).getMonth() + 1).toString().padStart(2, '0')
				if (this.modelValue === '' || this.modelValue === null) {
					const { yyyy, dd, hh, mm } = this.getReadableDate(new Date())
					/**
					 * Emitted when the input value changes
					 *
					 * @return {Date} new chosen Date()
					 */
					return this.$emit('update:modelValue', new Date(`${yyyy}-${MM}-${dd}T${hh}:${mm}`))
				}
				const { yyyy, dd, hh, mm } = this.getReadableDate(this.modelValue)
				/**
				 * Emitted when the input value changes
				 *
				 * @return {Date} new chosen Date()
				 */
				return this.$emit('update:modelValue', new Date(`${yyyy}-${MM}-${dd}T${hh}:${mm}`))
			}
			const timezoneOffsetSeconds = new Date($event.target.valueAsNumber).getTimezoneOffset() * 1000 * 60
			const inputDateWithTimezone = $event.target.valueAsNumber + timezoneOffsetSeconds
			/**
			 * Emitted when the input value changes
			 *
			 * @return {Date} new chosen Date()
			 */
			return this.$emit('update:modelValue', new Date(inputDateWithTimezone))
		},
		/**
		 * Returns Object with string values of a Date
		 *
		 * @param {Date} value The selected value
		 * @return {object|undefined}
		 */
		getReadableDate(value) {
			if (value instanceof Date) {
				const yyyy = value.getFullYear().toString().padStart(4, '0')
				const MM = (value.getMonth() + 1).toString().padStart(2, '0')
				const dd = value.getDate().toString().padStart(2, '0')
				const hh = value.getHours().toString().padStart(2, '0')
				const mm = value.getMinutes().toString().padStart(2, '0')

				return { yyyy, MM, dd, hh, mm }
			}
		},
		/**
		 * Returns preformatted value for the input field
		 *
		 * @param {Date} value The selected value
		 * @return {string|undefined}
		 */
		formatValue(value) {
			if (value instanceof Date) {
				const { yyyy, MM, dd, hh, mm } = this.getReadableDate(value)
				if (this.type === 'datetime-local') {
					return `${yyyy}-${MM}-${dd}T${hh}:${mm}`
				} else if (this.type === 'date') {
					return `${yyyy}-${MM}-${dd}`
				} else if (this.type === 'month') {
					return `${yyyy}-${MM}`
				} else if (this.type === 'time') {
					return `${hh}:${mm}`
				} else if (this.type === 'week') {
					const startDate = new Date(yyyy, 0, 1)
					const daysSinceBeginningOfYear = Math.floor((value - startDate)
						/ (24 * 60 * 60 * 1000))
					const weekNumber = Math.ceil(daysSinceBeginningOfYear / 7)
					return `${yyyy}-W${weekNumber}`
				}
			} else {
				return ''
			}
		},
	},
})
</script>

<style lang="scss" scoped>
	.native-datetime-picker {
		display: flex;
		flex-direction: column;
	}

	.native-datetime-picker .native-datetime-picker--label {
		margin-block-end: 2px;
	}

	.native-datetime-picker .native-datetime-picker--input {
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

	[data-theme-light],
	[data-themes*=light] {
		.native-datetime-picker--input {
			color-scheme: light;
		}
	}

	[data-theme-dark],
	[data-themes*=dark] {
		.native-datetime-picker--input {
			color-scheme: dark;
		}
	}

	[data-theme-default],
	[data-themes*=default] {
		@media (prefers-color-scheme: light) {
			.native-datetime-picker--input {
				color-scheme: light;
			}
		}
		@media (prefers-color-scheme: dark) {
			.native-datetime-picker--input {
				color-scheme: dark;
			}
		}
	}
</style>
