<docs>
```
<AppNavigationCaption
	title="Your caption goes here">
	<ActionButton
		slot="actions"
		icon="icon-add"/>
</AppNavigationCaption>
```
</docs>

<template>
	<li class="app-navigation-caption">
		<!-- Title of the caption -->
		<div class="app-navigation-caption__title">
			{{ title }}
		</div>

		<!-- Actions -->
		<div v-if="hasActions"
			class="app-navigation-caption__actions">
			<Actions v-bind="$attrs">
				<!-- @slot Slot for the actions menu -->
				<slot name="actions" />
			</Actions>
		</div>
	</li>
</template>

<script>
import Actions from '../Actions/Actions'

export default {
	name: 'AppNavigationCaption',

	components: {
		Actions,
	},
	props: {
		title: {
			type: String,
			required: true,
		},
	},

	computed: {
		// Check if the actions slot is populated
		hasActions() {
			return !!this.$slots.actions
		},
	},
}
</script>

<style lang="scss" scoped>

.app-navigation-caption {
	display: flex;
	justify-content: space-between;
	flex-direction: row-reverse;
	padding: 0 8px 0 $clickable-area/2;

	&__title {
		font-weight: bold;
		color: var(--color-primary-element);
		line-height: $clickable-area;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		opacity: $opacity_normal;
		box-shadow: none !important;
		order: 1;
		flex-shrink: 0;
	}

	&__actions {
		flex: 0 0 $clickable-area;
	}
}

// extra top space if it's not the first item on the list
.app-navigation-caption:not(:first-child) {
	margin-top: $clickable-area / 2;
}
</style>
