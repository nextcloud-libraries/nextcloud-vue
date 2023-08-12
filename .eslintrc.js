/**
 * @type {import('eslint').ESLint.ConfigData}
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
		'@nextcloud/eslint-config/typescript',
	],
	plugins: [
		'cypress',
	],
	overrides: [
		{
			files: ['**/*.vue', '**/*.ts'],
			rules: {
				// Note: you must disable the base rule as it can report incorrect errors
				'func-call-spacing': 'off',
				'@typescript-eslint/func-call-spacing': 'error',
			},
		},
	],
	parserOptions: {
		babelOptions: {
			plugins: [
				'@babel/plugin-syntax-import-assertions',
			],
		},
	},
}
