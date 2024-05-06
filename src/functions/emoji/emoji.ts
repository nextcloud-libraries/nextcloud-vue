/**
 * @copyright Copyright (c) 2021 Jonas Meurer <jonas@freesources.org>
 *
 * @author Jonas Meurer <jonas@freesources.org>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { getBuilder } from '@nextcloud/browser-storage'
import { EmojiIndex, frequently } from 'emoji-mart-vue-fast'

import data from 'emoji-mart-vue-fast/data/all.json'

const storage = getBuilder('nextcloud-vue').persist(true).build()

// Shared emoji index and skinTone for all emojiSearch function calls
// Will be initialized on the first call
let emojiIndex

/**
 * Skin tones supported by Unicode Emojis (Fitzpatrick scale)
 * The numeric values align with `emoji-mart-vue`
 */
export enum EmojiSkinTone {
	Neutral = 1,
	Light = 2,
	MediumLight = 3,
	Medium = 4,
	MediumDark = 5,
	Dark = 6,
}

/**
 * @param {string} query Emoji search string
 * @param {number} maxResults Maximum of returned emojis
 * @return {Array} list of found emojis
 */
export const emojiSearch = (query: string, maxResults: number = 10) => {
	// If this is the first call of function - initialize EmojiIndex
	if (!emojiIndex) {
		emojiIndex = new EmojiIndex(data)
	}
	const currentSkinTone = getCurrentSkinTone()

	let results
	if (query) {
		results = emojiIndex.search(`:${query}`, maxResults)
		if (results.length < maxResults) {
			results = results.concat(emojiIndex.search(query, maxResults - results.length))
		}
	} else {
		results = frequently.get(maxResults).map((id: number) => emojiIndex.emoji(id)) || []
	}

	return results.map((emoji) => emoji.getSkin(currentSkinTone))
}

export const emojiAddRecent = function(id) {
	frequently.add(id)
}

/**
 * Get the current skin tone index used for emojis
 * @return {EmojiSkinTone} The skin tone
 */
export const getCurrentSkinTone = () => {
	const skinTone = Number.parseInt(storage.getItem('NcEmojiPicker::currentSkinTone') ?? '1')
	// Clamp skinTone to valid ranges
	return Math.min(Math.max(skinTone, EmojiSkinTone.Neutral), EmojiSkinTone.Dark)
}

/**
 * Set the current active skin tone for emojis
 * @param {EmojiSkinTone} skinTone Skin tone
 */
export const setCurrentSkinTone = (skinTone: EmojiSkinTone) => {
	// Clamp skinTone to valid ranges
	skinTone = Math.min(Math.max(skinTone, EmojiSkinTone.Neutral), EmojiSkinTone.Dark)
	storage.setItem('NcEmojiPicker::currentSkinTone', skinTone.toString())
}
