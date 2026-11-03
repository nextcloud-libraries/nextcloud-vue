/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const loadState = vi.hoisted(() => vi.fn())
vi.mock('@nextcloud/initial-state', () => ({ loadState }))

const ICONS_STATE = {
	iconUrl: '/nextcloud/core/img/icons/{name}.svg?v=abc12345',
	spriteUrl: '/nextcloud/core/img/icons.svg?v=abc12345',
	spriteIcons: ['close'],
}

/**
 * Mount NcIcon with a fresh module state, so the initial state is read again.
 *
 * @param props - The component props
 */
async function mountNcIcon(props: Record<string, unknown>) {
	const { default: NcIcon } = await import('../../../../src/components/NcIcon/index.ts')
	return mount(NcIcon, { props })
}

describe('NcIcon', () => {
	beforeEach(() => {
		vi.resetModules()
		loadState.mockReset()
	})

	it('references sprite icons from the sprite', async () => {
		loadState.mockReturnValue(ICONS_STATE)
		const wrapper = await mountNcIcon({ icon: 'close' })
		expect(wrapper.find('use').attributes('href')).toBe('/nextcloud/core/img/icons.svg?v=abc12345#i-close')
	})

	it('references other icons from their single icon file', async () => {
		loadState.mockReturnValue(ICONS_STATE)
		const wrapper = await mountNcIcon({ icon: 'cloud_upload' })
		expect(wrapper.find('use').attributes('href')).toBe('/nextcloud/core/img/icons/cloud_upload.svg?v=abc12345#i')
	})

	it('updates the reference when the icon changes', async () => {
		loadState.mockReturnValue(ICONS_STATE)
		const wrapper = await mountNcIcon({ icon: 'close' })
		await wrapper.setProps({ icon: 'star' })
		expect(wrapper.find('use').attributes('href')).toBe('/nextcloud/core/img/icons/star.svg?v=abc12345#i')
	})

	it('reads the initial state only once', async () => {
		loadState.mockReturnValue(ICONS_STATE)
		const { default: NcIcon } = await import('../../../../src/components/NcIcon/index.ts')
		mount(NcIcon, { props: { icon: 'close' } })
		mount(NcIcon, { props: { icon: 'star' } })
		expect(loadState).toHaveBeenCalledOnce()
		expect(loadState).toHaveBeenCalledWith('core', 'icons', null)
	})

	it('renders no reference if the server does not provide icons', async () => {
		loadState.mockReturnValue(null)
		const wrapper = await mountNcIcon({ icon: 'close' })
		expect(wrapper.find('svg').exists()).toBe(true)
		expect(wrapper.find('use').exists()).toBe(false)
	})

	it('hides the icon from assistive technologies without label', async () => {
		loadState.mockReturnValue(ICONS_STATE)
		const wrapper = await mountNcIcon({ icon: 'close' })
		expect(wrapper.attributes('aria-hidden')).toBe('true')
		expect(wrapper.attributes('aria-label')).toBeUndefined()
	})

	it('labels the icon if a label is set', async () => {
		loadState.mockReturnValue(ICONS_STATE)
		const wrapper = await mountNcIcon({ icon: 'close', label: 'Close' })
		expect(wrapper.attributes('aria-hidden')).toBeUndefined()
		expect(wrapper.attributes('aria-label')).toBe('Close')
	})
})
