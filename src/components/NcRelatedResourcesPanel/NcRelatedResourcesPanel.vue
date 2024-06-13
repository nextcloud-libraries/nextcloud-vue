<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Usage

Use this component to display the related resources of a given item.

```
<template>
	<NcRelatedResourcesPanel provider-id="talk"
		header="Related resources for talk"
		:item-id="conversationId" />
</template>

<script>
export default {
	data() {
		return {
			conversationId: 1,
		}
	},
}
</script>
```
</docs>

<template>
	<div>
		<NcTeamResources :provider-id="providerId"
			:item-id="itemId" />

		<div v-if="appEnabled && isVisible" class="related-resources">
			<div class="related-resources__header">
				<h5>{{ header }}</h5>
				<p>{{ subline }}</p>
			</div>

			<NcResource v-for="resource in resources"
				:key="resource.itemId"
				class="related-resources__entry"
				:icon="resource.icon"
				:name="resource.title"
				:url="resource.url" />
		</div>
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import NcTeamResources from './NcTeamResources.vue'
import NcResource from './NcResource.vue'

import { t } from '../../l10n.js'

export default {
	name: 'NcRelatedResourcesPanel',

	components: {
		NcResource,
		NcTeamResources,
	},

	props: {
		/**
		 * The provider id implemented with `\OCA\RelatedResources\IRelatedResourceProvider::getProviderId()`
		 */
		providerId: {
			type: String,
			default: null,
		},
		/**
		 * The item id which uniquely identities the e.g. Calendar event, Deck board, file, Talk room, etc.
		 */
		itemId: {
			type: [String, Number],
			default: null,
		},
		/**
		 * Limits to specific resource type. i.e. any provider id implemented with `\OCA\RelatedResources\IRelatedResourceProvider::getProviderId()`
		 */
		resourceType: {
			type: String,
			default: '',
		},
		/**
		 * Set the maximum number of resources to load
		 */
		limit: {
			type: Number,
			default: 0,
		},
		/**
		 * Only used by the files sidebar
		 *
		 * File info is passed when registered with `OCA.Sharing.ShareTabSections.registerSection()`
		 */
		fileInfo: {
			type: Object,
			default: null,
		},
		/**
		 * Make the header name dynamic
		 */
		header: {
			type: String,
			default: t('Related resources'),
		},
		description: {
			type: String,
			default: t('Anything shared with the same group of people will show up here'),
		},
		/**
		 * If this element is used on a primary element set to true for primary styling.
		 */
		primary: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'has-error',
		'has-resources',
	],

	data() {
		return {
			appEnabled: OC?.appswebroots?.related_resources !== undefined,
			loading: false,
			error: null,
			resources: [],
		}
	},

	computed: {
		isVisible() {
			if (this.loading) {
				return false
			}
			return this.error ?? this.resources.length > 0
		},
		subline() {
			if (this.error) {
				return t('Error getting related resources. Please contact your system administrator if you have any questions.')
			}
			return this.description
		},

		hasResourceInfo() {
			if (this.providerId !== null && this.itemId !== null) {
				return true
			}
			if (this.fileInfo !== null) {
				return true
			}
			return false
		},

		isFiles() {
			return this.fileInfo?.id !== undefined
		},

		url() {
			let providerId = null
			let itemId = null

			if (this.isFiles) {
				providerId = 'files'
				itemId = this.fileInfo.id
			} else {
				providerId = this.providerId
				itemId = this.itemId
			}

			return generateOcsUrl('/apps/related_resources/related/{providerId}?itemId={itemId}&resourceType={resourceType}&limit={limit}&format=json', {
				providerId,
				itemId,
				resourceType: this.resourceType,
				limit: this.limit,
			})
		},
	},

	watch: {
		providerId() {
			this.fetchRelatedResources()
		},
		itemId() {
			this.fetchRelatedResources()
		},
		fileInfo() {
			this.fetchRelatedResources()
		},
		error(error) {
			/**
			 * Emitted when the error value changes
			 *
			 * @type {boolean}
			 */
			this.$emit('has-error', Boolean(error))
		},
		resources(resources) {
			/**
			 * Emitted when the resources value changes
			 *
			 * @type {boolean}
			 */
			this.$emit('has-resources', resources.length > 0)
		},
	},

	created() {
		this.fetchRelatedResources()
	},

	methods: {
		t,
		async fetchRelatedResources() {
			if (!this.appEnabled || !this.hasResourceInfo) {
				return
			}

			this.loading = true
			this.error = null
			this.resources = []
			try {
				const response = await axios.get(this.url)
				this.resources = response.data.ocs?.data
			} catch (e) {
				this.error = e
				console.error(e)
			} finally {
				this.loading = false
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.related-resources {
	&__header {

		h5 {
			font-weight: bold;
			margin-bottom: 6px;
		}

		p {
			color: var(--color-text-maxcontrast);
		}
	}
}
</style>
