<!--
  - SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description

This component provides the default container of all apps.
It _MUST_ be used as the main wrapper of your app.
It includes the Navigation, the App content and the Sidebar.

It also will set the skip content buttons needed for accessibility.

### Standard usage

```vue
	<template>
		<NcContent app-name="forms">
			<NcAppNavigation>
				<template #list>
					<NcAppNavigationNew text="Create article" />
					<NcAppNavigationItem name="My navigation" title="My title">
						<template #icon>
							<Check :size="20" />
						</template>
					</NcAppNavigationItem>
				</template>
			</NcAppNavigation>
			<NcAppContent>
				<h2>Your main app content here</h2>
				<NcButton @click="opened = !opened">Toggle sidebar</NcButton>
			</NcAppContent>
			<NcAppSidebar v-if="opened" name="cat-picture.jpg" @close="opened=false">
				Sidebar content
			</NcAppSidebar>
		</NcContent>
	</template>
	<script>
	import Check from 'vue-material-design-icons/Check'

	export default {
		components: {
			Check,
		},
		data() {
			return {
				opened: false,
			}
		}
	}
	</script>
	<style>
		#content-vue {
			position: relative;
			width: 800px;
			height: 400px;
		}
	</style>
```

</docs>

<template>
	<div id="content-vue" :class="['content', `app-${appName.toLowerCase()}`]">
		<Teleport to="#skip-actions">
			<div class="vue-skip-actions__container">
				<div class="vue-skip-actions__headline">
					{{ t('Keyboard navigation help') }}
				</div>
				<div class="vue-skip-actions__buttons">
					<NcButton v-show="hasAppNavigation"
						href="#app-navigation-vue"
						variant="tertiary"
						@click.prevent="openAppNavigation"
						@focusin="currentFocus = 'navigation'"
						@mouseover="currentFocus = 'navigation'">
						{{ t('Skip to app navigation') }}
					</NcButton>
					<NcButton href="#app-content-vue"
						variant="tertiary"
						@focusin="currentFocus = 'content'"
						@mouseover="currentFocus = 'content'">
						{{ t('Skip to main content') }}
					</NcButton>
				</div>
				<NcIconSvgWrapper v-show="!isMobile"
					class="vue-skip-actions__image"
					:svg="currentImage"
					size="auto" />
			</div>
		</Teleport>
		<slot />
	</div>
</template>

<script>
import { emit } from '@nextcloud/event-bus'
import { useIsMobile } from '../../composables/useIsMobile/index.js'
import { t } from '../../l10n.js'

import NcButton from '../NcButton/NcButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'

/* eslint-disable import/no-unresolved */
import contentSvg from './content-selected.svg?raw'
import navigationSvg from './navigation-selected.svg?raw'
/* eslint-enable import/no-unresolved */

export default {
	name: 'NcContent',
	components: {
		NcButton,
		NcIconSvgWrapper,
	},
	provide() {
		return {
			'NcContent:setHasAppNavigation': this.setAppNavigation,
			'NcContent:selector': '#content-vue',
		}
	},
	props: {
		appName: {
			type: String,
			required: true,
		},
	},
	setup() {
		const isMobile = useIsMobile()
		return {
			isMobile,
		}
	},
	data() {
		return {
			hasAppNavigation: false,
			currentFocus: '', // unknown
		}
	},
	computed: {
		currentImage() {
			if (this.currentFocus === 'navigation') {
				return navigationSvg
			}
			return contentSvg
		},
	},
	beforeMount() {
		const container = document.getElementById('skip-actions')
		if (container) {
			// clear default buttons
			container.innerHTML = ''
			// add class for scoping styles
			container.classList.add('vue-skip-actions')
		}
	},
	methods: {
		t,
		openAppNavigation() {
			emit('toggle-navigation', { open: true })
			this.$nextTick(() => {
				window.location.hash = 'app-navigation-vue'
				// we need to manually focus if the window location is already set to the app-navigation then it will not focus again
				document.getElementById('app-navigation-vue').focus()
			})
		},
		setAppNavigation(value) {
			this.hasAppNavigation = value
			// If app navigation is available and no focus was set yet, set it to navigation as it is the first button
			if (this.currentFocus === '') {
				this.currentFocus = 'navigation'
			}
		},
	},
}
</script>

<style lang="scss">
// Remove server stylings and add a backdrop
#skip-actions.vue-skip-actions:focus-within {
	top: 0!important;
	inset-inline-start: 0!important;
	width: 100vw;
	height: 100vh;
	padding: var(--body-container-margin)!important;
	backdrop-filter: brightness(50%);
}
</style>

<style lang="scss" scoped>
.vue-skip-actions {
	&__container {
		background-color: var(--color-main-background);
		border-radius: var(--border-radius-large);
		padding: 22px;
	}

	&__headline {
		font-weight: bold;
		font-size: 20px;
		line-height: 30px;
		margin-bottom: 12px;
	}

	&__buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;

		> * {
			// Ensure buttons are same width on smaller screens (container wrapped)
			flex: 1 0 fit-content;
		}
	}

	&__image {
		margin-top: 12px;
	}
}

.content {
	display: flex;
	width: calc(100% - var(--body-container-margin) * 2);
	border-radius: var(--body-container-radius);
	height: var(--body-height);
	overflow: hidden;
	padding: 0;

	&:not(.with-sidebar--full) {
		position: fixed;
	}

	&,
	& * {
		box-sizing: border-box;
	}
}
</style>
