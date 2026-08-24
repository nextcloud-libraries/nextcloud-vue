/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const version = window.OC?.config?.version?.split('.')[0] || '35'
const major = Number.parseInt(version)
export const isLegacy32 = major < 32
export const isLegacy34 = major < 34
/** Nextcloud 32–34: keep pre–profile-hovercard avatar contacts menu. */
export const isLegacy35 = major < 35
