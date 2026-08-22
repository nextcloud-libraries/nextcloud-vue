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
	<main id="app-content-vue" class="app-content no-snapper" :class="{ 'app-content--has-list': !!$slots.list }">
		<h1 v-if="pageHeading" class="hidden-visually">
			{{ pageHeading }}
		</h1>

		<template v-if="!!$slots.list">
			<!-- Mobile view does not allow resizeable panes -->
			<div
				v-if="isMobile || layout === 'no-split'"
				class="app-content-wrapper app-content-wrapper--no-split"
				:class="{
					'app-content-wrapper--show-details': showDetails,
					'app-content-wrapper--show-list': !showDetails,
					'app-content-wrapper--mobile': isMobile,
				}">
				<NcAppContentDetailsToggle v-if="showDetails" @click.stop.prevent="showDetails = false" />

				<div v-show="!showDetails" class="app-content-wrapper__list">
					<slot name="list" />
				</div>
				<slot v-if="showDetails" />
			</div>
			<div v-else-if="layout === 'vertical-split' || layout === 'horizontal-split'" class="app-content-wrapper">
				<Splitpanes
					:horizontal="layout === 'horizontal-split'"
					class="default-theme"
					:class="{
						'splitpanes--horizontal': layout === 'horizontal-split',
						'splitpanes--vertical': layout === 'vertical-split',
					}"
					:rtl="isRtl"
					@resized="handlePaneResize">
					<Pane
						class="splitpanes__pane-list"
						:size="listPaneSize || paneDefaults.list.size"
						:minSize="paneDefaults.list.min"
						:maxSize="paneDefaults.list.max">
						<slot name="list" />
					</Pane>

					<Pane
						class="splitpanes__pane-details"
						:size="detailsPaneSize"
						:minSize="paneDefaults.details.min"
						:maxSize="paneDefaults.details.max">
						<slot />
					</Pane>
				</Splitpanes>
			</div>
		</template>
		<slot v-if="!$slots.list" />
	</main>
</template>

<script lang="ts">
import { getBuilder } from '@nextcloud/browser-storage'
import { getCapabilities } from '@nextcloud/capabilities'

/**
 * Content layout used when a list is provided together with the main content.
 */
export type AppContentLayout = 'no-split' | 'vertical-split' | 'horizontal-split'

/**
 * Payload of the `resized` event of the splitpanes component.
 */
interface SplitpanesResizedEvent {
	panes: { min: number, max: number, size: number }[]
}

const browserStorage = getBuilder('nextcloud').persist().build()
const instanceName = (getCapabilities() as { theming?: { name?: string } }).theming?.name ?? 'Nextcloud'
</script>

<script setup lang="ts">
import type { Slot } from 'vue'

import { emit as emitBusEvent } from '@nextcloud/event-bus'
import { useCurrentElement, useSwipe } from '@vueuse/core'
import { Pane, Splitpanes } from 'splitpanes'
import { computed, onMounted, ref, watch } from 'vue'
import NcAppContentDetailsToggle from './NcAppContentDetailsToggle.vue'
import { useIsMobile } from '../../composables/useIsMobile/index.ts'
import { useAppName, useLocalizedAppName } from '../../utils/appName.ts'
import { logger } from '../../utils/logger.ts'
import { isRtl } from '../../utils/rtl.ts'

import 'splitpanes/dist/splitpanes.css'

/**
 * When in mobile view, only the list or the details are shown.
 *
 * If you provide a list, you need to provide a variable
 * that will be set to true by the user when an element of
 * the list gets selected. The details will then show a back
 * arrow to return to the list that will update this model to false.
 */
const showDetails = defineModel<boolean>('showDetails', { default: true })

const {
	disableSwipe = false,
	layout = 'vertical-split',
	listMaxWidth = 40,
	listMinWidth = 15,
	listSize = 20,
	pageHeading = undefined,
	pageTitle = undefined,
	paneConfigKey = '',
} = defineProps<{
	/**
	 * Allows to disable the control by swipe of the app navigation open state.
	 */
	disableSwipe?: boolean

	/**
	 * Allows you to set the default width of the resizable list in % on vertical-split
	 * or respectively the default height on horizontal-split.
	 *
	 * Must be between `listMinWidth` and `listMaxWidth`.
	 *
	 * @default 20
	 */
	listSize?: number

	/**
	 * Allows you to set the minimum width of the list column in % on vertical-split
	 * or respectively the minimum height on horizontal-split.
	 *
	 * @default 15
	 */
	listMinWidth?: number

	/**
	 * Allows you to set the maximum width of the list column in % on vertical-split
	 * or respectively the maximum height on horizontal-split.
	 *
	 * @default 40
	 */
	listMaxWidth?: number

	/**
	 * Specify the config key for the pane config sizes
	 * Default is the global var appName if you use the webpack-vue-config
	 */
	paneConfigKey?: string

	/**
	 * Content layout used when there is a list together with content:
	 * - `vertical-split` - a 2-column layout with list and default content separated vertically
	 * - `no-split` - a single column layout; List is shown when `showDetails` is `false`, otherwise the default slot content is shown with a back button to return to the list.
	 * - 'horizontal-split' - a 2-column layout with list and default content separated horizontally
	 * On mobile screen `no-split` layout is forced.
	 *
	 * @default 'vertical-split'
	 */
	layout?: AppContentLayout

	/**
	 * Specify the `<h1>` page heading
	 */
	pageHeading?: string | null

	/**
	 * Allow setting the page's `<title>`
	 *
	 * If a page heading is set it defaults to `{pageHeading} - {appName} - {instanceName}` e.g. `Favorites - Files - MyPersonalCloud`.
	 * When the page heading and the app name is the same only one is used, e.g. `Files - Files - MyPersonalCloud` is shown as `Files - MyPersonalCloud`.
	 * When setting the prop then the following format will be used: `{pageTitle} - {instanceName}`
	 */
	pageTitle?: string | null
}>()

