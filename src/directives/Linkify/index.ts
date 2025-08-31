/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Directive } from 'vue'

import Linkify from '../../utils/Linkify.js'

const directive: Directive = (el, binding) => {
	if (binding.value?.linkify === true) {
		el.innerHTML = Linkify(binding.value.text)
	}
}

export default directive
