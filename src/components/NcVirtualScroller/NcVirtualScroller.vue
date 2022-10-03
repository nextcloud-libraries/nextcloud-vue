<!--
  - @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
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
-->
<docs>
Basic testing with dummy data
```vue
<template>
	<NcVirtualScroller :items="items" />
</template>
<script>
	import Delete from 'vue-material-design-icons/Delete'
	export default {
		computed: {
			items() {
				return Array.from({ length: 1000 }).map((_, i) => {
					return {
						key: 'item-' + i,
						is: Delete,
						props: {
							title: 'Item ' + i,
							icon: 'icon-user',
						}
					}
				})
			}
		}
	}
</script>
```
</docs>

<template>
	<div ref="scroller" class="virtual-scroller">
		<!-- Rendered items -->
		<div ref="content" class="virtual-scroller__content" :style="spacerStyle">
			<element :is="item.is"
				v-for="item in items.slice(state.firstShownItemIndex, state.lastShownItemIndex +1)"
				:key="item.key"
				v-bind="item.props"
				v-on="item.listeners" />
		</div>
	</div>
</template>

<script>
import VirtualScroller from 'virtual-scroller'

export default {
	name: 'NcVirtualScroller',

	props: {
		items: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			paddingTop: null,
			paddingBottom: null,

			children: [],

			state: {},

			virtualScroller: null,
		}
	},

	computed: {
		spacerStyle() {
			return {
				paddingTop: this.state.beforeItemsHeight + 'px',
				paddingBottom: this.state.afterItemsHeight + 'px',
			}
		},
	},

	watch: {
		items() {
			this.virtualScroller.setItems(this.items)
		},
	},
	mounted() {
		window.vm = this
		window.VirtualScrollerDebug = true

		// Init the virtual scroller
		this.virtualScroller = new VirtualScroller(
			this.getItemsContainerElement,
			this.items,
			{
				getScrollableContainer: this.getScrollableContainer,
			},
		)

		this.state = this.virtualScroller.getInitialState()

		// Custom state management
		this.virtualScroller.useState({
			getState: () => this.state,
			updateState: state => {
				Object.assign(this.state, state)
				console.debug(state)
				this.$nextTick(() => {
					// this.virtualScroller.onRender()
				})
			},
		})

		// Start the virtual scrolling
		this.$nextTick(() => {
			this.virtualScroller.start()
		})
	},
	unmounted() {
		this.virtualScroller.stop()
	},

	methods: {
		getScrollableContainer() {
			return this.$refs.scroller
		},
		getItemsContainerElement() {
			return this.$refs.content
		},
	},
}
</script>

<style>
.virtual-scroller {
	max-height: 300px;
	overflow-x: hidden;
	overflow-y: auto;
}
</style>
