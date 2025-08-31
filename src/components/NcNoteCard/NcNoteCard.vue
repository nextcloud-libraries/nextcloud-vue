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

<template>
	<div class="notecard"
		:class="{
			[`notecard--${type}`]: type,
			'notecard--legacy': isLegacy32,
		}"
		:role="shouldShowAlert ? 'alert' : 'note'">
		<!-- @slot Manually provide icon -->
		<slot name="icon">
			<component :is="icon"
				class="notecard__icon"
				:class="{ 'notecard__icon--heading': heading }"
				fill-color="var(--note-theme)"
				:size="20" />
		</slot>
		<div>
			<p v-if="heading" class="notecard__heading">
				{{ heading }}
			</p>
			<!-- @slot The main content (overwrites the `text` prop) -->
			<slot>
				<p class="notecard__text">
					{{ text }}
				</p>
			</slot>
		</div>
	</div>
</template>

<script>
import Alert from 'vue-material-design-icons/Alert.vue'
import AlertDecagram from 'vue-material-design-icons/AlertDecagram.vue'
import CheckboxMarkedCircle from 'vue-material-design-icons/CheckboxMarkedCircle.vue'
import Information from 'vue-material-design-icons/Information.vue'
import { isLegacy32 } from '../../utils/legacy.ts'

export default {
	name: 'NcNoteCard',

	props: {
		/**
		 * Type or severity of the message
		 */
		type: {
			type: String,
			default: 'warning',
			validator: (type) => ['success', 'info', 'warning', 'error'].includes(type),
		},

		/**
		 * Enforce the `alert` role on the note card.
		 *
		 * The [`alert` role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role)
		 * should only be used for information that requires the user's immediate attention.
		 */
		showAlert: {
			type: Boolean,
			default: false,
		},

		/**
		 * Optional text to show as a heading of the note card
		 */
		heading: {
			type: String,
			default: '',
		},

		/**
		 * The message text of the note card
		 */
		text: {
			type: String,
			default: '',
		},
	},

	setup() {
		return {
			isLegacy32,
		}
	},

	computed: {
		shouldShowAlert() {
			return this.showAlert || this.type === 'error'
		},

		icon() {
			switch (this.type) {
				case 'error':
					return AlertDecagram
				case 'success':
					return CheckboxMarkedCircle
				case 'info':
					return Information
				case 'warning':
					return Alert
				default:
					return Alert
			}
		},
	},
}
</script>

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
		&--heading {
			font-size: var(--note-card-icon-size);
			// Ensure icon is on the same height as the heading
			margin-block: calc((1lh - 1em) / 2) auto;
		}
	}

	&--success {
		--note-background: var(--color-success);
		--note-theme: var(--color-success-text, var(--color-success));
	}

	&--info {
		--note-background: var(--color-info);
		--note-theme: var(--color-info-text, var(--color-info));
	}

	&--error {
		--note-background: var(--color-error);
		--note-theme: var(--color-error-text, var(--color-error));
	}

	&--warning {
		--note-background: var(--color-warning);
		--note-theme: var(--color-warning-text, var(--color-warning));
	}

	&--legacy {
		&.notecard {
			&--error {
				--note-background: rgba(var(--color-error-rgb), 0.1);
			}
			&--info {
				--note-background: rgba(var(--color-info-rgb), 0.1);
			}
			&--success {
				--note-background: rgba(var(--color-success-rgb), 0.1);
			}
			&--warning {
				--note-background: rgba(var(--color-warning-rgb), 0.1);
			}
		}
	}
}
</style>
