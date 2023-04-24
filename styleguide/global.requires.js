/* eslint-disable-next-line */
import 'core-js/stable'
/* eslint-disable-next-line */
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import VTooltip from './../src/directives/Tooltip'

/**
 * From server util.js
 *
 * @param {string} t The string to chunkify
 * @return {Array}
 */
function chunkify(t) {
	// Adapted from http://my.opera.com/GreyWyvern/blog/show.dml/1671288
	const tz = []
	let x = 0
	let y = -1
	let n = 0
	let c

	while (x < t.length) {
	  c = t.charAt(x) // only include the dot in strings

	  const m = !n && (c === '.' || (c >= '0' && c <= '9'))

	  if (m !== n) {
		// next chunk
			y++
			tz[y] = ''
			n = m
	  }

	  tz[y] += c
	  x++
	}

	return tz
}

window.OC = {
	getCurrentUser() {
		return {
			uid: 'admin',
			displayName: 'Administrator',
		}
	},
	generateUrl() {
		return 'https://nextcloud.com/wp-content/themes/next/assets/img/common/nextcloud-square-logo.png'
	},
	getLanguage() {
		return 'en'
	},
	isUserAdmin() {
		return true
	},
	config: {},
	Util: {
		/**
		 * Compare two strings to provide a natural sort
		 *
		 * @param {string} a first string to compare
		 * @param {string} b second string to compare
		 * @return {number} -1 if b comes before a, 1 if a comes before b
		 * or 0 if the strings are identical
		 */
		naturalSortCompare: function naturalSortCompare(a, b) {
			let x
			const aa = chunkify(a)
			const bb = chunkify(b)

			for (x = 0; aa[x] && bb[x]; x++) {
				if (aa[x] !== bb[x]) {
					const aNum = Number(aa[x])
					const bNum = Number(bb[x]) // note: == is correct here

					/* eslint-disable-next-line */
					if (aNum == aa[x] && bNum == bb[x]) {
						return aNum - bNum
					} else {
					// Note: This locale setting isn't supported by all browsers but for the ones
					// that do there will be more consistency between client-server sorting
						return aa[x].localeCompare(bb[x], OC.getLanguage())
					}
				}
			}

			return aa.length - bb.length
		},
	},
	coreApps: [
		'',
		'admin',
		'log',
		'core/search',
		'core',
		'3rdparty',
	],
	appswebroots: {
		calendar: '/apps/calendar',
		deck: '/apps/deck',
		files: '/apps/files',
		spreed: '/apps/spreed',
	},
	webroot: '',
}
window.OCA = {}
window.appName = 'nextcloud-vue'

Vue.prototype.OC = window.OC
Vue.prototype.OCA = window.OCA

window.NextcloudVueDocs = {
	tags: [
		{
			id: 1,
			displayName: 'secret',
			userVisible: true,
			userAssignable: false,
			canAssign: true,
		},
		{
			id: 2,
			displayName: 'tag2',
			userVisible: false,
			userAssignable: true,
			canAssign: true,
		},
		{
			id: 3,
			displayName: 'tag3',
			userVisible: true,
			userAssignable: true,
			canAssign: true,
		},
		{
			id: 4,
			displayName: 'important',
			userVisible: true,
			userAssignable: true,
			canAssign: true,
		},
		{
			id: 5,
			displayName: 'test',
			userVisible: true,
			userAssignable: false,
			canAssign: true,
		},
		{
			id: 6,
			displayName: 'test2',
			userVisible: false,
			userAssignable: false,
			canAssign: true,
		},
		{
			id: 7,
			displayName: 'tag1',
			userVisible: true,
			userAssignable: true,
			canAssign: true,
		},
	],
	lastUsedTagIds: [7, 2, 3, 4, 1, 5, 6],
}

Vue.directive('tooltip', VTooltip)
