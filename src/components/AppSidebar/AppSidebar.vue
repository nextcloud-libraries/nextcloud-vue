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

<docs>

	### General description

	This component provides a way to include the standardised sidebar.
	The standard properties like title, subtitle, starred, etc. allow to automatically
	include a standard-header like it's used by the files app.

	### Standard usage

	```vue
	<AppSidebar
		title="cat-picture.jpg"
		subtitle="last edited 3 weeks ago">
		<AppSidebarTab icon="icon-settings" name="Settings" id="settings">
			Settings tab content
		</AppSidebarTab>
		<AppSidebarTab icon="icon-share" name="Sharing" id="share">
			Sharing tab content
		</AppSidebarTab>
	</AppSidebar>
	```

	### Editable title

	```vue
	<template>
		<AppSidebar
			:title.sync="title"
			:title-editable="true"
			title-placeholder="Filename"
			subtitle="last edited 3 weeks ago">
			<!-- Insert your slots and tabs here -->
		</AppSidebar>
	</template>
	<script>
		export default {
			data() {
				return {
					title: 'cat-picture.jpg',
				}
			},
		}
	</script>
	```

	### Editable title after click with custom tertiary action

	```vue
	<template>
		<AppSidebar
			:title="title"
			:title-editable.sync="titleEditable"
			:title-placeholder="titlePlaceholder"
			:subtitle="subtitle"
			@update:title="titleUpdate">
			<template slot="tertiary-actions">
				<form>
					<input type="checkbox" @click="toggledCheckbox"/>
				</form>
			</template>
		</AppSidebar>
	</template>
	<script>
		export default {
			data() {
				return {
					title: 'cat-picture.jpg',
					titlePlaceholder: 'Filename',
					subtitle: 'last edited 3 weeks ago',
					titleEditable: false
				}
			},
			methods: {
				titleUpdate(e) {
					this.title = e
				},
				toggledCheckbox() {
					alert('toggle')
				}
			}
		}
	</script>
	```

	### Empty sidebar for e.g. empty content component.

	```vue
	<template>
		<AppSidebar
			title="cat-picture.jpg"
			:empty="true">
			<EmptyContent icon="icon-search">
				Content not found.
			</EmptyContent>
		</AppSidebar>
	</template>
	```

</docs>

<template>
	<transition name="slide-right" appear>
		<aside id="app-sidebar-vue" class="app-sidebar">
			<header :class="{
					'app-sidebar-header--with-figure': hasFigure,
					'app-sidebar-header--compact': compact,
				}"
				class="app-sidebar-header">
				<!-- close sidebar button -->
				<a href="#"
					class="app-sidebar__close icon-close"
					:title="t('close')"
					@click.prevent="closeSidebar" />

				<!-- container for figure and description, allows easy switching to compact mode -->
				<div class="app-sidebar-header__info">
					<!-- sidebar header illustration/figure -->
					<div v-if="hasFigure && !empty"
						:class="{
							'app-sidebar-header__figure--with-action': hasFigureClickListener
						}"
						class="app-sidebar-header__figure"
						:style="{
							backgroundImage: `url(${background})`
						}"
						@click="onFigureClick">
						<slot class="app-sidebar-header__background" name="header" />
					</div>

					<!-- sidebar details -->
					<div v-if="!empty"
						:class="{
							'app-sidebar-header__desc--with-tertiary-action': canStar || $slots['tertiary-actions'],
							'app-sidebar-header__desc--editable': titleEditable && !subtitle,
							'app-sidebar-header__desc--with-subtitle--editable': titleEditable && subtitle,
							'app-sidebar-header__desc--without-menu': !$slots['primary-actions'],
						}"
						class="app-sidebar-header__desc">
						<!-- favourite icon -->
						<div v-if="canStar || $slots['tertiary-actions']" class="app-sidebar-header__tertiary-actions">
							<slot name="tertiary-actions">
								<a v-if="canStar"
									:class="{
										'icon-starred': isStarred && !starLoading,
										'icon-star': !isStarred && !starLoading,
										'icon-loading-small': starLoading,
									}"
									class="app-sidebar-header__star"
									@click.prevent="toggleStarred" />
							</slot>
						</div>

						<!-- title -->
						<div class="app-sidebar-header__title-container">
							<!-- main title -->
							<h2 v-show="!titleEditable"
								v-linkify="{text: title, linkify: linkifyTitle}"
								class="app-sidebar-header__maintitle"
								@click.self="editTitle">
								{{ title }}
							</h2>
							<template v-if="titleEditable">
								<form
									v-click-outside="() => onSubmitTitle()"
									class="app-sidebar-header__maintitle-form"
									@submit.prevent="onSubmitTitle">
									<input
										ref="titleInput"
										v-focus
										class="app-sidebar-header__maintitle-input"
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
						</div>

						<!-- header main menu -->
						<Actions v-if="$slots['secondary-actions']" class="app-sidebar-header__menu" :force-menu="forceMenu">
							<slot name="secondary-actions" />
						</Actions>
					</div>
				</div>
				<div v-if="$slots['primary-actions'] && !empty" class="app-sidebar-header__action">
					<slot name="primary-actions" />
				</div>
			</header>

			<AppSidebarTabs v-show="!loading"
				ref="tabs"
				:active="active"
				@update:active="onUpdateActive">
				<slot />
			</AppSidebarTabs>

			<EmptyContent v-if="loading" icon="icon-loading" />
		</aside>
	</transition>
