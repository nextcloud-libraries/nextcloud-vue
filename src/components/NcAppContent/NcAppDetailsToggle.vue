<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcButton :aria-label="title"
		class="app-details-toggle"
		:class="{ 'app-details-toggle--mobile': isMobile }"
		:title
		variant="tertiary">
		<template #icon>
			<NcIconSvgWrapper directional :path="mdiArrowLeft" />
		</template>
	</NcButton>
</template>

<script>
import { mdiArrowLeft } from '@mdi/js'
import { emit } from '@nextcloud/event-bus'
import { useIsMobile } from '../../composables/useIsMobile/index.js'
import { t } from '../../l10n.js'

import NcButton from '../NcButton/index.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'

export default {
	name: 'NcAppDetailsToggle',

	components: {
		NcButton,
		NcIconSvgWrapper,
	},

	setup() {
		return {
			isMobile: useIsMobile(),
			mdiArrowLeft,
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
