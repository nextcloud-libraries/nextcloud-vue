<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
A util component to render a VNode or an array of VNodes from the prop or the default slot.

### Render the given or generated VNodes

```vue
<template>
	<NcVNodes :vnodes="renderDiv()" />
</template>

<script>
import { h } from 'vue'

export default {
	methods: {
		renderDiv() {
			return h('div', 'This div was created programmatically as a VNode')
		},
	}
}
</script>
```

### Render content in a conditional wrapper

```vue
<template>
	<div>
		<p>
			<NcCheckboxRadioSwitch v-model="shouldRenderNcNoteCard">Render text inside "NcNoteCard"</NcCheckboxRadioSwitch>
		</p>
		<component :is="shouldRenderNcNoteCard ? 'NcNoteCard' : 'NcVNodes'">
			<p>This content is rendered {{ shouldRenderNcNoteCard ? 'with' : 'without' }} a "NcNoteCard" wrapper</p>
		</component>
	</div>
</template>

<script>
export default {
	data() {
		return {
			shouldRenderNcNoteCard: true,
		}
	},
}
</script>
```
</docs>

<script lang="ts">
import type { PropType, VNode } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'NcVNodes',

	props: {
		/**
		 * The vnodes to render
		 */
		vnodes: {
			type: [Array, Object] as PropType<VNode | VNode[]>,
			default: null,
		},
	},

	/**
	 * The render function to display the component
	 */
	render() {
		return this.vnodes || this.$slots?.default?.({})
	},
})
</script>