</template>

<script>
import Actions from '../Actions'
import Focus from '../../directives/Focus'
import Linkify from '../../directives/Linkify'
import l10n from '../../mixins/l10n'
import AppSidebarTabs from './AppSidebarTabs'
import EmptyContent from '../EmptyContent/EmptyContent'
import { directive as ClickOutside } from 'v-click-outside'

export default {
	name: 'AppSidebar',

	components: {
		Actions,
		AppSidebarTabs,
		EmptyContent,
	},

	directives: {
		focus: Focus,
		linkify: Linkify,
		ClickOutside,
	},

	mixins: [l10n],

	props: {
		active: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			default: '',
			required: true,
		},

		/**
		 * Allow to edit the sidebar title.
		 */
		titleEditable: {
			type: Boolean,
			default: false,
		},
		titlePlaceholder: {
			type: String,
			default: '',
		},
		subtitle: {
			type: String,
			default: '',
		},

		/**
		 * Url to the top header background image
		 * Applied with css
		 */
		background: {
			type: String,
			default: '',
		},

		/**
		 * Enable the favourite icon if not null
		 * See fired events
		 */
		starred: {
			type: Boolean,
			default: null,
		},
		/**
		 * Show loading spinner instead of the star icon
		 */
		starLoading: {
			type: Boolean,
			default: false,
		},
		/**
		 * Show loading spinner instead of tabs
		 */
		loading: {
			type: Boolean,
			default: false,
		},

		/**
		 * Display the sidebar in compact mode
		 */
		compact: {
			type: Boolean,
			default: false,
		},

		/**
		 * Only display close button and default slot content.
		 * Don't display other header content and primary and secondary actions.
		 * Useful when showing the EmptyContent component as content.
		 */
		empty: {
			type: Boolean,
			default: false,
		},

		/**
		 * Force the actions to display in a three dot menu
		 */
		forceMenu: {
			type: Boolean,
			default: false,
		},

		/**
		 * Linkify the title
		 */
		linkifyTitle: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			isStarred: this.starred,
		}
	},

	computed: {
		canStar() {
			return this.isStarred !== null
		},
		hasFigure() {
			return this.$slots.header || this.background
		},
		hasFigureClickListener() {
			return this.$listeners['figure-click']
		},
	},

	watch: {
		starred() {
			this.isStarred = this.starred
		},
	},

	methods: {
		/**
		 * Emit sidebar close event to parent component
		 * @param {Event} e click event
		 */
		closeSidebar(e) {
			this.$emit('close', e)
		},

		/**
		 * Emit figure click event to parent component
		 * @param {Event} e click event
		 */
		onFigureClick(e) {
			this.$emit('figure-click', e)
		},

		/**
		 * Toggle the favourite state
		 * and emit to the parent component
		 */
		toggleStarred() {
			this.isStarred = !this.isStarred
			this.$emit('update:starred', this.isStarred)
		},

		editTitle() {
			this.$emit('update:titleEditable', true)
			// Focus the title input
			if (this.titleEditable) {
				this.$nextTick(
					() => this.$refs.titleInput.focus()
				)
			}
		},

		/**
		 * Emit title change event to parent component
		 * @param {Event} event input event
		 */
		onTitleInput(event) {
			/**
			 * Emitted when the title value changes
			 * @type {string|Date}
			 */
			this.$emit('update:title', event.target.value)
		},

		/**
		 * Emit when the title form edit confirm button is pressed in order
		 * to change the title.
		 * @param {Event} event submit event
		 */
		onSubmitTitle(event) {
			// Disable editing
			this.$emit('update:titleEditable', false)
			this.$emit('submit-title', event)
		},
		onDismissEditing() {
			// Disable editing
			this.$emit('update:titleEditable', false)
			this.$emit('dismiss-editing')
		},
		onUpdateActive(activeTab) {
			this.$emit('update:active', activeTab)
		},
	},
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
	app-content will be shrinked properly
