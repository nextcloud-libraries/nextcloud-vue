<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
For showing the modal you can use either `:show.sync="showModal"` or `v-if` on the `NcModal`,
depending on whether you require the Modal to stay within the DOM or not. Do not mix both, as this will break the out transition animation.

```vue
<template>
	<div>
		<NcButton @click="showModal">Show Modal</NcButton>
		<NcModal
			:show.sync="modal"
			@close="closeModal"
			size="small"
			name="Name"
			:outTransition="true"
			:hasNext="true"
			:hasPrevious="true">
			<template #actions>
				<NcActionCaption name="Some action" />
			</template>
			<div class="modal__content">Hello world</div>
		</NcModal>
	</div>
</template>
<script>
export default {
	data() {
		return {
			modal: false
		}
	},
	methods: {
		showModal() {
			this.modal = true
		},
		closeModal() {
			this.modal = false
		}
	}
}
</script>
<style scoped>
.modal__content {
	margin: 50px;
	text-align: center;
}
</style>
```

### Modal with more properties

```vue
<template>
	<div>
		<NcButton @click="showModal">Show Modal with fields</NcButton>
		<NcModal
			v-if="modal"
			ref="modalRef"
			@close="closeModal"
			name="Name inside modal">
			<div class="modal__content">
				<h2>Please enter your name</h2>
				<div class="form-group">
					<NcTextField label="First Name" :value.sync="firstName" />
				</div>
				<div class="form-group">
					<NcTextField label="Last Name" :value.sync="lastName" />
				</div>
				<div class="form-group">
					<label for="pizza">What is the most important pizza item?</label>
					<NcSelect input-id="pizza" :options="['Cheese', 'Tomatoes', 'Pineapples']" v-model="pizza" />
				</div>
				<div class="form-group">
					<label for="emoji-trigger">Select your favorite emoji</label>
					<NcEmojiPicker v-if="modalRef" :container="modalRef.$el">
						<NcButton id="emoji-trigger">Select</NcButton>
					</NcEmojiPicker>
				</div>

				<NcButton
					:disabled="!firstName || !lastName || !pizza"
					@click="closeModal"
					type="primary">
					Submit
				</NcButton>
			</div>
		</NcModal>
	</div>
</template>
<script>
import { ref } from 'vue'

export default {
	setup() {
		return {
			modalRef: ref(null),
		}
	},
	data() {
		return {
			modal: false,
			firstName: '',
			lastName: '',
			pizza: [],
		}
	},
	methods: {
		showModal() {
			this.firstName = ''
			this.lastName = ''
			this.modal = true
		},
		closeModal() {
			this.modal = false
		}
	}
}
</script>
<style scoped>
.modal__content {
	margin: 50px;
}

.modal__content h2 {
	text-align: center;
}

.form-group {
	margin: calc(var(--default-grid-baseline) * 4) 0;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}
</style>
```

### Usage of popover in modal

* Set container property to .modal-mask to inject popover context of the modal:

```vue
<template>
	<div>
		<NcButton @click="showModal">Show Modal</NcButton>
		<NcModal v-if="modal" @close="closeModal" size="small" class="emoji-modal">
			<NcEmojiPicker container=".emoji-modal" @select="select">
				<NcButton>Select emoji {{ emoji }}</NcButton>
			</NcEmojiPicker>
		</NcModal>
	</div>
</template>
<script>
export default {
	data() {
		return {
			emoji: '😛',
			modal: false
		}
	},
	methods: {
		showModal() {
			this.modal = true
		},
		closeModal() {
			this.modal = false
		},
		select(emoji) {
			this.emoji = emoji
		},
	},
}
</script>
<style scoped>
.modal__content {
	margin: 50px;
	text-align: center;
}
</style>
```
</docs>

