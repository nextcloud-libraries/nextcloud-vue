<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Usage

#### New Item element
```vue
	<template>
		<NcAppNavigationNewItem name="New Item" @new-item="function(value){alert(value)}">
			<template #icon>
				<Plus :size="20" />
			</template>
		</NcAppNavigationNewItem>
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

#### New Item element with a loading animation instead of the icon
```vue
	<template>
		<NcAppNavigationNewItem name="New Item" :loading="true">
			<template #icon>
				<Plus :size="20" />
			</template>
		</NcAppNavigationNewItem>
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
	<li :class="{
			'app-navigation-entry--newItemActive': newItemActive,
		}"
		class="app-navigation-entry">
		<!-- New Item -->
		<button class="app-navigation-entry-button" @click="handleNewItem">
			<span :class="{ [icon]: !loading }"
				class="app-navigation-entry-icon">
				<NcLoadingIcon v-if="loading" />
				<slot v-else name="icon" />
			</span>

			<span v-if="!newItemActive" class="app-navigation-new-item__name" :title="name">
				{{ name }}
			</span>

			<!-- new Item input -->
			<span v-if="newItemActive" class="newItemContainer">
				<NcInputConfirmCancel ref="newItemInput"
					v-model="newItemValue"
					:placeholder="editPlaceholder !== '' ? editPlaceholder : name"
					@cancel="cancelNewItem"
					@confirm="handleNewItemDone" />
			</span>
		</button>
	</li>
</template>

<script>
import NcInputConfirmCancel from '../NcAppNavigationItem/NcInputConfirmCancel.vue'
import NcLoadingIcon from '../NcLoadingIcon/index.js'

export default {
	name: 'NcAppNavigationNewItem',

	components: {
		NcInputConfirmCancel,
		NcLoadingIcon,
	},

	props: {
		/**
		 * The name of the element.
		 */
		name: {
			type: String,
			required: true,
		},
		/**
		 * Refers to the icon on the left, this prop accepts a class
		 * like 'icon-category-enabled'.
		 */
		icon: {
			type: String,
			default: '',
		},

		/**
		 * Displays a loading animated icon on the left of the element
		 * instead of the icon.
		 */
		loading: {
			type: Boolean,
			default: false,
		},
		/**
		 * Only for 'editable' items, sets label for the edit action button.
		 */
		editLabel: {
			type: String,
			default: '',
		},
		/**
		 * Sets the placeholder text for the editing form.
		 */
		editPlaceholder: {
			type: String,
			default: '',
		},
	},

	emits: ['new-item'],

	data() {
		return {
			newItemValue: '',
			newItemActive: false,
		}
	},

	methods: {
		handleNewItem() {
			if (!this.loading) {
				this.newItemActive = true
				this.$nextTick(() => {
					this.$refs.newItemInput.focusInput()
				})
			}
		},
		cancelNewItem() {
			this.newItemActive = false
		},
		handleNewItemDone() {
			this.$emit('new-item', this.newItemValue)
			this.newItemValue = ''
			this.newItemActive = false
		},
	},
}
</script>

<style scoped lang="scss">
@import '../../assets/NcAppNavigationItem';

.app-navigation-new-item__name {
	overflow: hidden;
	max-width: 100%;
	white-space: nowrap;
	text-overflow: ellipsis;
	padding-inline-start: 7px;
	font-size: 14px;
}

.newItemContainer {
	width: calc(100% - var(--default-clickable-area));
	margin: auto;
}
</style>
