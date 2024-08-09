<!--
 - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

```js static
import Keystroke from '@nextcloud/vue/dist/Directives/Keystroke.js'
```

Allows to use keyboard shortcuts in the application.
Extended version of [VueUse onKeyStroke](https://vueuse.org/core/onKeyStroke/)

```vue
<template>
	<div class="container">
		<p class="description">Press <kbd>W</kbd> <kbd>S</kbd> <kbd>A</kbd> <kbd>D</kbd> keys to move the ball</p>
		<p class="description">Hold <kbd>D</kbd> key to continue generate events</p>
		<div v-key-stroke:w="moveUp"
			 v-key-stroke:s="moveDown"
			 v-key-stroke:a="moveLeft"
			 v-key-stroke:d.press="moveRight"
			 class="square">
			<div class="circle" :style="circlePosition" ></div>
		</div>
		<p class="description">Push <kbd>M</kbd> to highlight the square </p>
		<div ref="push"
			v-key-stroke:m.push="toggleHighlighted"
			class="push-square"
			:class="{ 'push-square--highlighted': highlighted }" ></div>
		<p class="description">Use <kbd>Ctrl</kbd> + <kbd>F</kbd> to focus input</p>
		<input ref="input" v-key-stroke:f.ctrl.stop.prevent="focusInput" />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				circleX: 20,
				circleY: 20,
				highlighted: false,
			}
		},
		computed: {
			circlePosition() {
				return {
					left: this.circleX + 'px',
					top: this.circleY + 'px'
				}
			}
		},
		methods: {
			moveUp() {
				this.circleY = Math.max(0, this.circleY - 10)
			},
			moveDown() {
				this.circleY = Math.min(160, this.circleY + 10)
			},
			moveLeft() {
				this.circleX = Math.max(0, this.circleX - 10)
			},
			moveRight() {
				this.circleX = Math.min(160, this.circleX + 10)
			},
			toggleHighlighted(event) {
				console.log(event)
				this.highlighted = !this.highlighted
			},
			focusInput() {
				this.$refs.input.focus()
			}
		},
	}
</script>

<style scoped>
	.description {
		margin-block: 10px;
	}

	.square {
		position: relative;
		width: 200px;
		height: 200px;
		outline: 4px solid var(--color-border-dark);
	}

	.circle {
		position: absolute;
		width: 40px;
		height: 40px;
		background-color: var(--color-primary-element);
		border-radius: 50%;
	}

	.push-square {
		width: 100px;
		height: 20px;
		background-color: var(--color-error);
	}
	.push-square--highlighted {
		background-color: var(--color-success);
	}
</style>
```
