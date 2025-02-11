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
			:open.sync="showDialog">
			<NcTextField label="Search for files, comments, contacts…"
				type="search"
				:value.sync="query" />
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
		<NcButton type="tertiary-no-background"
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

<script>
import GenRandomId from '../../utils/GenRandomId.js'
import NcButton from '../NcButton/index.js'

export default {
	name: 'NcHeaderButton',

	components: {
		NcButton,
	},

	props: {
		/**
		 * Unique id for this menu
		 */
		id: {
			type: String,
			required: true,
		},

		/**
		 * `aria-label` attribute of the button
		 */
		ariaLabel: {
			type: String,
			required: true,
		},

		/**
		 * Additional visually hidden description text for the button
		 */
		description: {
			type: String,
			default: null,
		},
	},

	emits: [
		'click',
	],

	data() {
		return {
			descriptionId: GenRandomId(),
		}
	},
}
</script>

<style lang="scss" scoped>
@import '../NcHeaderMenu/header-menu__trigger';
</style>
