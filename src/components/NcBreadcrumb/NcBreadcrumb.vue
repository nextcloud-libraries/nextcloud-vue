<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description

This component is meant to be used inside a Breadcrumbs component.
Renders a button element when given no redirection props, otherwise, renders <a/> or <router-link/> elements

</docs>

<template>
	<li ref="crumb"
		class="vue-crumb"
		:class="{ 'vue-crumb--hovered': hovering }"
		:[crumbId]="''"
		draggable="false"
		@dragstart.prevent="() => { /** Prevent the breadcrumb from being draggable. */ }"
		@drop.prevent="dropped"
		@dragover.prevent="() => {}"
		@dragenter="dragEnter"
		@dragleave="dragLeave">
		<NcButton v-if="(name || icon || $slots.icon) && !$slots.default"
			:aria-label="icon ? name : undefined"
			:title="title"
			variant="tertiary"
			v-bind="linkAttributes"
			v-on="$listeners">
			<template v-if="$slots.icon || icon" #icon>
				<!-- @slot Slot for passing a material design icon. Precedes the icon and name prop. -->
				<slot name="icon">
					<span :class="icon" class="icon" />
				</slot>
			</template>
			<template v-if="!($slots.icon || icon) || forceIconText" #default>
				{{ name }}
			</template>
		</NcButton>
		<NcActions v-if="$slots.default"
			ref="actions"
			:force-menu="forceMenu"
			:open="open"
			:menu-name="name"
			:title="title"
			:force-name="true"
			:container="`.vue-crumb[${crumbId}]`"
			variant="tertiary"
			@update:open="onOpenChange">
			<template #icon>
				<!-- @slot Slot for the custom menu icon -->
				<slot name="menu-icon" />
			</template>
			<!-- @slot All action elements passed into the default slot will be used -->
			<slot />
		</NcActions>
		<ChevronRight class="vue-crumb__separator" :size="20" />
	</li>
</template>

<script>
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue'
import NcButton from '../NcButton/NcButton.vue'
import GenRandomId from '../../utils/GenRandomId.js'
import NcActions from '../NcActions/index.js'

