<!--
  - @copyright Copyright (c) 2019 Jonas Sulzer <jonas@violoncello.ch>
  -
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
	<Popover>
		<template slot="trigger">
			<div class="user-bubble">
				<Avatar :user="userName" :display-name="userName" />
				<h6>{{userName}}</h6>
			</div>
		</template>
		<template>
			<h2>I am the content</h2>
		</template>
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
		userName: {
			type: String,
			required: true
		}
	}

}
</script>

<style lang="scss" scoped>
.user-bubble {
	display: flex;
	height: 1.8em;
	border-radius: 50%;
	background-color: var(--color-background-dark);
}
</style>
