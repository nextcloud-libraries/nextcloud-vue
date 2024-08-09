<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

 <docs>

### Normal Counter

```
<NcCounterBubble count=314 />
```

### Limited

```
<template>
	<table>
		<tr>
			<th>Limit</th>
			<th>Count</th>
			<th>NcCounterBubble</th>
		</tr>
		<tr>
			<td>999 (default)</td>
			<td>1000</td>
			<td>
				<NcCounterBubble count="1000" />
			</td>
		</tr>
		<tr>
			<td>12</td>
			<td>9</td>
			<td>
				<NcCounterBubble count="12" limit="9" />
			</td>
		</tr>
		<tr>
			<td>0 (disabled)</td>
			<td>1000</td>
			<td>
				<NcCounterBubble count="1000" limit="0" />
			</td>
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
}

th {
	color: var(--color-text-maxcontrast);
}
</style>
```

### Style type

```
<template>
	<table>
		<tr>
			<th>type</th>
			<th>NcCounterBubble</th>
			<th>Usage example</th>
		</tr>
		<tr>
			<td>'' (default)</td>
			<td>
				<NcCounterBubble count="314" />
			</td>
			<td></td>
		</tr>
		<tr>
			<td>outlined</td>
			<td><NcCounterBubble type="outlined" count="314" /></td>
			<td>Team mentions</td>
		</tr>
		<tr>
			<td>highlighted</td>
			<td>
				<NcCounterBubble type="highlighted" count="314" />
			</td>
			<td>Direct mentions</td>
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
}

th {
	color: var(--color-text-maxcontrast);
}
</style>
```

### Custom content

Deprecated. Use the `count` prop instead.

```
<NcCounterBubble>314+</NcCounterBubble>
````

</docs>

<template>
	<div :class="counterClassObject"
		class="counter-bubble__counter">
		<!--
			@slot The content with the count number. Deprecated: use the `count` prop instead.
			@deprecated
		-->
		<slot>
			{{ countWithLimit }}
		</slot>
	</div>
</template>

<script>

export default {
	name: 'NcCounterBubble',

	props: {
		type: {
			type: String,
			default: '',
			validator(value) {
				return ['highlighted', 'outlined', ''].includes(value)
			},
		},

		/**
		 * Specifies whether the component is used within a component that is
		 * active and therefore has a primary background. Inverts the color of
		 * this component when that is the case.
		 */
		active: {
			type: Boolean,
			default: false,
		},

		/**
		 * The count to display in the counter bubble.
		 * Alternatively, you can pass any value to the default slot.
		 */
		count: {
			type: Number,
			required: false,
			default: 0,
		},

		/**
		 * The maximal count number to be display. If the count is higher then "max+" is displayed.
		 * For example, with limit 999, 1000 will be displayed as "999+".
		 * Only works if the count is set via the `count` prop and not via the default slot.
		 * Set 0 to disable the limit.
		 */
		limit: {
			type: Number,
			required: false,
			default: 999,
		},
	},

	computed: {
		counterClassObject() {
			return {
				'counter-bubble__counter--highlighted': this.type === 'highlighted',
				'counter-bubble__counter--outlined': this.type === 'outlined',
				active: this.active,
			}
		},

		countWithLimit() {
			return this.count && this.limit && this.count > this.limit
				? `${this.limit}+`
				: this.count
		},
	},
}

</script>

<style lang="scss" scoped>
.counter-bubble__counter {
	font-size: calc(var(--default-font-size) * .8);
	overflow: hidden;
	width: fit-content;
	max-width: var(--default-clickable-area);
	min-width: calc(1lh + 2 * var(--default-grid-baseline)); // Make it not narrower than a circle
	text-align: center;
	line-height: 1;
	padding: var(--default-grid-baseline);
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
