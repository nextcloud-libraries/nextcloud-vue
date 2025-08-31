<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
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
import IconCancel from '@mdi/svg/svg/cancel.svg?raw'
import IconCheck from '@mdi/svg/svg/check.svg?raw'

export default {
	data() {
		return {
			showDialog: false,
			lastResponse: 'None',
			buttons: [
				{
					label: 'Cancel',
					icon: IconCancel,
					callback: () => { this.lastResponse = 'Pressed "Cancel"' },
				},
				{
					label: 'Ok',
					type: 'primary',
					icon: IconCheck,
					callback: () => { this.lastResponse = 'Pressed "Ok"' },
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
	<div style="display: flex; gap: 12px;">
		<NcButton @click="showDialog = true">Show dialog</NcButton>
		<NcButton @click="showLongDialog = true">Show long dialog</NcButton>
		<NcDialog v-if="showDialog" name="Warning" :can-close="false">
			<template #actions>
				<NcButton @click="showDialog = false">Ok</NcButton>
			</template>
			<div style="color: red; font-weight: bold;">This is serious</div>
		</NcDialog>
		<NcDialog :open.sync="showLongDialog" name="Lorem Ipsum">
			<p v-for="i in new Array(63)" :key="i">Lorem ipsum dolor sit amet.</p>
		</NcDialog>
	</div>
</template>
<script>
export default {
	data() {
		return {
			showDialog: false,
			showLongDialog: false,
		}
	},
}
</script>
```

### Form example
It is also possible to use the dialog for small forms.
This can be used when asking for a password, a name or similar to have native form validation.

To make the dialog a form the `is-form` prop needs to be set.
When using the form variant you can also pass buttons with `nativeType` prop to add a native `submit` button.

Note that this is not possible if the dialog contains a navigation!

```vue
<template>
	<div>
		<NcButton @click="showDialog = true">Show dialog</NcButton>
		<NcDialog is-form
			:buttons="buttons"
			name="Choose a name"
			:open.sync="showDialog"
			@submit="currentName = newName"
			@reset="newName = ''"
			@closing="newName = ''">
			<NcTextField label="New name"
				placeholder="Min. 6 characters"
				required
				minlength="6"
				:value.sync="newName" />
		</NcDialog>
		<p>New name: {{ currentName }}</p>
	</div>
</template>
<script>
import IconCheck from '@mdi/svg/svg/check.svg?raw'

export default {
	data() {
		return {
			showDialog: false,
			newName: '',
			currentName: 'none yet.',
			buttons: [
				{
					label: 'Reset',
					nativeType: 'reset',
				},
				{
					label: 'Submit',
					type: 'primary',
					nativeType: 'submit',
					icon: IconCheck,
				}
			]
		}
	},
}
</script>
```

### Loading buttons
Sometimes a dialog ends with a request and this request might fail due to server-side-validation.
In this case it is often desired to keep the dialog open, this can be done by returning `false` from the button callback,
to not block this callback should return a `Promise<false>`.

It is also possible to get the result of the callback from the dialog, as the result is passed as the payload of the `closing` event.

While the promise is awaited the button will have a loading state,
this means, as long as no custom `icon`-slot is used, a loading icon will be shown.
Please note that the **button will not be disabled or accessibility reasons**,
because disabled elements cannot be focused and so the loading state could not be communicated e.g. via screen readers.

```vue
<template>
	<div>
		<NcButton @click="openDialog">Show dialog</NcButton>
		<NcDialog :buttons="buttons"
			name="Create user"
			:message="message"
			:open.sync="showDialog"
			@closing="response = $event"
			@update:open="clickClosesDialog = false" />
		<div style="margin-top: 8px;">Dialog response: {{ response }}</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			showDialog: false,
			clickClosesDialog: false,
			response: 'none',
		}
	},

	methods: {
		async callback() {
			// wait 3 seconds
			await new Promise((resolve) => window.setTimeout(resolve, 3000))
			this.clickClosesDialog = !this.clickClosesDialog
			// Do not close the dialog on first and then every second button click
			if (this.clickClosesDialog) {
				// return false means the dialog stays open
				return false
			}
			return '✅'
		},

		openDialog() {
			this.response = 'none'
			this.showDialog = true
		},
	},

	computed: {
		buttons() {
			return [
				{
					label: 'Create user',
					type: 'primary',
					callback: this.callback,
				}
			]
		},
		message() {
			if (this.clickClosesDialog) {
				return 'Next button click will work and close the dialog.'
			} else {
				return 'Clicking the button will load but not close the dialog.'
			}
		},
	},
}
</script>
```
</docs>

<template>
	<NcModal v-if="open"
		class="dialog__modal"
		:enable-slideshow="false"
		:enable-swipe="false"
		v-bind="modalProps"
		@close="handleClosed"
		@update:show="handleClosing()">
		<!-- The dialog name / header -->
		<h2 :id="navigationId" class="dialog__name" v-text="name" />
		<component :is="dialogTagName"
			ref="dialogElement"
			class="dialog"
			:class="dialogClasses"
			v-on="dialogListeners">
			<div ref="wrapper" :class="['dialog__wrapper', { 'dialog__wrapper--collapsed': isNavigationCollapsed }]">
				<!-- When the navigation is collapsed (too small dialog) it is displayed above the main content, otherwise on the inline start -->
				<nav v-if="hasNavigation"
					class="dialog__navigation"
					:class="navigationClasses"
					:aria-label="navigationAriaLabelAttr"
					:aria-labelledby="navigationAriaLabelledbyAttr">
					<slot name="navigation" :is-collapsed="isNavigationCollapsed" />
				</nav>
				<!-- Main dialog content -->
				<div class="dialog__content" :class="contentClasses">
					<slot>
						<p class="dialog__text">
							{{ message }}
						</p>
					</slot>
				</div>
			</div>
			<!-- The dialog actions aka the buttons -->
			<div class="dialog__actions">
				<slot name="actions">
					<NcDialogButton v-for="(button, idx) in buttons"
						:key="idx"
						v-bind="button"
						@click="(_, result) => handleButtonClose(button, result)" />
				</slot>
			</div>
		</component>
	</NcModal>
</template>

<script>
import { useElementSize } from '@vueuse/core'
import { computed, defineComponent, ref } from 'vue'
import GenRandomId from '../../utils/GenRandomId.js'
import NcDialogButton from '../NcDialogButton/index.js'
import NcModal from '../NcModal/index.js'

export default defineComponent({
	name: 'NcDialog',

	components: {
		NcDialogButton,
		NcModal,
	},

	props: {
		/** Name of the dialog (the heading) */
		name: {
			type: String,
			required: true,
		},

		/** Text of the dialog */
		message: {
			type: String,
			default: '',
		},

		/** Additional elements to add to the focus trap */
		additionalTrapElements: {
			type: Array,
			validator: (arr) => {
				return (
					Array.isArray(arr) && arr.every(
						(element) => typeof element === 'string' || element instanceof HTMLElement,
					)
				)
			},

			default: () => ([]),
		},

		/**
		 * The element where to mount the dialog, if `null` is passed the dialog is mounted in place
		 * @default 'body'
		 */
		container: {
			type: String,
			required: false,
			default: 'body',
		},

		/**
		 * Whether the dialog should be shown
		 * @default true
		 */
		open: {
			type: Boolean,
			default: true,
		},

		/**
		 * Size of the underlying NcModal
		 * @default 'small'
		 * @type {'small'|'normal'|'large'|'full'}
		 */
		size: {
			type: String,
			required: false,
			default: 'small',
			validator: (value) => typeof value === 'string' && ['small', 'normal', 'large', 'full'].includes(value),
		},

		/**
		 * Buttons to display
		 * @default []
		 */
		buttons: {
			type: Array,
			required: false,
			default: () => ([]),
			validator: (value) => Array.isArray(value) && value.every((element) => typeof element === 'object'),
		},

		/**
		 * Do not show the close button for the dialog.
		 * @default false
		 */
		noClose: {
			type: Boolean,
			default: false,
		},

		/**
		 * Set to false to no show a close button on the dialog
		 * @deprecated - Use `noClose` instead. Will be removed in v9.
		 * @default true
		 */
		canClose: {
			type: Boolean,
			default: true,
		},

		/**
		 * Close the dialog if the user clicked outside of the dialog
		 * Only relevant if `canClose` is set to true.
		 */
		closeOnClickOutside: {
			type: Boolean,
			default: false,
		},

		/**
		 * Make the dialog wrapper a HTML form element.
		 * The buttons will be wrapped within the form so they can be used as submit / reset buttons.
		 * Please note that when using the property the `navigation` should not be used.
		 */
		isForm: {
			type: Boolean,
			default: false,
		},

		/**
		 * Declare if hiding the modal should be animated
		 * @default false
		 */
		outTransition: {
			type: Boolean,
			default: false,
		},

		/**
		 * Optionally pass additional classes which will be set on the navigation for custom styling
		 * @default ''
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
		navigationClasses: {
			type: [String, Array, Object],
			required: false,
			default: '',
		},

		/**
		 * aria-label for the dialog navigation.
		 * Use it when you want to provide a more meaningful label than the dialog name.
		 *
		 * By default, navigation is labeled by the dialog name.
		 */
		navigationAriaLabel: {
			type: String,
			required: false,
			default: '',
		},

		/**
		 * aria-labelledby for the dialog navigation.
		 * Use it when you have an implicit navigation label (e.g. a heading).
		 *
		 * By default, navigation is labeled by the dialog name.
		 */
		navigationAriaLabelledby: {
			type: String,
			required: false,
			default: '',
		},

		/**
		 * Optionally pass additional classes which will be set on the content wrapper for custom styling
		 * @default ''
		 */
		contentClasses: {
			type: [String, Array, Object],
			required: false,
			default: '',
		},

		/**
		 * Optionally pass additional classes which will be set on the dialog itself
		 * (the default `class` attribute will be set on the modal wrapper)
		 * @default ''
		 */
		dialogClasses: {
			type: [String, Array, Object],
			required: false,
			default: '',
		},
	},

	emits: ['closing', 'update:open', 'submit'],

	setup(props, { emit, slots }) {
		/**
		 * The dialog wrapper element
		 * @type {import('vue').Ref<HTMLDivElement>}
		 */
		const wrapper = ref()

		/**
		 * We use the dialog width to decide if we collapse the navigation (flex direction row)
		 */
		const { width: dialogWidth } = useElementSize(wrapper, { width: 900 })

		/**
		 * Whether the navigation is collapsed due to dialog and window size
		 * (collapses when modal is below: 900px modal width - 2x 12px margin)
		 */
		const isNavigationCollapsed = computed(() => dialogWidth.value < 876)

		/**
		 * Whether a navigation was passed and the element should be displayed
		 */
		const hasNavigation = computed(() => slots?.navigation !== undefined)

		/**
		 * The unique id of the nav element
		 */
		const navigationId = GenRandomId()

		/**
		 * aria-label attribute for the nav element
		 */
		const navigationAriaLabelAttr = computed(() => props.navigationAriaLabel || undefined)

		/**
		 * aria-labelledby attribute for the nav element
		 */
		const navigationAriaLabelledbyAttr = computed(() => {
			if (props.navigationAriaLabel) {
				// Not needed, already labelled by aria-label
				return undefined
			}
			// Use dialog name as a fallback label for navigation
			return props.navigationAriaLabelledby || navigationId
		})

		/**
		 * @type {import('vue').Ref<HTMLFormElement|undefined>}
		 */
		const dialogElement = ref()
		/**
		 * The HTML element to use for the dialog wrapper - either form or plain div
		 */
		const dialogTagName = computed(() => props.isForm && !hasNavigation.value ? 'form' : 'div')
		/**
		 * Listener to assign to the dialog element
		 * This only sets the `@submit` listener if the dialog element is a form
		 */
		const dialogListeners = computed(() => dialogTagName.value === 'form'
			? {
				/**
				 * @param {SubmitEvent} event Form submit event
				 */
					submit(event) {
						event.preventDefault()
						/** Forwarded HTMLFormElement submit event (only if `is-form` is set) */
						emit('submit', event)
					},
					/**
					 * @param {Event} event Form submit event
					 */
					reset(event) {
						event.preventDefault()
						/**
						 * Forwarded HTMLFormElement reset event (only if `is-form` is set).
						 */
						emit('reset', event)
					},
				}
			: {},
		)

		/**
		 * If the underlying modal is shown
		 */
		const showModal = ref(true)

		// Because NcModal does not emit `close` when show prop is changed
		/**
		 * Handle clicking a dialog button -> should close
		 * @param {MouseEvent} button The button that was clicked
		 * @param {unknown} result Result of the callback function
		 */
		function handleButtonClose(button, result) {
			// Skip close on submit if invalid dialog
			if ((button.type === 'submit' || button.nativeType === 'submit')
				&& dialogTagName.value === 'form'
				&& !dialogElement.value.reportValidity()) {
				return
			}
			handleClosing(result)
			window.setTimeout(() => handleClosed(), 300)
		}

		/**
		 * Handle closing the dialog, optional out transition did not run yet
		 * @param {unknown} result the result of the callback
		 */
		const handleClosing = (result) => {
			showModal.value = false
			/**
			 * Emitted when the dialog is closing, so the out transition did not finish yet.
			 * @param result The result of the button callback (`undefined` if closing because of clicking the 'close'-button)
			 */
			emit('closing', result)
		}

		/**
		 * Handle dialog closed (out transition finished)
		 */
		const handleClosed = () => {
			showModal.value = true
			/**
			 * Emitted then the dialog is fully closed and the out transition run
			 */
			emit('update:open', false)
		}

		/**
		 * Properties to pass to the underlying NcModal
		 */
		const modalProps = computed(() => ({
			noClose: props.noClose || !props.canClose,
			container: props.container === undefined ? 'body' : props.container,
			// we do not pass the name as we already have the name as the headline
			// name: props.name,
			// But we need to set the correct label id so the dialog is labelled
			labelId: navigationId,
			size: props.size,
			show: props.open && showModal.value,
			outTransition: props.outTransition,
			closeOnClickOutside: props.closeOnClickOutside,
			additionalTrapElements: props.additionalTrapElements,
		}))

		return {
			dialogElement,
			dialogListeners,
			dialogTagName,
			handleButtonClose,
			handleClosing,
			handleClosed,
			hasNavigation,
			navigationId,
			navigationAriaLabelAttr,
			navigationAriaLabelledbyAttr,
			isNavigationCollapsed,
			modalProps,
			wrapper,
		}
	},
})
</script>

<style lang="scss">
/** When having the small dialog style we override the modal styling so dialogs look more dialog like */
@media only screen and (max-width: $breakpoint-small-mobile) {
	.dialog__modal .modal-wrapper--small .modal-container {
		width: fit-content;
		height: unset;
		max-height: 90%;
		position: relative;
		top: unset;
		border-radius: var(--border-radius-large);
	}
}
</style>

<style lang="scss" scoped>
.dialog {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	overflow: hidden;

	&__modal {
		:deep(.modal-wrapper .modal-container) {
			display: flex !important;
			padding-block: 4px 0; // 4px to align with close button, 0 block-end to make overflowing content on scroll look nice
			padding-inline: 12px 0; // Same as with padding-block, we need the actions to have a margin of 4px for the button outline
		}
		:deep(.modal-wrapper .modal-container__content) {
			display: flex;
			flex-direction: column;
			overflow: hidden; // Only overflow on the .dialog__content
		}
	}

	&__wrapper {
		display: flex;
		flex-direction: row;
		// Auto scale to fit
		flex: 1;
		min-height: 0;
		overflow: hidden;

		&--collapsed {
			flex-direction: column;
		}
	}

	&__navigation {
		display: flex;
		flex-shrink: 0;
	}

	// Navigation styling when side-by-side with content
	&__wrapper:not(&__wrapper--collapsed) &__navigation {
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
		font-size: 21px;

		text-align: center;
		height: fit-content;
		min-height: var(--default-clickable-area);
		line-height: var(--default-clickable-area);
		overflow-wrap: break-word;
		margin-block: 0 12px;
	}

	&__content {
		// Auto fit
		flex: 1;
		min-height: 0;
		overflow: auto;
		// see .dialog__modal, we can not set the padding there to prevent floating scroll bars
		padding-inline-end: 12px;
	}

	// In case only text content is show
	&__text {
		// Also add padding to the bottom to make it more readable
		padding-block-end: 6px;
	}

	&__actions {
		box-sizing: border-box;

		display: flex;
		gap: 6px;
		align-content: center;
		justify-content: end;

		width: 100%;
		max-width: 100%;
		padding-inline: 0 12px; // 12px to align with the overall modal padding
		margin-inline: 0;
		margin-block: 0;

		&:not(:empty) {
			margin-block: 6px 12px; // only if there are actions, we add margin so if it is empty scroll content looks nice
		}
	}
}

@media only screen and (max-width: $breakpoint-small-mobile) {
	// Ensure the dialog name does not interfere with the close button
	.dialog__name {
		text-align: start;
		margin-inline-end: var(--default-clickable-area);
	}
}
</style>
