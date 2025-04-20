<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<script setup>
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
import { ref } from 'vue'
import NcButton from '../NcButton.vue'
import NcIconSvgWrapper from '../../NcIconSvgWrapper/NcIconSvgWrapper.vue'

const sortedName = ref()
const sortedSize = ref()

function sortName() {
	if (sortedName.value === 'ascending') {
		sortedName.value = 'descending'
	} else if (sortedName.value === 'descending') {
		sortedName.value = undefined
	} else {
		sortedName.value = 'ascending'
	}
}

function sortSize() {
	if (sortedSize.value === 'ascending') {
		sortedSize.value = 'descending'
	} else if (sortedSize.value === 'descending') {
		sortedSize.value = undefined
	} else {
		sortedSize.value = 'ascending'
	}
}
</script>

<template>
	<table>
		<thead>
			<tr>
				<th :aria-sorted="sortedName" class="row-name">
					<NcButton alignment="start-reverse"
						variant="tertiary"
						wide
						@click="sortName">
						<template v-if="sortedName" #icon>
							<NcIconSvgWrapper class="sort-icon"
								:path="sortedName === 'ascending' ? mdiChevronDown : mdiChevronUp" />
						</template>
						<span class="table-header">Name</span>
					</NcButton>
				</th>
				<th :aria-sorted="sortedSize" class="row-size">
					<NcButton alignment="end"
						variant="tertiary"
						wide
						@click="sortSize">
						<template v-if="sortedSize" #icon>
							<NcIconSvgWrapper class="sort-icon"
								:path="sortedSize === 'ascending' ? mdiChevronDown : mdiChevronUp" />
						</template>
						<span class="table-header">Size</span>
					</NcButton>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="row-name">
					Lorem ipsum
				</td>
				<td class="row-size">
					8 MiB
				</td>
			</tr>
		</tbody>
	</table>
</template>

<style scoped>
table {
	table-layout: fixed;
	width: 300px;
}

td.row-name {
	padding-inline-start: 16px;
}

td.row-size {
	text-align: end;
	padding-inline-end: 16px;
}

.table-header {
	font-weight: normal;
	color: var(--color-text-maxcontrast);
}

.sort-icon {
	color: var(--color-text-maxcontrast);
	position: relative;
	inset-inline: -10px;
}

.row-size .sort-icon {
	inset-inline: 10px;
}
</style>
