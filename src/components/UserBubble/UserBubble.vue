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
It's possible to replace the avatar with something else, 
to link the bubble to e.g. a users profile 
and to show a popover on hover with e.g. the full user name handle / email address or something else.

This components has two slots:
* 'avatar' which allows you to replace the user-avatar with e.g. an icon;

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
			<slot name="avatar">
				<Avatar v-bind="$attrs" :user="user" :size="16"
					:disable-tooltip="true" :disable-menu="true" class="avatar" />
			</slot>
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

.avatar {
	align-self: center;
	margin-left: 2px;
}

.user {
	margin: 0 8px 0 4px;
}
</style>
