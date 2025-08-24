<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Description

List wrapper for use in NcAppNavigation.

#### Example

Usage with NcAppNavigationCaption as a heading.

```vue
<NcAppNavigation>
	<NcAppNavigationList>
		<NcAppNavigationItem name="First" />
		<NcAppNavigationItem name="Second" />
		<NcAppNavigationItem name="Third" />
	</NcAppNavigationList>
	<NcAppNavigationCaption name="Sections" is-heading />
	<NcAppNavigationList>
		<NcAppNavigationItem name="Foo" />
		<NcAppNavigationItem name="Bar" />
		<NcAppNavigationItem name="Baz" />
	</NcAppNavigationList>
</NcAppNavigation>
```
</docs>

<template>
	<ul class="app-navigation-list">
		<slot />
	</ul>
</template>

<script lang="ts">
export default {
	name: 'NcAppNavigationList',
}
</script>

<style lang="scss" scoped>
.app-navigation-list {
	position: relative;
	width: 100%;
	overflow-x: hidden;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: var(--default-grid-baseline, 4px);
	padding: var(--app-navigation-padding);
}
</style>
