/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'
import { generateRemoteUrl } from '@nextcloud/router'

/**
 * @param {Document} xml - The xml document
 */
function xmlToJson(xml) {
	let obj = {}

	if (xml.nodeType === 1) {
		if (xml.attributes.length > 0) {
			obj['@attributes'] = {}
			for (let j = 0; j < xml.attributes.length; j++) {
				const attribute = xml.attributes.item(j)
				obj['@attributes'][attribute.nodeName] = attribute.nodeValue
			}
		}
	} else if (xml.nodeType === 3) {
		obj = xml.nodeValue
	}

	if (xml.hasChildNodes()) {
		for (let i = 0; i < xml.childNodes.length; i++) {
			const item = xml.childNodes.item(i)
			const nodeName = item.nodeName
			if (typeof (obj[nodeName]) === 'undefined') {
				obj[nodeName] = xmlToJson(item)
			} else {
				if (typeof obj[nodeName].push === 'undefined') {
					const old = obj[nodeName]
					obj[nodeName] = []
					obj[nodeName].push(old)
				}
				obj[nodeName].push(xmlToJson(item))
			}
		}
	}
	return obj
}

/**
 * @param {string} xml - The XML string to be parsed into a XML document
 * @return {Document}
 */
function parseXml(xml) {
	let dom = null
	try {
		dom = (new DOMParser()).parseFromString(xml, 'text/xml')
	} catch (e) {
		console.error('Failed to parse xml document', e)
	}
	return dom
}

/**
 * @param {string} xml - The XML result to be parsed
 */
function xmlToTagList(xml) {
	const json = xmlToJson(parseXml(xml))
	const list = json['d:multistatus']['d:response']
	const result = []
	for (const index in list) {
		const tag = list[index]['d:propstat']

		if (tag['d:status']['#text'] !== 'HTTP/1.1 200 OK') {
			continue
		}
		result.push({
			id: parseInt(tag['d:prop']['oc:id']['#text']),
			displayName: tag['d:prop']['oc:display-name']['#text'],
			canAssign: tag['d:prop']['oc:can-assign']['#text'] === 'true',
			userAssignable: tag['d:prop']['oc:user-assignable']['#text'] === 'true',
			userVisible: tag['d:prop']['oc:user-visible']['#text'] === 'true',
		})
	}
	return result
}

/**
 * Get tags from backend
 */
async function searchTags() {
	if (window.NextcloudVueDocs) {
		return Promise.resolve(xmlToTagList(window.NextcloudVueDocs.tags))
	}

	const result = await axios({
		method: 'PROPFIND',
		url: generateRemoteUrl('dav') + '/systemtags/',
		data: `<?xml version="1.0"?>
					<d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
					  <d:prop>
						<oc:id />
						<oc:display-name />
						<oc:user-visible />
						<oc:user-assignable />
						<oc:can-assign />
					  </d:prop>
					</d:propfind>`,
	})
	return xmlToTagList(result.data)
}

export {
	searchTags,
}
