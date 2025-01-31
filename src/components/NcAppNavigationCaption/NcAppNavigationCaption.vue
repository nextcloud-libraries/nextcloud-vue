<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Basic usage

```vue
	<template>
		<div class="styleguide-nc-content">
			<NcAppNavigation>
				<template #list>
					<NcAppNavigationCaption
						name="Your caption goes here">
						<template #actions>
							<NcActionButton>
								<template #icon>
									<IconPlus :size="20" />
								</template>
								This is an action
							</NcActionButton>
						</template>
					</NcAppNavigationCaption>
				</template>
			</NcAppNavigation>
		</div>
	</template>
	<script>
	import IconPlus from 'vue-material-design-icons/Plus.vue'

	export default {
		components: {
			IconPlus,
		},
	}
	</script>
	<style scoped>
		/* Mock NcContent */
		.styleguide-nc-content {
			background-color: var(--color-background-plain);
			overflow: hidden;
		}
	</style>
```

### Element with a slot for custom actions icon
```vue
	<template>
		<div class="styleguide-nc-content">
			<NcAppNavigation>
				<template #list>
					<NcAppNavigationCaption
						name="Your caption goes here">
						<template #actionsTriggerIcon>
							<IconPlus slot="icon" :size="20" />
						</template>
						<template #actions>
							<NcActionButton>
								<template #icon>
									<IconPencil :size="20" />
								</template>
								Rename
							</NcActionButton>
							<NcActionButton>
								<template #icon>
									<IconDelete :size="20" />
								</template>
								Delete
							</NcActionButton>
							<NcActionButton>
								<template #icon>
									<IconArrowRight :size="20" />
								</template>
								Validate
							</NcActionButton>
							<NcActionButton>
								<template #icon>
									<IconDownload :size="20" />
								</template>
								Download
							</NcActionButton>
						</template>
					</NcAppNavigationCaption>
				</template>
			</NcAppNavigation>
		</div>
	</template>
	<script>
		import IconArrowRight from 'vue-material-design-icons/ArrowRight.vue'
		import IconDelete from 'vue-material-design-icons/Delete.vue'
		import IconDownload from 'vue-material-design-icons/Download.vue'
		import IconPencil from 'vue-material-design-icons/Pencil.vue'
		import IconPlus from 'vue-material-design-icons/Plus.vue'

		export default {
			components: {
				IconArrowRight,
				IconDelete,
				IconDownload,
				IconPencil,
				IconPlus,
			}
		}
	</script>
	<style scoped>
		/* Mock NcContent */
		.styleguide-nc-content {
			background-color: var(--color-background-plain);
			overflow: hidden;
		}
	</style>
```

### Element used as a heading
```vue
	<template>
		<div class="styleguide-nc-content">
			<NcAppNavigation>
				<!-- if you need multiple lists you can use it in the default slot like this: -->
				<NcAppNavigationCaption heading-id="people-heading"
					is-heading
					name="People" />
				<NcAppNavigationList aria-labelledby="people-heading">
					<NcAppNavigationItem name="Emma" />
					<NcAppNavigationItem name="Jane" />
					<NcAppNavigationItem name="Jake" />
				</NcAppNavigationList>
				<NcAppNavigationCaption heading-id="places-heading"
					is-heading
					name="Places" />
				<NcAppNavigationList aria-labelledby="places-heading">
					<NcAppNavigationItem name="America" />
					<NcAppNavigationItem name="Australia" />
					<NcAppNavigationItem name="Europe" />
				</NcAppNavigationList>
			</NcAppNavigation>
		</div>
	</template>
	<style scoped>
		/* Mock NcContent */
		.styleguide-nc-content {
			background-color: var(--color-background-plain);
			overflow: hidden;
		}
	</style>
```

</docs>

<template>
	<component :is="wrapperTag"
		class="app-navigation-caption"
		:class="{ 'app-navigation-caption--heading': isHeading }">
		<!-- Name of the caption -->
		<component :is="captionTag"
			:id="headingId"
			class="app-navigation-caption__name">
			{{ name }}
		</component>

		<!-- Actions -->
		<div v-if="hasActions"
			class="app-navigation-caption__actions">
			<NcActions v-bind="$attrs"
				v-on="$listeners">
				<!-- @slot Slot for the actions menu -->
				<slot name="actions" />
				<template #icon>
					<slot name="actionsTriggerIcon" />
				</template>
			</NcActions>
		</div>
	</component>
</template>

<script>
import NcActions from '../NcActions/index.js'

export default {
	name: 'NcAppNavigationCaption',

	components: {
		NcActions,
	},

	inheritAttrs: false,

	props: {
		name: {
			type: String,
			required: true,
		},

		/**
		 * `id` to set on the inner caption
		 * Can be used for connecting the `NcActionCaption` with `NcActionList` using `aria-labelledby`.
		 */
		headingId: {
			type: String,
			default: null,
		},

		/**
		 * Enable when used as a heading
		 * e.g. Before NcAppNavigationList
		 */
		isHeading: {
			type: Boolean,
			default: false,
		},

		/**
		 * If `isHeading` is set, this defines the heading level that should be used
		 */
		headingLevel: {
			type: Number,
			default: 2,
		},

		/**
		 * Any [NcActions](#/Components/NcActions?id=ncactions-1) prop
		 */
		// Not an actual prop but needed to show in vue-styleguidist docs
		// eslint-disable-next-line
		' ': {},
	},

	computed: {
		wrapperTag() {
			return this.isHeading ? 'div' : 'li'
		},
		captionTag() {
			// Limit to at least h2 as h1 is considered invalid and reserved
			const headingLevel = Math.max(2, this.headingLevel)
			return this.isHeading ? `h${headingLevel}` : 'span'
		},
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

	&--heading {
		padding: var(--app-navigation-padding);
		&:not(:first-child):not(:last-child) {
			padding: 0 var(--app-navigation-padding);
		}
	}

	&__name {
		font-weight: bold;
		color: var(--color-main-text);
		font-size: var(--default-font-size);
		line-height: var(--default-clickable-area);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		box-shadow: none !important;
		flex-shrink: 1;
		// padding to align the name with the icon of app navigation items
		padding-block: 0;
		padding-inline: calc(var(--default-grid-baseline, 4px) * 2) 0;
		margin-top: 0px;
		margin-bottom: var(--default-grid-baseline);
	}

	&__actions {
		flex: 0 0 var(--default-clickable-area);
	}
}

// extra top space if it's not the first item on the list
.app-navigation-caption:not(:first-child) {
	margin-top: calc(var(--default-clickable-area) / 2);
}
</style>
