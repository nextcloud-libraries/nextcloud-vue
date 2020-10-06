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
				<span role="heading" class="mention-bubble__title" :title="label" />
			</span>

			<!-- Selectable text for copy/paste -->
			<span role="none" class="mention-bubble__select">{{ mentionText }}</span>
		</span>
	</span>
</template>

<script>
import { generateUrl } from '@nextcloud/router'

export default {
	name: 'MentionBubble',

	props: {
		id: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
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
			return this.id && this.source === 'users'
				? this.getAvatarUrl(this.id, 44)
				: null
		},
		mentionText() {
			return this.id.indexOf(' ') === -1
				? `@${this.id}`
				: `@"${this.id}"`
		},
	},

	methods: {
		getAvatarUrl(user, size) {
			return generateUrl('/avatar/{user}/{size}', {
				user,
				size,
			})
		},
	},
}
</script>

<style lang="scss" scoped>
$bubble-size: 20px;
$bubble-padding: 2px;
$bubble-avatar-size: $bubble-size - 2 * $bubble-padding;

.mention-bubble {
	&--primary &__content {
		background-color: var(--color-primary-element);
		color: var(--color-primary-text);
	}

	&__wrapper {
		display: inline-block;
		vertical-align: middle;
		white-space: nowrap;
		// Align vertically with nearby text
		line-height: 16px;
	}

	&__content {
		display: inline-flex;
		align-items: center;
		height: $bubble-size;
		padding-right: $bubble-padding * 3;
		padding-left: $bubble-padding;
		border-radius: $bubble-size / 2;
		background-color: var(--color-background-dark);
		user-select: none;
		-webkit-user-select: none;
	}

	&__icon {
		position: relative;
		width: $bubble-avatar-size;
		height: $bubble-avatar-size;
		border-radius: $bubble-avatar-size / 2;
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
		margin-left: $bubble-padding;
		// Put label in ::before so it is not selectable
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
