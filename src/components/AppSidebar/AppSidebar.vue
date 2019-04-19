<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
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

<!-- Follows the tab aria guidelines
	https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html -->

<template>
	<transition name="slide-right">
		<aside id="app-sidebar">
			<header :class="{ 'app-sidebar-header--with-figure': hasFigure }" class="app-sidebar-header">
				<!-- close sidebar button -->
				<a href="#" class="icon-close" :title="t('core', 'close')"
					@click="closeSidebar" />
				<!-- sidebar header illustration/figure -->
				<div v-if="hasFigure" class="app-sidebar-header__figure" :style="{
					backgroundImage: `url(${background})`
				}">
					<slot class="app-sidebar-header__background" name="header" />
				</div>
				<!-- sidebar details -->
				<div :class="{ 'app-sidebar-header__desc--with-star': canStar }" class="app-sidebar-header__desc">
					<!-- favourite icon -->
					<a v-if="canStar" :class="isStarred ? 'icon-starred' : 'icon-star'"
						class="app-sidebar-header__star" @click.prevent="toggleStarred" />
					<!-- main title -->
					<h3 class="app-sidebar-header__title">
						{{ title }}
					</h3>
					<!-- secondary title -->
					<h4 class="app-sidebar-header__subtitle">
						{{ subtitle }}
					</h4>
					<!-- header main menu -->
					<action v-if="actions.length > 0" class="app-sidebar-header__menu" :actions="actions" />
				</div>
				<div v-if="$slots['action']" class="app-sidebar-header__action">
					<slot name="action" />
				</div>
			</header>
			<!-- tabs navigation -->
			<nav v-if="hasMultipleTabs"
				class="app-sidebar-tabs__nav"
				@keydown.left.exact.prevent="focusPreviousTab"
				@keydown.right.exact.prevent="focusNextTab"
				@keydown.tab.exact.prevent="focusActiveTabContent"
				@keydown.page-up.exact.prevent="focusFirstTab"
				@keydown.page-down.exact.prevent="focusLastTab">
				<ul>
					<li v-for="tab in tabs" :key="tab.id" class="app-sidebar-tabs__tab">
						<a :id="tab.id"
							:aria-controls="`tab-${tab.id}`"
							:aria-selected="activeTab === tab.id"
							:class="[tab.icon, { active: activeTab === tab.id }]"
							:data-id="tab.id"
							:href="`#tab-${tab.id}`"
							:tabindex="activeTab === tab.id ? null : -1"
							role="tab"
							@click.prevent="setActive">
							{{ tab.name }}
						</a>
					</li>
				</ul>
			</nav>
			<!-- tabs content -->
			<div :class="{'app-sidebar-tabs__content--multiple': hasMultipleTabs}"
				class="app-sidebar-tabs__content">
				<slot :active-tab="activeTab" />
			</div>
		</aside>
	</transition>
</template>

<script>
import Action from 'Components/Action'

export default {
	name: 'AppSidebar',
	components: {
		Action
	},
	props: {
		actions: {
			type: Array,
			default: () => ([])
		},
		active: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: '',
			required: true
		},
		subtitle: {
			type: String,
			default: ''
		},
		background: {
			type: String,
			default: ''
		},
		starred: {
			type: Boolean,
			default: null
		}
	},
	data() {
		return {
			tabs: [],
			activeTab: '',
			isStarred: this.starred
		}
	},
	computed: {
		canStar() {
			return this.isStarred !== null
		},
		hasFigure() {
			return this.$slots['header'] || this.background
		},
		hasMultipleTabs() {
			return this.tabs.length > 1
		},
		currentTabIndex() {
			return this.tabs.findIndex(tab => tab.id === this.activeTab)
		}
	},
	watch: {
		active: function(active) {
			// prevent running it twice
			if (active !== this.activeTab) {
				this.updateActive()
			}
		},
		starred: function() {
			this.isStarred = this.starred
		}
	},
	mounted() {
		// Init tabs from $children
		this.tabs = this.$children.reduce((tabs, tab) => {
			if (tab.name && typeof tab.name === 'string'
				&& tab.id && typeof tab.id === 'string' && tab.id.indexOf(' ') === -1
				&& tab.icon && typeof tab.icon === 'string' && tab.icon.indexOf(' ') === -1) {
				tabs.push(tab)
			}
			return tabs
		}, [])

		// init active tab
		this.updateActive()
	},
	methods: {
		closeSidebar() {
			this.$emit('close')
		},
		setActive({ target }) {
			const id = target.dataset.id
			this.activeTab = id
			this.$emit('update:active', id)

		},
		focusPreviousTab(e) {
			if (this.currentTabIndex > 0) {
				this.activeTab = this.tabs[this.currentTabIndex - 1].id
				this.$emit('update:active', this.activeTab)
			}
			this.focusActiveTab() // focus nav item
		},
		focusNextTab(e) {
			if (this.currentTabIndex < this.tabs.length - 1) {
				this.activeTab = this.tabs[this.currentTabIndex + 1].id
				this.$emit('update:active', this.activeTab)
			}
			this.focusActiveTab() // focus nav item
		},
		focusFirstTab(e) {
			this.activeTab = this.tabs[0].id
			this.$emit('update:active', this.activeTab)
			this.focusActiveTab() // focus nav item
		},
		focusLastTab(e) {
			this.activeTab = this.tabs[this.tabs.length - 1].id
			this.$emit('update:active', this.activeTab)
			this.focusActiveTab() // focus nav item
		},
		focusActiveTab() {
			this.$el.querySelector('#' + this.activeTab).focus()
		},
		// focus the content on tab
		// see aria accessibility guidelines
		focusActiveTabContent() {
			this.$el.querySelector('#tab-' + this.activeTab).focus()
		},
		updateActive() {
			this.activeTab = this.active
				&& this.tabs.findIndex(tab => tab.id === this.active) !== -1
				? this.active
				: this.tabs
					? this.tabs[0].id
					: ''
		},
		toggleStarred() {
			this.isStarred = !this.isStarred
			this.$emit('update:starred', this.isStarred)
		}
	}
}
</script>
<style lang="scss" scoped>
$header-height: 50px;
$sidebar-min-width: 300px;
$sidebar-max-width: 500px;

