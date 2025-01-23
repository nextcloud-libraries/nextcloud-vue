/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { useId } from 'vue'

const sanitizedAppName = String(appName).replaceAll(/[^a-z0-9-_]/gi, '') || 'nc'

/**
 * Get the next element id for use with HTML / CSS.
 * We can not be sure that the app has a prefix setup so we prefix ourself
 */
export function getElementId() {
	return `${sanitizedAppName}-${useId()}`
}
