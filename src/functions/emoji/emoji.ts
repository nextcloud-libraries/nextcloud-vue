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
 * Get the list of emojis by search filter or the list of frequently used emojis
 *
 * @param query Emoji search filter string; if no string or empty string is given, the list of frequently used emojis is returned
 * @param maxResults Maximum of returned emojis
 * @return list of found emojis in the same format as the emoji-mart-vue-fast's EmojiIndex
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
 * @return The skin tone
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
