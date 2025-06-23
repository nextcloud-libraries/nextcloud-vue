/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { shallowMount } from '@vue/test-utils'
import { beforeAll, describe, expect, test, vi } from 'vitest'
import NcPopover from '../../../../src/components/NcPopover/NcPopover.vue'

const rtlTs = vi.hoisted(() => ({ isRtl: false }))
vi.mock('../../../../src/utils/rtl.ts', () => rtlTs)

describe('NcPopover support logical placement', () => {
	beforeAll(() => {
		// disable debug as this tries to access internals of floting-vue
		window._oc_debug = false
	})

	test.each`
	placement      | isRtl    | expected
	${'start'}     | ${false} | ${'left'}
	${'start'}     | ${true}  | ${'right'}
	${'bottom'}    | ${false} | ${'bottom'}
	${'bottom'}    | ${true}  | ${'bottom'}
	${'top-start'} | ${false} | ${'top-start'}
	${'top-start'} | ${true}  | ${'top-start'}
	`('Setting logical $placement results in $expected (RTL: $isRtl)', ({ placement, isRtl, expected }) => {
		// set the RTL mock
		rtlTs.isRtl = isRtl

		const vm = shallowMount(NcPopover, {
			props: {
				placement,
			},
			slots: {
				default: 'tooltip text',
				trigger: '<button>trigger</button>',
			},
		})

		expect(vm.getComponent({ ref: 'popover' }).props('placement')).toBe(expected)
	})
})
