/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

import { getParent } from '../../../src/utils/getParent.ts'

const CParent = defineComponent({
	name: 'CParent',
	template: '<div><slot /></div>',
})

const CChild = defineComponent({
	name: 'CChild',
	template: '<div>hello</div>',
	inject: ['foundParent'],
	mounted() {
		(this.foundParent as (x: unknown) => void)(getParent(this, 'CParent'))
	},
	computed: {
		parent() {
			return getParent(this, 'CParent')
		},
	},
})

const CWrapper = defineComponent({
	name: 'CWrapper',
	template: '<div><slot /></div>',
})

describe('utils: getParent', () => {
	it('finds direct parent', () => {
		const foundParent = vi.fn()
		const component = defineComponent({
			template: '<CParent><CChild ref="child" /></CParent>',
			components: { CChild, CParent },
			provide: {
				foundParent,
			},
		})

		mount(component)
		expect(foundParent).toBeCalledWith({})
	})

	it('finds indirect parent', () => {
		const foundParent = vi.fn()
		const component = defineComponent({
			template: '<CParent><CWrapper><CChild ref="child" /></CWrapper></CParent>',
			components: { CChild, CParent, CWrapper },
			provide: {
				foundParent,
			},
		})

		mount(component)
		expect(foundParent).toBeCalledWith({})
	})

	it('finds indirect parent in native elements', () => {
		const foundParent = vi.fn()
		const component = defineComponent({
			template: '<CParent><div><CChild ref="child" /></div></CParent>',
			components: { CChild, CParent },
			provide: {
				foundParent,
			},
		})

		mount(component)
		expect(foundParent).toBeCalledWith({})
	})

	it('does not find parent if there is none', () => {
		const foundParent = vi.fn()
		const component = defineComponent({
			template: '<div><CChild ref="child" /></div>',
			components: { CChild },
			provide: {
				foundParent,
			},
		})

		mount(component)
		expect(foundParent).toBeCalledTimes(1)
		expect(foundParent).toBeCalledWith(undefined)
	})
})
