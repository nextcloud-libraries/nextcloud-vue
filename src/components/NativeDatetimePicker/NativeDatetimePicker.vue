<template>
	<div class="native-datetime-picker">
		<label for="native-datetime-picker">{{ t('Choose a date') }}</label>
		<input id="native-datetime-picker"
			class="native-datetime-picker--input"
			:type="type"
			v-bind="$attrs"
			:value="formattedValue.toString()"
			:min="formattedMin.toString()"
			:max="formattedMax.toString()"
			v-on="$listeners">
	</div>
</template>

<script>
import moment from '@nextcloud/moment'

const formatMap = {
	date: 'YYYY-MM-DD',
	'datetime-local': 'YYYY-MM-DD H:mm:ss',
	month: 'YYYY-MM',
	time: 'H:mm:ss',
	week: 'w',
}

export default {
	name: 'NativeDatetimePicker',
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
		// eslint-disable-next-line vue/require-default-prop
		min: {
			type: Date,
			required: false,
		},
		// eslint-disable-next-line vue/require-default-prop
		max: {
			type: Date,
			required: false,
		},
	},
	computed: {
		formattedValue() {
			return moment(this.value).format(formatMap[this.type])
		},
		formattedMin() {
			return moment(this.min).format(formatMap[this.type])
		},
		formattedMax() {
			return moment(this.max).format(formatMap[this.type])
		},
	},
}
</script>

<style lang="scss" scoped>
	.native-datetime-picker .native-datetime-picker--input {
		width: 100%;
	}
</style>
