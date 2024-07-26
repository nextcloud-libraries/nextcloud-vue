<!--
  - SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### Default Usage

```vue
<template>
	<ul>
		<NcListItem
			:name="'This is an active element with highlighted counter'"
			:bold="true"
			:active="true"
			:details="'1h'"
			:counter-number="123"
			counterType="highlighted">
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
			:name="'This is an active element with outlined counter'"
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
			:name="'This is an active element with normal counter'"
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
			:name="'Name of the element with highlighted counter'"
			:bold="true"
			:force-display-actions="true"
			:details="'1h'"
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
			:name="'Name of the element with outlined counter'"
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
			:name="'Name of the element with normal counter'"
			:bold="false"
			:force-display-actions="true"
			:details="'1h'"
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
			:name="'Name of the element'"
			:bold="false">
			<template #icon>
				<NcAvatar disable-menu :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #name>
				<span style="display: flex; gap: 0.5rem; color: var(--color-primary);">
					Flexible styling within the first line of the component
					<div style="color: var(--color-secondary);">
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
			:name="'Without subname, Name of the element'"
			:bold="false"
			:details="'1h'">
			<template #icon>
				<NcAvatar disable-menu :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #indicator>
				<!-- Color dot -->
				<CheckboxBlankCircle :size="16" fill-color="#0082c9"/>
			</template>
		</NcListItem>
		<NcListItem
			:name="'Name of the element with normal counter'"
			:bold="false"
			:details="'1h'"
			:counter-number="44">
			<template #icon>
				<NcAvatar disable-menu :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
				In this slot you can put both text and other components such as icons
			</template>
			<template #tags>
				<NcChip>
					Work
				</NcChip>
				<NcChip>
					To Do
				</NcChip>
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
<NcListItem
	:name="'This is an active element with highlighted counter'"
	:bold="false"
	:active="true"
	:details="'1h'"
	:counter-number="123"
	one-line
	counterType="highlighted">
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
### NcListItem compact mode
```vue
<template>
	<ul style="width: 350px;">
		<NcListItem
			:name="'Name of the element'"
			:counter-number="1"
			:compact="true" >
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
		<NcListItem
			:name="'Name of the element'"
			:compact="true" >
			<template #icon>
				<IconNoteText :size="20" />
			</template>
		</NcListItem>
		<NcListItem
			:name="'Name of the element'"
			:counter-number="3"
			:compact="true" >
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
		<NcListItem
			:name="'Name of the element'"
			:compact="true"
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
		:custom="to ? true : null"
		:to="to"
		:exact="to ? exact : null">
		<li class="list-item__wrapper"
			:class="{ 'list-item__wrapper--active' : isActive || active }">
			<div ref="list-item"
				class="list-item"
				:class="{
					'list-item--compact': compact,
					'list-item--one-line': oneLine,
					'list-item--tagged': $slots.tags,
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
					<div class="list-item-content" v-if="!$slots.tags">
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
							<div class="list-item-content__tags" v-if="$slots.tags">
								<!-- @slot This slot is used for the third line of the component -->
								<slot name="tags" />
							</div>
						</div>
						<div class="list-item-content__details">
							<div v-if="showDetails" class="list-item-details__details">
								<!-- @slot This slot is used for some details in form of icon (prop `details` as a fallback) -->
								<slot name="details">{{ details }}</slot>
							</div>
							<!-- Counter and indicator -->
							<div v-if="counterNumber || hasIndicator"
								v-show="showAdditionalElements"
								class="list-item-details__extra">
								<NcCounterBubble v-if="counterNumber"
									:active="isActive || active"
									class="list-item-details__counter"
									:type="counterType">
									{{ counterNumber }}
								</NcCounterBubble>

								<span v-if="hasIndicator" class="list-item-details__indicator">
									<!-- @slot This slot is used for some indicator in form of icon -->
									<slot name="indicator" />
								</span>
							</div>
						</div>
					</div>

					<div class="list-item-content" v-if="$slots.tags">
						<div class="list-item-content__name">
							<!-- @slot Slot for the first line of the component. prop 'name' is used as a fallback is no slots are provided -->
							<slot name="name">{{ name }}</slot>
						</div>
						<div class="list-item-inner-content">
							<div class="list-item-inner-content__main">
								<div v-if="hasSubname"
									 class="list-item-content__subname"
									 :class="{'list-item-content__subname--bold': bold}">
									<!-- @slot Slot for the second line of the component -->
									<slot name="subname" />
								</div>
								<div class="list-item-content__tags" v-if="$slots.tags">
									<!-- @slot This slot is used for the third line of the component -->
									<slot name="tags" />
								</div>
							</div>

							<div class="list-item-inner-content__details">
								<div v-if="showDetails" class="list-item-inner-content__details__details">
									<!-- @slot This slot is used for some details in form of icon (prop `details` as a fallback) -->
									<slot name="details">{{ details }}</slot>
								</div>

								<!-- Counter and indicator -->
								<div v-if="counterNumber || hasIndicator"
									 v-show="showAdditionalElements"
									 class="list-item-inner-content__details__extra">
									<NcCounterBubble v-if="counterNumber"
													 :active="isActive || active"
													 class="list-item-details__counter"
													 :type="counterType">
										{{ counterNumber }}
									</NcCounterBubble>

									<span v-if="hasIndicator" class="list-item-inner-content__details__indicator">
									<!-- @slot This slot is used for some indicator in form of icon -->
									<slot name="indicator" />
								</span>
								</div>
							</div>
						</div>
					</div>
				</a>

				<!-- Actions -->
				<div v-show="forceDisplayActions || displayActionsOnHoverFocus"
					 class="list-item-content__actions"
					 @focusout="handleBlur">
					<NcActions ref="actions"
							   :primary="isActive || active"
							   :aria-label="computedActionsAriaLabel"
							   @update:open="handleActionsUpdateOpen">
						<!-- @slot Provide the actions for the right side quick menu -->
						<slot name="actions" />
					</NcActions>
				</div>

				<!-- @slot Extra elements below the item -->
				<div v-if="$slots.extra" class="list-item__extra">
					<slot name="extra" />
				</div>
			</div>
		</li>
	</component>
