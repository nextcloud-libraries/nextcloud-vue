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
	extends: ['@nextcloud', 'prettier'],
	plugins: ['cypress'],
	parserOptions: {
		babelOptions: {
			plugins: ['@babel/plugin-syntax-import-assertions'],
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
			files: ['**/*.vue'],
			rules: {
				'vue/first-attribute-linebreak': 'off',
			},
		},
	],
}
