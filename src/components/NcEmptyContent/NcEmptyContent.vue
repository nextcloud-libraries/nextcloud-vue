<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Basic use

Use this component to display a message about an empty content.
Providing an icon, name, and a description is strongly advised.

```
<template>
	<NcEmptyContent name="No comments"
		description="Start writing comments and they will appear here.">
		<template #icon>
			<Comment />
		</template>
	</NcEmptyContent>
</template>

<script>
import Comment from 'vue-material-design-icons/Comment.vue'

export default {
	components: {
		Comment,
	},
}
</script>
```
#### With custom svg

```
<template>
	<NcEmptyContent
		name="No files in here">
		<template #icon>
			<NcIconSvgWrapper :svg="folderSvg" />
		</template>
	</NcEmptyContent>
</template>

<script>
import folderSvg from '@mdi/svg/svg/folder.svg?raw'

export default {
	components: {
		Comment,
	},
	data() {
		return {
			folderSvg,
		}
	},
}
</script>
```

You can also customize the name using the `#name` slot
and add actions. But to keep the style consistent across Nextcloud
consider only using header elements as the root elements for the name slot.

```
<template>
	<NcEmptyContent
		description="No comments in here">
		<template #icon>
			<Comment />
		</template>
		<template #name>
			<h1 class="empty-content__name">
				No comments
			</h1>
		</template>
		<template #action>
			<NcButton variant="primary">
				Add a comment!
			</NcButton>
		</template>
	</NcEmptyContent>
</template>

<script>
import Comment from 'vue-material-design-icons/Comment.vue'

export default {
	components: {
		Comment,
	},
}
</script>
```

Similar to the `#name` slot, you could also use the `#description` slot.
The content will be rendered within a paragraph so you can use any inline element,
like a link.

```
<template>
	<NcEmptyContent
		name="No comments">
		<template #icon>
			<Comment />
		</template>
		<template #description>
			<a href="https://en.wikipedia.org/wiki/Comment">What is even a comment?</a>
		</template>
	</NcEmptyContent>
</template>

<script>
import Comment from 'vue-material-design-icons/Comment.vue'

export default {
	components: {
		Comment,
	},
}
</script>
```
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'

withDefaults(defineProps<{
	/**
	 * Desription of the empty content
	 *
	 * @example 'No comments yet, start the conversation!'
	 */
	description?: string

	/**
	 * A header message about an empty content shown.
	 *
	 * @example 'No comments'
	 */
	name?: string
}>(), {
	description: '',
	name: '',
})

defineSlots<{
	/**
	 * Optional slot for a button or the like
	 */
	action?: Slot

	/**
	 * Optional slot for adding an icon
	 */
	icon?: Slot

	/**
	 * Allow to add custom formatted name as an alternative to the name property.
	 * The content passed shall be enclosed by a header element.
	 */
	name?: Slot

	/**
	 * Optional formatted description rendered inside a paragraph as an alternative to the description property.
	 */
	description?: Slot
}>()
</script>

<template>
	<div class="empty-content" role="note">
		<div v-if="$slots.icon" class="empty-content__icon" aria-hidden="true">
			<slot name="icon" />
		</div>
		<slot name="name">
			<span v-if="name !== ''" class="empty-content__name">
				{{ name }}
			</span>
		</slot>
		<p v-if="description !== '' || $slots.description" class="empty-content__description">
			<slot name="description">
				{{ description }}
			</slot>
		</p>
		<div v-if="$slots.action" class="empty-content__action">
			<slot name="action" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.empty-content {
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	/* In case of using in a flex container - flex in advance */
	flex-grow: 1;
	padding: var(--default-grid-baseline);

	.modal-wrapper & {
		margin-top: 5vh;
		margin-bottom: 5vh;
	}

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
			width: 64px !important;
			height: 64px !important;
			max-width: 64px !important;
			max-height: 64px !important;
		}
	}

	&__name {
		margin-bottom: 10px;
		text-align: center;
		font-weight: bold;
		font-size: 20px;
		line-height: 30px;
	}

	&__description {
		color: var(--color-text-maxcontrast);
		text-align: center;
		text-wrap-style: balance;
	}

	&__action {
		margin-top: 8px;

		.modal-wrapper & {
			margin-top: 20px;
			display: flex;
		}
	}
}
</style>
