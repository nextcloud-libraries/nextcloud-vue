<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This components provides a wrapper around the main app's content.

Single-column layouts can just use the default slot. A resizable column
can be added by providing content to the named slot `list`.

### CSS variables
In the css section some css variables are declared and will be available for
all the children of the NcAppContent component

### Examples

#### Usage: Single-column content
```vue
<template>
	<NcAppContent>
		<h2>Single-column main content</h2>
	</NcAppContent>
</template>
```

#### Usage: Two resizable columns
```vue
<template>
	<NcAppContent>
		<template #list>
			<div>Resizable list content</div>
		</template>

		<div>Main content</div>
	</NcAppContent>
</template>
```

#### Overriding Defaults
The default, min and max sizes (in percent) of the resizable list column can be overridden.
The list size must be between the min and the max width value.

```
<NcAppContent
	:list-size="35"
	:list-min-width="20"
	:list-max-width="45"
>...</NcAppContent>
```

#### Usage: Custom document title
For accessibility reasons every document should have a `h1` heading,
this is visually hidden, but required for a semantically correct document.
You can use your app name or current view for the heading.

Additionally you can set a custom document title, e.g. to show the current status.

```vue
<template>
	<NcAppContent :pageHeading="heading ? 'Heading' : undefined" :pageTitle="title ? 'Title' : undefined" >
		<NcCheckboxRadioSwitch type="switch" :checked.sync="title">
			Toggle title
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch type="switch" :checked.sync="heading">
			Toggle Heading
		</NcCheckboxRadioSwitch>
		<NcButton @click="reset">Reset</NcButton>
	</NcAppContent>
</template>

<script>
export default {
	data() {
		return {
			heading: false,
			title: false,
		}
	},
	methods: {
		reset() {
			this.heading = false
			this.title = false
			document.title = ''
		},
	},
}
</script>
```
</docs>

<template>
	<main id="app-content-vue" class="app-content no-snapper" :class="{ 'app-content--has-list': hasList }">
		<h1 v-if="pageHeading" class="hidden-visually">
			{{ pageHeading }}
		</h1>

		<template v-if="hasList">
			<!-- Mobile view does not allow resizeable panes -->
			<div v-if="isMobile || layout === 'no-split'"
				class="app-content-wrapper app-content-wrapper--no-split"
				:class="{
					'app-content-wrapper--show-details': showDetails,
					'app-content-wrapper--show-list': !showDetails,
					'app-content-wrapper--mobile': isMobile,}">
				<NcAppContentDetailsToggle v-if="showDetails" @click.stop.prevent="hideDetails" />

				<div v-show="!showDetails">
					<slot name="list" />
				</div>
				<slot v-if="showDetails" />
			</div>
			<div v-else-if="layout === 'vertical-split' || layout === 'horizontal-split'" class="app-content-wrapper">
				<Splitpanes :horizontal="layout === 'horizontal-split'"
					class="default-theme"
					:class="{ 'splitpanes--horizontal': layout === 'horizontal-split',
						'splitpanes--vertical': layout === 'vertical-split'
					}"
					:rtl="isRtl"
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
		<slot v-if="!hasList" />
	</main>
</template>

<script>
import { getBuilder } from '@nextcloud/browser-storage'
import { getCapabilities } from '@nextcloud/capabilities'
import { emit } from '@nextcloud/event-bus'
import { loadState } from '@nextcloud/initial-state'
import { useSwipe } from '@vueuse/core'
import { Splitpanes, Pane } from 'splitpanes'
import NcAppContentDetailsToggle from './NcAppContentDetailsToggle.vue'
import { useIsMobile } from '../../composables/useIsMobile/index.js'
import { APP_NAME } from '../../utils/appName.ts'
import { isRtl } from '../../utils/rtl.ts'
import logger from '../../utils/logger.ts'

import 'splitpanes/dist/splitpanes.css'

const browserStorage = getBuilder('nextcloud').persist().build()
const instanceName = getCapabilities().theming?.name ?? 'Nextcloud'
const activeApp = loadState('core', 'active-app', APP_NAME)
const localizedAppName = loadState('core', 'apps', []).find(({ id }) => id === activeApp)?.name ?? APP_NAME

/**
 * App content container to be used for the main content of your app
 *
 */
