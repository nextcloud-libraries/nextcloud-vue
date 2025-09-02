<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
```vue
<template>
	<NcThemeProvider class="wrapper" :dark="userTheme === 'dark'">
			<fieldset class="controls">
				<legend>
					Color theme
				</legend>
				<NcCheckboxRadioSwitch
					v-model="providerTheme"
					type="radio"
					value="dark">
					Dark
				</NcCheckboxRadioSwitch>
				<NcCheckboxRadioSwitch
					v-model="providerTheme"
					value="light"
					type="radio">
					Light
				</NcCheckboxRadioSwitch>
			</div>
		</fieldset>
		<NcThemeProvider
			:dark="providerTheme === 'dark'"
			:light="providerTheme === 'light'">
			<div class="theme-preview">
				<NcAssistantIcon />
			</div>
		</NcThemeProvider>
	</NcThemeProvider>
</template>
<script>
export default {
	data() {
		return {
			providerTheme: 'light',
		}
	}
}
</script>
<style scoped>
.wrapper {
	background-color: var(--color-main-background);
	color: var(--color-main-text);
}

.controls {
	display: flex;
	justify-content: center;
	gap: 2lh;
}

legend {
	width: 100%;
	text-align: center;
}

.theme-preview {
	background-color: var(--color-main-background);
	color: var(--color-main-text);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 0.5lh;
	min-height: 2lh;
}
</style>
```

### Usage as inline icon
```vue
<template>
	<p>
		Lorem ipsum dolor sit amet <NcAssistantIcon inline /> consetetur sadipscing elitr.
	</p>
</template>
```
</docs>

<script setup lang="ts">
import { mdiCreation } from '@mdi/js'
import { computed } from 'vue'
import { useIsDarkTheme } from '../../composables/useIsDarkTheme/index.ts'
import { createElementId } from '../../utils/createElementId.ts'

const props = withDefaults(defineProps<{
	/**
	 * Set if the icon should be used as inline content e.g. within text.
	 * By default the icon is made a block element for use inside `icon`-slots.
	 */
	inline?: boolean

	/**
	 * Size of the icon.
	 * Defaults to the proper size to be used in buttons and other interactive elements
	 * like all `Nc*` components with an icon slot.
	 */
	size?: number
}>(), {
	size: 20,
})

const isDarkTheme = useIsDarkTheme()
const gradientId = createElementId()
const sizePx = computed(() => `${props.size}px`)
</script>

<template>
	<span
		aria-hidden="true"
		:class="[$style.assistantIcon, inline && $style.assistantIcon_inline]"
		role="img">
		<svg :class="$style.assistantIcon__svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient v-if="isDarkTheme" :id="gradientId" gradientTransform="rotateX(285)">
					<stop offset="15%" stop-color="#CDACE7" />
					<stop offset="40%" stop-color="#008FDB" />
					<stop offset="82%" stop-color="#A180E0" />
				</linearGradient>
				<linearGradient v-else :id="gradientId" gradientTransform="rotateX(285)">
					<stop offset="15%" stop-color="#9669D3" />
					<stop offset="40%" stop-color="#00679E" />
					<stop offset="80%" stop-color="#492083" />
				</linearGradient>
			</defs>
			<path :d="mdiCreation" :fill="`url('#${gradientId}')`" />
		</svg>
	</span>
</template>

<style module lang="scss">
.assistantIcon {
	display: inline-flex;
	align-items: center;
	justify-content: center;

	&:not(&_inline) {
		display: flex;
		min-height: var(--default-clickable-area);
		min-width: var(--default-clickable-area);
	}

	&__svg {
		display: inline-block;
		width: v-bind('sizePx');
		height: v-bind('sizePx');
		max-width: v-bind('sizePx');
		max-height: v-bind('sizePx');
	}
}
</style>
