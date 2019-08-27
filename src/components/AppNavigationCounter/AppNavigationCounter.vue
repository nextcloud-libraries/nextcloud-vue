<!--
 - @copyright Copyright (c) 2019 Marco Ambrosini <ma12co@pm.me>
 -
 - @author Marco Ambrosini <marcoambrosini@pm.me>
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

### Normal Counter

```
<AppNavigationCounter :highlighted="false">
your number or string
</AppNavigationCounter>
```

### Highlighted Counter (i.e. mentions)

```
<AppNavigationCounter :highlighted="true">
your number or string
</AppNavigationCounter>
```

</docs>

<template>
	<li :class="{ highlighted }"
		class="app-navigation-entry-utils-counter">
		<span><slot /></span>
	</li>
</template>

<script>

export default {
	name: 'AppNavigationCounter',
	props: {
		highlighted: {
			type: Boolean,
			default: false
		}
	}
}

</script>

<style lang="scss" scoped>

	.app-navigation-entry-utils-counter {
		overflow: hidden;
		text-align: right;
		font-size: 9px;
		line-height: $clickable-area;
		padding: 0 12px; /* Same padding as all li > a in the app-navigation */

	}

	.highlighted {
		padding: 0;
		text-align: center;
		span {
			padding: 2px 5px;
			border-radius: 10px;
			background-color: var(--color-primary);
			color: var(--color-primary-text);
		}
	}

</style>
