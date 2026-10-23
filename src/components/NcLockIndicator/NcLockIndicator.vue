<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders a padlock that says an item is locked, for example in a list, a table row or a card. Its accessible name says who holds the lock.

A lock held by someone else is shown in the warning color, because the item cannot be edited now. A lock the current user holds is shown in a neutral color, because it is no obstacle to them. With `show-label` the padlock is followed by who holds the lock, such as "Locked by Jane Doe". Without it, who holds the lock is only shown in a tooltip on mouse hover, which keyboard and touch users cannot reach, so then show it elsewhere, for example where the item is opened.

The component only shows the lock; it does not stop anyone from opening the item. Render it only for a locked item, for example with `v-if`.

### Usage

```vue
<template>
	<ul class="documents">
		<li v-for="document in documents" :key="document.name">
			<span>{{ document.name }}</span>
			<NcLockIndicator
				v-if="document.lockedBy"
				:locked-by="document.lockedBy"
				:locked-by-me="document.lockedBy === 'Administrator'" />
		</li>
	</ul>
</template>

<script>
export default {
	data() {
		return {
			documents: [
				{ name: 'Annual report.md', lockedBy: 'Jane Doe' },
				{ name: 'Budget 2027.ods', lockedBy: 'Administrator' },
				{ name: 'Roadmap.md', lockedBy: '' },
			],
		}
	},
}
</script>

<style scoped>
.documents {
	margin: 0;
	padding: 0;
	list-style: none;
}

.documents li {
	display: flex;
	align-items: center;
	gap: 8px;
	padding-block: 8px;
	border-bottom: 1px solid var(--color-border);
}
</style>
```

### With a label

```vue
<template>
	<div class="locks">
		<NcLockIndicator locked-by="Jane Doe" show-label />
		<NcLockIndicator locked-by-me show-label />
		<NcLockIndicator show-label />
	</div>
</template>

<style scoped>
.locks {
	display: flex;
	gap: 24px;
}
</style>
```
</docs>

<script setup lang="ts">
import { mdiLockAlertOutline, mdiLockOutline } from '@mdi/js'
import { computed } from 'vue'
import { t } from '../../l10n.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'

const props = withDefaults(defineProps<{
	/**
	 * The name of the user who holds the lock.
	 * Left empty, the lock is attributed to another user.
	 */
	lockedBy?: string

	/**
	 * Whether the current user holds the lock.
	 */
	lockedByMe?: boolean

	/**
	 * Show who holds the lock next to the padlock, such as "Locked by Jane Doe".
	 */
	showLabel?: boolean

	/**
	 * The size of the padlock in pixels.
	 */
	size?: number
}>(), {
	lockedBy: '',
	size: 16,
})

const label = computed(() => {
	if (props.lockedByMe) {
		return t('Locked by you')
	}
	if (props.lockedBy) {
		return t('Locked by {user}', { user: props.lockedBy })
	}
	return t('Locked by another user')
})
</script>

<template>
	<span
		:class="[$style.ncLockIndicator, lockedByMe ? $style.ncLockIndicator_mine : $style.ncLockIndicator_other]"
		:role="showLabel ? undefined : 'img'"
		:aria-label="showLabel ? undefined : label"
		:title="showLabel ? undefined : label">
		<!-- With the label shown, the visible text is the name; without it, the padlock is an image named by the label -->
		<NcIconSvgWrapper :path="lockedByMe ? mdiLockOutline : mdiLockAlertOutline" :size="size" />
		<span v-if="showLabel" :class="$style.ncLockIndicator__label">{{ label }}</span>
	</span>
</template>

<style lang="scss" module>
.ncLockIndicator {
	display: inline-flex;
	flex-shrink: 0;
	align-items: center;
	gap: var(--default-grid-baseline);
	vertical-align: middle;
}

.ncLockIndicator_other {
	color: var(--color-warning-text);
}

.ncLockIndicator_mine {
	color: var(--color-text-maxcontrast);
}

.ncLockIndicator__label {
	font-size: var(--font-size-small);
	white-space: nowrap;
}
</style>
