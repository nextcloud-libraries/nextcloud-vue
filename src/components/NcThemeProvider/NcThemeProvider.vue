<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This components allows to enforce a color theme on its content,
for example enforce the content to be always rendered in dark theme regardless of browser or user config.

### Example
```vue
<template>
	<NcThemeProvider class="wrapper" :dark="userTheme === 'dark'">
		<div class="controls">
			<fieldset>
				<legend>
					User theme
				</legend>
				<div class="controls__select">
					<NcCheckboxRadioSwitch
						v-model="userTheme"
						type="radio"
						value="dark">
						Dark
					</NcCheckboxRadioSwitch>
					<NcCheckboxRadioSwitch
						v-model="userTheme"
						type="radio"
						value="light">
						Light
					</NcCheckboxRadioSwitch>
				</div>
			</fieldset>
			<fieldset>
				<legend>
					NcThemeProvider theme
				</legend>
				<div class="controls__select">
					<NcCheckboxRadioSwitch
						v-model="providerTheme"
						type="radio"
						value="default">
						None (default)
					</NcCheckboxRadioSwitch>
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
		</div>
		<p class="theme-preview">
			This is shown in user theme
		</p>
		<NcThemeProvider
			:dark="providerTheme === 'dark'"
			:light="providerTheme === 'light'">
			<div class="theme-preview">
				This is shown in the overridden theme.
			</div>
		</NcThemeProvider>
	</NcThemeProvider>
</template>
<script>
export default {
	data() {
		return {
			userTheme: 'light',
			providerTheme: 'default',
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
	flex-wrap: wrap;
	gap: 2lh;
}

.controls__select {
	display: flex;
	flex-direction: row;
	gap: var(--default-grid-baseline);
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
</docs>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { KEY_ENFORCE_THEME } from '../../composables/useIsDarkTheme/index.ts'

const props = defineProps<{
	/**
	 * Enforce the dark theme for the content.
	 */
	dark?: boolean

	/**
	 * Enforce the light theme for the content
	 */
	light?: boolean
}>()

const theme = computed(() => {
	if (props.dark) {
		return 'dark'
	} else if (props.light) {
		return 'light'
	}
	return ''
})
provide(KEY_ENFORCE_THEME, theme)

const dataTheme = computed(() => {
	if (theme.value) {
		return { [`data-theme-${theme.value}`]: true }
	}
	return {}
})
</script>

<template>
	<div v-bind="dataTheme">
		<slot />
	</div>
</template>
