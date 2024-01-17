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

	render() {
		// TODO: Vue 3 - replace with $slots
		return this.$scopedSlots.default?.({
			attrs: this.triggerAttrs,
		})
	},
})
</script>
