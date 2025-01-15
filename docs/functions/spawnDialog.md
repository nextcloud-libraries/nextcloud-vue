<!--
 - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
```ts static
import {
	spawnDialog,
} from '@nextcloud/vue/functions/dialog'
```

## Definitions

```ts static
/**
 * Helper to spawn a Vue dialog without having to mount it from a component
 *
 * @param dialog The dialog component to spawn - the component must emit the 'close' event whenever it is closed
 * @param props Properties to pass to the dialog
 * @param props.container Optionally pass a query selector for the dialog container element
 * @param onClose Callback when the dialog is closed (parameters of the 'close' event of the dialog)
 */
function spawnDialog(
	dialog: Component | AsyncComponent,
	props: Record<string, unknown>,
	onClose: (...rest: unknown[]) => void = () => {},
): Vue;
```

## Usage

The main use case is to be able to spawn a dialog from code, without the need of including the dialog component in the template.
So a Vue dialog can be spawned in any context and not just from Vue components but also from callback functions or other API.

```vue
<template>
	<div>
		<NcButton @click="onSpawnDialog">🖱 click to spawn a dialog</NcButton>
	</div>
</template>

<script>
// Example dialog component that would be normally imported
// Important: The dialog must emit a 'close' event whenever it is closed
const ExampleDialog = {
	template: `
		<NcDialog :buttons="buttons"
			name="Spawned dialog"
			message="This dialog was spawned using the 'spawnDialog' function."
			@closing="saveResult"
			@update:open="onClose" />`,
	props: {
		timesClicked: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			result: null,
		}
	},
	computed: {
		buttons() {
			return [
				{
					label: 'Cancel',
					callback: () => 'cancelled',
				},
				{
					label: 'Accept',
					type: 'primary',
					callback: () => 'accepted',
				},
			]
		}
	},
	methods: {
		saveResult(result) {
			this.result = result
		},
		onClose() {
			this.$emit('close', this.result)
		},
	}
}

export default {
	data() {
		return {
			timesClicked: 0,
		}
	},
	methods: {
		onSpawnDialog() {
			this.timesClicked += 1
			spawnDialog(
				ExampleDialog,
				{
					timesClicked: this.timesClicked,
				},
				(result) => window.alert(`Dialog was ${result}`)
			)
		},
	},
}
</script>
```