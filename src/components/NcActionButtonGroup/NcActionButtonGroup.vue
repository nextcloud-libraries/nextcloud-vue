<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to be used inside of the [NcActions](#NcActions) component slots,
to group buttons as one visual action, like for text alignment.
This should be used sparingly for accessibility.

```vue
<template>
	<div style="display: flex; align-items: center;">
		<NcActions>
			<NcActionButtonGroup name="Text alignment">
				<NcActionButton aria-label="Align left"
					v-model="alignment"
					type="radio"
					value="l">
					<template #icon>
						<AlignLeft :size="20" />
					</template>
				</NcActionButton>
				<NcActionButton aria-label="Align center"
					v-model="alignment"
					type="radio"
					value="c">
					<template #icon>
						<AlignCenter :size="20" />
					</template>
				</NcActionButton>
				<NcActionButton aria-label="Align right"
					v-model="alignment"
					type="radio"
					value="r">
					<template #icon>
						<AlignRight :size="20" />
					</template>
				</NcActionButton>
			</NcActionButtonGroup>
			<NcActionButton :close-after-click="true"
				@click="showMessage('Some other action')">
				<template #icon>
					<Plus :size="20" />
				</template>
				Some other action
			</NcActionButton>
		</NcActions>
	</div>
</template>
<script>
import AlignLeft from 'vue-material-design-icons/AlignHorizontalLeft'
import AlignRight from 'vue-material-design-icons/AlignHorizontalRight'
import AlignCenter from 'vue-material-design-icons/AlignHorizontalCenter'
import Plus from 'vue-material-design-icons/Plus'

export default {
	components: {
		AlignLeft,
		AlignRight,
		AlignCenter,
		Plus,
	},
	data() {
		return { alignment: 'l' }
	},
	methods: {
		showMessage(msg) {
			alert(msg)
		},
	},
}
</script>
```
</docs>

<template>
	<li class="nc-button-group-base" :role="isInSemanticMenu && 'presentation'">
		<div v-if="name" :id="labelId">
			{{ name }}
		</div>
		<ul class="nc-button-group-content" role="group" :aria-labelledby="name ? labelId : undefined">
			<slot />
		</ul>
	</li>
</template>

<script>
import { defineComponent } from 'vue'
import { createElementId } from '../../utils/createElementId.ts'
import { t } from '../../l10n.js'

/**
 * A wrapper for allowing inlining NcAction components within the action menu
 */
export default defineComponent({
	name: 'NcActionButtonGroup',

	inject: {
		isInSemanticMenu: {
			from: 'NcActions:isSemanticMenu',
			default: false,
		},
	},

	props: {
		/**
		 * Optional text shown below the button group
		 */
		name: {
			required: false,
			default: undefined,
			type: String,
		},
	},

	setup() {
		return {
			labelId: `nc-action-button-group-${createElementId()}`,
		}
	},

	methods: {
		t,
	},
})
</script>

<style lang="scss">
.nc-button-group-base {
	>div {
		text-align: center;
		color: var(--color-text-maxcontrast);
	}

	ul.nc-button-group-content {
		display: flex;
		gap: 4px; // required for the focus-visible outline
		justify-content: space-between;
		li {
			flex: 1 1;
		}

		.action-button {
			// Fix action buttons beeing shifted to the left (right padding)
			padding: 0 !important;
			width: 100%;
			display: flex;
			justify-content: center;

			&.action-button--active {
				background-color: var(--color-primary-element);
				border-radius: var(--border-radius-large);
				color: var(--color-primary-element-text);

				&:hover, &:focus, &:focus-within {
					background-color: var(--color-primary-element-hover);
				}
			}

			.action-button__pressed-icon {
				display: none;
			}
		}
	}
}
</style>
