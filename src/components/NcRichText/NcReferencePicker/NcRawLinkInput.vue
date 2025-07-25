<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="raw-link">
		<div class="input-wrapper">
			<NcTextField ref="url-input"
				v-model="inputValue"
				:show-trailing-button="inputValue !== ''"
				:label="inputPlaceholder"
				@trailing-button-click="onClear"
				@update:model-value="onInput"
				@keyup.enter="onSubmit">
				<NcLoadingIcon v-if="loading" :size="16" />
				<LinkVariantIcon v-else :size="16" />
			</NcTextField>
		</div>
		<NcReferenceWidget v-if="reference !== null"
			class="reference-widget"
			:reference="reference" />
		<NcEmptyContent v-else
			class="raw-link--empty-content">
			<template #icon>
				<img v-if="provider.icon_url"
					class="provider-icon"
					:src="provider.icon_url">
				<LinkVariantIcon v-else />
			</template>
		</NcEmptyContent>
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import debounce from 'debounce'
import LinkVariantIcon from 'vue-material-design-icons/LinkVariant.vue'
import NcReferenceWidget from '../NcReferenceWidget.vue'
import NcEmptyContent from '../../NcEmptyContent/index.ts'
import NcLoadingIcon from '../../NcLoadingIcon/index.ts'
import NcTextField from '../../NcTextField/index.ts'
import { isUrl } from './utils.ts'
import { t } from '../../../l10n.ts'

export default {
	name: 'NcRawLinkInput',
	components: {
		LinkVariantIcon,
		NcEmptyContent,
		NcLoadingIcon,
		NcReferenceWidget,
		NcTextField,
	},
	props: {
		/**
		 * The reference provider
		 */
		provider: {
			type: Object,
			required: true,
		},
	},
	emits: [
		'submit',
	],
	data() {
		return {
			inputValue: '',
			loading: false,
			reference: null,
			abortController: null,
			inputPlaceholder: t('Enter link'),
		}
	},
	computed: {
		isLinkValid() {
			return isUrl(this.inputValue)
		},
		debouncedUpdateReference() {
			return debounce(this.updateReference, 500)
		},
	},
	methods: {
		focus() {
			this.$refs['url-input'].$el.getElementsByTagName('input')[0]?.focus()
		},
		onSubmit(e) {
			const value = e.target.value
			if (this.isLinkValid) {
				this.$emit('submit', value)
			}
		},
		onClear() {
			this.inputValue = ''
			this.reference = null
		},
		onInput() {
			this.reference = null
			if (this.abortController) {
				this.abortController.abort()
			}
			if (this.isLinkValid) {
				this.debouncedUpdateReference()
			}
		},
		updateReference() {
			this.loading = true
			this.abortController = new AbortController()
			axios.get(generateOcsUrl('references/resolve', 2) + '?reference=' + encodeURIComponent(this.inputValue), {
				signal: this.abortController.signal,
			})
				.then((response) => {
					this.reference = response.data.ocs.data.references[this.inputValue]
				})
				.catch((error) => {
					console.error(error)
				})
				.then(() => {
					this.loading = false
				})
		},
	},
}
</script>

<style lang="scss" scoped>
.raw-link {
	width: 100%;
	min-height: 350px;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	padding: 0 16px 16px 16px;

	.input-wrapper {
		width: 100%;
	}

	.reference-widget {
		display: flex;
	}

	&--empty-content .provider-icon {
		width: 150px;
		height: 150px;
		object-fit: contain;
		filter: var(--background-invert-if-dark);
	}

	&--input {
		width: 99%;
	}
}
</style>
