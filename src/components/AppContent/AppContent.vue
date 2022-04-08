<!--
 - @copyright Copyright (c) 2019 Christoph Wurst <christoph@winzerhof-wurst.at>
 -
 - @author Christoph Wurst <christoph@winzerhof-wurst.at>
 - @author Marco Ambrosini <marcoambrosini@pm.me>
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
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->
<docs>
### General description

This components provides a wrapper around the main app's content.

Single-column layouts can just use the default slot. A resizable column
can be added by providing content to the named slot `list`.

### Examples

#### Usage: Single-column content
```vue
<template>
	<AppContent>
		<h2>Single-column main content</h2>
	</AppContent>
</template>
```

#### Usage: Two resizable columns
```vue
<template>
	<AppContent>
		<template #list>
			<div>Resizable list content</div>
		</template>

		<div>Main content</div>
	</AppContent>
</template>
```

#### Overriding Defaults
The default, min and max sizes (in percent) of the resizable list column can be overridden.
The list size must be between the min and the max width value.

```
<AppContent
	:list-size="35"
	:list-min-width="20"
	:list-max-width="45"
>...</AppContent>
```
</docs>

<template>
	<main id="app-content-vue" class="app-content no-snapper">
		<template v-if="hasList">
			<!-- Mobile view does not allow resizeable panes -->
			<div v-if="isMobile"
				:class="showDetails ? 'app-content-wrapper--show-details' : 'app-content-wrapper--show-list'"
				class="app-content-wrapper app-content-wrapper--mobile">
				<AppDetailsToggle v-if="hasList && showDetails" @click.native.stop.prevent="hideDetails" />

				<slot name="list" />
				<slot />
			</div>

			<div v-else class="app-content-wrapper">
				<Splitpanes class="default-theme"
					@resized="handlePaneResize">
					<Pane class="splitpanes__pane-list"
						:size="listPaneSize || paneDefaults.list.size"
						:min-size="paneDefaults.list.min"
						:max-size="paneDefaults.list.max">
						<!-- @slot Provide a list to the app content -->
						<slot name="list" />
					</Pane>

					<Pane class="splitpanes__pane-details"
						:size="detailsPaneSize"
						:min-size="paneDefaults.details.min"
						:max-size="paneDefaults.details.max">
						<!-- @slot Provide the main content to the app content -->
						<slot />
					</Pane>
				</Splitpanes>
			</div>
		</template>

		<!-- @slot Provide the main content to the app content -->
		<slot v-else />
	</main>
</template>

<script>
import 'splitpanes/dist/splitpanes.css'

import { emit } from '@nextcloud/event-bus'
import { getBuilder } from '@nextcloud/browser-storage'
import { Splitpanes, Pane } from 'splitpanes'
import Hammer from 'hammerjs'

import AppDetailsToggle from './AppDetailsToggle'
import isMobile from '../../mixins/isMobile'

const browserStorage = getBuilder('nextcloud').persist().build()

/**
 * App content container to be used for the main content of your app
 *
 */
