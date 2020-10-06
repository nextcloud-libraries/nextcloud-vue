<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<docs>

```vue
<template>
	<div>
		<button @click="showModal">Show Modal</button>
		<modal v-if="modal" @close="closeModal">
			<div class="modal__content">Hello world</div>
		</modal>
	</div>
</template>
<style scoped>
	.modal__content {
		width: 50vw;
		text-align: center;
		margin: 10vw 0;
	}
</style>
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
```

</docs>
<template>
	<transition name="fade">
		<div ref="mask"
			class="modal-mask"
			:class="{ 'modal-mask--dark': dark }"
			@click="handleMouseMove"
			@mousemove="handleMouseMove"
			@touchmove="handleMouseMove">
			<!-- Header -->
			<transition name="fade-visibility">
				<div v-show="!clearView"
					:class="{
						invisible: clearView
					}"
					class="modal-header">
					<div v-if="title.trim() !== ''" class="modal-title">
						{{ title }}
					</div>
					<div class="icons-menu">
						<!-- Play-pause toggle -->
						<button v-if="hasNext && enableSlideshow"
							v-tooltip.auto="playPauseTitle"
							:class="{ 'play-pause--paused': slideshowPaused }"
							class="play-pause"
							@click="togglePlayPause">
							<!-- Progress circle, css animated -->
							<div :class="[playing ? 'icon-pause' : 'icon-play']">
								<span class="hidden-visually">
									{{ playPauseTitle }}
								</span>
							</div>

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
						<Actions class="header-actions">
							<!-- @slot List of actions to show -->
							<slot name="actions" />
						</Actions>

						<!-- Close modal -->
						<Actions v-if="canClose" class="header-close">
							<ActionButton icon="icon-close" @click="close">
								{{ t('Close') }}
							</ActionButton>
						</Actions>
					</div>
				</div>
			</transition>

			<!-- Content wrapper -->
			<transition :name="modalTransitionName">
				<div
					v-show="showModal"
					:class="[
						`modal-wrapper--${size}`,
						spreadNavigation ? 'modal-wrapper--spread-navigation' : ''
					]"
					class="modal-wrapper"
					@click.self="close">
					<!-- Navigation button -->
					<transition name="fade-visibility">
						<a v-show="hasPrevious && !clearView"
							class="prev"
							:class="{
								invisible: clearView || !hasPrevious
							}"
							@click="previous">
							<div class="icon icon-previous">
								<span class="hidden-visually">
									{{ t('Previous') }}
								</span>
							</div>
						</a>
					</transition>

					<!-- Content -->
					<div class="modal-container">
						<!-- @slot Modal content to render -->
						<slot />
					</div>

					<!-- Navigation button -->
					<transition name="fade-visibility">
						<a v-show="hasNext && !clearView"
							class="next"
							:class="{
								invisible: clearView || !hasNext
							}"
							@click="next">
							<div class="icon icon-next">
								<span class="hidden-visually">
									{{ t('Next') }}
								</span>
							</div>
						</a>
					</transition>
				</div>
			</transition>
		</div>
	</transition>
</template>

<script>
import Hammer from 'hammerjs'
import Actions from '../Actions'
import ActionButton from '../ActionButton'
import l10n from '../../mixins/l10n'
import { t } from '../../l10n'
import Tooltip from '../../directives/Tooltip'
import Timer from '../../utils/Timer'

