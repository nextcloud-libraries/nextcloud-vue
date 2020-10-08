<!--
 - @copyright Copyright (c) 2020 Marco Ambrosini <marcoambrosini@pm.me>
 -
 - @author Marco Ambrosini <marcoambrosini@pm.me>
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
Just nest the `AppSettingSections` component into `AppSettingsDialog`,
providing the section's title prop. You can put your settings within each
`AppSettingsSection` component.

```vue
<template>
	<div>
		<button @click="settingsOpen = true">Show Settings</button>
		<AppSettingsDialog :open.sync="settingsOpen" >
			<AppSettingsSection title="Example title 1">
				Some example content
			</AppSettingsSection>
			<AppSettingsSection title="Example title 2">
				Some more content
			</AppSettingsSection>
		</AppSettingsDialog>
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
import Modal from '../Modal'
import isMobile from '../../mixins/isMobile'
import debounce from 'debounce'

export default {

	name: 'AppSettingsDialog',

	components: {
		Modal,
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
		 * Hides the navigation on desktop if true
		 */
		hideNavigation: {
			type: Boolean,
			default: false,
		},
	},

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
			if (this.isMobile || this.hideNavigation) {
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
		this.selectedSection = this.$slots.default[0].componentOptions.propsData.title
	},

	updated() {
		if (!this.scroller) {
			// Get the scroller element
			this.scroller = this.$el.querySelector('.app-settings__content')
		}
		if (this.scroller && !this.addedScrollListener) {
			this.scroller.addEventListener('scroll', this.handleScroll)
			this.addedScrollListener = true
		}
	},

	beforeDestroy() {
		this.scroller.removeEventListener('scroll', this.handleScroll)
	},
	methods: {

		/**
		 * Builds the settings navigation menu
		 * @param {object} slots The default slots object passed from the render function.
		 * @returns {array} the navigation items
		 */
		getSettingsNavigation(slots) {
			// Array of navigationitems strings
			const navigationItems = slots.filter(vNode => vNode.componentOptions).map(vNode => vNode.componentOptions.propsData?.title)
			// Check for the uniqueness of section titles
			navigationItems.forEach((element, index) => {
				const newArray = [...navigationItems]
				newArray.splice(index, 1)
				if (newArray.indexOf(element) !== -1) {
					throw new Error(`Duplicate section title found: ${element}. Settings navigation sections must have unique section titles.`)
				}
			})
			return navigationItems
		},

		/**
		 * Scrolls the content to the selected settings section.absolute
		 * @param {string} item the name of the section
		 */
		handleSettingsNavigationClick(item) {
			this.linkClicked = true
			document.getElementById('settings-section_' + item.replace(/\s+/g, '')).scrollIntoView({
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
		},

		// Remove selected section once the user starts scrolling
		handleScroll() {
			if (!this.linkClicked) {
				debounce(() => {
					this.selectedSection = ''
					document.activeElement.blur()
				}, 300)
			}
		},

		handleLinkKeydown(keyDownEvent, item) {
			if (keyDownEvent.code === 'Enter') {
				this.handleSettingsNavigationClick(item)
			}
		},
	},

	render(createElement) {
		/**
		 * Build the navigation
		 * @returns {object} the navigation
		 */
		const createAppSettingsNavigation = () => {
			if (this.hasNavigation) {
				return [createElement('div', {
					attrs: {
						class: 'app-settings__navigation',
						role: 'tablist',
						'aria-label': this.settingsNavigationAriaLabel,
					},
				}, [createElement('ul', {
					attrs: {
						class: 'navigation-list',
						role: 'tablist',
					},
				}, this.getSettingsNavigation(this.$slots.default).map(item => {
					return createListElemtent(item)
				}))])]
			} else {
				return []
			}
		}

		/**
		 * Build each list element in the navigation
		 * @param {object} item the navigation item
		 * @returns {object} the list element
		 */
		const createListElemtent = (item) => createElement('li', {}, [createElement('a', {
			class: {
				'navigation-list__link': true,
				'navigation-list__link--active': item === this.selectedSection,
			},

			attrs: {
				role: 'tab',
				'aria-selected': item === this.selectedSection,
				tabindex: '0',
			},

			on: {
				click: () => this.handleSettingsNavigationClick(item),
				keydown: () => this.handleLinkKeydown(event, item),
			},
		}, item)])

		// Return value of the render function
		if (this.open) {
			return createElement('Modal', {
				on: {
					close: () => { this.handleCloseModal() },
				},
			}, [
				createElement('div', {
					attrs: {
						class: 'app-settings',
					},
				}, [...createAppSettingsNavigation(),
					createElement('div', {
						attrs: {
							class: 'app-settings__content',
						},
					}, this.$slots.default)]),
			])
		} else {
			return undefined
		}
	},
}

</script>

<style lang="scss" scoped>

.app-settings {
	padding: 28px 16px;
	display: flex;
	height: 600px;
	width: 100%;
	&__navigation {
		width: 200px;
		margin-right: 20px;
	}
	&__content {
		width: 350px;
		max-width: 100vw;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 0 20px;
	}
}

.navigation-list {
	&__link {
		display: block;
		font-size: 16px;
		height: $clickable-area;
		margin: 4px;
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
			background-color: var(--color-primary-light) !important;
		}
	}
}

</style>
