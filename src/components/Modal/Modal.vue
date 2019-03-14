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

<template>
	<transition name="fade">
		<div ref="mask" class="modal-mask" @click="handleMouseMove"
			@mousemove="handleMouseMove" @touchmove="handleMouseMove">
			<!-- Header -->
			<transition name="fade">
				<div v-if="!clearView" class="modal-header">
					<div v-if="title.trim() !== ''" class="modal-title">
						{{ title }}
					</div>
					<div class="icons-menu">
						<action v-if="actions.length > 0" :actions="actions" class="header-actions" />
						<a v-if="hasNext && enableSlideshow" class="play-pause" @click="togglePlayPause">
							<div :class="[playing ? 'icon-pause' : 'icon-play']">
								<span class="hidden-visually">
									{{ t('core', 'Next') }}
								</span>
							</div>
							<svg v-if="playing" class="progress-ring" height="50"
								width="50">
								<circle class="progress-ring__circle" stroke="white" stroke-width="2"
									fill="transparent" r="15" cx="25"
									cy="25" />
							</svg>
						</a>
						<a class="close icon-close" @click="close">
							<span class="hidden-visually">
								{{ t('core', 'Close') }}
							</span>
						</a>
					</div>
				</div>
			</transition>

			<!-- Navigation buttons -->
			<transition name="fade">
				<div v-visible="!clearView" :class="`modal-navigation--${size}`" class="modal-navigation">
					<transition name="fade">
						<a v-if="hasPrevious" class="prev" @click="previous">
							<div class="icon icon-previous">
								<span class="hidden-visually">
									{{ t('core', 'Previous') }}
								</span>
							</div>
						</a>
					</transition>
					<transition name="fade">
						<a v-if="hasNext" class="next" @click="next">
							<div class="icon icon-next">
								<span class="hidden-visually">
									{{ t('core', 'Next') }}
								</span>
							</div>
						</a>
					</transition>
				</div>
			</transition>

			<!-- Content -->
			<transition :name="modalTransitionName">
				<div v-show="showModal" :class="`modal-wrapper--${size}`" class="modal-wrapper"
					@click.self="close">
					<div class="modal-container">
						<slot />
					</div>
				</div>
			</transition>
		</div>
	</transition>
</template>

<script>
import Vue from 'vue'
import Hammer from 'hammerjs'
import VueVisible from 'vue-visible'
import Action from 'Components/Action'

Vue.use(VueVisible)

