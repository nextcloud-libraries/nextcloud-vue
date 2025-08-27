<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
```vue
<template>
<NcAssistantContent>
	<div class="container">
		<NcAssistantIcon />
		<div class="content">
			<h3 class="heading">
				Summary of the last 123 messages
			</h3>
			<p>
				Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
				sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
				no sea takimata sanctus est Lorem ipsum dolor sit amet.
			</p>
		</div>
	</div>
</NcAssistantContent>
</template>

<style scoped>
.container {
	display: flex;
	align-items: start;
	flex-direction: row;
}

.content {
	display: flex;
	flex-direction: column;
}

.heading {
	margin-top: 0;
	font-size: var(--default-font-size);
}
</style>
```
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'
import type { VueClassType } from '../../utils/VueTypes.ts'

withDefaults(defineProps<{
	/**
	 * Classes to assign to the content container
	 */
	contentClasses?: VueClassType
}>(), {
	contentClasses: '',
})

defineSlots<{
	/**
	 * The content to be shown.
	 */
	default?: Slot
}>()
</script>

<template>
	<div :class="$style.assistantContent">
		<div :class="[$style.assistantContent__inner, contentClasses]">
			<slot />
		</div>
	</div>
</template>

<style module lang="scss">
.assistantContent {
	background-image: var(--color-border-assistant, linear-gradient(125deg, #7398FE 50%, #6104A4 125%));
	border-radius: var(--border-radius-container);
	padding: 2px;

	&__inner {
		background-color: var(--color-background-assistant, #F6F5FF);
		border-radius: calc(var(--border-radius-container) - 1px);
		color: var(--color-main-text);
		padding: calc(var(--border-radius-container) - 1px);

		height: 100%;
		width: 100%;
	}
}
</style>
