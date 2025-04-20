/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Meta, StoryObj } from '@storybook/vue3'
import { makeStory } from '../../../../.storybook/utils.ts'

import NcButton from '../NcButton.vue'

const meta: Meta<typeof NcButton> = {
	title: 'Components/Basic/NcButton',
	component: NcButton,
	// tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: args => ({
		components: { NcButton },
		setup() {
			return { args }
		},
		template: `
			<NcButton v-bind="args">
				Button content
			</NcButton>
		`,
	}),
}

export const General: Story = await makeStory(
	import('./NcButtonStoryGeneral.vue'),
	import('./NcButtonStoryGeneral.vue?raw'),
)

export const Alignment: Story = await makeStory(
	import('./NcButtonStoryAlignment.vue'),
	import('./NcButtonStoryAlignment.vue?raw'),
)

export const Pressed: Story = await makeStory(
	import('./NcButtonStoryPressed.vue'),
	import('./NcButtonStoryPressed.vue?raw'),
)

export const SortingTable: Story = await makeStory(
	import('./NcButtonStorySortingTable.vue'),
	import('./NcButtonStorySortingTable.vue?raw'),
)
