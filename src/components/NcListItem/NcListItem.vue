<!--
  - SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### Default Usage

```vue
<template>
	<ul>
		<NcListItem active
			bold
			:counter-number="123"
			counterType="highlighted"
			details="1h"
			name="This is an active element with highlighted counter">
			<template #icon>
				<NcAvatar disable-menu :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
				In this slot you can put both text and other components such as icons
			</template>
			<template #indicator>
				<!-- Color dot -->
				<CheckboxBlankCircle :size="16" fill-color="#fff" />
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
				<NcActionButton>
					Button three
				</NcActionButton>
			</template>
		</NcListItem>
		<NcListItem
			name="This is an active element with outlined counter"
			:bold="false"
			:active="true"
			:counter-number="123"
			counterType="outlined">
			<template #icon>
				<NcAvatar disable-menu :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
				In this slot you can put both text and other components such as icons
			</template>
			<template #indicator>
				<!-- Color dot -->
				<CheckboxBlankCircle :size="16" fill-color="#fff" />
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
				<NcActionButton>
					Button three
				</NcActionButton>
			</template>
		</NcListItem>
		<NcListItem
			name="This is an active element with normal counter"
			:bold="false"
			:active="true"
			:counter-number="123">
			<template #icon>
				<NcAvatar disable-menu :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
				In this slot you can put both text and other components such as icons
			</template>
			<template #details>
				<LinkIcon :size="16"/>
			</template>
			<template #indicator>
				<!-- Color dot -->
				<CheckboxBlankCircle :size="16" fill-color="#fff" />
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
				<NcActionButton>
					Button three
				</NcActionButton>
			</template>
		</NcListItem>
		<NcListItem
			name="Name of the element with highlighted counter"
			bold
			:force-display-actions="true"
			details="1h"
			:counter-number="123"
			counterType="highlighted">
			<template #icon>
				<NcAvatar disable-menu :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
				In this slot you can put both text and other components such as icons
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
				<NcActionButton>
					Button three
				</NcActionButton>
			</template>
		</NcListItem>
		<NcListItem
			name="Name of the element with outlined counter"
			:bold="false"
			:force-display-actions="true"
			:counter-number="123"
			counterType="outlined">
			<template #icon>
				<NcAvatar disable-menu :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
				In this slot you can put both text and other components such as icons
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
				<NcActionButton>
					Button three
				</NcActionButton>
			</template>
		</NcListItem>
		<NcListItem
			name="Name of the element with normal counter"
			:bold="false"
			:force-display-actions="true"
			details="1h"
			:counter-number="123">
			<template #icon>
				<NcAvatar disable-menu :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
				In this slot you can put both text and other components such as icons
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
				<NcActionButton>
					Button three
				</NcActionButton>
			</template>
		</NcListItem>
		<NcListItem
			name="Name of the element"
			:bold="false">
			<template #icon>
				<NcAvatar disable-menu :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #name>
				<span style="display: flex; gap: 0.5rem; color: var(--color-warning);">
					Flexible styling within the first line of the component
					<div style="color: var(--color-error);">
						like this.
					</div>
				</span>
			</template>
			<template #subname>
				In this slot you can put both text and other components such as icons
			</template>
			<template #details>
				<LinkIcon :size="16"/>
			</template>
			<template #indicator>
				<!-- Color dot -->
				<CheckboxBlankCircle :size="16" fill-color="#0082c9"/>
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
				<NcActionButton>
					Button three
				</NcActionButton>
			</template>
		</NcListItem>
		<NcListItem
			name="Without subname, Name of the element"
			:bold="false"
			details="1h">
			<template #icon>
				<NcAvatar disable-menu :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #indicator>
				<!-- Color dot -->
				<CheckboxBlankCircle :size="16" fill-color="#0082c9"/>
			</template>
		</NcListItem>
	</ul>
</template>

<script>
	import CheckboxBlankCircle from 'vue-material-design-icons/CheckboxBlankCircle'
	import LinkIcon from 'vue-material-design-icons/Link'

	export default {
		components: {
			CheckboxBlankCircle,
			LinkIcon,
		}
	}
</script>

```