</template>

<script>
import NcActions from '../NcActions/index.js'
import NcCounterBubble from '../NcCounterBubble/index.js'
import NcVNodes from '../NcVNodes/index.js'
import { t } from '../../l10n.js'

export default {
	name: 'NcListItem',

	components: {
		NcActions,
		NcCounterBubble,
		NcVNodes,
	},

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
			required: true,
		},

		/**
		 * Pass in `true` if you want the matching behavior to
		 * be non-inclusive: https://router.vuejs.org/api/#exact
		 */
		exact: {
			type: Boolean,
			default: false,
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
			default: false,
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
			default: '',
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

		computedActionsAriaLabel() {
			return this.actionsAriaLabel || t('Actions for item with name "{name}"', { name: this.name })
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
			if (this.$refs['list-item'].contains(event.relatedTarget)) {
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
		margin: 0 auto 0 0;
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

.list-item-content__tags {
	display: flex;
	flex-direction: row;
	justify-content: start;
	align-items: center;
	align-content: center;
}

// NcListItem
.list-item {
	--list-item-padding: 8px;
	// The content are two lines of text and respect the 1.5 line height
	--list-item-height: calc(2 * var(--default-line-height));
	--list-item-border-radius: var(--border-radius-element, 32px);
	// General styles
	box-sizing: border-box;
	display: flex;
	position: relative;
	flex: 0 0 auto;
	justify-content: flex-start;
	// we need to make sure the elements are not cut off by the border
	padding-inline: calc((var(--list-item-height) - var(--list-item-border-radius)) / 2);
	padding-block: var(--list-item-padding);
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

		a {
			max-width: calc(100% - var(--default-clickable-area));
		}
	}

	&:has(&__anchor:focus-visible) {
		outline: 2px solid var(--color-main-text);
		box-shadow: 0 0 0 4px var(--color-main-background);
	}

	&--compact {
		--list-item-padding: 2px;
	}
	.list-item-content__details {
		display: flex;
		flex-direction: column;
		justify-content: end;
		align-items: end;
	}
	&--one-line {
		--list-item-height: var(--default-clickable-area);
		--list-item-border-radius: var(--border-radius-element, calc(var(--default-clickable-area) / 2));
		--list-item-padding: 2px;

		.list-item-content__main {
			display: flex;
			justify-content: start;
			gap: 12px;
			min-width: 0;
			max-width: 300px;
		}
		.list-item-content__details {
			flex-direction: row;
			align-items: unset;
			justify-content: end;
		}
		.list-item-content__name {
			align-self: center;
		}
	}

	&--tagged {
		--list-item-height: calc(3 * var(--default-line-height));
		padding-inline: calc((calc(2 * var(--default-line-height)) - var(--list-item-border-radius)) / 2);
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap !important;

		.list-item-content {
			dispay: flex;
			flex-direction: column;

			&__name {
				max-width: 100%;
			}

			&__tags {
				overflow-y: auto;
			}
		}

		.list-item-inner-content {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			max-width: 100%;

			&__main {
				flex: 0 1 auto;
				min-width: 0;
			}

			&__details {
				display: flex;
				flex-direction: column;
				justify-content: end;
				align-items: end;
				white-space: nowrap;
				margin-left: calc(var(--default-grid-baseline) * 2);

				&__details {
					color: var(--color-text-maxcontrast);
					height: var(var(--default-line-height));
					font-weight: normal;
				}

				&__extra {
					height: var(--default-line-height);
					display: flex;
					align-items: center;
				}
			}
		}

		a {
			max-width: 100%;
		}

		.one-line .envelope__subtitle__subject {
			max-width: 300px;
		}
	}

	&__anchor {
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
		padding-left: 8px;
		min-width: 0;
		&__main {
			flex: 1 0;
			width: 0;
			margin: auto 0;

			&--oneline {
				display: flex;
			}
		}

		&__actions {
			flex: 0 0 auto;
			align-self: center;
			justify-content: center;
			margin-left: 4px;
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
		margin-top: 4px;
	}
}

</style>
