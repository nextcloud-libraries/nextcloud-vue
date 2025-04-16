/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Focus, Linkify } from '../src/directives/index.ts'

// The export here MUST be default or module.export
// this is what is imported by the styleguide
export default (app) => {
	app.directive('focus', Focus)
	app.directive('linkify', Linkify)
}
