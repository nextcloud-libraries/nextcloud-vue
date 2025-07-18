/*!
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
		return 'export default ""'
	},
}

export default vueDocsPlugin
