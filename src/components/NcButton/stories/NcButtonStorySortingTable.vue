<template>
	<table>
		<thead>
			<tr>
				<th :aria-sorted="sortedName" class="row-name">
					<NcButton alignment="start-reverse"
						:wide="true"
						type="tertiary"
						@click="sortName">
						<template #icon>
							<IconDown v-if="sortedName === 'ascending'" class="sort-icon" :size="20" />
							<IconUp v-else-if="sortedName === 'descending'" class="sort-icon" :size="20" />
						</template>
						<span class="table-header">Name</span>
					</NcButton>
				</th>
				<th :aria-sorted="sortedSize" class="row-size">
					<NcButton alignment="end"
						:wide="true"
						type="tertiary"
						@click="sortSize">
						<template #icon>
							<IconDown v-if="sortedSize === 'ascending'" class="sort-icon" :size="20" />
							<IconUp v-else-if="sortedSize === 'descending'" class="sort-icon" :size="20" />
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
<script>
import IconUp from 'vue-material-design-icons/MenuUp.vue'
import IconDown from 'vue-material-design-icons/MenuDown.vue'
import NcButton from '../NcButton.vue'

export default {
	components: {
		IconUp,
		IconDown,
		NcButton,
	},
	data() {
		return {
			sortedName: null,
			sortedSize: null,
		}
	},
	methods: {
		sortName() {
			if (this.sortedName === 'ascending') {
				this.sortedName = 'descending'
			} else if (this.sortedName === 'descending') {
				this.sortedName = null
			} else {
				this.sortedName = 'ascending'
			}
		},
		sortSize() {
			if (this.sortedSize === 'ascending') {
				this.sortedSize = 'descending'
			} else if (this.sortedSize === 'descending') {
				this.sortedSize = null
			} else {
				this.sortedSize = 'ascending'
			}
		},
	},
}
</script>
<style>
table {
	table-layout: fixed;
	width: 300px;
}

td.row-name {
	padding-inline-start: 16px;
}

td.row-size {
	text-align: right;
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
