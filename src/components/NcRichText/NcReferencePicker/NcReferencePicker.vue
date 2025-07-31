<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div
		class="reference-picker"
		:style="pickerWrapperStyle"
		tabindex="-1"
		@keydown.stop.prevent.esc="onEscapePressed">
		<NcProviderList
			v-if="mode === MODES.providerList"
			ref="provider-list"
			@select-provider="onProviderSelected"
			@submit="submitLink"
			@cancel="cancelProviderSelection" />
		<NcRawLinkInput
			v-else-if="mode === MODES.standardLinkInput"
			ref="url-input"
			:provider="selectedProvider"
			@submit="submitLink"
			@cancel="cancelRawLinkInput" />
		<NcSearch
			v-else-if="mode === MODES.searchInput"
			ref="url-input"
			:provider="selectedProvider"
			@cancel="cancelSearch"
			@submit="submitLink" />
		<div
			v-else-if="mode === MODES.customElement"
			class="custom-element-wrapper">
			<NcCustomPickerElement
				:provider="selectedProvider"
				class="custom-element"
				@submit="submitLink"
				@cancel="cancelCustomElement" />
		</div>
	</div>
</template>

<script>
import NcCustomPickerElement from './NcCustomPickerElement.vue'
import NcProviderList from './NcProviderList.vue'
import NcRawLinkInput from './NcRawLinkInput.vue'
import NcSearch from './NcSearch.vue'
import { isCustomPickerElementRegistered } from '../../../functions/reference/customPickerElements.ts'
import { touchProvider } from '../../../functions/reference/providerHelper.ts'

const MODES = {
	providerList: 1,
	standardLinkInput: 2,
	searchInput: 3,
	customElement: 4,
}
export default {
	name: 'NcReferencePicker',
	components: {
		NcCustomPickerElement,
		NcProviderList,
		NcRawLinkInput,
		NcSearch,
	},

	props: {
		/**
		 * Provider to select on creation
		 * Default: null. Show the provider list
		 */
		initialProvider: {
			type: Object,
			default: () => null,
		},

		/**
		 * Optional width in pixels
		 * Default: 100%
		 */
		width: {
			type: Number,
			default: null,
		},

		/**
		 * Focus on the provider list select input on creation
		 * Default: true
		 */
		focusOnCreate: {
			type: Boolean,
			default: true,
		},
	},

	emits: [
		'cancel',
		'cancelRawLink',
		'cancelSearch',
		'providerSelected',
		'submit',
	],

	data() {
		return {
			MODES,
			selectedProvider: this.initialProvider,
		}
	},

	computed: {
		mode() {
			return this.selectedProvider === null
				? MODES.providerList
				: isCustomPickerElementRegistered(this.selectedProvider.id)
					? MODES.customElement
					: this.selectedProvider.search_providers_ids
						? MODES.searchInput
						: MODES.standardLinkInput
		},

		pickerWrapperStyle() {
			return {
				width: this.width ? this.width + 'px' : undefined,
			}
		},
	},

	mounted() {
		if (this.focusOnCreate) {
			if (this.initialProvider) {
				setTimeout(() => {
					this.$refs['url-input']?.focus()
				}, 300)
			} else {
				this.$nextTick(() => {
					this.$refs['provider-list']?.focus()
				})
			}
		}
	},

	methods: {
		onEscapePressed() {
			if (this.selectedProvider !== null) {
				this.deselectProvider()
			} else {
				this.cancelProviderSelection()
			}
		},

		onProviderSelected(provider) {
			this.selectedProvider = provider
			this.$emit('providerSelected', provider)
			this.$nextTick(() => {
				this.$refs['url-input']?.focus()
			})
		},

		cancelCustomElement() {
			this.deselectProvider()
		},

		cancelSearch() {
			this.$emit('cancelSearch', this.selectedProvider?.title)
			this.deselectProvider()
		},

		cancelRawLinkInput() {
			this.$emit('cancelRawLink', this.selectedProvider?.title)
			this.deselectProvider()
		},

		cancelProviderSelection() {
			this.$emit('cancel')
		},

		submitLink(link) {
			if (this.selectedProvider !== null) {
				touchProvider(this.selectedProvider.id)
			}
			this.$emit('submit', link)
			this.deselectProvider()
		},

		deselectProvider() {
			this.selectedProvider = null
			this.$emit('providerSelected', null)
			setTimeout(() => {
				this.$refs['provider-list']?.focus()
			}, 300)
		},
	},
}
</script>

<style lang="scss" scoped>
.reference-picker {
	display: flex;
	overflow-y: auto;
	width: 100%;

	.custom-element-wrapper {
		display: flex;
		overflow-y: auto;
		width: 100%;
		.custom-element {
			display: flex;
			overflow-y: auto;
			width: 100%;
		}
	}
}
</style>
