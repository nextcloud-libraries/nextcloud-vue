/**
 * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
