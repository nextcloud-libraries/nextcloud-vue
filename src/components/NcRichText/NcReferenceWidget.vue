<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div ref="widgetRoot" :class="{ 'toggle-interactive': hasInteractiveView && !isInteractive }">
		<div
			v-if="reference && hasCustomWidget"
			:id="widgetId"
			ref="customWidget"
			class="widget-custom"
			:class="{
				'full-width': hasFullWidth,
			}"
			:style="customWidgetStyle">
			<div ref="customWidgetContent" class="widget-custom__content" />
			<div
				v-if="isResizable"
				class="widget-custom__resize-handle"
				role="slider"
				tabindex="0"
				aria-orientation="vertical"
				:aria-label="t('Widget height')"
				:aria-valuenow="ariaValueNow"
				:aria-valuemin="resizeMinHeight"
				:aria-valuemax="resizeMaxHeight"
				:aria-controls="widgetId"
				@pointerdown.stop.prevent="startResize"
				@keydown="onResizeKeydown" />
		</div>

		<component
			:is="referenceWidgetLinkComponent"
			v-else-if="!noAccess && reference && reference.openGraphObject && !hasCustomWidget"
			v-bind="referenceWidgetLinkProps"
			rel="noopener noreferrer"
			class="widget-default">
			<img v-if="reference.openGraphObject.thumb" class="widget-default--image" :src="reference.openGraphObject.thumb">
			<div class="widget-default--details">
				<p class="widget-default--name">
					{{ reference.openGraphObject.name }}
				</p>
				<p class="widget-default--description" :style="descriptionStyle">
					{{ reference.openGraphObject.description }}
				</p>
				<p class="widget-default--link">
					{{ compactLink }}
				</p>
			</div>
		</component>
		<NcButton v-if="interactiveOptIn && hasInteractiveView && !isInteractive" class="toggle-interactive--button" @click="enableInteractive">
			{{ t('Enable interactive view') }}
		</NcButton>
	</div>
</template>

<script>
import { useElementSize, useIntersectionObserver } from '@vueuse/core'
import { nextTick, ref } from 'vue'
import { RouterLink } from 'vue-router'
import NcButton from '../../components/NcButton/index.js'
import { t } from '../../l10n.js'
import { createElementId } from '../../utils/createElementId.ts'
import { destroyWidget, hasFullWidth, hasInteractiveView, isResizable, isWidgetRegistered, renderWidget } from './../../functions/reference/widgets.ts'
import { getRoute } from './autolink.js'

const IDLE_TIMEOUT = 3 * 60 * 1000 // 3 minutes outside of viewport before widget is removed from the DOM
const RESIZE_KEYBOARD_STEP = 10

