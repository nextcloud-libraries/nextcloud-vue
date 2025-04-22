/*!
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */
import type { Plugin } from 'vite'

/**
 * Plugin for stripping out <docs> sections from vue files
 */
const vueDocsPlugin: Plugin = {
	name: 'vue-docs-plugin',
	transform(code, id) {
		if (!/vue&type=doc/.test(id)) {
			return
		}
		return {
			code: 'export default ""',
			map: { mappings: '' },
		}
	},
}

export default vueDocsPlugin
