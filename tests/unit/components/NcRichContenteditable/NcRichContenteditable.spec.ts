import { mount } from '@vue/test-utils'
import NcRichContenteditable from '../../../../src/components/NcRichContenteditable/NcRichContenteditable.vue'
import Tribute from 'tributejs/dist/tribute.esm.js'

// FIXME: find a way to use Tribute in JSDOM or test with e2e
jest.mock('tributejs/dist/tribute.esm.js')
Tribute.mockImplementation(() => ({
	attach: jest.fn(),
	detach: jest.fn(),
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mountNcRichContenteditable = ({ propsData, listeners, attrs }: any = {}) => {
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

	const contentEditable = () => wrapper.find('[contenteditable="true"')

	const inputValue = async (newValue) => {
		contentEditable().element.innerHTML += newValue
		await contentEditable().trigger('input')
	}

	return {
		wrapper,
		contentEditable,
		getCurrentValue,
		inputValue,
	}
}

describe('NcRichContenteditable', () => {
	it('should update value during input', async () => {
		const { inputValue, wrapper } = mountNcRichContenteditable()
		const TEST_TEXT = 'Test Text'
		await inputValue('Test Text')
		expect(wrapper.emitted('update:value')).toBeDefined()
		expect(wrapper.emitted('update:value')?.at(-1)?.[0]).toBe(TEST_TEXT)
	})

	it('should not emit "submit" during input', async () => {
		const { inputValue, wrapper } = mountNcRichContenteditable()
		await inputValue('Test Text')
		expect(wrapper.emitted('submit')).not.toBeDefined()
	})

	it('should emit "paste" on past', async () => {
		const { contentEditable, wrapper } = mountNcRichContenteditable()
		await contentEditable().trigger('paste', { clipboardData: { getData: () => 'PASTED_TEXT', files: [], items: {} } })
		expect(wrapper.emitted('paste')).toBeDefined()
		expect(wrapper.emitted('paste')).toHaveLength(1)
	})

	it('should emit "submit" on Enter', async () => {
		const { contentEditable, inputValue, wrapper } = mountNcRichContenteditable()

		await inputValue('Test Text')

		await contentEditable().trigger('keydown', { keyCode: 13 }) // Enter

		expect(wrapper.emitted('submit')).toBeDefined()
		expect(wrapper.emitted('submit')).toHaveLength(1)
	})

	it('should not emit "submit" on Enter during composition session', async () => {
		const { contentEditable, inputValue, wrapper } = mountNcRichContenteditable()

		await contentEditable().trigger('compositionstart')
		await inputValue('猫')
		await contentEditable().trigger('keydown', { keyCode: 13 }) // Enter
		await contentEditable().trigger('compositionend')
		await inputValue(' - means "Cat"')
		await contentEditable().trigger('keydown', { keyCode: 13 }) // Enter

		expect(wrapper.emitted('submit')).toBeDefined()
		expect(wrapper.emitted('submit')).toHaveLength(1)
	})

	it('should proxy component events listeners to native event handlers', async () => {
		const handlers = {
			focus: jest.fn(),
			paste: jest.fn(),
			blur: jest.fn(),
		}
		const { contentEditable } = mountNcRichContenteditable({
			listeners: handlers,
		})

		await contentEditable().trigger('focus')
		await contentEditable().trigger('paste', { clipboardData: { getData: () => 'PASTED_TEXT', files: [], items: {} } })
		await contentEditable().trigger('blur')

		expect(handlers.focus).toHaveBeenCalledTimes(1)
		expect(handlers.paste).toHaveBeenCalledTimes(1)
		expect(handlers.blur).toHaveBeenCalledTimes(1)
	})

	it('should has accessible placeholder from placeholder prop', async () => {
		const PLACEHOLDER = 'TEST_PLACEHOLDER'
		const { contentEditable } = mountNcRichContenteditable({
			propsData: {
				placeholder: PLACEHOLDER,
			},
		})
		expect(contentEditable().attributes('aria-placeholder')).toBe(PLACEHOLDER)
	})
})
