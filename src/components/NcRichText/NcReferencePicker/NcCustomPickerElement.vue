<template>
	<div ref="domElement" />
</template>

<script>
import { renderCustomPickerElement, isCustomPickerElementRegistered, destroyCustomPickerElement } from './customPickerElements.js'

export default {
	name: 'NcCustomPickerElement',
	props: {
		/**
		 * The reference provider
		 */
		provider: {
			type: Object,
			required: true,
		},
	},
	emits: [
		'cancel',
		'submit',
	],
	data() {
		return {
			isRegistered: isCustomPickerElementRegistered(this.provider.id),
			renderResult: null,
		}
	},
	mounted() {
		if (this.isRegistered) {
			this.renderElement()
		}
	},
	beforeUnmount() {
		if (this.isRegistered) {
			destroyCustomPickerElement(this.provider.id, this.$el, this.renderResult)
		}
	},
	methods: {
		renderElement() {
			if (this.$refs.domElement) {
				this.$refs.domElement.innerHTML = ''
			}

			const renderFunctionResult = renderCustomPickerElement(this.$refs.domElement, { providerId: this.provider.id, accessible: false })
			// this works whether renderCustomPickerElement returns a promise or a value
			Promise.resolve(renderFunctionResult).then(result => {
				this.renderResult = result
				if (this.renderResult.object?._isVue && this.renderResult.object?.$on) {
					this.renderResult.object.$on('submit', this.onSubmit)
					this.renderResult.object.$on('cancel', this.onCancel)
				}
				this.renderResult.element.addEventListener('submit', (e) => {
					this.onSubmit(e.detail)
				})
				this.renderResult.element.addEventListener('cancel', this.onCancel)
			})
		},
		onSubmit(value) {
			this.$emit('submit', value)
		},
		onCancel() {
			this.$emit('cancel')
		},
	},
}
</script>

<style lang="scss" scoped>
// nothing yet
</style>
