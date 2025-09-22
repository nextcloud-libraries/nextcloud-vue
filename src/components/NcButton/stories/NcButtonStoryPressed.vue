<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<script setup>
import { mdiStar, mdiStarOutline } from '@mdi/js'
import { computed, ref } from 'vue'

import NcButton from '../NcButton.vue'
import NcIconSvgWrapper from '../../NcIconSvgWrapper/NcIconSvgWrapper.vue'

const isFavorite = ref(false)
const path = computed(() => isFavorite.value ? mdiStar : mdiStarOutline)
</script>

<template>
	<div>
		<div class="wrapper">
			<NcButton v-model:pressed="isFavorite"
				aria-label="Favorite"
				variant="tertiary-no-background">
				<template #icon>
					<NcIconSvgWrapper :path :size="20" />
				</template>
			</NcButton>
			<NcButton v-model:pressed="isFavorite" type="tertiary">
				<template #icon>
					<NcIconSvgWrapper :path :size="20" />
				</template>
				Favorite
			</NcButton>
			<NcButton v-model:pressed="isFavorite" aria-label="Favorite">
				<template #icon>
					<NcIconSvgWrapper :path :size="20" />
				</template>
			</NcButton>
		</div>
		<div>
			It is {{ isFavorite ? 'a' : 'not a' }} favorite.
		</div>
	</div>
</template>

<style scoped>
.wrapper {
	display: flex;
	gap: 12px;
}
</style>