### NcListItem one line mode
```vue
<NcListItem active
	:bold="false"
	:counter-number="123"
	counterType="highlighted"
	details="1h"
	name="This is an active element with highlighted counter"
	one-line>
	<template #icon>
		<NcAvatar disable-menu :size="34" user="janedoe" display-name="Jane Doe" />
	</template>
	<template #subname>
		In this slot you can put both text and other components such as icons
	</template>
	<template #indicator>
		<!-- Color dot -->
		<CheckboxBlankCircle :size="20" fill-color="#fff" />
	</template>
	<template #actions>
		<NcActionButton>
			Button one
		</NcActionButton>
		<NcActionButton>
			Button two
		</NcActionButton>
		<NcActionButton>
			Button three
		</NcActionButton>
	</template>
</NcListItem>
```
### NcListItem with extra actions slot and customized icon

The `extra-actions` slot can be used to add other interactive components.

The `actions-icon` slot can be used to pass icon to the inner NcActions component.

```vue
<template>
	<div>
		<NcListItem
			name="This is an active element with extra actions slot"
			bold
			:active="true"
			:force-display-actions="true">
			<template #icon>
				<NcAvatar disable-menu :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #extra-actions>
				<NcButton variant="primary">
					<template #icon>
						<IconCog :size="20" />
					</template>
				</NcButton>
			</template>
			<template #actions-icon>
				<IconNoteText :size="20" />
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
				<NcActionButton>
					Button three
				</NcActionButton>
			</template>
		</NcListItem>
		<NcListItem
			name="This is an element with extra actions slot"
			bold>
			<template #icon>
				<NcAvatar disable-menu :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #extra-actions>
				<NcButton variant="tertiary">
					<template #icon>
						<IconPencil :size="20" />
					</template>
				</NcButton>
				<NcButton variant="tertiary">
					<template #icon>
						<IconCog :size="20" />
					</template>
				</NcButton>
			</template>
			<template #actions-icon>
				<IconNoteText :size="20" />
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
				<NcActionButton>
					Button three
				</NcActionButton>
			</template>
		</NcListItem>
	</div>
</template>
<script>
	import IconCog from 'vue-material-design-icons/Cog.vue'
	import IconNoteText from 'vue-material-design-icons/NoteText.vue'
	import IconPencil from 'vue-material-design-icons/Pencil.vue'

	export default {
		components: {
			IconCog,
			IconNoteText,
			IconPencil,
		},
	}
</script>
```
### NcListItem compact mode
```vue
<template>
	<ul style="width: 350px;">
		<NcListItem active
			compact
			name="Active item">
			<template #icon>
				<IconNoteText :size="20" />
			</template>
		</NcListItem>
		<NcListItem compact
			name="Name of the element">
			<template #icon>
				<IconNoteText :size="20" />
			</template>
		</NcListItem>
		<NcListItem compact
			name="Name of the element"
			:counter-number="1">
			<template #icon>
				<IconNoteText :size="20" />
			</template>
			<template #subname>
				This one is with subname
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
			</template>
		</NcListItem>
		<NcListItem compact
			name="Name of the element"
			:counter-number="3">
			<template #icon>
				<IconNoteText :size="20" />
			</template>
			<template #subname>
				This one is with subname
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
			</template>
		</NcListItem>
		<NcListItem compact
			name="Name of the element"
			:counter-number="4"
			href="https://nextcloud.com">
			<template #icon>
				<IconNoteText :size="20" />
			</template>
			<template #subname>
				This one is with an external link
			</template>
		</NcListItem>
	</ul>
</template>
<script>
	import IconNoteText from 'vue-material-design-icons/NoteText.vue'

	export default {
		components: {
			IconNoteText,
		},
	}
</script>
```
</docs>

