<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useSlots, watch } from 'vue'
import { logger } from '../../utils/logger.ts'
import { useAppSettingsDialog } from '../NcAppSettingsDialog/useAppSettingsDialog.ts'

const props = defineProps<{
	/** Name of the section */
	name: string
	/** The id of the section */
	id: string
	/** The id of the section */
	order?: number
}>()

const slots = useSlots()
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
	registerSection(newId, props.name, props.order, slots?.icon?.())
})

watch(() => props.name, (newName) => {
	unregisterSection(props.id)
	registerSection(props.id, newName, props.order, slots?.icon?.())
})

watch(() => props.order, (newOrder) => {
	unregisterSection(props.id)
	registerSection(props.id, props.name, newOrder, slots?.icon?.())
})

onMounted(() => {
	registerSection(props.id, props.name, props.order, slots?.icon?.())
})

onBeforeUnmount(() => {
	unregisterSection(props.id)
})
</script>

<template>
	<section :id="htmlId" :aria-labelledby="`${htmlId}--label`" class="app-settings-section">
		<h3 :id="`${htmlId}--label`" class="app-settings-section__name">
			{{ name }}
		</h3>
		<!-- @slot Section content -->
		<slot />
		<!-- @slot Optional icon for the section in the navigation -->
		<slot v-if="false" name="icon" />
	</section>
</template>

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
