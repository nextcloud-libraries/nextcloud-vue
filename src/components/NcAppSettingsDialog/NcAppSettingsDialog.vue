<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
Just nest the `AppSettingSections` component into `NcAppSettingsDialog`,
providing the section's name prop. You can put your settings within each
`NcAppSettingsSection` component.

```vue
<template>
	<div>
		<NcButton @click="settingsOpen = true">Show Settings</NcButton>
		<NcAppSettingsDialog v-model:open="settingsOpen" :show-navigation="true" name="Application settings">
			<NcAppSettingsSection id="asci-name-1" name="Example name 1">
				Some example content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-2" name="Example name 2">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-3" name="Example name 3">
				Some example content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-4" name="Example name 4">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-5" name="Example name 5">
				Some example content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-6" name="Example name 6">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-7" name="Example name 7">
				Some example content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-8" name="Example name 8">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-9" name="Example name 9">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-10" name="Example name 10">
				Some more content
			</NcAppSettingsSection>
		</NcAppSettingsDialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			settingsOpen: false,
		}
	},
}
</script>
```

You can also add icons to the section navigation:

```vue
<template>
	<div>
		<NcButton @click="settingsOpen = true">Show Settings</NcButton>
		<NcAppSettingsDialog v-model:open="settingsOpen" :show-navigation="true" name="Application settings">
			<NcAppSettingsSection id="asci-name-1" name="Instagram">
				<template #icon>
					<Instagram :size="20" />
				</template>
				<p style="height: 100vh;">
					Instagram setting
				</p>
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-2" name="Mastodon">
				<template #icon>
					<Mastodon :size="20" />
				</template>
				<p style="height: 100vh;">
					Mastodon setting
				</p>
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-3" name="Twitch">
				<template #icon>
					<Twitch :size="20" />
				</template>
				<p style="height: 100vh;">
					Twitch setting
				</p>
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-4" name="Twitter">
				<template #icon>
					<Twitter :size="20" />
				</template>
				Twitter setting
			</NcAppSettingsSection>
		</NcAppSettingsDialog>
	</div>
</template>

<script>
import Instagram from 'vue-material-design-icons/Instagram.vue'
import Mastodon from 'vue-material-design-icons/Mastodon.vue'
import Twitch from 'vue-material-design-icons/Twitch.vue'
import Twitter from 'vue-material-design-icons/Twitter.vue'

export default {
	components: {
		Instagram,
		Mastodon,
		Twitch,
		Twitter,
	},
	data() {
		return {
			settingsOpen: false,
		}
	},
}
</script>
```
</docs>

<template>
	<NcModal v-if="open"
		:additional-trap-elements="additionalTrapElements"
		:close-button-contained="!isMobile"
		close-on-click-outside
		class="app-settings"
		:container="container"
		content-classes="app-settings__content"
		size="large"
		:name="name"
		@update:show="handleCloseModal">
		<div class="app-settings__wrapper">
			<nav class="app-settings__nav" :aria-label="t('Application settings')" tabindex="-1">
				<ul class="navigation-list">
					<li v-for="(section, sectionIndex) in sections" :key="section.id">
						<NcButton ref="navigationButton"
							:aria-current="section.id === selectedSection ? 'page' : undefined"
							:class="{ 'navigation-list__link--icon': hasNavigationIcons }"
							:href="`#settings-section_${section.id}`"
							:type="section.id === selectedSection ? 'primary' : 'tertiary'"
							alignment="start"
							wide
							@keydown.down="openSection(sectionIndex + 1)"
							@keydown.up="openSection(sectionIndex - 1)"
							@keydown.left="openSection(sectionIndex + (isRTL ? 1 : -1))"
							@keydown.right="openSection(sectionIndex + (isRTL ? -1 : +1))"
							@keydown.tab.prevent="() => {/* noop */}"
							@click.prevent="openSection(sectionIndex)">
							<template v-if="hasNavigationIcons" #icon>
								<div class="navigation-list__link-icon">
									<NcVNodes v-if="section.icon" :vnodes="section.icon" />
								</div>
							</template>
							{{ section.name }}
						</NcButton>
					</li>
				</ul>
			</nav>
			<div ref="settingsScroller" style="overflow-y: auto; flex: 1">
				<slot />
			</div>
		</div>
	</NcModal>
</template>

<script>
import { warn } from 'vue'
import { useIsMobile } from '../../composables/useIsMobile/index.ts'
import { t } from '../../l10n.js'
import { isRTL as checkRTL } from '@nextcloud/l10n'
import NcButton from '../NcButton/index.js'
import NcModal from '../NcModal/index.js'
import NcVNodes from '../NcVNodes/index.js'

const isRTL = checkRTL()

