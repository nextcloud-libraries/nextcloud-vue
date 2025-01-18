<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
## BlurHash

A [blur hash](https://blurha.sh/) is a very compact representation of an image,
that can be used as a placeholder until the image was fully loaded.

### Manual usage as a placeholder

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
import { onMounted, ref, watch } from 'vue'
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
	label: {
		type: String,
		default: '',
	},
})

const canvas = ref()

// Draw initial version on mounted
onMounted(drawBlurHash)

// Redraw when hash has changed
watch(() => props.hash, drawBlurHash)

/**
 * Render the BlurHash within the canvas
 */
function drawBlurHash() {
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
	ctx.clearRect(0, 0, width, height)
	ctx.putImageData(imageData, 0, 0)
}
</script>

<template>
	<canvas ref="canvas" :aria-hidden="label ? null : 'true'" :aria-label="label" />
</template>
