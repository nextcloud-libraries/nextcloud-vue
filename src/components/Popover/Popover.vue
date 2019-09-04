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
### Usage
```
<Popover>
	<p slot="trigger"> I am the trigger </p>
	<template>
		<div class="content">
			<h2>this is some content</h2>
		</div>
	</template>
</Popover>
```
</docs>

<template>
	<v-popover>
		<!-- This will be the popover target (for the events and position) -->
		<slot name='trigger' />
		<!-- This will be the content of the popover -->
		<template slot="popover">
			<slot />
		</template>
	</v-popover>
</template>

<script>
import { VPopover } from 'v-tooltip'

export default {
	name: 'Popover',

	components: {
		'v-popover': VPopover
	}
}
</script>
