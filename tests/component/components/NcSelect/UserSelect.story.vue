<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcSelect user-select
		input-label="My account"
		input-class="cypress-search-input"
		:options="[
			{
				id: '0-john',
				displayName: 'John',
				isNoUser: false,
				subname: 'john@example.org',
				icon: '',
			},
			{
				id: '0-emma',
				displayName: 'Emma',
				isNoUser: false,
				subname: 'emma@example.org',
				icon: '',
			},
			{
				id: '0-olivia',
				displayName: 'Olivia',
				isNoUser: false,
				subname: 'olivia@example.org',
				icon: '',
			},
		]" />
</template>

<script setup lang="ts">
import NcSelect from '../../../../src/components/NcSelect/NcSelect.vue'
</script>