<template>
	<!-- This wrapper can be either a router link or a `<li>` -->
	<component :is="to ? 'router-link' : 'NcVNodes'"
		v-slot="{ href: routerLinkHref, navigate, isActive }"
		v-bind="{ ...to && { custom: true, to } }">
		<li class="list-item__wrapper"
			:class="{ 'list-item__wrapper--active' : active ?? isActive }"
			v-bind="$attrs">
			<div ref="list-item"
				class="list-item"
				:class="{
					'list-item--compact': compact,
					'list-item--legacy': isLegacy,
					'list-item--one-line': oneLine,
				}"
				@mouseover="handleMouseover"
				@mouseleave="handleMouseleave">
				<a :id="anchorId || undefined"
					:aria-label="linkAriaLabel"
					class="list-item__anchor"
					:href="routerLinkHref || href"
					:target="target || (href === '#' ? undefined : '_blank')"
					:rel="href === '#' ? undefined : 'noopener noreferrer'"
					@focus="showActions"
					@focusout="handleBlur"
					@click="onClick($event, navigate, routerLinkHref)"
					@keydown.esc="hideActions">
					<!-- @slot This slot is used for the NcAvatar or icon, the content of this slot must not be interactive -->
					<slot name="icon" />

					<!-- Main content -->
					<div class="list-item-content">
						<div class="list-item-content__main">
							<div class="list-item-content__name">
								<!-- @slot Slot for the first line of the component. prop 'name' is used as a fallback is no slots are provided -->
								<slot name="name">{{ name }}</slot>
							</div>
							<div v-if="hasSubname"
								class="list-item-content__subname"
								:class="{'list-item-content__subname--bold': bold}">
								<!-- @slot Slot for the second line of the component -->
								<slot name="subname" />
							</div>
						</div>
						<div class="list-item-content__details">
							<div v-if="showDetails" class="list-item-details__details">
								<!-- @slot This slot is used for some details in form of icon (prop `details` as a fallback) -->
								<slot name="details">{{ details }}</slot>
							</div>
							<!-- Counter and indicator -->
							<div v-if="counterNumber !== 0 || hasIndicator"
								v-show="showAdditionalElements"
								class="list-item-details__extra">
								<NcCounterBubble v-if="counterNumber !== 0"
									:count="counterNumber"
									:active="active ?? isActive"
									class="list-item-details__counter"
									:type="counterType" />

								<span v-if="hasIndicator" class="list-item-details__indicator">
									<!-- @slot This slot is used for some indicator in form of icon -->
									<slot name="indicator" />
								</span>
							</div>
						</div>
					</div>
				</a>

				<div v-if="$slots['extra-actions']" class="list-item-content__extra-actions">
					<!-- @slot Extra elements next to the right side quick menu -->
					<slot name="extra-actions" />
				</div>

				<!-- Actions -->
				<div v-show="forceDisplayActions || displayActionsOnHoverFocus"
					class="list-item-content__actions"
					@focusout="handleBlur">
					<NcActions ref="actions"
						:primary="active ?? isActive"
						:force-menu="forceMenu"
						:aria-label="actionsAriaLabel"
						@update:open="handleActionsUpdateOpen">
						<template v-if="$slots['actions-icon']" #icon>
							<!-- @slot Provide the custom icon for the right side quick menu -->
							<slot name="actions-icon" />
						</template>
						<!-- @slot Provide the actions for the right side quick menu -->
						<slot name="actions" />
					</NcActions>
				</div>

				<div v-if="$slots.extra" class="list-item__extra">
					<!-- @slot Extra elements below the item -->
					<slot name="extra" />
				</div>
			</div>
		</li>
	</component>
</template>

<script>
import NcActions from '../NcActions/index.js'
import NcCounterBubble from '../NcCounterBubble/index.ts'
import NcVNodes from '../NcVNodes/index.ts'

