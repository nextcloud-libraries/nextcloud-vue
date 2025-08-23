<!--
  - SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

 <docs>
### Usage

 ```
 <template>
	<NcAppNavigationNew text="New Element">
		<template #icon>
			<Plus :size="20" />
		</template>
	</NcAppNavigationNew>
 </template>
 <script>
 import Plus from 'vue-material-design-icons/Plus'

 export default {
	components: {
		Plus,
	},
 }
 </script>
 ```
 </docs>

<template>
	<div class="app-navigation-new">
		<NcButton
			:id="buttonId"
			:disabled
			:variant
			@click="$emit('click')">
			<template #icon>
				<slot name="icon" />
			</template>
			{{ text }}
		</NcButton>
	</div>
</template>

<script>
import NcButton from '../NcButton/index.ts'

export default {
	components: {
		NcButton,
	},

	props: {
		/**
		 * Id of the button
		 */
		buttonId: {
			type: String,
			required: false,
			default: '',
		},

		/**
		 * Disabled state of the button
		 */
		disabled: {
			type: Boolean,
			required: false,
			default: false,
		},

		/**
		 * Main text of the button
		 */
		text: {
			type: String,
			required: true,
		},

		/**
		 * The color variant to use.
		 *
		 * @default 'primary'
		 */
		variant: {
			type: String,
			default: 'primary',
			validator(value) {
				return ['primary', 'secondary', 'tertiary'].indexOf(value) !== -1
			},
		},
	},

	emits: ['click'],
}
</script>

<style lang="scss" scoped>
/* 'New' button */
.app-navigation-new {
	display: block;
	padding: calc(var(--default-grid-baseline, 4px) * 2);
	button {
		width: 100%;
	}
}
</style>
