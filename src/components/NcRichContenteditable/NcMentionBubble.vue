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
				<span role="heading" class="mention-bubble__title" :title="title" />
			</span>

			<!-- Selectable text for copy/paste -->
			<span role="none" class="mention-bubble__select">{{ mentionText }}</span>
		</span>
	</span>
</template>

<script>
import { generateUrl } from '@nextcloud/router'

export default {
	name: 'NcMentionBubble',

	props: {
		id: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
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
@import '../../assets/NcMentionBubble';

.mention-bubble {
	@include mention-bubble;
}
</style>
