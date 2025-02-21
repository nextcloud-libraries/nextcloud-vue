<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component allows the user to pick an emoji.

### Usage

* Listen to the select event and pass in an HTML element that will be treated as a trigger:

```vue
<template>
	<div>
		<NcEmojiPicker @select="select" style="display: inline-block">
			<NcButton> Click Me </NcButton>
		</NcEmojiPicker>
		<span>selected emoji: {{ emoji }}</span>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				emoji: '',
			}
		},
		methods: {
			select(emoji) {
				this.emoji = emoji
			},
		},
	}
</script>
```

* Showing a preview and keeping it open after a user selected an emoji

```vue
<template>
	<div>
		<NcEmojiPicker
			:close-on-select="false"
			:show-preview="true"
			@select="select"
			style="display: inline-block">
			<NcButton> Click Me </NcButton>
		</NcEmojiPicker>
		<span>selected emoji: {{ emoji }}</span>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				emoji: '',
			}
		},
		methods: {
			select(emoji) {
				this.emoji = emoji
			},
		},
	}
</script>
```

* Allow unselecting a previously set emoji.

```vue
<template>
	<div>
		<NcEmojiPicker
			:show-preview="true"
			:allow-unselect="true"
			:selected-emoji="emoji"
			@select="select"
			@unselect="unselect"
			style="display: inline-block">
			<NcButton> Click Me </NcButton>
		</NcEmojiPicker>
		<span>selected emoji: {{ emoji }}</span>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				emoji: '',
			}
		},
		methods: {
			select(emoji) {
				this.emoji = emoji
			},
			unselect() {
				this.emoji = ''
			},
		},
	}
</script>
```

</docs>

<template>
	<NcPopover v-model:shown="open"
		:container="container"
		popup-role="dialog"
		@after-show="afterShow"
		@after-hide="afterHide">
		<template #trigger="slotProps">
			<slot v-bind="slotProps" />
		</template>
		<Picker ref="picker"
			class="nc-emoji-picker"
			color="var(--color-primary-element)"
			:data="emojiIndex"
			:emoji="previewFallbackEmoji"
			:i18n="i18n"
			:native="native"
			:emoji-size="20"
			:per-line="8"
			:picker-styles="{ width: '320px' }"
			:show-preview="showPreview"
			:skin="currentSkinTone"
			:show-skin-tones="false"
			:title="previewFallbackName"
			role="dialog"
			aria-modal="true"
			:aria-label="t('Emoji picker')"
			v-bind="$attrs"
			@select="select">
			<template #searchTemplate="slotProps">
				<div class="search__wrapper">
					<NcTextField ref="search"
						v-model="search"
						class="search"
						:label="t('Search')"
						:label-visible="true"
						:placeholder="i18n.search"
						trailing-button-icon="close"
						:trailing-button-label="t('Clear search')"
						:show-trailing-button="search !== ''"
						@trailing-button-click="clearSearch(); slotProps.onSearch(search);"
						@update:model-value="slotProps.onSearch(search)" />
					<NcColorPicker palette-only
						:container="container"
						:palette="skinTonePalette"
						:model-value="currentColor.color"
						@update:model-value="onChangeSkinTone">
						<NcButton :aria-label="t('Skin tone')" type="tertiary-no-background">
							<template #icon>
								<IconCircle :style="{ color: currentColor.color }" :title="currentColor.name" :size="20" />
							</template>
						</NcButton>
					</NcColorPicker>
				</div>
			</template>
			<template v-if="allowUnselect && selectedEmoji" #customCategory>
				<div class="emoji-mart-category-label">
					<h3 class="emoji-mart-category-label">
						{{ t('Selected') }}
					</h3>
				</div>
				<Emoji class="emoji-selected"
					:data="emojiIndex"
					:emoji="selectedEmoji"
					:native="true"
					:size="32"
					@click="unselect" />
				<Emoji class="emoji-delete"
					:data="emojiIndex"
					emoji=":x:"
					:native="true"
					:size="10"
					@click="unselect" />
			</template>
		</Picker>
	</NcPopover>
</template>

<script>
import { getCurrentSkinTone, setCurrentSkinTone } from '../../functions/emoji/emoji.ts'
import { useTrapStackControl } from '../../composables/useTrapStackControl.ts'
import { Color } from '../../utils/GenColors.js'

import IconCircle from 'vue-material-design-icons/Circle.vue'
import NcButton from '../NcButton/index.ts'
import NcColorPicker from '../NcColorPicker/NcColorPicker.vue'
import NcPopover from '../NcPopover/index.js'
import NcTextField from '../NcTextField/index.js'
import { t } from '../../l10n.js'

