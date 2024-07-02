/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios, { type AxiosResponse } from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import type { OCSResponse } from '@nextcloud/typings/ocs'

/**
 * Extracts the OCS data from a response
 * @param response OCS response
 */
function extractOcsData(response: AxiosResponse<OCSResponse>) {
	return response.data.ocs.data
}

/**
 * Lists all collections
 * @param collectionId Collection ID
 */
export function listCollectionService(collectionId: number) {
	return axios.get(generateOcsUrl('collaboration/resources/collections/{collectionId}', { collectionId })).then(extractOcsData)
}

/**
 * Renames a collection
 * @param collectionId Collection ID
 * @param collectionName New collection name
 */
export function renameCollectionService(collectionId: number, collectionName: string) {
	return axios.put(generateOcsUrl('collaboration/resources/collections/{collectionId}', { collectionId }), { collectionName }).then(extractOcsData)
}

/**
 * Lists all collections for a resource
 * @param resourceType Resource type
 * @param resourceId Resource ID
 */
export function getCollectionsByResourceService(resourceType: string, resourceId: string) {
	return axios.get(generateOcsUrl('collaboration/resources/{resourceType}/{resourceId}', { resourceType, resourceId })).then(extractOcsData)
}

/**
 * Creates a collection
 * @param resourceType Resource type
 * @param resourceId Resource ID
 * @param name Collection name
 */
export function createCollectionService(resourceType: string, resourceId: string, name: string) {
	return axios.post(generateOcsUrl('collaboration/resources/{resourceType}/{resourceId}', { resourceType, resourceId }), { name }).then(extractOcsData)
}

/**
 * Adds a resource to a collection
 * @param collectionId Collection ID
 * @param resourceType Resource type
 * @param resourceId Resource ID
 */
export function addResourceService(collectionId: number, resourceType: string, resourceId: string) {
	return axios.post(generateOcsUrl('collaboration/resources/collections/{collectionId}', { collectionId }), { resourceType, resourceId }).then(extractOcsData)
}

/**
 * Removes a resource from a collection
 * @param collectionId Collection ID
 * @param resourceType Resource type
 * @param resourceId Resource ID
 */
export function removeResourceService(collectionId: number, resourceType: string, resourceId: string) {
	return axios.delete(generateOcsUrl('collaboration/resources/collections/{collectionId}', { collectionId }), { params: { resourceType, resourceId } }).then(extractOcsData)
}

/**
 * Searches for collections
 * @param query Search query
 */
export function searchService(query: string) {
	return axios.get(generateOcsUrl('collaboration/resources/collections/search/{query}', { query })).then(extractOcsData)
}
