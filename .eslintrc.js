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
		'src/components/NcAppContent*/*.vue',
		'src/components/NcAppNavigation*/*.vue',
		'src/components/NcAppSettings*/*.vue',
		'src/components/NcAppSidebar*/*.vue',
		'src/components/NcDashboard*/*.vue',
		'src/components/NcRelatedResourcesPanel*/*.vue',
		'src/components/NcRich*/**/*.vue',
		'src/components/NcUserBubble*/*.vue',
		'src/components/NcVNodes*/*.vue',
	],
	parserOptions: {
		babelOptions: {
			plugins: [
				'@babel/plugin-syntax-import-assertions',
			],
		},
	},
}
