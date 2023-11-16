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

import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import richEditor from '../../../src/mixins/richEditor/index.js'

import { h } from 'vue'

const TestEditor = {
	mixins: [richEditor],
	render: () => h('div'),
}

describe('richEditor.js', () => {
	'use strict'

	describe('renderContent', () => {
		it('sanitizes the input', () => {
			const editor = shallowMount(TestEditor, { props: { userData: {} } })
			const input = 'Some <table>html</table>'
			const output = editor.vm.renderContent(input)

			expect(output).toEqual('Some &lt;table&gt;html&lt;/table&gt;')
		})

		it('converts newline to hard line breaks', () => {
			const editor = shallowMount(TestEditor, { props: { userData: {} } })
			const input = 'hard\nbreak'
			const output = editor.vm.renderContent(input)

			expect(output).toEqual('hard<br>break')
		})

		it('no duplicated ampersand (from Linkify)', () => {
			const editor = shallowMount(TestEditor, { props: { userData: {} } })
			const input = 'hello &'
			const output = editor.vm.renderContent(input)

			expect(output).toEqual('hello &amp;')
		})

		it('keeps mentions without user data', () => {
			const editor = shallowMount(TestEditor, { props: { userData: {} } })
			const input = 'hello @foobar'
			const output = editor.vm.renderContent(input)

			expect(output).toEqual('hello @foobar')
		})

		it('keeps mentions with user data', () => {
			const editor = shallowMount(TestEditor, {
				props: {
					userData: {
						jdoe: {
							id: 'jdoe',
							title: 'J. Doe',
							source: 'users',
							icon: 'icon-user',
						},
					},
				},
			})
			const input = 'hello @jdoe'
			const output = editor.vm.renderContent(input)

			expect(output).toMatch(/^hello <span.+role="heading" title="J. Doe"/)
		})

		it('keep mentions with special characters', () => {
			const editor = shallowMount(TestEditor, { props: { userData: {} } })
			const input = 'hello @foo@bar - hello @"bar @ foo"'
			const output = editor.vm.renderContent(input)

			expect(output).toEqual('hello @foo@bar - hello @"bar @ foo"')
		})
	})
})
