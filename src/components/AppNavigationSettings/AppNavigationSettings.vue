<!--
 - @copyright Copyright (c) 2018 Christoph Wurst <christoph@winzerhof-wurst.at>
 -
 - @author Christoph Wurst <christoph@winzerhof-wurst.at>
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
	<div id="app-settings"
		v-click-outside="closeMenu"
		:class="{open}">
		<div id="app-settings-header">
			<button class="settings-button"
				@click="toggleMenu">
				{{ title }}
			</button>
		</div>
		<div id="app-settings-content">
			<slot />
		</div>
	</div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
	directives: {
		ClickOutside
	},
	props: {
		title: {
			type: String,
			required: false,
			// TODO: translate
			default: t('core', 'Settings')
		}
	},
	data() {
		return {
			open: false
		}
	},
	methods: {
		toggleMenu() {
			this.open = !this.open
		},
		closeMenu() {
			this.open = false
		}
	}
}
</script>
