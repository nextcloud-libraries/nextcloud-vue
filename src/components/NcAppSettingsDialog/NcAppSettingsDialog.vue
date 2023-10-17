<!--
 - @copyright Copyright (c) 2020 Marco Ambrosini <marcoambrosini@icloud.com>
 -
 - @author Marco Ambrosini <marcoambrosini@icloud.com>
 - @author Ferdinand Thiessen <opensource@fthiessen.de>
 -
 - @license AGPL-3.0-or-later
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
</docs>

<template>
	<NcDialog v-if="open"
		v-bind="dialogProperties"
		@update:open="handleCloseModal">
		<template #navigation="{ isCollapsed }">
			<ul :aria-label="settingsNavigationAriaLabel"
				:class="{ 'navigation-list': true, 'navigation-list--collapsed': isCollapsed }"
				role="tablist">
				<li v-for="item in getNavigationItems" :key="item.id">
					<a :aria-selected="item.id === selectedSection"
						:class="{
							'navigation-list__link': true,
							'navigation-list__link--active': item.id === selectedSection,
						}"
						role="tab"
						tabindex="0"
						@click="handleSettingsNavigationClick(item.id)"
						@keydown.enter="handleSettingsNavigationClick(item.id)">{{ item.name }}</a>
				</li>
			</ul>
		</template>
		<div ref="settingsScroller">
			<slot />
		</div>
	</NcDialog>
</template>

<script>
import NcDialog from '../NcDialog/index.js'
import isMobile from '../../mixins/isMobile/index.js'
import { t } from '../../l10n.js'

import debounce from 'debounce'

export default {

	name: 'NcAppSettingsDialog',

	components: {
		NcDialog,
	},

	mixins: [isMobile],

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

	data() {
		return {
			selectedSection: '',
			linkClicked: false,
			addedScrollListener: false,
			scroller: null,
		}
	},

	computed: {
		dialogProperties() {
			return {
				additionalTrapElements: this.additionalTrapElements,
				class: 'app-settings',
				container: this.container,
				contentClasses: 'app-settings__content',
				size: 'large',
				name: this.name,
				navigationClasses: 'app-settings__navigation',
			}
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

		getNavigationItems() {
			return this.getSettingsNavigation(this.$slots.default)
		},
	},

	mounted() {
		// Select first settings section
		this.selectedSection = this.$slots.default[0].componentOptions.propsData.id
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
		 * Builds the settings navigation menu
		 *
		 * @param {object} slots The default slots object passed from the render function.
		 * @return {Array} the navigation items
		 */
		getSettingsNavigation(slots) {
			// Array of navigationitems strings
			const navigationItems = slots.filter(vNode => vNode.componentOptions).map(vNode => {
				return {
					id: vNode.componentOptions.propsData?.id,
					name: vNode.componentOptions.propsData?.name,
				}
			})
			const navigationNames = slots.map(item => item.name)
			const navigationIds = slots.map(item => item.id)

			// Check for the uniqueness of section names
			navigationItems.forEach((element, index) => {
				const newNamesArray = [...navigationNames]
				const newIdArray = [...navigationIds]
				newNamesArray.splice(index, 1)
				newIdArray.splice(index, 1)
				if (newNamesArray.includes(element.name)) {
					throw new Error(`Duplicate section name found: ${element}. Settings navigation sections must have unique section names.`)
				}
				if (newIdArray.includes(element.id)) {
					throw new Error(`Duplicate section id found: ${element}. Settings navigation sections must have unique section ids.`)
				}
			})
			return navigationItems
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
	&__navigation {
		min-width: 200px;
		margin-right: 20px;
		overflow-x: hidden;
		overflow-y: auto;
		position: relative;
		height: 100%;
	}
	&__content {
		max-width: 100vw;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 24px;
		width: 100%;
	}
}

.navigation-list {
	height: 100%;
	box-sizing: border-box;
	overflow-y: auto;
	padding: 12px;

	&--collapsed {
		display: flex;
		flex-direction: row;
		gap: 6px;
	}

	&__link {
		display: block;
		font-size: 16px;
		height: $clickable-area;
		margin: 4px 0;
		line-height: $clickable-area;
		border-radius: var(--border-radius-pill);
		font-weight: bold;
		padding: 0 20px;
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
	}
}

</style>
