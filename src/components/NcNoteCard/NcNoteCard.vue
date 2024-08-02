<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to display additional information to the user. It is
available in four versions:

- success: Display a successful message
- info: Display an informational message
- warning: Display a warning to the user. This indicate that the action they want
- error: Display an error message. For example

When using an error type,

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
		:class="`notecard--${type}`"
		:role="shouldShowAlert ? 'alert' : 'note'">
		<!-- @slot Manually provide icon -->
		<slot name="icon">
			<component :is="icon"
				class="notecard__icon"
				:class="{'notecard__icon--heading': heading}"
				:fill-color="color" />
		</slot>
		<div>
			<h2 v-if="heading">
				{{ heading }}
			</h2>
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
import CheckboxMarkedCircle from 'vue-material-design-icons/CheckboxMarkedCircle.vue'
import AlertDecagram from 'vue-material-design-icons/AlertDecagram.vue'
import Alert from 'vue-material-design-icons/Alert.vue'
import Information from 'vue-material-design-icons/Information.vue'

export default {
	name: 'NcNoteCard',

	props: {
		/**
		 * Type of the attribute
		 */
		type: {
			type: String,
			default: 'warning',
			validator: type => ['success', 'info', 'warning', 'error'].includes(type),
		},
		showAlert: {
			type: Boolean,
			default: false,
		},
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
		color() {
			switch (this.type) {
			case 'error':
				return 'var(--color-error)'
			case 'success':
				return 'var(--color-success)'
			case 'info':
				return 'var(--color-info)'
			case 'warning':
				return 'var(--color-warning)'
			default:
				return 'var(--color-warning)'
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.notecard {
	color: var(--color-main-text) !important;
	background-color: var(--note-background) !important;
	border-inline-start: 4px solid var(--note-theme);
	border-radius: var(--border-radius);
	margin: 1rem 0;
	margin-top: 1rem;
	padding: 1rem;
	display: flex;
	flex-direction: row;
	gap: 1rem;

	&__icon--heading {
		margin-bottom: auto;
		margin-top: 0.3rem;
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