<template>
	<transition name="fade"
		appear
		@after-enter="useFocusTrap"
		@before-leave="clearFocusTrap">
		<div v-show="showModal"
			ref="mask"
			class="modal-mask"
			:class="{
				'modal-mask--opaque': dark || !closeButtonContained || hasPrevious || hasNext,
				'modal-mask--light': lightBackdrop,
			}"
			:style="cssVariables"
			role="dialog"
			aria-modal="true"
			:aria-labelledby="modalLabelId"
			:aria-describedby="'modal-description-' + randId"
			tabindex="-1">
			<!-- Header -->
			<transition name="fade-visibility" appear>
				<div class="modal-header"
					:data-theme-light="lightBackdrop"
					:data-theme-dark="!lightBackdrop">
					<h2 v-if="name.trim() !== ''"
						:id="'modal-name-' + randId"
						class="modal-header__name">
						{{ name }}
					</h2>
					<div class="icons-menu">
						<!-- Play-pause toggle -->
						<button v-if="hasNext && enableSlideshow"
							v-tooltip.auto="playPauseName"
							:class="{ 'play-pause-icons--paused': slideshowPaused }"
							class="play-pause-icons"
							type="button"
							@click="togglePlayPause">
							<!-- Play/pause icons -->
							<Play v-if="!playing"
								:size="iconSize"
								class="play-pause-icons__play" />
							<Pause v-else
								:size="iconSize"
								class="play-pause-icons__pause" />
							<span class="hidden-visually">
								{{ playPauseName }}
							</span>

							<!-- Progress circle, css animated -->
							<svg v-if="playing"
								class="progress-ring"
								height="50"
								width="50">
								<circle class="progress-ring__circle"
									stroke="white"
									stroke-width="2"
									fill="transparent"
									r="15"
									cx="25"
									cy="25" />
							</svg>
						</button>

						<!-- Actions menu -->
						<NcActions class="header-actions" :inline="inlineActions">
							<!-- @slot Actions to show (one or more NcAction* components) -->
							<slot name="actions" />
						</NcActions>

						<!-- Close modal -->
						<NcButton v-if="canClose && !closeButtonContained"
							:aria-label="closeButtonAriaLabel"
							class="header-close"
							type="tertiary"
							@click="close">
							<template #icon>
								<Close :size="iconSize" />
							</template>
						</NcButton>
					</div>
				</div>
			</transition>

			<!-- Content wrapper -->
			<transition :name="modalTransitionName" appear>
				<div v-show="showModal"
					:class="[
						`modal-wrapper--${size}`,
						{ 'modal-wrapper--spread-navigation': spreadNavigation },
					]"
					class="modal-wrapper"
					@mousedown.self="handleClickModalWrapper">
					<!-- Navigation button -->
					<transition name="fade-visibility" appear>
						<NcButton v-show="hasPrevious"
							type="tertiary-no-background"
							class="prev"
							:aria-label="prevButtonAriaLabel"
							@click="previous">
							<template #icon>
								<ChevronLeft :size="40" />
							</template>
						</NcButton>
					</transition>

					<!-- Content -->
					<div :id="'modal-description-' + randId" class="modal-container">
						<div class="modal-container__content">
							<!-- @slot Modal content to render -->
							<slot />
						</div>
						<!-- Close modal -->
						<NcButton v-if="canClose && closeButtonContained"
							type="tertiary"
							class="modal-container__close"
							:aria-label="closeButtonAriaLabel"
							@click="close">
							<template #icon>
								<Close :size="20" />
							</template>
						</NcButton>
					</div>

					<!-- Navigation button -->
					<transition name="fade-visibility" appear>
						<NcButton v-show="hasNext"
							type="tertiary-no-background"
							class="next"
							:aria-label="nextButtonAriaLabel"
							@click="next">
							<template #icon>
								<ChevronRight :size="40" />
							</template>
						</NcButton>
					</transition>
				</div>
			</transition>
		</div>
	</transition>
</template>

<script>
import { useSwipe } from '@vueuse/core'
import { createFocusTrap } from 'focus-trap'
import Vue from 'vue'

import { getTrapStack } from '../../utils/focusTrap.js'
import { t } from '../../l10n.js'
import GenRandomId from '../../utils/GenRandomId.js'
import NcActions from '../NcActions/index.js'
import NcButton from '../../components/NcButton/index.js'
import Timer from '../../utils/Timer.js'
import Tooltip from '../../directives/Tooltip/index.js'

import ChevronLeft from 'vue-material-design-icons/ChevronLeft.vue'
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue'
import Close from 'vue-material-design-icons/Close.vue'
import Pause from 'vue-material-design-icons/Pause.vue'
import Play from 'vue-material-design-icons/Play.vue'

