<!--
  - @copyright 2024 Christopher Ng <chrng8@gmail.com>
  -
  - @author Christopher Ng <chrng8@gmail.com>
  -
  - @license AGPL-3.0-or-later
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
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

<script>
export default {
	name: 'NcAppNavigationList',
}
</script>

<style lang="scss" scoped>
ul.app-navigation-list { // Increase specificity over NcAppNavigation styles
	position: relative;
	height: fit-content;
	width: 100%;
	overflow: visible;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: var(--default-grid-baseline, 4px);
	padding: var(--app-navigation-padding);
}
</style>
