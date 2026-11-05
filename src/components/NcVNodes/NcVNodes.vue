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

<script setup lang="ts">
import type { Slot, VNode } from 'vue'

const props = defineProps<{
	/**
	 * The vnodes to render
	 */
	vnodes?: VNode | VNode[]
}>()

const slots = defineSlots<{
	/**
	 * The content to render if no vnodes are given
	 */
	default?: Slot
}>()

/**
 * Render the given vnodes or the default slot
 */
function render() {
	const vnodes = props.vnodes || slots.default?.({})
	return Array.isArray(vnodes) ? preferSingleVNode(vnodes) : vnodes
}

/**
 * Single root lets the parent scope id reach the element, like RouterLink custom
 *
 * @param vnodes - The vnodes to render
 */
function preferSingleVNode(vnodes: VNode[]) {
	return vnodes.length === 1 ? vnodes[0] : vnodes
}
</script>

<template>
	<component :is="render" />
</template>
