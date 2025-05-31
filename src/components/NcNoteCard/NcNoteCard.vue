<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to display additional information to the user. It is
available in four versions:

- **success**: Display a successful message.<br>
  Should be used to show success of an operation or optional information to help a user be more successful.
- **info**: Display an informational message.<br>
  Should be used to highlight information that users should take into account.
- **warning**: Display a warning to the user.<br>
  Should be used for critical content demanding user attention due to potential risks.
- **error**: Display an error message.<br>
  Should be used for negative potential consequences of an action.

### Usage

```vue
<template>
	<div>
		<NcNoteCard type="warning" text="This is dangerous" />

		<NcNoteCard type="error"
			heading="Error"
			text="The server is not happy and reported the following error" />

		<NcNoteCard type="success" text="You won" />

		<NcNoteCard type="info" text="For your information" />

		<h4>Custom icon</h4>
		<NcNoteCard type="warning" text="Custom icon usage">
			<template #icon>
				<Cog :size="20"/>
			</template>
		</NcNoteCard>

		<h4>Custom content using the default slot</h4>
		<NcNoteCard type="info">
			Press <kbd>CTRL</kbd>+<kbd>C</kbd>
		</NcNoteCard>
	</div>
</template>

<script>
	import Cog from 'vue-material-design-icons/Cog.vue'

	export default {
		components: {
			Cog,
		},
	}
</script>
```
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'

import { mdiAlert, mdiAlertDecagram, mdiCheckboxMarkedCircle, mdiInformation } from '@mdi/js'
import { computed } from 'vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'

const props = withDefaults(defineProps<{
	/**
	 * Optional text to show as a heading of the note card
	 */
	heading?: string

	/**
	 * Enforce the `alert` role on the note card.
	 *
	 * The alert role should only be used for information that requires the user's immediate attention.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role
	 */
	showAlert?: boolean

	/**
	 * The message text of the note card
	 */
	text?: string

	/**
	 * Type or severity of the message
	 */
	type?: 'success' | 'info' | 'warning' | 'error'
}>(), {
	heading: undefined,
	text: undefined,
	type: 'warning',
})

defineSlots<{
	/** The main content (overwrites the `text` prop) */
	default?: Slot
	/** Manually provided icon */
	icon?: Slot
}>()

const shouldShowAlert = computed(() => props.showAlert || props.type === 'error')

const iconPath = computed(() => {
	switch (props.type) {
	case 'error':
		return mdiAlertDecagram
	case 'success':
		return mdiCheckboxMarkedCircle
	case 'info':
		return mdiInformation
	case 'warning':
	default:
		return mdiAlert
	}
})
</script>

<template>
	<div class="notecard"
		:class="`notecard--${type}`"
		:role="shouldShowAlert ? 'alert' : 'note'">
		<slot name="icon">
			<NcIconSvgWrapper :path="iconPath"
				class="notecard__icon"
				:class="{ 'notecard__icon--heading': heading }" />
		</slot>
		<div>
			<p v-if="heading" class="notecard__heading">
				{{ heading }}
			</p>
			<slot>
				<p class="notecard__text">
					{{ text }}
				</p>
			</slot>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.notecard {
	--note-card-icon-size: 20px;
	--note-card-padding: calc(2 * var(--default-grid-baseline));
	color: var(--color-main-text) !important;
	background-color: var(--note-background) !important;
	border-inline-start: var(--default-grid-baseline) solid var(--note-theme);
	border-radius: var(--border-radius);
	margin: 1rem 0;
	padding: var(--note-card-padding);
	display: flex;
	flex-direction: row;
	gap: var(--note-card-padding);

	&__heading {
		font-size: var(--note-card-icon-size); // Same as icon
		font-weight: 600;
	}

	&__icon {
		color: var(--note-theme);

		&--heading {
			font-size: var(--note-card-icon-size);
			// Ensure icon is on the same height as the heading
			margin-block: calc((1lh - 1em) / 2) auto;
		}
	}

	&--success {
		--note-background: rgba(var(--color-success-rgb), 0.1);
		--note-theme: var(--color-success);
	}

	&--info {
		--note-background: rgba(var(--color-info-rgb), 0.1);
		--note-theme: var(--color-info);
	}

	&--error {
		--note-background: rgba(var(--color-error-rgb), 0.1);
		--note-theme: var(--color-error);
	}

	&--warning {
		--note-background: rgba(var(--color-warning-rgb), 0.1);
		--note-theme: var(--color-warning);
	}
}
</style>
