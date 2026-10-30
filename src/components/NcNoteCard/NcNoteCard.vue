<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to display additional information to the user. It is
available in five versions:

- **success**: Display a successful message.<br>
  Should be used to show success of an operation or optional information to help a user be more successful.
- **info**: Display an informational message.<br>
  Should be used to highlight information that users should take into account.
- **warning**: Display a warning to the user.<br>
  Should be used for critical content demanding user attention due to potential risks.
- **error**: Display an error message.<br>
  Should be used for negative potential consequences of an action.
- **neutral**: Display a note without a severity.<br>
  Should be used for a state that is neither good nor bad, such as an item the user locked themselves.

The `actions` slot shows actions next to the text, for example a button to resolve the note.

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

		<NcNoteCard type="neutral" text="Neither good nor bad" />

		<h4>Custom icon</h4>
		<NcNoteCard type="warning" text="Custom icon usage">
			<template #icon>
				<IconCogOutline :size="20"/>
			</template>
		</NcNoteCard>

		<h4>Custom content using the default slot</h4>
		<NcNoteCard type="info">
			Press <kbd>CTRL</kbd>+<kbd>C</kbd>
		</NcNoteCard>

		<h4>Actions</h4>
		<NcNoteCard type="neutral" text="You are editing this. Others cannot change it until you unlock it.">
			<template #icon>
				<IconLockOutline :size="20" />
			</template>
			<template #actions>
				<NcButton @click="unlocked = true">
					Unlock
				</NcButton>
			</template>
		</NcNoteCard>
		<p v-if="unlocked">Unlocked</p>
	</div>
</template>

<script>
	import IconCogOutline from 'vue-material-design-icons/CogOutline.vue'
	import IconLockOutline from 'vue-material-design-icons/LockOutline.vue'

	export default {
		components: {
			IconCogOutline,
			IconLockOutline,
		},

		data() {
			return {
				unlocked: false,
			}
		},
	}
</script>
```
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'

import { mdiAlert, mdiAlertDecagram, mdiCheckboxMarkedCircle, mdiInformation, mdiInformationOutline } from '@mdi/js'
import { computed } from 'vue'
import { isLegacy } from '../../utils/legacy.ts'
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
	 * Type or severity of the message. `neutral` is available since 9.15.0.
	 */
	type?: 'success' | 'info' | 'warning' | 'error' | 'neutral'
}>(), {
	heading: undefined,
	text: undefined,
	type: 'warning',
})

const slots = defineSlots<{
	/**
	 * Actions shown next to the text, for example a button
	 *
	 * @since 9.15.0
	 */
	actions?: Slot
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
		case 'neutral':
			return mdiInformationOutline
		case 'warning':
		default:
			return mdiAlert
	}
})
</script>

<template>
	<div
		class="notecard"
		:class="{
			[`notecard--${type}`]: type,
			'notecard--legacy': isLegacy,
		}"
		:role="shouldShowAlert ? 'alert' : 'note'">
		<slot name="icon">
			<NcIconSvgWrapper
				:path="iconPath"
				class="notecard__icon"
				:class="{ 'notecard__icon--heading': heading }"
				inline />
		</slot>
		<div class="notecard__content">
			<p v-if="heading" class="notecard__heading">
				{{ heading }}
			</p>
			<slot>
				<p class="notecard__text">
					{{ text }}
				</p>
			</slot>
		</div>
		<div v-if="slots.actions" class="notecard__actions">
			<slot name="actions" />
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
	border-radius: var(--border-radius-small);
	margin: 1rem 0;
	padding: var(--note-card-padding);
	display: flex;
	flex-direction: row;
	gap: var(--note-card-padding);

	&__heading {
		font-size: var(--note-card-icon-size); // Same as icon
		font-weight: var(--font-weight-heading, 600);
	}

	&__content {
		flex: 1 1 auto;
		min-width: 0;
	}

	&__actions {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		align-self: center;
		gap: var(--default-grid-baseline);
		// Only one line tall, sticking out into the padding, so a button does not make the
		// note card taller and is centered on the text like the icon
		margin-block: calc((1lh - var(--default-clickable-area)) / 2);
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
		--note-background: var(--color-success);
		--note-theme: var(--color-success-text);
	}

	&--info {
		--note-background: var(--color-info);
		--note-theme: var(--color-info-text);
	}

	&--error {
		--note-background: var(--color-error);
		--note-theme: var(--color-error-text);
	}

	&--warning {
		--note-background: var(--color-warning);
		--note-theme: var(--color-warning-text);
	}

	&--neutral {
		--note-background: var(--color-background-hover);
		--note-theme: var(--color-border-maxcontrast);
	}

	&--legacy {
		background-color: color-mix(in srgb, var(--note-background), var(--color-main-background) 80%) !important;
		color: var(--color-main-text) !important;
	}

	// The neutral background is already light, mixing it would make it disappear
	&--neutral#{&}--legacy {
		background-color: var(--note-background) !important;
	}
}
</style>
