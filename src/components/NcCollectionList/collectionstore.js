/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { reactive, set } from 'vue'
import service from './collectionservice.js'

const state = reactive({
	collections: [],
})

const mutations = {
	addCollections(collections) {
		set(state, 'collections', collections)
	},
	addCollection(collection) {
		state.collections.push(collection)
	},
	removeCollection(collectionId) {
		set(state, 'collections', state.collections.filter(item => item.id !== collectionId))
	},
	updateCollection(collection) {
		const index = state.collections.findIndex((_item) => _item.id === collection.id)
		if (index !== -1) {
			set(state.collections, index, collection)
		} else {
			state.collections.push(collection)
		}
	},
}

const actions = {
	fetchCollectionsByResource({ resourceType, resourceId }) {
		return service.getCollectionsByResource(resourceType, resourceId).then((collections) => {
			mutations.addCollections(collections)
			return collections
		})
	},
	createCollection({ baseResourceType, baseResourceId, resourceType, resourceId, name }) {
		return service.createCollection(baseResourceType, baseResourceId, name).then((collection) => {
			mutations.addCollection(collection)
			actions.addResourceToCollection({
				collectionId: collection.id,
				resourceType,
				resourceId,
			})
		})
	},
	renameCollection({ collectionId, name }) {
		return service.renameCollection(collectionId, name).then((collection) => {
			mutations.updateCollection(collection)
			return collection
		})
	},
	addResourceToCollection({ collectionId, resourceType, resourceId }) {
		return service.addResource(collectionId, resourceType, resourceId).then((collection) => {
			mutations.updateCollection(collection)
			return collection
		})
	},
	removeResource({ collectionId, resourceType, resourceId }) {
		return service.removeResource(collectionId, resourceType, resourceId).then((collection) => {
			if (collection.resources.length > 0) {
				mutations.updateCollection(collection)
			} else {
				mutations.removeCollection(collection)
			}
		})
	},
	search(query) {
		return service.search(query)
	},

}

const store = {
	actions,
	state,
}
export default store
export { actions, state }
