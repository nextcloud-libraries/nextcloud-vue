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
	<NcPopover :shown.sync="open"
		:container="container"
		popup-role="dialog"
		v-bind="$attrs"
		:focus-trap="false /* Handled manually */"
		v-on="$listeners"
		@update:shown="($event) => { $event ? log('<NcPopover> beforeShow', true) : log('<NcPopover> closing', true) }"
		@after-show="afterShow"
		@after-hide="afterHide">
		<template #trigger="slotProps">
			<slot v-bind="slotProps" />
		</template>
		<Picker v-if="isReadyToRenderPicker"
			ref="picker"
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
			@keydown.native.tab.prevent="handleTabNavigationSkippingEmojis"
			@hook:created="log('<Picker> created')"
			@hook:mounted="log('<Picker> mounted')"
			@select="select">
			<template #searchTemplate="{ onSearch }">
				<div class="search__wrapper">
					<NcTextField ref="search"
						autofocus
						:value.sync="search"
						:label="t('Search')"
						:label-visible="true"
						:placeholder="i18n.search"
						trailing-button-icon="close"
						:trailing-button-label="t('Clear search')"
						:show-trailing-button="search !== ''"
						@keydown.left="callPickerArrowHandlerWithScrollFix('onArrowLeft', $event)"
						@keydown.right="callPickerArrowHandlerWithScrollFix('onArrowRight', $event)"
						@keydown.down="callPickerArrowHandlerWithScrollFix('onArrowDown', $event)"
						@keydown.up="callPickerArrowHandlerWithScrollFix('onArrowUp', $event)"
						@keydown.enter="$refs.picker.onEnter"
						@trailing-button-click="clearSearch(); onSearch('');"
						@update:value="onSearch(search)" />
					<NcColorPicker palette-only
						:container="container"
						:palette="skinTonePalette"
						:value="currentColor.color"
						@update:value="onChangeSkinTone">
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
		<div v-else class="dummy-emoji-picker" style="width: 320px; height: 420px" />
	</NcPopover>
</template>

<script>
import { getCurrentInstance } from 'vue'
import { Picker, Emoji, EmojiIndex } from 'emoji-mart-vue-fast'
import { t } from '../../l10n.js'
import { getCurrentSkinTone, setCurrentSkinTone } from '../../functions/emoji/emoji.ts'
import { Color } from '../../utils/GenColors.js'

import data from 'emoji-mart-vue-fast/data/all.json'
import IconCircle from 'vue-material-design-icons/Circle.vue'
import NcButton from '../NcButton/index.js'
import NcColorPicker from '../NcColorPicker/NcColorPicker.vue'
import NcPopover from '../NcPopover/index.js'
import NcTextField from '../NcTextField/index.js'

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

const last = {}
const log = (id, text, reset = false) => {
	const now = performance.now()
	const diff = last[id] && !reset ? `+${(now - last[id]).toFixed(2)}ms` : '-------'
	console.log(`${now.toFixed(2)}ms (${diff}) [NcEmojiPicker #${id}]`, text)
	last[id] = now
}

export default {
	name: 'NcEmojiPicker',

	components: {
		Emoji,
		IconCircle,
		NcButton,
		NcColorPicker,
		NcPopover,
		NcTextField,
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
		const id = getCurrentInstance().proxy._uid
		const _log = (...args) => log(id, ...args)
		_log('setup | start')

		// If this is the first instance of NcEmojiPicker - setup EmojiIndex
		if (!emojiIndex) {
			emojiIndex = new EmojiIndex(data)
		}

		_log('setup | end')

		return {
			// Non-reactive constants
			emojiIndex,
			skinTonePalette,
			i18n,
			log: _log,
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
			isReadyToRenderPicker: false,
		}
	},

	computed: {
		native() {
			return this.activeSet === 'native'
		},
	},

	methods: {
		t,

		clearSearch() {
			this.search = ''
			this.$refs.search.focus()
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

		async afterShow() {
			this.log('<NcPopover> afterShow')
			await this.$nextTick()
			this.log('<NcPopover> afterShow nextTick')
			await this.$nextTick()
			this.log('<NcPopover> afterShow nextTick 2')
			// NcPopover first renders its content,
			// then changes CSS to check content size,
			// and then actually shows the content.
			// With heavy rendered content like emoji-mart-vue-fast it causes unneeded reflows, making rendering slow.
			// To avoid this we first render an empty dummy <div> with exactly the same size,
			// and only then NcPOpover completely ready and shown actually render the picker
			// It makes rendering x1.5-x2 times faster
			this.isReadyToRenderPicker = true
		},

		afterHide() {
			this.isReadyToRenderPicker = false
		},

		/**
		 * Manually handle Tab navigation skipping emoji buttons.
		 * Navigation over emojis is handled by Arrow keys.
		 * @param {KeyboardEvent} event - Keyboard event
		 */
		handleTabNavigationSkippingEmojis(event) {
			const current = event.target
			const focusable = Array.from(this.$refs.picker.$el.querySelectorAll('button:not(.emoji-mart-emoji), input'))
			if (!event.shiftKey) {
				const nextNode = focusable.find((node) => current.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) || focusable[0]
				nextNode.focus()
			} else {
				const prevNode = focusable.findLast((node) => current.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_PRECEDING) || focusable.at(-1)
				prevNode.focus()
			}
		},

		/**
		 * Handle arrow navigation via <Picker>'s handlers with scroll bug fix
		 * @param {'onArrowLeft' | 'onArrowRight' | 'onArrowDown' | 'onArrowUp'} originalHandlerName - Picker's arrow keydown handler name
		 * @param {KeyboardEvent} event - Keyboard event
		 */
		async callPickerArrowHandlerWithScrollFix(originalHandlerName, event) {
			// Call the original handler
			// See: https://github.com/serebrov/emoji-mart-vue/blob/a1ea72673a111cce78dc8caad8bc9ea3e02ad5bd/src/components/Picker.vue#L29
			// TODO: expose these methods via slot props in upstream library
			this.$refs.picker[originalHandlerName](event)

			// Wait until emoji-mart-vue-fast scrolls
			await this.$nextTick()

			// Scroll position is incorrect after emoji-mart-vue-fast scrolls...
			// It calculates scroll incorrectly.
			// It doesn't take into account, that emojis are wrapped into categories sections
			// See: https://github.com/serebrov/emoji-mart-vue/blob/a1ea72673a111cce78dc8caad8bc9ea3e02ad5bd/src/utils/picker.js#L244
			// Now scroll to the correct position
			// TODO: fix in upstream
			const selectedEmoji = this.$refs.picker.$el.querySelector('.emoji-mart-emoji-selected')
			selectedEmoji?.scrollIntoView({
				block: 'center',
				inline: 'center',
			})
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

	.emoji-mart-category-label {
		grid-column: span 8;
		justify-self: stretch;
	}

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
.search__wrapper {
	display: flex;
	flex-direction: row;
	gap: var(--default-grid-baseline);
	align-items: end;
	padding-block: var(--default-grid-baseline);
	padding-inline: calc(2 * var(--default-grid-baseline));
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
