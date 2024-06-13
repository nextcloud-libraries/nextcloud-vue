/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { isFullscreenState } from '../../composables/useIsFullscreen/index.js'

export default {
	computed: {
		/**
		 * @deprecated Is to be removed in v9.0.0 with Vue 3 migration.
		 *             Use `composables/useIsFullscreen` instead.
		 */
		isFullscreen() {
			return isFullscreenState.value
		},
	},
}
