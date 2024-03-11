<template>
	<div ref="widgetRoot" :class="{'toggle-interactive': hasInteractiveView && !isInteractive }">
		<div v-if="reference && hasCustomWidget"
			ref="customWidget"
			class="widget-custom"
			:class="{ 'full-width': hasFullWidth }" />

		<component :is="referenceWidgetLinkComponent"
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
import { useIntersectionObserver, useResizeObserver } from '@vueuse/core'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import { t } from '../../l10n.js'
import { getRoute } from './autolink.js'
import { renderWidget, isWidgetRegistered, destroyWidget, hasInteractiveView, hasFullWidth } from './../../functions/reference/widgets.ts'

import NcButton from '../../components/NcButton/index.js'

export default {
	name: 'NcReferenceWidget',
	components: {
		NcButton,
	},
	props: {
		reference: {
			type: Object,
			required: true,
		},
		interactive: {
			type: Boolean,
			default: true,
		},
		interactiveOptIn: {
			type: Boolean,
			default: false,
		},
	},

	setup() {
		const compact = ref(3)
		const isVisible = ref(false)
		// This is the widget root node
		const widgetRoot = ref()

		useIntersectionObserver(widgetRoot, (entries) => {
			isVisible.value = entries[0]?.isIntersecting ?? false
		})

		useResizeObserver(widgetRoot, (entries) => {
			if (entries[0].contentRect.width < 450) {
				compact.value = 0
			} else if (entries[0].contentRect.width < 550) {
				compact.value = 1
			} else if (entries[0].contentRect.width < 650) {
				compact.value = 2
			} else {
				compact.value = 3
			}
		})

		return {
			compact,
			isVisible,
			widgetRoot,
		}
	},

	data() {
		return {
			showInteractive: false,
			rendered: false,
		}
	},

	computed: {
		isInteractive() {
			return (!this.interactiveOptIn && this.interactive) || this.showInteractive
		},
		hasFullWidth() {
			return hasFullWidth(this.reference.richObjectType)
		},
		hasCustomWidget() {
			return isWidgetRegistered(this.reference.richObjectType)
		},
		hasInteractiveView() {
			return isWidgetRegistered(this.reference.richObjectType) && hasInteractiveView(this.reference.richObjectType)
		},
		noAccess() {
			return this.reference && !this.reference.accessible
		},
		descriptionStyle() {
			if (this.compact === 0) {
				return {
					display: 'none',
				}
			}

			const lineClamp = this.compact < 4 ? this.compact : 3
			return {
				lineClamp,
				webkitLineClamp: lineClamp,
			}
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
					this.destroyWidget()
					return
				}
				this.renderWidget()
			},
			immediate: true,
		},
	},
	beforeDestroy() {
		this.destroyWidget()
	},
	methods: {
		t,

		enableInteractive() {
			this.showInteractive = true
			this.renderWidget()
		},
		renderWidget() {
			if (this.$refs.customWidget) {
				this.$refs.customWidget.innerHTML = ''
			}
			if (this?.reference?.richObjectType === 'open-graph') {
				return
			}
			// create a separate element so we can rerender on the ref again
			const widget = document.createElement('div')
			this.$refs.customWidget.appendChild(widget)
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
	border-radius: var(--border-radius-large);
	background-color: transparent;
	display: flex;
}

.widget-custom {
	@include widget;

	&.full-width {
		width: var(--widget-full-width, 100%) !important;
		left: calc( (var(--widget-full-width, 100%) - 100%) / 2 * -1);
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
		top: 50%;
		z-index: 10000;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		opacity: 0;
	}

	&:focus-within, &:hover {
		.toggle-interactive--button {
			opacity: 1;
		}
	}
}
</style>
