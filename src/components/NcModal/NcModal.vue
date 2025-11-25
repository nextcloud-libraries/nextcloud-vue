<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { UseSwipeDirection } from '@vueuse/core'
import type { FocusTargetValueOrFalse, FocusTrap, Options as FocusTrapOptions } from 'focus-trap'
import type { Slot } from 'vue'

import { mdiChevronLeft, mdiChevronRight, mdiClose, mdiPause, mdiPlay } from '@mdi/js'
import { useIntervalFn, useSwipe } from '@vueuse/core'
import { createFocusTrap } from 'focus-trap'
import { computed, nextTick, onMounted, onUnmounted, ref, toRef, useTemplateRef, warn, watch, watchEffect } from 'vue'
import NcActions from '../NcActions/NcActions.vue'
import NcButton from '../NcButton/NcButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { useHotKey } from '../../composables/index.ts'
import { t } from '../../l10n.ts'
import { createElementId } from '../../utils/createElementId.ts'
import { getTrapStack } from '../../utils/focusTrap.ts'
import { isRtl } from '../../utils/rtl.ts'

const props = withDefaults(defineProps<{
	/**
	 * Name to be shown with the modal
	 */
	name?: string

	/**
	 * Declare if a previous slide is available
	 */
	hasPrevious?: boolean

	/**
	 * Declare if a next slide is available
	 */
	hasNext?: boolean

	/**
	 * Declare if hiding the modal should be animated
	 */
	outTransition?: boolean

	/**
	 * Declare if the slideshow functionality should be enabled
	 */
	enableSlideshow?: boolean

	/**
	 * Declare the slide interval
	 */
	slideshowDelay?: number

	/**
	 * Allow to pause an ongoing slideshow
	 */
	slideshowPaused?: boolean

	/**
	 * Disable swipe between slides
	 */
	disableSwipe?: boolean

	/**
	 * Enable spread navigation
	 */
	spreadNavigation?: boolean

	/**
	 * Defines the modal size.
	 * All sizes except 'small' change automatically to full-screen on mobile.
	 */
	size?: 'small' | 'normal' | 'large' | 'full'

	/**
	 * Do not show the close button for the dialog.
	 */
	noClose?: boolean

	/**
	 * Close the modal if the user clicked outside the modal
	 * Only relevant if `noClose` is not set.
	 */
	closeOnClickOutside?: boolean

	/**
	 * Makes the modal backdrop opaque if true
	 * Will be overwritten if some buttons are shown outside
	 */
	dark?: boolean

	/**
	 * Set light backdrop. Makes the modal header appear light.
	 */
	lightBackdrop?: boolean

	/**
	 * Selector for the modal container, pass `null` to prevent automatic container mounting
	 */
	container?: string | null

	/**
	 * Pass in `true` if you want the modal 'close' button to be displayed
	 * outside the modal boundaries, in the top right corner of the window.
	 *
	 * @since 8.25.0
	 */
	closeButtonOutside?: boolean

	/**
	 * Additional elements to add to the focus trap
	 */
	additionalTrapElements?: (string | HTMLElement)[]

	/**
	 * Display x items inline
	 *
	 * @see NcActions component usage
	 */
	inlineActions?: number

	/**
	 * The current open property of the modal
	 */
	show?: boolean | undefined

	/**
	 * Id of the element that labels the dialog (the name)
	 * Not needed if the `name` prop is set, but if no name is set you need to provide the ID of an element to label the dialog for accessibility.
	 */
	labelId?: string

	/**
	 * Set element to return focus to after focus trap deactivation
	 */
	setReturnFocus?: FocusTargetValueOrFalse
}>(), {
	additionalTrapElements: () => [],
	container: 'body',
	inlineActions: 0,
	labelId: '',
	slideshowDelay: 5000,
	size: 'normal',
	name: '',
	show: undefined,
	setReturnFocus: undefined,
})

const emit = defineEmits<{
	/**
	 * Trigger showing the next slide.
	 *
	 * @param payload - The event that triggered showing the next slide
	 */
	next: [payload?: Event]

	/**
	 * Trigger showing the previous slide.
	 *
	 * @param payload - The event that triggered showing the previous slide
	 */
	previous: [payload?: Event]

	/**
	 * Emitted when the closing animation is finished
	 *
	 * @param payload - The event that triggered the close
	 */
	close: [payload?: Event]

	/**
	 * @param payload - The new show-state
	 */
	'update:show': [payload: boolean]
}>()

