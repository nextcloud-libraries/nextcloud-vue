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
		<NcButton :id="buttonId"
			:disabled="disabled"
			:type="type"
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
		buttonId: {
			type: String,
			required: false,
			default: '',
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false,
		},
		text: {
			type: String,
			required: true,
		},
		type: {
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
