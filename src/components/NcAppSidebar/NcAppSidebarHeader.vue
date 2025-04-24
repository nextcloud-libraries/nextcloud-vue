<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { inject } from 'vue'
import vLinkify from '../../directives/Linkify/index.ts'

defineProps<{
	name: string,
	title?: string,
	linkify?: boolean,
}>()

const id = inject('NcAppSidebar:header:id', 'app-sidebar-vue__header')
</script>

<template>
	<h2 :id
		v-linkify="{ text: name, linkify }"
		:aria-label="title"
		:title>
		<slot>{{ name }}</slot>
	</h2>
</template>
