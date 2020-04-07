<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
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
> We're wrapping the awesome datepicker library here https://github.com/mengxiong10/vue2-datepicker
> Please check there for all the available options.

### Defaults
- cleareable: false
- minute-step: 10

### Example
```vue
<template>
	<span>
		<DatetimePicker
			v-model="time"
			type="datetime" />
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
		<DatetimePicker
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
</docs>

<template>
	<DatePicker
		ref="datepicker"
		:clearable="clearable"
		:minute-step="minuteStep"
		:format="format"
		:type="type"
		:value="value"
		:append-to-body="false"
		v-bind="$attrs"
		v-on="$listeners"
		@select-year="handleSelectYear"
		@select-month="handleSelectMonth"
		@update:value="$emit('update:value', value)">
		<template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</DatePicker>
</template>

<script>
import DatePicker from 'vue2-datepicker'

export default {
	name: 'DatetimePicker',

	components: {
		DatePicker,
	},

	inheritAttrs: false,

	props: {
		clearable: {
			type: Boolean,
			default() {
				return false
			},
		},

		minuteStep: {
			type: Number,
			default() {
				return 10
			},
		},

		type: {
			type: String,
			default: 'date',
		},

		format: {
			type: [String, Object],
			default() {
				const map = {
					date: 'YYYY-MM-DD',
					datetime: 'YYYY-MM-DD H:mm:ss',
					year: 'YYYY',
					month: 'YYYY-MM',
					time: 'H:mm:ss',
					week: 'w',
				}
				return map[this.type] || map.date
			},
		},

		// eslint-disable-next-line
		value: {
			default() {
				return new Date()
			},
		},
	},

	methods: {
		handleSelectYear(year) {
			const value = this.$refs.datepicker.currentValue
			if (value) {
				try {
					const date = new Date(new Date(value).setFullYear(year))
					this.$refs.datepicker.selectDate(date)
				} catch (error) {
					console.error('Invalid value', value, year)
				}
			}
		},
		handleSelectMonth(month) {
			const value = this.$refs.datepicker.currentValue
			if (value) {
				try {
					const date = new Date(new Date(value).setMonth(month))
					this.$refs.datepicker.selectDate(date)
				} catch (error) {
					console.error('Invalid value', value, month)
				}
			}
		},
	},
}
</script>
