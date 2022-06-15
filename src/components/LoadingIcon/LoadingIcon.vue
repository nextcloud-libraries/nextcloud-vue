<!--
 - @copyright Copyright (c) 2022 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 -
 - @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
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
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<docs>
# Usage

```
<LoadingIcon />
<LoadingIcon :size="64" fill-color="var(--color-primary-element)" title="Loading with primary color" />
```
</docs>

<template>
	<Loading :size="size" :fill-color="fillColor" :title="title" />
</template>

<script>
import Loading from 'vue-material-design-icons/Loading'

export default {
	name: 'LoadingIcon',
	components: {
		Loading,
	},
	props: {
		/**
		 * Specify the size of the loading icon.
		 */
		size: {
			type: Number,
			default: 20,
		},
		/**
		 * Overwrites the default color. Necessary for dark backgrounds.
		 */
		fillColor: {
			type: String,
			default: 'var(--color-loading-dark)',
		},
		/**
		 * Specify what is loading.
		 */
		title: {
			type: String,
			default: '',
		},
	},
}
</script>

<style lang="scss" scoped>
.material-design-icon::v-deep svg {
	animation: rotate var(--animation-duration, 0.8s) linear infinite;
}
</style>
