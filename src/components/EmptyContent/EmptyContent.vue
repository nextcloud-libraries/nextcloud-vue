<!--
  - @copyright Copyright (c) 2020 Greta Doci <gretadoci@gmail.com>
  -
  - @author 2020 Greta Doci <gretadoci@gmail.com>
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
### Basic use

Use this component to display a message about an empty content.
An icon and a title are mandatory.
Providing an additional description is strongly advised.

```
<EmptyContent icon="icon-comment">
	No comments
	<template #desc>No comments in here</template>
</EmptyContent>
```
</docs>

<template>
	<div class="empty-content" role="note">
		<div class="empty-content__icon" :class="icon" role="img" />
		<h2 class="empty-content__title">
			<!-- @slot Mandatory title -->
			<slot />
		</h2>
		<p v-show="$slots.desc">
			<!-- @slot Optional description -->
			<slot name="desc" />
		</p>
	</div>
</template>

<script>
export default {
	name: 'EmptyContent',
	props: {
		/**
		 * The main icon illustration
		 */
		icon: {
			type: String,
			required: true,
		},
	},
}
</script>

<style lang="scss">
.empty-content {
	margin-top: 20vh;
	display: flex;
	flex-direction: column;
	align-items: center;

	&__icon {
		width: 64px;
		height: 64px;
		margin: 0 auto 15px;
		opacity: .4;
		background-size: 64px;
		background-repeat: no-repeat;
		background-position: center;
	}

	&__title {
		margin-bottom: 10px;
	}
}
</style>
