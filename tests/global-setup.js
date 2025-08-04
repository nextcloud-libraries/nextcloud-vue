/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Global test setup used to configure process environment.
 */
export function setup() {
	globalThis.process.env.TZ = 'UTC'
}
