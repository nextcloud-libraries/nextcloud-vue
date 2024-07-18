<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="app-navigation-search"
		:class="{
			'app-navigation-search--has-actions': hasActions(),
		}">
		<NcInputField ref="inputElement"
			:aria-label="label"
			class="app-navigation-search__input"
			label-outside
			:placeholder="label"
			show-trailing-button
			:trailing-button-label="t('Clear search')"
			type="search"
			:value="value"
			@update:value="$emit('update:value', $event)"
			@trailing-button-click="onCloseSearch">
			<template #trailing-button-icon>
				<IconClose :size="20" />
			</template>
		</NcInputField>
		<Transition v-if="hasActions()" name="slide-fade">
			<div v-show="showActions"
				ref="actionsContainer"
				class="app-navigation-search__actions">
				<slot name="actions" />
			</div>
		</Transition>
	</div>
</template>

<script setup>
import { useFocusWithin } from '@vueuse/core'
import { ref, nextTick, useSlots, watch } from 'vue'
import { t } from '../../l10n.js'

import IconClose from 'vue-material-design-icons/Close.vue'
import NcInputField from '../NcInputField/NcInputField.vue'

defineProps({
	/**
	 * Current search input
	 */
	value: {
		type: String,
		default: '',
	},
	/**
	 * Text used to label the search input
	 */
	label: {
		type: String,
		default: t('Search in app…'),
	},
})

const emit = defineEmits(['update:value'])
const slots = useSlots()

const inputElement = ref()
const { focused: inputHasFocus } = useFocusWithin(inputElement)

/**
 * @type {import('vue').Ref<import('vue').ComponentPublicInstance>}
 */
const actionsContainer = ref()
const hasActions = () => !!slots.actions
const showActions = ref(true)
watch(inputHasFocus, () => {
	showActions.value = !inputHasFocus.value
})

/**
 * Handle close the search
 */
function onCloseSearch() {
	emit('update:value', '')
	if (hasActions()) {
		showActions.value = true
		nextTick(() => actionsContainer.value.$el.querySelector('button')?.focus())
	}
}
</script>

<style scoped lang="scss">
.app-navigation-search {
	display: flex;
	gap: var(--app-navigation-padding);
	padding: var(--app-navigation-padding);

	&--has-actions &__input {
		flex-grow: 1;
		z-index: 3;
	}

	&__actions {
		display: flex;
		gap: var(--default-grid-baseline);

		margin-inline-start: 0;
		max-width: calc(2 * var(--default-clickable-area) + var(--default-grid-baseline));
		max-height: var(--default-clickable-area);
	}

	&__input {
		// This is a fallback for legacy version (Nextcloud 29 and older) so that we keep the pill like design there
		--input-border-radius: var(--border-radius-element, var(--border-radius-pill)) !important;
	}
}

.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: margin-inline-start var(--animation-quick);
}

.slide-fade-enter,
.slide-fade-leave-to {
	margin-inline-start: calc(-1 * var(--default-clickable-area));
}
</style>
