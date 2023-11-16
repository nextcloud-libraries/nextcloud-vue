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
	ignorePatterns: [
		'src/components/NcDashboard*/*.vue',
		'src/components/NcRich*/**/*.vue',
	],
	parserOptions: {
		babelOptions: {
			plugins: [
				'@babel/plugin-syntax-import-assertions',
			],
		},
	},
}
