<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

import { mdiCheck, mdiContentCopy } from '@mdi/js'
import { whenever } from '@vueuse/core'
import { computed } from 'vue'
import NcFormBoxButton from '../NcFormBoxButton/NcFormBoxButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { t } from '../../l10n.ts'
import { useCopy } from './useCopy.ts'

const {
	label = undefined,
	value,
	disabled = false,
} = defineProps<{
	/** Copied value's value */
	label?: string
	/** The value to be copied */
	value: string
	/** Native disabled attribute */
	disabled?: boolean
}>()

const emit = defineEmits<{
	/** Value has been successfully copied */
	copy: []
}>()

defineSlots<{
	/** Custom label content */
	default?: Slot
}>()

const { isCopied, copy } = useCopy(() => value)

const icon = computed(() => isCopied.value ? mdiCheck : mdiContentCopy)

whenever(isCopied, () => emit('copy'))
</script>

<template>
	<NcFormBoxButton
		:disabled
		inverted-accent
		@click="copy">
		<template v-if="$slots.default || label" #default>
			<span class="hidden-visually">
				{{ isCopied ? t('Copied') : t('Copy to clipboard') }}
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