export default {
	name: 'NcAppContent',

	components: {
		NcAppContentDetailsToggle,
		Pane,
		Splitpanes,
	},
	props: {
		/**
		 * Allows to disable the control by swipe of the app navigation open state.
		 */
		disableSwipe: {
			type: Boolean,
			default: false,
		},

		/**
		 * Allows you to set the default width of the resizable list in % on vertical-split
		 * or respectively the default height on horizontal-split.
		 *
		 * Must be between `listMinWidth` and `listMaxWidth`.
		 */
		listSize: {
			type: Number,
			default: 20,
		},

		/**
		 * Allows you to set the minimum width of the list column in % on vertical-split
		 * or respectively the minimum height on horizontal-split.
		 */
		listMinWidth: {
			type: Number,
			default: 15,
		},

		/**
		 * Allows you to set the maximum width of the list column in % on vertical-split
		 * or respectively the maximum height on horizontal-split.
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
		 * When in mobile view, only the list or the details are shown.
		 *
		 * If you provide a list, you need to provide a variable
		 * that will be set to true by the user when an element of
		 * the list gets selected. The details will then show a back
		 * arrow to return to the list that will update this prop to false.
		 */
		showDetails: {
			type: Boolean,
			default: true,
		},

		/**
		 * Content layout used when there is a list together with content:
		 * - `vertical-split` - a 2-column layout with list and default content separated vertically
		 * - `no-split` - a single column layout; List is shown when `showDetails` is `false`, otherwise the default slot content is shown with a back button to return to the list.
		 * - 'horizontal-split' - a 2-column layout with list and default content separated horizontally
		 * On mobile screen `no-split` layout is forced.
		 */
		layout: {
			type: String,
			default: 'vertical-split',
			validator(value) {
				return ['no-split', 'vertical-split', 'horizontal-split'].includes(value)
			},
		},

		/**
		 * Specify the `<h1>` page heading
		 */
		pageHeading: {
			type: String,
			default: null,
		},

		/**
		 * Allow setting the page's `<title>`
		 *
		 * If a page heading is set it defaults to `{pageHeading} - {appName} - {instanceName}` e.g. `Favorites - Files - MyPersonalCloud`.
		 * When the page heading and the app name is the same only one is used, e.g. `Files - Files - MyPersonalCloud` is shown as `Files - MyPersonalCloud`.
		 * When setting the prop then the following format will be used: `{pageTitle} - {instanceName}`
		 */
		pageTitle: {
			type: String,
			default: null,
		},
	},

	emits: [
		'update:showDetails',
		'resizeList',
	],

	setup() {
		return {
			isMobile: useIsMobile(),
			isRtl,
		}
	},

	data() {
		return {
			contentHeight: 0,
			hasList: false,
			hasContent: false,
			swiping: {},
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
				return `pane-list-size-${APP_NAME}`
			} catch (e) {
				logger.info('[NcAppContent]: falling back to global nextcloud pane config')
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

		realPageTitle() {
			const entries = new Set()
			if (this.pageTitle) {
				// when page title is set we only use that
				// we still split to remove duplicated instanceName
				for (const part of this.pageTitle.split(' - ')) {
					entries.add(part)
				}
			} else if (this.pageHeading) {
				// when the page heading is provided but not the title
				// then we split to remove duplicates
				// but also add the localized app name
				for (const part of this.pageHeading.split(' - ')) {
					entries.add(part)
				}

				if (entries.size > 0) {
					entries.add(localizedAppName)
				}
			} else {
				return null
			}

			entries.add(instanceName)
			return [...entries.values()].join(' - ')
		},
	},

	watch: {
		realPageTitle: {
			immediate: true,
			handler() {
				if (this.realPageTitle !== null) {
					document.title = this.realPageTitle
				}
			},
		},
	},

	updated() {
		this.checkSlots()
	},

	mounted() {
		if (!this.disableSwipe) {
			this.swiping = useSwipe(this.$el, {
				onSwipeEnd: this.handleSwipe,
			})
		}

		this.checkSlots()
		this.restorePaneConfig()
	},

	methods: {
		/**
		 * handle the swipe event
		 *
		 * @param {TouchEvent} e The touch event
		 * @param {import('@vueuse/core').SwipeDirection} direction The swipe direction of the event
		 */
		handleSwipe(e, direction) {
			const minSwipeX = 70
			const touchZone = 300
			if (Math.abs(this.swiping.lengthX) > minSwipeX) {
				if (this.swiping.coordsStart.x < (touchZone / 2) && direction === 'right') {
					emit('toggle-navigation', {
						open: true,
					})
				} else if (this.swiping.coordsStart.x < touchZone * 1.5 && direction === 'left') {
					emit('toggle-navigation', {
						open: false,
					})
				}
			}
		},

		handlePaneResize(event) {
			const listPaneSize = parseInt(event.panes[0].size, 10)
			browserStorage.setItem(this.paneConfigID, JSON.stringify(listPaneSize))
			this.listPaneSize = listPaneSize
			/**
			 * Emitted when the list pane is resized by the user
			 */
			this.$emit('resizeList', { size: listPaneSize })
			console.debug('AppContent pane config', listPaneSize)
		},

		// $slots is not reactive, we need to update this manually
		checkSlots() {
			this.hasList = !!this.$slots.list
			this.hasContent = !!this.$slots.default
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
	position: initial;
	z-index: 1000;
	flex-basis: 100vw;
	height: 100%;
	// Overriding server styles TODO: cleanup!
	margin: 0 !important;
	background-color: var(--color-main-background);
	min-width: 0;

	&:not(.app-content--has-list) {
		overflow: auto;
	}
}

.app-content-wrapper {
	position: relative;
	width: 100%;
	height: 100%;
}

// Mobile list/details handling
.app-content-wrapper--no-split {
	&.app-content-wrapper--show-list :deep() {
		.app-content-list {
			display: flex;
		}
		.app-content-details {
			display: none;
		}
	}
	&.app-content-wrapper--show-details :deep() {
		.app-content-list {
			display: none;
		}
		.app-content-details {
			display: block;
		}
	}
}

:deep(.splitpanes.default-theme) {
	.app-content-list {
		max-width: none;
		/* Thin scrollbar is hard to catch on resizable columns */
		scrollbar-width: auto;
	}

	.splitpanes__pane {
		background-color: transparent;
		transition: none;

		&-list {
			min-width: 300px;
			position: sticky;

			@media only screen and (width < $breakpoint-mobile) {
				display: none;
			}
		}

		&-details {
			overflow-y: auto;

			@media only screen and (width < $breakpoint-mobile) {
				min-width: 100%;
			}
		}
	}

	.splitpanes__splitter {
		background-color: var(--color-main-background);
		&::before, &::after {
			background-color: var(--color-border);
		}
	}

	&.splitpanes--vertical .splitpanes__splitter {
		border-inline-start: 1px solid var(--color-border);
	}

	&.splitpanes--horizontal .splitpanes__splitter {
		border-top: 1px solid var(--color-border);
	}
}

.app-content-wrapper--show-list {
	:deep(.app-content-list) {
		max-width: none;
	}
}
</style>
