<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div ref="widgetRoot" :class="{ 'toggle-interactive': referenceHasInteractiveView && !isInteractive }">
		<div
			v-if="reference && hasCustomWidget"
			ref="customWidget"
			class="widget-custom"
			:class="{ 'full-width': referenceHasFullWidth }" />

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

<script setup lang="ts">
import type { ReferenceWidgetObject } from './../../functions/reference/widgets.ts'

import { useElementSize, useIntersectionObserver } from '@vueuse/core'
import { computed, inject, nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { routerKey, RouterLink } from 'vue-router'
import NcButton from '../../components/NcButton/NcButton.vue'
import { t } from '../../l10n.ts'
import { destroyWidget, hasFullWidth, hasInteractiveView, isWidgetRegistered, renderWidget } from './../../functions/reference/widgets.ts'
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

const router = inject(routerKey, null)

const isVisible = ref(false)
const customWidget = useTemplateRef('customWidget')
const widgetRoot = useTemplateRef('widgetRoot')
const { width } = useElementSize(widgetRoot)

useIntersectionObserver(widgetRoot, ([entry]) => {
	nextTick(() => {
		isVisible.value = entry!.isIntersecting
	})
})

const showInteractive = ref(false)
const rendered = ref(false)
let idleTimeout: NodeJS.Timeout | null = null

const isInteractive = computed(() => {
	return (!props.interactiveOptIn && props.interactive) || showInteractive.value
})

const referenceHasFullWidth = computed(() => {
	return hasFullWidth(props.reference.richObjectType)
})

const hasCustomWidget = computed(() => {
	return isWidgetRegistered(props.reference.richObjectType)
})

const referenceHasInteractiveView = computed(() => {
	return hasCustomWidget.value && hasInteractiveView(props.reference.richObjectType)
})

const noAccess = computed(() => {
	return !props.reference.accessible
})

const numberOfLines = computed(() => {
	// no description for width < 450, one line until 550 and so on
	const lineCountOffsets = [450, 550, 650, Infinity]
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
	if (!customWidget.value) {
		return
	}

	if (props.reference.richObjectType === 'open-graph') {
		return
	}

	customWidget.value.innerHTML = ''

	// create a separate element so we can rerender on the ref again
	const widget = document.createElement('div')
	widget.style.width = '100%'
	customWidget.value.appendChild(widget)
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

	&.full-width {
		width: var(--widget-full-width, 100%) !important;
		inset-inline-start: calc( (var(--widget-full-width, 100%) - 100%) / 2 * -1);
		position: relative;
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
		font-weight: bold;
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
