/*
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mdiInformationOutline } from '@mdi/js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcNoteCard from '../../../../src/components/NcNoteCard/NcNoteCard.vue'

describe('NcNoteCard', () => {
	it('shows a neutral note as a note with its own icon', () => {
		const wrapper = mount(NcNoteCard, { props: { type: 'neutral', text: 'Neither good nor bad' } })

		expect(wrapper.classes()).toContain('notecard--neutral')
		expect(wrapper.attributes('role')).toBe('note')
		expect(wrapper.html()).toContain(mdiInformationOutline)
	})

	it('shows the actions next to the text', () => {
		const wrapper = mount(NcNoteCard, {
			props: { type: 'neutral', text: 'Locked by you' },
			slots: { actions: '<button>Unlock</button>' },
		})

		const actions = wrapper.find('.notecard__actions')
		expect(actions.exists()).toBe(true)
		expect(actions.find('button').text()).toBe('Unlock')
		expect(wrapper.find('.notecard__content').element.nextElementSibling).toBe(actions.element)
	})

	it('renders no actions container without the slot', () => {
		const wrapper = mount(NcNoteCard, { props: { text: 'Careful' } })

		expect(wrapper.find('.notecard__actions').exists()).toBe(false)
	})
})
