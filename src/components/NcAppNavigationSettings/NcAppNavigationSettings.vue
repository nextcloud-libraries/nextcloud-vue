<!--
  - SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { computed, ref, useTemplateRef } from 'vue'
import { createElementId } from '../../utils/createElementId.js'
import { t } from '../../l10n.ts'

import IconCog from 'vue-material-design-icons/Cog.vue'
import NcButton from '../NcButton/NcButton.vue'

const {
	excludeClickOutsideSelectors = [],
	name = t('Settings'),
} = defineProps<{
	/**
	 * A query-selector or an array of query-selectors
	 * to be ignored when clicking outside an element
	 */
	excludeClickOutsideSelectors?: string | string[]

	/**
	 * Text of the button
	 * @default 'Settings'
	 */
	name?: string
}>()

defineSlots<{
	/**
	 * Content of the accordion button (the settings).
	 */
	default: Slot
}>()

const contentId = createElementId()
/**
 * Are the settings open
 */
const open = ref(false)

// Close the menu when the user clicks outside of the container
const container = useTemplateRef('wrapperElement')
const ignore = computed(() => Array.isArray(excludeClickOutsideSelectors)
	? excludeClickOutsideSelectors
	: excludeClickOutsideSelectors.split(' '),
)
onClickOutside(container, () => { open.value = false }, { ignore })
</script>

<template>
	<div ref="wrapperElement" :class="$style.container">
		<div :class="$style.header">
			<NcButton :aria-controls="contentId"
				:aria-expanded="open ? 'true' : 'false'"
				:class="$style.button"
				alignment="start"
				variant="tertiary"
				wide
				@click="open = !open">
				<template #icon>
					<IconCog :size="20" />
				</template>
				{{ name }}
			</NcButton>
		</div>
		<Transition :enter-active-class="$style.animationActive"
			:leave-active-class="$style.animationActive"
			:enter-from-class="$style.animationStop"
			:leave-to-class="$style.animationStop">
			<div v-show="open"
				:id="contentId"
				:class="$style.content">
				<slot />
			</div>
		</Transition>
	</div>
</template>

<style module>
.container {
	margin-top: auto;
	padding: var(--default-grid-baseline);
}

.header {
	margin-block: 0 var(--default-grid-baseline);
	margin-inline: var(--default-grid-baseline);
}

/* Overwrite the padding to match NcAppNavigationItem */
.button {
	padding-left: 0 !important;
	padding-inline-end: calc((var(--default-clickable-area) - 16px) / 2) !important;

	:global(.button-vue__text) {
		font-weight: normal;
	}
}

.content {
	display: block;
	padding: 10px;

	/* prevent scrolled contents from stopping too early */
	margin-bottom: calc(-1 * var(--default-grid-baseline));

	/* restrict height of settings and make scrollable */
	max-height: 300px;
	overflow-y: auto;
}

.animationActive {
	transition-duration: var(--animation-slow);
	transition-property: max-height, padding;
	overflow-y: hidden !important;
}

.animationStop {
	max-height: 0 !important;
	padding: 0 10px !important;
}
</style>
