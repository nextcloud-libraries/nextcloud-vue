<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<li class="action action-separator action--disabled" role="separator" />
</template>

<script>
export default {
	name: 'NcActionSeparator',
}
</script>

<style lang="scss" scoped>
.action-separator {
	height: 0;
	margin: 5px 10px 5px 15px;
	border-bottom: 1px solid var(--color-border-dark);
	cursor: default;
}
</style>
