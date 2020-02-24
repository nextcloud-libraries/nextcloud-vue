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

<docs>

	### General description

	This component provides a way to include the standardised sidebar.
	The standard properties like title, subtitle, starred, etc. allow to automatically
	include a standard-header like it's used by the files app.

	### Standard usage

	```vue
	<template>
		<AppSidebar
			:title="title"
			:subtitle="subtitle">
			<!-- Insert your slots and tabs here -->
		</AppSidebar>
	</template>
	<script>
		export default {
			data() {
				return {
					title: 'cat-picture.jpg',
					subtitle: 'last edited 3 weeks ago'
				}
			}
		}
	</script>
	```

	### Editable title
	```vue
	<template>
		<AppSidebar
			:title="title"
			:title-editable="true"
			:title-placeholder="titlePlaceholder"
			:subtitle="subtitle"
			@update:title="titleUpdate">
			<!-- Insert your slots and tabs here -->
		</AppSidebar>
	</template>
	<script>
		export default {
			data() {
				return {
					title: 'cat-picture.jpg',
					titlePlaceholder: 'Filename',
					subtitle: 'last edited 3 weeks ago'
				}
			},
			methods: {
				titleUpdate(e) {
					this.title = e
				}
			}
		}
	</script>
	```

</docs>

<template>
	<transition name="slide-right">
		<aside id="app-sidebar">
			<header :class="{
				'app-sidebar-header--with-figure': hasFigure,
				'app-sidebar-header--compact': compact
			}" class="app-sidebar-header">
				<!-- close sidebar button -->
				<a href="#" class="app-sidebar__close icon-close" :title="t('close')"
					@click.prevent="closeSidebar" />

				<!-- sidebar header illustration/figure -->
				<div v-if="hasFigure" :class="{
						'app-sidebar-header__figure--with-action': hasFigureClickListener
					}" class="app-sidebar-header__figure"
					:style="{
						backgroundImage: `url(${background})`
					}"
					@click="onFigureClick">
					<slot class="app-sidebar-header__background" name="header" />
				</div>

				<!-- sidebar details -->
				<div :class="{ 'app-sidebar-header__desc--with-star': canStar, 'app-sidebar-header__desc--with-subtitle': subtitle && !titleEditable, 'app-sidebar-header__desc--editable': titleEditable && !subtitle, 'app-sidebar-header__desc--with-subtitle--editable': titleEditable && subtitle}" class="app-sidebar-header__desc">
					<!-- favourite icon -->
					<a v-if="canStar" :class="{ 'icon-starred': isStarred&& !starLoading, 'icon-star': !isStarred && !starLoading, 'icon-loading-small': starLoading }"
						class="app-sidebar-header__star" @click.prevent="toggleStarred" />

					<!-- main title -->
					<h2 v-if="!titleEditable" class="app-sidebar-header__title">
						{{ title }}
					</h2>
					<template v-if="titleEditable">
						<form
							class="rename-form"
							@submit.prevent="onSubmitTitle">
							<input
								v-focus
								class="app-sidebar-header__title-input"
								type="text"
								:placeholder="titlePlaceholder"
								:value="title"
								@keydown.esc="onDismissEditing"
								@input="onTitleInput">
							<button
								class="icon-confirm"
								type="submit" />
						</form>
					</template>
					<!-- secondary title -->
					<p v-if="subtitle.trim() !== ''" class="app-sidebar-header__subtitle">
						{{ subtitle }}
					</p>

					<!-- header main menu -->
					<Actions v-if="$slots['secondary-actions']" class="app-sidebar-header__menu" :force-menu="forceMenu">
						<slot name="secondary-actions" />
					</Actions>
				</div>
				<div v-if="$slots['primary-actions']" class="app-sidebar-header__action">
					<slot name="primary-actions" />
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
							:class="{ active: activeTab === tab.id }"
							:data-id="tab.id"
							:href="`#tab-${tab.id}`"
							:tabindex="activeTab === tab.id ? null : -1"
							role="tab"
							@click.prevent="setActive">
							<span :class="tab.icon" class="app-sidebar-tabs__tab-icon" />
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
import Vue from 'vue'
import Actions from 'Components/Actions'
import Focus from 'Directives/Focus'
import l10n from '../../mixins/l10n'

const IsValidString = function(value) {
	return value && typeof value === 'string' && value.trim() !== '' && value.indexOf(' ') === -1
}

