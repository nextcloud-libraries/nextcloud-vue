<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcContent app-name="testing">
		<NcAppContent>
			App content
		</NcAppContent>
		<NcAppSidebar :compact="compact"
			name="Very long title that will certainly overflow the sidebar width"
			:subname="subname ? 'Very long subtitle what will certainly overflow the sidebar width' : ''"
			:name-editable="nameEditable">
			<template v-if="header" #header>
				<div style="background-color: gold; height: 100%; width: 100%" />
			</template>
			<template v-if="secondaryActions" #secondary-actions>
				<NcActionButton>
					<template #icon>
						<IconDelete :size="20" />
					</template>
					Action1
				</NcActionButton>
				<NcActionButton>
					Action2
				</NcActionButton>
			</template>
			<div>Sidebar content</div>
		</NcAppSidebar>
	</NcContent>
</template>

<script setup lang="ts">
import NcAppContent from '../../../../src/components/NcAppContent/NcAppContent.vue'
import NcAppSidebar from '../../../../src/components/NcAppSidebar/NcAppSidebar.vue'
import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'
import NcContent from '../../../../src/components/NcContent/NcContent.vue'

import IconDelete from 'vue-material-design-icons/Delete.vue'

defineProps<{
	compact: boolean
	subname: boolean
	nameEditable: boolean
	header: boolean
	secondaryActions: boolean
}>()
</script>
