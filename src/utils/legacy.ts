/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const version = window.OC?.config?.version?.split('.')[0] || '34'
const major = Number.parseInt(version)
export const isLegacy32 = major < 32
export const isLegacy34 = major < 34