export default {
	name: 'Modal',

	components: {
		Actions,
		ActionButton,
	},

	directives: {
		tooltip: Tooltip,
	},

	mixins: [l10n],

	props: {
		/**
		 * Title to be shown with the modal
		 */
		title: {
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
		clearViewDelay: {
			type: Number,
			default: 5000,
		},
		/**
		 * Declare the slide interval
		 */
		slideshowDelay: {
			type: Number,
			default: 3000,
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
		size: {
			type: String,
			default: 'normal',
			validator: size => {
				return ['normal', 'large', 'full'].indexOf(size) !== -1
			},
		},
		/**
		 * Declare if the modal can be closed
		 */
		canClose: {
			type: Boolean,
			default: true,
		},
		/** Makes the modal backdrop black if true  */
		dark: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			mc: null,
			showModal: false,
			clearView: false,
			clearViewTimeout: null,
			playing: false,
			slideshowTimeout: null,
		}
	},

	computed: {
		modalTransitionName() {
			return `modal-${this.outTransition ? 'out' : 'in'}`
		},
		playPauseTitle() {
			return this.playing ? t('Pause slideshow') : t('Start slideshow')
		},
	},

	watch: {
		/**
		 * Handle play/pause of an ongoing slideshow
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
	},

	beforeMount() {
		window.addEventListener('keydown', this.handleKeydown)
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.handleKeydown)
		this.mc.off('swipeleft swiperight')
		this.mc.destroy()
	},
	mounted() {
		this.showModal = true

		// init clear view
		this.handleMouseMove()

		this.mc = new Hammer(this.$refs.mask)
		this.mc.on('swipeleft swiperight', e => {
			this.handleSwipe(e)
		})

		// force mount the component to body
		document.body.insertBefore(this.$el, document.body.lastChild)
	},
	destroyed() {
		this.$el.remove()
	},

	methods: {
		// Events emitters
		previous(data) {
			// do not send the event if nothing is available
			if (this.hasPrevious) {
				// if data is set, then it's a user mouse event
				// and not the slideshow handler, therefore
				// we reset the timer
				if (data) {
					this.resetSlideshow()
				}
				this.$emit('previous', data)
			}
		},
		next(data) {
			// do not send the event if nothing is available
			if (this.hasNext) {
				// if data is set, then it's a mouse event
				// and not the slideshow handler, therefore
				// we reset the timer
				if (data) {
					this.resetSlideshow()
				}
				this.$emit('next', data)
			}
		},
		close(data) {
			// do not fire event if forbidden
			if (this.canClose) {
				this.showModal = false

				// delay closing for animation
				setTimeout(() => {
					/**
					 * Emitted when the closing animation is finished
					 */
					this.$emit('close', data)
				}, 300)
			}
		},

		// Key Handlers
		handleKeydown(e) {
			switch (e.keyCode) {
			case 37: // left arrow
				this.previous(e)
				break
			case 13: // enter key
			case 39: // rigth arrow
				this.next(e)
				break
			case 27: // escape key
				this.close(e)
				break
			}
		},
		handleSwipe(e) {
			if (this.enableSwipe) {
				if (e.type === 'swipeleft') {
					// swiping to left to go to the next item
					this.next(e)
				} else if (e.type === 'swiperight') {
					// swiping to right to go back to the previous item
					this.previous(e)
				}
			}
		},
		handleMouseMove() {
			if (this.clearViewDelay > 0) {
				this.clearView = false
				clearTimeout(this.clearViewTimeout)
				this.clearViewTimeout = setTimeout(() => {
					this.clearView = true
				}, this.clearViewDelay)
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
	},
}
</script>

<style lang="scss" scoped>
@import '../../fonts/scss/iconfont-vue';
$header-size: 50px;

.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	display: block;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, .5);
	&--dark {
		background-color: rgba(0, 0, 0, .92);
	}
}

