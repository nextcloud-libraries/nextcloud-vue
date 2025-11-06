/*!
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

type ClassType = string | Record<string, boolean | undefined>
export type VueClassType = ClassType | ClassType[] | VueClassType[]
