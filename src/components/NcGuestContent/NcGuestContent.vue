<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
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
	destroyed() {
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
