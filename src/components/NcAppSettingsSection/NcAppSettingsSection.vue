<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { logger } from '../../utils/logger.ts'
import { useAppSettingsDialog } from '../NcAppSettingsDialog/useAppSettingsDialog.ts'

const props = defineProps<{
	/** Name of the section */
	name: string
	/** Optional description of the section */
	description?: string
	/** The id of the section */
	id: string
	/** The id of the section */
	order?: number
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
watch([() => props.id, () => props.name, () => props.order], (
	[newId, newName, newOrder],
	[oldId, ,],
) => {
	unregisterSection(oldId)
	registerSection(newId, newName, newOrder, slots?.icon?.())
})

onMounted(() => {
	registerSection(props.id, props.name, props.order, slots?.icon?.())
})

onBeforeUnmount(() => {
	unregisterSection(props.id)
})
</script>

<template>
	<section
		:id="htmlId"
		:aria-labelledby="`${htmlId}--label`"
		class="app-settings-section">
		<h3 :id="`${htmlId}--label`" class="app-settings-section__name">
			{{ name }}
		</h3>
		<div class="app-settings-section__description">
			{{ description }}
		</div>
		<div class="app-settings-section__content">
			<slot />
		</div>
	</section>
</template>

<style lang="scss" scoped>
.app-settings-section {
	margin-block-end: calc(8 * var(--default-grid-baseline));
	&__name {
		margin: 0;
		padding-inline: 0;
		padding-block: 0;
		font-size: 20px;
		font-weight: bold;
	}

	&__description {
		color: var(--color-text-maxcontrast);
	}

	&__content {
		margin-block-start: calc(2 * var(--default-grid-baseline));
	}
}
</style>