import { Picker, Emoji, EmojiIndex } from 'emoji-mart-vue-fast/src/index.js'
import data from 'emoji-mart-vue-fast/data/all.json'

// Shared emoji index and skinTone for all NcEmojiPicker instances
// Will be initialized on the first NcEmojiPicker creating
let emojiIndex

const i18n = {
	search: t('Search emoji'),
	notfound: t('No emoji found'),
	categories: {
		search: t('Search results'),
		recent: t('Frequently used'),
		smileys: t('Smileys & Emotion'),
		people: t('People & Body'),
		nature: t('Animals & Nature'),
		foods: t('Food & Drink'),
		activity: t('Activities'),
		places: t('Travel & Places'),
		objects: t('Objects'),
		symbols: t('Symbols'),
		flags: t('Flags'),
		custom: t('Custom'),
	},
}

const skinTonePalette = [
	new Color(255, 222, 52, t('Neutral skin color')),
	new Color(228, 205, 166, t('Light skin tone')),
	new Color(250, 221, 192, t('Medium light skin tone')),
	new Color(174, 129, 87, t('Medium skin tone')),
	new Color(158, 113, 88, t('Medium dark skin tone')),
	new Color(96, 79, 69, t('Dark skin tone')),
]

export default {
	name: 'NcEmojiPicker',

	components: {
		IconCircle,
		NcButton,
		NcColorPicker,
		NcPopover,
		NcTextField,
		Emoji,
		Picker,
	},

	props: {
		/**
		 * The emoji-set
		 */
		activeSet: {
			type: String,
			default: 'native',
		},
		/**
		 * Show preview section when hovering emoji
		 */
		showPreview: {
			type: Boolean,
			default: false,
		},
		/**
		 * Allow unselecting the selected emoji
		 */
		allowUnselect: {
			type: Boolean,
			default: false,
		},
		/**
		 * Selected emoji to allow unselecting
		 */
		selectedEmoji: {
			type: String,
			default: '',
		},
		/**
		 * The fallback emoji in the preview section
		 */
		previewFallbackEmoji: {
			type: String,
			default: 'grinning',
		},
		/**
		 * The fallback text in the preview section
		 */
		previewFallbackName: {
			type: String,
			default: t('Pick an emoji'),
		},
		/**
		 * Whether to close the emoji picker after picking one
		 */
		closeOnSelect: {
			type: Boolean,
			default: true,
		},

		/**
		 * Selector for the popover container
		 */
		container: {
			type: [String, Object, Element, Boolean],
			default: 'body',
		},
	},
	emits: [
		'select',
		'select-data',
		'unselect',
	],

	setup() {
		// If this is the first instance of NcEmojiPicker - setup EmojiIndex
		if (!emojiIndex) {
			emojiIndex = new EmojiIndex(data)
		}

		return {
			// Non-reactive constants
			emojiIndex,
			skinTonePalette,
			i18n,
		}
	},

	data() {
		const currentSkinTone = getCurrentSkinTone()

		return {
			/**
			 * The current active color from the skin tone palette
			 */
			currentColor: skinTonePalette[currentSkinTone - 1],
			/**
			 * The current active skin tone
			 * @type {1|2|3|4|5|6}
			 */
			currentSkinTone,
			search: '',
			open: false,
		}
	},

	computed: {
		native() {
			return this.activeSet === 'native'
		},
	},

	created() {
		// Component has its own custom focus management
		// The global focus trap stack should be paused
		useTrapStackControl(() => this.open)
	},

	methods: {
		t,

		clearSearch() {
			this.search = ''
			const input = this.$refs.search?.$refs.inputField?.$refs.input
			if (input) {
				input.focus()
			}
		},

		/**
		 * Update the current skin tone by the result of the color picker
		 * @param {string} color Color set
		 */
		onChangeSkinTone(color) {
			const index = this.skinTonePalette.findIndex((tone) => tone.color.toLowerCase() === color.toLowerCase())
			if (index > -1) {
				this.currentSkinTone = index + 1
				this.currentColor = this.skinTonePalette[index]
				setCurrentSkinTone(this.currentSkinTone)
			}
		},

		select(emojiObject) {
			/**
			 * Emits a string containing the emoji e.g. '👩🏿‍💻'
			 */
			this.$emit('select', emojiObject.native)

			/**
			 * Emits a object with more data about the picked emoji
			 */
			this.$emit('select-data', emojiObject)

			if (this.closeOnSelect) {
				this.open = false
			}
		},

		unselect() {
			this.$emit('unselect')
		},

		afterShow() {
			// add focus trap in modal
			const picker = this.$refs.picker
			picker.$el.addEventListener('keydown', this.checkKeyEvent)

			// set focus on input search field
			const input = this.$refs.search?.$refs.inputField?.$refs.input
			if (input) {
				input.focus()
			}
		},

		afterHide() {
			// remove keydown listner if popover is hidden
			const picker = this.$refs.picker
			picker.$el.removeEventListener('keydown', this.checkKeyEvent)
		},

		checkKeyEvent(event) {
			if (event.key !== 'Tab') {
				return
			}
			const picker = this.$refs.picker
			const focusableList = picker.$el.querySelectorAll(
				'button, input',
			)
			const last = focusableList.length - 1
			// escape early if only 1 or no elements to focus
			if (focusableList.length <= 1) {
				event.preventDefault()
				return
			}
			if (event.shiftKey === false && event.target === focusableList[last]) {
				// Jump to first item when pressing tab on the latest item
				event.preventDefault()
				focusableList[0].focus()
			} else if (event.shiftKey === true && event.target === focusableList[0]) {
				// Jump to the last item if pressing shift+tab on the first item
				event.preventDefault()
				focusableList[last].focus()
			}
		},
	},
}
</script>

