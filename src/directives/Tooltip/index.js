/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { VTooltip, options } from 'floating-vue'
import './index.scss'

options.themes.tooltip.html = false
options.themes.tooltip.delay = { show: 500, hide: 200 }
options.themes.tooltip.distance = 10
options.themes.tooltip['arrow-padding'] = 3

export {
	/**
	 * @deprecated Use the native `title` attribute instead.
	 */
	VTooltip as default,
	options,
}
