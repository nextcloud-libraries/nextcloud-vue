<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcSelectUsers v-model="value"
		input-label="My account"
		input-class="cypress-search-input"
		:options="[
			{
				id: '0-john',
				displayName: 'John',
				isNoUser: false,
				subname: 'john@example.org',
			},
			{
				id: '0-emma',
				displayName: 'Emma',
				isNoUser: false,
				subname: 'emma@example.org',
			},
			{
				id: '0-olivia',
				displayName: 'Olivia',
				isNoUser: false,
				subname: 'olivia@example.org',
			},
		]" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NcSelectUsers from '../../../../src/components/NcSelectUsers/NcSelectUsers.vue'

const value = ref()
</script>
