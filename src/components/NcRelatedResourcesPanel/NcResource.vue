<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<li class="resource">
		<NcButton class="resource__button"
			:aria-label="labelTranslated"
			type="tertiary"
			:to="route"
			:href="route ? null : url">
			<template #icon>
				<div class="resource__icon">
					<img :src="icon">
				</div>
			</template>
			{{ name }}
		</NcButton>
	</li>
</template>

<script>
import NcButton from '../NcButton/index.js'

import { getRoute } from '../NcRichText/autolink.js'
import { t } from '../../l10n.js'

export default {
	name: 'NcResource',

	components: {
		NcButton,
	},

	props: {
		icon: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			labelTranslated: t('Open link to "{resourceName}"', { resourceName: this.name }),
		}
	},

	computed: {
		route() {
			return getRoute(this.$router, this.url)
		},
	},

	methods: {
		t,
	},
}
</script>

<style lang="scss" scoped>
.resource {
	display: flex;
	align-items: center;
	height: var(--default-clickable-area);

	// Override default NcButton styles
	&__button {
		width: 100% !important;
		justify-content: flex-start !important;
		padding: 0 !important;

		&:deep {
			.button-vue__wrapper {
				justify-content: flex-start !important;

				.button-vue__text {
					font-weight: normal !important;
					margin-left: 2px !important;
				}
			}
		}
	}

	&__icon {
		width: 32px;
		height: 32px;
		background-color: var(--color-text-maxcontrast);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;

		img {
			width: 16px;
			height: 16px;
			filter: var(--background-invert-if-dark);
		}
	}
}
</style>
