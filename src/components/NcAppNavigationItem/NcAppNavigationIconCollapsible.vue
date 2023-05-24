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
	<NcButton class="icon-collapse"
		:class="{'icon-collapse--open':open}"
		type="tertiary"
		:aria-label="labelButton"
		@click="onClick">
		<template #icon>
			<ChevronUp v-if="open"
				:size="20" />
			<ChevronDown v-else
				:size="20" />
		</template>
	</NcButton>
</template>

<script>
import NcButton from '../NcButton/index.js'
import { t } from '../../l10n.js'

import ChevronDown from 'vue-material-design-icons/ChevronDown.vue'
import ChevronUp from 'vue-material-design-icons/ChevronUp.vue'

export default {
	name: 'NcAppNavigationIconCollapsible',

	components: {
		NcButton,
		ChevronDown,
		ChevronUp,
	},

	props: {
		open: {
			type: Boolean,
			default: true,
		},
	},

	emits: ['click'],

	computed: {
		labelButton() {
			return this.open ? t('Collapse menu') : t('Open menu')
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
.button-vue.icon-collapse {
	position: relative;
	z-index: 105; // above a, under button
	color: var(--color-main-text);
	right: 0;
	&--open {
		color: var(--color-main-text);
		&:hover{
			color: var(--color-primary-element);
		}
	}
}

</style>
