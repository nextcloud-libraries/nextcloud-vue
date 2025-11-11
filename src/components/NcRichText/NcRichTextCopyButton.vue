<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import NcButton from '../NcButton/NcButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { useCopy } from '../../composables/useCopy.ts'

const { contentId } = defineProps<{
	/** Node representing code block content */
	contentId: string
}>()

const { copy, icon, altText } = useCopy(() => document.getElementById(contentId)!.textContent)
</script>

<template>
	<NcButton
		variant="tertiary"
		size="small"
		:aria-label="altText"
		:title="altText"
		@click="copy">
		<template #icon>
			<NcIconSvgWrapper :path="icon" inline />
		</template>
	</NcButton>
</template>

<docs>
An internal component
</docs>