*/
.app-sidebar {
	position: -webkit-sticky; // Safari support
	position: sticky;
	z-index: 1500;
	top: $header-height;
	right: 0;
	display: flex;
	overflow-x: hidden;
	overflow-y: auto;
	flex-direction: column;
	flex-shrink: 0;
	width: 27vw;
	min-width: $sidebar-min-width;
	max-width: $sidebar-max-width;
	height: calc(100vh - #{$header-height});
	border-left: 1px solid var(--color-border);
	background: var(--color-main-background);
	.app-sidebar-header {
		> .app-sidebar__close {
			position: absolute;
			z-index: 100;
			top: $top-buttons-spacing;
			right: $top-buttons-spacing;
			width: $clickable-area;
			height: $clickable-area;
			opacity: $opacity_normal;
			border-radius: $clickable-area / 2;
			&:hover,
			&:active,
			&:focus {
				opacity: $opacity_full;
				background-color: $action-background-hover;
			}
		}

		// Compact mode only affects a sidebar with a figure
		&--compact.app-sidebar-header--with-figure {
			.app-sidebar-header__info {
				flex-direction: row;

				.app-sidebar-header__figure {
					z-index: 2;
					width: $desc-height + $desc-vertical-padding;
					height: $desc-height + $desc-vertical-padding;
					margin: $desc-vertical-padding / 2;
					border-radius: 3px;
					flex: 0 0 auto;
				}
				.app-sidebar-header__desc {
					height: $desc-height;
					padding-left: 0;
					flex: 1 1 auto;
					min-width: 0;
					padding-right: 2 * $clickable-area + $top-buttons-spacing;
					.app-sidebar-header__tertiary-actions {
						z-index: 3; // above star
						position: absolute;
						top: $desc-vertical-padding / 2;
						left: -1 * $clickable-area;
					}
					.app-sidebar-header__menu {
						top: $top-buttons-spacing;
						right: $clickable-area + $top-buttons-spacing; // left of the close button
						background-color: transparent;
						position: absolute;
					}
				}
			}
		}

		// sidebar without figure
		&:not(.app-sidebar-header--with-figure) {
			// align the menu with the close button
			.app-sidebar-header__menu {
				position: absolute;
				top: $top-buttons-spacing;
				right: $top-buttons-spacing + $clickable-area;
			}
			// increase the padding to not overlap the menu
			.app-sidebar-header__desc {
				padding-right: #{$clickable-area * 2 + $top-buttons-spacing};
			}
		}

		// the container with the figure and the description
		.app-sidebar-header__info {
			display: flex;
			flex-direction: column;
		}

		// header background
		&__figure {
			width: 100%;
			height: 250px;
			max-height: 250px;
			background-repeat: no-repeat;
			background-position: center;
			background-size: contain;
			&--with-action {
				cursor: pointer;
			}
		}

		// description
		&__desc {
			position: relative;
			display: flex;
			flex-direction: row;
			justify-content: center;
			box-sizing: content-box;
			padding: #{$desc-vertical-padding} 0 #{$desc-vertical-padding} #{$desc-vertical-padding / 2};

			// custom overrides
			&--with-tertiary-action {
				padding-left: 0;
			}

			&--editable .app-sidebar-header__maintitle-form {
				margin-top: -2px;
				margin-bottom: -2px;
			}

			&--with-subtitle--editable .app-sidebar-header__subtitle {
				margin-top: -2px;
			}

			&--without-menu {
				padding-right: #{$top-buttons-spacing};
			}

			.app-sidebar-header__tertiary-actions {
				display: flex;
				height: $clickable-area;
				width: $clickable-area;
				justify-content: center;
				flex: 0 0 auto;
			}

			// titles
			.app-sidebar-header__title-container {
				flex: 1 1 auto;
				display: flex;
				flex-direction: column;
				justify-content: center;
				min-width: 0;

				// main title
				.app-sidebar-header__maintitle {
					padding: 0;
					min-height: 30px;
					font-size: 20px;
					line-height: $desc-title-height;

					// Needs 'deep' as the link is generated by the linkify directive
					&::v-deep .linkified {
						cursor: pointer;
						text-decoration: underline;
					}
				}

				.app-sidebar-header__maintitle,
				.app-sidebar-header__subtitle {
					overflow: hidden;
					width: 100%;
					margin: 0;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				// subtitle
				.app-sidebar-header__subtitle {
					padding: 0;
					opacity: $opacity_normal;
					font-size: 14px;
				}

				.app-sidebar-header__maintitle-form {
					display: flex;
					margin-left: -7.5px;
					& .icon-confirm {
						margin: 0;
					}

					input.app-sidebar-header__maintitle-input {
						flex: 1 1 auto;
						margin: 0;
						padding: $desc-input-padding;
						font-size: 20px;
						font-weight: bold;
					}
				}
			}

			// favourite
			.app-sidebar-header__star {
				display: block;
				width: $clickable-area;
				height: $clickable-area;
				padding: $icon-margin;
			}
			// main menu
			.app-sidebar-header__menu {
				height: $clickable-area;
				width: $clickable-area;
				border-radius: $clickable-area / 2;
				background-color: $action-background-hover;
			}
		}

		// sidebar action(s) slot
		&__action {
			display: flex;
			align-items: center;
			max-height: 50px;
			margin: 0 10px;
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
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	transition-duration: var(--animation-quick);
	transition-property: opacity;
	opacity: $opacity_full;
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
