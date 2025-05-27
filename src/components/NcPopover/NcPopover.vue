<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description

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
			<template #default>
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

The prop `no-focus-trap` help to prevent it when the default behavior is not relevant.

```vue
<template>
	<div style="display: flex">
		<NcPopover no-focus-trap>
			<template #trigger>
				<NcButton>Click me!</NcButton>
			</template>
			<template #default>
				Hi! 🚀
			</template>
		</NcPopover>
	</div>
</template>
```

#### With logical placement

If the text flow is language specific (e.g. UI is shown for right-to-left language),
also the popover often needs to be adjusted when not rendered on top or bottom (default).

```vue
<template>
	<div class="wrapper">
		<fieldset>
			<NcCheckboxRadioSwitch v-model="dir" type="radio" value="ltr">
				LTR
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="dir" type="radio" value="rtl">
				RTL
			</NcCheckboxRadioSwitch>
		</fieldset>
		<div class="content" :dir>
			<NcPopover :key="dir"
				placement="end"
				:triggers="['hover']">
				<template #trigger>
					<NcButton>
						Hover me
					</NcButton>
				</template>
				<template #default>
					This will be shown on the logical end of the button.
				</template>
			</NcPopover>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			dir: 'ltr',
		}
	},
}
</script>
<style scoped>
.content {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
}

fieldset {
	display: flex;
	flex-direction: row;
	gap: 12px;
}
</style>
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
		v-model:shown="internalShown"
		:arrow-padding="10"
		:auto-hide="closeOnClickOutside"
		:boundary="boundary || undefined"
		:container
		:delay
		:distance="10"
		handle-resize
		:no-auto-focus="true /* Handled by the focus trap */"
		:placement="internalPlacement"
		:popper-class="popoverBaseClass"
		:popper-triggers
		:popper-hide-triggers
		:popper-show-triggers
		:triggers="internalTriggers"
		:hide-triggers
		:show-triggers
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
import { Dropdown } from 'floating-vue'
import { createFocusTrap } from 'focus-trap'
import { warn } from 'vue'
import { getTrapStack } from '../../utils/focusTrap.ts'
import { isRtl } from '../../utils/rtl.ts'
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

	props: {
		/**
		 * Element to use for calculating the popper boundary (size and position).
		 * Either a query string or the actual HTMLElement.
		 */
		boundary: {
			type: [String, Object],
			default: '',
		},

		/**
		 * Automatically hide the popover on click outside.
		 */
		closeOnClickOutside: {
			type: Boolean,
			default: false,
		},

		/**
		 * Container where to mount the popover.
		 * Either a select query or `false` to mount to the parent node.
		 */
		container: {
			type: [String, Boolean],
			default: 'body',
		},

		/**
		 * Delay for showing or hiding the popover.
		 *
		 * Can either be a number or an object to configure different delays (`{ show: number, hide: number }`).
		 */
		delay: {
			type: [Number, Object],
			default: 0,
		},

		/**
		 * Disable the popover focus trap.
		 */
		noFocusTrap: {
			type: Boolean,
			default: false,
		},

		/**
		 * Where to place the popover.
		 *
		 * This consists of the vertical placement and the horizontal placement.
		 * E.g. `bottom` will place the popover on the bottom of the trigger (horizontally centered),
		 * while `buttom-start` will horizontally align the popover on the logical start (e.g. for LTR layout on the left.).
		 * The `start` or `end` placement will align the popover on the left or right side or the trigger element.
		 *
		 * @type {'auto'|'auto-start'|'auto-end'|'top'|'top-start'|'top-end'|'bottom'|'bottom-start'|'bottom-end'|'start'|'end'}
		 */
		placement: {
			type: String,
			default: 'bottom',
		},

		popoverBaseClass: {
			type: String,
			default: '',
		},

		/**
		 * Events that trigger the popover on the popover container itself.
		 * This is useful if you set `triggers` to `hover` and also want the popover to stay open while hovering the popover itself.
		 *
		 * It is possible to also pass an object to define different triggers for hide and show `{ show: ['hover'], hide: ['click'] }`.
		 */
		popoverTriggers: {
			type: [Array, Object],
			default: null,
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

		/**
		 * Set element to return focus to after focus trap deactivation
		 *
		 * @type {SetReturnFocus}
		 */
		setReturnFocus: {
			default: undefined,
			type: [HTMLElement, SVGElement, String, Boolean, Function],
		},

		/**
		 * Show or hide the popper
		 */
		shown: {
			type: Boolean,
			default: false,
		},

		/**
		 * Events that trigger the popover.
		 *
		 * If you pass an empty array then only the `shown` prop can control the popover state.
		 * Following events are available:
		 * - `'hover'`
		 * - `'click'`
		 * - `'focus'`
		 * - `'touch'`
		 *
		 * It is also possible to pass an object to have different events for show and hide:
		 * `{ hide: ['click'], show: ['click', 'hover'] }`
		 */
		triggers: {
			type: [Array, Object],
			default: () => ['click'],
		},
	},

	emits: [
		'afterShow',
		'afterHide',
		'update:shown',
	],

	data() {
		return {
			internalShown: this.shown,
		}
	},

	computed: {
		popperTriggers() {
			if (this.popoverTriggers && Array.isArray(this.popoverTriggers)) {
				return this.popoverTriggers
			}
			return undefined
		},
		popperHideTriggers() {
			if (this.popoverTriggers && typeof this.popoverTriggers === 'object') {
				return this.popoverTriggers.hide
			}
			return undefined
		},
		popperShowTriggers() {
			if (this.popoverTriggers && typeof this.popoverTriggers === 'object') {
				return this.popoverTriggers.show
			}
			return undefined
		},

		internalTriggers() {
			if (this.triggers && Array.isArray(this.triggers)) {
				return this.triggers
			}
			return undefined
		},
		hideTriggers() {
			if (this.triggers && typeof this.triggers === 'object') {
				return this.triggers.hide
			}
			return undefined
		},
		showTriggers() {
			if (this.triggers && typeof this.triggers === 'object') {
				return this.triggers.show
			}
			return undefined
		},

		internalPlacement() {
			if (this.placement === 'start') {
				return isRtl ? 'right' : 'left'
			} else if (this.placement === 'end') {
				return isRtl ? 'left' : 'right'
			}
			return this.placement
		},
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

	beforeUnmount() {
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
					warn('It looks like you are using a custom button as a <NcPopover> or other popover #trigger. If you are not using <NcButton> as a trigger, you need to bind attrs from the #trigger slot props to your custom button. See <NcPopover> docs for an example.')
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
			return this.$refs.popover?.$refs.popper?.$refs.reference
		},

		/**
		 * Add focus trap for accessibility.
		 */
		async useFocusTrap() {
			await this.$nextTick()

			if (this.noFocusTrap) {
				return
			}

			const el = this.getPopoverContentElement()
			el.tabIndex = -1

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
				fallBackFocus: el,
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
			this.getPopoverContentElement().addEventListener('transitionend', () => {
				/**
				 * Triggered after the tooltip was visually displayed.
				 *
				 * This is different from the 'show' and 'apply-show' which
				 * run earlier than this where there is no guarantee that the
				 * tooltip is already visible and in the DOM.
				 */
				this.$emit('afterShow')
			}, { once: true, passive: true })

			this.removeFloatingVueAriaDescribedBy()

			await this.$nextTick()
			await this.useFocusTrap()
			this.addEscapeStopPropagation()
		},
		afterHide() {
			this.getPopoverContentElement().addEventListener('transitionend', () => {
				/**
				 * Triggered after the tooltip was visually hidden.
				 *
				 * This is different from the 'hide' and 'apply-hide' which
				 * run earlier than this where there is no guarantee that the
				 * tooltip is already visible and in the DOM.
				 */
				this.$emit('afterHide')
			}, { once: true, passive: true })

			this.clearFocusTrap()
			this.clearEscapeStopPropagation()
		},
	},
}
</script>

<style lang="scss">
$arrow-width: 10px;
// Move the arrow just slightly inside the popover
// To prevent a visual gap on page scaling
$arrow-position: $arrow-width - 1px;

// Size class comes from the floating-vue library we use
.resize-observer {
	position: absolute;
	top: 0;
	/* stylelint-disable-next-line csstools/use-logical */ /* upstream logic */
	left: 0;
	z-index: -1;
	width: 100%;
	height: 100%;
	border: none;
	background-color: transparent;
	pointer-events: none;
	display: block;
	overflow: hidden;
	opacity: 0;

	object {
		display: block;
		position: absolute;
		top: 0;
		/* stylelint-disable-next-line csstools/use-logical */ /* upstream logic */
		left: 0;
		height: 100%;
		width: 100%;
		overflow: hidden;
		pointer-events: none;
		z-index: -1;
	}
}

.v-popper--theme-dropdown {
	&,
	& * {
		box-sizing: border-box;
	}

	&.v-popper__popper {
		z-index: 100000;
		top: 0;
		/* stylelint-disable-next-line csstools/use-logical */ /* upstream logic */
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
			/* stylelint-disable-next-line csstools/use-logical */ /* upstream logic */
			border-bottom-width: 0;
			/* stylelint-disable-next-line csstools/use-logical */ /* upstream logic */
			border-top-color: var(--color-main-background);
		}

		&[data-popper-placement^='bottom'] .v-popper__arrow-container {
			top: -$arrow-position;
			/* stylelint-disable-next-line csstools/use-logical */ /* upstream logic */
			border-top-width: 0;
			/* stylelint-disable-next-line csstools/use-logical */ /* upstream logic */
			border-bottom-color: var(--color-main-background);
		}

		&[data-popper-placement^='right'] .v-popper__arrow-container {
			/* stylelint-disable-next-line csstools/use-logical */ /* upstream logic */
			left: -$arrow-position;
			/* stylelint-disable-next-line csstools/use-logical */ /* upstream logic */
			border-left-width: 0;
			/* stylelint-disable-next-line csstools/use-logical */ /* upstream logic */
			border-right-color: var(--color-main-background);
		}

		&[data-popper-placement^='left'] .v-popper__arrow-container {
			/* stylelint-disable-next-line csstools/use-logical */ /* upstream logic */
			right: -$arrow-position;
			/* stylelint-disable-next-line csstools/use-logical */ /* upstream logic */
			border-right-width: 0;
			/* stylelint-disable-next-line csstools/use-logical */ /* upstream logic */
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
