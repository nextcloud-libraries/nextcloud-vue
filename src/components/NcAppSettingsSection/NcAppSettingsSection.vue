<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, useSlots, watch } from 'vue'
import { logger } from '../../utils/logger.ts'
import { APP_SETTINGS_LEGACY_DESIGN_KEY, useAppSettingsDialog } from '../NcAppSettingsDialog/useAppSettingsDialog.ts'

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

const slots = useSlots()
const { registerSection, unregisterSection } = useAppSettingsDialog()
const legacy = inject(APP_SETTINGS_LEGACY_DESIGN_KEY)!

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
		class="app-settings-section"
		:class="{ 'app-settings-section__legacy': legacy }">
		<h3 :id="`${htmlId}--label`" class="app-settings-section__name">
			{{ name }}
		</h3>
		<div class="app-settings-section__description">
			{{ description }}
		</div>
		<div class="app-settings-section__content">
			<!-- @slot Section content -->
			<slot />
		</div>
		<!-- @slot Optional icon for the section in the navigation -->
		<slot v-if="false" name="icon" />
	</section>
</template>

<style lang="scss" scoped>
.app-settings-section {
	--form-element-label-offset: calc(var(--border-radius-element) + var(--default-grid-baseline));
	--app-settings-section-text-offset: var(--form-element-label-offset);
	--app-settings-section-content-gap: calc(6 * var(--default-grid-baseline));
	margin-block-end: calc(8 * var(--default-grid-baseline));

	&__name {
		margin: 0;
		padding-inline: var(--app-settings-section-text-offset);
		padding-block: 0;
		font-size: 20px;
		font-weight: bold;
	}

	&__description {
		padding-inline: var(--app-settings-section-text-offset);
		color: var(--color-text-maxcontrast);
	}

	&__content {
		margin-block-start: calc(2 * var(--default-grid-baseline));

		display: flex;
		flex-direction: column;
		justify-content: stretch;
		gap: var(--app-settings-section-content-gap);
	}
}

.app-settings-section__legacy {
	--app-settings-section-text-offset: 0;
	--app-settings-section-content-gap: 0;
}
</style>
