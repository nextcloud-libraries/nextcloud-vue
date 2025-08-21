/**
 * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

const stylelintConfig = require('@nextcloud/stylelint-config')

module.exports = {
	extends: ['@nextcloud/stylelint-config'],
	rules: {
		// For CSS Modules
		// If there will be more rules for CSS Modules - consider extending stylelint-config-css-modules
		'selector-pseudo-class-no-unknown': [
			true,
			{
				ignorePseudoClasses: [...stylelintConfig.rules['selector-pseudo-class-no-unknown'][1].ignorePseudoClasses, 'global', 'slotted'],
			},
		],
		'scss/load-partial-extension': ['always'],
	},
}
