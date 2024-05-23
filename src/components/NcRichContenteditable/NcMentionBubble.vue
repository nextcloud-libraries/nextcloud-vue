<!--
  - @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
-->

<template>
	<span :class="{'mention-bubble--primary': primary}"
		class="mention-bubble"
		contenteditable="false">
		<span class="mention-bubble__wrapper">
			<span class="mention-bubble__content">
				<!-- Avatar or icon -->
				<span :class="[icon, `mention-bubble__icon--${avatarUrl ? 'with-avatar' : ''}`]"
					:style="avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : null"
					class="mention-bubble__icon" />

				<!-- Title -->
				<span role="heading" class="mention-bubble__title" :title="labelWithFallback" />
			</span>

			<!-- Selectable text for copy/paste -->
			<span role="none" class="mention-bubble__select">{{ mentionText }}</span>
		</span>
	</span>
</template>

<script>
import { getAvatarUrl } from '../../utils/getAvatarUrl.ts'

export default {
	name: 'NcMentionBubble',

	props: {
		id: {
			type: String,
			required: true,
		},
		/**
		 * @deprecated Use `label` instead
		 */
		title: {
			type: String,
			required: false,
			default: null,
		},
		label: {
			type: String,
			required: false,
			default: null,
		},
		icon: {
			type: String,
			required: true,
		},
		iconUrl: {
			type: [String, null],
			default: null,
		},
		source: {
			type: String,
			required: true,
		},
		primary: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		avatarUrl() {
			if (this.iconUrl) {
				return this.iconUrl
			}

			return this.id && this.source === 'users'
				? this.getAvatarUrl(this.id, 44)
				: null
		},
		mentionText() {
			return !this.id.includes(' ') && !this.id.includes('/')
				? `@${this.id}`
				: `@"${this.id}"`
		},
		// Fallback to title for compatibility
		labelWithFallback() {
			return this.label || this.title
		},
	},

	methods: {
		getAvatarUrl,
	},
}
</script>

<style lang="scss" scoped>
$bubble-height: 20px;
$bubble-max-width: 150px;
$bubble-padding: 2px;
$bubble-avatar-size: $bubble-height - 2 * $bubble-padding;

.mention-bubble {
	&--primary &__content {
		color: var(--color-primary-element-text);
		background-color: var(--color-primary-element);
	}

	&__wrapper {
		max-width: $bubble-max-width;
		// Align with text
		height: $bubble-height - $bubble-padding;
		vertical-align: text-bottom;
		display: inline-flex;
		align-items: center;
	}

	&__content {
		display: inline-flex;
		overflow: hidden;
		align-items: center;
		max-width: 100%;
		height: $bubble-height ;
		-webkit-user-select: none;
		user-select: none;
		padding-right: $bubble-padding * 3;
		padding-left: $bubble-padding;
		border-radius: math.div($bubble-height, 2);
		background-color: var(--color-background-dark);
	}

	&__icon {
		position: relative;
		width: $bubble-avatar-size;
		height: $bubble-avatar-size;
		border-radius: math.div($bubble-avatar-size, 2);
		background-color: var(--color-background-darker);
		background-repeat: no-repeat;
		background-position: center;
		background-size: $bubble-avatar-size - 2 * $bubble-padding;

		&--with-avatar {
			color: inherit;
			background-size: cover;
		}
	}

	&__title {
		overflow: hidden;
		margin-left: $bubble-padding;
		white-space: nowrap;
		text-overflow: ellipsis;
		// Put title in ::before so it is not selectable
		&::before {
			content: attr(title);
		}
	}

	// Hide the mention id so it is selectable
	&__select {
		position: absolute;
		z-index: -1;
		left: -1000px;
	}
}

</style>