export default {
	name: 'NcListItem',

	components: {
		NcActions,
		NcCounterBubble,
		NcVNodes,
	},

	inheritAttrs: false,

	props: {
		/**
		 * The details text displayed in the upper right part of the component
		 */
		details: {
			type: String,
			default: '',
		},

		/**
		 * Name (first line of text)
		 */
		name: {
			type: String,
			default: undefined,
		},

		/**
		 * The route for the router link.
		 */
		to: {
			type: [String, Object],
			default: null,
		},

		/**
		 * The value for the external link
		 */
		href: {
			type: String,
			default: '#',
		},

		target: {
			type: String,
			default: '',
		},

		/**
		 * Id for the `<a>` element
		 */
		anchorId: {
			type: String,
			default: '',
		},

		/**
		 * Make subname bold
		 */
		bold: {
			type: Boolean,
			default: false,
		},

		/**
		 * Show the NcListItem in compact design
		 */
		compact: {
			type: Boolean,
			default: false,
		},

		/**
		 * Toggle the active state of the component
		 */
		active: {
			type: Boolean,
			default: undefined,
		},

		/**
		 * Aria label for the wrapper element
		 */
		linkAriaLabel: {
			type: String,
			default: '',
		},

		/**
		 * Aria label for the actions toggle
		 */
		actionsAriaLabel: {
			type: String,
			default: undefined,
		},

		/**
		 * If different from 0 this component will display the
		 * NcCounterBubble component
		 */
		 counterNumber: {
			 type: [Number, String],
			 default: 0,
		 },

		/**
		 * Outlined or highlighted state of the counter
		 */
		counterType: {
			type: String,
			default: '',
			validator(value) {
				return ['highlighted', 'outlined', ''].indexOf(value) !== -1
			},
		},

		/**
		 * To be used only when the elements in the actions menu are very important
		 */
		forceDisplayActions: {
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
		 * Show the list component layout
		 */
		oneLine: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'click',
		'update:menuOpen',
	],

	setup() {
		const [major] = window._oc_config?.version.split('.', 2) ?? []
		const isLegacy = major && Number.parseInt(major) < 30

		return {
			isLegacy,
		}
	},

	data() {
		return {
			hovered: false,
			hasActions: false,
			hasSubname: false,
			displayActionsOnHoverFocus: false,
			menuOpen: false,
			hasIndicator: false,
			hasDetails: false,
		}
	},

	computed: {
		showAdditionalElements() {
			return !this.displayActionsOnHoverFocus || this.forceDisplayActions
		},

		showDetails() {
			return (this.details !== '' || this.hasDetails)
				&& (!this.displayActionsOnHoverFocus || this.forceDisplayActions)
		},
	},

	watch: {

		menuOpen(newValue) {
			// A click outside both the menu and the root element hides the actions again
			if (!newValue && !this.hovered) {
				this.displayActionsOnHoverFocus = false
			}
		},
	},

	mounted() {
		this.checkSlots()
	},

	updated() {
		this.checkSlots()
	},

	methods: {
		/**
		 * Handle link click
		 *
		 * @param {MouseEvent|KeyboardEvent} event - Native click or keydown event
		 * @param {Function} [navigate] - VueRouter link's navigate if any
		 * @param {string} [routerLinkHref] - VueRouter link's href
		 */
		onClick(event, navigate, routerLinkHref) {
			// Always forward native event
			this.$emit('click', event)
			// Do not navigate with control keys - it is opening in a new tab
			if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
				return
			}
			// Prevent default link behaviour if it's a router-link and navigate manually
			if (routerLinkHref) {
				navigate?.(event)
				event.preventDefault()
			}
		},

		showActions() {
			if (this.hasActions) {
				this.displayActionsOnHoverFocus = true
			}
			this.hovered = false
		},

		hideActions() {
			this.displayActionsOnHoverFocus = false
		},

		/**
		 * @param {FocusEvent} event UI event
		 */
		handleBlur(event) {
			// do not hide if open
			if (this.menuOpen) {
				return
			}
			// do not hide if focus is kept within
			// On component unmounting Vue 3 resets the template ref to null,
			// so we can ignore this check
			if (this.$refs['list-item']?.contains(event.relatedTarget)) {
				return
			}
			this.hideActions()
		},

		/**
		 * Hide the actions on mouseleave unless the menu is open
		 */
		handleMouseleave() {
			if (!this.menuOpen) {
				this.displayActionsOnHoverFocus = false
			}
			this.hovered = false
		},

		handleMouseover() {
			this.showActions()
			this.hovered = true
		},

		handleActionsUpdateOpen(e) {
			this.menuOpen = e
			this.$emit('update:menuOpen', e)
		},

		// Check if subname and actions slots are populated
		checkSlots() {
			if (this.hasActions !== !!this.$slots.actions) {
				this.hasActions = !!this.$slots.actions
			}
			if (this.hasSubname !== !!this.$slots.subname) {
				this.hasSubname = !!this.$slots.subname
			}
			if (this.hasIndicator !== !!this.$slots.indicator) {
				this.hasIndicator = !!this.$slots.indicator
			}
			if (this.hasDetails !== !!this.$slots.details) {
				this.hasDetails = !!this.$slots.details
			}
		},
	},
}
</script>

<style lang="scss" scoped>

