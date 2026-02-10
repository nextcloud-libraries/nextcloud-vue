<script setup lang="ts">
import { Folder, Permission } from '@nextcloud/files'
import { generateRemoteUrl } from '@nextcloud/router'
import NcUploadPicker from '../../../../src/components/NcUploadPicker/NcUploadPicker.vue'

defineProps({ ...NcUploadPicker.props })

const destination = new Folder({
	id: 56,
	owner: 'user',
	source: generateRemoteUrl('dav/files/user/Folder'),
	permissions: Permission.ALL,
	root: '/files/user',
})
</script>

<template>
	<NcUploadPicker v-bind="$props" :destination />
</template>
