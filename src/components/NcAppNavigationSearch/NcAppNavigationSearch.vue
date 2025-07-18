<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Usage

```vue
<template>
	<div class="styleguide-wrapper">
		<NcContent app-name="styleguide-app-navigation" class="content-styleguidist">
			<NcAppNavigation>
				<template #search>
					<NcAppNavigationSearch v-model="searchQuery">
						<template #actions>
							<NcActions aria-label="Filters">
								<template #icon>
									<IconFilter :size="20" />
								</template>
								<NcActionButton>
									<template #icon>
										<IconAccount :size="20" />
									</template>
									Filter by name
								</NcActionButton>
								<NcActionButton>
									<template #icon>
										<IconCalendarAccount :size="20" />
									</template>
									Filter by year
								</NcActionButton>
							</NcActions>
							<NcButton aria-label="Search globally" variant="tertiary">
								<template #icon>
									<IconSearchGlobal :size="20" />
								</template>
							</NcButton>
						</template>
					</NcAppNavigationSearch>
				</template>
				<template #list>
					<NcAppNavigationItem name="First navigation entry">
						<template #icon>
							<IconStar :size="20" />
						</template>
					</NcAppNavigationItem>
					<NcAppNavigationItem name="Second navigation entry">
						<template #icon>
							<IconStar :size="20" />
						</template>
					</NcAppNavigationItem>
				</template>
			</NcAppNavigation>
			<NcAppContent>
				<ul class="fake-content">
					<li>Search query: {{ searchQuery }}</li>
					<li v-for="(item, index) in items" :key="index">
						{{ item }}
					</li>
				</ul>
			</NcAppContent>
		</NcContent>
	</div>
</template>
<script>
import IconAccount from 'vue-material-design-icons/Account.vue'
import IconCalendarAccount from 'vue-material-design-icons/CalendarAccount.vue'
import IconFilter from 'vue-material-design-icons/Filter.vue'
import IconSearchGlobal from 'vue-material-design-icons/CloudSearch.vue'
import IconStar from 'vue-material-design-icons/Star.vue'

const exampleItem = ['Mary', 'Patricia', 'James', 'Michael']

export default {
	components: {
		IconAccount,
		IconCalendarAccount,
		IconFilter,
		IconSearchGlobal,
		IconStar,
	},

	data() {
		return {
			searchQuery: '',
		}
	},

	computed: {
		items() {
			return exampleItem.filter((item) => item.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase()))
		},
	},
}
</script>
<style scoped>
/* This styles just mock NcContent and NcAppContent */
.content-styleguidist {
	position: relative !important;
	margin: 0 !important;
	/* prevent jumping */
	min-height: 200px;
}

.content-styleguidist > * {
	height: auto;
}

.fake-content {
	padding: var(--app-navigation-padding);
	padding-top: calc(2 * var(--app-navigation-padding) + var(--default-clickable-area));
}

.styleguide-wrapper {
	background-color: var(--color-background-plain);
	padding: var(--body-container-margin);
}
</style>
```
</docs>
<template>
	<div class="app-navigation-search"
		:class="{
			'app-navigation-search--has-actions': hasActions(),
		}">
		<NcInputField ref="inputElement"
			v-model="model"
			:aria-label="label"
			class="app-navigation-search__input"
			label-outside
			:placeholder="placeholder ?? label"
			show-trailing-button
			:trailing-button-label="t('Clear search')"
			type="search"
			@trailing-button-click="onCloseSearch">
			<template #trailing-button-icon>
				<IconClose :size="20" />
			</template>
		</NcInputField>
		<div v-if="hasActions()"
			ref="actionsContainer"
			class="app-navigation-search__actions"
			:class="{
				'app-navigation-search__actions--hidden': !showActions,
				'hidden-visually': hideActions,
			}">
			<slot name="actions" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useFocusWithin } from '@vueuse/core'
import { ref, nextTick, useSlots, watch, useTemplateRef } from 'vue'
import { t } from '../../l10n.ts'

import IconClose from 'vue-material-design-icons/Close.vue'
import NcInputField from '../NcInputField/NcInputField.vue'

defineProps({
	/**
	 * Text used to label the search input
	 */
	label: {
		type: String,
		default: t('Search…'),
	},

	/**
	 * Placeholder of the search input
	 * By default the value of `label` is used.
	 */
	placeholder: {
		type: String,
		default: null,
	},
})

/**
 * Current search input
 */
const model = defineModel<string>({ default: '' })
const slots = useSlots()

const inputElement = ref()
const { focused: inputHasFocus } = useFocusWithin(inputElement)

/** Timeout used to define when the search input is fully expanded */
const transitionTimeout = Number.parseInt(window.getComputedStyle(window.document.body).getPropertyValue('--animation-quick')) || 100

const actionsContainer = useTemplateRef('actionsContainer')
const hasActions = () => !!slots.actions?.({})
const showActions = ref(true)
const timeoutId = ref()
/** This is used to hide the actions after the transition is done */
const hideActions = ref(false)
watch(inputHasFocus, () => {
	showActions.value = !inputHasFocus.value
	window.clearTimeout(timeoutId.value)
	if (showActions.value) {
		hideActions.value = false
	} else {
		// If the transition is done, we fully hide the actions visually
		window.setTimeout(() => {
			hideActions.value = !showActions.value
		}, transitionTimeout)
	}
})

/**
 * Handle close the search
 */
function onCloseSearch() {
	model.value = ''
	if (hasActions()) {
		showActions.value = true
		nextTick(() => actionsContainer.value?.querySelector('button')?.focus())
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

		transition: margin-inline-start var(--animation-quick);

		&--hidden {
			margin-inline-start: calc(-1 * var(--default-clickable-area));
		}
	}
}
</style>
