<!--
 - @copyright Copyright (c) 2019 Marco Ambrosini <marcoambrosini@icloud.com>
 -
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
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<template>
	<!-- Button to expand or collapse children -->
	<ButtonVue class="icon-collapse"
		:class="{'icon-collapse--open':open}"
		type="tertiary"
		:aria-label="labelButton"
		@click="onClick">
		<template #icon>
			<ChevronDown v-if="open"
				:size="20" />
			<ChevronRight v-else
				:size="20" />
		</template>
	</ButtonVue>
</template>

<script>
import ButtonVue from '../ButtonVue/index.js'
import { t } from '../../l10n.js'

import ChevronRight from 'vue-material-design-icons/ChevronRight.vue'
import ChevronDown from 'vue-material-design-icons/ChevronDown.vue'

export default {
	name: 'AppNavigationIconCollapsible',

	components: {
		ButtonVue,
		ChevronRight,
		ChevronDown,
	},

	props: {
		open: {
			type: Boolean,
			default: true,
		},
	},

	computed: {
		labelButton() {
			return open ? t('Close') : t('Open')
		},
	},

	methods: {
		onClick(e) {
			this.$emit('click', e)
		},
	},

}
</script>

<style lang="scss" scoped>
.icon-collapse {
	position: absolute;
	z-index: 105; // above a, under button
	color: var(--color-main-text);

	&:hover{
		color: var(--color-primary);
	}
	&--open {
		color: var(--color-main-text);
		&:hover{
			color: var(--color-primary);
		}
	}
}

</style>
