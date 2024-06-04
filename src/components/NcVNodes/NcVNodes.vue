<!--
 - @copyright Copyright (c) 2023 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 -
 - @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
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

<script>
export default {
	name: 'NcVNodes',
	props: {
		/**
		 * The vnodes to render
		 */
		vnodes: {
			type: [Array, Object],
			default: null,
		},
	},
	/**
	 * The render function to display the component
	 *
	 * @return {object} The created VNode
	 */
	render() {
		return this.vnodes || this.$slots?.default?.({})
	},
}
</script>
