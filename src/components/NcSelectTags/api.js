/**
 * @copyright Copyright (c) 2019 Julius Härtl <jus@bitgrid.net>
 *
 * @author Christopher Ng <chrng8@gmail.com>
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

import axios from '@nextcloud/axios'
import camelCase from 'camelcase'
import { generateUrl } from '@nextcloud/router'

import { davClient } from './davClient.js'
import logger from '../../utils/logger.js'
import { t } from '../../l10n.js'

const fetchTagsBody = `<?xml version="1.0"?>
<d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
	<d:prop>
		<oc:id />
		<oc:display-name />
		<oc:user-visible />
		<oc:user-assignable />
		<oc:can-assign />
	</d:prop>
</d:propfind>`

const parseTags = (tags) => {
	return tags.map(({ props }) => Object.fromEntries(
		Object.entries(props)
			.map(([key, value]) => [camelCase(key), value])
	))
}

export const fetchTags = async () => {
	if (window.NextcloudVueDocs) {
		return window.NextcloudVueDocs.tags
	}

	const path = '/systemtags'
	try {
		const { data: tags } = await davClient.getDirectoryContents(path, {
			data: fetchTagsBody,
			details: true,
			glob: '/systemtags/*', // Filter out first empty tag
		})
		return parseTags(tags)
	} catch (error) {
		logger.error(t('Failed to load tags'), { error })
		throw new Error(t('Failed to load tags'))
	}
}

export const fetchLastUsedTagIds = async () => {
	if (window.NextcloudVueDocs) {
		return window.NextcloudVueDocs.lastUsedTagIds
	}

	const url = generateUrl('/apps/systemtags/lastused')
	try {
		const { data: lastUsedTagIds } = await axios.get(url)
		return lastUsedTagIds.map(Number)
	} catch (error) {
		logger.error(t('Failed to load last used tags'), { error })
		throw new Error(t('Failed to load last used tags'))
	}
}
