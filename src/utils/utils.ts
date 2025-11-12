/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export function once<F extends () => any>(func: F): F
export function once<F extends (...args: any[]) => void>(func: F): F
/**
 * Singletone function decorator
 *
 * @param func - Function
 */
export function once<F extends(() => any) | ((...args: any[]) => void)>(func: F): F {
	let wasCalled = false
	let result: ReturnType<F>

	return ((...args: Parameters<F>): ReturnType<F> => {
		if (!wasCalled) {
			wasCalled = true
			result = func(...args)
		}
		return result
	}) as F
}

/**
 * Memoization function decorator
 *
 * @param func - Function to memoize with a single argument
 */
export function memoize<F extends(arg: any) => any>(func: F): F {
	const cache = new Map<Parameters<F>[0], ReturnType<F>>()

	return ((arg: Parameters<F>[0]): ReturnType<F> => {
		if (cache.has(arg)) {
			return cache.get(arg)!
		}

		const result = func(arg)
		cache.set(arg, result)
		return result
	}) as F
}

/* eslint-enable @typescript-eslint/no-explicit-any */