export default {
	name: 'Modal',

	components: {
		Action
	},

	props: {
		actions: {
			type: Array,
			default: () => {
				return []
			}
		},
		title: {
			type: String,
			default: ''
		},
		hasPrevious: {
			type: Boolean,
			default: false
		},
		hasNext: {
			type: Boolean,
			default: false
		},
		outTransition: {
			type: Boolean,
			default: false
		},
		enableSlideshow: {
			type: Boolean,
			default: false
		},
		slideshowDelay: {
			type: Number,
			default: 3000
		},
		enableSwipe: {
			type: Boolean,
			default: true
		},
		size: {
			type: String,
			default: 'normal',
			validator: size => {
				return ['normal', 'large', 'full'].indexOf(size) !== -1
			}
		}
	},

	data() {
		return {
			mc: null,
			showModal: false,
			clearView: false,
			clearViewTimeout: null,
			playing: false,
			slideshowTimeout: null
		}
	},

	computed: {
		modalTransitionName() {
			return `modal-${this.outTransition ? 'out' : 'in'}`
		}
	},

	beforeMount() {
		window.addEventListener('keydown', this.handleKeydown)
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.handleKeydown)
	},
	mounted() {
		this.showModal = true
		// init clear view
		this.handleMouseMove()

		this.mc = new Hammer(this.$refs.mask)
		this.mc.on('swipeleft swiperight', e => {
			this.handleSwipe(e)
		})
	},
	unmounted() {
		this.mc.off('swipeleft swiperight')
		this.ms.destroy()
	},

	methods: {
		previous(data) {
			// do not send the event if nothing is available
			if (this.hasPrevious) {
				this.$emit('previous', data)
			}
		},
		next(data) {
			// do not send the event if nothing is available
			if (this.hasNext) {
				this.$emit('next', data)
			}
		},
		close(data) {
			this.showModal = false

			// delay closing for animation
			setTimeout(() => {
				this.$emit('close', data)
			}, 300)
		},
		togglePlayPause() {
			this.playing = !this.playing
			if (this.playing) {
				this.handleSlideshow()
			} else {
				clearTimeout(this.slideshowTimeout)
			}
		},
		handleKeydown(e) {
			switch (e.keyCode) {
			case 37:	// left arrow
				this.previous(e)
				break
			case 13:	// enter key
			case 39:	// rigth arrow
				this.next(e)
				break
			case 27:	// escape key
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
			this.clearView = false
			clearTimeout(this.clearViewTimeout)
			this.clearViewTimeout = setTimeout(() => {
				this.clearView = true
			}, 5000)
		},
		handleSlideshow() {
			this.playing = true
			if (this.hasNext) {
				this.slideshowTimeout = setTimeout(() => {
					this.next()
					this.handleSlideshow()
				}, this.slideshowDelay)
			} else {
				this.playing = false
				clearTimeout(this.slideshowTimeout)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import '~Fonts/scss/iconfont-vue';

.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, .92);
	display: block;
}

/* Navigation buttons */
.modal-navigation {
	.prev,
	.next {
		position: absolute;
		top: 0;
		z-index: 10000;
		width: 15%;
		min-width: 60px;
		height: 100%;
		display: block;
	}
	.prev {
		left: 0;
	}
	.next {
		right: 0;
	}

	&.modal-navigation--full,
	&.modal-navigation--large {
		.prev,
		.next {
			width: 10%;
		}
	}

	// buttons/icons
	.icon-next,
	.icon-previous {
		background-image: none;
		font-size: 24px;
		padding: 12px 11px;
		box-sizing: border-box;
		color: white;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		top: 50%;
		position: absolute;
		margin: auto;
	}
	.icon-previous {
		@include iconfont('arrow-left');
		// center horizontally
		left: 25%;
		margin-left: -22px;
	}
	.icon-next {
		@include iconfont('arrow-right');
		// center horizontally
		right: 25%;
		margin-right: -22px;
	}
}

.modal-header {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	width: 100%;
	height: 50px;
	z-index: 10001;
	display: flex;
	align-items: center;
	justify-content: center;

	.modal-title {
		max-width: 100%;
		padding: 0 88px; // maximum actions is 2 (2*44px)
		box-sizing: border-box;
		color: #fff;
		font-size: 14px;
		text-overflow: ellipsis;
		overflow-x: hidden;
		white-space: nowrap;
		transition: padding ease 100ms;
	}

	.icons-menu {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		position: absolute;
		right: 0;

		.icon-close {
			@include iconfont('close');
			height: 50px;
			width: 50px;
			box-sizing: border-box;
			padding: 16px 14px;
			font-size: 24px;
			color: #fff;
			background-image: none;
		}

		.play-pause {
			height: 50px;
			width: 50px;
			color: white;
			font-size: 22px;
			position: relative;
			.icon-play,
			.icon-pause {
				height: 50px;
			}
			.icon-play {
				@include iconfont('play');
				// better visual
				padding: 15px;
			}
			.icon-pause {
				@include iconfont('pause');
				padding: 15px;
				// ! align with circle
				font-size: 19.5px;
			}
		}

		.header-actions {
			color: white;
		}

		.action-item--single {
			height: 44px;
			width: 44px;
			cursor: pointer;
			box-sizing: border-box;
			background-size: 22px;
			background-position: center;
		}
	}
}

.modal-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	&--full {
		.modal-container {
			max-width: 100%;
			max-height: 100%;
			border-radius: 0;
		}
	}
	&--large {
		.modal-container {
			max-width: 70%;
			max-height: 90%;
		}
	}
	.modal-container {
		margin: 0 auto;
		padding: 0;
		background-color: var(--color-main-background);
		border-radius: var(--border-radius-large);
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
		transition: transform 300ms ease;
		display: block;
	}
	&:not(&--large):not(&--full).modal-container {
		max-width: 900px;
		max-height: 80%;
	}
}

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 250ms;
}

.fade-enter,
.fade-leave-to  {
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

</style>
<style lang="scss">
// we cannot scope sub-components
.modal-mask[data-v-#{$scope_version}] .modal-header .icons-menu .action-item__menutoggle {
	// 22px is a somehow better looking for the icon-more icon
	font-size: 22px;
	padding: 13px 11px;
}

$radius: 15;
$pi: 3.14159265358979;
// animated circle
.modal-mask[data-v-#{$scope_version}] .progress-ring {
	position: absolute;
	transform: rotate(-90deg);
	top: 0;
	left: 0;
	.progress-ring__circle {
		animation: progressring linear 3s infinite;
		transition: 100ms stroke-dashoffset;
		stroke-linecap: round;
		// axis compensation
		transform-origin: 50% 50%;
		stroke-dashoffset: $radius * 2 * $pi;	// radius * 2 * PI
		stroke-dasharray: $radius * 2 * $pi;	// radius * 2 * PI
	}
}
// keyframes get scoped too and break the animation name, we need them unscoped
@keyframes progressring {
	from {
		stroke-dashoffset: $radius * 2 * $pi;	// radius * 2 * PI
	}
	to {
		stroke-dashoffset: 0;
	}
}
</style>
