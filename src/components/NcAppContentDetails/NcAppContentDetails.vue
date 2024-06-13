<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="app-content-details">
		<!-- @slot Provide content to the details view -->
		<slot />
	</div>
</template>

<script>
export default {
	name: 'NcAppContentDetails',
}
</script>
