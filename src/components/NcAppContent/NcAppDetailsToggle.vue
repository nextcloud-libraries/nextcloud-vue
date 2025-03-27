<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcButton v-tooltip="title"
		class="app-details-toggle"
		:class="{ 'app-details-toggle--mobile': isMobile }"
		:aria-label="title"
		variant="tertiary">
		<template #icon>
			<ArrowLeft v-if="isRtl" :size="20" />
			<ArrowRight v-else :size="20" />
		</template>
	</NcButton>
</template>

<script>
import NcButton from '../NcButton/index.ts'
import { t } from '../../l10n.js'
import Tooltip from '../../directives/Tooltip/index.js'

import { emit } from '@nextcloud/event-bus'

import ArrowRight from 'vue-material-design-icons/ArrowRight.vue'
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'

import { useIsMobile } from '../../composables/useIsMobile/index.js'
import { isRtl } from '../../utils/rtl.ts'

export default {
	name: 'NcAppDetailsToggle',

	directives: {
		tooltip: Tooltip,
	},

	components: {
		NcButton,
		ArrowRight,
		ArrowLeft,
	},
	setup() {
		return {
			isRtl,
			isMobile: useIsMobile(),
		}
	},

	computed: {
		title() {
			return t('Go back to the list')
		},
	},
	watch: {
		isMobile: {
			immediate: true,
			handler() {
				this.toggleAppNavigationButton(this.isMobile)
			},
		},
	},

	beforeUnmount() {
		if (this.isMobile) {
			this.toggleAppNavigationButton(false)
		}
	},

	methods: {
		toggleAppNavigationButton(hide = true) {
			const appNavigationToggle = document.querySelector('.app-navigation .app-navigation-toggle')
			if (appNavigationToggle) {
				appNavigationToggle.style.display = hide ? 'none' : null

				// If we hide the NavigationToggle, we need to make sure the Navigation is also closed
				if (hide === true) {
					emit('toggle-navigation', { open: false })
				}
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.app-details-toggle {
	position: sticky;
	width: var(--default-clickable-area);
	height: var(--default-clickable-area);
	padding: $icon-margin;
	cursor: pointer;
	opacity: .6;
	transform: rotate(180deg);
	background-color: var(--color-main-background);
	z-index: 2000;

	top: var(--app-navigation-padding);
	// Navigation Toggle button width + 2 paddings around
	inset-inline-start: calc(var(--default-clickable-area) + var(--app-navigation-padding) * 2);
	&--mobile {
		// There is no NavigationToggle button
		inset-inline-start: var(--app-navigation-padding);
	}

	&:active,
	&:hover,
	&:focus {
		opacity: 1;
	}
}

</style>
