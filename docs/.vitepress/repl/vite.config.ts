/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// Build of the library for the REPL of the documentation.
// The REPL runs the examples in the browser, so the library and the dependencies used by
// the examples are bundled as browser ES modules, which are loaded using an import map.

import type { Plugin } from 'vite'
import type { ReplManifest } from '../lib/replBundle.ts'

import vue from '@vitejs/plugin-vue'
import { globSync } from 'glob'
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename, dirname, join } from 'node:path'
import { defineConfig } from 'vite'
import { DOCS, ROOT } from '../lib/components.ts'
import { REPL_DEPENDENCIES as DEPENDENCIES, REPL_DIST } from '../lib/replBundle.ts'
import { defines, libraryAliases, libraryPlugins, scssOptions, SERVER_STYLES_DIR, serverStyleFiles, SRC } from '../lib/viteShared.ts'

const require = createRequire(import.meta.url)

/** Prefix of the virtual entry modules */
const VIRTUAL = 'virtual:repl/'

/**
 * Find all raw SVG icons of `@mdi/svg` used by the examples.
 * Raw imports (`?raw`) are a feature of bundlers, so a module is generated for every used icon.
 */
function findRawIcons(): string[] {
	const sources = [
		...globSync('src/components/*/*.vue', { cwd: ROOT }),
		...globSync('docs/**/*.md', { cwd: ROOT, ignore: ['docs/.vitepress/**'] }),
	].map((file) => readFileSync(join(ROOT, file), 'utf8'))
	const icons = new Set<string>()
	for (const source of sources) {
		for (const [, icon] of source.matchAll(/'@mdi\/svg\/svg\/([\w-]+)\.svg\?raw'/g)) {
			icons.add(icon!)
		}
	}
	return [...icons].sort()
}

const rawIcons = findRawIcons()

/** Entry points of the bundle: import map specifier -> [output name, module id] */
const entries: Record<string, [string, string]> = {
	'@nextcloud/vue': ['nextcloud-vue/index', join(SRC, 'index.ts')],
	'@nextcloud/vue-docs/runtime': ['runtime', join(DOCS, '.vitepress/runtime/repl.js')],
}
for (const file of globSync('src/@(components|composables|directives|functions)/*/index.@(js|ts)', { cwd: ROOT })) {
	const [, kind, name] = file.split('/')
	entries[`@nextcloud/vue/${kind}/${name}`] = [`nextcloud-vue/${kind}/${name}`, join(ROOT, file)]
}
for (const dependency of Object.keys(DEPENDENCIES)) {
	entries[dependency] = [`deps/${dependency.replace(/^@/, '').replaceAll('/', '-')}`, `${VIRTUAL}dep/${dependency}`]
}
for (const icon of rawIcons) {
	entries[`@mdi/svg/svg/${icon}.svg?raw`] = [`deps/mdi-svg/${icon}`, `${VIRTUAL}raw-icon/${icon}`]
}

/**
 * Virtual entry modules for dependencies and raw icons,
 * and the static files of the REPL (Vue, server styles, manifest)
 */
function replPlugin(): Plugin {
	let serverStyles: string[] = []

	return {
		name: 'nextcloud-vue-docs:repl',

		resolveId(id) {
			if (id.startsWith(VIRTUAL)) {
				return '\0' + id
			}
		},

		load(id) {
			if (!id.startsWith('\0' + VIRTUAL)) {
				return
			}
			const [kind, ...rest] = id.slice(VIRTUAL.length + 1).split('/')
			const name = rest.join('/')
			if (kind === 'dep') {
				return `export * from '${name}'\n${DEPENDENCIES[name] ? `export { default } from '${name}'\n` : ''}`
			}
			if (kind === 'raw-icon') {
				const svg = readFileSync(require.resolve(`@mdi/svg/svg/${name}.svg`), 'utf8')
				return `export default ${JSON.stringify(svg)}\n`
			}
		},

		transform(code, id) {
			// The REPL renders the examples in a `srcdoc` iframe, where the location is `about:srcdoc`.
			// So URLs are generated with the origin of the docs, which is the origin of the iframe.
			if (/@nextcloud\/router\/dist\//.test(id)) {
				return code.replaceAll('window.location.protocol + "//" + window.location.host', 'window.parent.location.origin')
			}
		},

		generateBundle() {
			// Vue with the template compiler, as the examples can use runtime templates
			this.emitFile({
				type: 'asset',
				fileName: 'vue.js',
				source: readFileSync(require.resolve('vue/dist/vue.esm-browser.js'), 'utf8'),
			})

			// Globals of the server, loaded as classic script before any module
			this.emitFile({
				type: 'asset',
				fileName: 'globals.js',
				source: readFileSync(join(DOCS, '.vitepress/runtime/globals.js'), 'utf8')
					.replaceAll('NEXTCLOUD_VERSION', defines.NEXTCLOUD_VERSION),
			})

			// Styles of the server, the images are served from the root of the docs
			const styles: string[] = []
			const emitted = new Set<string>()
			for (const file of [...serverStyleFiles, ...serverStyleFiles.map((file) => join(dirname(file), 'icons.css'))]) {
				const fileName = `server/${basename(file)}`
				if (emitted.has(fileName)) {
					continue
				}
				emitted.add(fileName)
				let source: string
				try {
					source = readFileSync(join(SERVER_STYLES_DIR, file), 'utf8')
				} catch {
					continue
				}
				this.emitFile({
					type: 'asset',
					fileName,
					source: source.replace(/url\((['"]?)\.\/img\//g, 'url($1../../'),
				})
				if (basename(file) !== 'icons.css') {
					styles.push(fileName)
				}
			}

			serverStyles = styles
		},

		// The manifest is written after all files are generated, as the styles of the library are emitted last
		writeBundle(options, bundle) {
			const libraryStyles = Object.keys(bundle).filter((file) => file.endsWith('.css') && !file.startsWith('server/'))
			const manifest: ReplManifest = {
				importMap: {
					imports: {
						vue: 'vue.js',
						...Object.fromEntries(Object.entries(entries).map(([specifier, [name]]) => [specifier, `${name}.js`])),
					},
				},
				styles: [...serverStyles, ...libraryStyles],
				scripts: ['globals.js'],
			}
			writeFileSync(join(options.dir!, 'repl.json'), JSON.stringify(manifest, null, '\t'))
		},
	}
}

export default defineConfig({
	root: ROOT,
	publicDir: false,
	logLevel: 'warn',

	plugins: [
		vue(),
		...libraryPlugins(),
		replPlugin(),
	],

	define: defines,

	resolve: {
		alias: libraryAliases,
	},

	css: {
		preprocessorOptions: {
			scss: scssOptions,
		},
	},

	build: {
		outDir: REPL_DIST,
		emptyOutDir: true,
		target: 'esnext',
		cssCodeSplit: false,
		modulePreload: false,
		reportCompressedSize: false,
		chunkSizeWarningLimit: 4096,
		rollupOptions: {
			input: Object.fromEntries(Object.values(entries)),
			external: ['vue'],
			preserveEntrySignatures: 'strict',
			output: {
				format: 'es',
				entryFileNames: '[name].js',
				chunkFileNames: 'chunks/[name]-[hash].js',
				assetFileNames: '[name][extname]',
			},
		},
	},
})
