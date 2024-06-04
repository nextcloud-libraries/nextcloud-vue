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
 * Get the list of emojis by search filter or the list of frequently used emojis
 *
 * @param query Emoji search filter string; if no string or empty string is given, the list of frequently used emojis is returned
 * @param maxResults Maximum of returned emojis
 * @return {object[]} list of found emojis in the same format as the emoji-mart-vue-fast's EmojiIndex
 */
export function emojiSearch(query: string, maxResults: number = 10): object[] {
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

/**
 * Add emoji to the list of recent emojis.
 * This list can be got from emojiSearch function and it is used in NcEmojiPicker.
 *
 * @param emojiData object with `id` property
 * @param emojiData.id the emoji ID from emoji index
 */
export function emojiAddRecent(emojiData: { id: string }): void {
	frequently.add(emojiData)
}

/**
 * Get the current skin tone index used for emojis
 *
 * @return {EmojiSkinTone} The skin tone
 */
export function getCurrentSkinTone(): EmojiSkinTone {
	const skinTone = Number.parseInt(storage.getItem('NcEmojiPicker::currentSkinTone') ?? '1')
	// Clamp skinTone to valid ranges
	return Math.min(Math.max(skinTone, EmojiSkinTone.Neutral), EmojiSkinTone.Dark)
}

/**
 * Set the current active skin tone for emojis
 *
 * @param skinTone Skin tone
 */
export function setCurrentSkinTone(skinTone: EmojiSkinTone): void {
	// Clamp skinTone to valid ranges
	skinTone = Math.min(Math.max(skinTone, EmojiSkinTone.Neutral), EmojiSkinTone.Dark)
	storage.setItem('NcEmojiPicker::currentSkinTone', skinTone.toString())
}
