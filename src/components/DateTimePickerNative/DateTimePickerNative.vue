<template>
	<div class="native-datetime-picker">
		<label for="native-datetime-picker_${value}">{{ t('Choose a date') }}</label>
		<input id="native-datetime-picker_${value}"
			class="native-datetime-picker--input"
			:type="type"
			v-bind="$attrs"
			:value="formattedValue"
			:min="formattedMin"
			:max="formattedMax"
			@input="onInput($event)"
			@change="$emit('change', $event)">
	</div>
</template>

<script>

export default {
	name: 'DateTimePickerNative',
	inheritAttrs: false,

	props: {
		type: {
			type: String,
			default: 'date',
			validator(type) {
				return ['date', 'datetime-local', 'month',
					'time', 'week'].indexOf(type) > -1
			},
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
	},

	methods: {
		formatValue(value) {
			const cutISOString = value.toISOString().slice(0, -8)

			if (this.type === 'datetime-local') {
				return cutISOString
			} else if (this.type === 'date') {
				return cutISOString.slice(0, cutISOString.indexOf('T'))
			} else if (this.type === 'month') {
				return cutISOString.slice(0, cutISOString.indexOf('T') - 3)
			} else if (this.type === 'time') {
				return cutISOString.slice(cutISOString.indexOf('T') + 1, cutISOString.indexOf('T') + 6)
			} else if (this.type === 'week') {
				const startDate = new Date(value.getFullYear(), 0, 1)
				const daysSinceBeginningOfYear = Math.floor((value - startDate)
					/ (24 * 60 * 60 * 1000))
				const returnWeek = Math.ceil(daysSinceBeginningOfYear / 7)
				return `${value.getFullYear()}-W${returnWeek}`
			}
			return cutISOString
		},

		onInput($event) {
			if (this.type === 'month') {
				return this.$emit('input', new Date(Date.parse($event.target.value)))
			} else {
				return this.$emit('input', new Date($event.target.valueAsNumber))
			}
		},
	},
}
</script>

<style lang="scss" scoped>
	.native-datetime-picker .native-datetime-picker--input {
		width: 100%;
	}
</style>