export default {
	name: 'AppSidebar',
	components: {
		Actions
	},
	directives: {
		focus: Focus
	},
	mixins: [l10n],
	props: {
		active: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: '',
			required: true
		},
		titleEditable: {
			type: Boolean,
			default: false
		},
		titlePlaceholder: {
			type: String,
			default: ''
		},
		subtitle: {
			type: String,
			default: ''
		},

		/**
		 * Url to the top header background image
		 * Applied with css
		 */
		background: {
			type: String,
			default: ''
		},

		/**
		 * Enable the favourite icon if not null
		 * See fired events
		 */
		starred: {
			type: Boolean,
			default: null
		},
		/**
		 * Show loading spinner instead of the star icon
		 */
		starLoading: {
			type: Boolean,
			default: false
		},

		/**
		 * Display the sidebar in compact mode
		 */
		compact: {
			type: Boolean,
			default: false
		},

		/**
		 * Force the actions to display in a three dot menu
		 */
		forceMenu: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			tabs: [],
			activeTab: '',
			isStarred: this.starred,
			children: []
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
		hasFigureClickListener() {
			return this.$listeners['figure-click']
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
		},

		// update the tabs list if the children
		// length change
		children: function() {
			this.updateTabs()
		}
	},

	mounted() {
		// init the tabs list
		this.updateTabs()

		// let's make the children list reactive
		this.children = this.$children
	},

	methods: {
		/**
		 * Emit sidebar close event to parent component
		 */
		closeSidebar(e) {
			this.$emit('close', e)
		},

		/**
		 * Emit figure click event to parent component
		 */
		onFigureClick(e) {
			this.$emit('figure-click', e)
		},

		/**
		 * Set the current active tab
		 */
		setActive({ target }) {
			// if click on icon, make sure we get the link
			const id = target.closest('a').dataset.id
			this.activeTab = id
			this.$emit('update:active', id)

		},

		/**
		 * Focus the previous tab
		 * and emit to the parent component
		 */
		focusPreviousTab() {
			if (this.currentTabIndex > 0) {
				this.activeTab = this.tabs[this.currentTabIndex - 1].id
				this.$emit('update:active', this.activeTab)
			}
			this.focusActiveTab() // focus nav item
		},

		/**
		 * Focus the next tab
		 * and emit to the parent component
		 */
		focusNextTab() {
			if (this.currentTabIndex < this.tabs.length - 1) {
				this.activeTab = this.tabs[this.currentTabIndex + 1].id
				this.$emit('update:active', this.activeTab)
			}
			this.focusActiveTab() // focus nav item
		},

		/**
		 * Focus the first tab
		 * and emit to the parent component
		 */
		focusFirstTab() {
			this.activeTab = this.tabs[0].id
			this.$emit('update:active', this.activeTab)
			this.focusActiveTab() // focus nav item
		},

		/**
		 * Focus the last tab
		 * and emit to the parent component
		 */
		focusLastTab() {
			this.activeTab = this.tabs[this.tabs.length - 1].id
			this.$emit('update:active', this.activeTab)
			this.focusActiveTab() // focus nav item
		},

		/**
		 * Focus the current active tab
		 */
		focusActiveTab() {
			this.$el.querySelector('#' + this.activeTab).focus()
		},

		/**
		 * Focus the content on tab
		 * see aria accessibility guidelines
		 */
		focusActiveTabContent() {
			this.$el.querySelector('#tab-' + this.activeTab).focus()
		},

		/**
		 * Update the current active tab
		 */
		updateActive() {
			this.activeTab = this.active
				&& this.tabs.findIndex(tab => tab.id === this.active) !== -1
				? this.active
				: this.tabs.length > 0
					? this.tabs[0].id
					: ''
		},

		/**
		 * Toggle the favourite state
		 * and emit to the parent component
		 */
		toggleStarred() {
			this.isStarred = !this.isStarred
			this.$emit('update:starred', this.isStarred)
		},

		/**
		 * Manually update the sidebar tabs according to $children
		 */
		updateTabs() {
			// Init tabs from $children
			let tabs = this.$children.filter(child =>
				(child.name && typeof child.name === 'string')
				&& IsValidString(child.id)
				&& IsValidString(child.icon)
			)

			// tabs are optional, but you can use either tabs or non-tab-content only
			if (tabs.length !== 0 && tabs.length !== this.$children.length) {
				Vue.util.warn(`Mixing tabs and non-tab-content is not possible.`)
			}

			this.tabs = tabs.sort((a, b) => {
				var orderA = a.order || 0
				var orderB = b.order || 0
				if (orderA === orderB) {
					return OC.Util.naturalSortCompare(a.name, b.name)
				}
				return orderA - orderB
			})

			// init active tab if exists
			if (this.tabs.length > 0) {
				this.updateActive()
			}
		},

		/**
		 * Emit title change event to parent component
		 */
		onTitleInput(event) {
			/**
			 * Emitted on title events of the text field
			 * @type {Event|Date}
			 */
			this.$emit('input-title', event)
			/**
			 * Emitted when the title value changes
			 * @type {string|Date}
			 */
			this.$emit('update:title', event.target.value)
		},
		/**
		 * Emit when the title form edit confirm button is pressed in order
		 * to change the title.
		 */
		onSubmitTitle(event) {
			this.$emit('submit-title', event)
		},
		onDismissEditing() {
			this.$emit('dismiss-editing')
		}
	}
}
</script>
<style lang="scss" scoped>
$header-height: 50px;
$sidebar-min-width: 300px;
$sidebar-max-width: 500px;

$desc-vertical-padding: 18px;
$desc-input-padding: 7px;
$desc-title-height: 30px;
// title and subtitle
$desc-height: $desc-title-height + 22px;

