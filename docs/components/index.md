<!--
 - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup>
import { data as components } from './components.data.ts'
</script>

# Components

All components can be imported from their own entry point, for example:

```js
import NcButton from '@nextcloud/vue/components/NcButton'
```

<table class="nc-components-overview">
	<thead>
		<tr>
			<th>Component</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="component in components" :key="component.name">
			<td><a :href="`./${component.name}`">{{ component.name }}</a></td>
			<td>{{ component.description }}</td>
		</tr>
	</tbody>
</table>
