<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'NcPopoverTriggerProvider',

	provide() {
		return {
			'NcPopover:trigger:shown': computed(() => this.shown),
			'NcPopover:trigger:attrs': computed(() => this.triggerAttrs),
		}
	},

	props: {
		shown: {
			type: Boolean,
			required: true,
		},
		popupRole: {
			type: String,
			required: true,
		},
	},

	computed: {
		triggerAttrs() {
			return {
				'aria-haspopup': this.popupRole,
				'aria-expanded': this.shown.toString(),
			}
		},
	},

	mounted() {
		if (window.OC?.debug) {
			// TODO: Adjust for vue 3. Since vue 3 components can have multiple root elements, this breaks.
			/**
			const rootElement = this.$el
			console.debug(this.$el)
			const innerElement = this.$el.querySelector('[aria-expanded][aria-haspopup]')
			if (!rootElement.getAttribute('aria-expanded') && !innerElement) {
				warn('It looks like you are using a custom button as a <NcPopover> or other popover #trigger. If you are not using <NcButton> as a trigger, you need to bind attrs from the #trigger slot props to your custom button. See <NcPopover> docs for an example.')
			}
			 */
		}
	},

	render() {
		return this.$slots.default?.({
			attrs: this.triggerAttrs,
		})
	},
})
</script>
