<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
## Usage

### Simplest example with custom item
```vue
<template>
	<NcDashboardWidget :items="items">
		<template #default="{ item }">
			{{ item.name }}
		</template>
	</NcDashboardWidget>
</template>

<script>
const myItems = [
	{
		name: 'first',
		content: 'blabla',
	},
	{
		name: 'second',
		content: 'fuzzfuzz',
	},
]
export default {
	name: 'MyDashboardWidget',
	props: [],
	data() {
		return {
			items: myItems
		}
	},
}
</script>
```

### Showing items and a half empty content message
```vue
<template>
	<NcDashboardWidget :items="items"
		:show-items-and-empty-content="true"
		:half-empty-content-message="'No unread items'">
		<template #default="{ item }">
			{{ item.name }}
		</template>
	</NcDashboardWidget>
</template>

<script>
const myItems = [
	{
		name: 'first',
		content: 'blabla',
	},
	{
		name: 'second',
		content: 'fuzzfuzz',
	},
]
export default {
	name: 'MyDashboardWidget',
	props: [],
	data() {
		return {
			items: myItems
		}
	},
}
</script>
```

### Complete example using NcDashboardWidgetItem

```vue
<template>
	<NcDashboardWidget :items="items"
		:show-more-url="'https://nextcloud.com'"
		:item-menu="itemMenu"
		@hide="onHide"
		@markDone="onMarkDone">

		<template #empty-content>
			Nothing to display
		</template>
	</NcDashboardWidget>
</template>

<script>
const myItems = [
	{
		id: '1',
		targetUrl: 'https://target.org',
		avatarUrl: 'https://avatar.url/img.png',
		avatarUsername: 'Robert',
		avatarIsNoUser: true,
		overlayIconUrl: '/svg/core/actions/sound?color=000',
		mainText: 'First item text',
		subText: 'First item subtext',
	},
	{
		id: '2',
		targetUrl: 'https://other-target.org',
		avatarUrl: 'https://other-avatar.url/img.png',
		overlayIconUrl: '/svg/core/actions/add?color=000',
		mainText: 'Second item text',
		subText: 'Second item subtext',
	},
]
const myItemMenu = {
	// triggers an event named "markDone" when clicked
	'markDone': {
		text: 'Mark as done',
		icon: 'icon-checkmark',
	},
	// triggers an event named "hide" when clicked
	'hide': {
		text: 'Hide',
		icon: 'icon-toggle',
	},
}
export default {
	name: 'MyDashboardWidget',
	props: [],
	data() {
		return {
			items: myItems,
			itemMenu: myItemMenu,
			loading: true,
		}
	},
	methods: {
		onMoreClick() {
			console.log('more clicked')
			const win = window.open('https://wherever.you.want', '_blank')
			win.focus()
		},
		onHide(item) {
			console.log('user wants to hide item ' + item.id)
			// do what you want
		},
		onMarkDone(item) {
			console.log('user wants to mark item ' + item.id + ' as done')
			// do what you want
		},
	},
}
</script>
```

</docs>

<template>
	<div class="dashboard-widget">
		<!-- This element is shown if we have items, but want to show a general message as well.
		Can be used e.g. to show "No mentions" on top of the item list. -->
		<NcEmptyContent v-if="showHalfEmptyContentArea"
			:description="halfEmptyContentString"
			class="half-screen">
			<template #icon>
				<!-- @slot The icon to show in the half empty content area. -->
				<slot name="halfEmptyContentIcon">
					<Check />
				</slot>
			</template>
		</NcEmptyContent>
		<!-- The list of items to show. -->
		<ul>
			<li v-for="item in displayedItems" :key="item.id">
				<!-- @slot The default slot can be optionally overridden. It contains the template of one item. -->
				<slot name="default" :item="item">
					<NcDashboardWidgetItem v-bind="item"
						:item-menu="itemMenu"
						v-on="handlers" />
				</slot>
			</li>
		</ul>
		<!-- While the widget is loading, we show a list of placeholder items. -->
		<div v-if="loading">
			<div v-for="i in 7" :key="i" class="item-list__entry">
				<NcAvatar class="item-avatar" :size="44" />
				<div class="item__details">
					<h3>&nbsp;</h3>
					<p class="message">
