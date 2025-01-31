<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="provider-list">
		<NcSelect ref="provider-select"
			v-model="selectedProvider"
			class="provider-list--select"
			input-id="provider-select-input"
			label="title"
			:placeholder="multiselectPlaceholder"
			:options="options"
			:append-to-body="false"
			:clear-search-on-select="true"
			:clear-search-on-blur="() => false"
			:filterable="false"
			@search="onSearch"
			@input="onProviderSelected">
			<template #option="option">
				<div v-if="option.isLink" class="provider">
					<LinkVariantIcon class="link-icon" :size="20" />
					<span>{{ option.title }}</span>
				</div>
				<div v-else class="provider">
					<img class="provider-icon"
						:src="option.icon_url"
						:alt="providerIconAlt">
					<NcHighlight class="option-text"
						:search="query"
						:text="option.title" />
				</div>
			</template>
		</NcSelect>
		<NcEmptyContent class="provider-list--empty-content">
			<template #icon>
				<LinkVariantIcon />
			</template>
		</NcEmptyContent>
	</div>
</template>

<script>
import { searchProvider } from './../../../functions/reference/providerHelper.js'
import { isUrl } from './utils.js'
import NcEmptyContent from '../../NcEmptyContent/index.js'
import NcHighlight from '../../NcHighlight/index.js'
import NcSelect from '../../NcSelect/index.js'
import { t } from '../../../l10n.js'

import LinkVariantIcon from 'vue-material-design-icons/LinkVariant.vue'

export default {
	name: 'NcProviderList',
	components: {
		NcSelect,
		NcHighlight,
		NcEmptyContent,
		LinkVariantIcon,
	},
	emits: [
		'select-provider',
		'submit',
	],
	data() {
		return {
			selectedProvider: null,
			query: '',
			multiselectPlaceholder: t('Select provider'),
			providerIconAlt: t('Provider icon'),
		}
	},
	computed: {
		options() {
			const result = []
			if (this.query !== '' && isUrl(this.query)) {
				result.push({
					id: this.query,
					title: this.query,
					isLink: true,
				})
			}
			result.push(...searchProvider(this.query))
			return result
		},
	},
	methods: {
		focus() {
			setTimeout(() => {
				this.$refs['provider-select']?.$el?.querySelector('#provider-select-input')?.focus()
			}, 300)
		},
		onProviderSelected(p) {
			if (p !== null) {
				if (p.isLink) {
					this.$emit('submit', p.title)
				} else {
					this.$emit('select-provider', p)
				}
				this.selectedProvider = null
			}
		},
		onSearch(query, loading) {
			this.query = query
		},
	},
}
</script>

<style lang="scss" scoped>
.provider-list {
	width: 100%;
	min-height: 400px;
	padding: 0 16px 16px 16px;
	display: flex;
	flex-direction: column;

	&--select {
		width: 100%;

		.provider {
			display: flex;
			align-items: center;
			height: 28px;
			overflow: hidden;

			.link-icon {
				margin-inline-end: 8px;
			}

			.provider-icon {
				width: 20px;
				height: 20px;
				object-fit: contain;
				margin-inline-end: 8px;
				filter: var(--background-invert-if-dark);
			}

			.option-text {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

		}
	}
}
</style>
