<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch } from 'vue'
import NcVersionSelect from './NcVersionSelect.vue'

const { isDark } = useData()
const router = useRouter()

onMounted(() => {
	// Apply the dark Nextcloud theme matching the theme of the docs.
	// The light theme is the default theme, so it needs no attribute.
	watch(isDark, () => {
		document.body.toggleAttribute('data-theme-dark', isDark.value)
	}, { immediate: true })

	redirectLegacyRoute()
})

/**
 * Redirect routes of the old documentation, like `/#/Components/NcButton` or `/#/Components/NcActions?id=ncactionbutton`.
 */
function redirectLegacyRoute() {
	const [path, query] = window.location.hash.match(/^#\/([^?]+)(?:\?(.*))?$/)?.slice(1) ?? []
	if (!path) {
		return
	}

	const [section = '', name] = path.split('/')
	const id = new URLSearchParams(query).get('id')
	if (section === 'Components') {
		// Pages of component groups are linked with the id of the component
		const component = id?.match(/^nc[a-z]+/)
			? id.replace(/-\d+$/, '')
			: name
		router.go(`/components/${resolveComponentName(component ?? '')}`)
	} else if (['Composables', 'Directives', 'Functions'].includes(section)) {
		router.go(`/${section.toLowerCase()}${name ? `/${name}` : ''}`)
	}
}

/**
 * Resolve the case of a component name from a lowercase id
 *
 * @param name - The (lowercase) name
 */
function resolveComponentName(name: string): string {
	const link = [...document.querySelectorAll<HTMLAnchorElement>('.VPSidebar a[href*="/components/"]')]
		.find((a) => a.pathname.split('/').pop()?.toLowerCase() === name.toLowerCase())
	return link?.pathname.split('/').pop() ?? name
}
</script>

<template>
	<DefaultTheme.Layout>
		<template #nav-bar-content-after>
			<NcVersionSelect />
		</template>
		<template #nav-screen-content-after>
			<NcVersionSelect />
		</template>
	</DefaultTheme.Layout>
</template>
