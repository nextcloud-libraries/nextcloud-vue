import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent } from 'vue'

import NcButton from './NcButton.vue'
import NcButtonStoryGeneral from './stories/NcButtonStoryGeneral.vue'
import NcButtonStoryAlignment from './stories/NcButtonStoryAlignment.vue'

import IconStar from 'vue-material-design-icons/Star.vue'
import IconStarOutline from 'vue-material-design-icons/StarOutline.vue'
import NcButtonStorySortingTable from './stories/NcButtonStorySortingTable.vue'

const meta = {
	title: 'Components/Basic/NcButton',
	component: NcButton,
	// tags: ['autodocs'],
	argTypes: {},
	args: {},
} satisfies Meta<typeof NcButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: args => ({
		components: { NcButton },
		setup() {
			return { args }
		},
		template: `
          <NcButton
            v-bind="args"
          >
            Button content
        </NcButton>
        `,
	}),
}

export const General: Story = {
	render: () => ({
		components: { NcButtonStoryGeneral },
		template: '<NcButtonStoryGeneral />',
	})
}

export const Alignment: Story = {
	render: () => ({
		components: { NcButtonStoryAlignment },
		template: '<NcButtonStoryAlignment />',
	})
}

export const Pressed: Story = {
	render: () => defineComponent({
		components: { NcButton, IconStar, IconStarOutline },
		data() {
			return {
				isFavorite: false,
			}
		},
		methods: {
			toggleFavorite() {
				this.isFavorite = !this.isFavorite
			},
		},
		template: `
			<div>
				<div style="display: flex; gap: 12px;">
					<NcButton v-model:pressed="isFavorite" aria-label="Favorite" type="tertiary-no-background">
						<template #icon>
							<IconStar v-if="isFavorite" :size="20" />
							<IconStarOutline v-else :size="20" />
						</template>
					</NcButton>
					<NcButton v-model:pressed="isFavorite" type="tertiary">
						<template #icon>
							<IconStar v-if="isFavorite" :size="20" />
							<IconStarOutline v-else :size="20" />
						</template>
						Favorite
					</NcButton>
					<NcButton v-model:pressed="isFavorite" aria-label="Favorite">
						<template #icon>
							<IconStar v-if="isFavorite" :size="20" />
							<IconStarOutline v-else :size="20" />
						</template>
					</NcButton>
				</div>
				<div>
					It is {{ isFavorite ? 'a' : 'not a' }} favorite.
				</div>
			</div>`,
	})
}

export const SortingTable: Story = {
	render: () => ({
		components: { NcButtonStorySortingTable },
		template: '<NcButtonStorySortingTable />',
	})
}
