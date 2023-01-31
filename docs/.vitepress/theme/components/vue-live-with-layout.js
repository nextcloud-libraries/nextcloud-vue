import { h, onMounted, ref, defineComponent, markRaw } from "vue"
import { VueLive } from "vue-live";
import layout from "./vue-live-layout.vue";

// https://github.com/vue-styleguidist/vue-live/issues/96
export default defineComponent({
	setup(_, { attrs }) {
		const ready = ref(false)
		const props = {...attrs}
		onMounted(async () => {
			const NcComponents = (await import('../../../../dist/index.esm.js')).NcComponents
			props.components = markRaw({...NcComponents})
			if ("requires" in props) {
				props.requires = markRaw({})
				await Promise.allSettled(Object.keys(attrs.requires).map(async (key) => {
					props.requires[key] = (await attrs.requires[key]).default
				}))
			}
			ready.value = true
		})
		// return the render function
		return () => ready.value ? h(VueLive, { ...props, layout }) : h('div', 'loading...')
	}
})