<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div
		class="app-content-list"
		:class="{ selection, showdetails: showDetails }">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'NcAppContentList',
	props: {
		selection: {
			type: Boolean,
			default: false,
		},

		showDetails: {
			type: Boolean,
			default: false,
		},
	},
}
</script>
