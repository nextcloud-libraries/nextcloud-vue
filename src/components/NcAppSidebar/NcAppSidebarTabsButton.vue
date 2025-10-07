<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type NcAppSidebarTab from '../NcAppSidebarTab/NcAppSidebarTab.vue'

import NcVNodes from '../NcVNodes/NcVNodes.vue'

const selected = defineModel<boolean>('selected', { required: true })

defineProps<{
	/**
	 * The sidebar tab this button controls
	 */
	tab: InstanceType<typeof NcAppSidebarTab>
}>()
</script>

<template>
	<button
		class="button-vue"
		:class="[$style.sidebarTabsButton, {
			[$style.sidebarTabsButton_selected]: selected,
		}]"
		role="tab"
		:aria-selected="selected"
		:tabindex="selected ? 0 : -1"
		@click="selected = true">
		<span :class="$style.sidebarTabsButton__icon">
			<NcVNodes :vnodes="tab.renderIcon()">
				<span :class="[$style.sidebarTabsButton__legacyIcon, tab.icon]" />
			</NcVNodes>
		</span>
		<span :class="$style.sidebarTabsButton__name">
			{{ tab.name }}
		</span>
	</button>
</template>

<style module lang="scss">
.sidebarTabsButton {
	border: none;
	border-bottom: var(--default-grid-baseline) solid transparent !important;
	border-radius: var(--border-radius-small);
	background-color: var(--color-main-background);
	color: var(--color-main-text);
	font-size: var(--default-font-size);
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: var(--default-grid-baseline);
	padding: var(--border-radius-small);
	transition:
		background-color var(--animation-quick),
		border-bottom-color var(--animation-quick);
	min-width: var(--default-clickable-area);

	&:hover {
		background-color: var(--color-background-hover) !important;
	}

	&:active,
	&:focus {
		background-color: var(--color-main-background) !important;
	}

	* {
		cursor: pointer;
	}
}

.sidebarTabsButton_selected {
	border-bottom-color: var(--color-primary-element) !important;
	border-bottom-left-radius: 0px;
	border-bottom-right-radius: 0px;
	cursor: default;

	&:hover {
		background-color: var(--color-primary-element-light-hover) !important;
		color: var(--color-primary-element-light-text) !important;
	}

	* {
		cursor: default;
	}
}

.sidebarTabsButton__name {
	font-weight: normal;
	overflow: hidden;
	text-overflow: ellipsis;
	text-wrap: nowrap;
}

.sidebarTabsButton_selected .sidebarTabsButton__name {
	font-weight: bold;
}

.sidebarTabsButton__icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.sidebarTabsButton__legacyIcon {
	background-size: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
