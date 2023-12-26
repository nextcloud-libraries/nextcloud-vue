<!--
  - @copyright Copyright (c) 2022
  -
  - @license AGPL-3.0-or-later
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
This component is made to be used inside of the [NcActions](#NcActions) component slots,
to group buttons as one visual action, like for text alignment.
This should be used sparingly for accessibility.

```vue
<template>
	<div style="display: flex; align-items: center;">
		<NcActions>
			<NcActionButtonGroup name="Text alignment">
				<NcActionButton aria-label="Align left"
					@click="showMessage('Align left')">
					<template #icon>
						<AlignLeft :size="20" />
					</template>
				</NcActionButton>
				<NcActionButton aria-label="Align center"
					@click="showMessage('Align center')">
					<template #icon>
						<AlignCenter :size="20" />
					</template>
				</NcActionButton>
				<NcActionButton aria-label="Align right"
					@click="showMessage('Align Right')">
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
import GenRandomId from '../../utils/GenRandomId.js'
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

	methods: {
		t,
	},

	computed: {
		labelId() {
			return `nc-action-button-group-${GenRandomId()}`
		},
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
		}
	}
}
</style>
