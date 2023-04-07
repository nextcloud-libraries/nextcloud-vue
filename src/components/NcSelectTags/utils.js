/**
 * @copyright Copyright (c) 2019 Julius Härtl <jus@bitgrid.net>
 *
 * @author Julius Härtl <jus@bitgrid.net>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

const xmlToJson = (xml) => {
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

const parseXml = (xml) => {
	let dom = null
	try {
		dom = (new DOMParser()).parseFromString(xml, 'text/xml')
	} catch (e) {
		console.error('Failed to parse xml document', e)
	}
	return dom
}

export const xmlToTagList = (xml) => {
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
 * @param {string} url url
 *
 * @return {number} id
 */
export const parseIdFromLocation = (url) => {
	const queryPos = url.indexOf('?')
	if (queryPos > 0) {
		url = url.substring(0, queryPos)
	}

	const parts = url.split('/')
	let result
	do {
		result = parts[parts.length - 1]
		parts.pop()
		// note: first result can be empty when there is a trailing slash,
		// so we take the part before that
	} while (!result && parts.length > 0)

	return Number(result)
}

/**
 * @param {object} initialTag tag
 *
 * @return {object} formatted tag
 */
export const formatTag = (initialTag) => {
	const tag = { ...initialTag }
	if (typeof tag.id === 'string') {
		tag.id = Number(tag.id)
	}
	if (tag.name && !tag.displayName) {
		return tag
	}
	tag.name = tag.displayName
	delete tag.displayName

	return tag
}
