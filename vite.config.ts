/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import type { UserConfigFn } from 'vite'

import { createLibConfig } from '@nextcloud/vite-config'
import { globSync } from 'glob'
import { join, resolve } from 'node:path'
import { defineConfig } from 'vite'
import vueDocsPlugin from './build/docs-plugin.ts'
import l10nPlugin from './build/l10n-plugin.mjs'

// Entry points which we build using vite
const entryPoints = {
	...globSync('src/@(components|composables|directives|functions)/*/index.@(js|ts)')
		.reduce((acc, item) => {
			const name = item
				.replace('src/', '')
				.replace(/\/index\.(j|t)s$/, '/index')
			acc[name] = join(import.meta.dirname, item)
			return acc
		}, {}),

	index: resolve(import.meta.dirname, 'src/index.ts'),
}

// Customizations for the vite config
const overrides = defineConfig({
	plugins: [
		vueDocsPlugin,
		l10nPlugin(resolve(import.meta.dirname, 'l10n')),
	],
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			scss: {
				additionalData: '@use "sass:math"; @use "variables" as *; @use "material-icons" as *;',
				loadPaths: [
					resolve(import.meta.dirname, 'src/assets'),
				],
			},
		},
	},
})

// We need a callback config so we can access the vite build mode
export default defineConfig((env) => {
	const createConfig = createLibConfig(entryPoints, {
		// Add our overrides to the config
		config: overrides,
		// Only create declarations for source files
		DTSPluginOptions: {
			tsconfigPath: 'src/tsconfig.json',
		},
		// By default all dependencies are external, but no path imports
		nodeExternalsOptions: {
			// Packages with paths imports should be added here to mark them as external as well
			include: [/^@nextcloud\/.+\//, /^@mdi\/svg\//],
			// Make sure to not provide uncompiled vue files as dependencies, this will break unit tests
			exclude: [/\.vue(\?|$)/],
		},
		// For backwards compatibility we include the css within the js files
		inlineCSS: true,
		// Only standard ESM
		libraryFormats: ['es'],
		replace: {
			PRODUCTION: JSON.stringify(env.mode === 'production'),
		},
	})

	return createConfig(env)
}) as UserConfigFn
