/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { isRef, nextTick } from 'vue'
import { useIsMobile } from '../../../src/composables/useIsMobile/index.js'
import { resizeWindowWidth } from '../testing-utils.ts'

describe('useIsMobile', () => {
	it('should return ref', () => {
		const isMobile = useIsMobile()
		expect(isRef(isMobile)).toBe(true)
	})

	it('should be true on a small screen (1023 px)', async () => {
		await resizeWindowWidth(1023)
		const isMobile = useIsMobile()
		expect(isMobile.value).toBe(true)
	})

	it('should be false on a large screen (1024 px)', async () => {
		await resizeWindowWidth(1024)
		const isMobile = useIsMobile()
		expect(isMobile.value).toBe(false)
	})

	it('should update on resize', async () => {
		await resizeWindowWidth(1023)
		const isMobile = useIsMobile()

		await resizeWindowWidth(1024)
		await nextTick()

		expect(isMobile.value).toBe(false)
	})

	it('should work in a Vue component', async () => {
		await resizeWindowWidth(1024)
		const Component = {
			setup() {
				return { isMobile: useIsMobile() }
			},
			template: '<div>{{ isMobile }}</div>',
		}
		const wrapper = mount(Component)

		await resizeWindowWidth(1023)

		expect(wrapper.text()).toBe('true')
	})
})
