/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { relative } from 'node:path'
import { listComponents, ROOT } from '../.vitepress/lib/components.ts'
import { renderComponentPage } from '../.vitepress/lib/pages.ts'

export default {
	watch: ['../../src/components/**/*.vue', '../../src/components/index.ts'],

	async paths() {
		const components = listComponents()
		const names = new Set(components.map(({ name }) => name))
		return Promise.all(components.map(async (component) => ({
			params: {
				component: component.name,
				source: relative(ROOT, component.file),
			},
			content: await renderComponentPage(component, names),
		})))
	},
}