&nbsp;
					</p>
				</div>
			</div>
		</div>
		<!-- @slot Slot for showing information in case of an empty item list. -->
		<slot v-else-if="items.length === 0" name="empty-content">
			<NcEmptyContent v-if="emptyContentMessage"
				:description="emptyContentMessage">
				<template #icon>
					<!-- @slot The icon to show in the empty content area. -->
					<slot name="emptyContentIcon" />
				</template>
			</NcEmptyContent>
		</slot>
		<!-- A "show more" link, e.g. to navigate to the main app belonging to this widget. -->
		<a v-else-if="showMore"
			:href="showMoreUrl"
			target="_blank"
			class="more"
			tabindex="0">
			{{ showMoreLabel }}
		</a>
	</div>
</template>

<script>
import NcAvatar from '../NcAvatar/index.js'
import NcDashboardWidgetItem from '../NcDashboardWidgetItem/index.js'
import NcEmptyContent from '../NcEmptyContent/index.js'

import Check from 'vue-material-design-icons/Check.vue'

import { t } from '../../l10n.js'

export default {
	name: 'NcDashboardWidget',
	components: {
		NcAvatar,
		NcDashboardWidgetItem,
		NcEmptyContent,
		Check,
	},

	props: {
		/**
		 * An array containing the items to show (specific structure must be respected,
		 * except if you override item rendering in the default slot).
		 */
		items: {
			type: Array,
			default: () => { return [] },
		},
		/**
		 * If this is set, a "show more" text is displayed on the widget's bottom.
		 * It's a link pointing to this URL.
		 */
		showMoreUrl: {
			type: String,
			default: '',
		},
		/**
		 * The text of show more button.
		 *
		 * Expected to be in the form "More {itemName} …"
		 */
		showMoreLabel: {
			type: String,
			default: t('More items …'),
		},
		/**
		 * A boolean to put the widget in a loading state.
		 */
		loading: {
			type: Boolean,
			default: false,
		},
		/**
		 * An object containing context menu entries that will be displayed for each item.
		 */
		itemMenu: {
			type: Object,
			default: () => { return {} },
		},
		/**
		 * Whether both the items and the empty content message are shown.
		 * Usefull for e.g. showing "No mentions" and a list of elements.
		 */
		showItemsAndEmptyContent: {
			type: Boolean,
			default: false,
		},
		/**
		 * The text to show in the empty content area.
		 */
		emptyContentMessage: {
			type: String,
			default: '',
		},
		/**
		 * The text to show in the half empty content area.
		 */
		halfEmptyContentMessage: {
			type: String,
			default: '',
		},
	},

	computed: {
		// forward menu events to my parent
		handlers() {
			const h = {}
			for (const evName in this.itemMenu) {
				h[evName] = (it) => {
					this.$emit(evName, it)
				}
			}
			return h
		},
		displayedItems() {
			const nbItems = (this.showMoreUrl && this.items.length >= this.maxItemNumber)
				? this.maxItemNumber - 1
				: this.maxItemNumber
			return this.items.slice(0, nbItems)
		},

		showHalfEmptyContentArea() {
			return this.showItemsAndEmptyContent && this.halfEmptyContentString && this.items.length !== 0
		},

		halfEmptyContentString() {
			return this.halfEmptyContentMessage || this.emptyContentMessage
		},

		maxItemNumber() {
			return this.showItemsAndEmptyContent ? 5 : 7
		},

		showMore() {
			return this.showMoreUrl && this.items.length >= this.maxItemNumber
		},
	},
}
</script>

<style scoped lang="scss">
.dashboard-widget :deep(.empty-content) {
	text-align: center;
	padding-top: 5vh;
	&.half-screen {
		padding-top: 0;
		margin-bottom: 1vh;
	}
}

.more {
	display: block;
	text-align: center;
	color: var(--color-text-maxcontrast);
	line-height: 60px;
	cursor: pointer;

	&:hover,
	&:focus {
		background-color: var(--color-background-hover);
		border-radius: var(--border-radius-large);
		color: var(--color-main-text);
	}
}

/* skeleton */
.item-list__entry {
	display: flex;
	align-items: flex-start;
	padding: 8px;

	.item-avatar {
		position: relative;
		margin-top: auto;
		margin-bottom: auto;
		background-color: var(--color-background-dark) !important;
	}
	.item__details {
		padding-left: 8px;
		max-height: var(--default-clickable-area);
		flex-grow: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		h3,
		.message {
			white-space: nowrap;
			background-color: var(--color-background-dark);
		}
		h3 {
			font-size: 100%;
			margin: 0;
		}
		.message {
			width: 80%;
			height: 15px;
			margin-top: 5px;
		}
	}
}
</style>
