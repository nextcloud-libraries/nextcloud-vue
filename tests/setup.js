/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import OC from './OC.js'

// TODO: Remove when we support Node 22
import 'core-js/actual/promise/with-resolvers.js'

global.OC = OC
global.appName = 'nextcloud-vue'

global.PRODUCTION = false
global.SCOPE_VERSION = 1
global.TRANSLATIONS = []

// structuredClone polyfill
if (typeof globalThis.structuredClone === 'undefined') {
	globalThis.structuredClone = function(obj) {
		if (obj === null || typeof obj !== 'object') {
			return obj
		}
		if (obj instanceof Date) {
			return new Date(obj)
		}
		if (Array.isArray(obj) instanceof Array) {
			return obj.map((item) => globalThis.structuredClone(item))
		}

		const copy = {}
		Object.keys(obj).forEach((key) => {
			copy[key] = globalThis.structuredClone(obj[key])
		})

		return Object.fromEntries(
			Object
				.entries(obj)
				.map(([key, value]) => [key, globalThis.structuredClone(value)]),
		)
	}
}
