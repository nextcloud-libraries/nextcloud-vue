/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Meta, StoryObj } from '@storybook/vue3'

import { h } from 'vue'
import NcChip from '../NcChip.vue'
import mdx from '../NcChip.mdx'
import { makeStory } from '../../../../.storybook/utils'

const meta: Meta<typeof NcChip> = {
	title: 'Components/Basic/NcChip',
	component: NcChip,
	parameters: {
		docs: {
			page: mdx,
		},
	},
}

type Story = StoryObj<typeof meta>

export default meta

export const Default: Story = {
	args: {
		text: 'Hello world!',
	},
	render: (args) => ({
		render: () => h(NcChip, args),
	}),
}

export const Basic: Story = await makeStory(
	import('./NcChipBasic.story.vue'),
	import('./NcChipBasic.story.vue?raw'),
)

export const WithAvatar: Story = await makeStory(
	import('./NcChipWithAvatar.story.vue'),
	import('./NcChipWithAvatar.story.vue?raw'),
)
