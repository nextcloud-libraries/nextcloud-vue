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
		<div id="modal-mask" ref="mask" @click="handleMouseMove"
			@mousemove="handleMouseMove" @touchmove="handleMouseMove">
			<!-- Header -->
			<transition name="fade">
				<div v-if="!clearView" id="modal-header">
					<div v-if="title.trim() !== ''" class="modal-title">
						{{ title }}
					</div>
					<div class="icons-menu">
						<action v-if="actions.length > 0" :actions="actions" class="header-actions" />
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
				<div id="modal-navigation" v-visible="!clearView">
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
					<transition name="fade">
						<a v-if="hasNext && enableSlideshow" class="play-pause" @click="togglePlayPause">
							<div :class="[playing ? 'icon-pause' : 'icon-play']">
								<span class="hidden-visually">
									{{ t('core', 'Next') }}
								</span>
							</div>
							<svg v-if="playing" class="progress-ring" width="48"
								height="48">
								<circle class="progress-ring__circle" stroke="white" stroke-width="2"
									fill="transparent" r="22" cx="24"
									cy="24" />
							</svg>
						</a>
					</transition>
				</div>
			</transition>

			<!-- Content -->
			<transition :name="modalTransitionName">
				<div v-show="showModal" id="modal-wrapper" @click.self="close">
					<div id="modal-container">
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
			if (e.type === 'swipeleft') {
				// swiping to left to go to the next item
				this.next(e)
			} else if (e.type === 'swiperight') {
				// swiping to right to go back to the previous item
				this.previous(e)
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

#modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, .7);
	display: block;
}

/* Navigation buttons */
#modal-navigation {
	.prev,
	.next,
	.play-pause {
		position: absolute;
		top: 0;
		z-index: 10000;
		width: 15%;
		height: 100%;
		display: block;
	}
	.prev {
		left: 0;
	}
	.next {
		right: 0;
	}
	.play-pause {
		$pi: 3.14159265358979;
		right: 0;
		top: calc(50% + 44px + 22px); // 1 + half the entry
		height: 44px;
		.progress-ring {
			margin: -2px;
			position: absolute;
			left: 22px;
			z-index: 1;
			transform: rotate(-90deg);
			.progress-ring__circle {
				animation: progress-ring linear 3s infinite;
				transition: 100ms stroke-dashoffset;
				// axis compensation
				transform-origin: 50% 50%;
				stroke-dasharray: 22 * 2 * $pi, 22 * 2 * $pi; // radius * 2 * PI
			}
		}
		.icon-play,
		.icon-pause {
			top: 0;
			left: 22px;
			// weirdly, 21px is a better visual w/ the antialiazing 🤷‍♀️
			font-size: 21px;
		}
		.icon-play {
			@include iconfont('play');
			// better visual
			padding: 13px;
		}
		.icon-pause {
			@include iconfont('pause');
			padding: 13px 11px;
		}
	}
	.icon-next,
	.icon-previous,
	.icon-play,
	.icon-pause {
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
		left: calc(100% - 22px - 44px);
	}
	.icon-next {
		@include iconfont('arrow-right');
		background-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
		left: 22px;
	}
}

#modal-header {
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
			height: 44px;
			width: 44px;
			box-sizing: border-box;
			padding: 12px 11px;
			font-size: 24px;
			color: white;
			background-image: none;
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

#modal-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
	// do not go over the header
	padding-top: 50px;
	box-sizing: border-box;
	#modal-container {
		max-width: 900px;
		max-height: 80%;
		margin: 0 auto;
		padding: 0;
		background-color: var(--color-main-background);
		border-radius: var(--border-radius-large);
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
		transition: transform 300ms ease;
		display: block;
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

.modal-in-enter #modal-container,
.modal-in-leave-to #modal-container {
	transform: scale(.9);
}

.modal-out-enter #modal-container,
.modal-out-leave-to #modal-container {
	transform: scale(1.1);
}

@media only screen and (max-width: 768px) {
	#modal-header {
		justify-content: flex-start;
		.modal-title {
			padding: 0 88px 0 10px;
		}
	}
}

</style>
<style lang="scss">
// we cannot scope sub-components
#modal-mask[data-v-#{$scope_version}] #modal-header .icons-menu .action-item__menutoggle {
	// 22px is a somehow better looking for the icon-more icon
	font-size: 22px;
	padding: 13px 11px;
}

// keyframes get scoped too and break the animation name, we need them unscoped
$pi: 3.14159265358979;
@keyframes progress-ring {
	from {
		stroke-dashoffset: 22 * 2 * $pi; // radius * 2 * PI
	}
	to {
		stroke-dashoffset: 0;
	}
}
</style>