export default {
	name: 'NcModal',

	components: {
		NcActions,
		ChevronLeft,
		ChevronRight,
		Close,
		Pause,
		Play,
		NcButton,
	},

	directives: {
		tooltip: Tooltip,
	},

	props: {
		/**
		 * Name to be shown with the modal
		 */
		name: {
			type: String,
			default: '',
		},
		/**
		 * Declare if a previous slide is available
		 */
		hasPrevious: {
			type: Boolean,
			default: false,
		},
		/**
		 * Declare if a next slide is available
		 */
		hasNext: {
			type: Boolean,
			default: false,
		},
		/**
		 * Declare if hiding the modal should be animated
		 */
		outTransition: {
			type: Boolean,
			default: false,
		},
		/**
		 * Declare if the slideshow functionality should be enabled
		 */
		enableSlideshow: {
			type: Boolean,
			default: false,
		},
		/**
		 * Declare the slide interval
		 */
		slideshowDelay: {
			type: Number,
			default: 5000,
		},
		/**
		 * Allow to pause an ongoing slideshow
		 */
		slideshowPaused: {
			type: Boolean,
			default: false,
		},
		/**
		 * Enable swipe between slides
		 */
		enableSwipe: {
			type: Boolean,
			default: true,
		},
		spreadNavigation: {
			type: Boolean,
			default: false,
		},
		/**
		 * Defines the modal size.
		 * Default is 'normal'.
		 * Available are 'small', 'normal', 'large' and 'full'.
		 * All sizes except 'small' change automatically to full-screen on mobile.
		 */
		size: {
			type: String,
			default: 'normal',
			validator: size => {
				return ['small', 'normal', 'large', 'full'].includes(size)
			},
		},

		/**
		 * Declare if the modal can be closed
		 */
		canClose: {
			type: Boolean,
			default: true,
		},

		/**
		 * Close the modal if the user clicked outside the modal
		 * Only relevant if `canClose` is set to true.
		 */
		closeOnClickOutside: {
			type: Boolean,
			default: true,
		},

		/**
		 * Makes the modal backdrop opaque if true
		 * Will be overwritten if some buttons are shown outside
		 */
		dark: {
			type: Boolean,
			default: false,
		},

		/**
		 * Set light backdrop. Makes the modal header appear light.
		 */
		lightBackdrop: {
			type: Boolean,
			default: false,
		},

		/**
		 * Selector for the modal container, pass `null` to prevent automatic container mounting
		 */
		container: {
			type: [String, null],
			default: 'body',
		},

		/**
		 * Pass in false if you want the modal 'close' button to be displayed
		 * outside the modal boundaries, in the top right corner of the window
		 */
		closeButtonContained: {
			type: Boolean,
			default: true,
		},

		/**
		 * Additional elements to add to the focus trap
		 */
		additionalTrapElements: {
			type: Array,
			default: () => [],
		},

		/**
		 * Display x items inline
		 *
		 * @see Actions component usage
		 */
		inlineActions: {
			type: Number,
			default: 0,
		},

		show: {
			type: Boolean,
			default: undefined,
		},

		/**
		 * Id of the element that labels the dialog (the name)
		 * Not needed if the `name` prop is set, but if no name is set you need to provide the ID of an element to label the dialog for accessibility.
		 */
		labelId: {
			type: String,
			default: '',
		},

		/**
		 * Set element to return focus to after focus trap deactivation
		 *
		 * @type {import('focus-trap').FocusTargetValueOrFalse}
		 */
		setReturnFocus: {
			default: undefined,
			type: [HTMLElement, SVGElement, String, Boolean],
		},
	},

	emits: [
		'previous',
		'next',
		'close',
		'update:show',
	],

	data() {
		return {
			mc: null,
			playing: false,
			slideshowTimeout: null,
			iconSize: 24,
			focusTrap: null,
			externalFocusTrapStack: [],
			randId: GenRandomId(),
			internalShow: true,
		}
	},

	computed: {
		/**
		 * ID of the element to label the modal
		 */
		modalLabelId() {
			return this.labelId || `modal-name-${this.randId}`
		},

		showModal() {
			return (this.show === undefined) ? this.internalShow : this.show
		},
		modalTransitionName() {
			return `modal-${this.outTransition ? 'out' : 'in'}`
		},
		playPauseName() {
			return this.playing ? t('Pause slideshow') : t('Start slideshow')
		},
		cssVariables() {
			return {
				'--slideshow-duration': this.slideshowDelay + 'ms',
				'--icon-size': this.iconSize + 'px',
			}
		},

		closeButtonAriaLabel() {
			return t('Close')
		},
		prevButtonAriaLabel() {
			return t('Previous')
		},
		nextButtonAriaLabel() {
			return t('Next')
		},
	},

	watch: {
		/**
		 * Handle play/pause of an ongoing slideshow
		 *
		 * @param {boolean} paused is the player paused
		 */
		slideshowPaused(paused) {
			if (this.slideshowTimeout) {
				if (paused) {
					this.slideshowTimeout.pause()
				} else {
					this.slideshowTimeout.start()
				}
			}
		},
		additionalTrapElements(elements) {
			if (this.focusTrap) {
				const contentContainer = this.$refs.mask
				this.focusTrap.updateContainerElements([contentContainer, ...elements])
			}
		},
	},

	beforeMount() {
		window.addEventListener('keydown', this.handleKeydown)
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.handleKeydown)
		this.mc.stop()
	},
	mounted() {
		if (!this.name && !this.labelId) {
			Vue.util.warn('[NcModal] You need either set the name or set a `labelId` for accessibility.')
		}

		// init clear view
		this.useFocusTrap()
		this.mc = useSwipe(this.$refs.mask, {
			onSwipeEnd: this.handleSwipe,
		})

		if (this.container) {
			if (this.container === 'body') {
				// force mount the component to body
				document.body.insertBefore(this.$el, document.body.lastChild)
			} else {
				const container = document.querySelector(this.container)
				container.appendChild(this.$el)
			}
		}
	},
	destroyed() {
		this.clearFocusTrap()
		this.$el.remove()
	},

	methods: {
		t,

		// Events emitters
		previous(event) {
			// do not send the event if nothing is available
			if (this.hasPrevious) {
				// if data is set, then it's a user mouse event
				// and not the slideshow handler, therefore
				// we reset the timer
				if (event) {
					this.resetSlideshow()
				}
				this.$emit('previous', event)
			}
		},
		next(event) {
			// do not send the event if nothing is available
			if (this.hasNext) {
				// if data is set, then it's a mouse event
				// and not the slideshow handler, therefore
				// we reset the timer
				if (event) {
					this.resetSlideshow()
				}
				this.$emit('next', event)
			}
		},
		close(data) {
			// do not fire event if forbidden
			if (this.canClose) {
				// We set internalShow here, so the out transitions properly run before the component is destroyed
				this.internalShow = false
				this.$emit('update:show', false)

				// delay closing for animation
				setTimeout(() => {
					/**
					 * Emitted when the closing animation is finished
					 */
					this.$emit('close', data)
				}, 300)
			}
		},

		/**
		 * Handle click on modal wrapper
		 * If `closeOnClickOutside` is set the modal will be closed
		 *
		 * @param {MouseEvent} event The click event
		 */
		handleClickModalWrapper(event) {
			if (this.closeOnClickOutside) {
				this.close(event)
			}
		},

		/**
		 * @param {KeyboardEvent} event - keyboard event
		 */
		handleKeydown(event) {
			if (event.key === 'Escape') {
				const trapStack = getTrapStack()
				// Only close the most recent focus trap modal
				if (trapStack.length > 0 && trapStack[trapStack.length - 1] !== this.focusTrap) {
					return
				}
				return this.close(event)
			}

			const arrowHandlers = {
				ArrowLeft: this.previous,
				ArrowRight: this.next,
			}
			if (arrowHandlers[event.key]) {
				// Ignore arrow navigation, if there is a current focus outside the modal.
				// For example, when the focus is in Sidebar or NcActions' items,
				// arrow navigation should not be intercepted by modal slider
				if (document.activeElement && !this.$el.contains(document.activeElement)) {
					return
				}
				return arrowHandlers[event.key](event)
			}
		},

		/**
		 * handle the swipe event
		 *
		 * @param {TouchEvent} e The touch event
		 * @param {import('@vueuse/core').SwipeDirection} direction Swipe direction
		 */
		handleSwipe(e, direction) {
			if (this.enableSwipe) {
				if (direction === 'left') {
					// swiping to left to go to the next item
					this.next(e)
				} else if (direction === 'right') {
					// swiping to right to go back to the previous item
					this.previous(e)
				}
			}
		},

		/**
		 * Toggle the slideshow state
		 */
		togglePlayPause() {
			this.playing = !this.playing
			if (this.playing) {
				this.handleSlideshow()
			} else {
				this.clearSlideshowTimeout()
			}
		},

		/**
		 * Reset the slideshow timer and keep going if it was on
		 */
		resetSlideshow() {
			this.playing = !this.playing
			this.clearSlideshowTimeout()
			this.$nextTick(function() {
				this.togglePlayPause()
			})
		},

		/**
		 * Handle the slideshow timer and next event
		 */
		handleSlideshow() {
			this.playing = true
			if (this.hasNext) {
				this.slideshowTimeout = new Timer(() => {
					this.next()
					this.handleSlideshow()
				}, this.slideshowDelay)
			} else {
				this.playing = false
				this.clearSlideshowTimeout()
			}
		},

		/**
		 * Clear slideshowTimeout if ongoing
		 */
		clearSlideshowTimeout() {
			if (this.slideshowTimeout) {
				this.slideshowTimeout.clear()
			}
		},
		/**
		 * Add focus trap for accessibility.
		 */
		async useFocusTrap() {
			// Don't do anything if the modal is hidden,
			// or we have a focus trap already
			if (!this.showModal || this.focusTrap) {
				return
			}

			const contentContainer = this.$refs.mask
			// wait until all children are mounted and available in the DOM before focusTrap can be added
			await this.$nextTick()

			const options = {
				allowOutsideClick: true,
				fallbackFocus: contentContainer,
				trapStack: getTrapStack(),
				// Esc can be used without stop in content or additionalTrapElements where it should not deactivate modal's focus trap.
				// Focus trap is deactivated on modal close anyway.
				escapeDeactivates: false,
				setReturnFocus: this.setReturnFocus,
			}

			// Deactivate other focus traps to unlock modal elements
			this.externalFocusTrapStack = [...options.trapStack]
			for (const trap of this.externalFocusTrapStack) {
				trap.deactivate()
			}
			// Init focus trap
			this.focusTrap = createFocusTrap([contentContainer, ...this.additionalTrapElements], options)
			this.focusTrap.activate()
		},
		clearFocusTrap() {
			if (!this.focusTrap) {
				return
			}
			this.focusTrap?.deactivate()
			this.focusTrap = null
			for (const trap of this.externalFocusTrapStack) {
				trap.activate()
			}
			this.externalFocusTrapStack = []
		},

	},
}
</script>

