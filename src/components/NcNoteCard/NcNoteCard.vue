<!--
  - @copyright Copyright (c) 2022 Carl Schwan <carl@carlschwan.eu>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<docs>
This component is made to display additional information to the user. It is
available in four versions:

- success: Display a successful message
- info: Display an informational message
- warning: Display a warning to the user. This indicate that the action they want
- error: Display an error message. For example

When using an error type,

```vue
<template>
	<div>
		<NcNoteCard type="warning">
			<p>This is dangerous</p>
		</NcNoteCard>

		<NcNoteCard type="error" heading="Error">
			<p>The server is not happy and reported the following error</p>
		</NcNoteCard>

		<NcNoteCard type="success">
			<p>You won</p>
		</NcNoteCard>

		<NcNoteCard type="info">
			<p>For your information</p>
		</NcNoteCard>

		<NcNoteCard type="warning">
			<template #icon>
				<Cog :size="20"/>
			</template>
			<p>Custom icon usage</p>
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
	<div
		class="notecard"
		:class="`notecard--${type}`"
		:role="shouldShowAlert ? 'alert' : 'note'">
		<!-- @slot Manually provide icon -->
		<slot name="icon">
			<component
				:is="icon"
				class="notecard__icon"
				:class="{ 'notecard__icon--heading': heading }"
				:fill-color="color" />
		</slot>
		<div>
			<h2 v-if="heading">
				{{ heading }}
			</h2>
			<slot />
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
			validator: (type) =>
				['success', 'info', 'warning', 'error'].includes(type),
		},
		showAlert: {
			type: Boolean,
			default: false,
		},
		heading: {
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
