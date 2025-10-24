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
	 * Group label (the fieldset's legend). #label slot can be used for custom label content
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
	 * Fieldset content
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

const id = `nc-fieldset-${createElementId()}`
const labelId = `${id}-label`
const descriptionId = `${id}-description`

const hasDescription = () => !!description || !!slots.description
const getDescriptionId = () => hasDescription() ? descriptionId : undefined
</script>

<template>
	<fieldset
		:class="[$style.fieldset, { [$style.fieldset_noGap]: noGap }]"
		:aria-describedby="getDescriptionId()">
		<legend :id="labelId" :class="[$style.fieldset__legend, { 'hidden-visually': hideLabel }]">
			<slot name="label">
				{{ label || '⚠️ Missing label' }}
			</slot>
		</legend>
		<div v-if="hasDescription()" :id="descriptionId" :class="[$style.fieldset__description, { 'hidden-visually': hideDescription }]">
			<slot name="description">
				{{ description }}
			</slot>
		</div>
		<div :class="$style.fieldset__content">
			<slot />
		</div>
	</fieldset>
</template>

<style lang="scss" module>
.fieldset {
	--form-element-label-offset: 12px; /* TODO: currently a magic number from the design. Make sure it is consistent and variables defined. */
	--fieldset-content-gap: calc(2 * var(--default-grid-baseline));

	&.fieldset_noGap {
		--fieldset-content-gap: 0;
	}

	/* Automatically add margin between NcFieldset's */
	/* TODO: Is it a good approach? */
	& + .fieldset {
		margin-block-start: calc(6 * var(--default-grid-baseline));
	}
}

.fieldset__legend {
	padding-inline: var(--form-element-label-offset);
	font-size: var(--font-size);
	font-weight: bold;

	&:has(+ .fieldset__content) {
		margin-block-end: calc(4 * var(--default-grid-baseline));
	}
}

.fieldset__description {
	padding-inline: var(--form-element-label-offset);
	color: var(--color-text-maxcontrast);

	&:has(+ .fieldset__content) {
		margin-block-end: calc(4 * var(--default-grid-baseline));
	}
}

.fieldset__content {
	display: flex;
	flex-direction: column;
	gap: var(--fieldset-content-gap);
}
</style>

<docs>
### General

Native `<fieldset>` element for grouping form elements with a legend.

```vue
<template>
	<NcFieldset label="Personal information">
		<NcTextField label="First name" />
		<NcTextField label="Last name" />
	</NcFieldset>
</template>
```

### With description

```vue
<template>
	<NcFieldset label="Personal information" description="Your contact details">
		<NcTextField label="First name" />
		<NcTextField label="Last name" />
	</NcFieldset>
</template>
```

### Layout

By default `NcFieldset`:
- Adds a gap between its content elements (it can be disabled with the `noGap` prop)
- Adds margin between consecutive `NcFieldset` components

```vue
<template>
	<NcFieldset label="Personal information">
		<NcTextField label="First name" />
		<NcTextField label="Last name" />
	</NcFieldset>

	<NcFieldset label="Personal information">
		<NcTextField label="First name" />
		<NcTextField label="Last name" />
	</NcFieldset>

	<NcFieldset label="No gap (for custom content)" no-gap>
		<NcTextField label="First name" />
		<NcTextField label="Last name" />
	</NcFieldset>
</template>
```
</docs>