<style lang="scss" scoped>

.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	display: block;
	width: 100%;
	height: 100%;
	--backdrop-color: 0, 0, 0;
	background-color: rgba(var(--backdrop-color), .5);
	&--opaque {
		background-color: rgba(var(--backdrop-color), .92);
	}
	&--light {
		--backdrop-color: 255, 255, 255;
	}
}

.modal-header {
	position: absolute;
	z-index: 10001;
	top: 0;
	right: 0;
	left: 0;
	// prevent vue show to use display:none and resetting
	// the circle animation loop
	display: flex !important;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: var(--header-height);
	overflow: hidden;
	transition: opacity 250ms, visibility 250ms;

	&__name {
		overflow-x: hidden;
		box-sizing: border-box;
		width: 100%;
		padding: 0 calc(var(--default-clickable-area) * 3) 0 12px; // maximum actions is 3
		transition: padding ease 100ms;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: $icon-size;
		margin-block: 0;
	}

	// On wider screens the name can be centered
	@media only screen and (min-width: $breakpoint-mobile) {
		&__name {
			padding-left: calc(var(--default-clickable-area) * 3); // maximum actions is 3
			text-align: center;
		}
	}

	.icons-menu {
		position: absolute;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		.header-close {
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			margin: calc((var(--header-height) - var(--default-clickable-area)) / 2);
			padding: 0;
		}

		.play-pause-icons {
			position: relative;
			width: var(--header-height);
			height: var(--header-height);
			margin: 0;
			padding: 0;
			cursor: pointer;
			border: none;
			background-color: transparent;
			&:hover,
			&:focus {
				.play-pause-icons__play,
				.play-pause-icons__pause {
					opacity: $opacity_full;
					border-radius: calc(var(--default-clickable-area) / 2);
					background-color: $icon-focus-bg;
				}
			}
			&__play,
			&__pause {
				box-sizing: border-box;
				width: var(--default-clickable-area);
				height: var(--default-clickable-area);
				margin: calc((var(--header-height) - var(--default-clickable-area)) / 2);
				cursor: pointer;
				opacity: $opacity_normal;
			}
		}

		&:deep() .action-item {
			margin: calc((var(--header-height) - var(--default-clickable-area)) / 2);

			&--single {
				box-sizing: border-box;
				width: var(--default-clickable-area);
				height: var(--default-clickable-area);
				cursor: pointer;
				background-position: center;
				background-size: 22px;
			}
		}

		// The modal ignores the color theme and adds a black backdrop
		// so we need to add custom color of the actions toggle
		.header-actions :deep(button:focus-visible) {
			box-shadow: none !important;
			outline: 2px solid #fff !important;
		}

		// Force the Actions menu icon to be the same size as other icons
		&:deep(.action-item__menutoggle) {
			padding: 0;
			span, svg {
				width: var(--icon-size);
				height: var(--icon-size);
			}
		}
	}
}

