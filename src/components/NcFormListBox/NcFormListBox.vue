<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

const {
	ariaLabel = undefined,
	ariaLabelledby = undefined,
} = defineProps<{
	/** aria-label attribute for the <ul> element */
	ariaLabel?: string
	/** aria-labelledby attribute for the <ul> element */
	ariaLabelledby?: string
}>()

defineSlots<{
	/** NcListItem components */
	default?: Slot
}>()
</script>

<template>
	<ul :aria-label :aria-labelledby :class="$style.formListBox">
		<slot />
	</ul>
</template>

<style lang="scss" module>
.formListBox {
	--form-element-label-offset: calc(var(--border-radius-element) + var(--default-grid-baseline));

	:global(.list-item__wrapper) {
		padding-block: 0;
		padding-inline: 0;

		&::before {
			content: '';
			position: absolute;
			border-top: 1px solid var(--color-border);
			inset-inline: var(--form-element-label-offset);
			inset-block-start: calc(0px - 1 * var(--default-grid-baseline) / 2); // half of the gap
		}

		&:first-child::before {
			display: none;
		}
	}

	:global(.list-item) {
		--list-item-padding: var(--default-grid-baseline) var(--form-element-label-offset);
	}

	:global(.list-item-content):first-child {
		padding-inline-start: 0;
	}
}
</style>

<docs>
### General
```vue
<script>
import { mdiDomain, mdiEmailOutline, mdiPencilOutline, mdiTrashCanOutline } from '@mdi/js'

export default {
	setup() {
		return { mdiDomain, mdiEmailOutline, mdiPencilOutline, mdiTrashCanOutline }
	},
	data() {
		return {
			text: 'Text',
			option: 'One'
		}
	}
}
</script>

<template>
	<div style="display: flex; flex-direction: column; gap: calc(6 * var(--default-grid-baseline));">
		<NcFormGroup
			label="Text blocks"
			description="Reusable pieces of text that can be inserted in messages">
			<NcFormListBox>
				<NcListItem name="Title">
					<template #subname>
						Content
					</template>
					<template #extra-actions>
						<NcButton variant="tertiary" #icon>
							<NcIconSvgWrapper :path="mdiPencilOutline" inline />
						</NcButton>
						<NcButton variant="tertiary" #icon>
							<NcIconSvgWrapper :path="mdiTrashCanOutline" inline />
						</NcButton>
					</template>
				</NcListItem>
				<NcListItem name="Reply">
					<template #subname>
						Thank you for contacting us!
					</template>
					<template #extra-actions>
						<NcButton variant="tertiary" #icon>
							<NcIconSvgWrapper :path="mdiPencilOutline" inline />
						</NcButton>
						<NcButton variant="tertiary" #icon>
							<NcIconSvgWrapper :path="mdiTrashCanOutline" inline />
						</NcButton>
					</template>
				</NcListItem>
			</NcFormListBox>
		</NcFormGroup>

		<NcFormGroup label="Always show images from">
			<NcFormListBox>
				<NcListItem name="example.com">
					<template #icon>
						<NcIconSvgWrapper :path="mdiDomain" inline />
					</template>
					<template #extra-actions>
						<NcButton variant="tertiary" #icon>
							<NcIconSvgWrapper :path="mdiTrashCanOutline" inline />
						</NcButton>
					</template>
				</NcListItem>
				<NcListItem name="example.net">
					<template #icon>
						<NcIconSvgWrapper :path="mdiDomain" inline />
					</template>
					<template #extra-actions>
						<NcButton variant="tertiary" #icon>
							<NcIconSvgWrapper :path="mdiTrashCanOutline" inline />
						</NcButton>
					</template>
				</NcListItem>
				<NcListItem name="mail@example.org">
					<template #icon>
						<NcIconSvgWrapper :path="mdiEmailOutline" inline />
					</template>
					<template #extra-actions>
						<NcButton variant="tertiary" #icon>
							<NcIconSvgWrapper :path="mdiTrashCanOutline" inline />
						</NcButton>
					</template>
				</NcListItem>
			</NcFormListBox>
		</NcFormGroup>
	</div>
</template>
```
</docs>
