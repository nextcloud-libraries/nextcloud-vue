const stylelintConfig = require('@nextcloud/stylelint-config')

module.exports = {
	extends: ['@nextcloud/stylelint-config'],
	rules: {
		// For CSS Modules
		// If there will be more rules for CSS Modules - consider extending stylelint-config-css-modules
		'selector-pseudo-class-no-unknown': [
			true,
			{
				ignorePseudoClasses: [
					...stylelintConfig.rules['selector-pseudo-class-no-unknown'][1]
						.ignorePseudoClasses,
					'global',
				],
			},
		],
	},
}
