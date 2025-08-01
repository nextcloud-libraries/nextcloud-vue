<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { inject } from 'vue'
import vLinkify from '../../directives/Linkify/index.ts'

defineProps<{
	/**
	 * The name used in NcAppSidebar header.
	 */
	name: string

	/**
	 * Title to display for the name.
	 */
	title?: string

	/**
	 * Linkify the name.
	 */
	linkify?: boolean
}>()

const headerRef = inject('NcAppSidebar:header:ref')
</script>

<template>
	<h2
		ref="headerRef"
		v-linkify="{ text: name, linkify }"
		tabindex="-1"
		:title>
		{{ name }}
	</h2>
</template>
