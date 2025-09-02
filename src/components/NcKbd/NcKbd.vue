<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { computed } from 'vue'
import { t } from '../../l10n.js'
import { isMac } from '../../utils/platform.ts'

const props = withDefaults(defineProps<{
	/**
	 * Key name or symbol to display.
	 * For common special keys (CTRL, ALT, SHIFT, Arrow keys, etc.) it will display the symbol on macOS and the localized name on Windows/Linux.
	 */
	symbol?: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Control' | 'Alt' | 'Shift' | 'Enter' | 'Space' | 'Tab' | 'Delete' | 'Escape' | (string & {})
	/**
	 * Explicitly use macOS (true) or Windows/Linux (false) key symbols.
	 * By default it uses the OS detected from the user agent.
	 */
	mac?: boolean | undefined
}>(), {
	symbol: undefined,
	mac: isMac,
})

/**
 * Map of special key names to symbols or localized names:
 * - macOS uses symbols instead of names
 * - Windows/Linux uses localized names
 * - In ternary expressions, // TRANSLATORS comments only works for the second operand, but not for `else`
 */
const labels = computed(() => ({
	ArrowUp: '↑',
	ArrowDown: '↓',
	ArrowLeft: '←',
	ArrowRight: '→',
	Control: !props.mac
		? t('Ctrl') // TRANSLATORS: Ctrl key on keyboard (Windows/Linux)
		: '⌘',
	Alt: !props.mac
		? t('Alt') // TRANSLATORS: Alt key on keyboard (Windows/Linux)
		: '⌥',
	Shift: !props.mac
		? t('Shift') // TRANSLATORS: Shift key on keyboard
		: '⇧',
	Enter: !props.mac
		? t('Enter') // TRANSLATORS: Enter key on keyboard
		: '⏎',
	Tab: !props.mac
		? t('Tab') // TRANSLATORS: Tab key on keyboard
		: '⇥',
	Delete: !props.mac
		? t('Delete') // TRANSLATORS: Delete key on keyboard
		: '⌫',
	Escape: !props.mac
		? t('Escape') // TRANSLATORS: Escape key on keyboard
		: '⎋',
	Space: t('Space'), // TRANSLATORS: Space key on keyboard
} as const))

const label = computed(() => (props.symbol && labels.value[props.symbol]) || props.symbol)
</script>

<template>
	<kbd :class="$style.kbd">
		<slot>
			{{ label }}
		</slot>
	</kbd>
</template>

<style lang="scss" module>
.kbd {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: var(--default-clickable-area);
	height: var(--default-clickable-area);
	padding-inline: calc(2 * var(--default-grid-baseline)) calc(2 * var(--default-grid-baseline));
	border: 2px solid var(--color-primary-element-light);
	border-block-end-width: 4px;
	border-radius: var(--border-radius-element);
	box-shadow: none; /* Override server <kbd> styles */
	font-family: var(--font-family); /* Design decision: looks better with the default font instead of mono */
	line-height: 1;
	white-space: nowrap;

	& + .kbd {
		margin-inline-start: calc(1 * var(--default-grid-baseline));
	}
}
</style>

<docs>
Nextcloud-styled `<kbd>` element. It can be used with a single key symbol in the content or with the `symbol` prop (preferred).

Subsequent `<NcKbd>` elements will have a small margin between them.

```vue
<template>
	<div>
		<NcKbd symbol="Control" />
		<NcKbd symbol="F" />
	</div>
</template>
```

### Special symbols

It is recommended to use the `symbol` prop. It displays the appropriate symbol or localized name depending on the OS.
OS detection is automatic but can be overridden via the `mac` prop.

```vue
<template>
	<table class="sample-table">
		<tr>
			<th>symbol</th>
			<th>Auto</th>
			<th>macOS</th>
			<th>Windows/Linux</th>
		</tr>
		<tr>
			<th>ArrowUp</th>
			<td><NcKbd symbol="ArrowUp" /></td>
			<td><NcKbd symbol="ArrowUp" :mac="true" /></td>
			<td><NcKbd symbol="ArrowUp" :mac="false" /></td>
		</tr>
		<tr>
			<th>ArrowDown</th>
			<td><NcKbd symbol="ArrowDown" /></td>
			<td><NcKbd symbol="ArrowDown" :mac="true" /></td>
			<td><NcKbd symbol="ArrowDown" :mac="false" /></td>
		</tr>
		<tr>
			<th>ArrowLeft</th>
			<td><NcKbd symbol="ArrowLeft" /></td>
			<td><NcKbd symbol="ArrowLeft" :mac="true" /></td>
			<td><NcKbd symbol="ArrowLeft" :mac="false" /></td>
		</tr>
		<tr>
			<th>ArrowRight</th>
			<td><NcKbd symbol="ArrowRight" /></td>
			<td><NcKbd symbol="ArrowRight" :mac="true" /></td>
			<td><NcKbd symbol="ArrowRight" :mac="false" /></td>
		</tr>
		<tr>
			<th>Control</th>
			<td><NcKbd symbol="Control" /></td>
			<td><NcKbd symbol="Control" :mac="true" /></td>
			<td><NcKbd symbol="Control" :mac="false" /></td>
		</tr>
		<tr>
			<th>Alt</th>
			<td><NcKbd symbol="Alt" /></td>
			<td><NcKbd symbol="Alt" :mac="true" /></td>
			<td><NcKbd symbol="Alt" :mac="false" /></td>
		</tr>
		<tr>
			<th>Shift</th>
			<td><NcKbd symbol="Shift" /></td>
			<td><NcKbd symbol="Shift" :mac="true" /></td>
			<td><NcKbd symbol="Shift" :mac="false" /></td>
		</tr>
		<tr>
			<th>Enter</th>
			<td><NcKbd symbol="Enter" /></td>
			<td><NcKbd symbol="Enter" :mac="true" /></td>
			<td><NcKbd symbol="Enter" :mac="false" /></td>
		</tr>
		<tr>
			<th>Tab</th>
			<td><NcKbd symbol="Tab" /></td>
			<td><NcKbd symbol="Tab" :mac="true" /></td>
			<td><NcKbd symbol="Tab" :mac="false" /></td>
		</tr>
		<tr>
			<th>Delete</th>
			<td><NcKbd symbol="Delete" /></td>
			<td><NcKbd symbol="Delete" :mac="true" /></td>
			<td><NcKbd symbol="Delete" :mac="false" /></td>
		</tr>
		<tr>
			<th>Escape</th>
			<td><NcKbd symbol="Escape" /></td>
			<td><NcKbd symbol="Escape" :mac="true" /></td>
			<td><NcKbd symbol="Escape" :mac="false" /></td>
		</tr>
		<tr>
			<th>Space</th>
			<td><NcKbd symbol="Space" /></td>
			<td><NcKbd symbol="Space" :mac="true" /></td>
			<td><NcKbd symbol="Space" :mac="false" /></td>
		</tr>
	</table>
</template>

<style scoped>
.sample-table {
	border-collapse: collapse;

	th,
	td {
		padding-inline: calc(2 * var(--default-grid-baseline));
		padding-block: calc(1 * var(--default-grid-baseline));
	}

	tr:first-child {
		border-block-end: 2px solid var(--color-border);

		th {
			font-weight: bold;
		}
	}
}
</style>
```

### Custom content

In a special case you might want to use a custom content.

```vue
<template>
	<NcKbd aria-label="Eject">
		<IconEject :size="15" />
	</NcKbd>
</template>

<script>
import IconEject from 'vue-material-design-icons/Eject.vue'

export default {
	components: { IconEject }
}
</script>
```
</docs>
