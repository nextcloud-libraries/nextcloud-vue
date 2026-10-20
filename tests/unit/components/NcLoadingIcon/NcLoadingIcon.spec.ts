/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcLoadingIcon from '../../../../src/components/NcLoadingIcon/NcLoadingIcon.vue'

describe('NcLoadingIcon', () => {
	it('is hidden from assistive technologies when it has no name', () => {
		const wrapper = mount(NcLoadingIcon)

		expect(wrapper.attributes('aria-hidden')).toBe('true')
		expect(wrapper.attributes('role')).toBeUndefined()
		expect(wrapper.attributes('aria-label')).toBeUndefined()
	})

	it('is an image with an accessible name when it has a name', () => {
		const wrapper = mount(NcLoadingIcon, { props: { name: 'Loading files' } })

		expect(wrapper.attributes('role')).toBe('img')
		expect(wrapper.attributes('aria-label')).toBe('Loading files')
		expect(wrapper.attributes('aria-hidden')).toBeUndefined()
	})
})
