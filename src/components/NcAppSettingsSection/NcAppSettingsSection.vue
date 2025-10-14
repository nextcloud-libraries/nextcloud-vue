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
		<!-- @slot Optonal icon to for the secion in the navigation -->
		<slot v-if="false" name="icon" />
	</section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, useSlots, watch } from 'vue'
import { useAppSettingsDialog } from '../NcAppSettingsDialog/useAppSettingsDialog.ts'

const props = defineProps({
	/**
	 * Name of the section
	 */
	name: {
		type: String,
		required: true,
	},

	/**
	 * The id of the section
	 */
	id: {
		type: String,
		required: true,
		validator(id) {
			// Only alphanumeric, dash and underscore
			return /^[a-z0-9\-_]+$/.test(id)
		},
	},
})

const slots = useSlots()
const { registerSection, unregisterSection } = useAppSettingsDialog()

const htmlId = computed(() => 'settings-section_' + props.id)

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
	// register section for navigation
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
