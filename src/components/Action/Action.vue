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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template>
	<action :tabindex="actions.length === 1" :class="{ [actions[0].icon]: actions.length === 1 }"
		v-bind="getType(actions[0])" v-on="actions.length === 1 ? { click: actions[0].action } : {}">

		<!-- If more than one action, create a popovermenu -->
		<template v-if="actions.length > 1">
			<div v-click-outside="closeMenu" tabindex="1" class="icon-more"
				@click="toggleMenu" />
			<div :class="{ 'open': opened }" class="popovermenu">
				<popover-menu :menu="actions" />
			</div>
		</template>

	</action>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import PopoverMenu from '../PopoverMenu'

export default {
	name: 'Action',
	components: {
		PopoverMenu
	},
	directives: {
		ClickOutside
	},
	props: {
		actions: {
			type: Array,
			required: true,
			default: () => {
				return [
					{
						href: 'https://nextcloud.com',
						icon: 'icon-links',
						text: 'Nextcloud'
					},
					{
						action: () => {
							alert('Deleted !')
						},
						icon: 'icon-delete',
						text: 'Delete'
					}
				]
			}
		}
	},
	data() {
		return {
			opened: false
		}
	},
	mounted() {
		// prevent click outside event with popupItem.
		this.popupItem = this.$el
	},
	methods: {
		toggleMenu() {
			this.opened = !this.opened
		},
		closeMenu() {
			this.opened = false
		},
		/**
		 * Define what type of element is the main item
		 * supposed to be
		 *
		 * @param {Object} action The first action
		 * @returns {Object}
		 */
		getType(action) {
			if (action.href) {
				return {
					tag: 'a',
					href: action.href
				}
			}
			return {
				is: 'div'
			}
		}
	}
}
</script>
