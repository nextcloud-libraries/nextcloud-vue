<template>
	<a
		class="app-navigation-entry-link"
		href="#"
		:aria-description="ariaDescription"
		@click="onClick">
		<!-- icon if not collapsible -->
		<!-- never show the icon over the collapsible if mobile -->
		<div :class="{ 'icon-loading-small': loading, [icon]: icon && isIconShown }"
			class="app-navigation-entry-icon">
			<slot />
		</div>
		<span v-if="!editingActive" class="app-navigation-entry__title" :title="title">
			{{ title }}
		</span>
		<div v-if="editingActive" class="editingContainer">
			<InputConfirmCancel
				ref="editingInput"
				:value="editingValue"
				:placeholder="editPlaceholder !== '' ? editPlaceholder : title"
				@input="$emit('input', $event)"
				@cancel="$emit('cancel', false)"
				@confirm="handleEditingDone" />
		</div>
	</a>
</template>

<script>
import InputConfirmCancel from './InputConfirmCancel'

export default {
	name: 'AppNavigationItemTitle',
	components: {
		InputConfirmCancel,
	},
	props: {
		/**
		 * Displays a loading animated icon on the left of the element
		 * instead of the icon.
		 */
		loading: {
			type: Boolean,
			default: false,
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
		 * Flag for icon on the left side
		 */
		isIconShown: {
			type: Boolean,
			default: false,
		},
		/**
		 * Flag for editing process
		 */
		editingActive: {
			type: Boolean,
			default: false,
		},
		/**
		 * The title of the element.
		 */
		title: {
			type: String,
			required: true,
		},
		/**
		 * Only for items in 'editable' mode, sets the placeholder text for the editing form.
		 */
		editPlaceholder: {
			type: String,
			default: '',
		},
		/**
		 * Value of the editing element
		 */
		editingValue: {
			type: String,
			default: '',
		},
		/**
		 * Entry aria details
		 */
		ariaDescription: {
			type: String,
			default: null,
		},

	},
	methods: {
		handleEditingDone() {
			this.$emit('update:title', this.editingValue)
			this.$emit('update:editingValue', '')
			this.$emit('update:editingActive', false)
		},

		// forward click event
		onClick(event) {
			this.$emit('click', event)
		},
	},
}
</script>
