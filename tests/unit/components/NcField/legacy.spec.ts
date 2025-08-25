/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'
import NcInputField from '../../../../src/components/NcInputField/NcInputField.vue'
import NcPasswordField from '../../../../src/components/NcPasswordField/NcPasswordField.vue'
import NcTextField from '../../../../src/components/NcTextField/NcTextField.vue'

vi.mock('../../../../src/utils/legacy.ts', () => ({ isLegacy: true }))

test.each`
name                 | component
${'NcInputField'}    | ${NcInputField}
${'NcPasswordField'} | ${NcPasswordField}
${'NcTextField'}     | ${NcTextField}
`('$name should have the placeholder set to the label on Nextcloud 31', async ({ component }) => {
	const wrapper = mount(component, {
		props: {
			modelValue: '',
			label: 'The label',
			placeholder: '',
		},
	})

	expect(wrapper.find('input').attributes('placeholder')).toBe('The label')
})
