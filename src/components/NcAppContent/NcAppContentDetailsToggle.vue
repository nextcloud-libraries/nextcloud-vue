<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { mdiArrowRight } from '@mdi/js'
import { emit } from '@nextcloud/event-bus'
import { onBeforeUnmount, watch } from 'vue'
import NcButton from '../NcButton/index.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'
import { useIsMobile } from '../../composables/useIsMobile/index.js'
import { t } from '../../l10n.js'

const isMobile = useIsMobile()
watch(isMobile, toggleAppNavigationButton, { immediate: true })

onBeforeUnmount(() => {
	if (isMobile.value) {
		toggleAppNavigationButton(false)
	}
})

/**
 * Toggle the app navigation button and hide it if needed.
 *
 * @param hide - if true the navigation toggle is visually hidden
 */
function toggleAppNavigationButton(hide = true) {
	const appNavigationToggle = document.querySelector<HTMLElement>('.app-navigation .app-navigation-toggle')
	if (appNavigationToggle) {
		appNavigationToggle.style.display = hide ? 'none' : ''

		// If we hide the NavigationToggle, we need to make sure the Navigation is also closed
		if (hide === true) {
			emit('toggle-navigation', { open: false })
		}
	}
}
</script>

<template>
	<NcButton :aria-label="t('Go back to the list')"
		class="app-details-toggle"
		:class="{ 'app-details-toggle--mobile': isMobile }"
		:title="t('Go back to the list')"
		variant="tertiary">
		<template #icon>
			<NcIconSvgWrapper directional :path="mdiArrowRight" />
		</template>
	</NcButton>
</template>

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
