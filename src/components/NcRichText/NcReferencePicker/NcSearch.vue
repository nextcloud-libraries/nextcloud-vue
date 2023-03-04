<template>
	<div class="search" :class="{ 'with-empty-content': showEmptyContent }">
		<NcMultiselect ref="search-select"
			v-model="selectedResult"
			class="search--select"
			track-by="resourceUrl"
			:placeholder="mySearchPlaceholder"
			:options="options"
			:internal-search="false"
			:clear-on-select="false"
			:close-on-select="false"
			:preserve-search="true"
			:loading="searching"
			:multiple="false"
			:option-height="60"
			@search-change="onSearchInput"
			@input="onSelectResultSelected">
			<template #option="{option}">
				<div v-if="option.isRawLink" class="custom-option">
					<LinkVariantIcon class="option-simple-icon" :size="20" />
					<span class="option-text">
						Raw link {{ option.resourceUrl }}
					</span>
				</div>
				<NcSearchResult v-else-if="option.resourceUrl"
					class="search-result"
					:entry="option"
					:query="searchQuery" />
				<span v-else-if="option.isCustomGroupTitle" class="custom-option group-title">
					<img v-if="provider.icon_url"
						class="provider-icon group-title-icon"
						:src="provider.icon_url">
					<span class="option-text">
						<strong>{{ option.name }}</strong>
					</span>
				</span>
				<span v-else-if="option.isMore" :class="{ 'custom-option': true }">
					<span v-if="option.isLoading" class="option-simple-icon icon-loading-small" />
					<DotsHorizontalIcon v-else class="option-simple-icon" :size="20" />
					<span class="option-text">
						Load more "{{ option.name }}"
					</span>
				</span>
			</template>
			<template #noOptions>
				<MagnifyIcon class="option-simple-icon" :size="20" />
				Start typing to search
			</template>
			<template #noResult>
				<MagnifyIcon class="option-simple-icon" :size="20" />
				Start typing to search
			</template>
		</NcMultiselect>
		<NcEmptyContent v-if="showEmptyContent"
			class="search--empty-content">
			<template #icon>
				<img v-if="provider.icon_url"
					class="provider-icon"
					:src="provider.icon_url">
				<LinkVariantIcon v-else />
			</template>
		</NcEmptyContent>
	</div>
</template>

<script>
import NcSearchResult from './NcSearchResult.vue'
import { isUrl, delay } from './utils.js'
import NcEmptyContent from '../../NcEmptyContent/index.js'
import NcMultiselect from '../../NcMultiselect/index.js'

import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'

import DotsHorizontalIcon from 'vue-material-design-icons/DotsHorizontal.vue'
import LinkVariantIcon from 'vue-material-design-icons/LinkVariant.vue'
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'

const LIMIT = 5

