<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### Default usage

NcCounterBubble displays a number from the `count` prop in a bubble.

By default, the number is **humanized** according to Nextcloud user's locale setting. Humanization can be disabled via `raw` prop.

```vue
<template>
	<table>
		<tr>
			<th>count</th>
			<th>default</th>
			<th>raw</th>
		</tr>
		<tr v-for="num in numbers" :key="num">
			<td>{{ num }}</td>
			<td>
				<NcCounterBubble :count="num" />
			</td>
			<td>
				<NcCounterBubble :count="num" raw />
			</td>
		</tr>
	</table>
</template>

<script>
export default {
	setup() {
		return {
			numbers: [1, 9, 75, 450, 1042, 1750, 1999, 14567, 14567890, 2000000008],
		}
	},
}
</script>

<style scoped>
table {
	border-collapse: collapse;
}

th,
td {
	border: 1px solid var(--color-border);
	padding: var(--default-grid-baseline) calc(var(--default-grid-baseline) * 2);
}

th {
	color: var(--color-text-maxcontrast);
}
</style>
```

### Styles

Use different styles for different types of counters.

```
<template>
	<table>
		<tr>
			<th>type</th>
			<th>counter</th>
			<th>Usage example</th>
		</tr>
		<tr>
			<td>'' (default)</td>
			<td>
				<NcCounterBubble :count="3" />
			</td>
			<td></td>
		</tr>
		<tr>
			<td>outlined</td>
			<td><NcCounterBubble :count="3" type="outlined" /></td>
			<td>Team/group mentions</td>
		</tr>
		<tr>
			<td>highlighted</td>
			<td>
				<NcCounterBubble :count="3" type="highlighted" />
			</td>
			<td>Direct mentions</td>
		</tr>
		<tr>
			<td>outlined active</td>
			<td class="active-like">
				<NcCounterBubble :count="3" type="outlined" active />
			</td>
			<td>Same as "outlined", but in an "active" container</td>
		</tr>
		<tr>
			<td>highlighted active</td>
			<td class="active-like">
				<NcCounterBubble :count="3" type="highlighted" active />
			</td>
			<td>Same as "highlighted", but in an "active" container</td>
		</tr>
	</table>
</template>

<style scoped>
table {
	border-collapse: collapse;
}

th,
td {
	border: 1px solid var(--color-border);
	padding: var(--default-grid-baseline) calc(var(--default-grid-baseline) * 2);

	&.active-like {
		background-color: var(--color-primary-element);
	}
}

th {
	color: var(--color-text-maxcontrast);
}
</style>
```

### Custom content (removed)

In v8 it was possible to pass any custom content via the default slot. This feature has been removed. Use `count` prop for numbers or [NcChip](#/Components/NcChip) component for a custom content.
</docs>

<script setup lang="ts">
import { getCanonicalLocale } from '@nextcloud/l10n'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
	/**
	 * The count to display in the counter bubble.
	 */
	count: number

	/**
	 * Specifies whether the component is used within a component that is
	 * active and therefore has a primary background. Inverts the color of
	 * this component when that is the case.
	 */
	active?: boolean

	/**
	 * Visual appearence of the counter bubble
	 */
	type?: 'highlighted' | 'outlined' | ''

	/**
	 * Disables humanization to display count as it is.
	 */
	raw?: boolean
}>(), {
	type: '',
})

const humanizedCount = computed(() => {
	if (props.raw) {
		return props.count.toString()
	}

	const formatter = new Intl.NumberFormat(getCanonicalLocale(), {
		notation: 'compact',
		compactDisplay: 'short',
	})

	return formatter.format(props.count)
})

const originalCountAsTitleIfNeeded = computed(() => {
	if (props.raw) {
		return
	}

	const countAsString = props.count.toString()
	// If unchanged then there is no need for the title
	if (countAsString === humanizedCount.value) {
		return
	}

	return countAsString
})
</script>

<template>
	<div class="counter-bubble__counter"
		:class="{
			active,
			'counter-bubble__counter--highlighted': type === 'highlighted',
			'counter-bubble__counter--outlined': type === 'outlined',
		}"
		:title="originalCountAsTitleIfNeeded">
		{{ humanizedCount }}
	</div>
</template>

<style lang="scss" scoped>
.counter-bubble__counter {
	--counter-bubble-height: 22px; // ~ 1cap + 2 * 1.5 * grid
	font-size: var(--font-size-small, 13px);
	overflow: hidden;
	width: fit-content;
	min-width: var(--counter-bubble-height); // Make it not narrower than a circle
	text-align: center;
	line-height: var(--counter-bubble-height); // Expand line-height to full height to center text vertically
	padding: 0 calc(1.5 * var(--default-grid-baseline));
	border-radius: var(--border-radius-pill);
	background-color: var(--color-primary-element-light);
	font-weight: bold;
	color: var(--color-primary-element-light-text);

	& .active {
		color: var(--color-main-background);
		background-color: var(--color-primary-element-light);
	}

	&--highlighted {
		color: var(--color-primary-element-text);
		background-color: var(--color-primary-element);
	}

	&--highlighted.active {
		color: var(--color-primary-element);
		background-color: var(--color-main-background);
	}

	&--outlined {
		color: var(--color-primary-element);
		background: transparent;
		box-shadow: inset 0 0 0 2px;
	}

	&--outlined.active {
		color: var(--color-main-background);
		box-shadow: inset 0 0 0 2px;
	}
}
</style>
