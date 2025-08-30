<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
## BlurHash

A [blur hash](https://blurha.sh/) is a very compact representation of an image,
that can be used as a placeholder until the image was fully loaded.

### Image placeholder

The default use case is as a placeholder that is transferred in initial state,
while the real image will be fetched from the network.
In this case the image source can be passed to the component.
The component will immediately start to preload it,
as soon as it is loaded the blur hash will be swapped with the real image and this component will behave like an `<a>`-element.

```vue
	<template>
		<div class="wrapper">
			<NcBlurHash class="shown-image"
				:hash="blurHash"
				:src="imageSource"
				@load="onLoaded" />

			<NcButton @click="toggleImage">
				{{
					loading
						? 'Loading...'
						: (loaded ? 'Unload image' : 'Load image')
				}}
			</NcButton>
		</div>
	</template>
	<script>
	export default {
		data() {
			return {
				loaded: false,
				loading: false,
				blurHash: 'M8CR]OkDD%kD9ZtRayofaykC00ay$_ay~T',
			}
		},
		computed: {
			// This is cheating but we can not emulate slow network connection
			// so imagine that this means the source becomes loaded
			imageSource() {
				return this.loaded
					? 'favicon-touch.png'
					: 'invalid-file-that-will-never-load.png'
			},
		},
		methods: {
			toggleImage() {
				if (this.loaded) {
					this.loaded = false
					this.loading = false
				} else {
					// emulate slow network
					this.loading = true
					window.setTimeout(() => {
						this.loaded = !this.loaded
						this.loading = false
					}, 3000)
				}
			},

			// you could use `success` here (boolean) to decide if the image is loaded or failed
			onLoaded(success) {
				// ...
			},
		},
	}
	</script>
	<style scoped>
		.wrapper {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 12px;
		}

		.shown-image {
			width: 150px;
			height: 150px;
			border-radius: 24px;
		}
	</style>
```

### Manual usage as a placeholder

Using `v-if` is also possible, this can e.g. used if the image is not loaded from an URL.

```vue
	<template>
		<div class="wrapper">
			<img :class="loaded ? 'shown-image' : 'hidden-visually'"
				alt=""
				src="favicon-touch.png">
			<NcBlurHash v-if="!loaded"
				class="shown-image"
				:hash="blurHash" />
			<NcButton @click="loaded = !loaded">Toggle blur hash</NcButton>
		</div>
	</template>
	<script>
	export default {
		data() {
			return {
				loaded: false,
				blurHash: 'M8CR]OkDD%kD9ZtRayofaykC00ay$_ay~T',
			}
		},
	}
	</script>
	<style scoped>
		.wrapper {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 12px;
		}

		.shown-image {
			width: 150px;
			height: 150px;
			border-radius: 24px;
		}
	</style>
```
</docs>

<script setup>
import { decode } from 'blurhash'
import { nextTick, ref, watch } from 'vue'
import { preloadImage } from '../../functions/preloadImage/index.ts'
import { logger } from '../../utils/logger.ts'

const props = defineProps({
	/**
	 * The blur hash value to use.
	 */
	hash: {
		required: true,
		type: String,
	},

	/**
	 * This is normally not needed, but if this blur hash is not only intended
	 * for decorative purpose, descriptive text should be passed for accessibility.
	 */
	alt: {
		type: String,
		default: '',
	},

	/**
	 * Optional an image source to load, during the load the blur hash is shown.
	 * As soon as it is loaded the image will be shown instead.
	 */
	src: {
		type: String,
		default: '',
	},
})

const emit = defineEmits([
	/**
	 * Emitted when the image (`src`) has been loaded.
	 */
	'load',
])

const canvas = ref()
const imageLoaded = ref(false)

// Redraw when hash has changed
watch(() => props.hash, drawBlurHash)
// Redraw if image loaded again - also draw immediate on mount
watch(imageLoaded, () => {
	if (imageLoaded.value === false) {
		// We need to wait one tick to make sure the canvas is in the DOM
		nextTick(() => drawBlurHash())
	}
}, { immediate: true })

// Preload image on source change
watch(() => props.src, () => {
	imageLoaded.value = false
	if (props.src) {
		preloadImage(props.src)
			.then((success) => {
				imageLoaded.value = success
				emit('load', success)
			})
	}
}, { immediate: true })

/**
 * Render the BlurHash within the canvas
 */
function drawBlurHash() {
	if (imageLoaded.value) {
		// skip
		return
	}

	if (!props.hash) {
		logger.error('Invalid BlurHash value')
		return
	}

	if (canvas.value === undefined) {
		// Should never happen but better safe than sorry
		logger.error('BlurHash canvas not available')
		return
	}

	const { height, width } = canvas.value
	const pixels = decode(props.hash, width, height)

	const ctx = canvas.value.getContext('2d')
	if (ctx === null) {
		logger.error('Cannot create context for BlurHash canvas')
		return
	}

	const imageData = ctx.createImageData(width, height)
	imageData.data.set(pixels)
	ctx.putImageData(imageData, 0, 0)
}
</script>

<template>
	<Transition :css="src ? undefined : false"
		:enter-active-class="$style.fadeTransition"
		:leave-active-class="$style.fadeTransition"
		:enter-class="$style.fadeTransitionActive"
		:leave-to-class="$style.fadeTransitionActive">
		<canvas v-if="!imageLoaded"
			ref="canvas"
			:aria-hidden="alt ? null : 'true'"
			:aria-label="alt" />
		<img v-else :alt="alt" :src="src">
	</Transition>
</template>

<style module>
.fadeTransition {
	transition: all var(--animation-quick) ease;
}

.fadeTransitionActive {
	opacity: 0;
	position: absolute;
}
</style>
