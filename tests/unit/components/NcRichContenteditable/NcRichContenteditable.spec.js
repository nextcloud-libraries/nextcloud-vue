import { mount } from '@vue/test-utils'
import NcRichContenteditable from '../../../../src/components/NcRichContenteditable/NcRichContenteditable.vue'
import Tribute from 'tributejs/dist/tribute.esm.js'

// FIXME: find a way to use Tribute in JSDOM or test with e2e
jest.mock('tributejs/dist/tribute.esm.js')
Tribute.mockImplementation(() => ({
	attach: jest.fn(),
	detach: jest.fn(),
}))

/**
 * Mount NcRichContentEditable
 *
 * @param {object} options mount options
 * @param {object} options.propsData mount options.propsData
 * @param {object} options.listeners mount options.listeners
 * @param {object} options.attrs mount options.attrs
 * @return {object}
 */
function mountNcRichContenteditable({ propsData, listeners, attrs } = {}) {
	let currentValue = propsData?.value

	const wrapper = mount(NcRichContenteditable, {
		propsData: {
			value: currentValue,
			...propsData,
		},
		listeners: {
			'update:value': ($event) => {
				currentValue = $event
				wrapper.setProps({ value: $event })
			},
			...listeners,
		},
		attrs: {
			...attrs,
		},
		attachTo: document.body,
	})

	const getCurrentValue = () => currentValue

	const inputValue = async (newValue) => {
		wrapper.element.innerHTML += newValue
		await wrapper.trigger('input')
	}

	return {
		wrapper,
		getCurrentValue,
		inputValue,
	}
}

describe('NcRichContenteditable', () => {
	it('should update value during input', async () => {
		const { wrapper, inputValue } = mountNcRichContenteditable()
		const TEST_TEXT = 'Test Text'
		await inputValue('Test Text')
		expect(wrapper.emitted('update:value')).toBeDefined()
		expect(wrapper.emitted('update:value').at(-1)[0]).toBe(TEST_TEXT)
	})

	it('should not emit "submit" during input', async () => {
		const { wrapper, inputValue } = mountNcRichContenteditable()
		await inputValue('Test Text')
		expect(wrapper.emitted('submit')).not.toBeDefined()
	})

	it('should emit "paste" on past', async () => {
		const { wrapper } = mountNcRichContenteditable()
		await wrapper.trigger('paste', { clipboardData: { getData: () => 'PASTED_TEXT', files: [], items: {} } })
		expect(wrapper.emitted('paste')).toBeDefined()
		expect(wrapper.emitted('paste')).toHaveLength(1)
	})

	it('should emit "submit" on Enter', async () => {
		const { wrapper, inputValue } = mountNcRichContenteditable()

		await inputValue('Test Text')

		await wrapper.trigger('keydown', { keyCode: 13 }) // Enter

		expect(wrapper.emitted('submit')).toBeDefined()
		expect(wrapper.emitted('submit')).toHaveLength(1)
	})

	it('should not emit "submit" on Enter during composition session', async () => {
		const { wrapper, inputValue } = mountNcRichContenteditable()

		await wrapper.trigger('compositionstart')
		await inputValue('猫')
		await wrapper.trigger('keydown', { keyCode: 13 }) // Enter
		await wrapper.trigger('compositionend')
		await inputValue(' - means "Cat"')
		await wrapper.trigger('keydown', { keyCode: 13 }) // Enter

		expect(wrapper.emitted('submit')).toBeDefined()
		expect(wrapper.emitted('submit')).toHaveLength(1)
	})

	it('should proxy component events listeners to native event handlers', async () => {
		const handlers = {
			focus: jest.fn(),
			paste: jest.fn(),
			blur: jest.fn(),
		}
		const { wrapper } = mountNcRichContenteditable({
			listeners: handlers,
		})

		await wrapper.trigger('focus')
		await wrapper.trigger('paste', { clipboardData: { getData: () => 'PASTED_TEXT', files: [], items: {} } })
		await wrapper.trigger('blur')

		expect(handlers.focus).toHaveBeenCalledTimes(1)
		expect(handlers.paste).toHaveBeenCalledTimes(1)
		expect(handlers.blur).toHaveBeenCalledTimes(1)
	})

	it('should has accessible placeholder from placeholder prop', async () => {
		const PLACEHOLDER = 'TEST_PLACEHOLDER'
		const { wrapper } = mountNcRichContenteditable({
			propsData: {
				placeholder: PLACEHOLDER,
			},
		})
		// Accessible placeholder
		expect(wrapper.attributes('aria-placeholder')).toBe(PLACEHOLDER)
		// Used in CSS for visible placeholder
		expect(wrapper.attributes('placeholder')).toBe(PLACEHOLDER)
	})
})
