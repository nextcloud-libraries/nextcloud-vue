/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import 'core-js/stable/index.js'
/* eslint-disable-next-line */
import 'regenerator-runtime/runtime.js'

import axios from '@nextcloud/axios'

import { isA11yActivation } from '../src/functions/a11y/index.ts'
import { EmojiSkinTone, emojiSearch, emojiAddRecent, getCurrentSkinTone, setCurrentSkinTone } from '../src/functions/emoji/index.ts'
import { spawnDialog } from '../src/functions/dialog/index.ts'
import { usernameToColor } from '../src/functions/usernameToColor/index.ts'
import { useIsDarkTheme } from '../src/composables/useIsDarkTheme/index.ts'
import NcDialog from '../src/components/NcDialog/index.ts'

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
	const requestGroups = request.responseURL.match(/cloud\/groups\/details\?search=([^&]*)&limit=\d+$/)
	if (requestGroups) {
		data = { groups: USER_GROUPS.filter(e => !requestGroups[1] || e.displayname.startsWith(requestGroups[1]) || e.id.startsWith(requestGroups[1])) }
	}

	if (data) {
		return Promise.resolve({ data: { ocs: { data } } })
	}
	return Promise.reject(error)
}

axios.interceptors.response.use((r) => r, e => mockRequests(e))

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

// app name fallback
window.appName = 'nextcloud-vue'

// Exported Functions
window.isA11yActivation = isA11yActivation
window.EmojiSkinTone = EmojiSkinTone
window.emojiSearch = emojiSearch
window.emojiAddRecent = emojiAddRecent
window.getCurrentSkinTone = getCurrentSkinTone
window.setCurrentSkinTone = setCurrentSkinTone
window.usernameToColor = usernameToColor
window.spawnDialog = spawnDialog
// Exported components
window.NcDialog = NcDialog
// Exported composables
window.useIsDarkTheme = useIsDarkTheme

window.NextcloudVueDocs = {
	tags: '<?xml version="1.0"?><d:multistatus xmlns:d="DAV:" xmlns:s="http://sabredav.org/ns" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns"><d:response><d:href>/remote.php/dav/systemtags/</d:href><d:propstat><d:prop><oc:id/><oc:display-name/><oc:user-visible/><oc:user-assignable/><oc:can-assign/></d:prop><d:status>HTTP/1.1 404 Not Found</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/7</d:href><d:propstat><d:prop><oc:id>7</oc:id><oc:display-name>tag1</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>true</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/2</d:href><d:propstat><d:prop><oc:id>2</oc:id><oc:display-name>tag2</oc:display-name><oc:user-visible>false</oc:user-visible><oc:user-assignable>true</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/3</d:href><d:propstat><d:prop><oc:id>3</oc:id><oc:display-name>tag3</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>true</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/4</d:href><d:propstat><d:prop><oc:id>4</oc:id><oc:display-name>important</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>true</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/1</d:href><d:propstat><d:prop><oc:id>1</oc:id><oc:display-name>secret</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>false</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/5</d:href><d:propstat><d:prop><oc:id>5</oc:id><oc:display-name>test</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>false</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/6</d:href><d:propstat><d:prop><oc:id>6</oc:id><oc:display-name>test2</oc:display-name><oc:user-visible>false</oc:user-visible><oc:user-assignable>false</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response></d:multistatus>',
}

// Add #skip-actions container
document.body.insertAdjacentHTML('afterbegin', '<div id="skip-actions"></div>')
