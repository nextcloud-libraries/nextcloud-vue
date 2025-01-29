<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcModal v-if="show"
		:size="modalSize"
		:can-close="true"
		class="reference-picker-modal"
		@close="onCancel">
		<div ref="modal_content"
			class="reference-picker-modal--content">
			<NcButton v-if="showBackButton"
				:aria-label="backButtonTitle"
				:title="backButtonTitle"
				class="back-button"
				@click="onBackClicked">
				<template #icon>
					<ArrowLeftIcon />
				</template>
			</NcButton>
			<NcButton :aria-label="closeButtonLabel"
				:title="closeButtonTitle"
				type="tertiary"
				class="close-button"
				@click="onCancel">
				<template #icon>
					<CloseIcon />
				</template>
			</NcButton>
			<h2 v-if="showModalName">
				{{ modalName }}
			</h2>
			<NcReferencePicker ref="referencePicker"
				:initial-provider="initialProvider"
				:focus-on-create="focusOnCreate"
				@provider-selected="onProviderSelect"
				@submit="onSubmit"
				@cancel="onCancel" />
		</div>
	</NcModal>
</template>

<script>
import NcReferencePicker from './NcReferencePicker.vue'
import { getCustomPickerElementSize, isCustomPickerElementRegistered } from './../../../functions/reference/customPickerElements.js'
import NcButton from '../../NcButton/index.js'
import NcModal from '../../NcModal/index.js'
import { t } from '../../../l10n.js'

import { emit } from '@nextcloud/event-bus'

import ArrowLeftIcon from 'vue-material-design-icons/ArrowLeft.vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'

export default {
	name: 'NcReferencePickerModal',
	components: {
		NcReferencePicker,
		NcModal,
		NcButton,
		ArrowLeftIcon,
		CloseIcon,
	},
	props: {
		/**
		 * Provider to select on creation
		 * Show the provider list if no initial one is provided
		 */
		initialProvider: {
			type: Object,
			default: () => null,
		},
		/**
		 * Focus on the input item on create
		 */
		focusOnCreate: {
			type: Boolean,
			default: true,
		},
		/**
		 * If true, add the modal content to the Viewer trap elements via the event-bus
		 */
		isInsideViewer: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'cancel',
		'submit',
	],
	data() {
		return {
			show: true,
			selectedProvider: this.initialProvider,
			backButtonTitle: t('Back to provider selection'),
			closeButtonTitle: t('Close'),
			closeButtonLabel: t('Close Smart Picker'),
		}
	},
	computed: {
		isProviderSelected() {
			return this.selectedProvider !== null
		},
		showBackButton() {
			return this.initialProvider === null && this.isProviderSelected
		},
		modalSize() {
			return this.isProviderSelected && isCustomPickerElementRegistered(this.selectedProvider.id)
				? (getCustomPickerElementSize(this.selectedProvider.id) ?? 'large')
				: 'normal'
		},
		showModalName() {
			return !this.isProviderSelected || !isCustomPickerElementRegistered(this.selectedProvider.id)
		},
		modalName() {
			return this.isProviderSelected
				? this.selectedProvider.title
				: t('Smart Picker')
		},
	},
	mounted() {
		if (this.isInsideViewer) {
			const elem = this.$refs.modal_content
			emit('viewer:trapElements:changed', elem)
		}
	},
	methods: {
		onCancel() {
			this.show = false
			this.$emit('cancel')
		},
		onSubmit(value) {
			this.show = false
			this.$emit('submit', value)
		},
		onProviderSelect(provider) {
			this.selectedProvider = provider
			// provider was deselected and we started with an inital one: just close the modal
			if (provider === null && this.initialProvider !== null) {
				this.onCancel()
			}
		},
		onBackClicked() {
			this.$refs.referencePicker.deselectProvider()
		},
	},
}
</script>

<style lang="scss">
// this is to avoid scroll on the container and leave it to the result block
.reference-picker-modal .modal-container {
	display: flex !important;
}
</style>

<style lang="scss" scoped>
.reference-picker-modal--content {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	overflow-y: auto;

	.close-button,
	.back-button {
		position: absolute;
		top: 4px;
	}
	.back-button {
		inset-inline-start: 4px;
	}
	.close-button {
		inset-inline-end: 4px;
	}

	> h2 {
		display: flex;
		margin: 12px 0 20px 0;
		.icon {
			margin-inline-end: 8px;
		}
	}
}
</style>
