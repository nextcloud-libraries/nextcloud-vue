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
		<NcAppSettingsDialog :open.sync="settingsOpen" :show-navigation="true" name="Application settings">
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
		<NcAppSettingsDialog :open.sync="settingsOpen" :show-navigation="true" name="Application settings">
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
	<NcDialog
		v-if="open"
		:navigation-aria-label="settingsNavigationAriaLabel"
		v-bind="dialogProperties"
		@update:open="handleCloseModal">
		<template v-if="hasNavigation" #navigation="{ isCollapsed }">
			<ul
				v-if="!isCollapsed"
				class="navigation-list">
				<li v-for="section in sections" :key="section.id">
					<a
						:aria-current="`${section.id === selectedSection}`"
						class="navigation-list__link"
						:class="{
							'navigation-list__link--active': section.id === selectedSection,
							'navigation-list__link--icon': hasNavigationIcons,
						}"
						:href="`#settings-section_${section.id}`"
						tabindex="0"
						@click.prevent="handleSettingsNavigationClick(section.id)"
						@keydown.enter="handleSettingsNavigationClick(section.id)">
						<div v-if="hasNavigationIcons" class="navigation-list__link-icon">
							<NcVNodes v-if="section.icon" :vnodes="section.icon" />
						</div>
						<span class="navigation-list__link-text">
							{{ section.name }}
						</span>
					</a>
				</li>
			</ul>
		</template>
		<div ref="settingsScroller">
			<slot />
		</div>
	</NcDialog>
</template>

<script>
import debounce from 'debounce'
import Vue from 'vue'
import { useIsMobile } from '../../composables/useIsMobile/index.js'
import { t } from '../../l10n.js'
import NcDialog from '../NcDialog/index.js'
import NcVNodes from '../NcVNodes/index.js'

export default {

	name: 'NcAppSettingsDialog',

	components: {
		NcDialog,
		NcVNodes,
	},

	provide() {
		return {
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
			 *
			 * @type {{ id: string, name: string, icon?: import('vue').VNode[] }[]}
			 */
			sections: [],
		}
	},

	computed: {
		dialogProperties() {
			return {
				additionalTrapElements: this.additionalTrapElements,
				closeOnClickOutside: true,
				class: 'app-settings',
				container: this.container,
				contentClasses: 'app-settings__content',
				size: 'large',
				name: this.name,
				navigationClasses: 'app-settings__navigation',
			}
		},

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

	updated() {
		// Check that the scroller element has been mounted
		if (!this.$refs.settingsScroller) {
			return
		}
		// Get the scroller element
		this.scroller = this.$refs.settingsScroller
		if (!this.addedScrollListener) {
			this.scroller.addEventListener('scroll', this.handleScroll)
			this.addedScrollListener = true
		}
	},

	methods: {
		/**
		 * Called when a new section is registered
		 *
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
				Vue.util.warn(`Duplicate section name found: ${name}. Settings navigation sections must have unique section names.`)
			}

			const newSections = [...this.sections, { id, name, icon }]
			// Sort sections by order in slots
			this.sections = newSections.sort(({ id: idA }, { id: idB }) => {
				const indexOf = (id) => this.$slots.default?.findIndex?.((vnode) => vnode?.componentOptions?.propsData?.id === id) ?? -1
				return indexOf(idA) - indexOf(idB)
			})

			// If this is the first section registered, set it as selected
			if (this.sections.length === 1) {
				this.selectedSection = id
			}
		},

		/**
		 * Called when a section is unregistered to remove it from dialog
		 *
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
			this.linkClicked = true
			document.getElementById('settings-section_' + item).scrollIntoView({
				behavior: 'smooth',
				inline: 'nearest',
			})
			this.selectedSection = item
			setTimeout(() => {
				this.linkClicked = false
			}, 1000)
		},

		handleCloseModal(isOpen) {
			if (isOpen) {
				return
			}

			this.$emit('update:open', false)
			// Remove scroll listener each time the modal is closed
			this.scroller.removeEventListener('scroll', this.handleScroll)
			this.addedScrollListener = false
			this.scroller.scrollTop = 0
		},

		handleScroll() {
			if (!this.linkClicked) {
				this.unfocusNavigationItem()
			}
		},

		// Remove selected section once the user starts scrolling
		unfocusNavigationItem: debounce(function() {
			this.selectedSection = ''
			if (document.activeElement.className.includes('navigation-list__link')) {
				document.activeElement.blur()
			}
		}, 300),
	},
}

</script>

<style lang="scss" scoped>
.app-settings {
	:deep &__navigation {
		min-width: 200px;
		margin-right: calc(4 * var(--default-grid-baseline));
		overflow-x: hidden;
		overflow-y: auto;
		position: relative;
	}
	:deep &__content {
		box-sizing: border-box;
		padding-inline: calc(4 * var(--default-grid-baseline));
	}
}

.navigation-list {
	height: 100%;
	box-sizing: border-box;
	overflow-y: auto;
	padding: calc(3 * var(--default-grid-baseline));

	&__link {
		display: flex;
		align-content: center;
		font-size: 16px;
		height: var(--default-clickable-area);
		margin: 4px 0;
		line-height: var(--default-clickable-area);
		border-radius: var(--border-radius-element, var(--border-radius-pill));
		font-weight: bold;
		padding: 0 calc(4 * var(--default-grid-baseline));
		cursor: pointer;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		background-color: transparent;
		border: none;

		&:hover,
		&:focus {
			background-color: var(--color-background-hover);
		}

		&--active {
			background-color: var(--color-primary-element-light) !important;
		}

		&--icon {
			padding-inline-start: calc(2 * var(--default-grid-baseline));
			gap: var(--default-grid-baseline);
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

@media only screen and (max-width: $breakpoint-small-mobile) {
	.app-settings {
		:deep .dialog__name {
			padding-inline-start: 16px;
		}
	}
}
</style>
