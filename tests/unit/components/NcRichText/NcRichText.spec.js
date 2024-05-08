import { mount } from '@vue/test-utils'
import NcRichText from '../../../../src/components/NcRichText/NcRichText.vue'

describe('Foo', () => {
	it('renders a message and responds correctly to props changes', async () => {
		const wrapper = mount(NcRichText, {
			propsData: {
				text: 'Test {placeholder}',
			},
		})

		expect(wrapper.text()).toEqual('Test {placeholder}')
	})

	it('properly inserts a child component', async () => {
		const MyComponent = {
			name: 'MyComponent',
			render: (createElement) => {
				return createElement('div', 'MYCOMPONENT')
			},
		}
		const wrapper = mount(NcRichText, {
			propsData: {
				text: 'Test {placeholder}',
				arguments: {
					placeholder: {
						component: MyComponent,
					},
				},
			},
		})

		expect(wrapper.text()).toEqual('Test MYCOMPONENT')
		expect(wrapper.findComponent(MyComponent).exists()).toBe(true)
	})

	it('properly inserts a child component with props', async () => {
		const MyComponent = {
			name: 'MyComponent',
			props: ['username'],
			render: (createElement) => {
				return createElement('div', 'MYCOMPONENT')
			},
		}
		const wrapper = mount(NcRichText, {
			propsData: {
				text: 'Test {placeholder}',
				arguments: {
					placeholder: {
						component: MyComponent,
						props: {
							username: 'Jane',
						},
					},
				},
			},
		})

		expect(wrapper.text()).toEqual('Test MYCOMPONENT')
		expect(wrapper.findComponent(MyComponent).exists()).toBe(true)
		expect(wrapper.findComponent(MyComponent).vm.username).toBe('Jane')
	})
	test.each([
		['Fallback {placeholder}', {}, 'Fallback {placeholder}'],
		['{placeholder} fallback', {}, '{placeholder} fallback'],
		['Test {placeholder} {placeholder}', {}, 'Test {placeholder} {placeholder}'],
		['Test {placeholder}{placeholder}', {}, 'Test {placeholder}{placeholder}'],
		[
			'Test {placeholder} between {placeholder}',
			{},
			'Test {placeholder} between {placeholder}',
		],
		[
			'Test {placeholderA} {placeholderB}',
			{},
			'Test {placeholderA} {placeholderB}',
		],
		[
			'Test {placeholderA}{placeholderB}',
			{},
			'Test {placeholderA}{placeholderB}',
		],
		['{placeholderA}', { placeholderA: 'A', placeholderB: 'B' }, 'A'],
		[
			'{placeholderA} {placeholderB}',
			{ placeholderA: 'A', placeholderB: 'B' },
			'A B',
		],
		[
			'Test {placeholderA} {placeholderB}',
			{ placeholderA: 'A', placeholderB: 'B' },
			'Test A B',
		],
		[
			'Test {placeholderA} {placeholderA} {placeholderB}',
			{ placeholderA: 'A', placeholderB: 'B' },
			'Test A A B',
		],
	])('text: %s', (text, attrs, result) => {
		const wrapper = mount(NcRichText, {
			propsData: {
				text,
				arguments: attrs,
			},
		})
		expect(wrapper.text()).toEqual(result)
	})

	it('properly inserts a link', async () => {
		const wrapper = mount(NcRichText, {
			propsData: {
				text: 'Testwith a link to https://example.com - go visit it',
				autolink: true,
			},
		})

		expect(wrapper.text()).toEqual(
			'Testwith a link to https://example.com - go visit it',
		)
		expect(wrapper.find('a').attributes('href')).toEqual('https://example.com')
	})

	it('properly inserts a newline', async () => {
		const wrapper = mount(NcRichText, {
			propsData: {
				text: 'Testwith a link to https://example.com \n go visit it',
				autolink: true,
			},
		})

		expect(wrapper.text()).toEqual(
			'Testwith a link to https://example.com \n go visit it',
		)
		expect(wrapper.find('a').attributes('href')).toEqual('https://example.com')
		expect(wrapper.html()).toContain(`\n    go visit it`)
	})

	it('properly inserts a link with brackets', async () => {
		const wrapper = mount(NcRichText, {
			propsData: {
				text: 'Test with a link to (https://example.com) - go visit it',
				autolink: true,
			},
		})
		expect(wrapper.text()).toEqual(
			'Test with a link to (https://example.com) - go visit it',
		)
		expect(wrapper.find('a').attributes('href')).toEqual('https://example.com')
	})

	it('properly inserts a link containing brackets', async () => {
		const wrapper = mount(NcRichText, {
			propsData: {
				text: 'Test with a link to (https://example.com/Link%20(Sub)) - go visit it',
				autolink: true,
			},
		})
		expect(wrapper.text()).toEqual(
			'Test with a link to (https://example.com/Link%20(Sub)) - go visit it',
		)
		expect(wrapper.find('a').attributes('href')).toEqual(
			'https://example.com/Link%20(Sub)',
		)
	})

	it('properly inserts a link containing brackets with markdown', async () => {
		const wrapper = mount(NcRichText, {
			propsData: {
				text: 'Test with a link to (https://example.com/Link%20(Sub)) - go visit it',
				autolink: true,
				useMarkdown: true,
			},
		})
		expect(wrapper.text()).toEqual(
			'Test with a link to (https://example.com/Link%20(Sub)) - go visit it',
		)
		expect(wrapper.find('a').attributes('href')).toEqual(
			'https://example.com/Link%20(Sub)',
		)
	})

	it('properly recognizes an url with a custom port and inserts a link', async () => {
		const wrapper = mount(NcRichText, {
			propsData: {
				text: 'Testwith a link to https://example.com:444 - go visit it',
				autolink: true,
			},
		})
		expect(wrapper.text()).toEqual(
			'Testwith a link to https://example.com:444 - go visit it',
		)
		expect(wrapper.find('a').attributes('href')).toEqual(
			'https://example.com:444',
		)
	})

	it('properly recognizes an url with an IP address and inserts a link', async () => {
		const wrapper = mount(NcRichText, {
			propsData: {
				text: 'Testwith a link to https://127.0.0.1/status.php - go visit it',
				autolink: true,
			},
		})
		expect(wrapper.text()).toEqual(
			'Testwith a link to https://127.0.0.1/status.php - go visit it',
		)
		expect(wrapper.find('a').attributes('href')).toEqual(
			'https://127.0.0.1/status.php',
		)
	})

	it('properly formats markdown', async () => {
		const wrapper = mount(NcRichText, {
			propsData: {
				text: '**Testwith** a link *to* [Link](https://example:1337) - go visit it',
				autolink: false,
				useMarkdown: true,
			},
		})
		expect(wrapper.text()).toEqual('Testwith a link to Link - go visit it')
		expect(wrapper.find('a').attributes('href')).toEqual('https://example:1337')
		expect(wrapper.find('strong').text()).toEqual('Testwith')
		expect(wrapper.find('em').text()).toEqual('to')
	})

	it('formats markdown is disabled', async () => {
		const wrapper = mount(NcRichText, {
			propsData: {
				text: '**Testwith** a ~~link~~ *to* [Link](https://example:1337) - go visit it',
				autolink: true,
				useMarkdown: false,
			},
		})
		expect(wrapper.text()).toEqual(
			'**Testwith** a ~~link~~ *to* [Link](https://example:1337) - go visit it',
		)
	})

	it('formats interactive checkbox with extended markdown', async () => {
		const wrapper = mount(NcRichText, {
			propsData: {
				text: '- [ ] task item',
				useExtendedMarkdown: true,
				interactive: true,
			},
		})
		expect(wrapper.text()).toEqual('task item')
		const checkbox = wrapper.findComponent({
			name: 'NcCheckboxRadioSwitch',
		})
		expect(checkbox.exists()).toBeTruthy()
		await checkbox.vm.$emit('update:checked', true)
		expect(wrapper.emitted()['interact:todo']).toBeTruthy()
	})
})
