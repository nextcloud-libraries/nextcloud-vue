<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import NcFilePicker from '../../../../src/components/NcFilePicker/NcFilePicker.vue'

defineProps({ ...NcFilePicker.props })

const emit = defineEmits<{
	pick: [fileNames: string[]]
}>()

function onPick(files: File[]) {
	const fileNames = files.map((file) => file.webkitRelativePath || file.name)
	emit('pick', fileNames)
}
</script>

<template>
	<NcFilePicker v-bind="$props" @pick="onPick" />
</template>
