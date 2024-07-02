/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'

class CollectionService {

	constructor() {
		this.http = axios
	}

	listCollection(collectionId) {
		return this.http.get(generateOcsUrl('collaboration/resources/collections/{collectionId}', { collectionId }))
	}

	renameCollection(collectionId, collectionName) {
		return this.http.put(generateOcsUrl('collaboration/resources/collections/{collectionId}', { collectionId }), {
			collectionName,
		}).then(result => {
			return result.data.ocs.data
		})
	}

	getCollectionsByResource(resourceType, resourceId) {
		return this.http.get(generateOcsUrl('collaboration/resources/{resourceType}/{resourceId}', { resourceType, resourceId }))
			.then(result => {
				return result.data.ocs.data
			})
	}

	createCollection(resourceType, resourceId, name) {
		return this.http.post(generateOcsUrl('collaboration/resources/{resourceType}/{resourceId}', { resourceType, resourceId }), {
			name,
		})
			.then((response) => {
				return response.data.ocs.data
			})
	}

	addResource(collectionId, resourceType, resourceId) {
		resourceId = '' + resourceId
		return this.http.post(generateOcsUrl('collaboration/resources/collections/{collectionId}', { collectionId }), {
			resourceType,
			resourceId,
		}).then((response) => {
			return response.data.ocs.data
		})
	}

	removeResource(collectionId, resourceType, resourceId) {
		return this.http.delete(generateOcsUrl('collaboration/resources/collections/{collectionId}', { collectionId }), { params: { resourceType, resourceId } })
			.then((response) => {
				return response.data.ocs.data
			})
	}

	search(query) {
		return this.http.get(generateOcsUrl('collaboration/resources/collections/search/{query}', { query }))
			.then((response) => {
				return response.data.ocs.data
			})
	}

}

const service = new CollectionService()

export default service