defineSlots<{
	/**
	 * Actions to show (one or more NcAction* components)
	 */
	actions?: Slot

	/**
	 * The modal content to show.
	 */
	default?: Slot
}>()

const modalId = createElementId()
const maskElement = useTemplateRef<HTMLDivElement>('mask')

const internalShow = ref(true)
const showModal = computed(() => props.show ?? internalShow.value)

// Set up the focus trap
let focusTrap: FocusTrap | undefined
onMounted(() => useFocusTrap())
onUnmounted(() => clearFocusTrap())
watch(() => props.additionalTrapElements, (elements) => {
	if (focusTrap) {
		focusTrap.updateContainerElements([maskElement.value!, ...elements])
	}
})

// Set up the slideshow
const {
	isActive: isPlaying,
	pause: stopSlideshow,
	resume: startSlideshow,
} = useIntervalFn(nextSlide, toRef(() => props.slideshowDelay), { immediate: false })

const animationKey = ref(0)
const runSlideshow = ref(false)
watchEffect(() => {
	if (runSlideshow.value && !props.slideshowPaused) {
		startSlideshow()
	} else if (isPlaying.value) {
		stopSlideshow()
	}
})

const cssSlideshowDelay = computed(() => `${props.slideshowDelay}ms`)

// Setup swipe navigation
const { stop: stopSwipe } = useSwipe(maskElement, {
	onSwipeEnd: handleSwipe,
})
onUnmounted(stopSwipe)

// Setup hotkeys (keyboard navigation)
useHotKey('Escape', () => {
	const trapStack = getTrapStack()
	// Only close the most recent focus trap modal
	if (trapStack.length === 0 || trapStack[trapStack.length - 1] === focusTrap) {
		close()
	}
})

useHotKey(['ArrowLeft', 'ArrowRight'], (event) => {
	// Ignore arrow navigation, if there is a current focus outside the modal.
	// For example, when the focus is in Sidebar or NcActions' items,
	// arrow navigation should not be intercepted by modal slider
	if (document.activeElement && !maskElement.value!.contains(document.activeElement)) {
		return
	}

	if ((event.key === 'ArrowLeft') !== isRtl) {
		previousSlide()
	} else {
		nextSlide()
	}
})

// for developers we should add a warning if used with invalid props combination
onMounted(() => {
	if (!props.name && !props.labelId) {
		warn('[NcModal] You need either set the name or set a `labelId` for accessibility.')
	}
})

/**
 * Trigger showing the next slide
 *
 * @param event - The mouse click event if triggered by user
 */
function nextSlide(event?: Event) {
	if (!props.hasNext) {
		runSlideshow.value = false
		// do not send the event if nothing is available
		return
	}

	if (event && isPlaying.value) {
		restartSlideshow()
	}
	emit('next', event)
}

/**
 * Trigger showing the previous slide
 *
 * @param event - The mouse click event if triggered by user
 */
function previousSlide(event?: Event) {
	if (!props.hasPrevious) {
		// do not send the event if nothing is available
		return
	}

	if (event && isPlaying.value) {
		restartSlideshow()
	}
	emit('previous', event)
}

/**
 * handle the swipe event
 *
 * @param e - The touch event
 * @param direction - Swipe direction
 */
function handleSwipe(e: TouchEvent, direction: UseSwipeDirection) {
	if (!props.disableSwipe) {
		if (direction !== 'left' && direction !== 'right') {
			return
		}

		if ((direction === 'left') !== isRtl) {
			nextSlide(e)
		} else {
			previousSlide(e)
		}
	}
}

/**
 * Reset the slideshow interval and animation
 */
function restartSlideshow() {
	stopSlideshow()
	startSlideshow()
	animationKey.value++
}

/**
 * Handle closing the modal.
 *
 * @param event - The event that triggered closing the modal
 */
function close(event?: Event) {
	// do not fire event if forbidden
	if (props.noClose) {
		return
	}

	// We set internalShow here, so the out transitions properly run before the component is destroyed
	internalShow.value = false
	emit('update:show', false)

	// delay closing for animation
	setTimeout(() => {
		emit('close', event)
	}, 300)
}

/**
 * Handle click on modal wrapper
 * If `closeOnClickOutside` is set the modal will be closed
 *
 * @param event - The click event
 */
function handleClickModalWrapper(event: MouseEvent) {
	if (props.closeOnClickOutside) {
		close(event)
	}
}

/**
 * Add focus trap for accessibility.
 */
