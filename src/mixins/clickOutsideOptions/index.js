/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

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
