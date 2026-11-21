/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// Environment of the documentation examples, used by the docs and by the REPL.
// The globals must be set up before any module of the library is loaded,
// as some of them read the environment when they are loaded.
import './globals.js'
import './mocks.js'

export { install } from './install.js'
