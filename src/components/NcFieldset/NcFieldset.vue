<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Usage

The most common usage would be to group input elements and ensuring consistent design within the `NcAppSettingsSection`:

```vue
<template>
<div class="wrapper">
	<NcFieldset
		label="Buttons"
		description="This example shows that the inner button has no border radius but the first and the last have on the outer side.">
		<NcButton>First button</NcButton>
		<NcButton>Second button</NcButton>
		<NcButton>Third button</NcButton>
	</NcFieldset>

	<NcFieldset
		label="Switches"
		description="Grouping multiple on-off options is of course also possible. Using the switch style is recommended for such settings.">
		<NcCheckboxRadioSwitch :model-value="switch1">Nice feature</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :model-value="switch2">Super enhancement</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :model-value="switch3">Optional</NcCheckboxRadioSwitch>
	</NcFieldset>

	<NcFieldset
		label="Mixed"
		description="Not only are also links possible, but also other options using the NcFormsField.">
		
	</NcFieldset>
</div>
</template>

<script>
import { mdiLockCheck } from '@mdi/js'

export default {
	setup() {
		return {
			mdiLockCheck,
		}
	},
	data() {
		return {
			switch1: true,
			switch2: true,
			switch3: false,
		}
	},
}
</script>

<style scoped>
.wrapper {
	max-width: 600px;
}
</style>
```
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'

import { inject, provide, useCssModule, warn, watchEffect} from 'vue'
import { FIELDSET_CONTAINER_CLASS_KEY } from './constants'

const props = defineProps<{
	/**
	 * The id of an element which labels this fieldset.
	 * For accessibility reasons either this reference must be given or a visual `label` must be set.
	 */
	ariaLabelledby?: string

	/**
	 * The visual label of this fieldset.
	 * If no visual label is used an implicit label using the `ariaLabelledby` must be set.
	 */
	label?: string

	/**
	 * Optional visual description of this fieldset.
	 */
	description?: string
}>()

defineSlots<{
	/**
	 * Slot for the main content - the form elements - of this fieldset.
	 */
	default?: Slot

	/**
	 * Optional custom formatted description.
	 * This will take predecence over the `description` prop.
	 */
	description?: Slot
}>()

const cssClasses = useCssModule()
const parentFieldsetClass = inject(FIELDSET_CONTAINER_CLASS_KEY, '')
provide(FIELDSET_CONTAINER_CLASS_KEY, cssClasses.child)

watchEffect(() => {
	if (!props.ariaLabelledby && !props.label) {
		warn('NcFieldset needs either the `label` or `ariaLabelledby` prop set for accessibility.')
	} else if (props.ariaLabelledby && !document.getElementById(props.ariaLabelledby)) {
		warn('NcFieldset: The element set for `ariaLabelledby` does not exist on the page.')
	}
})
</script>

<template>
	<fieldset :aria-labelledby :class="$style.fieldset">
		<legend v-if="label" :class="[$style.label, parentFieldsetClass ? $style.nestedLabel : '']">
			{{ label }}
		</legend>
		<p :class="$style.description">
			<slot name="description">{{ description }}</slot>
		</p>
		<div :class="$style.content">
			<slot />
		</div>
	</fieldset>
</template>

<style module lang="scss">
.fieldset {
	margin-top: var(--default-grid-baseline);
}

.label {
	color: var(--color-main-text);
	font-size: 1.2em;
	font-weight: 600;
	text-align: start;
	margin-inline-start: var(--border-radius-element);
	width: 100%;
}

.nestedLabel {
	font-size: var(--default-font-size);
}

.description {
	color: var(--color-text-maxcontrast);
	margin-inline-start: var(--border-radius-element);
	margin-bottom: calc(var(--default-grid-baseline) / 2);

	&:empty {
		display: none;
	}
}

.content {
	display: flex;
	flex-direction: column;
	gap: var(--default-grid-baseline);
	width: 100%;
}

.child {
	--component-border-radius: 0;
	border-radius: var(--component-border-radius) !important;
	width: 100% !important;

	&:first-of-type {
		--component-border-radius: var(--border-radius-element) var(--border-radius-element) 0 0;
	}
	&:last-of-type {
		--component-border-radius: 0 0 var(--border-radius-element) var(--border-radius-element);
	}
}
</style>
