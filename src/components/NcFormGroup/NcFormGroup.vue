<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

import { createElementId } from '../../utils/createElementId.ts'

const {
	label = undefined,
	description = undefined,
	hideLabel = false,
	hideDescription = false,
	noGap = false,
} = defineProps<{
	/**
	 * Group label #label slot can be used for custom label content
	 */
	label?: string
	/**
	 * Optional fieldset description. #description slot can be used for custom description content
	 */
	description?: string
	/**
	 * Hide the label visually but keep it accessible for screen readers
	 */
	hideLabel?: boolean
	/**
	 * Hide the description visually but keep it accessible for screen readers
	 */
	hideDescription?: boolean
	/**
	 * Disable default fieldset content gap between content elements
	 */
	noGap?: boolean
}>()

const slots = defineSlots<{
	/**
	 * Content
	 */
	default?: Slot
	/**
	 * Custom label content
	 */
	label?: Slot
	/**
	 * Custom description content
	 */
	description?: Slot
}>()

const id = `nc-form-group-${createElementId()}`
const descriptionId = `${id}-description`

const hasDescription = () => !!description || !!slots.description
const getDescriptionId = () => hasDescription() ? descriptionId : undefined
const hasContentOnly = () => hideLabel && (!hasDescription() || hideDescription)
</script>

<template>
	<fieldset
		:class="[$style.formGroup, { [$style.formGroup_noGap]: noGap }]"
		:aria-describedby="getDescriptionId()">
		<legend :class="[$style.formGroup__label, { 'hidden-visually': hideLabel }]">
			<slot name="label">
				{{ label || '⚠️ Missing label' }}
			</slot>
		</legend>
		<div v-if="hasDescription()" :id="descriptionId" :class="[$style.formGroup__description, { 'hidden-visually': hideDescription }]">
			<slot name="description">
				{{ description }}
			</slot>
		</div>
		<div :class="[$style.formGroup__content, { [$style.formGroup__content_only]: hasContentOnly() }]">
			<slot />
		</div>
	</fieldset>
</template>

<style lang="scss" module>
.formGroup {
	--form-element-label-offset: calc(var(--border-radius-element) + var(--default-grid-baseline));
	--form-group-content-gap: calc(2 * var(--default-grid-baseline));

	&.formGroup_noGap {
		--form-group-content-gap: 0;
	}
}

.formGroup__label {
	padding-inline: var(--form-element-label-offset);
	font-size: var(--font-size);
	font-weight: bold;
}

.formGroup__description {
	padding-inline: var(--form-element-label-offset);
	color: var(--color-text-maxcontrast);
}

.formGroup__content {
	display: flex;
	flex-direction: column;
	gap: var(--form-group-content-gap);
	margin-block-start: calc(2.5 * var(--default-grid-baseline));

	&.formGroup__content_only {
		margin-block-start: 0;
	}
}
</style>

<docs>
### General

Labelled group of form elements.

```vue
<template>
	<NcFormGroup label="Personal information">
		<NcTextField label="First name" />
		<NcTextField label="Last name" />
	</NcFormGroup>
</template>
```

### With description

```vue
<template>
	<NcFormGroup label="Personal information" description="Your contact details">
		<NcTextField label="First name" />
		<NcTextField label="Last name" />
	</NcFormGroup>
</template>
```

### Hidden label/description

You can visually hide the label and/or the description.\
Note: you still must provide the label. Do not visually hide the missing label warning!

```vue
<template>
	<NcFormGroup
		label="Personal information"
		description="Your contact details"
		hide-label
		hide-description>
		<NcTextField label="First name" />
		<NcTextField label="Last name" />
	</NcFormGroup>
</template>
```
</docs>