.modal-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	width: 100%;
	height: 100%;

	/* Navigation buttons */
	.prev,
	.next {
		z-index: 10000;
		height: 35vh;
		min-height: 300px;
		position: absolute;
		transition: opacity 250ms;
		// hover the mask
		color: white;

		&:focus-visible {
			// Override NcButton focus styles
			box-shadow: 0 0 0 2px var(--color-primary-element-text);
			background-color: var(--color-box-shadow);
		}
	}

	.prev {
		left: 2px;
	}
	.next {
		right: 2px;
	}

	/* Content */
	.modal-container {
		position: relative;
		display: flex;
		padding: 0;
		transition: transform 300ms ease;
		border-radius: var(--border-radius-large);
		background-color: var(--color-main-background);
		color: var(--color-main-text);
		box-shadow: 0 0 40px rgba(0, 0, 0, .2);

		&__close {
			// Ensure the close button is always on top of the content
			z-index: 1;
			position: absolute;
			top: 4px;
			inset-inline-end: var(--default-grid-baseline);
		}

		&__content {
			width: 100%;
			min-height: 52px; // At least the close button shall fit in
			overflow: auto; // avoids unnecessary hacks if the content should be bigger than the modal
		}
	}

	// We allow 90% max-height, but we need to ensure the header does not overlap the modal
	// as the modal is centered, we need the space on top and bottom
	$max-modal-height: min(90%, calc(100% - 2 * var(--header-height)));

	// Sizing
	&--small {
		& > .modal-container {
			width: 400px;
			max-width: 90%;
			max-height: $max-modal-height;
		}
	}
	&--normal {
		& > .modal-container {
			max-width: 90%;
			width: 600px;
			max-height: $max-modal-height;
		}
	}
	&--large {
		& > .modal-container {
			max-width: 90%;
			width: 900px;
			max-height: $max-modal-height;
		}
	}
	&--full {
		& > .modal-container {
			width: 100%;
			height: calc(100% - var(--header-height));
			position: absolute;
			top: var(--header-height);
			border-radius: 0;
		}
	}

	// Make modal full screen on mobile
	@media only screen and ((max-width: $breakpoint-small-mobile) or (max-height: 400px)) {
		.modal-container {
			max-width: initial;
			width: 100%;
			max-height: initial;
			height: calc(100% - var(--header-height));
			position: absolute;
			top: var(--header-height);
			border-radius: 0;
		}
	}
}

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 250ms;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.fade-visibility-enter,
.fade-visibility-leave-to {
	visibility: hidden;
	opacity: 0;
}

