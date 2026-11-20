<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { onMounted, ref, useId } from 'vue'
import { getSelectedVersion, NEXTCLOUD_VERSIONS, selectVersion } from '../runtime/nextcloudVersion.js'

const id = useId()
// The selected version is only known in the browser
const selected = ref<string>()

onMounted(() => {
	selected.value = getSelectedVersion().id
})

/**
 * Select the version, which reloads the page
 *
 * @param event - The change event of the select
 */
function onChange(event: Event) {
	selectVersion((event.target as HTMLSelectElement).value)
}
</script>

<template>
	<div class="nc-version-select">
		<label :for="id" class="nc-version-select__label">Nextcloud version</label>
		<select
			:id="id"
			class="nc-version-select__select"
			:value="selected"
			:disabled="!selected"
			title="The Nextcloud version simulated by the examples"
			@change="onChange">
			<option v-for="version in NEXTCLOUD_VERSIONS" :key="version.id" :value="version.id">
				{{ version.label }}
			</option>
		</select>
	</div>
</template>

<style>
.nc-version-select {
	display: flex;
	align-items: center;
	gap: 8px;
}

.nc-version-select__label {
	color: var(--vp-c-text-2);
	font-size: 12px;
	white-space: nowrap;
}

.nc-version-select__select {
	padding: 4px 20px 4px 6px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 6px;
	background-color: var(--vp-c-bg-alt);
	color: var(--vp-c-text-1);
	font-size: 13px;
	font-weight: 500;
	appearance: auto;
	cursor: pointer;
}

.nc-version-select__select:hover,
.nc-version-select__select:focus-visible {
	border-color: var(--vp-c-brand-1);
}

/* Nav bar of the desktop layout: show the selector next to the appearance toggle */
.VPNavBar .content-body > .VPNavBarAppearance {
	order: 1;
}

.VPNavBar .content-body > .nc-version-select {
	order: 2;
	margin-inline-start: 8px;
}

.VPNavBar .content-body > .VPSocialLinks,
.VPNavBar .content-body > .VPNavBarExtra,
.VPNavBar .content-body > .VPNavBarHamburger {
	order: 3;
}

.VPNavBar .nc-version-select__label {
	/* Visually hidden, the select is labelled for assistive technologies */
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip-path: inset(50%);
	white-space: nowrap;
}

/* The nav bar has no space on small screens, the menu contains the selector there */
@media (max-width: 767px) {
	.VPNavBar .nc-version-select {
		display: none;
	}
}

/* Menu of the mobile layout */
.VPNavScreen .nc-version-select {
	justify-content: space-between;
	margin-top: 24px;
}
</style>
