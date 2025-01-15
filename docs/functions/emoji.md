<!--
 - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
```ts static
import {
    EmojiSkinTone,
    emojiSearch,
    emojiAddRecent,
    getCurrentSkinTone,
    setCurrentSkinTone,
} from '@nextcloud/vue/functions/emoji'
```

## Definitions

```ts static
/**
 * Skin tones supported by Unicode Emojis (Fitzpatrick scale)
 * The numeric values align with `emoji-mart-vue`
 */
enum EmojiSkinTone {}

/**
 * Get the list of emojis by search filter or the list of frequently used emojis
 *
 * @param query Emoji search filter string; if no string or empty string is given, the list of frequently used emojis is returned
 * @param maxResults Maximum of returned emojis
 * @return list of found emojis in the same format as the emoji-mart-vue-fast's EmojiIndex
 */
declare function emojiSearch(query: string, maxResults: number = 10): object[]

/**
 * Add emoji to the list of recent emojis.
 * This list can be got from emojiSearch function and it is used in NcEmojiPicker.
 *
 * @param emojiData object with `id` property
 * @param emojiData.id the emoji ID from emoji index
 */
declare function emojiAddRecent(emojiData: { id: string }): void

/**
 * Get the current skin tone index used for emojis
 * @return The skin tone
 */
declare function getCurrentSkinTone(): EmojiSkinTone

/**
 * Set the current active skin tone for emojis
 *
 * @param skinTone Skin tone
 */
declare function setCurrentSkinTone(skinTone: EmojiSkinTone): void
```

## Usage

```vue
<template>
    <div>
        <NcEmojiPicker :key="selectedTone.value" @select="handleSelect">
            <NcButton>Open Emoji Picker</NcButton>
        </NcEmojiPicker>

        <hr />

        <NcSelect v-model="selectedTone" :options="tones" input-label="Current Skin Tone" />
        
        <hr />

        <p>
            <code>emojiSearch('', 5).map((emoji) => emoji.native)</code>
            <br />
            {{ recent }}
        </p>

        <hr />

        <NcButton @click="handleAddToRecent">Add 💙 to recent</NcButton>
    </div>
</template>

<script>
export default {
    data() {
        const initialSkinTone = getCurrentSkinTone()
        return {
            recent: [],
            selectedTone: {
                label: EmojiSkinTone[initialSkinTone],
                value: initialSkinTone,
            },
            tones: Object.entries(EmojiSkinTone)
                .filter(([label, value]) => typeof value === 'number')
                .map(([label, value]) => ({ label, value })),
        }
    },

    watch: {
        selectedTone({ label, value }) {
            setCurrentSkinTone(value)
            this.manuallyUpdateRecent()
        },
    },

    created() {
        this.manuallyUpdateRecent()
    },

    methods: {
        manuallyUpdateRecent() {
            this.recent = emojiSearch('', 5).map((emojiData) => emojiData.native)
        },

        handleAddToRecent() {
            emojiAddRecent({ id: 'blue_heart' })
            this.manuallyUpdateRecent()
        },

        handleSelect() {
            this.manuallyUpdateRecent()
        },
    },
}
</script>
```