const emit = defineEmits<{
	/**
	 * Emitted when the list pane is resized by the user
	 */
	resizeList: [payload: { size: number }]

	/**
	 * Emitted when the user clicked the back arrow from the details view
	 *
	 * @param showDetails - The new details state
	 */
	'update:showDetails': [showDetails: boolean]
}>()

defineSlots<{
	/**
	 * Provide the main content to the app content
	 */
	default?: Slot

	/**
	 * Provide a list to the app content
	 */
	list?: Slot
}>()

const appName = useAppName()
const localizedAppName = useLocalizedAppName()
const isMobile = useIsMobile()

const element = useCurrentElement<HTMLElement>()
const swipe = useSwipe(
	// Swiping can be disabled by not providing a target to listen on
	() => disableSwipe ? undefined : element.value,
	{
		onSwipeEnd(_event, direction) {
			const minSwipeX = 70
			const touchZone = 300
			if (Math.abs(swipe.lengthX.value) > minSwipeX) {
				if (swipe.coordsStart.x < (touchZone / 2) && direction === 'right') {
					emitBusEvent('toggle-navigation', {
						open: true,
					})
				} else if (swipe.coordsStart.x < touchZone * 1.5 && direction === 'left') {
					emitBusEvent('toggle-navigation', {
						open: false,
					})
				}
			}
		},
	},
)

/**
 * Size of the list pane as restored from the browser storage
 */
const listPaneSize = ref<number>()

const paneConfigID = computed(() => {
	// If provided, let's use it
	if (paneConfigKey !== '') {
		return `pane-list-size-${paneConfigKey}`
	}

	return `pane-list-size-${appName}`
})

const paneDefaults = computed(() => ({
	list: {
		size: listSize,
		min: listMinWidth,
		max: listMaxWidth,
	},

	// set the inverse values of the details column
	// based on the provided (or default) values of the list column
	details: {
		size: 100 - listSize,
		min: 100 - listMaxWidth,
		max: 100 - listMinWidth,
	},
}))

const detailsPaneSize = computed(() => {
	if (listPaneSize.value) {
		return 100 - listPaneSize.value
	}
	return paneDefaults.value.details.size
})

const realPageTitle = computed<string | null>(() => {
	const entries = new Set<string>()
	if (pageTitle) {
		// when page title is set we only use that
		// we still split to remove duplicated instanceName
		for (const part of pageTitle.split(' - ')) {
			entries.add(part)
		}
	} else if (pageHeading) {
		// when the page heading is provided but not the title
		// then we split to remove duplicates
		// but also add the localized app name
		for (const part of pageHeading.split(' - ')) {
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
})

watch(realPageTitle, () => {
	if (realPageTitle.value !== null) {
		document.title = realPageTitle.value
	}
}, { immediate: true })

watch(() => paneConfigKey, restorePaneConfig, { immediate: true })

onMounted(restorePaneConfig)

/**
 * Handle the resize of the list pane by the user.
 *
 * @param event - The `resized` event of the splitpanes component
 */
function handlePaneResize(event: SplitpanesResizedEvent): void {
	const size = Math.trunc(event.panes[0].size)
	browserStorage.setItem(paneConfigID.value, JSON.stringify(size))
	listPaneSize.value = size
	emit('resizeList', { size })
	logger.debug('[NcAppContent] pane config', { listPaneSize: size })
}

/**
 * Restore the size of the list pane from the browser storage.
 *
 * browserStorage is not reactive, we need to update this manually.
 */
function restorePaneConfig(): void {
	const size = parseInt(browserStorage.getItem(paneConfigID.value) ?? '', 10)
	if (!isNaN(size) && size !== listPaneSize.value) {
		logger.debug('[NcAppContent] pane config', { listPaneSize: size })
		listPaneSize.value = size
	}
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

.app-content-wrapper__list {
	height: 100%;
}
</style>