.modal-header {
	position: absolute;
	z-index: 10001;
	top: 0;
	right: 0;
	left: 0;
	// prevent vue show to use display:none and reseting
	// the circle animation loop
	display: flex !important;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: $header-size;
	transition: opacity 250ms,
		visibility 250ms;

	// replace display by visibility
	&.invisible[style*='display:none'],
	&.invisible[style*='display: none'] {
		visibility: hidden;
	}

	.modal-title {
		overflow-x: hidden;
		box-sizing: border-box;
		width: 100%;
		padding: 0 #{$clickable-area * 3} 0 12px; // maximum actions is 3
		transition: padding ease 100ms;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #fff;
		font-size: $icon-margin;
	}

	// On wider screens the title can be centered
	@media only screen and (min-width: $breakpoint-mobile/2) {
		.modal-title {
			text-align: center;
			padding-left: #{$clickable-area * 3}; // maximum actions is 3
		}
	}

	.icons-menu {
		position: absolute;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		.icon-close {
			box-sizing: border-box;
			margin: ($header-size - $clickable-area) / 2;
			// not using $icon-margin since we have a custom font size
			// and alignement seems odd
			padding: 10px 11px;
			color: #fff;
			background-image: none;
			font-size: 23px;

			@include iconfont('close');
		}

		.play-pause {
			position: relative;
			width: $header-size;
			height: $header-size;
			margin: 0;
			padding: 0;
			cursor: pointer;
			color: white;
			border: none;
			background-color: transparent;
			font-size: 22px;
			&:hover,
			&:focus {
				.icon-play,
				.icon-pause {
					opacity: 1;
					border-radius: $clickable-area / 2;
					background-color: $icon-focus-bg;
				}
			}
			.icon-play,
			.icon-pause {
				box-sizing: border-box;
				width: $clickable-area;
				height: $clickable-area;
				margin: ($header-size - $clickable-area) / 2;
				opacity: .7;
				background-image: none;
				cursor: pointer;
			}
			.icon-play {
				// better visual
				padding: 11px 13px;
				@include iconfont('play');
			}
			.icon-pause {
				padding: 12px;
				// ! align with circle
				font-size: 19.5px;
				@include iconfont('pause');
			}
		}

		.header-actions {
			margin: ($header-size - $clickable-area) / 2;
			color: white;
		}

		.action-item--single {
			box-sizing: border-box;
			width: $clickable-area;
			height: $clickable-area;
			cursor: pointer;
			background-position: center;
			background-size: 22px;
		}

		&::v-deep .action-item__menutoggle {
			padding: 13px 11px;
			// force white instead of default main text
			color: #fff;
			// 22px is a somehow better looking for the icon-more icon
			font-size: 22px;
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
		// ignore display: none
		display: flex !important;
		align-items: center;
		justify-content: center;
		width: 15%;
		min-width: 60px;
		height: 100%;
		transition: opacity 250ms,
			visibility 250ms;

		// we want to keep the elements on page
		// even if hidden to avoid having a unbalanced
		// centered content
		// replace display by visibility
		&.invisible[style*='display:none'],
		&.invisible[style*='display: none'] {
			visibility: hidden;
		}
	}

	// buttons/icons
	.icon-next,
	.icon-previous {
		box-sizing: border-box;
		width: $clickable-area;
		height: $clickable-area;
		padding: 12px 11px;
		color: white;
		border-radius: $clickable-area / 2;
		background-image: none;
		font-size: 24px;
	}
	.icon-previous {
		@include iconfont('arrow-left');
	}
	.icon-next {
		@include iconfont('arrow-right');
	}

	/* Content */
	.modal-container {
		display: block;
		overflow: hidden;
		padding: 0;
		transition: transform 300ms ease;
		border-radius: var(--border-radius-large);
		background-color: var(--color-main-background);
		box-shadow: 0 0 40px rgba(0, 0, 0, .2);
	}
	&:not(&--large):not(&--full) .modal-container {
		max-width: 900px;
		max-height: 80%;
	}

	// Sizing
	&--full {
		.modal-container {
			max-width: 100%;
			max-height: 100%;
			border-radius: 0;
		}
	}
	&--full,
	&--spread-navigation {
		.prev,
		.next {
			position: absolute;
			width: 10%;
		}
		.prev {
			left: 0;
		}
		.next {
			right: 0;
		}
	}
	&--large {
		.modal-container {
			max-width: 85%;
			max-height: 90%;
		}
		.prev,
		.next {
			width: 10%;
			min-width: $clickable-area;
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

.modal-mask .play-pause {
	.progress-ring {
		position: absolute;
		top: 0;
		left: 0;
		transform: rotate(-90deg);
		.progress-ring__circle {
			transition: 100ms stroke-dashoffset;
			transform-origin: 50% 50%; // axis compensation
			animation: progressring linear 3s infinite;

			stroke-linecap: round;
			stroke-dashoffset: $radius * 2 * $pi; // radius * 2 * PI
			stroke-dasharray: $radius * 2 * $pi; // radius * 2 * PI
		}
	}
	&--paused {
		.icon-pause {
			animation: breath 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
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
