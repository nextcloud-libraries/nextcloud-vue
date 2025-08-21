/*!
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { InjectionKey } from 'vue'

export const FIELDSET_CONTAINER_CLASS_KEY: InjectionKey<string> = Symbol.for('NcFieldset:container-class')