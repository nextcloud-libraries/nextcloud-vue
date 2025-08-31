<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<!-- Button to expand or collapse children -->
	<NcButton
		class="icon-collapse"
		:class="{
			'icon-collapse--active': active,
			'icon-collapse--open': open,
		}"
		:aria-label="labelButton"
		:variant="active ? 'tertiary-on-primary' : 'tertiary'"
		@click="onClick">
		<template #icon>
			<ChevronUp
				v-if="open"
				:size="20" />
			<ChevronDown
				v-else
				:size="20" />
		</template>
	</NcButton>
</template>

<script>
import ChevronDown from 'vue-material-design-icons/ChevronDown.vue'
import ChevronUp from 'vue-material-design-icons/ChevronUp.vue'
import { t } from '../../l10n.js'
import NcButton from '../NcButton/index.js'

export default {
	name: 'NcAppNavigationIconCollapsible',

	components: {
		NcButton,
		ChevronDown,
		ChevronUp,
	},

	props: {
		/**
		 * Is the list currently open (or collapsed)
		 */
		open: {
			type: Boolean,
			// eslint-disable-next-line vue/no-boolean-default
			default: true,
		},

		/**
		 * Is the navigation item currently active.
		 */
		active: {
			type: Boolean,
			required: true,
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
.icon-collapse {
	position: relative;
	inset-inline-end: 0;

	// the whole navigation item is hovered thus will have the hover color - to distinguish we need to set a different color here.
	&:hover {
		background-color: var(--color-background-dark) !important;
	}
	&--active:hover {
		background-color: var(--color-primary-element) !important;
	}
}
</style>
