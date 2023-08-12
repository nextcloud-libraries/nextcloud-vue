<!--
  - @copyright Copyright (c) 2023 Ferdinand Thiessen
  -
  - @author Ferdinand Thiessen <opensource@fthiessen.de>
  -
  - @license AGPL-3.0-or-later
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->
  <docs>
### General description

This component uses the `NcModal` under the hood for allowing users to create generic dialogs.

### Basic example
```vue
<template>
	<div>
		<NcButton @click="showDialog = true">Show dialog</NcButton>
		<NcDialog :open.sync="showDialog" name="Confirmation" message="Are you sure to proceed?" :buttons="buttons" />
		<p>Last response: {{ lastResponse }}</p>
	</div>
</template>
<script>
// import { NcDialog } from '@nextcloud/vue/dist/Components/NcDialog.js'
import IconCancel from 'vue-material-design-icons/Cancel.vue'
import IconCheck from 'vue-material-design-icons/Check.vue'

export default {
	data() {
		return {
			showDialog: false,
			lastResponse: 'None',
			buttons: [
				{
					label: 'Ok',
					type: 'primary',
					icon: IconCheck,
					callback: () => { this.lastResponse = 'Pressed "Ok"' },
				},
				{
					label: 'Cancel',
					icon: IconCancel,
					callback: () => { this.lastResponse = 'Pressed "Cancel"' },
				}
			]
		}
	},
}
</script>
```

### Use custom actions and content
Instead of using the buttons property, you can also inject your custom actions using a named slot.
You can also use the default slot to inject custom content.

```vue
<template>
	<div>
		<NcButton @click="showDialog = true">Show dialog</NcButton>
		<NcDialog v-if="showDialog" name="Warning" :can-close="false">
			<template #actions>
				<NcButton @click="showDialog = false">Ok</NcButton>
			</template>
			<div style="color: red; font-weight: bold;">This is serious</div>
		</NcDialog>
	</div>
</template>
<script>
import IconCancel from 'vue-material-design-icons/Cancel.vue'
import IconCheck from 'vue-material-design-icons/Check.vue'

export default {
	data() {
		return {
			showDialog: false,
		}
	},
}
</script>
```
</docs>

<template>
	<NcModal v-if="open"
		v-bind="modalProps"
		@close="handleClosed"
		@update:show="handleClosing">
		<Fragment>
			<div ref="wrapper" :class="['dialog__wrapper', { 'dialog__wrapper--collapsed': isNavigationCollapsed }]">
				<!-- If the navigation is shown on top of the content, the header should be above the navigation -->
				<h2 v-if="isNavigationCollapsed" class="dialog__name">
					{{ props.name }}
				</h2>
				<!-- When the navigation is collapsed (too small dialog) it is displayed above the main content, otherwise on the inline start -->
				<nav v-if="hasNavigation" :class="['dialog__navigation', ...navigationClasses]">
					<slot name="navigation" :is-collapsed="isNavigationCollapsed" />
				</nav>
				<!-- Main dialog content -->
				<div class="dialog__content">
					<!-- If the navigation is shown on the side the header should be directly aligned with the content -->
					<h2 v-if="!isNavigationCollapsed" class="dialog__name">
						{{ props.name }}
					</h2>
					<slot>
						<p>{{ props.message }}</p>
					</slot>
				</div>
			</div>
			<!-- The dialog actions aka the buttons -->
			<div class="dialog__actions">
				<slot name="actions">
					<NcDialogButton v-for="(button, idx) in props.buttons"
						:key="`${button.label}${idx}`"
						v-bind="button"
						@click="handleButtonClose" />
				</slot>
			</div>
		</Fragment>
	</NcModal>
</template>

<script setup lang="ts">
// eslint-disable-next-line n/no-missing-import
import type { IDialogButton } from './types'

import { useElementSize } from '@vueuse/core'
import { computed, ref, useSlots } from 'vue'
import { Fragment } from 'vue-frag' // can be dropped with vue3

import NcModal from '../NcModal/index.js'
import NcDialogButton from './NcDialogButton.vue'

