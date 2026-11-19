<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Component } from 'vue'

import { withBase } from 'vitepress'
import { defineAsyncComponent, onErrorCaptured, onMounted, ref, useTemplateRef } from 'vue'

defineProps<{
	/** The source code of the example (SFC) */
	code: string
	/** The compiled example */
	component: Component
}>()

const NcRepl = defineAsyncComponent(() => import('./NcRepl.vue'))

const showCode = ref(false)
const editing = ref(false)
const replState = ref('')
const error = ref<Error>()
const repl = useTemplateRef<{ reset: () => Promise<void> }>('repl')

// The examples are only rendered in the browser, as the library requires a browser environment
const isMounted = ref(false)
onMounted(() => {
	isMounted.value = true
})

onErrorCaptured((err) => {
	error.value = err instanceof Error ? err : new Error(String(err))
	// Do not break the whole page because of a broken example
	return false
})
</script>

<template>
	<div class="nc-example">
		<NcRepl
			v-if="editing"
			ref="repl"
			:code="code"
			@change="replState = $event" />
		<div v-else class="nc-example__preview nc-example-scope vp-raw">
			<div v-if="error" class="nc-example__error" role="alert">
				{{ error.message }}
			</div>
			<component :is="component" v-else-if="isMounted" />
		</div>

		<div class="nc-example__toolbar">
			<template v-if="editing">
				<button type="button" @click="repl?.reset()">
					Reset
				</button>
				<a
					v-if="replState"
					class="nc-example__link"
					:href="withBase('/playground') + replState"
					target="_blank">
					Open in playground
				</a>
			</template>
			<button
				v-else
				type="button"
				:aria-expanded="showCode"
				@click="showCode = !showCode">
				{{ showCode ? 'Hide code' : 'View code' }}
			</button>
			<button type="button" :aria-pressed="editing" @click="editing = !editing">
				{{ editing ? 'Close editor' : 'Edit' }}
			</button>
		</div>

		<div v-show="showCode && !editing" class="nc-example__code">
			<slot />
		</div>
	</div>
</template>
