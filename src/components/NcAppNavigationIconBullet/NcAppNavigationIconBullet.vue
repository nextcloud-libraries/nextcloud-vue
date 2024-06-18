<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
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
	padding: calc($icon-margin + 1px);
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
