/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Linkify from '../../utils/Linkify.js'

// Use function shorthand for same behavior on bind and update
// https://vuejs.org/v2/guide/custom-directive.html#Function-Shorthand
export function directive(el, binding) {
	if (binding.value?.linkify === true) {
		el.innerHTML = Linkify(binding.value.text)
	}
}

export default directive
