<!--
  - SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to be used inside of the [NcActions](#NcActions) component slots.

```vue
	<NcActions>
		<NcActionCaption name="Test caption" />
		<NcActionCaption name="Test caption 2" />
	</NcActions>
```
</docs>

<template>
	<li class="app-navigation-caption" :role="isInSemanticMenu && 'presentation'">
		{{ name }}
	</li>
</template>

<script>
export default {
	name: 'NcActionCaption',

	inject: {
		isInSemanticMenu: {
			from: 'NcActions:isSemanticMenu',
			default: false,
		},
	},

	props: {
		/**
		 * The caption's text
		 */
		name: {
			type: String,
			required: true,
		},
	},
}
</script>

<style lang="scss" scoped>
	.app-navigation-caption {
		color: var(--color-text-maxcontrast);
		line-height: var(--default-clickable-area);
		white-space: nowrap;
		text-overflow: ellipsis;
		box-shadow: none !important;
		user-select: none;
		pointer-events: none;
		margin-inline-start: 12px;
		padding-inline-end: 14px;
		height: var(--default-clickable-area);
		display: flex;
		align-items: center;
	}
</style>
