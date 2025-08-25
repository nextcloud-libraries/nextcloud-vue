/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

module.exports = {
	globals: {
		EMOJIS: true,
		PRODUCTION: true,
		SCOPE_VERSION: true,
		TRANSLATIONS: true,
		oc_userconfig: true,
		appName: true,
		appVersion: true,
	},
	extends: [
		'@nextcloud',
	],
	plugins: [
		'cypress',
	],
	parserOptions: {
		babelOptions: {
			plugins: [
				'@babel/plugin-syntax-import-assertions',
			],
		},
	},
	rules: {
		'import/no-unresolved': [
			'error',
			{
				ignore: ['\\?raw$'],
			},
		],
	},
	overrides: [
		{
			files: ['*.vue'],
			rules: {
				'no-irregular-whitespace': 'off',
				'vue/no-irregular-whitespace': 'error',
			},
		},
	],
}
