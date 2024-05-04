import { isCustomPickerElementRegistered } from './customPickerElements.js'

import { t } from '../../l10n.js'

import axios from '@nextcloud/axios'
import { loadState } from '@nextcloud/initial-state'
import { generateOcsUrl, imagePath } from '@nextcloud/router'

export const anyLinkProviderId = 'any-link'

const anyLinkProvider = {
	id: anyLinkProviderId,
	title: t('Any link'),
	icon_url: imagePath('core', 'filetypes/link.svg'),
}

// only get the provider list once, even if functions of this file are imported multiple times by different apps/components
if (!window._vue_richtext_reference_providers) {
	window._vue_richtext_reference_providers = loadState(
		'core',
		'reference-provider-list',
		[],
	)
}

// single timestamps object used by every entity in the page
if (!window._vue_richtext_reference_provider_timestamps) {
	window._vue_richtext_reference_provider_timestamps = loadState(
		'core',
		'reference-provider-timestamps',
		{},
	)
}

/**
 * @param {string} providerId The provider ID
 * @return {object} The provider object
 */
export function getProvider(providerId) {
	if (providerId === anyLinkProviderId) {
		return anyLinkProvider
	}
	return getProviders().find((p) => p.id === providerId)
}

/**
 * @return {Array} Raw provider list as it was provided by the server
 */
export function getProviders() {
	return window._vue_richtext_reference_providers.filter((p) => {
		// avoid providers with no associated search provider and no custom component registered
		const keep =
			(!!p.search_providers_ids && p.search_providers_ids.length > 0) ||
			isCustomPickerElementRegistered(p.id)
		if (!keep) {
			console.debug(
				'[smart picker]',
				p.id,
				'reference provider is discoverable but does not have any related search provider or custom picker component registered',
			)
		}
		return keep
	})
}

/**
 * Helper function to sort a list of providers according to 2 factors:
 * - their "last used timestamp"
 * - their "order" property (coming from the provider declaration in the server implementation)
 *
 * @param {Array} providerList list of provider objects
 * @return {Array} the sorted provider list
 */
export function sortProviders(providerList) {
	const timestamps = window._vue_richtext_reference_provider_timestamps

	return providerList
		.sort((a, b) => {
			return a.order === b.order ? 0 : a.order > b.order ? 1 : -1
		})
		.sort((a, b) => {
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
 * @param {string} query The search query
 * @param {number} limit (optional) max number of results
 * @return {Array} the sorted/filtered provider list
 */
export function searchProvider(query, limit = null) {
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
 * @param {number} providerId The id of the search provider
 */
export function touchProvider(providerId) {
	const timestamp = Math.floor(Date.now() / 1000)
	const params = {
		timestamp,
	}
	const url = generateOcsUrl('references/provider/{providerId}', {
		providerId,
	})
	axios.put(url, params).then((response) => {
		window._vue_richtext_reference_provider_timestamps[providerId] = timestamp
	})
}
