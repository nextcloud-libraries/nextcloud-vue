/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'vite'

import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import postcss from 'postcss'
import { NEXTCLOUD_VERSIONS } from '../runtime/nextcloudVersion.js'
import { scopeServerStyles } from './scopeServerStyles.ts'
import { SERVER_STYLE_FILES, serverStylesDir } from './viteShared.ts'

const VIRTUAL_ID = 'virtual:nextcloud-server-styles'

/** Path the styles are served from, relative to the base */
const STYLES_PATH = 'server-styles/'

/** Global styles of the server, which are scoped to the examples (see `scopeServerStyles`) */
const SCOPED_FILES = /^(server|apps|icons)\.css$/

/**
 * Build the styles of the server of a version as a single style sheet
 *
 * @param id - The id of the version
 * @param base - The base path of the documentation
 */
async function buildServerStyles(id: string, base: string): Promise<string> {
	const scope = postcss([scopeServerStyles(/./)])
	const parts: string[] = []
	for (const file of SERVER_STYLE_FILES) {
		const path = join(serverStylesDir(id), file)
		// `server.css` imports the icons
		const css = readFileSync(path, 'utf8')
			.replace(/@import\s*["']\.\/icons\.css["'];?/, () => readFileSync(join(serverStylesDir(id), 'icons.css'), 'utf8'))
		parts.push(SCOPED_FILES.test(file) ? (await scope.process(css, { from: path })).css : css)
	}
	// The images are served from the root of the documentation (public directory)
	return parts.join('\n').replace(/url\((['"]?)\.\.\/img\//g, `url($1${base}`)
}

/**
 * Styles of the Nextcloud server of the simulated version.
 *
 * The styles of all versions together are too large to be bundled, so the styles of every version
 * are a separate style sheet. `virtual:nextcloud-server-styles` exports `loadServerStyles(id)`
 * to load the style sheet of a version.
 * The style sheets are served by the dev server, for the build they are written by `writeServerStyles`.
 * They must not be part of the bundle, as VitePress would load them as styles of all pages.
 */
export function serverStylesPlugin(): Plugin {
	let base = '/'
	const cache = new Map<string, Promise<string>>()
	const getStyles = (id: string) => {
		if (!cache.has(id)) {
			cache.set(id, buildServerStyles(id, base))
		}
		return cache.get(id)!
	}

	return {
		name: 'nextcloud-vue-docs:server-styles',

		configResolved(config) {
			base = config.base
		},

		configureServer(server) {
			server.middlewares.use(`${base}${STYLES_PATH}`, async (req, res, next) => {
				const id = req.url?.match(/^\/([\w-]+)\.css/)?.[1]
				if (!id || !NEXTCLOUD_VERSIONS.some((version) => version.id === id)) {
					return next()
				}
				cache.delete(id)
				res.setHeader('Content-Type', 'text/css')
				res.end(await getStyles(id))
			})
		},

		resolveId(id) {
			if (id === VIRTUAL_ID) {
				return '\0' + id
			}
		},

		async load(id) {
			if (id !== '\0' + VIRTUAL_ID) {
				return
			}
			// Bust the cache of the style sheets when they change
			const hashes: Record<string, string> = {}
			for (const { id } of NEXTCLOUD_VERSIONS) {
				hashes[id] = createHash('sha256').update(await getStyles(id)).digest('hex').slice(0, 8)
			}
			return `const hashes = ${JSON.stringify(hashes)}
export function loadServerStyles(id) {
	return new Promise((resolve) => {
		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.href = ${JSON.stringify(`${base}${STYLES_PATH}`)} + id + '.css?v=' + hashes[id]
		link.onload = link.onerror = () => resolve()
		document.head.appendChild(link)
	})
}
`
		},
	}
}

/**
 * Write the style sheets of all versions to the built documentation
 *
 * @param outDir - The output directory of the documentation
 * @param base - The base path of the documentation
 */
export async function writeServerStyles(outDir: string, base: string) {
	mkdirSync(join(outDir, STYLES_PATH), { recursive: true })
	for (const { id } of NEXTCLOUD_VERSIONS) {
		writeFileSync(join(outDir, STYLES_PATH, `${id}.css`), await buildServerStyles(id, base))
	}
}
