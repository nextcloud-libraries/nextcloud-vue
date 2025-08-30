/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

function ScopeComponent(Component) {
	// Init mounted vue if none
	if (!Component.mounted) {
		Component.mounted = []
	} else if (!Array.isArray(Component.mounted)) {
		Component.mounted = [Component.mounted]
	}

	// Inject root scoping function
	Component.mounted.push(function() {
		this.$el.setAttribute(`data-v-${SCOPE_VERSION}`, '')
	})
}

export default ScopeComponent
