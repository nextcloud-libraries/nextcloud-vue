<!--
  - SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
A component to display a long text with highlight support in one line truncated with ellipsis in the end but keeping up to 10 last characters.

It is supposed to be used as an `NcSelect`'s option in first place.

### General usage

```vue
<template>
	<div>
		<h4>Plain text</h4>
		<p>{{ text }}</p>

		<h4>Truncated text with <code>text-overflow: ellipsis</code></h4>
		<p style="text-overflow: ellipsis; overflow: hidden; white-space: pre;">{{ text }}</p>

		<h4>NcEllipsisedOption searching for "Nineteen"</h4>
		<NcEllipsisedOption :name="text" :search="search" />
	</div>
</template>

<script>
export default {
	data() {
		return {
			text: 'One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen Fourteen Fifteen Sixteen Seventeen Eighteen Nineteen Twenty',
			search: 'Nineteen',
		}
	},
}
</script>
```

### Usage in `NcSelect`

```vue
<template>
	<NcSelect v-model="selected" :options="options">
		<template #option="option">
			<NcEllipsisedOption :name="option.label" />
		</template>
		<template #selected-option="selectedOption">
			<NcEllipsisedOption :name="selectedOption.label" />
		</template>
	</NcSelect>
</template>

<script>
export default {
	data() {
		return {
			options: [
				'Option 1 - a short opt.',
				'Option 2 - a very very very very long opt.',
			].map((label) => ({ label })),
			selected: '',
		}
	},
}
</script>
```
</docs>

<template>
	<span dir="auto" class="name-parts" :title="name">
		<NcHighlight
			class="name-parts__first"
			:text="part1"
			:search="search"
			:highlight="highlight1" />
		<NcHighlight
			v-if="part2"
			class="name-parts__last"
			:text="part2"
			:search="search"
			:highlight="highlight2" />
	</span>
</template>

<script>
import { findRanges } from '../../utils/findRanges.ts'
import NcHighlight from '../NcHighlight/index.ts'

export default {
	name: 'NcEllipsisedOption',

	components: {
		NcHighlight,
	},

	props: {
		/**
		 * The text to be display in one line. If it is longer than 10 characters, it is be truncated with ellipsis in the end but keeping up to 10 last characters to fit the parent container.
		 */
		name: {
			type: String,
			default: '',
		},

		/**
		 * The search value to highlight in the text
		 */
		search: {
			type: String,
			default: '',
		},
	},

	computed: {
		needsTruncate() {
			return this.name && this.name.length >= 10
		},

		/**
		 * Index at which to split the name if it is longer than 10 characters.
		 *
		 * @return {number} The position at which to split
		 */
		split() {
			// leave maximum 10 letters
			return this.name.length - Math.min(Math.floor(this.name.length / 2), 10)
		},

		part1() {
			if (this.needsTruncate) {
				return this.name.slice(0, this.split)
			}
			return this.name
		},

		part2() {
			if (this.needsTruncate) {
				return this.name.slice(this.split)
			}
			return ''
		},

		/**
		 * The ranges to highlight. Since we split the string for ellipsising,
		 * the Highlight component cannot figure this out itself and needs the ranges provided.
		 *
		 * @return {Array} The array with the ranges to highlight
		 */
		highlight1() {
			if (!this.search) {
				return []
			}
			return findRanges(this.name, this.search)
		},

		/**
		 * We shift the ranges for the second part by the position of the split.
		 * Ranges out of the string length are discarded by the Highlight component,
		 * so we don't need to take care of this here.
		 *
		 * @return {Array} The array with the ranges to highlight
		 */
		highlight2() {
			return this.highlight1.map((range) => {
				return {
					start: range.start - this.split,
					end: range.end - this.split,
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.name-parts {
	display: flex;
	max-width: 100%;
	cursor: inherit;
	&__first {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	&__first,
	&__last {
		// prevent whitespace from being trimmed
		white-space: pre;
		cursor: inherit;
		strong {
			font-weight: bold;
		}
	}
}
</style>
