<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<script setup>
import NcButton from '../NcButton.vue'
import IconLeft from 'vue-material-design-icons/ArrowLeft.vue'
import IconRight from 'vue-material-design-icons/ArrowRight.vue'
</script>

<template>
	<div style="display: flex; flex-direction: column; gap: 12px;">
		<NcButton aria-label="center (default)" variant="secondary" wide>
			<template #icon>
				<IconLeft :size="20" />
			</template>
			center (default)
		</NcButton>
		<NcButton alignment="center-reverse"
			aria-label="center-reverse"
			variant="secondary"
			wide>
			<template #icon>
				<IconRight :size="20" />
			</template>
			center-reverse
		</NcButton>
		<div style="display: flex; gap: 12px;">
			<div style="display: flex; flex-direction: column; gap: 12px; flex: 1">
				<NcButton alignment="start"
					aria-label="start"
					variant="secondary"
					wide>
					<template #icon>
						<IconLeft :size="20" />
					</template>
					start
				</NcButton>
				<NcButton alignment="start-reverse"
					aria-label="start-reverse"
					variant="secondary"
					wide>
					<template #icon>
						<IconRight :size="20" />
					</template>
					start-reverse
				</NcButton>
			</div>
			<div style="display: flex; flex-direction: column; gap: 12px; flex: 1">
				<NcButton alignment="end"
					aria-label="end"
					variant="secondary"
					wide>
					<template #icon>
						<IconLeft :size="20" />
					</template>
					end
				</NcButton>
				<NcButton alignment="end-reverse"
					aria-label="end-reverse"
					variant="secondary"
					wide>
					<template #icon>
						<IconRight :size="20" />
					</template>
					end-reverse
				</NcButton>
			</div>
		</div>
	</div>
</template>
