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
	:size="34"
	display-name="Administrator"
	user="admin">
	<template #name>
		<NcButton aria-label="Remove user"
			variant="tertiary-no-background"
			@click="alert">
			<template #icon>
				<NcIconSvgWrapper :path="mdiClose" />
			</template>
		</NcButton>
	</template>
</NcUserBubble>
</template>
<script>
import { mdiClose } from '@mdi/js'

export default {
	setup() {
		return {
			mdiClose,
		}
	},
	methods: {
		alert() {
			alert('Removed')
		},
	},
}
</script>
```

</docs>

<script setup lang="ts">
import type { Slot } from 'vue'
import type { RouteLocation } from 'vue-router'

import { computed, warn, watch } from 'vue'
import { RouterLink } from 'vue-router'
import NcUserBubbleDiv from './NcUserBubbleDiv.vue'
import NcAvatar from '../NcAvatar/index.js'
import NcPopover from '../NcPopover/index.js'

/**
 * Default popover state. Requires the UserBubble
 * to have some content to render inside the popover
 */
const isOpen = defineModel<boolean>('open')

const props = withDefaults(defineProps<{
	/**
	 * Override generated avatar, can be an url or an icon class
	 */
	avatarImage?: string

	/**
	 * Provide the user id if this is a user
	 */
	user?: string

	/**
	 * Displayed label
	 */
	displayName?: string

	/**
	 * Whether or not to display the user-status
	 */
	showUserStatus?: boolean

	/**
	 * Define the whole bubble as a link
	 */
	url?: string

	/**
	 * Use bubble as a router-link for in-app navigation
	 */
	to?: RouteLocation

	/**
	 * Use the primary colour
	 */
	primary?: boolean

	/**
	 * This is the height of the component
	 */
	size?: number

	/**
	 * This is the margin of the avatar (size - margin = avatar size)
	 */
	margin?: number
}>(), {
	avatarImage: undefined,
	displayName: undefined,
	user: undefined,
	url: undefined,
	to: undefined,
	margin: 2,
	size: 20,
})

const emit = defineEmits<{
	/**
	 * The mouse click event
	 */
	click: [event: MouseEvent]
}>()

defineSlots<{
	/**
	 * Main Popover content on userbubble hover/focus
	 */
	default?: Slot

	/**
	 * Optional slot just after the name
	 */
	name?: Slot
}>()

/**
 * Is the provided avatar url valid or not
 */
const isAvatarUrl = computed(() => {
	if (!props.avatarImage) {
		return false
	}

	try {
		const url = new URL(props.avatarImage)
		return !!url
	} catch (error) {
		return false
	}
})

/**
 * Do we have a custom avatar or not
 */
const isCustomAvatar = computed(() => !!props.avatarImage)

const avatarStyle = computed(() => ({
	marginInlineStart: `${props.margin}px`,
}))

/**
 * Is the URL prop set
 */
const hasUrl = computed(() => {
	if (!props.url || props.url.trim() === '') {
		return false
	}
	try {
		const url = new URL(props.url, props.url?.startsWith?.('/') ? window.location.href : undefined)
		return !!url
	} catch (error) {
		warn('[NcUserBubble] Invalid URL passed', { url: props.url })
		return false
	}
})

/**
 * href attribute to pass to content container
 */
const href = computed(() => hasUrl.value ? props.url : undefined)

const contentComponent = computed(() => {
	if (hasUrl.value) {
		return 'a'
	} else if (props.to) {
		return RouterLink
	} else {
		return 'div'
	}
})

const contentStyle = computed(() => ({
	height: `${props.size}px`,
	lineHeight: `${props.size}px`,
	borderRadius: `${props.size / 2}px`,
}))

watch([() => props.displayName, () => props.user], () => {
	if (!props.displayName && !props.user) {
		warn('[NcUserBubble] At least `displayName` or `user` property should be set.')
	}
})
</script>

<template>
	<component
		:is="!!$slots.default ? NcPopover : NcUserBubbleDiv"
		v-model:shown="isOpen"
		class="user-bubble__wrapper"
		trigger="hover focus">
		<!-- Main userbubble structure -->
		<template #trigger="{ attrs }">
			<component
				:is="contentComponent"
				class="user-bubble__content"
				:class="{ 'user-bubble__content--primary': primary }"
				:style="contentStyle"
				:to
				:href
				v-bind="attrs"
				@click="emit('click', $event)">
				<!-- NcAvatar -->
				<NcAvatar
					:url="isCustomAvatar && isAvatarUrl ? avatarImage : undefined"
					:icon-class="isCustomAvatar && !isAvatarUrl ? avatarImage : undefined"
					:user="user"
					:display-name="displayName"
					:size="size - (margin * 2)"
					:style="avatarStyle"
					:disable-tooltip="true"
					:disable-menu="true"
					:hide-status="!showUserStatus"
					class="user-bubble__avatar" />

				<!-- Name -->
				<span class="user-bubble__name">
					{{ displayName || user }}
				</span>

				<span v-if="!!$slots.name" class="user-bubble__secondary">
					<slot name="name" />
				</span>
			</component>
		</template>

		<slot />
	</component>
</template>

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
