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
providing the section's title prop. You can put your settings within each
`NcAppSettingsSection` component.

```vue
<template>
	<div>
		<NcButton @click="settingsOpen = true">Show Settings</NcButton>
		<NcAppSettingsDialog :open.sync="settingsOpen" :show-navigation="true" title="Application settings">
			<NcAppSettingsSection id="asci-title-1" title="Example title 1">
				Some example content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-title-2" title="Example title 2">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-title-3" title="Example title 3">
				Some example content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-title-4" title="Example title 4">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-title-5" title="Example title 5">
				Some example content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-title-6" title="Example title 6">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-title-7" title="Example title 7">
				Some example content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-title-8" title="Example title 8">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-title-9" title="Example title 9">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-title-10" title="Example title 10">
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

<script>
import NcModal from '../NcModal/index.js'
import isMobile from '../../mixins/isMobile/index.js'
import { t } from '../../l10n.js'

import debounce from 'debounce'

export default {

	name: 'NcAppSettingsDialog',

	components: {
		NcModal,
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
		 * Title of the settings
		 */
		title: {
			type: String,
			default: '',
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
					title: vNode.componentOptions.propsData?.title,
				}
			})
			const navigationTitles = slots.map(item => item.title)
			const navigationIds = slots.map(item => item.id)

			// Check for the uniqueness of section titles
			navigationItems.forEach((element, index) => {
				const newTitlesArray = [...navigationTitles]
				const newIdArray = [...navigationIds]
				newTitlesArray.splice(index, 1)
				newIdArray.splice(index, 1)
				if (newTitlesArray.includes(element.title)) {
					throw new Error(`Duplicate section title found: ${element}. Settings navigation sections must have unique section titles.`)
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

		handleCloseModal() {
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

		handleLinkKeydown(keyDownEvent, item) {
			if (keyDownEvent.code === 'Enter') {
				this.handleSettingsNavigationClick(item)
			}
		},
	},

	render(h) {
		/**
		 * Build the navigation
		 *
		 * @return {object} the navigation
		 */
		const createAppSettingsNavigation = () => {
			if (this.hasNavigation) {
				return [h('div', {
					attrs: {
						class: 'app-settings__navigation',
						role: 'tablist',
						'aria-label': this.settingsNavigationAriaLabel,
					},
				}, [h('ul', {
					attrs: {
						class: 'navigation-list',
						role: 'tablist',
					},
				}, this.getSettingsNavigation(this.$slots.default).map(item => {
					return createListElement(item)
				}))])]
			} else {
				return []
			}
		}

		/**
		 * Build each list element in the navigation
		 *
		 * @param {object} item the navigation item
		 * @return {object} the list element
		 */
		const createListElement = (item) => h('li', {}, [h('a', {
			class: {
				'navigation-list__link': true,
				'navigation-list__link--active': item.id === this.selectedSection,
			},

			attrs: {
				role: 'tab',
				'aria-selected': item.id === this.selectedSection,
				tabindex: '0',
			},

			on: {
				click: () => this.handleSettingsNavigationClick(item.id),
				keydown: () => this.handleLinkKeydown(event, item.id),
			},
		}, item.title)])

		// Return value of the render function
		if (this.open) {
			return h('NcModal', {
				class: [
					'app-settings-modal',
				],
				attrs: {
					container: this.container,
					size: 'large',
				},
				on: {
					close: () => { this.handleCloseModal() },
				},
			}, [
				// main app-settings root element
				h('div', {
					attrs: {
						class: 'app-settings',
					},
				}, [
					// app-settings title
					h('h2', {
						attrs: {
							class: 'app-settings__title',
						},
					}, this.title),

					// app-settings navigation + content
					h(
						'div',
						{
							attrs: {
								class: 'app-settings__wrapper',
							},
						},
						[
							...createAppSettingsNavigation(),
							h('div', {
								attrs: {
									class: 'app-settings__content',
								},
								ref: 'settingsScroller',
							}, this.$slots.default),
						]
					),
				]),
			])
		} else {
			return undefined
		}
	},
}

</script>

<style lang="scss" scoped>

.app-settings-modal :deep(.modal-wrapper .modal-container) {
	display: flex;
	overflow: hidden;
}

.app-settings {
	width: 100%;
	display: flex;
	flex-direction: column;
	min-width: 0;
	&__title {
		min-height: $clickable-area;
		height: $clickable-area;
		line-height: $clickable-area;
		padding-top: 4px; // Same as the close button top spacing
		text-align: center;
	}
	&__wrapper {
		display: flex;
		width: 100%;
		overflow: hidden;
		height: 100%;
		position: relative;
	}
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
		&.-text {
			max-width: 250px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		&:hover,
		&:focus {
			background-color: var(--color-background-hover);
		}
		&--active {
			background-color: var(--color-primary-light) !important;
		}
	}
}

</style>
