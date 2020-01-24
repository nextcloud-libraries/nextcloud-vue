<!--
  - @copyright Copyright (c) 2019 Marco Ambrosini <marcoambrosini@pm.me>
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
-->

<docs>

### General description

This component is just a wrapper for the v-component plugin by Akryum,
please refer to this documentation for customization:
https://github.com/Akryum/v-tooltip

This components has two slots:
* 'trigger' which can be any html element and it will trigger the popover
this slot is optional since you can toggle the popover also by updating the
open prop on this component;

* a default slot that is for the content of the popover.

### Examples

With a `<button>` as a trigger:
```vue
<template>
	<Popover>
		<button slot="trigger"> I am the trigger </button>
		<template>
		<h2>this is some content</h2>
		</template>
	</Popover>
</template>
```
</docs>

<template>
	<VPopover
		v-bind="$attrs"
		v-on="$listeners">
		<!-- This will be the popover target (for the events and position) -->
		<slot name="trigger" />
		<!-- This will be the content of the popover -->
		<template slot="popover">
			<slot />
		</template>
	</VPopover>
</template>

<script>
import { VPopover } from 'v-tooltip'

export default {
	name: 'Popover',
	components: {
		VPopover,
	},
}
</script>

<style lang="scss">
.popover,
.popover .popover-inner  {
	padding: 0px !important;
}
</style>
