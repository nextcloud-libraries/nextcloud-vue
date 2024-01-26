<!--
 - @copyright Copyright (c) 2019 Christoph Wurst <christoph@winzerhof-wurst.at>
 -
 - @author Christoph Wurst <christoph@winzerhof-wurst.at>
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 - @author Marco Ambrosini <marcoambrosini@icloud.com>
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
	<div class="app-navigation-toggle-wrapper">
		<NcButton class="app-navigation-toggle"
			type="tertiary"
			:aria-expanded="open ? 'true' : 'false'"
			:aria-label="label"
			:title="label"
			aria-controls="app-navigation-vue"
			@click="toggleNavigation">
			<template #icon>
				<MenuOpenIcon v-if="open" :size="20" />
				<MenuIcon v-else :size="20" />
			</template>
		</NcButton>
	</div>
</template>

<script>
import NcButton from '../NcButton/index.js'
import { t } from '../../l10n.js'

import MenuIcon from 'vue-material-design-icons/Menu.vue'
import MenuOpenIcon from 'vue-material-design-icons/MenuOpen.vue'

export default {
	name: 'NcAppNavigationToggle',

	components: {
		NcButton,
		MenuIcon,
		MenuOpenIcon,
	},

	props: {
		/**
		 * Tracks whether the toggle has been clicked or not.
		 * If it has been clicked, switches between the different MenuIcons
		 * and emits a boolean indicating its opened status
		 */
		open: {
			type: Boolean,
			required: true,
		},
	},

	emits: ['update:open'],

	computed: {
		label() {
			return this.open ? t('Close navigation') : t('Open navigation')
		},
	},
	methods: {
		/**
		 * Once the toggle has been clicked, emits the toggle status
		 * so parent components can gauge the status of the navigation button
		 */
		toggleNavigation() {
			this.$emit('update:open', !this.open)
		},
	},
}
</script>

<style scoped lang="scss">
.app-navigation-toggle-wrapper {
	position: absolute;
	top: var(--app-navigation-padding);
	right: calc(0px - var(--app-navigation-padding));
	margin-right: - $clickable-area;
}

button.app-navigation-toggle {
	background-color: var(--color-main-background);
}
</style>
