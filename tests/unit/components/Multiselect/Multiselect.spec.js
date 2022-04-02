/**
 * @copyright Copyright (c) 2020 Raimund Schlüßler <raimund.schluessler@mailbox.org>
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
import Multiselect from '../../../../src/components/Multiselect/Multiselect.vue'

describe('Multiselect.vue', () => {
	'use strict'

	it('Test that the input function is only called once on select', () => {
		const onInput = jest.fn()
		const wrapper = mount(Multiselect, {
			props: {
				label: 'name',
				multiple: false,
				options: [
					{ name: 'a', key: 'a'},
					{ name: 'b', key: 'b'}
				]
			},
			listeners: {
				input: onInput
			}
		})
		wrapper.trigger('click')
		wrapper.find('li.multiselect__element .multiselect__option').trigger('click')
		expect(onInput).toHaveBeenCalledTimes(1)
	})
})
