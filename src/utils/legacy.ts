/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export const isLegacy = Number.parseInt(window.OC?.config.version.split('.')[0] ?? '32') < 32
