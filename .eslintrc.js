module.exports = {
	globals: {
		EMOJIS: true,
		PRODUCTION: true,
		SCOPE_VERSION: true,
		TRANSLATIONS: true,
		oc_userconfig: true,
		appName: true,
		appVersion: true,
		TRANSLATIONS: true,
		SCOPE_VERSION: true,
	},
	extends: [
		'@nextcloud',
	],
	plugins: [
		'cypress',
	],
}
