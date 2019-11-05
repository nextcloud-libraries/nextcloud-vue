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

<docs>

### General description

This component displays a user together with a small avatar in a grey bubble.
It's possible to use an actual user's avatar, just an image/icon as a url or an icon-class,
to link the bubble to e.g. a users profile
and to show a popover on hover with e.g. the full user name handle / email address or something else.

This component has the following slot:
* a default slot which is for the content of the popover (this is passed to the popover component directly).

### Examples

```vue
<template>
	<p>
		Some text before
		<user-bubble :user="'admin'" :displayName="'Admin Example'" :url="'/test'" >
			@admin@foreign-host.com
		</user-bubble>
		and after the bubble.
	</p>
</template>
```
</docs>
<template>
	<Popover trigger="hover focus" :open="open" :disabled="popoverEmpty"
		class="user-bubble-popover" @update:open="onOpenChange">
		<div slot="trigger" v-bind="linkOrNot" class="user-bubble">
			<Avatar :url="!isUserAvatar && isIconUrl ? avatarImage : ''"
				:icon-class="!isUserAvatar && !isIconUrl ? avatarImage : ''"
				:user="isUserAvatar ? user : ''" :size="16" :disable-tooltip="true"
				:disable-menu="true" class="avatar" />
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
		avatarImage: {
			type: String,
			default: ''
		},
		user: {
			type: String,
			required: true
		},
		displayName: {
			type: String,
			required: true
		},
		url: {
			type: String,
			default: ''
		},
		open: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		isUserAvatar() {
			if (!this.avatarImage) {
				return true
			}
			return false
		},
		isIconUrl() {
			try {
				// eslint-disable-next-line
				new URL(this.avatarImage)
				return true
			} catch (error) {
				return false
			}
		},
		componentType() {
			if (this.url) {
				return 'div'
			}
			return 'a'
		},
		linkOrNot() {
			if (this.url !== '') {
				return { is: 'a', href: this.url }
			}
			return { is: 'div' }
		},
		popoverEmpty() {
			if (typeof this.$slots.default === 'undefined') {
				return true
			}
			return false
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
.user-bubble-popover {
	display: inline;
	vertical-align: top;
}

.user-bubble {
	display: flex;
	height: 20px;
	border-radius: 10px;
	background-color: var(--color-background-dark);
}

h6 {
	line-height: 20px;
}

.avatar {
	align-self: center;
	margin-left: 2px;
}

.user {
	margin: 0 8px 0 4px;
}
</style>
