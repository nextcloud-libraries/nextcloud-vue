<!--
  - @copyright Copyright (c) 2020 Raimund Schlüßler <raimund.schluessler@mailbox.org>
  -
  - @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
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

### General description

Highlight a string with html &lt;strong&gt;. Accepts a substring to highlight or an array with ranges.

### Usage

```vue
<template>
	<div>
		<Highlight text="Highlight me please!" search="me" />
		<br />
		<Highlight text="Highlight me please!" :highlight="[{ start: 4, end: 12 }]" />
	</div>
</template>
```
</docs>

<script>
import FindRanges from '../../utils/FindRanges'

export default {
	name: 'Highlight',
	props: {
		/**
		 * The string to display
		 */
		text: {
			type: String,
			default: '',
		},
		/**
		 * The string to match and highlight
		 */
		search: {
			type: String,
			default: '',
		},
		/**
		 * The ranges to highlight, takes precedence over the search prop.
		 */
		highlight: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		/**
		 * The indice ranges which should be highlighted.
		 * If an array with ranges is provided, we use it. Otherwise
		 * we calculate it based on the provided substring to highlight.
		 *
		 * @returns {Array} The array of ranges to highlight
		 */
		ranges() {
			let ranges = []
			// If the search term and the highlight array is empty, return early with empty array
			if (!this.search && this.highlight.length === 0) {
				return ranges
			}

			// If there are ranges to highlight provided, we use this array.
			if (this.highlight.length > 0) {
				ranges = this.highlight
			// Otherwise we check the text to highlight for matches of the search term.
			} else {
				ranges = FindRanges(this.text, this.search)
			}

			/**
			 * Validate the ranges array to be within the string length
			 * and discard ranges which are completely out of bonds.
			 */
			return ranges.reduce((validRanges, range) => {
				if (range.start < this.text.length && range.end > 0) {
					validRanges.push({
						start: (range.start < 0) ? 0 : range.start,
						end: (range.end > this.text.length) ? this.text.length : range.end,
					})
				}
				return validRanges
			}, [])
		},
		/**
		 * Calculate the different chunks to show based on the ranges to highlight.
		 *
		 * @returns {Array} The chunks
		 */
		chunks() {
			// If the ranges array is empty, show only one chunk with all text
			if (this.ranges.length === 0) {
				return [{
					start: 0,
					end: this.text.length,
					highlight: false,
					text: this.text,
				}]
			}
			// Calculate the chunks
			const chunks = []
			let currentIndex = 0
			let currentRange = 0
			// Iterate over all characters in the text
			while (currentIndex < this.text.length) {
				// Get the first range to highlight
				const range = this.ranges[currentRange]
				// If the range starts at the current index, construct a chunk to highlight,
				// set the next range and continue with the next iteration.
				if (range.start === currentIndex) {
					chunks.push({
						...range,
						highlight: true,
						text: this.text.substr(range.start, range.end - range.start),
					})
					currentRange++
					currentIndex = range.end
					// If this was the last range to highlight and we haven't reached the end of the text,
					// add the rest of the text without highlighting.
					if (currentRange >= this.ranges.length && currentIndex < this.text.length) {
						chunks.push({
							start: currentIndex,
							end: this.text.length,
							highlight: false,
							text: this.text.substr(currentIndex, this.text.length - currentIndex),
						})
						// Set the current index so the while loop ends.
						currentIndex = this.text.length
					}
					continue
				}
				// If the current range does start after the current index, construct a chunk without
				// highlighting and set the current index to the start of the current range.
				chunks.push({
					start: currentIndex,
					end: range.start,
					highlight: false,
					text: this.text.substr(currentIndex, range.start - currentIndex),
				})
				currentIndex = range.start
			}
			return chunks
		},
	},
	/**
	 * The render function to display the component
	 *
	 * @param {Function} createElement The function to create VNodes
	 * @returns {VNodes} The created VNodes
	 */
	render(createElement) {
		if (!this.ranges.length) {
			return createElement('span', {}, this.text)
		}

		return createElement('span', {}, this.chunks.map(chunk => {
			return chunk.highlight ? createElement('strong', {}, chunk.text) : chunk.text
		}))
	},
}
</script>
