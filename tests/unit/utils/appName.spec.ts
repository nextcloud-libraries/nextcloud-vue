/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import NcContent from '../../../src/components/NcContent/NcContent.vue'
import { useAppName } from '../../../src/utils/appName.ts'

const TestComponent = defineComponent({
	template: '<div>{{ appName }}</div>',
	setup() {
		return { appName: useAppName() }
	},
})

const WrappedTestComponent = defineComponent({
	template: '<NcContent app-name="custom_app"><TestComponent /></NcContent>',
	components: { NcContent, TestComponent },
})

describe('useAppName', () => {
	it('should return the fallback app name', () => {
		const wrapper = mount(TestComponent)
		expect(wrapper.text()).toBe('nextcloud-vue')
	})

	it('should return the app name injected by NcContent', () => {
		const wrapper = mount(WrappedTestComponent)
		expect(wrapper.text()).toBe('custom_app')
	})
})
