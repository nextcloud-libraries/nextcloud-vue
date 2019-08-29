<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
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

<template>
	<div class="name-parts" :title="name">
		<span class="name-parts__first" v-html="highlightedPart1" />
		<span v-if="part2" class="name-parts__last" v-html="highlightedPart2" />
	</div>
</template>
<script>
import escapeHtml from 'escape-html'
import highlightText from 'Mixins/highlightText'

export default {
	name: 'EllipsisedOption',

	mixins: [highlightText],

	props: {
		option: {
			type: [String, Object],
			required: true,
			default: ''
		},
		label: {
			type: String,
			default: ''
		},
		search: {
			type: String,
			default: ''
		}
	},

	computed: {
		name() {
			return this.$parent.getOptionLabel(this.option)
		},
		needsTruncate() {
			return this.name && this.name.length >= 10
		},
		part1() {
			if (this.needsTruncate) {
				// leave maximum 10 letters
				var split = Math.min(Math.floor(this.name.length / 2), 10)
				return this.name.substr(0, this.name.length - split)
			}
			return this.name
		},
		part2() {
			if (this.needsTruncate) {
				var split = Math.min(Math.floor(this.name.length / 2), 10)
				return this.name.substr(this.name.length - split)
			}
			return ''
		},
		highlightedPart1() {
			return this.highlightText(escapeHtml(this.part1), this.search)
		},
		highlightedPart2() {
			return this.highlightText(escapeHtml(this.part2), this.search)
		}
	}
}
</script>
<style lang="scss" scoped>
.name-parts {
	display: flex;
	max-width: 100%;
	&__first {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	&__first,
	&__last {
		// prevent whitespace from being trimmed
		white-space: pre;
		strong {
			font-weight: bold;
		}
	}
}
</style>
