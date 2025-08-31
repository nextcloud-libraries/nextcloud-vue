<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup>
import { inject } from 'vue'
import vLinkify from '../../directives/Linkify/index.ts'

defineProps({
	/**
	 * The name used in NcAppSidebar header.
	 */
	name: {
		type: String,
		required: true,
	},

	/**
	 * Title to display for the name.
	 */
	title: {
		type: String,
	},

	/**
	 * Linkify the name.
	 */
	linkify: {
		type: Boolean,
	},
})

const headerRef = inject('NcAppSidebar:header:ref')
</script>

<template>
	<h2
		ref="headerRef"
		v-linkify="{ text: name, linkify }"
		tabindex="-1"
		:title="title">
		{{ name }}
	</h2>
</template>
