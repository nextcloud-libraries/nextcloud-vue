/**
 * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

const stylelintConfig = require('@nextcloud/stylelint-config')

module.exports = {
	extends: ['@nextcloud/stylelint-config'],
	plugins: ['stylelint-use-logical'],
	rules: {
		// For CSS Modules
		// If there will be more rules for CSS Modules - consider extending stylelint-config-css-modules
		'selector-pseudo-class-no-unknown': [
			true,
			{
				ignorePseudoClasses: [...stylelintConfig.rules['selector-pseudo-class-no-unknown'][1].ignorePseudoClasses, 'global'],
			},
		],
		'csstools/use-logical': [
			'always',
			{
				severity: 'warning',
				// Only lint LTR-RTL properties for now
				except: [
					// Position properties
					'top',
					'bottom',
					// Position properties with directional suffixes
					/-top$/,
					/-bottom$/,
					// Size properties
					'width',
					'max-width',
					'min-width',
					'height',
					'max-height',
					'min-height',
				],
			},
		],
	},
}
