<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcAppSettingsDialog open name="Settings dialog" show-navigation>
		<NcAppSettingsSection id="first" name="First section">
			First content
		</NcAppSettingsSection>
		<NcAppSettingsSection id="second" name="Second section">
			Second content
		</NcAppSettingsSection>
	</NcAppSettingsDialog>
</template>

<script setup lang="ts">
import NcAppSettingsDialog from '../../../../src/components/NcAppSettingsDialog/NcAppSettingsDialog.vue'
import NcAppSettingsSection from '../../../../src/components/NcAppSettingsSection/NcAppSettingsSection.vue'
</script>
