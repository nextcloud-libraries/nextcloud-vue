<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
Provides a Vue standalone component for Nextcloud Projects feature introduced in Nextcloud 16. Replaces deprecated `nextcloud-vue-collections` library.

Projects feature is deprecated since Nextcloud 25, and superseded by Related resources. See [NcRelatedResourcesPanel](#/Components/NcRelatedResourcesPanel) documentation for more information.

### Usage

To enable feature in Nextcloud, run following command:
```sh
occ config:system:set --value true 'projects.enabled'
```
</docs>

<template>
	<ul v-if="collections && type && id" id="collection-list" class="collection-list">
		<li @click="showSelect">
			<div class="avatar">
				<span class="icon-projects" />
			</div>
			<div id="collection-select-container">
				<NcSelect
					ref="select"
					v-model="value"
					:aria-label-combobox="t('Add to a project')"
					:options="options"
					:placeholder="placeholder"
					label="title"
					:limit="5"
					@close="isSelectOpen = false"
					@open="isSelectOpen = true"
					@option:selected="select"
					@search="search">
					<template #selected-option="option">
						<span class="option__desc">
							<span class="option__title">{{ option.title }}</span>
						</span>
					</template>
					<template #option="option">
						<span class="option__wrapper">
							<span v-if="option.class" :class="option.class" class="avatar" />
							<NcAvatar v-else-if="option.method !== 2" allow-placeholder :display-name="option.title" />
							<span class="option__title">{{ option.title }}</span>
						</span>
					</template>
					<p class="hint">
						{{ t('Connect items to a project to make them easier to find') }}
					</p>
				</NcSelect>
			</div>
		</li>
		<transition name="fade">
			<li v-if="error" class="error">
				{{ error }}
			</li>
		</transition>
		<NcCollectionListItem
			v-for="collection in collections"
			:key="collection.id"
			:collection="collection"
			:error="collectionsError[collection.id]"
			@rename-collection="renameCollectionFromItem"
			@remove-resource="removeResourceFromCollection" />
	</ul>
</template>

<script>
import debounce from 'debounce'
import { ref } from 'vue'
import NcCollectionListItem from './NcCollectionListItem.vue'
import { t } from '../../l10n.js'
import { logger } from '../../utils/logger.ts'
import NcAvatar from '../NcAvatar/index.js'
import NcSelect from '../NcSelect/index.js'
import { searchService } from './service.ts'
import { useCollections } from './useCollections.js'

const METHOD_CREATE_COLLECTION = 0
const METHOD_ADD_TO_COLLECTION = 1

export default {
	name: 'NcCollectionList',

	components: {
		NcCollectionListItem,
		NcAvatar,
		NcSelect,
	},

	props: {
		/**
		 * Resource type identifier
		 */
		type: {
			type: String,
			default: null,
		},

		/**
		 * Unique id of the resource
		 */
		id: {
			type: String,
			default: null,
		},

		/**
		 * Name of the resource
		 */
		name: {
			type: String,
			default: '',
		},

		/**
		 * Whether the component is active (to start fetch resources)
		 */
		isActive: {
			type: Boolean,
			default: true,
		},
	},

	setup() {
		const {
			storedCollections,
			fetchCollectionsByResource,
			createCollection,
			addResourceToCollection,
			removeResourceFromCollection,
			renameCollection,
		} = useCollections()

		const searchCollections = ref([])
		const search = debounce(function(query, loading) {
			if (query !== '') {
				loading(true)
				searchService(query).then((collections) => {
					searchCollections.value = collections
				}).catch((e) => {
					logger.error('Failed to search for collections', e)
				}).finally(() => {
					loading(false)
				})
			}
		}, 500)

		return {
			storedCollections,
			fetchCollectionsByResource,
			createCollection,
			addResourceToCollection,
			removeResourceFromCollection,
			renameCollection,
			searchCollections,
			search,
		}
	},

	data() {
		return {
			selectIsOpen: false,
			generatingCodes: false,
			codes: undefined,
			value: null,
			model: {},
			collectionsError: {},
			error: null,
			isSelectOpen: false,
		}
	},

	computed: {
		collections() {
			return this.storedCollections.filter((collection) => collection.resources
				.some((resource) => resource && resource.id === String(this.id) && resource.type === this.type),
			)
		},

		placeholder() {
			return this.isSelectOpen
				? t('Type to search for existing projects')
				: t('Add to a project')
		},

		options() {
			const options = []
			window.OCP.Collaboration.getTypes().sort().forEach((type) => {
				options.push({
					method: METHOD_CREATE_COLLECTION,
					type,
					title: window.OCP.Collaboration.getLabel(type),
					class: window.OCP.Collaboration.getIcon(type),
					action: () => window.OCP.Collaboration.trigger(type),
				})
			})
			for (const index in this.searchCollections) {
				if (!this.collections.find((collection) => collection.id === this.searchCollections[index].id)) {
					options.push({
						method: METHOD_ADD_TO_COLLECTION,
						title: this.searchCollections[index].name,
						collectionId: this.searchCollections[index].id,
					})
				}
			}
			return options
		},

		resourceIdentifier() {
			return {
				resourceType: this.type,
				resourceId: this.id,
				isActive: this.isActive,
			}
		},
	},

	watch: {
		resourceIdentifier: {
			deep: true,
			immediate: true,
			handler(resourceIdentifier) {
				if (!resourceIdentifier.isActive || !resourceIdentifier.resourceId || !resourceIdentifier.resourceType) {
					return
				}
				this.fetchCollectionsByResource(resourceIdentifier)
			},
		},
	},

	methods: {
		t,

		select(selectedOption) {
			if (selectedOption.method === METHOD_CREATE_COLLECTION) {
				selectedOption.action().then((resourceId) => {
					this.createCollection({
						baseResourceType: this.type,
						baseResourceId: this.id,
						resourceType: selectedOption.type,
						resourceId,
						name: this.name,
					}).catch((e) => {
						this.setError(t('Failed to create a project'), e)
					})
				}).catch((e) => {
					logger.error('No resource selected', e)
				})
			}

			if (selectedOption.method === METHOD_ADD_TO_COLLECTION) {
				this.addResourceToCollection({
					collectionId: selectedOption.collectionId, resourceType: this.type, resourceId: this.id,
				}).catch((e) => {
					this.setError(t('Failed to add the item to the project'), e)
				})
			}

			this.value = null
		},

		showSelect() {
			this.selectIsOpen = true
			this.$refs.select.$el.focus()
		},

		setError(error, e) {
			logger.error(error, e)
			this.error = error
			setTimeout(() => {
				this.error = null
			}, 5000)
		},

		renameCollectionFromItem({ collectionId, name }) {
			this.renameCollection({ collectionId, name })
				.catch((e) => {
					logger.error(t('Failed to rename the project'), e)
					this.collectionsError[collectionId] = t('Failed to rename the project')
					setTimeout(() => {
						this.collectionsError[collectionId] = null
					}, 5000)
				})
		},
	},
}
</script>

<style lang="scss" scoped>
.collection-list * {
	box-sizing: border-box;
}

.collection-list > li {
	display: flex;
	align-items: center;
	gap: 12px;

	& > .avatar {
		margin-top: 0;
	}
}

#collection-select-container {
	display: flex;
	flex-direction: column;
}

.v-select {
	// NcAvatar in the dropdown
	span.avatar {
		display: block;
		padding: 16px;
		opacity: .7;
		background-repeat: no-repeat;
		background-position: center;

		&:hover {
			opacity: 1;
		}
	}
}

p.hint {
	z-index: 1;
	// fix alignment
	margin-top: -16px;
	padding: 8px 8px;
	color: var(--color-text-maxcontrast);
	line-height: normal;
}

div.avatar {
	width: 32px;
	height: 32px;
	margin: 0;
	padding: 8px;
	background-color: var(--color-background-dark);
	margin-top: 30px;
}

/** TODO provide white icon in core */
.icon-projects {
	display: block;
	padding: 8px;
	background-repeat: no-repeat;
	background-position: center;
}

.option__wrapper {
	display: flex;

	.avatar {
		display: block;
		width: 32px;
		height: 32px;
		background-color: var(--color-background-darker) !important;
	}

	.option__title {
		padding: 4px;
	}
}

.fade-enter-active, .fade-leave-active {
	transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
}

</style>
