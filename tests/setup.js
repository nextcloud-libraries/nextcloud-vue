/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { vi } from 'vitest'
import OC from './OC.js'

// TODO: Remove when we support Node 22
import 'core-js/actual/promise/with-resolvers.js'

vi.stubGlobal('OC', OC)
vi.stubGlobal('appName', 'nextcloud-vue')

vi.stubGlobal('PRODUCTION', false)
vi.stubGlobal('TRANSLATIONS', [])
