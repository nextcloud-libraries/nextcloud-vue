/**
 * @copyright 2023 Christopher Ng <chrng8@gmail.com>
 *
 * @author Christopher Ng <chrng8@gmail.com>
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

import axios from '@nextcloud/axios'
import { generateRemoteUrl } from '@nextcloud/router'

import {
	formatTag,
	parseIdFromLocation,
	xmlToTagList,
} from '../utils.js'
import { t } from '../../../l10n.js'

const systemTagsUrl = generateRemoteUrl('dav') + '/systemtags'

const propfindBody = `<?xml version="1.0"?>
<d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
	<d:prop>
	<oc:id />
	<oc:display-name />
	<oc:user-visible />
	<oc:user-assignable />
	<oc:can-assign />
	</d:prop>
</d:propfind>`

/* eslint-disable */
export default {
	computed: {
		baseUrl() {
			return generateRemoteUrl('dav') + '/systemtags-relations/files/' + this.fileId + '/'
		},
	},

	methods: {
		/**
		 * @return {Promise<Array<object>>}
		 */
		async searchTags() {
			if (window.NextcloudVueDocs) {
				return xmlToTagList(window.NextcloudVueDocs.tags)
			}
			const result = await axios({
				method: 'PROPFIND',
				url: systemTagsUrl,
				data: propfindBody,
			})
			return xmlToTagList(result.data)
		},

		/**
		 * @return {Promise<Array<object>>}
		 */
		async searchSelectedTags() {
			if (window.NextcloudVueDocs) {
				return xmlToTagList(window.NextcloudVueDocs.tags).filter(({ id }) => [1, 2].includes(id))
			}
			const result = await axios({
				method: 'PROPFIND',
				url: this.baseUrl,
				data: propfindBody,
			})
			return xmlToTagList(result.data)
		},

		/**
		 * @param {object} tag tag
		 *
		 * @return {Promise<void>}
		 */
		async selectTag(tag) {
			if (window.NextcloudVueDocs) {
				return
			}
			console.log('tag', tag)
			const tagToPut = formatTag(tag)
			console.log('tagToPut', tagToPut)
			try {
				await axios.put(this.baseUrl + tagToPut.id, tagToPut)
			} catch (error) {
				throw new Error(t('Failed to select tag'))
			}
		},

		/**
		 * @param {object} tag tag
		 *
		 * @return {Promise<number>} created tag id
		 */
		async createTag(tag) {
			if (window.NextcloudVueDocs) {
				const nextId = Math.max(...this.tags.map(({ id }) => id)) + 1
				return nextId
			}

			const tagToPost = formatTag(tag)
			try {
				const { headers } = await axios.post(systemTagsUrl, tagToPost)
				const contentLocation = headers['content-location']
				if (contentLocation) {
					const tagToPut = {
						...tagToPost,
						id: parseIdFromLocation(contentLocation),
					}
					this.selectTag(tagToPut)
					return tagToPut.id
				}
				throw new Error(t('Failed to create tag'))
			} catch (error) {
				throw new Error(t('Failed to create tag'))
			}
		},

		/**
		 * @param {object} tag tag
		 *
		 * @return {Promise<void>}
		 */
		async deleteTag(tag) {
			if (window.NextcloudVueDocs) {
				return
			}
			const tagToDelete = formatTag(tag)
			try {
				await axios.delete(this.baseUrl + tagToDelete.id)
			} catch (error) {
				throw new Error(t('Failed to delete tag'))
			}
		},
	},
}
