<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to be used in the Nextcloud top header,
similar to the NcHeaderMenu but to be used when only a trigger button is needed, e.g. when opening a dialog.

```
<template>
	<div id="nextcloud-header">
		<NcHeaderButton id="search-dialog"
			aria-label="Search"
			@click="showDialog = true">
			<template #icon>
				<Magnify />
			</template>
		</NcHeaderButton>

		<NcDialog name="Search"
			size="normal"
			v-model:open="showDialog">
			<NcTextField label="Search for files, comments, contacts…"
				type="search"
				v-model="query" />
			<NcEmptyContent name="Search"
				:description="query ? `No results for '${query}'` : 'Start typing to search'">
				<template #icon>
					<Magnify />
				</template>
			</NcEmptyContent>
		</NcDialog>
	</div>
</template>
<script>
import Magnify from 'vue-material-design-icons/Magnify'

export default {
	components: {
		Magnify,
	},

	data() {
		return {
			showDialog: false,
			query: '',
		}
	},
}
</script>
<style>
#nextcloud-header {
	display: flex;
	justify-content: right;
	background-color: var(--color-primary);
	height: var(--header-height, 50px);
	padding-inline-end: 12px;
}
</style>
```
</docs>

<template>
	<!-- We need a wrapper for server styles to apply -->
	<div :id="id" class="header-menu">
		<NcButton :type="ButtonType.TertiaryNoBackground"
			class="header-menu__trigger"
			:aria-label="ariaLabel"
			:aria-describedby="descriptionId"
			size="large"
			@click.prevent="$emit('click', $event)">
			<template #icon>
				<!-- @slot Icon trigger slot. Make sure the svg path
				is at least 16px. Usually mdi icon works at 20px -->
				<slot name="icon" />
			</template>
		</NcButton>

		<span v-if="description"
			:id="descriptionId"
			class="header-menu__description hidden-visually">
			{{ description }}
		</span>
	</div>
</template>

<script setup lang="ts">
import { createElementId } from '../../utils/createElementId.ts'
import NcButton, { ButtonType } from '../NcButton/index.js'

defineProps<{
	/** Unique id for this menu */
	id: string,
	/** `aria-label` attribute of the button */
	ariaLabel: string,
	/** Optional visually hidden description text for the button */
	description?: string
}>()

defineEmits<{
	click: [event: MouseEvent]
}>()

const descriptionId = createElementId()
</script>

<style lang="scss" scoped>
@import '../NcHeaderMenu/header-menu__trigger';
</style>