async function useFocusTrap() {
	// Don't do anything if the modal is hidden,
	// or we have a focus trap already
	if (!showModal.value || focusTrap) {
		return
	}

	// wait until all children are mounted and available in the DOM before focusTrap can be added
	await nextTick()

	const options: FocusTrapOptions = {
		allowOutsideClick: true,
		fallbackFocus: maskElement.value!,
		trapStack: getTrapStack(),
		// Esc can be used without stop in content or additionalTrapElements where it should not deactivate modal's focus trap.
		// Focus trap is deactivated on modal close anyway.
		escapeDeactivates: false,
		setReturnFocus: props.setReturnFocus,
	}

	// Init focus trap
	focusTrap = createFocusTrap([maskElement.value!, ...props.additionalTrapElements], options)
	focusTrap.activate()
}

/**
 * Deactivate the active focus trap - if any.
 */
function clearFocusTrap() {
	if (!focusTrap) {
		return
	}
	focusTrap?.deactivate()
	focusTrap = undefined
}
</script>

<template>
	<Teleport :disabled="container === null" :to="container">
		<transition
			name="fade"
			appear
			@after-enter="useFocusTrap"
			@before-leave="clearFocusTrap">
			<div
				v-show="showModal"
				ref="mask"
				class="modal-mask"
				:class="{
					'modal-mask--opaque': dark || closeButtonOutside || hasPrevious || hasNext,
					'modal-mask--light': lightBackdrop,
				}"
				role="dialog"
				aria-modal="true"
				:aria-labelledby="labelId || `modal-name-${modalId}`"
				:aria-describedby="'modal-description-' + modalId"
				tabindex="-1">
				<!-- Header -->
				<transition name="fade-visibility" appear>
					<div
						class="modal-header"
						:data-theme-light="lightBackdrop"
						:data-theme-dark="!lightBackdrop">
						<h2
							v-if="name.trim() !== ''"
							:id="'modal-name-' + modalId"
							class="modal-header__name">
							{{ name }}
						</h2>
						<div class="icons-menu">
							<!-- Play-pause toggle -->
							<button
								v-if="hasNext && enableSlideshow"
								class="play-pause-icons"
								:class="{ 'play-pause-icons--paused': slideshowPaused }"
								:title="isPlaying ? t('Pause slideshow') : t('Start slideshow')"
								type="button"
								@click="runSlideshow = !runSlideshow">
								<!-- Play/pause icons -->
								<NcIconSvgWrapper
									class="play-pause-icons__icon"
									inline
									:name="isPlaying ? t('Pause slideshow') : t('Start slideshow')"
									:path="isPlaying ? mdiPause : mdiPlay" />

								<!-- Progress circle, css animated -->
								<svg
									v-if="isPlaying"
									:key="`${modalId}-animation-${animationKey}`"
									class="progress-ring"
									height="50"
									width="50">
									<circle
										class="progress-ring__circle"
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
								<slot name="actions" />
							</NcActions>

							<!-- Close modal -->
							<NcButton
								v-if="!noClose && closeButtonOutside"
								:aria-label="t('Close')"
								class="header-close"
								variant="tertiary"
								@click="close">
								<template #icon>
									<NcIconSvgWrapper :path="mdiClose" />
								</template>
							</NcButton>
						</div>
					</div>
				</transition>

				<!-- Content wrapper -->
				<transition :name="`modal-${outTransition ? 'out' : 'in'}`" appear>
					<div
						v-show="showModal"
						class="modal-wrapper"
						:class="[
							`modal-wrapper--${size}`,
							{ 'modal-wrapper--spread-navigation': spreadNavigation },
						]"
						@mousedown.self="handleClickModalWrapper">
						<!-- Navigation button -->
						<transition name="fade-visibility" appear>
							<NcButton
								v-show="hasPrevious"
								:aria-label="t('Previous')"
								class="prev"
								variant="tertiary-no-background"
								@click="previousSlide">
								<template #icon>
									<NcIconSvgWrapper
										directional
										:path="mdiChevronLeft"
										:size="40" />
								</template>
							</NcButton>
						</transition>

						<!-- Content -->
						<div :id="'modal-description-' + modalId" class="modal-container">
							<div class="modal-container__content">
								<slot />
							</div>
							<!-- Close modal -->
							<NcButton
								v-if="!noClose && !closeButtonOutside"
								:aria-label="t('Close')"
								class="modal-container__close"
								variant="tertiary"
								@click="close">
								<template #icon>
									<NcIconSvgWrapper :path="mdiClose" />
								</template>
							</NcButton>
						</div>

						<!-- Navigation button -->
						<transition name="fade-visibility" appear>
							<NcButton
								v-show="hasNext"
								:aria-label="t('Next')"
								class="next"
								variant="tertiary-no-background"
								@click="nextSlide">
								<template #icon>
									<NcIconSvgWrapper
										directional
										:path="mdiChevronRight"
										:size="40" />
								</template>
							</NcButton>
						</transition>
					</div>
				</transition>
			</div>
		</transition>
	</Teleport>
