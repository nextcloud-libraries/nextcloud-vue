<!--
  - SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description

Highlight a string with html &lt;strong&gt;. Accepts a substring to highlight or an array with ranges.

### Usage

```vue
<template>
	<div>
		<NcHighlight text="Highlight me please!" search="me" />
		<br />
		<NcHighlight text="Highlight me please!" :highlight="[{ start: 4, end: 12 }]" />
	</div>
</template>
```
</docs>

<script>
import FindRanges from '../../utils/FindRanges.js'

export default {
	name: 'NcHighlight',
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
		 * @return {Array} The array of ranges to highlight
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
			 * Ensure that the start of each range is equal to or smaller than the end
			 */
			ranges.forEach((range, i) => {
				if (range.end < range.start) {
					ranges[i] = {
						start: range.end,
						end: range.start,
					}
				}
			})

			/**
			 * Validate the ranges array to be within the string length
			 * and discard ranges which are completely out of bonds.
			 */
			ranges = ranges.reduce((validRanges, range) => {
				if (range.start < this.text.length && range.end > 0) {
					validRanges.push({
						start: (range.start < 0) ? 0 : range.start,
						end: (range.end > this.text.length) ? this.text.length : range.end,
					})
				}
				return validRanges
			}, [])

			/**
			 * Sort ranges ascendingly (necessary for next step)
			 */
			ranges.sort((a, b) => {
				return a.start - b.start
			})

			/**
			 * Merge overlapping or adjacent ranges
			 */
			ranges = ranges.reduce((mergedRanges, range) => {
				// If there are no ranges, just add the range
				if (!mergedRanges.length) {
					mergedRanges.push(range)
				} else {
					// If the range overlaps the last range, merge them
					const idx = mergedRanges.length - 1
					if (mergedRanges[idx].end >= range.start) {
						mergedRanges[idx] = {
							start: mergedRanges[idx].start,
							end: Math.max(mergedRanges[idx].end, range.end),
						}
					} else {
						mergedRanges.push(range)
					}
				}
				return mergedRanges
			}, [])

			return ranges
		},
		/**
		 * Calculate the different chunks to show based on the ranges to highlight.
		 *
		 * @return {Array} The chunks
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
						text: this.text.slice(range.start, range.end),
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
							text: this.text.slice(currentIndex),
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
					text: this.text.slice(currentIndex, range.start),
				})
				currentIndex = range.start
			}
			return chunks
		},
	},
	/**
	 * The render function to display the component
	 *
	 * @param {Function} h The function to create VNodes
	 * @return {object} The created VNode
	 */
	render(h) {
		if (!this.ranges.length) {
			return h('span', {}, this.text)
		}

		return h('span', {}, this.chunks.map(chunk => {
			return chunk.highlight ? h('strong', {}, chunk.text) : chunk.text
		}))
	},
}
</script>
