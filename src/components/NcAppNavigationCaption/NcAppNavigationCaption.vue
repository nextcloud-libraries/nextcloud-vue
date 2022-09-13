<docs>
```
<NcAppNavigationCaption
	title="Your caption goes here">
	<template #actions>
		<NcActionButton icon="icon-add"/>
	</template>
</NcAppNavigationCaption>
```

### Element with a slot for custom actions icon
```
<template>
	<NcAppNavigationCaption
		title="Your caption goes here">
		<template #actionsTriggerIcon>
			<PlusIcon slot="icon" :size="20" />
		</template>
		<template #actions>
			<NcActionButton icon="icon-edit">Rename</NcActionButton>
			<NcActionButton icon="icon-delete">Delete</NcActionButton>
			<NcActionButton icon="icon-confirm">Validate</NcActionButton>
			<NcActionButton icon="icon-download">Download</NcActionButton>
		</template>
	</NcAppNavigationCaption>
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
			<NcActions v-bind="$attrs">
				<!-- @slot Slot for the actions menu -->
				<slot name="actions" />
				<template #icon>
					<slot name="actionsTriggerIcon" />
				</template>
			</NcActions>
		</div>
	</li>
</template>

<script>
import NcActions from '../NcActions/index.js'

export default {
	name: 'NcAppNavigationCaption',

	components: {
		NcActions,
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
	padding: 0 0 0 math.div($clickable-area, 2);
	margin-right: calc(var(--default-grid-baseline) * 2); /* same as NcAppNavigationItem */

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
