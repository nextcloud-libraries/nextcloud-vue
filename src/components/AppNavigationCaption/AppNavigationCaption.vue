<docs>
```
<AppNavigationCaption
	title="Your caption goes here">
	<template #actions>
		<ActionButton icon="icon-add"/>
	</template>
</AppNavigationCaption>
```

### Element with a slot for custom actions icon
```
<template>
	<AppNavigationCaption
		title="Your caption goes here">
		<template #actionsTriggerIcon>
			<PlusIcon slot="icon" :size="20" />
		</template>
		<template #actions>
			<ActionButton icon="icon-edit">Rename</ActionButton>
			<ActionButton icon="icon-delete">Delete</ActionButton>
			<ActionButton icon="icon-confirm">Validate</ActionButton>
			<ActionButton icon="icon-download">Download</ActionButton>
		</template>
	</AppNavigationCaption>
</template>
<script>
	import PlusIcon from 'vue-material-design-icons/Plus'

	export default {
		components: {
			PlusIcon
		}
	}
</script>
```

</docs>

<template>
	<li class="app-navigation-caption">
		<!-- Title of the caption -->
		<h2 class="app-navigation-caption__title">
			{{ title }}
		</h2>

		<!-- Actions -->
		<div v-if="hasActions"
			class="app-navigation-caption__actions">
			<Actions v-bind="$attrs">
				<!-- @slot Slot for the actions menu -->
				<slot name="actions" />
				<template #icon>
					<slot name="actionsTriggerIcon" />
				</template>
			</Actions>
		</div>
	</li>
</template>

<script>
import Actions from '../Actions/index.js'

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
	padding: 0 8px 0 math.div($clickable-area, 2);

	&__title {
		font-weight: bold;
		color: var(--color-primary-element);
		font-size: var(--default-font-size);
		line-height: $clickable-area;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		opacity: $opacity_normal;
		box-shadow: none !important;
		flex-shrink: 0;
	}

	&__actions {
		flex: 0 0 $clickable-area;
	}
}

// extra top space if it's not the first item on the list
.app-navigation-caption:not(:first-child) {
	margin-top: math.div($clickable-area, 2);
}
</style>
