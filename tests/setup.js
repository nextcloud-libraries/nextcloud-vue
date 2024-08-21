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
