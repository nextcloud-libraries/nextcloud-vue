/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const [majorVersion] = window.OC?.config?.version?.split('.') ?? []
// Fallback assumes the current major when no server version is detectable
// (tests, embedded use). Keeps legacy fallbacks off by default in those cases.
const major = Number.parseInt(majorVersion ?? '34')
export const isLegacy = major < 32
export const isLegacy34 = major < 34
