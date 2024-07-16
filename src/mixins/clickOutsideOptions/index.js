/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// An empty comment below is needed to prevent styleguidist from using SPDX header as a mixin=component description in docs
/** */
export default {
	props: {
		/**
		 * A query-selector or an array of query-selectors
		 * to be ignored when clicking outside an element
		 */
		excludeClickOutsideSelectors: {
			type: [String, Array],
			default: () => [],
		},
	},
	computed: {
		clickOutsideOptions() {
			const excludedQuerySelectors = Array.isArray(this.excludeClickOutsideSelectors)
				? this.excludeClickOutsideSelectors
				: [this.excludeClickOutsideSelectors]

			return { ignore: excludedQuerySelectors }
		},
	},
}
