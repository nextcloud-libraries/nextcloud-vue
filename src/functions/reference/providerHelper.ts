/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { isCustomPickerElementRegistered } from './customPickerElements.ts'

import { t } from '../../l10n.js'

import axios from '@nextcloud/axios'
import { loadState } from '@nextcloud/initial-state'
import { generateOcsUrl, imagePath } from '@nextcloud/router'
import { logger } from '../../utils/logger.ts'

export interface ReferenceProvider {
	id: string
	title: string
	icon_url: string
	order: number
	search_providers_ids?: string[]
}

export const anyLinkProviderId = 'any-link'

const anyLinkProvider: ReferenceProvider = {
	id: anyLinkProviderId,
	title: t('Any link'),
	order: 0,
	icon_url: imagePath('core', 'filetypes/link.svg'),
}

// only get the provider list once, even if functions of this file are imported multiple times by different apps/components
window._vue_richtext_reference_providers ??= loadState('core', 'reference-provider-list', [])
// single timestamps object used by every entity in the page
window._vue_richtext_reference_provider_timestamps ??= loadState('core', 'reference-provider-timestamps', {})

/**
 * @param providerId - The provider ID
 * @return The provider object
 */
export function getProvider(providerId: string): ReferenceProvider|undefined {
	if (providerId === anyLinkProviderId) {
		return anyLinkProvider
	}

	return getProviders().find(p => p.id === providerId)
}

/**
 * Get raw provider list as it was provided by the server
 */
export function getProviders(): ReferenceProvider[] {
	return window._vue_richtext_reference_providers.filter((p) => {
		// avoid providers with no associated search provider and no custom component registered
		const keep = (!!p.search_providers_ids && p.search_providers_ids.length > 0) || isCustomPickerElementRegistered(p.id)
		if (!keep) {
			logger.debug(`[smart picker] ${p.id} reference provider is discoverable but does not have any related search provider or custom picker component registered`)
		}
		return keep
	})
}

/**
 * Helper function to sort a list of providers according to 2 factors:
 * - their "last used timestamp"
 * - their "order" property (coming from the provider declaration in the server implementation)
 *
 * @param providerList - List of provider objects
 * @return The sorted provider list
 */
export function sortProviders(providerList: ReferenceProvider[]): ReferenceProvider[] {
	const timestamps = window._vue_richtext_reference_provider_timestamps

	return providerList.sort((a, b) => {
		return a.order === b.order
			? 0
			: a.order > b.order
				? 1
				: -1
	}).sort((a, b) => {
		const ta = timestamps[a.id]
		const tb = timestamps[b.id]
		return ta === tb
			? 0
			: tb === undefined
				? -1
				: ta === undefined
					? 1
					: ta > tb
						? -1
						: 1
	})
}

/**
 * Helper function to search a provider from a search query
 * Result is a sorted list of providers
 *
 * @param query - The search query
 * @param limit - (optional) max number of results
 * @return The sorted/filtered provider list
 */
export function searchProvider(query: string, limit?: number): ReferenceProvider[] {
	const providers = getProviders()
	const escapedQuery = query.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
	const regexp = new RegExp(escapedQuery, 'i')
	const sortedProviders = sortProviders(providers)
	const filteredSortedProviders = sortedProviders.filter((p) => {
		return p.title.match(regexp)
	})

	const searchResult = limit
		? filteredSortedProviders.slice(0, limit)
		: filteredSortedProviders

	// append the 'any link' provider in the full list or when there is no result
	if (query === '' || searchResult.length === 0) {
		searchResult.push(anyLinkProvider)
	}
	return searchResult
}

/**
 * Update the "last used timestamp" on the server side and then locally in the frontend
 *
 * @param providerId - The id of the search provider
 */
export async function touchProvider(providerId: number) {
	const timestamp = Math.floor(Date.now() / 1000)
	const url = generateOcsUrl('references/provider/{providerId}', { providerId })

	await axios.put(url, { timestamp })
	window._vue_richtext_reference_provider_timestamps[providerId] = timestamp
}
