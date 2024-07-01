<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Basic usage

```vue
	<template>
		<ul class="nav">
			<NcAppNavigationCaption
				name="Your caption goes here">
				<template #actions>
					<NcActionButton>
						<template #icon>
							<Plus :size="20" />
						</template>
						This is an action
					</NcActionButton>
				</template>
			</NcAppNavigationCaption>
		</ul>
	</template>
	<script>
	import Plus from 'vue-material-design-icons/Plus'

	export default {
		components: {
			Plus,
		},
	}
	</script>
	<style scoped>
		/* mock the appnavigation */
		ul.nav {
			background-color: #cce6f4;
		}
	</style>
```

### Element with a slot for custom actions icon
```vue
	<template>
		<ul class="nav">
			<NcAppNavigationCaption
				name="Your caption goes here">
				<template #actionsTriggerIcon>
					<Plus slot="icon" :size="20" />
				</template>
				<template #actions>
					<NcActionButton>
						<template #icon>
							<Pencil :size="20" />
						</template>
						Rename
					</NcActionButton>
					<NcActionButton>
						<template #icon>
							<Delete :size="20" />
						</template>
						Delete
					</NcActionButton>
					<NcActionButton>
						<template #icon>
							<ArrowRight :size="20" />
						</template>
						Validate
					</NcActionButton>
					<NcActionButton>
						<template #icon>
							<Download :size="20" />
						</template>
						Download
					</NcActionButton>
				</template>
			</NcAppNavigationCaption>
		</ul>
	</template>
	<script>
		import ArrowRight from 'vue-material-design-icons/ArrowRight'
		import Delete from 'vue-material-design-icons/Delete'
		import Download from 'vue-material-design-icons/Download'
		import Pencil from 'vue-material-design-icons/Pencil'
		import Plus from 'vue-material-design-icons/Plus'

		export default {
			components: {
				ArrowRight,
				Delete,
				Download,
				Pencil,
				Plus,
			}
		}
	</script>
	<style scoped>
		/* mock the appnavigation */
		ul.nav {
			background-color: #cce6f4;
		}
	</style>
```

### Element used as a heading
```vue
	<template>
		<!-- e.g. NcAppNavigation-->
		<div style="display: flex; flex-direction: column;">
			<NcAppNavigationCaption heading-id="mylist-heading"
				is-heading
				name="My navigation list" />
			<NcAppNavigationList aria-labelledby="mylist-heading">
				<NcAppNavigationItem name="First" />
				<NcAppNavigationItem name="Second" />
				<NcAppNavigationItem name="Third" />
			</NcAppNavigationList>
		</div>
	</template>
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
		flex-shrink: 0;
		// padding to align the name with the icon of app navigation items
		padding: 0 calc(var(--default-grid-baseline, 4px) * 2) 0 calc(var(--default-grid-baseline, 4px) * 3);
		margin-top: 0px;
		margin-bottom: 12px;
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
