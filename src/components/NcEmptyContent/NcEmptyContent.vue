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
Providing an icon, title, and a description is strongly advised.

```
<template>
	<NcEmptyContent>
		No comments
		<template #icon>
			<Comment />
		</template>
		<template #desc>No comments in here</template>
	</NcEmptyContent>
</template>

<script>
import Comment from 'vue-material-design-icons/Comment'

export default {
	components: {
		Comment,
	},
}
</script>
```

```
<template>
	<NcEmptyContent>
		Network error
		<template #icon>
			<Airplane />
		</template>
		<template #desc>Unable to load the list</template>
	</NcEmptyContent>
</template>

<script>
import Airplane from 'vue-material-design-icons/Airplane'

export default {
	components: {
		Airplane,
	},
}
</script>
```
</docs>

<template>
	<div class="empty-content" role="note">
		<div v-if="hasIcon" class="empty-content__icon">
			<!-- @slot Optional material design icon -->
			<slot name="icon" />
		</div>
		<h2 v-if="hasTitle" class="empty-content__title">
			<!-- @slot Optional title -->
			<slot />
		</h2>
		<p v-if="hasDescription">
			<!-- @slot Optional description -->
			<slot name="desc" />
		</p>
	</div>
</template>

<script>
export default {
	name: 'NcEmptyContent',

	data() {
		return {
			/**
			 * Making sure the slots are reactive
			 */
			slots: this.$slots,
		}
	},

	computed: {
		hasIcon() {
			return this.slots.icon !== undefined
		},

		hasTitle() {
			return this.slots?.default !== undefined
				&& this.slots?.default[0]?.text
		},

		hasDescription() {
			return this.slots?.desc !== undefined
				&& this.slots?.desc[0]?.text
		},
	},
}
</script>

<style lang="scss" scoped>
.empty-content {
	display: flex;
	align-items: center;
	flex-direction: column;
	margin-top: 20vh;

	&__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		margin: 0 auto 15px;
		opacity: .4;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 64px;

		:deep(svg) {
			width: 64px;
			height: 64px;
		}
	}

	&__title {
		margin-bottom: 10px;
		text-align: center;
	}
}
</style>
