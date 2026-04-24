<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
const { href, decorateExternal = false } = defineProps<{
	/** Link attribute to render */
	href: string
	/** Whether to add the appended arrow decoration */
	decorateExternal?: boolean
}>()
</script>

<template>
	<a
		:href="href"
		rel="noopener noreferrer"
		target="_blank"
		:class="[$style.externalLink, {
			[$style.externalLink_decorated]: decorateExternal,
		}]">
		<slot name="default">{{ href }}</slot>
	</a>
</template>

<style module lang="scss">
.externalLink {
	text-decoration: underline;
}

.externalLink_decorated::after {
	content: ' ↗';
}
</style>

<docs>
An internal component
</docs>