export default {
	name: 'NcReferenceWidget',
	components: {
		NcButton,
	},

	/* eslint vue/require-prop-comment: warn -- TODO: Add a proper doc block about what this props do */
	props: {
		reference: {
			type: Object,
			required: true,
		},

		interactive: {
			type: Boolean,
			// eslint-disable-next-line vue/no-boolean-default
			default: true,
		},

		interactiveOptIn: {
			type: Boolean,
			default: false,
		},
	},

	setup() {
		const widgetId = `nc-reference-widget-${createElementId()}`

		const isVisible = ref(false)
		// This is the widget root node
		const widgetRoot = ref()
		const customWidget = ref()
		const { width } = useElementSize(widgetRoot)
		const { height: customWidgetHeight } = useElementSize(customWidget)

		useIntersectionObserver(widgetRoot, ([entry]) => {
			nextTick(() => {
				isVisible.value = entry.isIntersecting
			})
		})

		return {
			width,
			isVisible,
			widgetRoot,
			customWidget,
			customWidgetHeight,
			widgetId,
		}
	},

	data() {
		return {
			showInteractive: false,
			rendered: false,
			idleTimeout: null,
			isResizing: false,
			resizedHeight: null,
			resizeStartY: 0,
			resizeStartHeight: 0,
			resizeMinHeight: 100,
			resizeMaxHeight: window.innerHeight - 120,
		}
	},

	computed: {
		isInteractive() {
			return (!this.interactiveOptIn && this.interactive) || this.showInteractive
		},

		hasFullWidth() {
			return hasFullWidth(this.reference.richObjectType)
		},

		isResizable() {
			return isResizable(this.reference.richObjectType)
		},

		hasCustomWidget() {
			return isWidgetRegistered(this.reference.richObjectType)
		},

		customWidgetStyle() {
			if (!this.resizedHeight) {
				return null
			}
			return { height: `${this.resizedHeight}px !important` }
		},

		ariaValueNow() {
			return Math.round(this.resizedHeight ?? this.customWidgetHeight)
		},

		hasInteractiveView() {
			return isWidgetRegistered(this.reference.richObjectType) && hasInteractiveView(this.reference.richObjectType)
		},

		noAccess() {
			return this.reference && !this.reference.accessible
		},

		descriptionStyle() {
			if (this.numberOfLines === 0) {
				return {
					display: 'none',
				}
			}
			const lineClamp = this.numberOfLines
			return {
				lineClamp,
				webkitLineClamp: lineClamp,
			}
		},

		numberOfLines() {
			// no description for width < 450, one line until 550 and so on
			const lineCountOffsets = [450, 550, 650, Infinity]
			return lineCountOffsets.findIndex((max) => this.width < max)
		},

		compactLink() {
			const link = this.reference.openGraphObject.link
			if (!link) {
				return ''
			}

			if (link.startsWith('https://')) {
				return link.substring(8)
			}
			if (link.startsWith('http://')) {
				return link.substring(7)
			}
			return link
		},

		route() {
			return getRoute(this.$router, this.reference.openGraphObject.link)
		},

		referenceWidgetLinkComponent() {
			return this.route ? RouterLink : 'a'
		},

		referenceWidgetLinkProps() {
			return this.route
				? { to: this.route }
				: { href: this.reference.openGraphObject.link, target: '_blank' }
		},
	},

	watch: {
		isVisible: {
			handler(val) {
				if (!val) {
					this.idleTimeout = setTimeout(() => {
						// If the widget is still outside of viewport after timeout, destroy it
						if (!this.isVisible) {
							this.destroyWidget()
						}
					}, IDLE_TIMEOUT)
					return
				}

				if (this.idleTimeout) {
					clearTimeout(this.idleTimeout)
					this.idleTimeout = null
				}

				if (!this.rendered) {
					this.renderWidget()
				}
			},

			immediate: true,
		},
	},

	beforeDestroy() {
		if (this.idleTimeout) {
			clearTimeout(this.idleTimeout)
			this.idleTimout = null
		}
		this.stopResize()
		this.destroyWidget()
	},

	methods: {
		t,

		enableInteractive() {
			this.showInteractive = true
			this.renderWidget()
		},

		renderWidget() {
			if (!this.$refs.customWidgetContent) {
				return
			}

			if (this?.reference?.richObjectType === 'open-graph') {
				return
			}

			this.$refs.customWidgetContent.innerHTML = ''

			// create a separate element so we can rerender on the ref again
			const widget = document.createElement('div')
			widget.style = 'width: 100%;'
			this.$refs.customWidgetContent.appendChild(widget)
			this.$nextTick(() => {
				// Waiting for the ref to become available
				renderWidget(widget, {
					...this.reference,
					interactive: this.isInteractive,
				})
				this.rendered = true
			})
		},

		destroyWidget() {
			if (this.rendered) {
				destroyWidget(this.reference.richObjectType, this.$el)
				this.rendered = false
			}
		},

		initResizeLimits() {
			// Use min/max height from rendered widget element if set
			const widgetEl = this.$refs.customWidgetContent?.firstElementChild
			if (widgetEl) {
				const computedStyle = window.getComputedStyle(widgetEl)
				const parsedMin = parseFloat(computedStyle.minHeight)
				const parsedMax = parseFloat(computedStyle.maxHeight)
				this.resizeMinHeight = parsedMin > 0 ? parsedMin : 100
				this.resizeMaxHeight = Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : (window.innerHeight - 120)
			} else {
				this.resizeMinHeight = 100
				this.resizeMaxHeight = window.innerHeight - 120
			}
		},

		startResize(event) {
			if (!this.isResizable || !this.$refs.customWidget) {
				return
			}

			this.initResizeLimits()
			this.isResizing = true
			this.resizeStartY = event.clientY
			this.resizeStartHeight = this.$refs.customWidget.getBoundingClientRect().height

			window.addEventListener('pointermove', this.onResize)
			window.addEventListener('pointerup', this.stopResize)
		},

		onResizeKeydown(event) {
			if (!this.isResizable || !this.$refs.customWidget) {
				return
			}

			if (!['ArrowDown', 'ArrowUp'].includes(event.key)) {
				return
			}

			// Establish limits once per interaction
			this.initResizeLimits()

			const currentHeight = this.resizedHeight ?? this.resizeStartHeight

			let next
			switch (event.key) {
				case 'ArrowDown':
					next = currentHeight + RESIZE_KEYBOARD_STEP
					break
				case 'ArrowUp':
					next = currentHeight - RESIZE_KEYBOARD_STEP
					break
				default:
					return
			}

			event.preventDefault()
			this.resizedHeight = Math.min(this.resizeMaxHeight, Math.max(this.resizeMinHeight, next))
		},

		onResize(event) {
			if (!this.isResizing || !this.$refs.customWidget) {
				return
			}

			const deltaY = event.clientY - this.resizeStartY
			this.resizedHeight = Math.min(this.resizeMaxHeight, Math.max(this.resizeMinHeight, this.resizeStartHeight + deltaY))
		},

		stopResize() {
			if (!this.isResizing) {
				return
			}

			this.isResizing = false
			window.removeEventListener('pointermove', this.onResize)
			window.removeEventListener('pointerup', this.stopResize)
		},
	},
}
</script>

