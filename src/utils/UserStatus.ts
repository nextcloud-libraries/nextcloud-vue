/**
 * @copyright 2023 Christopher Ng <chrng8@gmail.com>
 *
 * @author Christopher Ng <chrng8@gmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { t } from '../l10n.js'

import onlineSvg from '../assets/status-icons/user-status-online.svg?raw'
import awaySvg from '../assets/status-icons/user-status-away.svg?raw'
import dndSvg from '../assets/status-icons/user-status-dnd.svg?raw'
import invisibleSvg from '../assets/status-icons/user-status-invisible.svg?raw'

type Status = 'online' | 'away' | 'dnd' | 'invisible' | 'offline'

export const getUserStatusText = (status: Status): string => {
	switch (status) {
	// TRANSLATORS: User status if the user is currently away from keyboard
	case 'away': return t('away')
	case 'dnd': return t('do not disturb')
	case 'online': return t('online')
	case 'invisible': return t('inviisble')
	case 'offline': return t('offline')
	default: return status
	}
}

export const getUserStatusIcon = (status: Status): null | string => {
	const statusIconMap = {
		online: onlineSvg,
		away: awaySvg,
		dnd: dndSvg,
		invisible: invisibleSvg,
	}

	return statusIconMap[status] ?? null
}

export const getUserStatusIconName = (status: Status): string => {
	return t('User status: {status}', { status: getUserStatusText(status) })
}
