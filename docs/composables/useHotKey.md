<!--
 - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

This composable allows to use keyboard shortcuts in the application.
It respects Nextcloud's value of ```OCP.Accessibility.disableKeyboardShortcuts``` parameter.

### Usage
```js static
import { useHotKey } from '@nextcloud/vue/dist/Composables/useHotKey/index.js'

const stopCallback = useHotKey(key, callback, options)
```
where:
- `keysOrFilter`: one of following:
  - `string`: representing the keyboard key to listen to
  - `Array<string>`: representing any of keys to listen to
  - `Function`: custom filter function to validate event key
  - `true`: to listen for all events

  See [KeyboardEvent.key Value column](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) for possible values
- `callback`: a function to be called when the key is pressed. Before called, it will be checked whether keyboard shortcuts are disabled, or interactive element is currently focused, or whether options should be applied
- `options`: options to be applied to the shortcut:
  - `push`: whether the event should be triggered on both keydown and keyup (default: `false`)
  - `prevent`: prevents the default action of the event (default: `false`)
  - `stop`: prevents propagation of the event in the capturing and bubbling phases (default: `false`)
  - `ctrl`: whether the Ctrl key (Cmd key on MacOS) should be pressed (default: `false`)
  - `alt`: whether the Alt key should be pressed (default: `false`)
  - `shift`: whether the Shift key should be pressed (should be explicitly defined as `true`|`false` if needed)
  - `caseSensitive`: whether specific case should be listened, e.g. only 'd' and not 'D' (default: `false`)
- `stopCallback`: a callback to stop listening to the event

### Playground

```vue

<template>
	<div class="container">
		<p class="description">Press <kbd>W</kbd> <kbd>S</kbd> <kbd>A</kbd> <kbd>D</kbd> keys to move the ball</p>
		<div class="square">
			<div class="circle" :style="{ left: `${circleX}px`, top: `${circleY}px` }"></div>
		</div>
		<p class="description">
			Push <kbd>M</kbd> to highlight the red area
			<button @click="stop">Stop listen to this event</button>
		</p>
		<div ref="push"
			 class="push-square"
			 :class="{ 'push-square--highlighted': highlighted }"></div>
		<p class="description">Use <kbd>Ctrl</kbd> + <kbd>F</kbd> to focus input</p>
		<input ref="input"/>
	</div>
</template>

<script>
	import { ref } from 'vue'
	import { useHotKey } from '../../src/composables/useHotKey/index.js'

	export default {
		setup() {
			const circleX = ref(20)
			const circleY = ref(20)
			const highlighted = ref(false)

			const moveUp = (event) => {
				circleY.value = Math.max(0, circleY.value - 10)
			}
			const moveDown = (event) => {
				circleY.value = Math.min(160, circleY.value + 10)
			}
			const moveLeft = (event) => {
				circleX.value = Math.max(0, circleX.value - 10)
			}
			const moveRight = (event) => {
				circleX.value = Math.min(160, circleX.value + 10)
			}
			const toggleHighlighted = (event) => {
				highlighted.value = !highlighted.value
			}

			useHotKey('w', moveUp)
			useHotKey('s', moveDown)
			useHotKey('a', moveLeft)
			useHotKey('d', moveRight)
			const stop = useHotKey('m', toggleHighlighted, { push: true })

			return {
				circleX,
				circleY,
				highlighted,
				stop,
			}
		},

		created() {
			useHotKey('f', this.focusInput, { ctrl: true, stop: true, prevent: true })
		},

		methods: {
			focusInput(event) {
				this.$refs.input.focus()
			}
		}
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