export default {
	name: 'AppContent',

	components: {
		AppDetailsToggle,
		Pane,
		Splitpanes,
	},

	mixins: [isMobile],

	props: {
		/**
		 * Allows to disable the control by swipe of the app navigation open state
		 */
		allowSwipeNavigation: {
			type: Boolean,
			default: true,
		},

		/**
		 * Allows you to set the default width of the resizable list in %
		 * Must be between listMinWidth and listMaxWidth
		 */
		listSize: {
			type: Number,
			default: 20,
		},

		/**
		 * Allows you to set the minimum width of the list column in %
		 */
		listMinWidth: {
			type: Number,
			default: 15,
		},

		/**
		 * Allows you to set the maximum width of the list column in %
		 */
		listMaxWidth: {
			type: Number,
			default: 40,
		},

		/**
		 * Specify the config key for the pane config sizes
		 * Default is the global var appName if you use the webpack-vue-config
		 */
		paneConfigKey: {
			type: String,
			default: '',
		},

		/**
		 * When in mobile view, only the list or the details are shown
		 * If you provide a list, you need to provide a variable
		 * that will be set to true by the user when an element of
		 * the list gets selected. The details will then show a back
		 * arrow to return to the list that will update this prop to false.
		 */
		showDetails: {
			type: Boolean,
			default: true,
		},
	},

	data() {
		return {
			contentHeight: 0,

			hasList: false,
			listPaneSize: this.restorePaneConfig(),
		}
	},

	computed: {
		paneConfigID() {
			// If provided, let's use it
			if (this.paneConfigKey !== '') {
				return `pane-list-size-${this.paneConfigKey}`
			}

			try {
				// Using the webpack-vue-config, appName is a global variable
				// This will throw a ReferenceError when the global variable is missing
				// In that case either you provide paneConfigKey or else it fallback
				// to a global storage key
				return `pane-list-size-${appName}`
			} catch (e) {
				console.info('[INFO] AppContent:', 'falling back to global nextcloud pane config')
				return 'pane-list-size-nextcloud'
			}
		},

		detailsPaneSize() {
			if (this.listPaneSize) {
				return 100 - this.listPaneSize
			}
			return this.paneDefaults.details.size
		},

		paneDefaults() {
			return {
				list: {
					size: this.listSize,
					min: this.listMinWidth,
					max: this.listMaxWidth,
				},

				// set the inverse values of the details column
				// based on the provided (or default) values of the list column
				details: {
					size: 100 - this.listSize,
					min: 100 - this.listMaxWidth,
					max: 100 - this.listMinWidth,
				},
			}
		},
	},

	updated() {
		this.checkListSlot()
	},

	mounted() {
		if (this.allowSwipeNavigation) {
			this.mc = new Hammer(this.$el, { cssProps: { userSelect: 'text' } })
			this.mc.on('swipeleft swiperight', this.handleSwipe)
		}

		this.checkListSlot()
		this.restorePaneConfig()
	},

	beforeDestroy() {
		this.mc.off('swipeleft swiperight', this.handleSwipe)
	},

	methods: {
		// handle the swipe event
		handleSwipe(e) {
			const minSwipeX = 70
			const touchzone = 40
			const startX = e.srcEvent.pageX - e.deltaX
			const hasEnoughDistance = Math.abs(e.deltaX) > minSwipeX
			if (hasEnoughDistance && startX < touchzone) {
				emit('toggle-navigation', {
					open: true,
				})
			} else if (hasEnoughDistance && startX < touchzone + 300) {
				emit('toggle-navigation', {
					open: false,
				})
			}
		},

		handlePaneResize(event) {
			const listPaneSize = parseInt(event[0].size, 10)
			browserStorage.setItem(this.paneConfigID, JSON.stringify(listPaneSize))
			this.listPaneSize = listPaneSize
			console.debug('AppContent pane config', listPaneSize)
		},

		// $slots is not reactive, we need to update this manually
		checkListSlot() {
			const hasListSlot = !!this.$slots.list
			if (this.hasList !== hasListSlot) {
				this.hasList = hasListSlot
			}
		},

		// browserStorage is not reactive, we need to update this manually
		restorePaneConfig() {
			const listPaneSize = parseInt(browserStorage.getItem(this.paneConfigID), 10)
			if (!isNaN(listPaneSize) && listPaneSize !== this.listPaneSize) {
				console.debug('AppContent pane config', listPaneSize)
				this.listPaneSize = listPaneSize
				return listPaneSize
			}
		},

		/**
		 * The user clicked the back arrow from the details view
		 */
		hideDetails() {
			this.$emit('update:showDetails', false)
		},
	},
}
</script>
<style lang="scss" scoped>

.app-content {
	position: relative;
	z-index: 1000;
	flex-basis: 100vw;
	min-width: 0;
	min-height: 100%;
	// Overriding server styles TODO: cleanup!
	margin: 0 !important;
	background-color: var(--color-main-background);
}

// Mobile list/details handling
.app-content-wrapper--mobile {
	&.app-content-wrapper--show-list ::v-deep {
		.app-content-list {
			display: block;
		}
		.app-content-details {
			display: none;
		}
	}
	&.app-content-wrapper--show-details ::v-deep {
		.app-content-list {
			display: none;
		}
		.app-content-details {
			display: block;
		}
	}
}

::v-deep .splitpanes.default-theme {
	.app-content-list {
		max-width: none;
	}

	.splitpanes__pane {
		background-color: transparent;
		transition: none;

		&-list {
			min-width: 200px;
			position: sticky;
			top: var(--header-height);

			@media only screen and (max-width: $breakpoint-mobile) {
				display: none;
			}
		}

		&-details {
			overflow-y: scroll;

			@media only screen and (max-width: $breakpoint-mobile) {
				min-width: 100%;
			}
		}
	}

	.splitpanes__splitter {
		width: 9px;
		margin-left: -5px;
		background-color: transparent;
		border-left: none;

		&:before,
		&:after {
			display: none;
		}
	}
}
</style>