<style lang="scss" scoped>

@mixin widget {
	width: 100%;
	margin: auto;
	margin-bottom: calc(var(--default-grid-baseline, 4px) * 3);
	margin-top: calc(var(--default-grid-baseline, 4px) * 3);
	overflow: hidden;
	border: 2px solid var(--color-border);
	border-radius: var(--border-radius-container);
	background-color: transparent;
	display: flex;
}

.widget-custom {
	@include widget;
	position: relative;

	&.full-width {
		width: var(--widget-full-width, 100%) !important;
		inset-inline-start: calc( (var(--widget-full-width, 100%) - 100%) / 2 * -1);
		position: relative;
	}

	&__content {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	&__resize-handle {
		position: absolute;
		bottom: 0;
		inset-inline-start: 0;
		width: 100%;
		height: calc(var(--default-grid-baseline) * 2);
		border-top: 1px solid var(--color-border);
		margin-top: -1px;
		cursor: row-resize;
		touch-action: none;

		&::before, &::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			background-color: var(--color-border);
			margin-top: 1px;
			transform: translateX(-50%);
			width: 30px;
			height: 1px;
		}

		&::before {
			margin-top: -2px;
		}

		&:focus-visible {
			outline: 2px solid var(--color-primary-element);
			outline-offset: -4px;
		}
	}
}

.widget-access {
	@include widget;
	padding: calc(var(--default-grid-baseline, 4px) * 3);
}

.widget-default {
	@include widget;

	&--compact {
		flex-direction: column;

		.widget-default--image {
			width: 100%;
			height: 150px;
		}

		.widget-default--details {
			width: 100%;
			padding-top: calc(var(--default-grid-baseline, 4px) * 2);
			padding-bottom: calc(var(--default-grid-baseline, 4px) * 2);
		}

		.widget-default--description {
			display: none;
		}

	}

	&--image {
		width: 40%;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
	}

	&--name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: var(--font-weight-heading, bold);
	}

	&--details {
		padding: calc(var(--default-grid-baseline, 4px) * 3);
		width: 60%;

		p {
			margin: 0;
			padding: 0;
		}
	}

	&--description {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	&--link {
		color: var(--color-text-maxcontrast);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.toggle-interactive {
	position: relative;
	.toggle-interactive--button {
		position: absolute;
		bottom: var(--default-grid-baseline);
		inset-inline-end: var(--default-grid-baseline);
		z-index: 10000;
	}
}
</style>
