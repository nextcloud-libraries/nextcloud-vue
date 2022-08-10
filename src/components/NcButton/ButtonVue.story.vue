<script setup>
import { reactive } from 'vue'
import NcButton from './NcButton.vue'
import Icon from 'vue-material-design-icons/GestureDoubleTap.vue'

const state = reactive({
	type: undefined,
})

const types = [
	'',
	'primary',
	'secondary',
	'tertiary',
	'tertiary-no-background',
	'tertiary-on-primary',
	'error',
	'warning',
	'success',
]
</script>

<template>
	<Story title="Button">
		<Variant title="Basic">
			<NcButton :type="state.type">
				Button
			</NcButton>

			<NcButton :type="state.type" disabled>
				Disabled
			</NcButton>

			<template #controls>
				<HstSelect v-model="state.type" :options="types" title="Type" />
			</template>
		</Variant>

		<Variant title="With icons">
			<NcButton :type="state.type">
				<template #icon>
					<Icon />
				</template>
			</NcButton>

			<NcButton :type="state.type" wide>
				<template #icon>
					<Icon />
				</template>
				Wide
			</NcButton>
		</Variant>
	</Story>
</template>

<style>
.button-vue {
	margin-bottom: 10px;
}
</style>
