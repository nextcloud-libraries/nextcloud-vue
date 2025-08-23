/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Directive } from 'vue'

import { linkifyString } from '../../utils/linkify.ts'

const directive: Directive = function(el: HTMLElement, { value }) {
	if (value?.linkify === true) {
		el.innerHTML = linkifyString(value.text)
	}
}

export default directive
