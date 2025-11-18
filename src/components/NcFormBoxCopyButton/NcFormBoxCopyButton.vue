<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { whenever } from '@vueuse/core'
import NcFormBoxButton from '../NcFormBoxButton/NcFormBoxButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { useCopy } from '../../composables/useCopy.ts'

const props = withDefaults(defineProps<{
	/** Copied value's value */
	label?: string
	/** The value to be copied */
	value: string
	/** Native disabled attribute */
	disabled?: boolean
}>(), {
	label: undefined,
	disabled: false,
})

const emit = defineEmits<{
	/** Value has been successfully copied */
	(event: 'copy'): void
}>()

const { isCopied, copy, icon, altText } = useCopy(() => props.value)

whenever(isCopied, () => emit('copy'))
</script>

<template>
	<NcFormBoxButton
		:disabled="disabled"
		inverted-accent
		@click="copy">
		<template v-if="$slots.default || label" #default>
			<!-- @slot Custom label content -->
			<span class="hidden-visually">
				{{ altText }}
			</span>
			<slot>
				{{ label }}
			</slot>
		</template>
		<template #description>
			{{ value }}
		</template>
		<template #icon>
			<NcIconSvgWrapper :path="icon" inline />
		</template>
	</NcFormBoxButton>
</template>

<docs>
### General

`NcFormBoxButton` set up to be a copy button.

```vue
<template>
	<NcFormGroup label="CalDAV" description="Access Nextcloud calendars from other apps and devices">
		<NcFormBox>
			<NcFormBoxCopyButton
				label="CalDAV URL"
				value="https://cloud.example.com/remote.php/dav/" />
			<NcFormBoxCopyButton
				label="Server Address for iOS and macOS"
				value="https://cloud.example.com/remote.php/dav/principals/users/user/" />
		</NcFormBox>
	</NcFormGroup>
</template>
```
</docs>