export default {
	name: 'NcBreadcrumb',
	components: {
		NcActions,
		ChevronRight,
		NcButton,
	},

	inheritAttrs: false,
	props: {
		/**
		 * The main text content of the entry.
		 */
		name: {
			type: String,
			required: true,
		},

		/**
		 * The title attribute of the element.
		 */
		title: {
			type: String,
			default: null,
		},

		/**
		 * Route Location the link should navigate to when clicked on.
		 *
		 * @see https://v3.router.vuejs.org/api/#to
		 */
		to: {
			type: [String, Object],
			default: undefined,
		},

		/**
		 * Match the complete route attributes (query and hash included)
		 *
		 * @see https://v3.router.vuejs.org/api/#exact
		 */
		exact: {
			type: Boolean,
			default: false,
		},

		/**
		 * Set this prop if your app doesn't use vue-router, breadcrumbs will show as normal links.
		 */
		href: {
			type: String,
			default: undefined,
		},

		/**
		 * Set a css icon-class to show an icon along name text (if forceIconText is provided, otherwise just icon).
		 */
		icon: {
			type: String,
			default: '',
		},

		/**
		 * Enables text to accompany the icon, if the icon was provided. The text that will be displayed is the name prop.
		 */
		forceIconText: {
			type: Boolean,
			default: false,
		},

		/**
		 * Disable dropping on this breadcrumb.
		 */
		disableDrop: {
			type: Boolean,
			default: false,
		},

		/**
		 * Force the actions to display in a three dot menu
		 */
		forceMenu: {
			type: Boolean,
			default: false,
		},

		/**
		 * Open state of the Actions menu
		 */
		open: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'update:open',
		'dropped',
	],

	data() {
		return {
			/**
			 * Variable to track if we hover over the breadcrumb
			 */
			hovering: false,
			/**
			 * The unique id of the breadcrumb. Necessary to append the
			 * Actions menu to the correct crumb.
			 */
			crumbId: `crumb-id-${GenRandomId()}`,
		}
	},

	computed: {
		/**
		 * The attributes to pass to `router-link` or `a`
		 */
		linkAttributes() {
			// If it's a router-link, we pass `to` and `exact`, if its an <a/> element, we pass `href`, otherwise we have a button
			return this.to
				? { to: this.to, exact: this.exact, ...this.$attrs }
				: (this.href
						? { href: this.href, ...this.$attrs }
						: this.$attrs
					)
		},
	},

	methods: {
		/**
		 * Function to handle changing the open state of the Actions menu
		 * $emit the open state.
		 *
		 * @param {boolean} open The open state of the Actions menu
		 */
		onOpenChange(open) {
			/**
			 * Event emitted when the open state of the Actions menu changes
			 *
			 * @type {null}
			 */
			this.$emit('update:open', open)
		},

		/**
		 * Function to handle a drop on the breadcrumb.
		 * $emit the event and the path, remove the hovering state.
		 *
		 * @param {object} e The drop event
		 * @return {boolean}
		 */
		dropped(e) {
			/**
			 * Don't do anything if dropping is disabled.
			 */
			if (this.disableDrop) {
				return false
			}
			/**
			 * Event emitted when something is dropped on the breadcrumb.
			 *
			 * @param {Event} event The DOM drop event
			 * @param {(string|object)} to The `to` prop or, if not set, the `href` prop
			 */
			this.$emit('dropped', e, this.to || this.href)
			this.$parent.$emit('dropped', e, this.to || this.href)
			this.hovering = false
			return false
		},

		/**
		 * Add the hovering state on drag enter
		 */
		dragEnter() {
			/**
			 * Don't do anything if dropping is disabled.
			 */
			if (this.disableDrop) {
				return
			}
			this.hovering = true
		},

		/**
		 * Remove the hovering state on drag leave
		 *
		 * @param {object} e The drag leave event
		 */
		dragLeave(e) {
			/**
			 * Don't do anything if dropping is disabled.
			 */
			if (this.disableDrop) {
				return
			}
			// Don't do anything if we
			// - leave towards a child element.
			// - or are still within the crumb
			if (e.target.contains(e.relatedTarget)
				|| this.$refs.crumb.contains(e.relatedTarget)) {
				return
			}
			this.hovering = false
		},
	},
}
</script>

<style lang="scss" scoped>

.vue-crumb {
	background-image: none;
	display: inline-flex;
	height: var(--default-clickable-area);
	padding: 0;

	&:last-child {
		min-width: 0;

		// Don't show breadcrumb separator for last crumb
		.vue-crumb__separator {
			display: none;
		}
	}

	// Necessary to hide hidden crumbs
	&--hidden {
		display: none;
	}
	&__separator {
		padding: 0;
		color: var(--color-text-maxcontrast);
	}
	// Necessary for indicating hovering for drag and drop
	&#{&}--hovered :deep(.button-vue) {
		background-color: var(--color-background-dark);
		color: var(--color-main-text);
	}
	// Adjust button style
	&:not(:last-child) :deep() .button-vue {
		color: var(--color-text-maxcontrast);

		&:hover,
		&:focus {
			background-color: var(--color-background-dark);
			color: var(--color-main-text);
		}

		&__text {
			font-weight: normal;
		}
	}
	:deep(.button-vue__text) {
		margin: 0;
	}

	// Adjust action item appearance for crumbs with actions
	// to match other crumbs
	&:not(.dropdown) :deep(.action-item) {
		// Adjustments necessary to correctly shrink on small screens
		max-width: 100%;

		.button-vue {
			padding: 0 4px 0 16px;
			max-width: 100%;

			&__wrapper {
				flex-direction: row-reverse;
			}
		}

		// Adjust the background of the last crumb when the action is open
		&.action-item--open .action-item__menutoggle {
			background-color: var(--color-background-dark);
			color: var(--color-main-text);
		}
	}
}
</style>
