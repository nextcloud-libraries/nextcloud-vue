/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ObjectDirective } from 'vue'

const directive: ObjectDirective<HTMLElement> = {
	mounted(el: HTMLElement) {
		el.focus()
	},
}

export default directive
