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
		v-click-outside="clickOutsideConfig"
		:class="{ open }">
		<div id="app-settings-header">
			<button class="settings-button"
				@click="toggleMenu">
				{{ title }}
			</button>
		</div>
		<transition name="slide-up">
			<div v-show="open" id="app-settings-content">
				<slot />
			</div>
		</transition>
	</div>
</template>

<script>
import { directive as ClickOutside } from 'v-click-outside'
import { t } from '../../l10n'
import { excludeClickOutsideClasses } from '../../mixins'

export default {
	directives: {
		ClickOutside,
	},
	mixins: [
		excludeClickOutsideClasses,
	],
	props: {
		title: {
			type: String,
			required: false,
			default: t('Settings'),
		},
	},
	data() {
		return {
			open: false,
			clickOutsideConfig: {
				handler: this.closeMenu,
				middleware: this.clickOutsideMiddleware,
			},
		}
	},
	methods: {
		toggleMenu() {
			this.open = !this.open
		},
		closeMenu() {
			this.open = false
		},
	},
}
</script>
<style lang="scss" scoped>
#app-settings-content {
	display: block;
	padding: 10px;
	background-color: var(--color-main-background);
	/* restrict height of settings and make scrollable */
	max-height: 300px;
	overflow-y: auto;
	box-sizing: border-box;
}

.slide-up-leave-active,
.slide-up-enter-active {
	transition-duration: var(--animation-slow);
	transition-property: max-height, padding;
	overflow-y: hidden !important;
}

.slide-up-enter,
.slide-up-leave-to {
	max-height: 0 !important;
	padding: 0 10px !important;
}

</style>
