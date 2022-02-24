/**
 * @copyright Copyright (c) 2021 Jonas Meurer <jonas@freesources.org>
 *
 * @author Jonas Meurer <jonas@freesources.org>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import data from 'emoji-mart-vue-fast/data/all.json'
import { EmojiIndex, frequently } from 'emoji-mart-vue-fast'

// export const allEmojis = index.buildIndex()

/**
 * @param {string} query Emoji search string
 * @param {Number} maxResults Maximum of returned emojis
 * @returns {Array} list of found emojis
 */
export const emojiSearch = function(query, maxResults = 10) {
	const index = new EmojiIndex(data)
	if (query) {
		return index.search(query, maxResults) || []
	}

	return frequently.get(maxResults).map((id) => index.emoji(id)) || []
}

export const addRecent = function(id) {
	frequently.add(id)
}

export default { emojiSearch, addRecent }
