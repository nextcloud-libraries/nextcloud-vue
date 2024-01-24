import type { Meta, StoryObj } from '@storybook/vue3'

import NcButton from './NcButton.vue'
import IconEye from 'vue-material-design-icons/Eye.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
	title: 'Components/NcButton',
	component: NcButton,
	// This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: 'select',
			options: ['primary', 'secondary', 'tertiary', 'tertiary-no-background', 'error'],
		},
		onClick: {
			action: 'clicked',
		},
	},
	parameters: {
		slots: {
		  default: 'The button text or content',
		},
	},
} satisfies Meta<typeof NcButton>

export default meta
type Story = StoryObj<typeof meta>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
	args: {
		type: 'primary',
		default: 'Primary button',
	},
}

export const Secondary: Story = {
	args: {
		type: 'secondary',
		default: 'Secondary utton',
	},
}

export const Tertiary: Story = {
	args: {
		type: 'tertiary',
		default: 'Tertiary button',
	},
}

export const Small: Story = {
	render: (args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { NcButton, IconEye },
		template: `
		<NcButton v-bind="$props">
			<template #icon>
				<IconEye :size="20" />
			</template>
		</NcButton>`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Hello',
			},
		},
	},
}
