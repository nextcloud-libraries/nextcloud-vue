<!--
  - @copyright Copyright (c) 2019 Jonas Sulzer <jonas@violoncello.ch>
  -
  - @author Marco Ambrosini <marcoambrosini@pm.me>
  - @author Jonas Sulzer <jonas@violoncello.ch>
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
	<Popover trigger="hover focus" :open="open" class="test"
		@update:open="onOpenChange">
		<div slot="trigger" class="user-bubble">
			<Avatar v-bind="$attrs" :user="user" :size="16"
				:disable-tooltip="true" :disable-menu="true" class="avatar" />
			<h6 class="user">
				{{ displayName ? displayName : user }}
			</h6>
		</div>
		<slot />
	</Popover>
</template>

<script>
import { Popover } from '../Popover'
import { Avatar } from '../Avatar'

export default {
	name: 'UserBubble',
	components: {
		Popover,
		Avatar
	},
	props: {
		user: {
			type: String,
			required: true
		},
		displayName: {
			type: String,
			required: false
		},
		url: {
			type: String,
			required: false
		},
		open: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		onOpenChange(state) {
			this.$emit('update:open', state)
		}
	}
}
</script>

<style lang="scss" scoped>
.user-bubble {
	display: flex;
	height: 20px;
	border-radius: 10px;
	background-color: var(--color-background-dark);
}

.avatar {
    align-self: center;
    margin-left: 2px;
}

.user {
    margin: 0 8px 0 4px;
}

.test {
    display: inline;
    vertical-align: top;
}
</style>
