/**
 * @copyright Copyright (c) 2022 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 *
 * @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { mount } from '@vue/test-utils'
import Popover from '../../../../src/components/Popover/Popover.vue'

const transitionStub = () => ({
	render: function(h) {
	  return this.$options._renderChildren
	}
  })

describe('Popover.vue', () => {
	'use strict'
	describe('has correct open state', () => {
		it('is closed by default', async () => {
			const wrapper = mount(Popover, {
				slots: {
					default: ['<div class="content" />'],
					trigger: ['<div class="trigger" />'],
				}
			})
			expect(wrapper.find('.content').isVisible()).toBe(false)
		})
		it('is open when prop is set', async () => {
			const wrapper = mount(Popover, {
				slots: {
					default: ['<div class="content" />'],
					trigger: ['<div class="trigger" />'],
				},
				propsData: {
					open: true,
				},
				stubs: {
				  transition: transitionStub()
				}
			})
			expect(wrapper.find('.content').isVisible()).toBe(true)
		})
	})
	describe('is reactive', () => {
		it('opens by click and emits "after-show" event', async () => {
			const afterShow = jest.fn()
			const wrapper = mount(Popover, {
				slots: {
					default: ['<div class="content" />'],
					trigger: ['<div class="trigger" />'],
				},
				listeners: {
					'after-show': afterShow
				},
				propsData: {
					open: true,
				},
				stubs: {
				  transition: transitionStub()
				},
			})
			// Try everything to get it to be open
			await wrapper.setProps({ open: true })
			await wrapper.find('.trigger').trigger('click')
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.content').isVisible()).toBe(true)
			expect(afterShow).toHaveBeenCalledTimes(1)
		})
	})
})
