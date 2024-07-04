/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { ref } from 'vue'
import {
	renameCollectionService,
	getCollectionsByResourceService,
	createCollectionService,
	addResourceService,
	removeResourceService,
} from './service.ts'

/**
 * Use collections composable
 */
export function useCollections() {
	// State
	const storedCollections = ref([])

	// Mutations
	const addCollections = (collections) => {
		storedCollections.value = collections
	}

	const addCollection = (collection) => {
		storedCollections.value.push(collection)
	}

	const removeCollection = (collectionId) => {
		storedCollections.value = storedCollections.value.filter(item => item.id !== collectionId)
	}

	const updateCollection = (collection) => {
		const index = storedCollections.value.findIndex(item => item.id === collection.id)
		if (index !== -1) {
			storedCollections.value[index] = collection
		} else {
			addCollection(collection)
		}
	}

	// Actions
	const fetchCollectionsByResource = async ({ resourceType, resourceId }) => {
		const collections = await getCollectionsByResourceService(resourceType, resourceId)

		addCollections(collections)
	}

	const createCollection = async ({ baseResourceType, baseResourceId, resourceType, resourceId, name }) => {
		const collection = await createCollectionService(baseResourceType, baseResourceId, name)

		addCollection(collection)
		await addResourceToCollection({
			collectionId: collection.id,
			resourceType,
			resourceId,
		})
	}

	const renameCollection = async ({ collectionId, name }) => {
		const collection = await renameCollectionService(collectionId, name)

		updateCollection(collection)
	}

	const addResourceToCollection = async ({ collectionId, resourceType, resourceId }) => {
		const collection = await addResourceService(collectionId, resourceType, String(resourceId))

		updateCollection(collection)
	}

	const removeResourceFromCollection = async ({ collectionId, resourceType, resourceId }) => {
		const collection = await removeResourceService(collectionId, resourceType, String(resourceId))

		if (collection.resources.length > 0) {
			updateCollection(collection)
		} else {
			removeCollection(collectionId)
		}
	}

	return {
		storedCollections,
		fetchCollectionsByResource,
		createCollection,
		renameCollection,
		addResourceToCollection,
		removeResourceFromCollection,
	}
}
