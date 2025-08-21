/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const [majorVersion] = window.OC?.config?.version?.split('.') ?? []
export const isLegacy = Number.parseInt(majorVersion ?? '32') < 32
