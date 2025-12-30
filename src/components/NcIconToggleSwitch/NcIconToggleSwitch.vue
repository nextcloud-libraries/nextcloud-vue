<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
const svg = `<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 12">
	<path d="M17,1H7A5,5 0 0,0 2,6 5,5 0 0,0 7,11H17A5,5 0 0,0 22,6 5,5 0 0,0 17,1Z" />
	<circle
		cy="6"
		r="3"
		fill="var(--color-main-background)" />
</svg>`
</script>

<script setup lang="ts">
import { computed } from 'vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'

const props = withDefaults(defineProps<{
	/** Whether the toggle switch is checked */
	checked: boolean
	/** Size of the icon */
	size?: number
	/** NcIconSvgWrapper's inline prop */
	inline?: boolean
}>(), {
	size: 34,
	inline: false,
})

const color = computed(() => props.checked ? 'var(--color-primary-element)' : 'var(--color-text-maxcontrast)')
const cx = computed(() => props.checked ? 'calc(17 / 24 * 100%)' : 'calc(7 / 24 * 100%)')
</script>

<template>
	<NcIconSvgWrapper
		:class="$style.iconToggleSwitch"
		:svg="svg"
		:size="size"
		:inline="inline" />
</template>

<style module lang="scss">
.iconToggleSwitch {
	color: v-bind(color);
	transition: color var(--animation-quick) ease;

	svg {
		/* Unlike other icons, this icon is not a square */
		height: auto !important;
	}

	circle {
		cx: v-bind(cx);
		transition: cx var(--animation-quick) ease;
	}
}
</style>

<docs>
Private component
</docs>
