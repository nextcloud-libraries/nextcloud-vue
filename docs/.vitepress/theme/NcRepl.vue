<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { ReplStore } from '@vue/repl'
import type { ReplManifest } from '../lib/replBundle.ts'

import { Repl, useStore, useVueImportMap } from '@vue/repl'
import CodeMirror from '@vue/repl/codemirror-editor'
import { useData, withBase } from 'vitepress'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { serverElementsHtml } from '../runtime/mocks.js'
import { getSelectedVersion } from '../runtime/nextcloudVersion.js'

const props = withDefaults(defineProps<{
	/** The initial code of the example */
	code: string
	/** Serialized state of the REPL (see `ReplStore.serialize`) */
	state?: string
	/** Layout of editor and preview */
	layout?: 'horizontal' | 'vertical'
}>(), {
	state: undefined,
	layout: 'vertical',
})

const emit = defineEmits<{
	/** The code of the REPL was changed */
	change: [state: string]
}>()

const MAIN_FILE = 'App.vue'

const { isDark } = useData()
const store = shallowRef<ReplStore>()
const error = ref<string>()
const manifest = shallowRef<ReplManifest>()

/**
 * Absolute URL of a file of the REPL bundle
 *
 * @param file - The path within the REPL bundle
 */
const replUrl = (file: string) => new URL(withBase(`/repl/${file}`), window.location.href).href

const previewOptions = computed(() => ({
	headHTML: [
		...(manifest.value?.serverStyles[getSelectedVersion().id] ?? []).map((file) => `<link rel="stylesheet" href="${replUrl(file)}">`),
		...(manifest.value?.styles ?? []).map((file) => `<link rel="stylesheet" href="${replUrl(file)}">`),
		...(manifest.value?.scripts ?? []).map((file) => `<script src="${replUrl(file)}">${'<'}/script>`),
		`<style>
			body { margin: 0; padding: 16px; background: var(--color-main-background); color: var(--color-main-text); font-family: var(--font-face); font-size: var(--default-font-size); line-height: var(--default-line-height); }
			html { height: auto; position: static; background: var(--color-main-background); }
			body { height: auto; position: static; overflow: auto; }
		</style>`,
	].join('\n'),
	bodyHTML: `<div id="skip-actions"></div>${serverElementsHtml()}`,
	customCode: {
		importCode: 'import { install as __ncInstall } from \'@nextcloud/vue-docs/runtime\'',
		useCode: `__ncInstall(app)
			document.body.toggleAttribute('data-theme-dark', ${isDark.value})`,
	},
}))

onMounted(async () => {
	try {
		const response = await fetch(replUrl('repl.json'))
		if (!response.ok) {
			throw new Error(`The REPL bundle is not available (${response.status}), run \`npm run docs:repl\` to build it.`)
		}
		manifest.value = await response.json() as ReplManifest
	} catch (err) {
		error.value = err instanceof Error ? err.message : String(err)
		return
	}

	const imports = Object.fromEntries(Object.entries(manifest.value.importMap.imports)
		.map(([specifier, file]) => [specifier, replUrl(file)]))

	const { importMap: vueImportMap, vueVersion } = useVueImportMap({
		runtimeDev: imports.vue,
		runtimeProd: imports.vue,
		serverRenderer: imports.vue,
	})

	const replStore = useStore({
		builtinImportMap: computed(() => ({ imports: { ...vueImportMap.value.imports, ...imports } })),
		vueVersion,
		resourceLinks: ref({
			// All supported browsers support import maps, so no shim is needed
			esModuleShims: 'data:text/javascript,',
		}),
	}, props.state)

	if (!props.state) {
		await replStore.setFiles({ [MAIN_FILE]: props.code }, MAIN_FILE)
	}
	store.value = replStore

	watch(() => replStore.serialize(), (state) => emit('change', state), { immediate: true })
})

/**
 * Restore the original code of the example
 */
async function reset() {
	await store.value?.setFiles({ [MAIN_FILE]: props.code }, MAIN_FILE)
}

defineExpose({ reset })
</script>

<template>
	<div class="nc-repl" :class="`nc-repl--${layout}`">
		<p v-if="error" class="nc-repl__error" role="alert">
			{{ error }}
		</p>
		<p v-else-if="!store" class="nc-repl__loading">
			Loading editor…
		</p>
		<Repl
			v-else
			:store="store"
			:editor="CodeMirror"
			:theme="isDark ? 'dark' : 'light'"
			:layout="layout"
			:previewOptions="previewOptions"
			:showCompileOutput="false"
			:showImportMap="false"
			:showTsConfig="false"
			:clearConsole="true"
			:autoResize="true" />
	</div>
</template>

<style>
.nc-repl {
	height: 720px;
}

.nc-repl .vue-repl {
	height: 100%;
	/* Use the colors of the docs */
	--color-branding: var(--vp-c-brand-1);
	--color-branding-dark: var(--vp-c-brand-2);
}

.nc-repl__error,
.nc-repl__loading {
	padding: 20px;
	margin: 0 !important;
}

.nc-repl__error {
	color: var(--vp-c-danger-1);
}
</style>
