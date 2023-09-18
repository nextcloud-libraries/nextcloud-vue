<!--
 - @copyright Copyright (c) 2022 Christoph Wurst <christoph@winzerhof-wurst.at>
 -
 - @author Christoph Wurst <christoph@winzerhof-wurst.at>
 - @author Richard Steinmetz <richard@steinmetz.cloud>
 -
 - @license GNU AGPL version 3 or any later version
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->
<docs>
### General description

This components provides a wrapper around guest page content.
It should be used as the main wrapper for public pages, similar to `NcContent`.

It can't be used multiple times on the same page.

### Usage

```vue
<template>
	<NcGuestContent>
		<h2>Hello guest</h2>
		<span>How are you?</span>
	</NcGuestContent>
</template>
```
</docs>

<template>
	<div id="guest-content-vue">
		<slot />
	</div>
</template>

<script>
/**
 * Guest content container to be used for the guest content of your app
 */
export default {
	name: 'NcGuestContent',
	mounted() {
		document.getElementById('content').classList.add('nc-guest-content')
	},
	unmounted() {
		document.getElementById('content').classList.remove('nc-guest-content')
	},
}
</script>

<style lang="scss" scoped>
#guest-content-vue {
	color: var(--color-main-text);
	background-color: var(--color-main-background);
	min-width: 0;
	border-radius: var(--border-radius-large);
	box-shadow: 0 0 10px var(--color-box-shadow);
	height: fit-content;
	padding: 15px;
	margin: 20px auto;
}
</style>

<style lang="scss">
#content.nc-guest-content {
	// Enable scrolling
	overflow: auto;

	// Fix box being cutoff at the bottom
	margin-bottom: 0;
	height: calc(var(--body-height) + var(--body-container-margin));
}
</style>