const props = withDefaults(defineProps<{
	/** Name of the dialog (the heading) */
	name: string
	/** Text of the dialog */
	message?: string
	/**
	 * The element here to mount the dialog
	 * @default 'body'
	 */
	container?: string
	/**
	 * Size of the underlying NcModal
	 * @default 'normal'
	 */
	size?: 'small' | 'normal' | 'large' | 'full'
	/**
	 * Array of buttons to display
	 * @see NcDialogButton for supported properties of a button
	 * @default []
	 */
	buttons?: readonly IDialogButton[]
	/**
	 * Whether the dialog should be shown
	 * @default true
	 */
	open?: boolean
	/**
	 * Declare if hiding the modal should be animated
	 * @default false
	 */
	outTransition?: boolean
	/**
	 * Set to false to no show a close button on the dialog
	 * @default true
	 */
	canClose?: boolean
	/**
	 * Optionally pass additionaly classes which will be set on the navigation for custom styling
	 * @default []
	 * @example
	 * ```html
	 * <DialogBase :navigation-classes="['mydialog-navigation']"><!-- --></DialogBase>
	 * <!-- ... -->
	 * <style lang="scss">
	 * :deep(.mydialog-navigation) {
	 *     flex-direction: row-reverse;
	 * }
	 * </style>
	 * ```
	 */
	navigationClasses?: string[]
}>(), {
	size: 'normal',
	container: 'body',
	message: '',
	buttons: () => [],
	canClose: true,
	open: true,
	outTransition: false,
	navigationClasses: () => [],
})

const emit = defineEmits<{
	/** Emitted when the dialog is about to close but the out transition did not finished yet */
	(e: 'closing'): void
	/** Emitted when the open state changed */
	(e: 'update:open', v: boolean): void
}>()

const slots = useSlots()

/**
 * The dialog wrapper element
 */
const wrapper = ref<HTMLDivElement>()

/**
 * We use the dialog width to decide if we collapse the navigation (flex direction row)
 */
const { width: dialogWidth } = useElementSize(wrapper)

/**
 * Whether the navigation is collapsed due to dialog and window size
 * (collapses when modal is below: 900px modal width - 2x 12px margin)
 */
const isNavigationCollapsed = computed(() => dialogWidth.value < 876)

/**
 * Whether a navigation was passed and the element should be displayed
 */
const hasNavigation = computed(() => slots?.navigation !== undefined)

const showModal = ref(true)

// Because NcModal does not emit `close` when show prop is changed
const handleButtonClose = () => {
	handleClosing()
	window.setTimeout(() => handleClosed(), 300)
}

/**
 * Handle closing the dialog, optional out transition did not run yet
 */
const handleClosing = () => {
	showModal.value = false
	emit('closing')
}

/**
 * Handle dialog closed (out transition finished)
 */
const handleClosed = () => {
	console.warn('closed')
	showModal.value = true
	emit('update:open', false)
}

/**
 * Properties to pass to the underlying NcModal
 */
const modalProps = computed(() => ({
	canClose: props.canClose,
	container: props.container,
	name: props.name,
	size: props.size,
	show: props.open && showModal.value,
	outTransition: props.outTransition,
	class: 'dialog__modal',
	enableSlideshow: false,
	enableSwipe: false,
}))
</script>

<style lang="scss" scoped>
.dialog {
	&__wrapper {
		box-sizing: border-box;
		padding-inline: 12px;
		padding-block: 0 12px; // remove margin to align header with close button
		height: 100%;
		display: flex;
		flex-direction: row;

		&--collapsed {
			flex-direction: column;
		}
	}

	&__content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	&__navigation {
		display: flex;
	}

	// Navigation styling when side-by-side with content
	&__wrapper:not(&__wrapper--collapsed) &__navigation {
		box-sizing: border-box;
		padding-block-start: calc(var(--default-clickable-area) + 16px); // align with __name (4px top & 12px bottom margin)
		flex-direction: column;

		overflow: hidden auto;
		height: 100%;
		min-width: 200px;
		margin-inline-end: 20px;
	}

	// Navigation styling when on top of content
	&__wrapper#{&}__wrapper--collapsed &__navigation {
		flex-direction: row;
		justify-content: space-between;

		overflow: auto hidden;
		width: 100%;
		min-width: 100%;
	}

	&__name {
		// Same as the NcAppSettingsDialog
		text-align: start;
		height: var(--default-clickable-area);
		min-height: var(--default-clickable-area);
		line-height: var(--default-clickable-area);
		margin-block: 4px 12px; // start = 4px to align with close button
	}

	&__actions {
		display: flex;
		gap: 6px;
		align-content: center;
		width: fit-content;
		margin-inline: auto 12px;
		margin-block: 0 12px;
	}

	&__modal {
		:deep(.modal-container__content) {
			overflow: hidden;
			height: 100%;
		}
	}
}
</style>
