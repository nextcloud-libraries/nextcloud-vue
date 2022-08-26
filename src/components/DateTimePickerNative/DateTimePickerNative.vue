<!--
  - @copyright Copyright (c) 2022 Julia Kirschenheuter <julia.kirschenheuter@nextcloud.com>
  -
  - @author Julia Kirschenheuter <julia.kirschenheuter@nextcloud.com>
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
> We're wrapping the awesome native browser datepicker as an input with some type of date e.g. https://html.spec.whatwg.org/multipage/input.html#local-date-and-time-state-(type=datetime-local)
> Please check there for all the available options: https://html.spec.whatwg.org/multipage/input.html#
> All available types are: 'date', 'datetime-local', 'month', 'time' and 'week'.

### Example: datetime-local
```vue
<template>
	<span>
		<DateTimePickerNative
			v-model="value"
			:label="label"
			type="datetime-local" />
	</span>
</template>
<script>
	export default {
		data() {
			return {
				value: new Date(),
				label: 'please select a new date'
			}
		},
	}
</script>
```

</docs>

<template>
	<div class="native-datetime-picker">
		<label :class="{ 'hidden-visually': noVisibleLabel }"
			:for="`native-datetime-picker_${label}`">{{ label }}</label>
		<input :id="`native-datetime-picker_${label}`"
			class="native-datetime-picker--input"
			:type="type"
			v-bind="$attrs"
			:value="formattedValue"
			:min="formattedMin"
			:max="formattedMax"
			v-on="listeners">
	</div>
</template>

<script>

const inputDateTypes = ['date', 'datetime-local', 'month', 'time', 'week']

export default {
	name: 'DateTimePickerNative',
	inheritAttrs: false,

	props: {
		type: {
			type: String,
			default: 'date',
			validate: (name) => inputDateTypes.includes(name),
		},
		label: {
			type: String,
			required: true,
		},
		value: {
			type: Date,
			required: true,
		},
		min: {
			type: Date,
			default: null,
			required: false,
		},
		max: {
			type: Date,
			default: null,
			required: false,
		},
		noVisibleLabel: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		formattedValue() {
			return this.formatValue(this.value)
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
		listeners() {
			const yyyy = this.value.getFullYear()
			const MM = (this.value.getMonth() + 1).toString().padStart(2, '0')
			const dd = this.value.getDate().toString().padStart(2, '0')
			return {
				...this.$listeners,
				input: ($event) => {
					if (this.type === 'time') {
						return this.$emit('input', new Date(`${yyyy}-${MM}-${dd}T${$event.target.value}`))
					} else if (this.type === 'week') {
						return $event.target.valueAsNumber
							? this.$emit('input', new Date($event.target.valueAsNumber))
							: this.$emit('input', this.value)
					} else {
						return $event.target.valueAsNumber
							? this.$emit('input', new Date(Date.parse($event.target.value)))
							: this.$emit('input', this.value)
					}
				},
				change: ($event) => {
					return this.$emit('change', $event)
				},
			}
		},
	},

	methods: {
		formatValue(value) {
			const yyyy = value.getFullYear()
			const MM = (value.getMonth() + 1).toString().padStart(2, '0')
			const dd = value.getDate().toString().padStart(2, '0')
			const hh = value.getHours().toString().padStart(2, '0')
			const mm = value.getMinutes().toString().padStart(2, '0')

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
			} else {
				return false
			}
		},
	},
}
</script>

<style lang="scss" scoped>
	.native-datetime-picker{
		display: flex;;
		flex-direction: column;
	}
	.native-datetime-picker .native-datetime-picker--input {
		width: 100%;
		flex: 0 0 auto;
	}
</style>