export default {
	name: 'NcSearch',
	components: {
		LinkVariantIcon,
		DotsHorizontalIcon,
		MagnifyIcon,
		NcEmptyContent,
		NcMultiselect,
		NcSearchResult,
	},
	props: {
		/**
		 * The selected reference provider
		 */
		provider: {
			type: Object,
			required: true,
		},
		showEmptyContent: {
			type: Boolean,
			default: true,
		},
		searchPlaceholder: {
			type: String,
			default: null,
		},
	},
	data() {
		return {
			searchQuery: '',
			selectedResult: null,
			resultsBySearchProvider: {},
			searching: false,
			searchingMoreOf: null,
			abortController: null,
		}
	},
	computed: {
		mySearchPlaceholder() {
			return this.searchPlaceholder
				? this.searchPlaceholder
				// TODO translate?
				: 'Search'
		},
		searchProviderIds() {
			return this.provider.search_providers_ids
		},
		options() {
			if (this.searchQuery === '') {
				return []
			}

			const options = []
			if (isUrl(this.searchQuery)) {
				options.push(this.rawLinkEntry)
			}
			options.push(...this.formattedSearchResults)
			return options
		},
		rawLinkEntry() {
			return {
				resourceUrl: this.searchQuery,
				isRawLink: true,
			}
		},
		formattedSearchResults() {
			const results = []
			this.searchProviderIds.forEach(pid => {
				if (this.resultsBySearchProvider[pid].entries.length > 0) {
					// don't show group title entry if there is only one search provider and one result
					if (this.searchProviderIds.length > 1 || this.resultsBySearchProvider[pid].entries.length > 1) {
						results.push({
							name: this.resultsBySearchProvider[pid].name,
							isCustomGroupTitle: true,
							providerId: pid,
						})
					}
					results.push(...this.resultsBySearchProvider[pid].entries)
					if (this.resultsBySearchProvider[pid].isPaginated) {
						results.push({
							name: this.resultsBySearchProvider[pid].name,
							isMore: true,
							providerId: pid,
							isLoading: this.searchingMoreOf === pid,
						})
					}
				}
			})
			return results
		},
	},
	mounted() {
		this.resetResults()
	},
	beforeDestroy() {
		this.cancelSearchRequests()
	},
	methods: {
		resetResults() {
			const resultsBySearchProvider = {}
			this.searchProviderIds.forEach(pid => {
				resultsBySearchProvider[pid] = {
					entries: [],
				}
			})
			this.resultsBySearchProvider = resultsBySearchProvider
		},
		focus() {
			this.$refs['search-select']?.$el?.focus()
		},
		cancelSearchRequests() {
			if (this.abortController) {
				this.abortController.abort()
			}
		},
		onSearchInput(query) {
			this.searchQuery = query
			delay(() => {
				this.updateSearch()
			}, 500)()
		},
		onSelectResultSelected(item) {
			if (item !== null) {
				if (item.resourceUrl) {
					this.cancelSearchRequests()
					this.$emit('submit', item.resourceUrl)
				} else if (item.isMore) {
					this.searchMoreOf(item.providerId)
				}
			}
			// avoid showing something in the singleLabel slot (selected item)
			this.selectedResult = null
		},
		searchMoreOf(searchProviderId) {
			this.searchingMoreOf = searchProviderId
			this.cancelSearchRequests()
			this.searchProviders(searchProviderId)
		},
		updateSearch() {
			this.cancelSearchRequests()
			this.resetResults()
			if (this.searchQuery === '') {
				this.searching = false
				return
			}

			this.searchProviders()
		},
		searchProviders(searchProviderId = null) {
			this.abortController = new AbortController()
			this.searching = true

			const searchPromises = searchProviderId === null
				? [...this.searchProviderIds].map(pid => {
					return this.searchOneProvider(pid)
				})
				: [this.searchOneProvider(searchProviderId, this.resultsBySearchProvider[searchProviderId]?.cursor ?? null)]
			// fake one to have a request error
			// searchPromises.push(this.searchOneProvider('nopid'))

			return Promise.allSettled(searchPromises)
				.then((promises) => {
					const isOneCanceled = !!promises.find(p => {
						return p.status === 'rejected' && (p.reason.name === 'CanceledError' || p.reason.code === 'ERR_CANCELED')
					})
					// nothing was canceled: not searching
					if (!isOneCanceled) {
						this.searching = false
						this.searchingMoreOf = null
					}
				})
		},
		searchOneProvider(providerId, cursor = null) {
			const url = cursor === null
				? generateOcsUrl('search/providers/{providerId}/search?term={term}&limit={limit}', { providerId, term: this.searchQuery, limit: LIMIT })
				: generateOcsUrl('search/providers/{providerId}/search?term={term}&limit={limit}&cursor={cursor}', { providerId, term: this.searchQuery, limit: LIMIT, cursor })
			return axios.get(url, {
				signal: this.abortController.signal,
			})
				.then((response) => {
					const data = response.data.ocs.data
					this.resultsBySearchProvider[providerId].name = data.name
					this.resultsBySearchProvider[providerId].cursor = data.cursor
					this.resultsBySearchProvider[providerId].isPaginated = data.isPaginated
					this.resultsBySearchProvider[providerId].entries.push(...data.entries)
				})
		},
	},
}
</script>

<style lang="scss" scoped>
.search {
	width: 100%;
	display: flex;
	flex-direction: column;
	&.with-empty-content {
		min-height: 350px;
	}

	&--empty-content {
		margin-top: auto !important;
		margin-bottom: auto !important;
	}

	.provider-icon {
		width: 150px;
		height: 150px;
		object-fit: contain;
		filter: var(--background-invert-if-dark);
	}

	&--select {
		width: 100%;

		.search-result {
			width: 100%;
		}

		.group-title-icon,
		.option-simple-icon {
			width: 20px;
			height: 20px;
			margin: 0 20px 0 10px;
		}

		.custom-option {
			height: 44px;
			display: flex;
			align-items: center;
			overflow: hidden;
		}

		.option-text {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		// multiselect dropdown is wider than the select input
		// this avoids overflow
		:deep(.multiselect__content-wrapper) {
			width: calc(100% - 4px) !important;
		}
	}
}
</style>
