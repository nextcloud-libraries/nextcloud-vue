<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup>
import { inject } from 'vue'
import vLinkify from '../../directives/Linkify/index.js'

defineProps({
	name: {
		required: true,
		type: String,
	},
	title: {
		type: String,
	},
	linkify: {
		type: Boolean,
	},
})

const id = inject('NcAppSidebar:header:id', 'app-sidebar-vue__header')
const headerRef = inject('NcAppSidebar:header:ref')
console.log(headerRef)
</script>

<template>
	<h2 :id="id"
		ref="headerRef"
		v-linkify="{ text: name, linkify }"
		:aria-label="title"
		:title="title">
		<slot>{{ name }}</slot>
	</h2>
</template>
