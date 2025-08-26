/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'
import NcTextArea from '../../../../src/components/NcTextArea/NcTextArea.vue'

vi.mock('../../../../src/utils/legacy.ts', () => ({ isLegacy: true }))

test('NcTextArea should have the label as the placeholder on Nextcloud 31', () => {
	const wrapper = mount(NcTextArea, {
		props: {
			modelValue: '',
			label: 'The label',
		},
	})
	expect(wrapper.find('textarea').attributes('placeholder')).toBe('The label')
})