.list-item__wrapper {
	display: flex;
	position: relative;
	width: 100%;
	// padding for the focus-visible styles. Width is reduced to compensate it
	padding: 2px 4px;
	// The first and lastelement needs also padding for the box shadow of the focus-visible effect
	&:first-of-type {
		padding-block-start: 4px;
	}
	&:last-of-type {
		padding-block-end: 4px
	}

	&--active,
	&.active {
		.list-item {
			background-color: var(--color-primary-element);
			color: var(--color-primary-element-text) !important;

			&:hover,
			&:focus-within,
			&:has(:focus-visible),
			&:has(:active) {
				background-color: var(--color-primary-element-hover);
			}
		}

		.list-item-content__name,
		.list-item-content__subname,
		.list-item-content__details,
		.list-item-details__details {
			color: var(--color-primary-element-text) !important;
		}
	}
	.list-item-content__name,
	.list-item-content__subname,
	.list-item-content__details,
	.list-item-details__details {
		white-space: nowrap;
		margin-block: 0;
		margin-inline: 0 auto;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

.list-item-content__name {
	min-width: 100px;
	flex: 1 1 10%;
	font-weight: 500;
}

.list-item-content__subname {
	flex: 1 0;
	min-width: 0;
	color: var(--color-text-maxcontrast);
	&--bold {
		font-weight: 500;
	}
}

// NcListItem
.list-item {
	--list-item-padding: var(--default-grid-baseline);
	// The content are two lines of text and respect the 1.5 line height
	--list-item-height: 2lh;
	--list-item-border-radius: var(--border-radius-element, 32px);
	// General styles
	box-sizing: border-box;
	display: flex;
	position: relative;
	flex: 0 0 auto;
	justify-content: flex-start;
	padding: var(--list-item-padding);
	width: 100%;
	border-radius: var(--border-radius-element, 32px);
	cursor: pointer;
	transition: background-color var(--animation-quick) ease-in-out;
	list-style: none;

	&:hover,
	&:focus-within,
	&:has(:active),
	&:has(:focus-visible) {
		background-color: var(--color-background-hover);
	}

	&:has(&__anchor:focus-visible) {
		outline: 2px solid var(--color-main-text);
		box-shadow: 0 0 0 4px var(--color-main-background);
	}

	&--compact {
		--list-item-padding: calc(0.5 * var(--default-grid-baseline)) var(--default-grid-baseline);

		&:not(:has(.list-item-content__subname)) {
			--list-item-height: var(--default-clickable-area);
		}
	}

	&--legacy {
		--list-item-padding: calc(2 * var(--default-grid-baseline));

		&.list-item--compact {
			--list-item-padding: var(--default-grid-baseline) calc(2 * var(--default-grid-baseline));
		}
	}

	&--one-line {
		--list-item-height: var(--default-clickable-area);
		--list-item-border-radius: var(--border-radius-element, calc(var(--default-clickable-area) / 2));
		--list-item-padding: var(--default-grid-baseline);

		&#{&}--legacy {
			--list-item-padding: 2px calc((var(--list-item-height) - var(--list-item-border-radius)) / 2);
		}

		.list-item-content__main {
			display: flex;
			justify-content: start;
			gap: 12px;
			min-width: 0;
		}
		.list-item-content__details {
			flex-direction: row;
			align-items: center;
			justify-content: end;
		}
		.list-item-content__name {
			align-self: center;
			max-width: 300px;
		}
	}

	&__anchor {
		color: inherit;
		display: flex;
		flex: 1 0 auto;
		align-items: center;
		height: var(--list-item-height);
		min-width: 0;

		// This is handled by the parent container
		&:focus-visible {
			outline: none;
		}
	}

	&-content {
		display: flex;
		flex: 1 0;
		justify-content: space-between;
		padding-inline-start: calc(2 * var(--default-grid-baseline));
		min-width: 0;

		&__main {
			flex: 1 0;
			width: 0;
			margin: auto 0;

			&--oneline {
				display: flex;
			}
		}

		&__details {
			display: flex;
			flex-direction: column;
			justify-content: end;
			align-items: end;
		}

		&__actions,
		&__extra-actions {
			flex: 0 0 auto;
			align-self: center;
			justify-content: center;
			margin-inline-start: var(--default-grid-baseline);
		}

		&__extra-actions {
			display: flex;
			align-items: center;
			gap: var(--default-grid-baseline);
		}
	}

	&-details {
		&__details {
			color: var(--color-text-maxcontrast);
			margin: 0 9px !important;
			font-weight: normal;
		}
		&__extra {
			margin: 2px 4px 0 4px;
			display: flex;
			align-items: center;
		}
		&__indicator {
			margin: 0 5px;
		}
	}

	&__extra {
		margin-top: var(--default-grid-baseline);
	}
}

</style>
