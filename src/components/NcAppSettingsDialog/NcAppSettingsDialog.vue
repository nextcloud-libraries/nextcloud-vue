<!--
 - @copyright Copyright (c) 2020 Marco Ambrosini <marcoambrosini@icloud.com>
 -
 - @author Marco Ambrosini <marcoambrosini@icloud.com>
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
		:additional-trap-elements="additionalTrapElements"
		:container="container"
		:name="name"
		:navigation-classes="['app-settings__navigation']"
		class="app-settings"
		size="large"
		@update:open="handleCloseModal">
		<template v-if="showNavigation" #navigation="{ isCollapsed }">
			<ul v-if="!isCollapsed"
				:aria-label="settingsNavigationAriaLabel"
				class="navigation-list"
				role="tablist">
				<li v-for="item in navigationItems" :key="item.id">
					<a :class="item.class"
						:aria-selected="item.id === selectedSection"
						role="tab"
						tabindex="0"
						@click="handleSettingsNavigationClick(item.id)"
						@keydown="handleLinkKeydown($event, item.id)"
						v-text="item.name" />
				</li>
			</ul>
		</template>
		<div ref="scroller" class="app-settings__content">
			<slot />
		</div>
	</NcDialog>
</template>

<script>
import { NcDialog } from '../NcDialog/index.ts'
import { t } from '../../l10n.js'

import debounce from 'debounce'

export default {

	name: 'NcAppSettingsDialog',

	components: {
		NcDialog,
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

	data() {
		return {
			selectedSection: '',
			linkClicked: false,
		}
	},

	computed: {
		settingsNavigationAriaLabel() {
			return t('Settings navigation')
		},

		/**
		 * Builds the settings navigation menu
		 *
		 * @return {Array} the navigation items
		 */
		navigationItems() {
			const slots = this.$slots.default || []

			// Array of navigationitems strings
			const navigationItems = slots.filter(vNode => vNode.componentOptions).map(vNode => {
				return {
					id: vNode.componentOptions.propsData?.id,
					name: vNode.componentOptions.propsData?.name,
					class: {
						'navigation-list__link': true,
						'navigation-list__link--active': vNode.componentOptions.propsData?.id === this.selectedSection,
					},
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
	},

	mounted() {
		// Select first settings section
		this.selectedSection = this.$slots.default[0].componentOptions.propsData.id
	},

	methods: {
		/**
		 * Scrolls the content to the selected settings section.absolute
		 *
		 * @param {string} item the ID of the section
		 */
		handleSettingsNavigationClick(item) {
			this.linkClicked = true
			document.getElementById('settings-section_' + item).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
			this.selectedSection = item
			setTimeout(() => {
				this.linkClicked = false
			}, 1000)
		},

		handleCloseModal() {
			this.$refs.scroller.scrollTop = 0
			this.$emit('update:open', false)
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

		handleLinkKeydown(keyDownEvent, item) {
			if (keyDownEvent.code === 'Enter') {
				this.handleSettingsNavigationClick(item)
			}
		},
	},
}

</script>

<style lang="scss" scoped>
.app-settings {
	&__content {
		overflow-y: auto;
		overflow-x: hidden;
		padding: 24px;
		width: 100%;
		height: 100%;
	}

	:deep(.modal-container) {
		height: 90%;
	}
}

.navigation-list {
	height: 100%;
	box-sizing: border-box;
	overflow-y: auto;
	padding: 12px;

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

		&:hover, &:focus {
			background-color: var(--color-background-hover);
		}

		&--active {
			background-color: var(--color-primary-element-light) !important;
		}
	}
}

</style>
