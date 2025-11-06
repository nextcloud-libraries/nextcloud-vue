<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { AnchorHTMLAttributes, Slot } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { mdiArrowTopRight, mdiOpenInNew } from '@mdi/js'
import { computed, toRef } from 'vue'
import NcFormBoxItem from '../NcFormBox/NcFormBoxItem.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { useButtonLink } from '../../composables/useButtonLink.ts'

const {
	label = undefined,
	description = undefined,
	invertedAccent = false,
	to = undefined,
	href = undefined,
	target = undefined, // TODO: should it be _blank by default?
	disabled = false,
} = defineProps<{
	/** Main label */
	label?: string
	/** Optional description below the label, also used for the aria-describedby */
	description?: string
	/** Accent on the description instead of the label (see docs) */
	invertedAccent?: boolean
	/** RouterLink's `to` prop; when provided, renders as `<RouterLink>` (takes precedence over the `href` prop) */
	to?: RouteLocationRaw
	/** Hyperlink `href` attribute; when provided, renders as `<a>` */
	href?: string
	/** Hyperlink's target attribute */
	target?: AnchorHTMLAttributes['target']
	/** Button's disabled attribute, not applicable to links */
	disabled?: boolean
}>()

defineEmits<{
	/** Native click event */
	click: [event: MouseEvent]
}>()

defineSlots<{
	/** Custom label content */
	default?: Slot
	/** Custom description content */
	description?: Slot
	/** Required icon (links have a default icon) */
	icon?: Slot // TODO: should the default link icon only be used for _blank links?
}>()

const { tag, attrs, isLink } = useButtonLink({
	to: toRef(() => to),
	href: toRef(() => href),
	target: toRef(() => target),
	disabled: toRef(() => disabled),
})

const icon = computed(() => {
	if (isLink.value) {
		return target === '_blank' ? mdiOpenInNew : mdiArrowTopRight
	}
	return undefined
})
</script>

<template>
	<NcFormBoxItem
		:tag
		:item-classes="[
			'button-vue', /* Reset server's global HTML button styles */
			$style.formBoxButton,
		]"
		:inverted-accent
		v-bind="attrs"
		tabindex="0"
		@click="$emit('click', $event)">
		<template v-if="$slots.default || label" #default>
			<slot>
				{{ label }}
			</slot>
		</template>
		<template v-if="$slots.description || description" #description>
			<slot name="description">
				{{ description }}
			</slot>
		</template>
		<template v-if="$slots.icon || icon" #icon>
			<slot name="icon">
				<NcIconSvgWrapper v-if="icon" :path="icon" inline />
			</slot>
		</template>
	</NcFormBoxItem>
</template>

<style lang="scss" module>
.formBoxButton {
	/* Reset default HTML button styles */
	background: unset;
	border: none;
	color: inherit;
	font-size: inherit;
	font-weight: inherit;
	text-decoration: none;
	text-align: inherit;
	line-height: inherit;
	padding: 0;
	margin: 0;
	outline: none;
}
</style>

<docs>
### General

An interactive button-like item within `<NcFormBox>`. It can be a button or a native link/router link if `to` or `href` props are provided.

Like other form box items, it has a label and an optional description.

```vue
<script>
import { mdiContentCopy, mdiInformationOutline } from '@mdi/js'

export default {
	setup() {
		return {
			mdiContentCopy,
			mdiInformationOutline,
		}
	},
}
</script>

<template>
	<NcFormBox>
		<NcFormBoxButton
			label="Nextcloud"
			href="https://nextcloud.com"
			target="_blank" />

		<NcFormBoxButton
			href="https://nextcloud-vue-components.netlify.app">
			<code>@nextcloud/vue</code> documentation
		</NcFormBoxButton>

		<NcFormBoxButton
			label="About"
			description="Installation details"
			href="https://nextcloud.com"
			target="_blank">
			<template #icon>
				<NcIconSvgWrapper :path="mdiInformationOutline" inline />
			</template>
		</NcFormBoxButton>

		<NcFormBoxButton
			label="Public signing key">
			<template #description>
				<code>SSBkb24ndCBrbm93IHdoeSB5b3UgZGVjb2RlZCB0aGlzIHZhbHVlDQrgvLwg44GkIOKXlV/il5Ug4Ly944Gk</code>
			</template>
			<template #icon>
				<NcIconSvgWrapper :path="mdiContentCopy" inline />
			</template>
		</NcFormBoxButton>
	</NcFormBox>
</template>
```

### Inverted accent

Sometimes the description is more important than the label. In such cases use `inverted-accent` prop.

For example:
- **Steps:** the description of the step is more important than the step number
- **Copy button:** the value being copied is more important than the value label
- **Folder picker:** the selected folder path is more important than the input label

```vue
<script>
import { mdiContentCopy, mdiDomain, mdiFolderOpenOutline } from '@mdi/js'

export default {
	setup() {
		return { mdiContentCopy, mdiDomain, mdiFolderOpenOutline }
	},
}
</script>

<template>
	<div style="display: flex; flex-direction: column; gap: calc(4 * var(--default-grid-baseline));">
		<NcFormGroup label="Mailvelope" description="A browser extension that enables easy OpenPGP encryption and decryption of emails">
			<NcFormBox>
				<NcFormBoxButton
					label="Step 1"
					description="Install the browser extension"
					href="https://www.mailvelope.com/"
					target="_blank"
					inverted-accent />
				<NcFormBoxButton
					label="Step 2"
					description="Enable the current domain"
					inverted-accent>
					<template #icon>
						<NcIconSvgWrapper :path="mdiDomain" inline />
					</template>
				</NcFormBoxButton>
			</NcFormBox>
		</NcFormGroup>

		<NcFormGroup label="CalDAV" description="Access Nextcloud calendars from other apps and devices">
			<NcFormBox>
				<NcFormBoxButton
					label="CalDAV URL"
					description="https://cloud.example.com/remote.php/dav/"
					inverted-accent>
					<template #icon>
						<NcIconSvgWrapper :path="mdiContentCopy" inline />
					</template>
				</NcFormBoxButton>
				<NcFormBoxButton
					label="Server Address for iOS and macOS"
					description="https://cloud.example.com/remote.php/dav/principals/users/user/"
					inverted-accent>
					<template #icon>
						<NcIconSvgWrapper :path="mdiContentCopy" inline />
					</template>
				</NcFormBoxButton>
			</NcFormBox>
		</NcFormGroup>

		<NcFormGroup label="Files">
			<NcFormBox>
				<NcFormBoxButton
					label="Attachments folder"
					description="/Talk"
					inverted-accent>
					<template #icon>
						<NcIconSvgWrapper :path="mdiFolderOpenOutline" inline />
					</template>
				</NcFormBoxButton>
			</NcFormBox>
		</NcFormGroup>
	</div>
</template>
```

### Requirements

- Label is required (`label` prop or the default slot)
- Icon is required unless there is a default icon (links)

```vue
<template>
	<NcFormBox>
		<NcFormBoxButton description="No label example">
			<template #icon>
				✅
			</template>
		</NcFormBoxButton>
		<NcFormBoxButton label="No icon example"/>
		<NcFormBoxButton
			label="No icon link example"
			description="Links have a default icon"
			href="https://nextcloud.com"
			target="_blank" />
	</NcFormBox>
</template>
```
</docs>
