<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
# Usage

```
<div>
	<NcLoadingIcon />
</div>
<div style="background-color: #171717;">
	<NcLoadingIcon :size="64" appearance="light" name="Loading on dark background" />
</div>
<div style="background-color: #fff;">
	<NcLoadingIcon :size="64" appearance="dark" name="Loading on light background" />
</div>
```
</docs>

<template>
	<span :aria-label="name"
		role="img"
		class="material-design-icon loading-icon">
		<svg :width="size"
			:height="size"
			viewBox="0 0 24 24">
			<path :fill="colors[0]" d="M12,4V2A10,10 0 1,0 22,12H20A8,8 0 1,1 12,4Z" />
			<path :fill="colors[1]" d="M12,4V2A10,10 0 0,1 22,12H20A8,8 0 0,0 12,4Z">
				<title v-if="name">{{ name }}</title>
			</path>
		</svg>
	</span>
</template>

<script>
export default {
	name: 'NcLoadingIcon',
	props: {
		/**
		 * Specify the size of the loading icon.
		 */
		size: {
			type: Number,
			default: 20,
		},
		/**
		 * The appearance of the loading icon.
		 * 'auto' adjusts to the Nextcloud color scheme,
		 * 'light' and 'dark' are static.
		 */
		appearance: {
			type: String,
			validator(value) {
				return ['auto', 'light', 'dark'].includes(value)
			},
			default: 'auto',
		},
		/**
		 * Specify what is loading.
		 */
		name: {
			type: String,
			default: '',
		},
	},
	computed: {
		colors() {
			const colors = ['#777', '#CCC']
			if (this.appearance === 'light') {
				return colors
			} else if (this.appearance === 'dark') {
				return colors.reverse()
			}
			return ['var(--color-loading-light)', 'var(--color-loading-dark)']
		},
	},
}
</script>

<style lang="scss" scoped>
.loading-icon svg{
	animation: rotate var(--animation-duration, 0.8s) linear infinite;
}
</style>
