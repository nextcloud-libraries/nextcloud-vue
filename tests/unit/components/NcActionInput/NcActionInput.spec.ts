/*
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mdiArrowRight } from '@mdi/js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcActionInput from '../../../../src/components/NcActionInput/NcActionInput.vue'

describe('NcActionInput', () => {
	it('renders the arrow icon in the trailing button', () => {
		const wrapper = mount(NcActionInput)

		expect(wrapper.html()).toContain(mdiArrowRight)
	})
})
