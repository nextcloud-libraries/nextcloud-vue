/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IProfileData } from './NcProfileHoverCard.vue'

/** Default TTL for cached profile payloads (30 minutes). */
export const PROFILE_CACHE_TTL_MS = 30 * 60 * 1000

interface CacheEntry {
	data: IProfileData
	expiresAt: number
}

const cache = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<IProfileData | null>>()

/**
 * Return a non-expired cached profile for the user, or null.
 *
 * @param userId - User id
 */
export function getCachedProfile(userId: string): IProfileData | null {
	const entry = cache.get(userId)
	if (!entry) {
		return null
	}
	if (Date.now() >= entry.expiresAt) {
		cache.delete(userId)
		return null
	}
	return entry.data
}

/**
 * Store profile data in the shared TTL cache.
 *
 * @param userId - User id
 * @param data - Profile payload
 * @param ttlMs - Time to live in milliseconds
 */
export function setCachedProfile(userId: string, data: IProfileData, ttlMs = PROFILE_CACHE_TTL_MS): void {
	cache.set(userId, {
		data,
		expiresAt: Date.now() + ttlMs,
	})
}

/**
 * Clear all cached profiles and in-flight fetches. Used by tests.
 *
 * @internal
 */
export function clearProfileCache(): void {
	cache.clear()
	inflight.clear()
}

/**
 * Fetch a profile with shared TTL cache and in-flight request deduplication.
 *
 * @param userId - User id
 * @param fetcher - Network loader invoked on cache miss
 * @param ttlMs - Time to live for a successful result
 */
export async function fetchProfileCached(
	userId: string,
	fetcher: () => Promise<IProfileData | null>,
	ttlMs = PROFILE_CACHE_TTL_MS,
): Promise<IProfileData | null> {
	const cached = getCachedProfile(userId)
	if (cached) {
		return cached
	}

	const pending = inflight.get(userId)
	if (pending) {
		return pending
	}

	const promise = (async () => {
		try {
			const data = await fetcher()
			if (data) {
				setCachedProfile(userId, data, ttlMs)
			}
			return data
		} finally {
			inflight.delete(userId)
		}
	})()

	inflight.set(userId, promise)
	return promise
}
