<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Ref } from 'vue'
import type { ReferenceWidgetObject } from './../../functions/reference/widgets.ts'

import { useElementSize, useIntersectionObserver } from '@vueuse/core'
import { computed, inject, nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { routerKey, RouterLink } from 'vue-router'
import NcButton from '../../components/NcButton/NcButton.vue'
import { t } from '../../l10n.ts'
import { createElementId } from '../../utils/createElementId.ts'
import { destroyWidget, hasFullWidth, hasInteractiveView, isResizable, isWidgetRegistered, renderWidget } from './../../functions/reference/widgets.ts'
import { getRoute } from './autolink.ts'

const props = withDefaults(defineProps<{
	/**
	 * A reference object as returned by the ReferenceProvider
	 */
	reference: ReferenceWidgetObject
	/**
	 * Whether to render the widget in interactive mode (if available)
	 */
	interactive?: boolean
	/**
	 * Whether to show user an option to enable to interactive mode (if available)
	 */
	interactiveOptIn?: boolean
}>(), {
	interactive: true,
	interactiveOptIn: false,
})

/* 3 minutes outside of viewport before widget is removed from the DOM */
const IDLE_TIMEOUT = 3 * 60 * 1000
const RESIZE_KEYBOARD_STEP = 10

const router = inject(routerKey, null)

const widgetId = `nc-reference-widget-${createElementId()}`

const isVisible = ref(false)
const customWidget = useTemplateRef('customWidget')
const customWidgetContent = useTemplateRef('customWidgetContent')
const widgetRoot = useTemplateRef('widgetRoot')
const { width } = useElementSize(widgetRoot)
const { height: customWidgetHeight } = useElementSize(customWidget)

useIntersectionObserver(widgetRoot, ([entry]) => {
	nextTick(() => {
		isVisible.value = entry!.isIntersecting
	})
})

const showInteractive = ref(false)
const rendered = ref(false)
let idleTimeout: NodeJS.Timeout | null = null
const isResizing = ref(false)
const resizedHeight: Ref<number | null> = ref(null)
const resizeStartY = ref(0)
const resizeStartHeight = ref(0)
const resizeMinHeight = ref(100)
const resizeMaxHeight = ref(window.innerHeight - 120)

const isInteractive = computed(() => {
	return (!props.interactiveOptIn && props.interactive) || showInteractive.value
})

const referenceHasFullWidth = computed(() => {
	return hasFullWidth(props.reference.richObjectType)
})

const isWidgetResizable = computed(() => {
	return isResizable(props.reference.richObjectType)
})

const hasCustomWidget = computed(() => {
	return isWidgetRegistered(props.reference.richObjectType)
})

const customWidgetStyle = computed(() => {
	if (!resizedHeight.value) {
		return null
	}
	return { height: `${resizedHeight.value}px !important` }
})

const ariaValueNow = computed(() => {
	return Math.round(resizedHeight.value ?? customWidgetHeight.value)
})

const referenceHasInteractiveView = computed(() => {
	return hasCustomWidget.value && hasInteractiveView(props.reference.richObjectType)
})

const noAccess = computed(() => {
	return !props.reference.accessible
})

const numberOfLines = computed(() => {
	// no description for width < 250, one line until 550 and so on
	const lineCountOffsets = [250, 550, 650, Infinity]
	return lineCountOffsets.findIndex((max) => width.value < max)
})

const descriptionStyle = computed(() => {
	if (numberOfLines.value === 0) {
		return {
			display: 'none',
		}
	}
	const lineClamp = numberOfLines.value
	return {
		lineClamp,
		webkitLineClamp: lineClamp,
	}
})

const compactLink = computed(() => {
	const link = props.reference.openGraphObject.link
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
})

const route = computed(() => {
	return getRoute(router, props.reference.openGraphObject.link)
})

const referenceWidgetLinkComponent = computed(() => {
	return route.value ? RouterLink : 'a'
})

const referenceWidgetLinkProps = computed(() => {
	return route.value
		? { to: route.value }
		: { href: props.reference.openGraphObject.link, target: '_blank' }
})

watch(isVisible, (val) => {
	if (!val) {
		idleTimeout = setTimeout(() => {
			// If the widget is still outside of viewport after timeout, destroy it
			if (!isVisible.value) {
				destroyReferenceWidget()
			}
		}, IDLE_TIMEOUT)
		return
	}

	if (idleTimeout) {
		clearTimeout(idleTimeout)
		idleTimeout = null
	}

	if (!rendered.value) {
		renderReferenceWidget()
	}
}, { immediate: true })

onBeforeUnmount(() => {
	if (idleTimeout) {
		clearTimeout(idleTimeout)
		idleTimeout = null
	}
	stopResize()
	destroyReferenceWidget()
})

/**
 * Enable interactive view of the widget, if available
 */
function enableInteractive() {
	showInteractive.value = true
	renderReferenceWidget()
}

/**
 * Render the reference widget
 */
function renderReferenceWidget() {
	if (!customWidgetContent.value) {
		return
	}

	if (props.reference.richObjectType === 'open-graph') {
		return
	}

	customWidgetContent.value.innerHTML = ''

	// create a separate element so we can rerender on the ref again
	const widget = document.createElement('div')
	widget.style.width = '100%'
	customWidgetContent.value.appendChild(widget)
	nextTick(() => {
		// Waiting for the ref to become available
		renderWidget(widget, {
			...props.reference,
			interactive: isInteractive.value,
		})
		rendered.value = true
	})
}

/**
 * Destroy the reference widget
 */
function destroyReferenceWidget() {
	if (rendered.value && widgetRoot.value) {
		destroyWidget(props.reference.richObjectType, widgetRoot.value)
		rendered.value = false
	}
}

/**
 * Initialize resize limits
 */
function initResizeLimits() {
	// Use min/max height from rendered widget element if set
	const widgetEl = customWidgetContent.value?.firstElementChild
	if (widgetEl) {
		const computedStyle = window.getComputedStyle(widgetEl)
		const parsedMin = parseFloat(computedStyle.minHeight)
		const parsedMax = parseFloat(computedStyle.maxHeight)
		resizeMinHeight.value = parsedMin > 0 ? parsedMin : 100
		resizeMaxHeight.value = Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : (window.innerHeight - 120)
	} else {
		resizeMinHeight.value = 100
		resizeMaxHeight.value = window.innerHeight - 120
	}
}

/**
 * Start resize via dragging
 *
 * @param event - the pointer event
 */
function startResize(event: PointerEvent) {
	if (!isWidgetResizable.value || !customWidget.value) {
		return
	}

	initResizeLimits()
	isResizing.value = true
	resizeStartY.value = event.clientY
	resizeStartHeight.value = customWidget.value.getBoundingClientRect().height

	window.addEventListener('pointermove', onResize)
	window.addEventListener('pointerup', stopResize)
}

/**
 * Resize via keydown
 *
 * @param delta - the resize delta
 */
function onResizeKeydown(delta: number) {
	if (!isWidgetResizable.value || !customWidget.value) {
		return
	}

	// Establish limits once per interaction
	initResizeLimits()

	const currentHeight = resizedHeight.value ?? resizeStartHeight.value
	const next = currentHeight + delta
	resizedHeight.value = Math.min(resizeMaxHeight.value, Math.max(resizeMinHeight.value, next))
}

/**
 * Resize via dragging
 *
 * @param event - the pointer event
 */
function onResize(event: PointerEvent) {
	if (!isResizing.value || !customWidget.value) {
		return
	}

	const deltaY = event.clientY - resizeStartY.value
	resizedHeight.value = Math.min(resizeMaxHeight.value, Math.max(resizeMinHeight.value, resizeStartHeight.value + deltaY))
}

/**
 * Stop resize via dragging
 */
function stopResize() {
	if (!isResizing.value) {
		return
	}

	isResizing.value = false
	window.removeEventListener('pointermove', onResize)
	window.removeEventListener('pointerup', stopResize)
}
</script>

<template>
	<div ref="widgetRoot" :class="{ 'toggle-interactive': referenceHasInteractiveView && !isInteractive }">
		<div
			v-if="reference && hasCustomWidget"
			:id="widgetId"
			ref="customWidget"
			class="widget-custom"
			:class="{ 'full-width': referenceHasFullWidth }"
			:style="customWidgetStyle">
			<div ref="customWidgetContent" class="widget-custom__content" />
			<div
				v-if="isWidgetResizable"
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
				@keydown.up.stop.prevent="onResizeKeydown(-RESIZE_KEYBOARD_STEP)"
				@keydown.down.stop.prevent="onResizeKeydown(RESIZE_KEYBOARD_STEP)" />
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
		<NcButton v-if="interactiveOptIn && referenceHasInteractiveView && !isInteractive" class="toggle-interactive--button" @click="enableInteractive">
			{{ t('Enable interactive view') }}
		</NcButton>
	</div>
</template>

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
		width: 0;
		flex-grow: 1;

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
		line-clamp: 3; /* stylelint-disable-line property-no-unknown */
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
