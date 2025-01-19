<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcContent app-name="testing">
		<NcAppNavigation aria-label="In-app navigation">
			<template #list>
				<NcAppNavigationItem name="Home" to="/" :editable="true" />
				<NcAppNavigationItem name="Foo" to="/foo" :editable="true" />
				<NcAppNavigationItem name="Back" active :editable="true" />
				<NcAppNavigationItem name="Bar" :editable="true" />
			</template>
		</NcAppNavigation>
		<NcAppContent />
	</NcContent>
</template>

<script setup lang="ts">
import NcAppContent from '../../../../src/components/NcAppContent/NcAppContent.vue'
import NcAppNavigation from '../../../../src/components/NcAppNavigation/NcAppNavigation.vue'
import NcAppNavigationItem from '../../../../src/components/NcAppNavigationItem/NcAppNavigationItem.vue'
import NcContent from '../../../../src/components/NcContent/NcContent.vue'
</script>
