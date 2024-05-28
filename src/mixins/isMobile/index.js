/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { isMobileState } from '../../composables/useIsMobile/index.js'

export default {
	computed: {
		/**
		 * @deprecated Is to be removed in v9.0.0 with Vue 3 migration.
		 *             Use `composables/useIsMobile` instead.
		 */
		isMobile() {
			return isMobileState.value
		},
	},
}
