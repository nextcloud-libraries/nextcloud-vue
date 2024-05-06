<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
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
### Bullet
This component is made to be used inside of the [NcAppNavigationItem](#NcAppNavigationItem) component slot: `icon`.

```
<template #icon>
	<NcAppNavigationIconBullet color="0082c9" />
</template>
<template #icon>
	<NcAppNavigationIconBullet color="#0082c9" />
</template>

```

### AppNavigationItem example
```
<NcAppNavigationItem  name="Entry 2" :pinned="true">
	<template #icon>
		<NcAppNavigationIconBullet color="0082c9" />
	</template>
</NcAppNavigationItem>
```
</docs>

<template>
	<div class="app-navigation-entry__icon-bullet" @click="onClick">
		<div :style="{ backgroundColor: formattedColor }" />
	</div>
</template>

<script>
export default {
	name: 'NcAppNavigationIconBullet',

	props: {
		color: {
			type: String,
			required: true,
			validator(color) {
				// #000, 000, #0082c9 and 0082c9
				return /^#?([0-9A-F]{3}){1,2}$/i.test(color)
			},
		},
	},

	emits: ['click'],

	computed: {
		formattedColor() {
			if (this.color.startsWith('#')) {
				return this.color
			}
			return '#' + this.color
		},
	},

	methods: {
		onClick(e) {
			this.$emit('click', e)
		},
	},
}
</script>

<style lang="scss" scoped>
.app-navigation-entry__icon-bullet {
	display: block;
	// there is 2 margins
	padding: $icon-margin + 1px;
	div {
		width: $icon-size - 2px;
		height: $icon-size - 2px;
		cursor: pointer;
		transition: background 100ms ease-in-out;
		border: none;
		border-radius: 50%;
	}
}
</style>
