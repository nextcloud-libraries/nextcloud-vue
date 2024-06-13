/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export default {
	beforeUpdate() {
		this.text = this.getText()
	},

	data() {
		return {
			// $slots are not reactive.
			// We need to update  the content manually
			text: this.getText(),
		}
	},

	computed: {
		isLongText() {
			return this.text && this.text.trim().length > 20
		},
	},

	methods: {
		getText() {
			return this.$slots.default?.()[0].children?.trim?.() || ''
		},
	},
}
