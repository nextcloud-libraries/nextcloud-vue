<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
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
	inset-inline-end: 0;
	&--open {
		color: var(--color-main-text);
		&:hover{
			color: var(--color-primary-element);
		}
	}
}

</style>
