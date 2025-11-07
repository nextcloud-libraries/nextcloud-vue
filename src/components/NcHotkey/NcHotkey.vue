<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { computed } from 'vue'
import NcKbd from '../NcKbd/NcKbd.vue'

const props = withDefaults(defineProps<{
	/**
	 * Label for the hotkey
	 */
	label?: string
	/**
	 * Hotkey combination string separated by space, for example, `Control Alt T` or `F2` (see `<NcKbd>` for supported key names)
	 */
	hotkey?: string
}>(), {
	label: undefined,
	hotkey: undefined,
})

const symbols = computed(() => {
	return props.hotkey?.split(/\s+/).map((s) => s.trim())
})

const NO_LABEL_WARNING = '⚠️ NcHotKey must have a label or slot content'
</script>

<template>
	<li :class="$style.hotkey">
		<span role="term" :class="$style.hotkey__keys">
			<!-- @slot Custom hotkey content for an advanced hotkey layout with "NcKbd" components or other custom content -->
			<slot name="hotkey">
				<NcKbd v-for="(symbol, index) in symbols" :key="index" :symbol="symbol" />
			</slot>
		</span>
		<span role="definition" :class="$style.hotkey__label">
			<!-- @slot Custom label content -->
			<slot>
				{{ label || NO_LABEL_WARNING }}
			</slot>
		</span>
	</li>
</template>

<style lang="scss" module>
.hotkey {
	--form-element-label-offset: calc(var(--border-radius-element) + var(--default-grid-baseline));
	display: flex;
	flex-direction: row-reverse;
	align-items: stretch;
	padding-inline: var(--form-element-label-offset);

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
