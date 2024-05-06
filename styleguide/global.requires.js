/* eslint-disable-next-line */
import 'core-js/stable'
import Vue from 'vue'
import VTooltip from './../src/directives/Tooltip/index.js'

import axios from '@nextcloud/axios'

const USER_GROUPS = [
	{ id: 'admin', displayname: 'The administrators' },
	{ id: 'accounting', displayname: 'Accounting team' },
	{ id: 'developer', displayname: 'Engineering team' },
	{ id: 'support', displayname: 'Support crew' },
	{ id: 'users', displayname: 'users' },
]

/**
 * Mock some requests for docs
 *
 * @param {object} error Axios error
 */
function mockRequests(error) {
	const { request } = error
	let data = null

	// Mock requesting groups
	const requestGroups = request.responseURL.match(
		/cloud\/groups\/details\?search=([^&]*)&limit=\d+$/,
	)
	if (requestGroups) {
		data = {
			groups: USER_GROUPS.filter(
				(e) =>
					!requestGroups[1] ||
					e.displayname.startsWith(requestGroups[1]) ||
					e.id.startsWith(requestGroups[1]),
			),
		}
	}

	if (data) {
		return Promise.resolve({ data: { ocs: { data } } })
	}
	return Promise.reject(error)
}

axios.interceptors.response.use(
	(r) => r,
	(e) => mockRequests(e),
)

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
	debug: true,
	getCurrentUser() {
		return {
			uid: 'admin',
			displayName: 'Administrator',
		}
	},
	generateUrl() {
		return 'https://raw.githubusercontent.com/nextcloud/promo/master/nextcloud-icon.png'
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
	coreApps: ['', 'admin', 'log', 'core/search', 'core', '3rdparty'],
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
	tags: '<?xml version="1.0"?><d:multistatus xmlns:d="DAV:" xmlns:s="http://sabredav.org/ns" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns"><d:response><d:href>/remote.php/dav/systemtags/</d:href><d:propstat><d:prop><oc:id/><oc:display-name/><oc:user-visible/><oc:user-assignable/><oc:can-assign/></d:prop><d:status>HTTP/1.1 404 Not Found</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/7</d:href><d:propstat><d:prop><oc:id>7</oc:id><oc:display-name>tag1</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>true</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/2</d:href><d:propstat><d:prop><oc:id>2</oc:id><oc:display-name>tag2</oc:display-name><oc:user-visible>false</oc:user-visible><oc:user-assignable>true</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/3</d:href><d:propstat><d:prop><oc:id>3</oc:id><oc:display-name>tag3</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>true</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/4</d:href><d:propstat><d:prop><oc:id>4</oc:id><oc:display-name>important</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>true</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/1</d:href><d:propstat><d:prop><oc:id>1</oc:id><oc:display-name>secret</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>false</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/5</d:href><d:propstat><d:prop><oc:id>5</oc:id><oc:display-name>test</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>false</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/6</d:href><d:propstat><d:prop><oc:id>6</oc:id><oc:display-name>test2</oc:display-name><oc:user-visible>false</oc:user-visible><oc:user-assignable>false</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response></d:multistatus>',
}

Vue.directive('tooltip', VTooltip)
