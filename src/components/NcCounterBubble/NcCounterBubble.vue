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

### Custom content (deprecated)

You can use the default slot to pass any custom content. If you pass a plain number to the default slot, without raw prop it will be humanized like via `count` prop.

**DEPRECATED:** passing count via slot content is **deprecated** and will be removed in the v9. Prefer using `count` prop for numbers or [NcChip](#/Components/NcChip) component for a custom content.

```vue
<template>
	<table>
		<tr>
			<th>content</th>
			<th>default</th>
			<th>raw</th>
		</tr>
		<tr v-for="num in numbers" :key="num">
			<td>{{ num }}</td>
			<td>
				<NcCounterBubble>{{ num }}</NcCounterBubble>
			</td>
			<td>
				<NcCounterBubble raw>{{ num }}</NcCounterBubble>
			</td>
		</tr>
	</table>
</template>

<script>
export default {
	setup() {
		return {
			numbers: ['314+', '16 rows', '24564'],
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
</docs>

<script>
import { getCanonicalLocale } from '@nextcloud/l10n'

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
			default: undefined,
		},

		/**
		 * Disables humanization to display count or content as it is
		 */
		raw: {
			type: Boolean,
			required: false,
			default: false,
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

		humanizedCount() {
			return this.humanizeCount(this.count)
		},
	},

	methods: {
		humanizeCount(count) {
			if (this.raw) {
				return count.toString()
			}

			const formatter = new Intl.NumberFormat(getCanonicalLocale(), {
				notation: 'compact',
				compactDisplay: 'short',
			})

			return formatter.format(count)
		},

		/**
		 * Get the humanized count from `count` prop
		 * @return {{ humanized: string, original: string} | undefined}
		 */
		getHumanizedCount() {
			// If we have count prop - just render from count
			if (this.count !== undefined) {
				return {
					humanized: this.humanizedCount,
					original: this.count.toString(),
				}
			}

			// Raw value - render as it is
			if (this.raw) {
				return undefined
			}

			// If slot content is just a text with a number - process like count
			if (this.$slots.default?.length === 1) {
				const slotContent = this.$slots.default[0].text?.trim()
				if (slotContent && /^\d+$/.test(slotContent)) {
					const count = parseInt(slotContent, 10)
					return {
						humanized: this.humanizeCount(count),
						original: slotContent,
					}
				}
			}
		},
	},

	render(h) {
		const count = this.getHumanizedCount()

		return h('div', {
			staticClass: 'counter-bubble__counter',
			class: this.counterClassObject,
			attrs: {
				// Show original count in title if humanized
				title: count && count.original !== count.humanized ? count.original : undefined,
			},
		}, [count?.humanized ?? this.$slots.default])
	},
}

</script>

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