</template>

<style lang="scss" scoped>

.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	inset-inline-start: 0;
	display: block;
	width: 100%;
	height: 100%;
	--backdrop-color: 0, 0, 0;
	background-color: rgba(var(--backdrop-color), .5);

	&,
	& * {
		box-sizing: border-box;
	}

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
	inset-inline: 0 0;
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
			padding-inline-start: calc(var(--default-clickable-area) * 3); // maximum actions is 3
			text-align: center;
		}
	}

	.icons-menu {
		position: absolute;
		inset-inline-end: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		.header-close {
			display: flex;
			align-items: center;
			justify-content: center;
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
				.play-pause-icons__icon {
					opacity: $opacity_full;
					border-radius: calc(var(--default-clickable-area) / 2);
					background-color: $icon-focus-bg;
				}
			}
			&__icon {
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
	}
}

.modal-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
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
		inset-inline-start: 2px;
	}
	.next {
		inset-inline-end: 2px;
	}

	/* Content */
	.modal-container {
		position: relative;
		display: flex;
		padding: 0;
		transition: transform 300ms ease;
		border-radius: var(--border-radius-container);
		background-color: var(--color-main-background);
		color: var(--color-main-text);
		box-shadow: 0 0 40px rgba(0, 0, 0, .2);
		overflow: auto;

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

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-visibility-enter-from,
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

.modal-in-enter-from,
.modal-in-leave-to,
.modal-out-enter-from,
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
		inset-inline-start: 0;
		transform: rotate(-90deg);
		.progress-ring__circle {
			transition: 100ms stroke-dashoffset;
			transform-origin: 50% 50%; // axis compensation
			animation: progressring linear v-bind('cssSlideshowDelay') infinite;

			stroke-linecap: round;
			stroke-dashoffset: $radius * 2 * $pi; // radius * 2 * PI
			stroke-dasharray: $radius * 2 * $pi; // radius * 2 * PI
		}
	}
	&--paused {
		.play-pause-icons__icon {
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

<docs>
The `NcModel` is the base component used for modals and dialogs.
While `NcDialog` should be used for general dialogs like confirmations or forms,
`NcModal` allows for custom content like showing image multimedia.

For showing the modal you can use either `v-model:show="showModal"` or `v-if` on the `NcModal`,
depending on whether you require the Modal to stay within the DOM or not. Do not mix both, as this will break the out transition animation.

```vue
<template>
	<div>
		<NcButton @click="showModal">Show Modal</NcButton>
		<NcModal
			v-model:show="modal"
			@close="closeModal"
			size="small"
			name="Name"
			out-transition>
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

### Modal with slideshow

```vue
<template>
	<div>
		<NcButton @click="isOpen = true">Show Modal</NcButton>
		<NcModal
			v-if="isOpen"
			close-button-outside
			enable-slideshow
			:has-next="page < lastPage"
			:has-previous="page > 0"
			name="Modal with slideshow"
			@next="page++"
			@previous="page--"
			@close="isOpen = false">
			<div class="modal__content" :style="{ background: currentPage.background }">
				<p class="model__content-text">{{ currentPage.text }}</p>
			</div>
		</NcModal>
	</div>
</template>
<script>
const PAGES = [
	{ text: 'First page', background: 'linear-gradient(#e66465, #9198e5)' },
	{ text: 'Second page', background: 'linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c)' },
	{ text: 'Third page', background: 'lightblue' },
	{ text: 'Last page', background: 'lightgrey' },
]

export default {
	data() {
		return {
			isOpen: false,
			page: 0,
			lastPage: PAGES.length - 1,
		}
	},
	computed: {
		currentPage() {
			return PAGES[this.page]
		},
	}
}
</script>
<style scoped>
.modal__content {
	height: 100%;
	min-height: 30vh;
	display: flex;
	align-items: center;
	justify-content: center;
}

.model__content-text {
	font-size: 16px;
	font-weight: bold;
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
