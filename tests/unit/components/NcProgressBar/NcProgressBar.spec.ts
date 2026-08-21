/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcProgressBar from '../../../../src/components/NcProgressBar/NcProgressBar.vue'

describe('NcProgressBar', () => {
	describe.each([
		['linear' as const, 'progress'],
		['circular' as const, 'span[role="progressbar"]'],
	])('type "%s"', (type, progressSelector) => {
		it('sets accessibility attributes on the progress element', () => {
			const wrapper = mount(NcProgressBar, {
				props: {
					type,
					value: 42,
					ariaLabel: 'Upload progress',
					ariaLabelledby: 'upload-label',
					ariaDescribedby: 'upload-description',
				},
			})

			const progress = wrapper.get(progressSelector)
			expect(progress.attributes('aria-label')).toBe('Upload progress')
			expect(progress.attributes('aria-labelledby')).toBe('upload-label')
			expect(progress.attributes('aria-describedby')).toBe('upload-description')
		})

		it('passes other attributes to the root element', () => {
			const wrapper = mount(NcProgressBar, {
				props: { type, value: 42 },
				attrs: {
					id: 'my-progress',
					'data-test': 'foo',
				},
			})

			expect(wrapper.attributes('id')).toBe('my-progress')
			expect(wrapper.attributes('data-test')).toBe('foo')
		})

		it('hides the value text from assistive technology', () => {
			const wrapper = mount(NcProgressBar, { props: { value: 42, showValue: true } })
			expect(wrapper.get('.progress-bar__value').attributes('aria-hidden')).toBe('true')
		})
	})
})
