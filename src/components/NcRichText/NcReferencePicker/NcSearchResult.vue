<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="result">
		<div v-if="entry.icon"
			:class="{ [entry.icon]: true, rounded: entry.rounded }"
			class="result--icon-class" />
		<img v-else
			class="result--image"
			:class="{ rounded: entry.rounded }"
			:src="entry.thumbnailUrl">
		<div class="result--content">
			<span class="result--content--name">
				<NcHighlight :search="query" :text="entry.title" />
			</span>
			<span class="result--content--subline">
				<NcHighlight :search="query" :text="entry.subline" />
			</span>
		</div>
	</div>
</template>

<script>
import NcHighlight from '../../NcHighlight/index.js'

export default {
	name: 'NcSearchResult',
	components: {
		NcHighlight,
	},
	props: {
		/**
		 * Unified search result entry
		 */
		entry: {
			type: Object,
			required: true,
		},
		/**
		 * The query that led to getting this result
		 * Used to highlight the entry text
		 */
		query: {
			type: String,
			required: true,
		},
	},
}
</script>

<style lang="scss" scoped>
.result {
	display: flex;
	align-items: center;
	height: var(--default-clickable-area);
	overflow: hidden;

	&--icon-class,
	&--image {
		width: 40px;
		min-width: 40px;
		height: 40px;
		object-fit: contain;

		&.rounded {
			border-radius: 50%;
		}
	}

	&--content {
		display: flex;
		flex-direction: column;
		padding-inline-start: 10px;
		overflow: hidden;

		&--name,
		&--subline {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
</style>
