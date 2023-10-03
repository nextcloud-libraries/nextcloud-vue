/**
 * @copyright Copyright (c) 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @license AGPL-3.0-or-later
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

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, resolveComponent } from 'vue'

import { NextcloudVuePlugin } from '../../src/plugin'

describe('Nextcloud Vue Plugin', () => {
	it('can be installed', () => {
		const wrapper = mount(
			{
				setup() {
					const ButtonCounter = resolveComponent('NcButton')
					return () => h(ButtonCounter, { ariaLabel: 'button' })
				},
			}, {
				global: {
					plugins: [NextcloudVuePlugin],
				},
			}
		)
		expect(wrapper.vm.$el.tagName).not.toBe('NCBUTTON') // If it could no be installed it would be 'NCBUTTON', otherwise it would be 'A' or 'BUTTON'
	})
})
