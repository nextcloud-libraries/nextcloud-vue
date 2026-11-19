/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { loadState } from '@nextcloud/initial-state'
import { logger } from '../../utils/logger.ts'

interface IconsInitialState {
	/** URL of a single icon file, `{name}` is the placeholder for the icon name */
	iconUrl: string
	/** URL of the sprite containing the most used icons */
	spriteUrl: string
	/** Names of the icons contained in the sprite */
	spriteIcons: string[]
}

let icons: { iconUrl: string, spriteUrl: string, spriteIcons: Set<string> } | null | undefined

/**
 * Get the href to reference an icon from an SVG `<use>` element.
 * Icons of the sprite are referenced from the sprite, all others from their single icon file.
 *
 * @param name - The icon name
 * @return The href or undefined if the server does not provide icons
 */
export function getIconHref(name: string): string | undefined {
	if (icons === undefined) {
		const state = loadState<IconsInitialState | null>('core', 'icons', null)
		if (state === null) {
			logger.warn('NcIcon: icons are not provided by the server (missing "core/icons" initial state)')
		}
		icons = state && {
			iconUrl: state.iconUrl,
			spriteUrl: state.spriteUrl,
			spriteIcons: new Set(state.spriteIcons),
		}
	}

	if (!icons) {
		return undefined
	}
	if (icons.spriteIcons.has(name)) {
		return `${icons.spriteUrl}#i-${name}`
	}
	return `${icons.iconUrl.replace('{name}', name)}#i`
}