$desc-menu-right-margin: 22px;
$desc-vertical-padding: 18px;

/*
	Sidebar: to be used within #content
	#app-content will be shrinked properly
*/
#app-sidebar {
	z-index: 1500;
	height: calc(100vh - #{$header-height});
	width: 27vw;
	min-width: $sidebar-min-width;
	max-width: $sidebar-max-width;
	top: $header-height;
	right:0;

	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	position: -webkit-sticky; // Safari support
	position: sticky;

	overflow-y: auto;
	overflow-x: hidden;

	background: var(--color-main-background);
	border-left: 1px solid var(--color-border);
	.app-sidebar-header {
		> .icon-close {
			position: absolute;
			width: 44px;
			height: 44px;
			top: 0;
			right: 0;
			z-index: 1000;
			opacity: .7;
			&:hover,
			&:active,
			&:focus {
				opacity: 1;
			}
		}

		// header background
		&__figure {
			max-height: 250px;
			height: 250px;
			width: 100%;
			background-size: contain;
			background-position: center;
			background-repeat: no-repeat;
		}

		&__desc {
			position: relative;
			padding: #{$desc-vertical-padding} #{$desc-menu-right-margin * 4} #{$desc-vertical-padding} 10px;
			&--with-star {
				padding-left: 44px;
			}
			// titles
			h3, h4 {
				width: 100%;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				margin: 0;
			}
			// main title
			h3 {
				font-size: 16px;
				padding: 0;
				+ h4 {
					padding-top: 10px;
				}
			}
			// subtitle
			h4 {
				font-size: 14px;
				padding: 0;
				opacity: .7;
			}
			// favourite
			.app-sidebar-header__star {
				display: block;
				width: 44px;
				height: 44px;
				padding: 14px;
				position: absolute;
				top: $desc-vertical-padding - 12px; // aligned with main title
				left: 0;
			}
			// main menu
			.app-sidebar-header__menu {
				position: absolute;
				// aligned vertically in the middle
				right: $desc-menu-right-margin;
				top: 50%;
				margin-top: -22px;
				background-color: var(--color-background-dark);
				border-radius: 44px;
			}
		}

		// sidebar action(s) slot
		&__action {
			display: flex;
			margin: 10px;
			max-height: 50px;
			align-items: center;
		}

		// menu without figure needs to be fixed or
		// it'll go over the close icon
		&:not(.app-sidebar-header--with-figure) {
			.app-sidebar-header__menu {
				background-color: transparent;
				top: 0;
				right: 44px;
				margin-top: 0;
			}
		}
	}
	.app-sidebar-tabs {
		&__nav {
			margin-top: 10px;
			ul {
				display: flex;
				justify-content: stretch;
			}
		}
		&__tab {
			display: block;
			text-align: center;
			flex: 1 1;
			a {
				background-position: center 8px;
				background-size: 16px;
				display: block;
				padding-top: 30px;
				border-bottom: 1px solid var(--color-main-background);
				text-align: center;
				opacity: .7;
				color: var(--color-main-text);
				transition: opacity var(--animation-quick), border-color var(--animation-quick);
				&:hover,
				&:focus,
				&:active,
				&.active {
					opacity: 1;
				}
				&:active,
				&.active {
					border-bottom-color: var(--color-main-text);
				}
				// differentiate the two for accessibility purpose
				// make sure the user knows she's focusing the navigation
				// and can use arrows/home/pageup...
				&:focus {
					border-bottom-color: var(--color-primary);
				}
			}
		}
		&__content {
			position: relative;
			// take full available height
			flex: 1 1 100%;
			// force the use of the tab component if more than one tab
			// you can just put raw content if you don't use tabs
			&--multiple > :not(section) {
				display: none;
			}
		}
	}
}

.slide-right-leave-active,
.slide-right-enter-active {
	transition-duration: var(--animation-quick);
	transition-property: max-width, min-width;
}

.slide-right-enter-to,
.slide-right-leave {
	min-width: $sidebar-min-width;
	max-width: $sidebar-max-width;
}

.slide-right-enter,
.slide-right-leave-to {
	min-width: 0 !important;
	max-width: 0 !important;
}

.fade-leave-active,
.fade-enter-active {
	transition-duration: var(--animation-quick);
	transition-property: opacity;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	opacity: 1;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

</style>

<style lang="scss">
// ! slots specific designs, cannot be scoped
// if any button inside the action slot, icrease visual padding
.app-sidebar-header__action {
	button, .button,
	input[type='button'],
	input[type='submit'],
	input[type='reset'] {
		padding: 6px 22px;
	}
}
</style>
