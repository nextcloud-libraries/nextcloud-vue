<!--
 - @copyright Copyright (c) 2020 Georg Ehrke <oc.list@georgehrke.com>
 -
 - @author 2020 Georg Ehrke <oc.list@georgehrke.com>
 -
 - @license GNU AGPL version 3 or any later version
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->
<docs>

	### General description

	This component allows the user to pick an emoji.

	### Usage

	* Listen to the select event and pass in an HTML element that will be treated as a trigger:

	```vue
	<template>
		<div>
			<EmojiPicker @select="select" style="display: inline-block">
				<button> Click Me </button>
			</EmojiPicker>
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
			<EmojiPicker
				:close-on-select="false"
				:show-preview="true"
				@select="select"
				style="display: inline-block">
				<button> Click Me </button>
			</EmojiPicker>
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

</docs>

<template>
	<Popover :shown.sync="open"
		:container="container"
		v-bind="$attrs"
		v-on="$listeners"
		@after-show="afterShow"
		@after-hide="afterHide">
		<template #trigger>
			<slot />
		</template>
		<Picker ref="picker"
			:auto-focus="true"
			color="var(--color-primary)"
			:data="emojiIndex"
			:emoji="previewFallbackEmoji"
			:i18n="i18n"
			:native="native"
			:emoji-size="20"
			:per-line="8"
			:picker-styles="{ width: '320px' }"
			:show-preview="showPreview"
			:title="previewFallbackTitle"
			v-bind="$attrs"
			@select="select" />
	</Popover>
</template>

<script>
import Popover from '../Popover/index.js'
import { t } from '../../l10n.js'

import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
import data from 'emoji-mart-vue-fast/data/all.json'

export default {
	name: 'EmojiPicker',
	components: {
		Picker,
		Popover,
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
		 * The fallback emoji in the preview section
		 */
		previewFallbackEmoji: {
			type: String,
			default: 'grinning',
		},
		/**
		 * The fallback text in the preview section
		 */
		previewFallbackTitle: {
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
			type: String,
			default: 'body',
		},
	},
	data() {
		return {
			emojiIndex: new EmojiIndex(data),
			i18n: {
				search: t('Search'),
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
			},
			open: false,
		}
	},
	computed: {
		native() {
			return this.activeSet === 'native'
		},
	},
	methods: {
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
		afterShow() {
			// add focus trap in modal
			const picker = this.$refs.picker
			picker.$el.addEventListener('keydown', this.checkKeyEvent)
			// set focus on input search field
			const input = picker.$refs.search.$el.querySelector('input')
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
				'button, input'
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
@import '~emoji-mart-vue-fast/css/emoji-mart.css';

.emoji-mart {
	background-color: var(--color-main-background) !important;
	border: 0;
	color: var(--color-main-text) !important;

	// default style reset
	button {
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		font-size: inherit;
		height: 36px;
		width: auto;

		* {
			cursor: pointer !important;
		}
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

	.emoji-mart-search input:focus-visible {
		box-shadow: inset 0 0 0 2px var(--color-primary);
		outline: none;
	}

	.emoji-mart-bar {
		&:first-child {
			border-top-left-radius: var(--border-radius) !important;
			border-top-right-radius: var(--border-radius) !important;
		}
	}

	.emoji-mart-anchors {
		button {
			border-radius: 0;
			padding: 12px 4px;
			height: auto;
			&:focus-visible {
				/* box-shadow: inset 0 0 0 2px var(--color-primary); */
				outline: 2px solid var(--color-primary-element);
			}
		}
	}

	.emoji-mart-category {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: start;

		.emoji-mart-category-label,
		.emoji-mart-emoji {
			user-select: none;
			flex-grow: 0;
			flex-shrink: 0;
		}

		.emoji-mart-category-label {
			flex-basis: 100%;
			margin: 0;
		}

		.emoji-mart-emoji {
			// 8 emoji per row
			flex-basis: calc(100% / 8);
			text-align: center;

			&:hover::before,
			&.emoji-mart-emoji-selected::before{
				background-color: var(--color-background-hover) !important;
				outline: 2px solid var(--color-primary-element);
			}
		}
		button {

			&:focus-visible {
				background-color: var(--color-background-hover);
				border: 2px solid var(--color-primary-element) !important;
				border-radius: 50%;
			}
		}
	}

}
</style>
