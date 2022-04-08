<!--
 - @copyright Copyright (c) 2019 Christoph Wurst <christoph@winzerhof-wurst.at>
 -
 - @author Christoph Wurst <christoph@winzerhof-wurst.at>
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 - @author Marco Ambrosini <marcoambrosini@pm.me>
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
	<Actions class="app-navigation-toggle">
		<ActionButton :aria-expanded="open ? 'true' : 'false'"
			aria-controls="app-navigation-vue"
			@click="toggleNavigation">
			<template #icon>
				<Menu :size="20"
					title=""
					decorative />
			</template>
			{{ label }}
		</ActionButton>
	</Actions>
</template>

<script>
import Actions from '../Actions/Actions'
import ActionButton from '../ActionButton/ActionButton'
import { t } from '../../l10n'

import Menu from 'vue-material-design-icons/Menu'

export default {
	name: 'AppNavigationToggle',

	components: {
		Actions,
		ActionButton,
		Menu,
	},

	props: {
		open: {
			type: Boolean,
			required: true,
		},
	},

	computed: {
		label() {
			return this.open ? t('Close navigation') : t('Open navigation')
		},
	},
	methods: {
		toggleNavigation() {
			this.$emit('update:open', !this.open)
		},
	},
}
</script>

<style scoped lang="scss">

button.app-navigation-toggle {
	position: absolute;
	top: 0;
	right: 0;
	margin-right: - $clickable-area;
}

</style>
