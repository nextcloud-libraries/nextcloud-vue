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
		class="crumb"
		:class="{'crumb--with-action': $slots.default, 'crumb--hovered': hovering}"
		draggable="false"
		@dragstart.prevent="() => {/** Prevent the breadcrumb from being draggable. */}"
		@drop.prevent="dropped"
		@dragover.prevent="() => {}"
		@dragenter="dragEnter"
		@dragleave="dragLeave">
		<element :is="tag" :to="to" :href="href">
			<span v-if="icon" :class="icon" class="icon" />
			<span v-else>{{ title }}</span>
		</element>
		<Actions :force-menu="forceMenu">
			<!-- @slot All action elements passed into the default slot will be used -->
			<slot />
		</Actions>
	</div>
</template>

<script>
import Actions from '../Actions'

export default {
	name: 'Breadcrumb',
	components: {
		Actions,
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
	},
	data() {
		return {
			/**
			 * Variable to track if we hover over the breadcrumb
			 */
			hovering: false,
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
.breadcrumb div.crumb {
	&--with-action a {
		padding-right: 2px;
	}

	a {
		align-items: center;
		display: inline-flex;

		> span {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
</style>
