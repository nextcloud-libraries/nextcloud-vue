/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Component } from 'vue'

export type IconComponent = Component
export type IconPath = `M${number}${string}`
export type IconSvg = `<svg${string}>${string}</svg>`
export type IconUrl = `http://${string}` | `https://${string}` | `data:${string}`
export type IconClass = `icon-${string}`
export type IconGeneral = IconComponent | IconPath | IconClass | IconSvg | IconUrl

export type IconNormalized = { type: 'component', icon: IconComponent }
    | { type: 'path', icon: IconPath }
    | { type: 'svg', icon: IconSvg }
    | { type: 'url', icon: IconUrl }
    | { type: 'class', icon: IconClass }
    | { type: 'unknown', icon: IconGeneral }

/**
 *
 * @param icon - Icon in any supported format
 */
export function normalizeIcon(icon: IconGeneral): IconNormalized {
	if (typeof icon === 'object' || typeof icon === 'function') {
		return { type: 'component', icon: icon as IconComponent }
	}
	if (icon.startsWith('<svg')) {
		return { type: 'svg', icon: icon as IconSvg }
	}
	if (icon.startsWith('M')) {
		return { type: 'path', icon: icon as IconPath }
	}
	if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('data:')) {
		return { type: 'url', icon: icon as IconUrl }
	}
	if (icon.startsWith('icon-')) {
		return { type: 'class', icon: icon as IconClass }
	}
	return { type: 'unknown', icon: icon as IconGeneral }
}