.modal-in-enter-active,
.modal-in-leave-active,
.modal-out-enter-active,
.modal-out-leave-active {
	transition: opacity 250ms;
}

.modal-in-enter,
.modal-in-leave-to,
.modal-out-enter,
.modal-out-leave-to {
	opacity: 0;
}

.modal-in-enter .modal-container,
.modal-in-leave-to .modal-container {
	transform: scale(.9);
}

.modal-out-enter .modal-container,
.modal-out-leave-to .modal-container {
	transform: scale(1.1);
}

// animated circle
$radius: 15;
$pi: 3.14159265358979;

.modal-mask .play-pause-icons {
	.progress-ring {
		position: absolute;
		top: 0;
		left: 0;
		transform: rotate(-90deg);
		.progress-ring__circle {
			transition: 100ms stroke-dashoffset;
			transform-origin: 50% 50%; // axis compensation
			animation: progressring linear var(--slideshow-duration) infinite;

			stroke-linecap: round;
			stroke-dashoffset: $radius * 2 * $pi; // radius * 2 * PI
			stroke-dasharray: $radius * 2 * $pi; // radius * 2 * PI
		}
	}
	&--paused {
		.icon-pause {
			animation: breath 2s cubic-bezier(.4, 0, .2, 1) infinite;
		}
		.progress-ring__circle {
			animation-play-state: paused !important;
		}
	}
}

// keyframes get scoped too and break the animation name, we need them unscoped
@keyframes progressring {
	from {
		stroke-dashoffset: $radius * 2 * $pi; // radius * 2 * PI
	}
	to {
		stroke-dashoffset: 0;
	}
}

@keyframes breath {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

</style>
