/*
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import NcAppContent from '../../../../src/components/NcAppContent/NcAppContent.vue'
import NcContent from '../../../../src/components/NcContent/NcContent.vue'

describe('NcContent', () => {
	it('provides its app name for the document title', () => {
		mount(NcContent, {
			props: {
				appName: 'files',
			},
			slots: {
				default: () => h(NcAppContent, { pageHeading: 'All files' }),
			},
		})

		expect(document.title).toBe('All files - files - Nextcloud')
	})
})