<style lang="scss">
@import 'emoji-mart-vue-fast/css/emoji-mart.css';

.nc-emoji-picker.emoji-mart {
	background-color: var(--color-main-background) !important;
	border: 0;
	color: var(--color-main-text) !important;
	display: flex !important;

	// Reset emoji-mart styles
	button {
		border: none;
		background: transparent;
		font-size: inherit;
	}

	.emoji-mart-bar,
	.emoji-mart-anchors,
	.emoji-mart-search,
	.emoji-mart-search input,
	.emoji-mart-category,
	.emoji-mart-category-label,
	.emoji-mart-category-label span,
	.emoji-mart-skin-swatches {
		background-color: transparent !important;
		border-color: var(--color-border) !important;
		color: inherit !important;
	}

	.emoji-mart-anchors {
		padding-block: 0;
		padding-inline: calc(2 * var(--default-grid-baseline));
	}

	.emoji-mart-anchor {
		border-radius: 0;
		margin: 0 !important;
		padding: 0 !important;
		height: var(--clickable-area-small);
		min-width: var(--clickable-area-small);

		&:hover {
			background-color: var(--color-background-hover);
		}

		&:focus-visible {
			outline: 2px solid var(--color-primary-element) !important;
			outline-offset: -2px;
		}

		// Icon
		div {
			display: grid;
			place-content: center;
		}
	}

	.emoji-mart-scroll {
		padding-inline: calc(2 * var(--default-grid-baseline));
		padding-block: 0 calc(2 * var(--default-grid-baseline));
	}

	.emoji-mart-category {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		justify-items: stretch;

		&.emoji-mart-no-results {
			grid-template-columns: 1fr;
			font-size: inherit;
			color: var(--color-text-maxcontrast) !important;
		}
	}

	/* Label element in the section grid */
	div.emoji-mart-category-label {
		grid-column: span 8;
		justify-self: stretch;
	}

	/* An actual heading inside the element */
	h3.emoji-mart-category-label  {
		display: flex;
		align-items: center;
		// Inline with buttons
		height: var(--default-clickable-area);
		margin: 0;
		// Inline with input
		padding-inline: calc(2 * var(--default-grid-baseline));
		padding-block: 0;
		user-select: none;
	}

	.emoji-mart-emoji {
		aspect-ratio: 1 / 1;
		text-align: center;
		margin: 0 !important;
		padding: 0 !important;

		&:hover,
		&:focus-visible,
		&.emoji-mart-emoji-selected {
			background-color: var(--color-background-hover) !important;
			border: none;
			border-radius: var(--border-radius-element, var(--border-radius-pill));
			box-shadow: none !important;
			outline: 2px solid var(--color-primary-element) !important;
			outline-offset: -2px;
		}

		&::before {
			display: none;
		}

		span {
			cursor: pointer;
		}
	}
}
</style>

<style scoped lang="scss">
.search {
	&__wrapper {
		display: flex;
		flex-direction: row;
		gap: var(--default-grid-baseline);
		align-items: end;
		padding-block: var(--default-grid-baseline);
		padding-inline: calc(2 * var(--default-grid-baseline));
	}
}

.row-selected {
	button, span {
		vertical-align: middle;
	}
}

.emoji-delete {
	vertical-align: top;
	margin-left: -21px;
	margin-top: -3px;
}
</style>
