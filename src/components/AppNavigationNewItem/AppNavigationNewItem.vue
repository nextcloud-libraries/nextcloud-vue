<!--
 - @copyright Copyright (c) 2020 Jonathan Treffler <mail@jonathan-treffler.de>
 -
 - @author Jonathan Treffler <mail@jonathan-treffler.de>
 -
 - @license GNU AGPL version 3 or any later version
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<docs>
# Usage

### New Item element
```
<AppNavigationNewItem title="New Item" icon="icon-add" @new-item="function(value){alert(value)}" />
```

### New Item element with a loading animation instead of the icon
```
<AppNavigationNewItem title="New Item" icon="icon-add" :loading="true" />
```
</docs>
<template>
	<li
		:class="{
			'app-navigation-entry--newItemActive': newItemActive,
		}"
		class="app-navigation-entry">
		<!-- New Item -->
		<div class="app-navigation-entry-div" @click="handleNewItem">
			<div :class="{ 'icon-loading-small': loading, [icon]: !loading }"
				class="app-navigation-entry-icon">
				<slot v-if="!loading" name="icon" />
			</div>

			<span v-if="!newItemActive" class="app-navigation-new-item__title" :title="title">
				{{ title }}
			</span>

			<!-- new Item input -->
			<div v-if="newItemActive" class="newItemContainer">
				<InputConfirmCancel ref="newItemInput"
					v-model="newItemValue"
					:placeholder="editPlaceholder !== '' ? editPlaceholder : title"
					@cancel="cancelNewItem"
					@confirm="handleNewItemDone" />
			</div>
		</div>
	</li>
</template>

<script>
import { directive as ClickOutside } from 'v-click-outside'

import isMobile from '../../mixins/isMobile'
import InputConfirmCancel from '../AppNavigationItem/InputConfirmCancel'

export default {
	name: 'AppNavigationNewItem',

	components: {
		InputConfirmCancel,
	},
	directives: {
		ClickOutside,
	},
	mixins: [isMobile],

	props: {
		/**
		 * The title of the element.
		 */
		title: {
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

<style lang="scss">
.app-navigation-new-item__title {
	overflow: hidden;
	max-width: 100%;
	white-space: nowrap;
	text-overflow: ellipsis;
	padding-left: 7px;
	font-size: 14px;
}

.newItemContainer {
	width: calc(100% - #{$clickable-area});
	margin: auto;
}
</style>
