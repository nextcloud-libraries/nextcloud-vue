<!--
 - @copyright Copyright (c) 2020 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 -
 - @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
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

This component is meant to be used inside a Breadcrumbs component.

</docs>

<template>
	<div ref="crumb"
		class="vue-crumb"
		:class="{'vue-crumb--hovered': hovering}"
		:[crumbId]="''"
		draggable="false"
		@dragstart.prevent="() => {/** Prevent the breadcrumb from being draggable. */}"
		@drop.prevent="dropped"
		@dragover.prevent="() => {}"
		@dragenter="dragEnter"
		@dragleave="dragLeave">
		<element
			:is="tag"
			v-if="(title || icon) && !$slots.default"
			:to="to"
			:href="href">
			<!-- @slot Slot for passing a material design icon. Precedes the icon and title prop. -->
			<slot name="icon">
				<span v-if="icon" :class="icon" class="icon" />
				<span v-else>{{ title }}</span>
			</slot>
		</element>
		<Actions ref="actions"
			:force-menu="forceMenu"
			:open="open"
			:menu-title="title"
			:force-title="true"
			:container="`.vue-crumb[${crumbId}]`"
			@update:open="onOpenChange">
			<template #icon>
				<!-- @slot Slot for the custom menu icon -->
				<slot name="menu-icon" />
			</template>
			<!-- @slot All action elements passed into the default slot will be used -->
			<slot />
		</Actions>
		<ChevronRight class="vue-crumb__separator" :size="20" />
	</div>
</template>

<script>
import Actions from '../Actions'
import GenRandomId from '../../utils/GenRandomId'

import ChevronRight from 'vue-material-design-icons/ChevronRight'

export default {
	name: 'Breadcrumb',
	components: {
		Actions,
		ChevronRight,
	},
	props: {
		/**
		 * The displayed title of the breadcrumb.
		 */
		title: {
			type: String,
			required: true,
		},
		/**
		 * The router-link to prop [https://router.vuejs.org/api/#to](https://router.vuejs.org/api/#to)
		 * If set, the breadcrumbs will be rendered by router-link.
		 */
		to: {
			type: String,
			default: undefined,
		},
		/**
		 * Set this prop if your app doesn't use vue-router, breadcrumbs will show as normal links.
		 */
		href: {
			type: String,
			default: undefined,
		},
		/**
		 * Set a css icon-class to show an icon instead of the title text.
		 */
		icon: {
			type: String,
			default: '',
		},
		/**
		 * Disable dropping on this breadcrumb.
		 */
		disableDrop: {
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
		 * Open state of the Actions menu
		 */
		open: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			/**
			 * Variable to track if we hover over the breadcrumb
			 */
			hovering: false,
			/**
			 * The unique id of the breadcrumb. Necessary to append the
			 * Actions menu to the correct crumb.
			 */
			crumbId: `crumb-id-${GenRandomId()}`,
		}
	},
	computed: {
		/**
		 * Determines which element tag to use
		 *
		 * @returns {String} the tag
		 */
		tag() {
			return this.to ? 'router-link' : 'a'
		},
	},
	methods: {
		/**
		 * Function to handle changing the open state of the Actions menu
		 * $emit the open state.
		 *
		 * @param {boolean} open The open state of the Actions menu
		 */
		onOpenChange(open) {
			/**
			 * Event emitted when the open state of the Actions menu changes
			 * @type {null}
			 */
			this.$emit('update:open', open)
		},
		/**
		 * Function to handle a drop on the breadcrumb.
		 * $emit the event and the path, remove the hovering state.
		 *
		 * @param {Object} e The drop event
		 * @returns {boolean}
		 */
		dropped(e) {
			/**
			 * Don't do anything if dropping is disabled.
			 */
			if (this.disableDrop) {
				return false
			}
			/**
			 * Event emitted when something is dropped on the breadcrumb.
			 * @type {null}
			 */
			this.$emit('dropped', e, this.to || this.href)
			this.$parent.$emit('dropped', e, this.to || this.href)
			this.hovering = false
			return false
		},
		/**
		 * Add the hovering state on drag enter
		 *
		 * @param {Object} e The drag enter event
		 */
		dragEnter(e) {
			/**
			 * Don't do anything if dropping is disabled.
			 */
			if (this.disableDrop) {
				return
			}
			this.hovering = true
		},
		/**
		 * Remove the hovering state on drag leave
		 *
		 * @param {Object} e The drag leave event
		 */
		dragLeave(e) {
			/**
			 * Don't do anything if dropping is disabled.
			 */
			if (this.disableDrop) {
				return
			}
			// Don't do anything if we
			// - leave towards a child element.
			// - or are still within the crumb
			if (e.target.contains(e.relatedTarget)
				|| this.$refs.crumb.contains(e.relatedTarget)) {
				return
			}
			this.hovering = false
		},
	},
}
</script>

<style lang="scss" scoped>

.vue-crumb {
	background-image: none;
	display: inline-flex;
	height: $clickable-area;
	padding: 0;

	&:last-child {
		max-width: 210px;
		font-weight: bold;

		> a,
		> a::v-deep * {
			cursor: default;
		}

		// Don't show breadcrumb separator for last crumb
		.vue-crumb__separator {
			display: none;
		}
	}

	// Hover and focus effect for crumbs, but not the last one
	&:not(:last-child) > a {
		&:hover,
		&:focus {
			background-color: var(--color-background-dark);
			color: var(--color-main-text);
		}
	}

	&--hidden {
		display: none;
	}

	&#{&}--hovered > a {
		background-color: var(--color-background-dark);
		color: var(--color-main-text);
	}

	&__separator {
		padding: 0;
		color: var(--color-text-maxcontrast);
	}

	> a {
		overflow: hidden;
		color: var(--color-text-maxcontrast);
		padding: 12px;
		max-width: 100%;
		border-radius: var(--border-radius-pill);
		align-items: center;
		display: inline-flex;

		> span {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	// Adjust action item appearance for crumbs with actions
	// to match other crumbs
	&::v-deep .action-item {
		&__menutoggle--with-title,
		&--single--with-title {
			background-color: unset;
			border: none;

			&:hover,
			&:focus,
			&:active {
				background-color: var(--color-background-dark) !important;
				color: var(--color-main-text);
			}

			// Show the icon on the right
			padding-right: 44px;
			padding-left: 14px;
			& > span.material-design-icon {
				right: 0;
				left: unset;
			}
		}
		// Adjust the background of the last crumb when the action is open
		&.action-item--open .action-item__menutoggle--with-title {
			background-color: var(--color-background-dark);
			color: var(--color-main-text);
		}
	}
}
</style>
