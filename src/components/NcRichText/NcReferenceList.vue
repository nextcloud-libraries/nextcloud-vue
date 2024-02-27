<template>
	<div v-if="isVisible" class="widgets--list" :class="{'icon-loading': loading }">
		<div v-for="reference in displayedReferences" :key="reference?.openGraphObject?.id">
			<NcReferenceWidget :reference="reference" :interactive="interactive" :interactive-opt-in="interactiveOptIn" />
		</div>
	</div>
</template>
<script>
import NcReferenceWidget from './NcReferenceWidget.vue'
import { URL_PATTERN } from './helpers.js'

import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'

export default {
	name: 'NcReferenceList',
	components: {
		NcReferenceWidget,
	},
	props: {
		text: {
			type: String,
			default: '',
		},
		referenceData: {
			type: Object,
			default: null,
		},
		limit: {
			type: Number,
			default: 1,
		},
		displayFallback: {
			type: Boolean,
			default: false,
		},
		interactive: {
			type: Boolean,
			default: true,
		},
		interactiveOptIn: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['loaded'],
	data() {
		return {
			references: null,
			loading: true,
		}
	},
	computed: {
		isVisible() {
			return this.loading || this.displayedReferences.length !== 0
		},
		values() {
			if (this.referenceData) {
				return this.referenceData
			}

			if (this.displayFallback && !this.loading && !this.references) {
				return [this.fallbackReference]
			}

			return this.references ? Object.values(this.references) : []
		},
		firstReference() {
			return this.values[0] ?? null
		},
		displayedReferences() {
			return this.values.slice(0, this.limit)
		},
		fallbackReference() {
			return {
				accessible: true,
				openGraphObject: {
					id: this.text,
					link: this.text,
					name: this.text,
				},
				richObjectType: 'open-graph',
			}
		},
	},
	watch: {
		text: 'fetch',
	},
	mounted() {
		this.fetch()
	},
	methods: {
		fetch() {
			this.loading = true
			if (this.referenceData) {
				this.loading = false
				return
			}

			if (!(new RegExp(URL_PATTERN).exec(this.text))) {
				this.loading = false
				return
			}

			this.resolve().then((response) => {
				this.references = response.data.ocs.data.references
				this.loading = false
				this.$emit('loaded')
			}).catch((error) => {
				console.error('Failed to extract references', error)
				this.loading = false
				this.$emit('loaded')
			})
		},
		resolve() {
			const match = (new RegExp(URL_PATTERN).exec(this.text.trim()))
			if (this.limit === 1 && match) {
				return axios.get(generateOcsUrl('references/resolve', 2) + `?reference=${encodeURIComponent(match[0])}`)
			}

			return axios.post(generateOcsUrl('references/extract', 2), {
				text: this.text,
				resolve: true,
				limit: this.limit,
			})
		},
	},
}
</script>
<style lang="scss" scoped>
.widgets--list.icon-loading {
	min-height: 44px;
}
</style>
