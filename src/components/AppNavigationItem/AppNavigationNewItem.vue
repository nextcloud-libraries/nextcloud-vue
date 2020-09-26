<docs>
### New Item element
```
<AppNavigationNewItem title="New Item" icon="icon-add" @new-item="function(value){alert(value)}" />
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
			<div :class="{ 'icon-loading-small': loading, [icon]: icon }"
				class="app-navigation-entry-icon">
				<slot v-if="!loading" name="icon" />
			</div>

			<span v-if="!newItemActive" class="app-navigation-new-item__title" :title="title">
				{{ title }}
			</span>

			<!-- new Item input -->
			<div v-if="newItemActive" class="newItemContainer">
				<InputConfirmCancel v-model="newItemValue"
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
import InputConfirmCancel from './InputConfirmCancel.vue'

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
	computed: {
	},
	methods: {
		handleNewItem() {
			this.newItemActive = true
			this.onMenuToggle(false)
			this.$nextTick(() => {
				// this.$refs.newItemInput.focus()
			})
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
</style>
