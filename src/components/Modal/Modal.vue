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
		<div class="modal-mask">
			<!-- Navigation buttons -->
			<div class="modal-navigation">
				<a v-if="hasPrevious" class="prev" @click="previous">
					<div class="icon-view-previous icon-white">
						<span class="hidden-visually">
							{{ t('core', 'Previous') }}
						</span>
					</div>
				</a>
				<a v-if="hasNext" class="next" @click="next">
					<div class="icon-view-next icon-white">
						<span class="hidden-visually">
							{{ t('core', 'Next') }}
						</span>
					</div>
				</a>
				<a class="close icon-close icon-white" @click="close">
					<span class="hidden-visually">
						{{ t('core', 'Close') }}
					</span>
				</a>
			</div>

			<!-- Content -->
			<transition :name="modalTransitionName">
				<div v-show="showModal" class="modal-wrapper" @click.self="close">
					<div class="modal-container">
						<slot />
					</div>
				</div>
			</transition>
		</div>
	</transition>
</template>

<script>

export default {
	name: 'Modal',

	props: {
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
		}
	},

	data() {
		return {
			showModal: false
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
		}
	}
}
</script>

<style lang="scss" scoped>
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: var(--color-box-shadow);
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
		height: 100%;
		display: block;
	}
	.prev {
		left: 0;
	}
	.next {
		right: 0;
	}
	.icon-view-next,
	.icon-view-previous {
		background-size: 24px;
		background-position: 12px center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		top: 50%;
		position: absolute;
		margin: auto;
	}
	.icon-view-previous {
		left: calc(100% - 22px - 44px);
	}
	.icon-view-next {
		background-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
		left: 22px;
	}
	.icon-close {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 10000;
		width: 44px;
		height: 44px;
		display: block;
		background-size: 24px;
		background-position: center;
	}
}

.modal-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
	.modal-container {
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

.modal-in-enter .modal-container,
.modal-in-leave-to .modal-container {
	transform: scale(.9);
}

.modal-out-enter .modal-container,
.modal-out-leave-to .modal-container {
	transform: scale(1.1);
}
</style>
