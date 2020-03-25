<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
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
  -
  -->

<docs>
	This component is deprecated. Please use the [Actions](#/Components?id=actions-1) component instead.
</docs>

<template>
	<ul>
		<PopoverMenuItem v-for="(item, key) in menu" :key="key" :item="item" />
	</ul>
</template>

<script>
import PopoverMenuItem from './PopoverMenuItem'

export default {
	name: 'PopoverMenu',
	components: {
		PopoverMenuItem,
	},
	props: {
		menu: {
			type: Array,
			default: () => {
				return [{
					href: 'https://nextcloud.com',
					icon: 'icon-links',
					text: 'Nextcloud',
				}]
			},
			required: true,
		},
	},
}
</script>

<style lang="scss" scoped>
ul {
	display: flex;
	flex-direction: column;
}
</style>
