<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<section :id="htmlId" :aria-labelledby="`${htmlId}--label`" class="app-settings-section">
		<h3 :id="`${htmlId}--label`" class="app-settings-section__name">
			{{ name }}
		</h3>
		<slot />
	</section>
</template>

<script setup lang="ts">
import type { Slot } from 'vue'

import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import logger from '../../utils/logger.ts'
import { useAppSettingsDialog } from '../NcAppSettingsDialog/useAppSettingsDialog.ts'

const props = defineProps<{
	/** Name of the section */
	name: string
	/** The id of the section */
	id: string
}>()

const slots = defineSlots<{
	/** Section content */
	default?: Slot
	/** Optional icon for the section in the navigation */
	icon?: Slot
}>()

const { registerSection, unregisterSection } = useAppSettingsDialog()

const htmlId = computed(() => 'settings-section_' + props.id)

// Validate id prop - only alphanumeric, dash and underscore
watch(() => props.id, () => {
	if (!/^[a-z0-9\-_]+$/.test(props.id)) {
		logger.warn(`Invalid id prop: ${props.id}. Only alphanumeric, dash and underscore are allowed.`)
	}
}, { immediate: true })

// Reactive changes for section navigation
watch(() => props.id, (newId, oldId) => {
	unregisterSection(oldId)
	registerSection(newId, props.name, slots?.icon?.())
})

watch(() => props.name, (newName) => {
	unregisterSection(props.id)
	registerSection(props.id, newName, slots?.icon?.())
})

onMounted(() => {
	registerSection(props.id, props.name, slots?.icon?.())
})

onBeforeUnmount(() => {
	unregisterSection(props.id)
})
</script>

<style lang="scss" scoped>
.app-settings-section {
	margin-bottom: 80px;
	&__name {
		font-size: 1.6em;
		margin: 0;
		padding: 20px 0;
		font-weight: bold;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}
</style>
