/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { t } from '../l10n.js'

type Status = 'online' | 'away' | 'busy' | 'dnd' | 'invisible' | 'offline'

export function getUserStatusText(status: Status): string {
	switch (status) {
		case 'away': return t('away') // TRANSLATORS: User status if the user is currently away from keyboard
		case 'busy': return t('busy')
		case 'dnd': return t('do not disturb')
		case 'online': return t('online')
		case 'invisible': return t('invisible')
		case 'offline': return t('offline')
		default: return status
	}
}
