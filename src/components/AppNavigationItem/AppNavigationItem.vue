<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
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
<template>
	<!-- Navigation item -->
	<nav-element :id="item.id" v-bind="navElement(item)"
		:title="item.title" :class="[{'icon-loading-small': item.loading, 'open': opened, 'collapsible': collapsible }, item.classes]">
		<!-- Bullet -->
		<div v-if="item.bullet" :style="{ backgroundColor: item.bullet }" class="app-navigation-entry-bullet" />

		<button v-if="collapsible" class="collapse" @click.prevent.stop="toggleCollapse" />

		<a :class="item.icon" :href="(item.href) ? item.href : '#'"
			@click="callPreventStop(simpleAction, $event)">
			<img v-if="item.iconUrl" :alt="item.text" :src="item.iconUrl">
			{{ item.text }}
		</a>

		<!-- Popover, counter and button(s) -->
		<div v-if="item.utils" class="app-navigation-entry-utils">
			<ul>
				<!-- counter -->
				<li :class="{highlighted: item.utils.counter_highlighted}"
					class="app-navigation-entry-utils-counter"
					v-if="item.utils.counter">
					<span>{{ item.utils.counter }}</span>
				</li>

				<!-- first action if only one action -->
				<li v-if="item.utils.actions && item.utils.actions.length === 1"
					class="app-navigation-entry-utils-menu-button">
					<button :class="item.utils.actions[0].icon" :title="item.utils.actions[0].text" @click="item.utils.actions[0].action" />
				</li>

				<!-- menu button if at least two actions -->
				<li v-else-if="item.utils.actions && item.utils.actions.length > 1"
					class="app-navigation-entry-utils-menu-button">
					<button v-click-outside="hideMenu" @click="toggleMenu" />
				</li>
			</ul>
		</div>

		<!-- menu if at least two actions -->
		<div v-if="item.utils && item.utils.actions && item.utils.actions.length > 1"
			:class="{ 'open': openedMenu }" class="app-navigation-entry-menu">
			<PopoverMenu :menu="item.utils.actions" />
		</div>

		<!-- undo entry -->
		<div v-if="item.undo" class="app-navigation-entry-deleted">
			<div class="app-navigation-entry-deleted-description">
				{{ item.undo.text }}
			</div>
			<button :title="t('settings', 'Undo')" class="app-navigation-entry-deleted-button icon-history" />
		</div>

		<!-- edit entry -->
		<div v-if="item.edit" class="app-navigation-entry-edit">
			<form @submit.prevent.stop="item.edit.action">
				<input :placeholder="item.edit.text" type="text">
				<input type="submit" value="" class="icon-confirm">
				<input type="submit" value="" class="icon-close"
					@click.stop.prevent="cancelEdit">
			</form>
		</div>

		<!-- if the item has children, inject the component with proper data -->
		<ul v-if="item.children">
			<app-navigation-item v-for="(child, key) in item.children" :key="key" :item="child" />
		</ul>
	</nav-element>
</template>

<script>
import { PopoverMenu } from 'Components/PopoverMenu'
import ClickOutside from 'vue-click-outside'

export default {
	name: 'AppNavigationItem',
	components: {
		PopoverMenu
	},
	directives: {
		ClickOutside
	},
	props: {
		item: {
			type: Object,
			required: true
		},
		open: {
			type: Boolean,
			default: false
		},
		menuOpen: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			opened: this.open,
			openedMenu: this.menuOpen
		}
	},
	computed: {
		collapsible() {
			return this.item.collapsible && this.item.children && this.item.children.length > 0
		},
		simpleAction() {
			if (this.collapsible && !this.item.action) {
				return this.toggleCollapse
			} else {
				return this.item.action
			}
		}
	},
	watch: {
		open(newVal) {
			this.opened = newVal
		},
		menuOpen(newVal) {
			this.openedMenu = newVal
		}
	},
	mounted() {
		// prevent click outside event with popupItem.
		this.popupItem = this.$el
	},
	methods: {
		hideMenu() {
			this.openedMenu = false
			this.$emit('update:menuOpen', this.openedMenu)
		},
		toggleMenu() {
			this.openedMenu = !this.openedMenu
			this.$emit('update:menuOpen', this.openedMenu)
		},
		toggleCollapse() {
			this.opened = !this.opened
			this.$emit('update:open', this.opened)
		},
		callPreventStop(action, event) {
			if (action) {
				event.preventDefault()
				event.stopPropagation()
				action()
			}
		},
		cancelEdit(e) {
			// remove the editing class
			if (Array.isArray(this.item.classes)) {
				this.item.classes = this.item.classes.filter(item => item !== 'editing')
			}
			this.item.edit.reset(e)
		},
		// This is used to decide which outter element type to use
		// li or router-link
		navElement(item) {
			if (item.router) {
				let exact = item.router.exact
				if (typeof item.router.exact === 'undefined') {
					exact = true
				}

				return {
					is: 'router-link',
					tag: 'li',
					to: item.router,
					exact
				}
			}
			return {
				is: 'li'
			}
		}
	}
}
</script>
