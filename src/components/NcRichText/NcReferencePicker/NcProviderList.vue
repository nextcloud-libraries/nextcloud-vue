<template>
	<div class="provider-list">
		<NcMultiselect ref="provider-select"
			v-model="selectedProvider"
			class="provider-list--select"
			track-by="id"
			label="title"
			:placeholder="multiselectPlaceholder"
			:options="options"
			:internal-search="false"
			:clear-on-select="true"
			:preserve-search="true"
			:option-height="44"
			@search-change="query = $event"
			@input="onProviderSelected">
			<template #option="{option}">
				<div v-if="option.isLink" class="provider">
					<LinkVariantIcon class="link-icon" :size="20" />
					<span>{{ option.title }}</span>
				</div>
				<div v-else class="provider">
					<img class="provider-icon"
						:src="option.icon_url">
					<NcHighlight class="option-text"
						:search="query"
						:text="option.title" />
				</div>
			</template>
		</NcMultiselect>
		<NcEmptyContent class="provider-list--empty-content">
			<template #icon>
				<LinkVariantIcon />
			</template>
		</NcEmptyContent>
	</div>
</template>

<script>
import { searchProvider } from './providerHelper.js'
import { isUrl } from './utils.js'
import NcEmptyContent from '../../NcEmptyContent/index.js'
import NcHighlight from '../../NcHighlight/index.js'
import NcMultiselect from '../../NcMultiselect/index.js'
import { t } from '../../../l10n.js'

import LinkVariantIcon from 'vue-material-design-icons/LinkVariant.vue'

export default {
	name: 'NcProviderList',
	components: {
		NcMultiselect,
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
			multiselectPlaceholder: t('Select a link provider'),
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
			this.$nextTick(() => {
				this.$refs['provider-select']?.$el?.focus()
			})
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
	},
}
</script>

<style lang="scss" scoped>
.provider-list {
	width: 100%;
	min-height: 350px;
	// multiselect dropdown is wider than the select input
	// this avoids overflow
	padding-right: 2px;
	display: flex;
	flex-direction: column;

	&--empty-content {
		margin-top: auto !important;
		margin-bottom: auto !important;
	}

	&--select {
		width: 100%;

		.provider {
			display: flex;
			align-items: center;
			height: 28px;
			overflow: hidden;

			.link-icon {
				margin-right: 8px;
			}

			.provider-icon {
				width: 20px;
				height: 20px;
				object-fit: contain;
				margin-right: 8px;
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
