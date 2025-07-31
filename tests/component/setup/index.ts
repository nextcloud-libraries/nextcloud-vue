/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { RouteRecordRaw } from 'vue-router'

import { beforeMount } from '@playwright/experimental-ct-vue/hooks'
import { createMemoryHistory, createRouter } from 'vue-router'

// Visual setup
import '../../../styleguide/assets/additional.css'
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
