/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { vi } from 'vitest'
import OC from './OC.js'

vi.stubGlobal('OC', OC)
vi.stubGlobal('appName', 'nextcloud-vue')

vi.stubGlobal('PRODUCTION', false)
vi.stubGlobal('SCOPE_VERSION', 1)
vi.stubGlobal('TRANSLATIONS', [])
