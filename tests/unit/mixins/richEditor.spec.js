/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
							label: 'J. Doe',
							source: 'users',
							icon: 'icon-user',
						},
					},
				},
			})
			const input = 'hello @jdoe'
			const output = editor.vm.renderContent(input)

			expect(output).toMatch(/^hello <span.+role="heading".+title="J. Doe"/)
		})

		it('keep mentions with special characters', () => {
			const editor = shallowMount(TestEditor, { props: { userData: {} } })
			const inputs = [
				'hello @foo@bar - hello @"bar @ foo"',
				'hello @foo@bar @"bar @ foo" @foobar @foo-bar',
				'hello foo@bar - hello @@foobar',
				'@foobar no space - \n\n@foobar  @foobar',
				'hello @"guest/47e0a7cf"',
				'hello @"group/group-id" @"federated_user/user-id"',
				'hello @"federated_user/user-id@server.com:8080"',
			]
			const outputs = [
				'hello @foo@bar - hello @"bar @ foo"',
				'hello @foo@bar @"bar @ foo" @foobar @foo-bar',
				'hello foo@bar - hello @@foobar',
				'@foobar no space - <br><br>@foobar  @foobar',
				'hello @"guest/47e0a7cf"',
				'hello @"group/group-id" @"federated_user/user-id"',
				'hello @"federated_user/user-id@server.com:8080"',
			]

			for (const i in inputs) {
				const output = editor.vm.renderContent(inputs[i])
				expect(output).toEqual(outputs[i])
			}
		})
	})
})
