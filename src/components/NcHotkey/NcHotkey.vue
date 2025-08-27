<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

import { computed } from 'vue'
import NcKbd from '../NcKbd/NcKbd.vue'

const {
	label = undefined,
	hotkey = undefined,
} = defineProps<{
	/**
	 * Label for the hotkey
	 */
	label?: string
	/**
	 * Hotkey combination string separated by space, for example, `Control Alt T` or `F2` (see `<NcKbd>` for supported key names)
	 */
	hotkey?: string
}>()

defineSlots<{
	/**
	 * Custom label content
	 */
	default?: Slot
	/**
	 * Custom hotkey content for an advanced hotkey layout with <NcKbd> components or other custom content
	 */
	hotkey?: Slot
}>()

const symbols = computed(() => {
	return hotkey?.split(/\s+/).map((s) => s.trim())
})

const NO_LABEL_WARNING = '⚠️ NcHotKey must have a label or slot content'
</script>

<template>
	<li :class="$style.hotkey">
		<span role="term" :class="$style.hotkey__keys">
			<slot name="hotkey">
				<NcKbd v-for="(symbol, index) in symbols" :key="index" :symbol />
			</slot>
		</span>
		<span role="definition" :class="$style.hotkey__label">
			<slot>
				{{ label || NO_LABEL_WARNING }}
			</slot>
		</span>
	</li>
</template>

<style lang="scss" module>
.hotkey {
	display: flex;
	flex-direction: row-reverse;
	align-items: stretch;
	padding-inline: var(--border-radius-element); /* Align with form group */

	&:first-child {
		.hotkey__label,
		.hotkey__keys {
			border-block-start: none;
		}
	}

}

.hotkey__label,
.hotkey__keys {
	display: flex;
	align-items: center;
	padding-block: calc(2 * var(--default-grid-baseline));
	border-block-start: 1px solid var(--color-border);
}

.hotkey__label {
	flex: 1 1 200px;
}

.hotkey__keys {
	flex: 1 1 auto;
	flex-wrap: wrap;
	justify-content: end;
	row-gap: calc(1 * var(--default-grid-baseline));
}
</style>
