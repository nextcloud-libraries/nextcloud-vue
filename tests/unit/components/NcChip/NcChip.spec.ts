/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mdiCheck } from '@mdi/js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcChip from '../../../../src/components/NcChip/NcChip.vue'
import NcIconSvgWrapper from '../../../../src/components/NcIconSvgWrapper/NcIconSvgWrapper.vue'

describe('NcChip', () => {
	it('shows its text', () => {
		const wrapper = mount(NcChip, { props: { text: 'Done', noClose: true } })
		expect(wrapper.text()).toBe('Done')
	})

	it('uses the secondary variant by default', () => {
		const wrapper = mount(NcChip, { props: { text: 'Done' } })
		expect(wrapper.classes()).toContain('nc-chip--secondary')
	})

	it.each(['error', 'warning', 'success', 'info'] as const)('supports the %s variant', (variant) => {
		const wrapper = mount(NcChip, { props: { text: 'Done', variant } })
		expect(wrapper.classes()).toContain(`nc-chip--${variant}`)
	})

	describe('size', () => {
		it('is normal by default', () => {
			const wrapper = mount(NcChip, { props: { text: 'Done', iconPath: mdiCheck } })
			expect(wrapper.classes()).not.toContain('nc-chip--small')
			expect(wrapper.getComponent(NcIconSvgWrapper).props('size')).toBe(18)
		})

		it('makes the chip and its icon smaller when small', () => {
			const wrapper = mount(NcChip, { props: { text: 'Done', iconPath: mdiCheck, size: 'small' } })
			expect(wrapper.classes()).toContain('nc-chip--small')
			expect(wrapper.getComponent(NcIconSvgWrapper).props('size')).toBe(16)
		})
	})

	describe('light', () => {
		it('is off by default', () => {
			const wrapper = mount(NcChip, { props: { text: 'Done', variant: 'success' } })
			expect(wrapper.classes()).not.toContain('nc-chip--light')
		})

		it('marks the chip as light', () => {
			const wrapper = mount(NcChip, { props: { text: 'Done', variant: 'success', light: true } })
			expect(wrapper.classes()).toEqual(expect.arrayContaining(['nc-chip--success', 'nc-chip--light']))
		})
	})
})
