<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description

This component is just a wrapper for the floating-vue plugin by Akryum,
please refer to this documentation for customization:
https://github.com/Akryum/floating-vue

This components has two slots:
* 'trigger' which can be any html element and it will trigger the popover
this slot is optional since you can toggle the popover also by updating the
open prop on this component;

* a default slot that is for the content of the popover.

### Examples

#### With a `<NcButton>` as a trigger:

```vue
<template>
	<div style="display: flex">
		<NcPopover popup-role="dialog">
			<template #trigger>
				<NcButton>I am the trigger</NcButton>
			</template>
			<template>
				<form tabindex="0" role="dialog" aria-labelledby="popover-example-dialog-header-1" @submit.prevent>
					<h2 id="popover-example-dialog-header-1">this is some content</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br/>
						Vestibulum eget placerat velit.
					</p>
					<label>
						Label element
						<input type="text" placeholder="input element"/>
					</label>
				</form>
			</template>
		</NcPopover>
	</div>
</template>
```

#### Without focus trap:

The [`focus-trap`](https://github.com/focus-trap/focus-trap) emits an error when used in a non-focusable element tree.

The prop `:focus-trap="false"` help to prevent it when the default behavior is not relevant.

```vue
<template>
	<div style="display: flex">
		<NcPopover :focus-trap="false">
			<template #trigger>
				<NcButton>Click me!</NcButton>
			</template>
			<template>
				Hi! 🚀
			</template>
		</NcPopover>
	</div>
</template>
```

#### With passing props to `floating-vue`'s `Dropdown`:

```vue
<template>
	<div style="display: flex">
		<NcPopover container="body" :popper-hide-triggers="(triggers) => [...triggers, 'click']" popup-role="dialog">
			<template #trigger>
				<NcButton>I am the trigger</NcButton>
			</template>
			<template #default>
				<NcButton>Click on the button will close NcPopover</NcButton>
			</template>
		</NcPopover>
	</div>
</template>
```

#### With a custom button in as a trigger:

When `<NcButton>` is used as a `<NcPopover>` trigger, it injects required for a11y attributes to the button.

If you are using your own custom button as a trigger make sure to bind `attrs` from the trigger slot props.
See code example below.

```vue
<template>
	<div style="display: flex">
		<NcPopover>
			<!-- Take "attrs" from the slot props -->
			<template #trigger="{ attrs }">
				<!-- Bind attrs as the button attrs -->
				<button v-bind="attrs">
					I am a custom button in the trigger
				</button>
			</template>

			Hi! 🚀
		</NcPopover>
	</div>
</template>
```

#### Provide role for the popover content

For accessibility reasons, popover should have a role. Provide it to the `popup-role` and make sure that the popover content is an element with the same role.

See: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup

```vue
<template>
	<div style="display: flex">
		<!-- Provide popup role -->
		<NcPopover popup-role="dialog">
			<template #trigger>
				<NcButton>Delete</NcButton>
			</template>

			<!-- Popover content should has the same role -->
			<div role="dialog" aria-labelledby="popover-example-custom-role-1" aria-modal="true">
				<!-- This is not required but better to provide a label -->
				<header id="popover-example-custom-role-1">
					<strong>Confirm remove</strong>
				</header>
				<NcButton type="danger">Delete</NcButton>
			</div>
		</NcPopover>
	</div>
</template>
```
</docs>

<template>
	<Dropdown ref="popover"
		:distance="10"
		:arrow-padding="10"
		v-bind="$attrs"
		:no-auto-focus="true /* Handled by the focus trap */"
		:popper-class="popoverBaseClass"
		:shown="internalShown"
		v-on="$listeners"
		@update:shown="internalShown = $event"
		@apply-show="afterShow"
		@apply-hide="afterHide">
		<NcPopoverTriggerProvider v-slot="slotProps" :shown="internalShown" :popup-role="popupRole">
			<!-- This will be the popover target (for the events and position) -->
			<slot name="trigger" v-bind="slotProps" />
		</NcPopoverTriggerProvider>

		<!-- This will be the content of the popover -->
		<template #popper="slotProps">
			<slot name="default" v-bind="slotProps" />
		</template>
	</Dropdown>
</template>

<script>
import Vue from 'vue'
import { Dropdown } from 'floating-vue'
import { createFocusTrap } from 'focus-trap'
import { getTrapStack } from '../../utils/focusTrap.js'
import NcPopoverTriggerProvider from './NcPopoverTriggerProvider.vue'

/**
 * @typedef {import('focus-trap').FocusTargetValueOrFalse} FocusTargetValueOrFalse
 * @typedef {FocusTargetValueOrFalse|() => FocusTargetValueOrFalse} SetReturnFocus
 */

export default {
	name: 'NcPopover',

	components: {
		Dropdown,
		NcPopoverTriggerProvider,
	},

	inheritAttrs: false,

	props: {
		/**
		 * Show or hide the popper
		 * @see https://floating-vue.starpad.dev/api/#shown
		 */
		shown: {
			type: Boolean,
			default: false,
		},

		/**
		 * Popup role
		 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup#values
		 */
		popupRole: {
			type: String,
			default: undefined,
			validator: (value) => ['menu', 'listbox', 'tree', 'grid', 'dialog', 'true'].includes(value),
		},

		popoverBaseClass: {
			type: String,
			default: '',
		},
		/**
		 * Enable popover focus trap
		 */
		focusTrap: {
			type: Boolean,
			default: true,
		},
		/**
		 * Set element to return focus to after focus trap deactivation
		 *
		 * @type {SetReturnFocus}
		 */
		setReturnFocus: {
			default: undefined,
			type: [HTMLElement, SVGElement, String, Boolean, Function],
		},
	},

	emits: [
		'after-show',
		'after-hide',
		/**
		 * @see https://floating-vue.starpad.dev/api/#update-shown
		 */
		'update:shown',
	],

	data() {
		return {
			internalShown: this.shown,
		}
	},

	watch: {
		shown(value) {
			this.internalShown = value
		},

		internalShown(value) {
			this.$emit('update:shown', value)
		},
	},

	mounted() {
		this.checkTriggerA11y()
	},

	beforeDestroy() {
		this.clearFocusTrap()
		this.clearEscapeStopPropagation()
	},

	methods: {
		/**
		 * Check if the trigger has all required a11y attributes.
		 * Important to check custom trigger button.
		 */
		checkTriggerA11y() {
			if (window.OC?.debug) {
				const triggerContainer = this.getPopoverTriggerContainerElement()
				const requiredTriggerButton = triggerContainer.querySelector('[aria-expanded]')
				if (!requiredTriggerButton) {
					Vue.util.warn('It looks like you are using a custom button as a <NcPopover> or other popover #trigger. If you are not using <NcButton> as a trigger, you need to bind attrs from the #trigger slot props to your custom button. See <NcPopover> docs for an example.')
				}
			}
		},

		/**
		 * Remove incorrect aria-describedby attribute from the trigger.
		 * @see https://github.com/Akryum/floating-vue/blob/8d4f7125aae0e3ea00ba4093d6d2001ab15058f1/packages/floating-vue/src/components/Popper.ts#L734
		 */
		removeFloatingVueAriaDescribedBy() {
			// When the popover is shown, floating-vue mutates the root elements of the trigger adding data-popper-shown and incorrect aria-describedby attributes.
			const triggerContainer = this.getPopoverTriggerContainerElement()
			const triggerElements = triggerContainer.querySelectorAll('[data-popper-shown]')
			for (const el of triggerElements) {
				el.removeAttribute('aria-describedby')
			}
		},

		/**
		 * @return {HTMLElement|undefined}
		 */
		getPopoverContentElement() {
			return this.$refs.popover?.$refs.popperContent?.$el
		},

		/**
		 * @return {HTMLElement|undefined}
		 */
		getPopoverTriggerContainerElement() {
			// TODO: Vue 3: should be
			// this.$refs.popover.$refs.popper.$refs.reference
			return this.$refs.popover.$refs.reference
		},

		/**
		 * Add focus trap for accessibility.
		 */
		async useFocusTrap() {
			await this.$nextTick()

			if (!this.focusTrap) {
				return
			}

			const el = this.getPopoverContentElement()

			if (!el) {
				return
			}

			// Init focus trap
			this.$focusTrap = createFocusTrap(el, {
				// Prevents to lose focus using esc key
				// Focus will be release when popover be hide
				escapeDeactivates: false,
				allowOutsideClick: true,
				setReturnFocus: this.setReturnFocus,
				trapStack: getTrapStack(),
			})
			this.$focusTrap.activate()
		},

		/**
		 * Remove focus trap
		 *
		 * @param {object} options The configuration options for focusTrap
		 */
		clearFocusTrap(options = {}) {
			try {
				this.$focusTrap?.deactivate(options)
				this.$focusTrap = null
			} catch (err) {
				console.warn(err)
			}
		},

		/**
		 * Add stopPropagation for Escape.
		 * It prevents global Escape handling after closing popover.
		 *
		 * Manual event handling is used here instead of v-on because there is no direct access to the node.
		 * Alternative - wrap <template #popover> in a div wrapper.
		 */
		addEscapeStopPropagation() {
			const el = this.getPopoverContentElement()
			el?.addEventListener('keydown', this.stopKeydownEscapeHandler)
		},

		/**
		 * Remove stop Escape handler
		 */
		clearEscapeStopPropagation() {
			const el = this.getPopoverContentElement()
			el?.removeEventListener('keydown', this.stopKeydownEscapeHandler)
		},

		/**
		 * @param {KeyboardEvent} event - native keydown event
		 */
		stopKeydownEscapeHandler(event) {
			if (event.type === 'keydown' && event.key === 'Escape') {
				event.stopPropagation()
			}
		},

		async afterShow() {
			this.removeFloatingVueAriaDescribedBy()

			await this.$nextTick()
			await this.useFocusTrap()
			this.addEscapeStopPropagation()

			/**
			 * Triggered after the tooltip was visually displayed.
			 *
			 * This is different from the 'show' and 'apply-show' which
			 * run earlier than this where there is no guarantee that the
			 * tooltip is already visible and in the DOM.
			 */
			this.$emit('after-show')
		},
		afterHide() {
			this.clearFocusTrap()
			this.clearEscapeStopPropagation()
			/**
			 * Triggered after the tooltip was visually hidden.
			 */
			this.$emit('after-hide')
		},
	},
}
</script>

<style lang="scss">

.resize-observer {
	position:absolute;
	top:0;
	left:0;
	z-index:-1;
	width:100%;
	height:100%;
	border:none;
	background-color:transparent;
	pointer-events:none;
	display:block;
	overflow:hidden;
	opacity:0
}

.resize-observer object {
	display:block;
	position:absolute;
	top:0;
	left:0;
	height:100%;
	width:100%;
	overflow:hidden;
	pointer-events:none;
	z-index:-1
}

$arrow-width: 10px;
// Move the arrow just slightly inside the popover
// To prevent a visual gap on page scaling
$arrow-position: $arrow-width - 1px;

.v-popper--theme-dropdown {
	&.v-popper__popper {
		z-index: 100000;
		top: 0;
		left: 0;
		display: block !important;

		.v-popper__wrapper {
			/*
			 * In theory, "filter: drop-shadow" would look better here with arrow shadow.
			 * In fact, in results in a blurry popover in Chromium on scaling.
			 * The hypothesis is that "filter" creates a new composition layer,
			 * and with GPU acceleration requires the previous layers content to be rasterized.
			 * In combination with translate3d from floating-vue, it makes Chromium to first render and rasterize the popover
			 * and then apply scaling, which results in a blurry popover.
			 */
			box-shadow: 0 1px 10px var(--color-box-shadow);
			border-radius: var(--border-radius-large);
		}

		.v-popper__inner {
			padding: 0;
			color: var(--color-main-text);
			border-radius: var(--border-radius-large);
			overflow: hidden;
			background: var(--color-main-background);
		}

		.v-popper__arrow-container {
			position: absolute;
			z-index: 1;
			width: 0;
			height: 0;
			border-style: solid;
			border-color: transparent;
			border-width: $arrow-width;
		}

		&[data-popper-placement^='top'] .v-popper__arrow-container {
			bottom: -$arrow-position;
			border-bottom-width: 0;
			border-top-color: var(--color-main-background);
		}

		&[data-popper-placement^='bottom'] .v-popper__arrow-container {
			top: -$arrow-position;
			border-top-width: 0;
			border-bottom-color: var(--color-main-background);
		}

		&[data-popper-placement^='right'] .v-popper__arrow-container {
			left: -$arrow-position;
			border-left-width: 0;
			border-right-color: var(--color-main-background);
		}

		&[data-popper-placement^='left'] .v-popper__arrow-container {
			right: -$arrow-position;
			border-right-width: 0;
			border-left-color: var(--color-main-background);
		}

		&[aria-hidden='true'] {
			visibility: hidden;
			transition: opacity var(--animation-quick), visibility var(--animation-quick);
			opacity: 0;
		}

		&[aria-hidden='false'] {
			visibility: visible;
			transition: opacity var(--animation-quick);
			opacity: 1;
		}
	}
}

</style>
