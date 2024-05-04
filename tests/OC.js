export default {
	debug: true,

	getLanguage() {
		return 'en-GB'
	},

	getLocale() {
		return 'en_GB'
	},

	isUserAdmin() {
		return true
	},

	Util: {
		naturalSortCompare(a, b) {
			return 0
		},
	},

	coreApps: ['', 'admin', 'log', 'core/search', 'core', '3rdparty'],

	appswebroots: {
		calendar: '/apps/calendar',
		deck: '/apps/deck',
		files: '/apps/files',
		spreed: '/apps/spreed',
	},
}