$top-buttons-spacing: 6px;

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
	right: 0;

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
		> .app-sidebar__close {
			position: absolute;
			width: $clickable-area;
			height: $clickable-area;
			top: $top-buttons-spacing;
			right: $top-buttons-spacing;
			z-index: 100;
			opacity: $opacity_normal;
			border-radius: $clickable-area / 2;
			&:hover,
			&:active,
			&:focus {
				opacity: $opacity_full;
				background-color: $action-background-hover;
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
			&--with-action {
				cursor: pointer;
			}
		}

		&__desc {
			position: relative;
			padding: #{$desc-vertical-padding} #{$clickable-area * 2 + $top-buttons-spacing * 3} #{$desc-vertical-padding} $desc-vertical-padding / 2;
			display: flex;
			flex-direction: column;
			justify-content: center;
			box-sizing: content-box;

			// titles
			.app-sidebar-header__title,
			.app-sidebar-header__subtitle {
				width: 100%;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				margin: 0;
			}
			// main title
			.app-sidebar-header__title {
				padding: 0;
				font-size: 20px;
				line-height: $desc-title-height;
			}
			input.app-sidebar-header__title-input {
				font-size: 16px;
				padding: $desc-input-padding;
				width: 100%;
				margin: 0;
			}

			// subtitle
			.app-sidebar-header__subtitle {
				font-size: 14px;
				padding: 0;
				opacity: $opacity_normal;
			}
			// favourite
			.app-sidebar-header__star {
				display: block;
				width: $clickable-area;
				height: $clickable-area;
				padding: $icon-margin;
				position: absolute;
				left: 0;
			}
			// main menu
			.app-sidebar-header__menu {
				position: absolute;
				right: $clickable-area / 2;
				background-color: $action-background-hover;
				border-radius: $clickable-area / 2;
			}

			// custom overrides
			&--with-star {
				padding-left: $clickable-area;
			}
			&--with-subtitle {
				justify-content: space-between;
				height: $desc-height;
			}
			&--editable {
				height: $desc-height * 0.75;
			}
			&--with-subtitle--editable {
				height: $desc-height * 1.5;

				.app-sidebar-header__subtitle {
					margin-left: $desc-input-padding;
				}

				.app-sidebar-header__title-input {
					margin-top: -$desc-vertical-padding / 2 - $desc-input-padding;
				}
			}

		}
		&--with-figure {
			.app-sidebar-header__desc {
				padding-right: $clickable-area * 2;
			}
		}
		&:not(.app-sidebar-header--with-figure) {
			.app-sidebar-header__menu {
				top: $top-buttons-spacing;
				right: $top-buttons-spacing * 2 + $clickable-area;
			}
		}

		// sidebar action(s) slot
		&__action {
			display: flex;
			margin: 0 10px;
			max-height: 50px;
			align-items: center;
		}

		&--compact {
			.app-sidebar-header__figure {
				height: $desc-height + $desc-vertical-padding;
				width: $desc-height + $desc-vertical-padding;
				margin: $desc-vertical-padding / 2;
				border-radius: 3px;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 2;
			}
			.app-sidebar-header__desc {
				// forcing $clickable-area no matter if star or not
				padding-left: $clickable-area;
				// wull width (+margin) of the figure minus left padding of the desc + 2px because it balances this a bit
				// this is only here to align the favourite star icon, we're using margin and padding
				// to have a two steps left distance: | margin | favourite | padding | title + subtitle
				margin-left: $desc-height + $desc-vertical-padding + $desc-vertical-padding - $clickable-area + 2px;
				height: $desc-height;
				.app-sidebar-header__star {
					margin-top: -$desc-vertical-padding / 2;
					z-index: 3; // above star
				}
				.app-sidebar-header__menu {
					right: $clickable-area + $top-buttons-spacing; // left of the close button
					top: $top-buttons-spacing;
					margin: 0;
					background-color: transparent;
				}
				&--editable {
					padding-top: 0;
					input.app-sidebar-header__title-input {
						margin-top: 0;
					}
				}
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
				display: block;
				padding-top: 25px;
				padding-bottom: 5px;
				position: relative;
				border-bottom: 1px solid var(--color-border);
				text-align: center;
				opacity: $opacity_normal;
				color: var(--color-main-text);
				transition: color var(--animation-quick), opacity var(--animation-quick), border-color var(--animation-quick);
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
					box-shadow: inset 0 -1px 0 var(--color-background-darker);
					border-bottom-color:  var(--color-background-darker);
				}
				&.active {
					font-weight: bold;
					color: var(--color-text-light);
					border-bottom-color: var(--color-text-light);
					box-shadow: inset 0 -1px 0 var(--color-text-light);
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
			height: 25px;
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			opacity: $opacity_normal;
			background-position: center 8px;
			background-size: 16px;
			transition: opacity var(--animation-quick);
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
	opacity: $opacity_full;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.rename-form {
	display: flex;
	& .icon-confirm {
		margin: 0;
	}
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
