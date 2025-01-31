<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description

This component displays a user together with a small avatar in a grey bubble.
It's possible to use an actual user's avatar, just an image/icon as a url or an icon-class,
to link the bubble to e.g. a users profile
and to show a popover on hover with e.g. the full user name handle / email address or something else.

This component has the following slot:
* a default slot which is for the content of the popover (this is passed to the popover component directly).

### Examples

```vue
<p>
	Some text before <NcUserBubble user="admin" display-name="Admin Example" url="/test">@admin@foreign-host.com</NcUserBubble> and after the bubble.
	<NcUserBubble avatar-image="icon-group" display-name="test group xyz" :primary="true">Hey there!</NcUserBubble>
</p>
```

### Example with name slot

```vue
<template>
<NcUserBubble
	:margin="4"
	:size="30"
	display-name="Administrator"
	user="admin">
	<template #name>
		<a href="#"
			title="Remove user"
			class="icon-close"
			@click="alert" />
	</template>
</NcUserBubble>
</template>
<script>
export default {
	methods: {
		alert() {
			alert('Removed')
		},
	},
}
</script>
<style>
.icon-close {
	display: block;
	height: 100%;
}
</style>
```

</docs>
<template>
	<component :is="isPopoverComponent"
		trigger="hover focus"
		:shown="open"
		class="user-bubble__wrapper"
		@update:open="onOpenChange">
		<!-- Main userbubble structure -->
		<template #trigger="{ attrs }">
			<component :is="isLinkComponent"
				class="user-bubble__content"
				:style="styles.content"
				:to="to"
				:href="hasUrl ? url : null"
				:class="{ 'user-bubble__content--primary': primary }"
				v-bind="attrs"
				@click="onClick">
				<!-- NcAvatar -->
				<NcAvatar :url="isCustomAvatar && isAvatarUrl ? avatarImage : undefined"
					:icon-class="isCustomAvatar && !isAvatarUrl ? avatarImage : undefined"
					:user="user"
					:display-name="displayName"
					:size="size - (margin * 2)"
					:style="styles.avatar"
					:disable-tooltip="true"
					:disable-menu="true"
					:show-user-status="showUserStatus"
					class="user-bubble__avatar" />

				<!-- Name -->
				<span class="user-bubble__name">
					{{ displayName || user }}
				</span>

				<!-- @slot Optional slot just after the name -->
				<span v-if="$slots.name" class="user-bubble__secondary">
					<slot name="name" />
				</span>
			</component>
		</template>

		<!-- @slot Main Popover content on userbubble hover/focus -->
		<slot />
	</component>
</template>

<script>
import NcUserBubbleDiv from './NcUserBubbleDiv.vue'
import NcAvatar from '../NcAvatar/index.js'
import NcPopover from '../NcPopover/index.js'
import Vue from 'vue'
import { RouterLink } from 'vue-router'

export default {
	name: 'NcUserBubble',
	components: {
		NcAvatar,
		NcPopover,
		NcUserBubbleDiv,
	},
	props: {
		/**
		 * Override generated avatar, can be an url or an icon class
		 */
		avatarImage: {
			type: String,
			default: undefined,
		},
		/**
		 * Provide the user id if this is a user
		 */
		user: {
			type: String,
			default: undefined,
		},
		/**
		 * Displayed label
		 */
		displayName: {
			type: String,
			default: undefined,
		},
		/**
		 * Whether or not to display the user-status
		 */
		showUserStatus: {
			type: Boolean,
			default: false,
		},
		/**
		 * Define the whole bubble as a link
		 */
		url: {
			type: String,
			default: undefined,
			validator: (url) => {
				try {
					url = new URL(url, url?.startsWith?.('/') ? window.location.href : undefined)
					return true
				} catch (error) {
					return false
				}
			},
		},
		/**
		 * Use bubble as a router-link for in-app navigation
		 */
		to: {
			type: [String, Object],
			default: undefined,
		},
		/**
		 * Default popover state. Requires the UserBubble
		 * to have some content to render inside the popover
		 */
		open: {
			type: Boolean,
			default: false,
		},
		/**
		 * Use the primary colour
		 */
		primary: {
			type: Boolean,
			default: false,
		},
		/**
		 * This is the height of the component
		 */
		size: {
			type: Number,
			default: 20,
		},
		/**
		 * This is the margin of the avatar (size - margin = avatar size)
		 */
		margin: {
			type: Number,
			default: 2,
		},
	},
	emits: [
		'click',
		'update:open',
	],
	computed: {
		/**
		 * If userbubble is empty, let's NOT
		 * use the Popover component
		 * We need a component instead of a simple div here,
		 * because otherwise the trigger template will not be shown.
		 *
		 * @return {string} 'Popover' or 'UserBubbleDiv'
		 */
		isPopoverComponent() {
			return !this.popoverEmpty
				? 'NcPopover'
				: 'NcUserBubbleDiv'
		},

		/**
		 * Is the provided avatar url valid or not
		 *
		 * @return {boolean}
		 */
		isAvatarUrl() {
			if (!this.avatarImage) {
				return false
			}

			try {
				const url = new URL(this.avatarImage)
				return !!url
			} catch (error) {
				return false
			}
		},
		/**
		 * Do we have a custom avatar or not
		 *
		 * @return {boolean}
		 */
		isCustomAvatar() {
			return !!this.avatarImage
		},

		hasUrl() {
			return this.url && this.url.trim() !== ''
		},

		isLinkComponent() {
			if (this.hasUrl) {
				return 'a'
			} else if (this.to) {
				return RouterLink
			} else {
				return 'div'
			}
		},

		popoverEmpty() {
			if ('default' in this.$slots) {
				return false
			}
			return true
		},

		styles() {
			return {
				content: {
					height: this.size + 'px',
					lineHeight: this.size + 'px',
					borderRadius: this.size / 2 + 'px',
				},
				avatar: {
					marginInlineStart: this.margin + 'px',
				},
			}
		},
	},
	mounted() {
		if (!this.displayName && !this.user) {
			Vue.util.warn('[NcUserBubble] At least `displayName` or `user` property should be set.')
		}
	},
	methods: {
		onOpenChange(state) {
			this.$emit('update:open', state)
		},
		/**
		 * Catch and forward click event to parent
		 *
		 * @param {Event} event the click event
		 */
		onClick(event) {
			this.$emit('click', event)
		},
	},
}
</script>

<style lang="scss" scoped>
.user-bubble {
	&__wrapper {
		// align inline with text
		display: inline-block;
		vertical-align: middle;
		// shrink and allow grow to fit
		min-width: 0;
		max-width: 100%;
	}

	&__content {
		display: inline-flex;
		max-width: 100%;
		background-color: var(--color-background-dark);

		&--primary {
			color: var(--color-primary-element-text);
			background-color: var(--color-primary-element);
		}

		> :last-child {
			// border radius end padding
			padding-inline-end: 8px;
		}
	}

	&__avatar {
		align-self: center;
	}

	&__name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	&__name,
	&__secondary {
		// proper spacing between avatar, name & slot
		padding-block: 0;
		padding-inline: 4px 0;
	}
}
</style>
