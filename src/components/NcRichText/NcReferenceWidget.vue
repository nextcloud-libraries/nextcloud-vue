<template>
	<div>
		<div v-if="reference && hasCustomWidget" class="widget-custom">
			<div ref="customWidget" />
		</div>

		<a v-else-if="!noAccess && reference && reference.openGraphObject && !hasCustomWidget"
			:href="reference.openGraphObject.link"
			rel="noopener noreferrer"
			target="_blank"
			class="widget-default">
			<img v-if="reference.openGraphObject.thumb" class="widget-default--image" :src="reference.openGraphObject.thumb">
			<div class="widget-default--details">
				<p class="widget-default--name">{{ reference.openGraphObject.name }}</p>
				<p class="widget-default--description" :style="descriptionStyle">{{ reference.openGraphObject.description }}</p>
				<p class="widget-default--link">{{ compactLink }}</p>
			</div>
		</a>
	</div>
</template>
<script>
import { renderWidget, isWidgetRegistered, destroyWidget } from './widgets.js'

export default {
	name: 'NcReferenceWidget',
	props: {
		reference: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			compact: 3,
		}
	},
	computed: {
		hasCustomWidget() {
			return isWidgetRegistered(this.reference.richObjectType)
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
	},
	mounted() {
		this.renderWidget()
		this.observer = new ResizeObserver(entries => {
			if (entries[0].contentRect.width < 450) {
				this.compact = 0
			} else if (entries[0].contentRect.width < 550) {
				this.compact = 1
			} else if (entries[0].contentRect.width < 650) {
				this.compact = 2
			} else {
				this.compact = 3
			}

		})
		this.observer.observe(this.$el)
	},
	beforeUnmount() {
		this.observer.disconnect()
		destroyWidget(this.reference.richObjectType, this.$el)
	},
	methods: {
		renderWidget() {
			if (this.$refs.customWidget) {
				this.$refs.customWidget.innerHTML = ''
			}
			if (this?.reference?.richObjectType === 'open-graph') {
				return
			}
			this.$nextTick(() => {
				// Waiting for the ref to become available
				renderWidget(this.$refs.customWidget, this.reference)
			})
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
</style>