export default {

	name: 'NcAppSettingsDialog',

	components: {
		NcButton,
		NcModal,
		NcVNodes,
	},

	provide() {
		return {
			getSelectedSection: () => this.selectedSection,
			registerSection: this.registerSection,
			unregisterSection: this.unregisterSection,
		}
	},

	props: {
		/**
		 * Determines the open / closed state of the modal
		 */
		open: {
			type: Boolean,
			required: true,
		},
		/**
		 * Shows the navigation on desktop if true
		 */
		showNavigation: {
			type: Boolean,
			default: false,
		},

		/**
		 * Selector for the popover container
		 */
		container: {
			type: String,
			default: 'body',
		},

		/**
		 * Name of the settings
		 */
		name: {
			type: String,
			default: '',
		},

		/**
		 * Additional elements to add to the focus trap
		 */
		additionalTrapElements: {
			type: Array,
			default: () => [],
		},

	},

	emits: ['update:open'],

	setup() {
		return {
			t,
			isRTL,
			isMobile: useIsMobile(),
		}
	},

	data() {
		return {
			selectedSection: '',
			linkClicked: false,
			addedScrollListener: false,
			scroller: null,
			/**
			 * Currently registered settings sections
			 * @type {{ id: string, name: string, icon?: import('vue').VNode[] }[]}
			 */
			sections: [],
		}
	},

	computed: {
		/**
		 * Check if one or more navigation entries provide icons
		 */
		hasNavigationIcons() {
			return this.sections.some(({ icon }) => !!icon)
		},

		hasNavigation() {
			if (this.isMobile || !this.showNavigation) {
				return false
			} else {
				return true
			}
		},

		settingsNavigationAriaLabel() {
			return t('Settings navigation')
		},
	},

	// updated() {
	// 	// Check that the scroller element has been mounted
	// 	if (!this.$refs.settingsScroller) {
	// 		return
	// 	}
	// 	// Get the scroller element
	// 	this.scroller = this.$refs.settingsScroller
	// 	if (!this.addedScrollListener) {
	// 		this.scroller.addEventListener('scroll', this.handleScroll)
	// 		this.addedScrollListener = true
	// 	}

	// },

	methods: {
		/**
		 * Called when a new section is registered
		 * @param {string} id The section ID
		 * @param {string} name The section name
		 * @param {import('vue').VNode[]|undefined} icon Optional icon component
		 */
		registerSection(id, name, icon) {
			// Check for the uniqueness of section names
			if (this.sections.some(({ id: otherId }) => id === otherId)) {
				throw new Error(`Duplicate section id found: ${id}. Settings navigation sections must have unique section ids.`)
			}
			if (this.sections.some(({ name: otherName }) => name === otherName)) {
				warn(`Duplicate section name found: ${name}. Settings navigation sections must have unique section names.`)
			}

			const newSections = [...this.sections, { id, name, icon }]
			// Sort sections by order in slots
			this.sections = newSections.sort(({ id: idA }, { id: idB }) => {
				const indexOf = (id) => this.$slots.default?.().indexOf(vnode => vnode?.props?.id === id) ?? -1
				return indexOf(idA) - indexOf(idB)
			})

			// If this is the first section registered, set it as selected
			if (this.sections.length === 1) {
				this.selectedSection = id
			}
		},

		/**
		 * Called when a section is unregistered to remove it from dialog
		 * @param {string} id The section ID
		 */
		unregisterSection(id) {
			this.sections = this.sections.filter(({ id: otherId }) => id !== otherId)

			// If the current section is unregistered, set the first section as selected
			if (this.selectedSection === id) {
				this.selectedSection = this.sections[0]?.id ?? ''
			}
		},

		/**
		 * Scrolls the content to the selected settings section.absolute
		 *
		 * @param {string} item the ID of the section
		 */
		handleSettingsNavigationClick(item) {
			this.selectedSection = item
			// --- WIP ---
			// this.linkClicked = true
			// document.getElementById('settings-section_' + item).scrollIntoView({
			// 	behavior: 'smooth',
			// 	inline: 'nearest',
			// })
			// this.selectedSection = item
			// setTimeout(() => {
			// 	this.linkClicked = false
			// }, 1000)
		},

		openSection(sectionIndex) {
			if (sectionIndex < 0 || sectionIndex >= this.sections.length) {
				return
			}
			this.selectedSection = this.sections[sectionIndex].id
			this.$refs.navigationButton[sectionIndex].$el.focus()
		},

		handleCloseModal(isOpen) {
			if (isOpen) {
				return
			}

			this.$emit('update:open', false)
			// Remove scroll listener each time the modal is closed
			// this.scroller.removeEventListener('scroll', this.handleScroll)
			// this.addedScrollListener = false
			// this.scroller.scrollTop = 0
		},

		handleScroll() {
			if (!this.linkClicked) {
				this.unfocusNavigationItem()
			}
		},

		// Remove selected section once the user starts scrolling
		// unfocusNavigationItem: debounce(function() {
		// 	this.selectedSection = ''
		// 	if (document.activeElement.className.includes('navigation-list__link')) {
		// 		document.activeElement.blur()
		// 	}
		// }, 300),
	},
}

</script>

<style lang="scss" scoped>
.app-settings {
	:deep(.modal-wrapper .modal-container) {
		overflow: hidden;
	}

	* {
		box-sizing: border-box;
	}
}

.app-settings {
	:deep &__navigation {
		min-width: 200px;
		margin-inline-end: calc(4 * var(--default-grid-baseline));
		overflow-x: hidden;
		overflow-y: auto;
		position: relative;
	}

	:deep &__content {
		padding-inline: calc(4 * var(--default-grid-baseline));
	}

	&__wrapper {
		display: flex;
		flex-direction: row;
		gap: calc(4 * var(--default-grid-baseline));
		height: 100%;
	}

	&__nav {
		background-color: var(--color-background-dark);
		padding: calc(2 * var(--default-grid-baseline));
		overflow-y: auto;
	}

	.navigation-list {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: calc(2 * var(--default-grid-baseline));
	}
}

.navigation-list {
	&__link {
		&--active {
			background-color: var(--color-primary-element-light) !important;
		}

		&-icon {
			display: flex;
			justify-content: center;
			align-content: center;
			width: calc(var(--default-clickable-area) - 2 * var(--default-grid-baseline));
			max-width: calc(var(--default-clickable-area) - 2 * var(--default-grid-baseline));
		}
	}
}

@media only screen and (max-width: $breakpoint-mobile) {
	.app-settings {
		&__wrapper {
			flex-direction: column;
		}

		.navigation-list {
			flex-direction: row;
		}
	}
}

@media only screen and (max-width: $breakpoint-small-mobile) {
	.app-settings {
		:deep .dialog__name {
			padding-inline-start: 16px;
		}
	}
}
</style>
