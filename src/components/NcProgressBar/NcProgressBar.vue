<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This is a simple progress bar component.
## Usage:

### Linear
```vue
<template>
	<span>
		Small
		<NcProgressBar :value="20" />
		<br />
		Error
		<NcProgressBar :value="80" :error="true" />
		<br />
		Custom color
		<NcProgressBar :value="55" size="medium" color="green" />
		<br />
		Medium size
		<NcProgressBar :value="60" size="medium" />
		<br />
		Custom size (changes the progress bar height)
		<NcProgressBar :value="55" :size="8" />
	</span>
</template>
```

### Circular
```vue
<template>
	<span>
		Default
		<NcProgressBar type="circular" :value="25" />
		<br />
		Color
		<NcProgressBar type="circular" :value="42" color="green" />
		<br />
		Error
		<NcProgressBar type="circular" :value="80" error />
		<br />
		Medium size
		<NcProgressBar type="circular" :value="65" size="medium" />
		<br />
		Custom size (changes the diameter of the progress bar)
		<NcProgressBar type="circular" :value="65" :size="42" />
	</span>
</template>
```
</docs>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
	/**
	 * An integer between 0 and 100
	 */
	value?: number

	/**
	 * Determines the height of the progressbar.
	 */
	size?: 'small' | 'medium' | number

	/**
	 * Applies an error color to the progressbar if true.
	 */
	error?: boolean

	/**
	 * Progress bar variant
	 */
	type?: 'linear' | 'circular'

	color?: string
}>(), {
	value: 0,
	color: 'var(--color-primary-element)',
	size: 'small',
	type: 'linear',
})

/**
 * Current progress as a value between 0 and 1
 */
const progress = computed(() => Math.max(0, Math.min(100, props.value)) / 100)

const height = computed(() => {
	if (typeof props.size === 'number') {
		return Math.round(props.size)
	}

	// circular type
	if (props.type === 'circular') {
		if (props.size === 'medium') {
			return clickableArea
		} else {
			return clickableAreaSmall
		}
	}

	// linear type
	if (props.size === 'medium') {
		return 1.5 * gridBaseline
	}
	return gridBaseline
})

/**
 * Height as string and with 'px' suffix to be used in the <style>
 */
const cssHeightPx = computed(() => `${height.value}px`)

/**
 * The stroke width of the circular progress bar.
 */
const strokeWidth = computed(() => Math.max(gridBaseline, height.value / clickableArea * gridBaseline))

/**
 * Radius used for centering it within the wrapper.
 */
const circleCenterPosition = computed(() => height.value / 2)

/**
 * The real radius of the progress circle
 * which includes the stroke width as padding to the wrapper.
 */
const circleRadius = computed(() => (height.value / 2) - strokeWidth.value)

/**
 * The circumfence which is used to calculate the `dasharray` and `dashoffset`
 * which defines the visible prgress bar within the circle.
 */
const circumference = computed(() => circleRadius.value * 2 * Math.PI)
</script>

<script lang="ts">
// design constants
const gridBaseline = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue('--default-grid-baseline'))
const clickableArea = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue('--default-clickable-area'))
const clickableAreaSmall = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue('--clickable-area-small'))
</script>

<template>
	<span v-if="type === 'circular'"
		role="progressbar"
		:aria-valuenow="value"
		:class="{ 'progress-bar--error': error }"
		class="progress-bar progress-bar--circular">
		<svg :height="height"
			:width="height">
			<circle stroke="currentColor"
				fill="transparent"
				:stroke-dasharray="`${progress * circumference} ${(1 - progress) * circumference}`"
				:stroke-dashoffset="0.25 * circumference"
				:stroke-width
				:r="circleRadius"
				:cx="circleCenterPosition"
				:cy="circleCenterPosition" />
			<circle stroke="var(--color-background-darker)"
				fill="transparent"
				:stroke-dasharray="`${(1 - progress) * circumference} ${progress * circumference}`"
				:stroke-dashoffset="(0.25 - progress) * circumference"
				:stroke-width
				:r="circleRadius"
				:cx="circleCenterPosition"
				:cy="circleCenterPosition" />
		</svg>
	</span>
	<progress v-else
		class="progress-bar progress-bar--linear vue"
		:class="{ 'progress-bar--error': error }"
		:value
		max="100" />
</template>

<style lang="scss" scoped>

.progress-bar {
	display: block;
	height: var(--progress-bar-height);

	--progress-bar-color: v-bind(color);
	--progress-bar-height: v-bind(cssHeightPx);

	&--linear {
		width: 100%;
		overflow: hidden;
		border: 0;
		padding: 0;
		background: var(--color-background-dark);
		border-radius: calc(var(--progress-bar-height) / 2);

		// Browser specific rules
		&::-webkit-progress-bar {
			height: var(--progress-bar-height);
			background-color: transparent;
		}
		&::-webkit-progress-value {
			background: var(--progress-bar-color, var(--gradient-primary-background));
			border-radius: calc(var(--progress-bar-height) / 2);
		}
		&::-moz-progress-bar {
			background: var(--progress-bar-color, var(--gradient-primary-background));
			border-radius: calc(var(--progress-bar-height) / 2);
		}
	}
	&--circular {
		width: var(--progress-bar-height);
		color: var(--progress-bar-color);
	}
	&--error {
		color: var(--color-error) !important;
		// Override previous values
		&::-moz-progress-bar {
			background: var(--color-error) !important;
		}
		&::-webkit-progress-value {
			background: var(--color-error) !important;
		}
	}
}

</style>
