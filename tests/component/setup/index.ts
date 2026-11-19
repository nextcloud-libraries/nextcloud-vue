/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { RouteRecordRaw } from 'vue-router'

import { beforeMount } from '@playwright/experimental-ct-vue/hooks'
import { createMemoryHistory, createRouter } from 'vue-router'

// Visual setup
import '../../../docs/assets/default.css'
import '../../../docs/assets/dark.css'
import '../../../docs/assets/server.css'
import '../../../docs/assets/apps.css'
import '@fontsource/roboto/index.css'
import './index.css'

export type HooksConfig = {
	routes?: RouteRecordRaw[]
}

beforeMount<HooksConfig>(async ({ hooksConfig, app }) => {
	const router = createRouter({
		routes: hooksConfig?.routes ?? [],
		history: createMemoryHistory(),
	})
	app.use(router)
})
