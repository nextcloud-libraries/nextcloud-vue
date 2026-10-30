<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders a banner that says an item is locked and by whom, for example at the top of the page of the item. It looks like an `NcNoteCard`.

A lock held by someone else is shown as an error, because the item cannot be edited until the lock is released. A lock the current user holds is shown as a neutral note with an **Unlock** button, so they can release a lock they may have forgotten about. The button emits `unlock`; release the lock in the app and set `unlocking` while that is in progress. The button keeps the keyboard focus while unlocking, but once the banner is removed, move the focus somewhere sensible, for example to the editor.

With `expires-at` the banner also says when the lock expires, as a relative time that updates by itself. It takes a `Date`, an ISO date string or a timestamp in milliseconds; convert Unix seconds to milliseconds first.

A lock held by someone else is announced to assistive technology right away, a lock the current user holds is not. The expiry line is not announced as it updates. Render the banner only for a locked item, for example with `v-if`.

### Usage

```vue
<template>
	<div>
		<NcLockedBanner
			locked-by="Jane Doe"
			:expires-at="inTwentyMinutes" />
		<NcLockedBanner
			v-if="locked"
			locked-by-me
			:unlocking="unlocking"
			@unlock="unlock" />
		<p v-else>
			Unlocked.
		</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			inTwentyMinutes: Date.now() + 20 * 60 * 1000,
			locked: true,
			unlocking: false,
		}
	},

	methods: {
		unlock() {
			this.unlocking = true
			setTimeout(() => {
				this.unlocking = false
				this.locked = false
			}, 1000)
		},
	},
}
</script>
```
</docs>

<script setup lang="ts">
import { mdiLockAlertOutline, mdiLockOpenVariantOutline, mdiLockOutline } from '@mdi/js'
import { computed } from 'vue'
import { useFormatRelativeTime } from '../../composables/useFormatDateTime/index.ts'
import { t } from '../../l10n.ts'
import { isLegacy } from '../../utils/legacy.ts'
import NcButton from '../NcButton/index.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'
import NcLoadingIcon from '../NcLoadingIcon/index.ts'

const props = withDefaults(defineProps<{
	/**
	 * The name of the user who holds the lock.
	 * Left empty, the lock is attributed to another user.
	 */
	lockedBy?: string

	/**
	 * Whether the current user holds the lock.
	 * Only then the banner offers to unlock.
	 */
	lockedByMe?: boolean

	/**
	 * When the lock expires, as a date, an ISO date string or a timestamp in milliseconds.
	 */
	expiresAt?: Date | string | number

	/**
	 * Whether the lock is being released. The unlock button then ignores clicks and shows a loading icon.
	 */
	unlocking?: boolean

	/**
	 * Hide the unlock button on a lock the current user holds, for example where nothing can be edited anyway.
	 */
	hideUnlock?: boolean
}>(), {
	lockedBy: '',
	expiresAt: undefined,
})

const emit = defineEmits<{
	/**
	 * The current user asked to release their lock.
	 */
	unlock: []
}>()

// Without an expiry there is nothing to show, so the time does not need to update
const relativeExpiry = useFormatRelativeTime(
	() => (props.expiresAt === undefined ? Date.now() : new Date(props.expiresAt)),
	() => ({ update: props.expiresAt !== undefined }),
)

const message = computed(() => {
	if (props.lockedByMe) {
		return t('You are editing this. Others cannot change it until you unlock it.')
	}
	if (props.lockedBy) {
		return t('Locked by {user}. You cannot edit this until the lock is released.', { user: props.lockedBy })
	}
	return t('Locked by another user. You cannot edit this until the lock is released.')
})

const expiry = computed(() => {
	if (props.expiresAt === undefined) {
		return ''
	}
	// The relative time updates by itself, so reading it makes this check again as time passes
	const time = relativeExpiry.value
	if (new Date(props.expiresAt).getTime() <= Date.now()) {
		return t('The lock has expired')
	}
	// TRANSLATORS: {time} is a relative time, for example "in 20 minutes"
	return t('The lock expires {time}', { time })
})

/**
 * Ask to release the lock, unless that is already in progress. The button is not
 * disabled meanwhile, so it keeps the keyboard focus.
 */
function onUnlock() {
	if (!props.unlocking) {
		emit('unlock')
	}
}
</script>

<template>
	<div
		:class="[$style.ncLockedBanner, lockedByMe ? $style.ncLockedBanner_mine : $style.ncLockedBanner_other, { [$style.ncLockedBanner_legacy]: isLegacy }]"
		:role="lockedByMe ? 'note' : undefined">
		<NcIconSvgWrapper
			:class="$style.ncLockedBanner__icon"
			:path="lockedByMe ? mdiLockOutline : mdiLockAlertOutline"
			:size="20" />
		<div :class="$style.ncLockedBanner__text">
			<!-- Only the message is a live region: the expiry line below it updates by itself -->
			<p :class="$style.ncLockedBanner__message" :role="lockedByMe ? undefined : 'alert'">
				{{ message }}
			</p>
			<p v-if="expiry" :class="$style.ncLockedBanner__expiry">
				{{ expiry }}
			</p>
		</div>
		<NcButton
			v-if="lockedByMe && !hideUnlock"
			:class="$style.ncLockedBanner__action"
			:aria-disabled="unlocking ? 'true' : undefined"
			@click="onUnlock">
			<template #icon>
				<NcLoadingIcon v-if="unlocking" :name="t('Unlocking …')" :size="20" />
				<NcIconSvgWrapper v-else :path="mdiLockOpenVariantOutline" :size="20" />
			</template>
			{{ t('Unlock') }}
		</NcButton>
	</div>
</template>

<style lang="scss" module>
.ncLockedBanner {
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	gap: calc(2 * var(--default-grid-baseline));
	margin-block: 1rem;
	padding: calc(2 * var(--default-grid-baseline));
	border-inline-start: var(--default-grid-baseline) solid var(--locked-banner-tone-accent);
	border-radius: var(--border-radius-small);
	color: var(--color-main-text);
	background-color: var(--locked-banner-tone-background);
}

// Someone else's lock is an error, like an error NcNoteCard
.ncLockedBanner_other {
	--locked-banner-tone-accent: var(--color-error-text);
	--locked-banner-tone-background: var(--color-error);
	// The grey of --color-text-maxcontrast is too light on the error background before
	// Nextcloud 32 and only just enough after, so the expiry takes the text color
	--locked-banner-tone-expiry: var(--color-main-text);
}

// Before Nextcloud 32 the error color is strong, so it is mixed into the background like NcNoteCard does
.ncLockedBanner_other.ncLockedBanner_legacy {
	--locked-banner-tone-background: color-mix(in srgb, var(--color-error), var(--color-main-background) 80%);
}

// The current user's own lock is nothing wrong, so it is a neutral note
.ncLockedBanner_mine {
	--locked-banner-tone-accent: var(--color-border-maxcontrast);
	--locked-banner-tone-background: var(--color-background-hover);
	--locked-banner-tone-expiry: var(--color-text-maxcontrast);
}

.ncLockedBanner__icon {
	flex-shrink: 0;
	color: var(--locked-banner-tone-accent);
}

.ncLockedBanner__text {
	flex: 1 1 200px;
	min-width: 0;
}

.ncLockedBanner__message {
	margin: 0;
	font-weight: bold;
}

.ncLockedBanner__expiry {
	margin: var(--default-grid-baseline) 0 0;
	color: var(--locked-banner-tone-expiry);
}

.ncLockedBanner__action {
	flex-shrink: 0;
	align-self: center;
}
</style>
