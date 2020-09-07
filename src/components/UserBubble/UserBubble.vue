<!--
  - @copyright Copyright (c) 2019 Jonas Sulzer <jonas@violoncello.ch>
  -
  - @author Marco Ambrosini <marcoambrosini@pm.me>
  - @author Jonas Sulzer <jonas@violoncello.ch>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
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
	Some text before <UserBubble user="admin" display-name="Admin Example" :url="'/test'">@admin@foreign-host.com</UserBubble> and after the bubble.
	<UserBubble avatar-image="icon-group" display-name="test group xyz" :primary="true">Hey there!</UserBubble>
</p>
```

### Example with title slot

```vue
<template>
<UserBubble
	:margin="4"
	:size="30"
	display-name="Administrator"
	user="admin">
	<template #title>
		<a href="#"
			title="Remove user"
			class="icon-close"
			@click="alert" />
	</template>
</UserBubble>
</template>

<style>
.icon-close {
	display: block;
	height: 100%;
}
</style>
```

</docs>
<template>
	<Popover :is="isPopoverComponent"
		trigger="hover focus"
		:open="open"
		class="user-bubble__wrapper"
		@update:open="onOpenChange">
		<!-- Main userbubble structure -->
		<div slot="trigger"
			v-bind="isLinkComponent"
			class="user-bubble__content"
			:style="styles.content"
			:class="primary ? 'user-bubble__content--primary' : ''"
			@click="onClick">
			<!-- Avatar -->
			<Avatar :url="isCustomAvatar && isAvatarUrl ? avatarImage : undefined"
				:icon-class="isCustomAvatar && !isAvatarUrl ? avatarImage : undefined"
				:user="user"
				:display-name="displayName"
				:size="size - (margin * 2)"
				:style="styles.avatar"
				:disable-tooltip="true"
				:disable-menu="true"
				v-bind="$props"
				class="user-bubble__avatar" />

			<!-- Title -->
			<h6 class="user-bubble__title">
				{{ displayName || user }}
			</h6>

			<!-- @slot Optional slot just after the title -->
			<span v-if="$slots.title" class="user-bubble__secondary">
				<slot name="title" />
			</span>
		</div>

		<!-- @slot Main Popover content on userbubble hover/focus -->
		<slot />
	</Popover>
</template>

<script>
import Popover from '../Popover'
import Avatar from '../Avatar'

export default {
	name: 'UserBubble',
	components: {
		Popover,
		Avatar,
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
			required: true,
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
			validator: url => {
				try {
					url = new URL(url)
					return !!url
				} catch (error) {
					return false
				}
			},
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
	computed: {
		/**
		 * If userbubble is empty, let's NOT
		 * use the Popover component
		 * @returns {string} 'Popover' or 'div'
		 */
		isPopoverComponent() {
			return !this.popoverEmpty
				? 'Popover'
				: 'div'
		},

		/**
		 * Is the provided avatar url valid or not
		 * @returns {boolean}
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
		 * @returns {boolean}
		 */
		isCustomAvatar() {
			return !!this.avatarImage
		},

		isLinkComponent() {
			if (this.url && this.url.trim() !== '') {
				return { is: 'a', href: this.url }
			}
			return { is: 'div' }
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
					marginLeft: this.margin + 'px',
				},
			}
		},
	},
	methods: {
		onOpenChange(state) {
			this.$emit('update:open', state)
		},
		/**
		 * Catch and forward click event to parent
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
			color: var(--color-primary-text);
			background-color: var(--color-primary-element);
		}

		> :last-child {
			// border radius left padding
			padding-right: 8px;
		}
	}

	&__avatar {
		align-self: center;
	}

	&__title {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	&__title,
	&__secondary {
		// proper spacing between avatar, title & slot
		padding: 0;
		padding-left: 4px;
	}
}

</style>
