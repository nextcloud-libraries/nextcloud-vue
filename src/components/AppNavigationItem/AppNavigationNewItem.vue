<docs>
### New Item element
Add the prop `:new-item=true`.

```
<AppNavigationItem title="New Item" icon="icon-add" :new-item="true" @new-item="function(value){alert(value)}" />
```
</docs>
<template>
	<!-- Navigation item, can be either an <li> or a <router-link> depending on the props -->
	<nav-element v-bind="navElement"
		:class="{
			'app-navigation-entry--newItemActive': newItemActive,
		}"
		class="app-navigation-entry">
		<!-- New Item -->
		<div class="app-navigation-entry-div" @click="handleNewItem">
			<div :class="{ 'icon-loading-small': loading, [icon]: icon && isIconShown }"
				class="app-navigation-entry-icon">
				<slot v-if="!loading" v-show="isIconShown" name="icon" />
			</div>

			<span v-if="!newItemActive" class="app-navigation-entry__title" :title="title">
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
	</nav-element>
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
        navElement() {
			return {
				is: 'li',
			}
		},
	},
	methods: {
		// New Item methods
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
