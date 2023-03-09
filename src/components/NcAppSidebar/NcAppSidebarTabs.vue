<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
  - @copyright Copyright (c) 2020 Simon Belbeoch <simon.belbeoch@gmail.com>
  -
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<script>
import Vue from 'vue'

const IsValidString = function(value) {
	return value && typeof value === 'string' && value.trim() !== ''
}

const IsValidStringWithoutSpaces = function(value) {
	return IsValidString(value) && value.indexOf(' ') === -1
}

export default {
	name: 'NcAppSidebarTabs',

	props: {
		/**
		 * Id of the tab to activate
		 */
		active: {
			type: String,
			default: '',
		},
	},

	emits: ['update:active'],

	data() {
		return {
			/**
			 * The tab component instances to build the tab navbar from.
			 */
			tabs: [],
		}
	},

	computed: {
		currentTabIndex() {
			return this.tabs.findIndex(tab => tab.componentOptions.propsData.id === this.active)
		},
	},

	methods: {

		/**
		 * Set the current active tab
		 *
		 * @param {string} id the id of the tab
		 * @param {object} $event The click event
		 */
		setActive(id, $event) {
			$event?.preventDefault()
			this.$emit('update:active', id)
		},

		/**
		 * Focus the previous tab
		 * and emit to the parent component
		 */
		focusPreviousTab() {
			if (this.currentTabIndex > 0) {
				this.setActive(this.tabs[this.currentTabIndex - 1].componentOptions.propsData.id)
			}
			this.focusActiveTab() // focus nav item
		},

		/**
		 * Focus the next tab
		 * and emit to the parent component
		 */
		focusNextTab() {
			if (this.currentTabIndex < this.tabs.length - 1) {
				this.setActive(this.tabs[this.currentTabIndex + 1].componentOptions.propsData.id)
			}
			this.focusActiveTab() // focus nav item
		},

		/**
		 * Focus the first tab
		 * and emit to the parent component
		 */
		focusFirstTab() {
			this.setActive(this.tabs[0].componentOptions.propsData.id)
			this.focusActiveTab() // focus nav item
		},

		/**
		 * Focus the last tab
		 * and emit to the parent component
		 */
		focusLastTab() {
			this.setActive(this.tabs[this.tabs.length - 1].componentOptions.propsData.id)
			this.focusActiveTab() // focus nav item
		},

		/**
		 * Focus the current active tab
		 */
		focusActiveTab() {
			// We have to wait until the component finished rendering
			this.$nextTick(
				() => this.$el.querySelector('#' + this.active).focus()
			)
		},

		/**
		 * Focus the content on tab
		 * see aria accessibility guidelines
		 */
		focusActiveTabContent() {
			// We have to wait until the component finished rendering
			this.$nextTick(
				() => this.$el.querySelector('#tab-' + this.active).focus()
			)
		},

		onKeydown($event) {
			$event.preventDefault()
			// Ensure the key event is 'exact'
			if (['ctrl', 'shift', 'alt', 'meta'].some(modifier => $event[`${modifier}Key`])) {
				return
			}
			// Left
			if ($event.keyCode === 37) {
				this.focusPreviousTab()
			}
			// Right
			if ($event.keyCode === 39) {
				this.focusNextTab()
			}
			// Tab
			if ($event.keyCode === 9) {
				this.focusActiveTabContent()
			}
			// Page-Up
			if ($event.keyCode === 33) {
				this.focusFirstTab()
			}
			// Page-Down
			if ($event.keyCode === 34) {
				this.focusLastTab()
			}
		},
	},

	/**
	 * The render function to display the component
	 *
	 * @param {Function} h The function to create VNodes
	 * @return {object|undefined} The created VNode
	 */
	render(h) {
		/**
		 * Follows the tab aria guidelines
		 * https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html
		 */
		 if (!this.$slots.default) {
			this.tabs = []
			return
		}

		// Find all valid children (AppSidebarTab, other components, text nodes, etc.)
		const children = this.$slots.default.filter(elem => elem.tag || elem.text.trim())

		// Find all valid instances of AppSidebarTab
		const invalidTabs = []
		let tabs = children.reduce((tabs, tab) => {
			const tabProps = tab?.componentOptions?.propsData
			// Make sure all required props are provided and valid
			if (IsValidString(tabProps?.name)
				&& IsValidStringWithoutSpaces(tabProps?.id)
				&& (IsValidStringWithoutSpaces(tabProps?.icon) || tab?.data?.scopedSlots?.icon)) {
				tabs.push(tab)
			} else {
				invalidTabs.push(tab)
			}
			return tabs
		}, [])

		// Tabs are optional, but you can use either tabs or non-tab-content only
		if (tabs.length !== 0 && tabs.length !== children.length) {
			Vue.util.warn('Mixing tabs and non-tab-content is not possible.')
			invalidTabs.map(invalid => console.debug('Ignoring invalid tab', invalid))
		}

		// We sort the tabs by their order or by their name
		tabs = tabs.sort((a, b) => {
			const orderA = a.componentOptions.propsData.order || 0
			const orderB = b.componentOptions.propsData.order || 0
			if (orderA === orderB) {
				return OC.Util.naturalSortCompare(a.componentOptions.propsData.name, b.componentOptions.propsData.name)
			}
			return orderA - orderB
		})

		let active = this.active
		// If the active tab id is invalid, we initialize it
		if (!tabs.some(tab => tab.componentOptions.propsData.id === active)) {
			active = tabs.length > 0
				? tabs[0].componentOptions.propsData.id
				: ''
			this.setActive(active)
		}

		this.tabs = tabs

		const elements = []
		// tabs navigation
		if (tabs.length > 1) {
			elements.push(h('nav',
				{
					class: 'app-sidebar-tabs__nav',
					attrs: {
						role: 'tablist',
					},
					on: {
						keydown: this.onKeydown,
					},
				},
				[h('ul', {},
					tabs.map(tab => {
						const tabProps = tab.componentOptions.propsData
						const isActive = (active === tabProps.id)
						return h('li',
							{
								class: 'app-sidebar-tabs__tab',
							},
							[h('a',
								{
									class: { active: isActive },
									attrs: {
										id: tabProps.id,
										'aria-controls': `tab-${tabProps.id}`,
										'aria-selected': isActive,
										'data-id': tabProps.id,
										href: `#tab-${tabProps.id}`,
										tabindex: isActive ? undefined : -1,
										role: 'tab',
									},
									on: {
										click: ($event) => this.setActive(tabProps.id, $event),
									},
								},
								[
									h('span',
										{ class: 'app-sidebar-tabs__tab-icon' },
										[tab.data.scopedSlots?.icon?.() || h('span', { class: tabProps.icon })]
									),
									tabProps.name,
								]
							)]
						)
					})
				)]
			))
		}

		// tabs content
		elements.push(h('div', { class: ['app-sidebar-tabs__content', { 'app-sidebar-tabs__content--multiple': tabs.length > 1 }] }, this.$slots.default))

		return h('div', { class: 'app-sidebar-tabs' }, elements)
	},
}
</script>
<style lang="scss" scoped>
.app-sidebar-tabs {
	display: flex;
	flex-direction: column;
	min-height: 0;
	flex: 1 1 100%;

	&__nav {
		margin-top: 10px;
		ul {
			display: flex;
			justify-content: stretch;
		}
	}
	&__tab {
		display: block;
		flex: 1 1;
		min-width: 0;
		text-align: center;
		a {
			position: relative;
			display: block;
			overflow: hidden;
			padding: 25px 5px 5px 5px;
			transition: color var(--animation-quick), opacity var(--animation-quick), border-color var(--animation-quick);
			text-align: center;
			white-space: nowrap;
			text-overflow: ellipsis;
			opacity: $opacity_normal;
			color: var(--color-main-text);
			border-bottom: 1px solid var(--color-border);

			&:hover,
			&:focus,
			&:active,
			&.active {
				opacity: $opacity_full;
				.app-sidebar-tabs__tab-icon {
					opacity: $opacity_full;
				}
			}
			&:not(.active):hover,
			&:not(.active):focus {
				border-bottom-color: var(--color-background-darker);
				box-shadow: inset 0 -1px 0 var(--color-background-darker);
			}
			&.active {
				color: var(--color-main-text);
				border-bottom-color: var(--color-main-text);
				box-shadow: inset 0 -1px 0 var(--color-main-text);
				font-weight: bold;
			}
			// differentiate the two for accessibility purpose
			// make sure the user knows she's focusing the navigation
			// and can use arrows/home/pageup...
			&:focus {
				border-bottom-color: var(--color-primary-element);
				box-shadow: inset 0 -1px 0 var(--color-primary-element);
			}
		}
	}

	&__tab-icon {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 25px;
		transition: opacity var(--animation-quick);
		opacity: $opacity_normal;

		& > span {
			display: flex;
			align-items: center;
			justify-content: center;
			background-size: 16px;
		}
	}

	&__content {
		position: relative;
		// take full available height
		min-height: 0;
		height: 100%;
		// force the use of the tab component if more than one tab
		// you can just put raw content if you don't use tabs
		&--multiple > :not(section) {
			display: none;
		}
	}
}
</style>
