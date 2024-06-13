<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="autocomplete-result">
		<!-- Avatar or icon -->
		<div :class="[icon, `autocomplete-result__icon--${avatarUrl ? 'with-avatar' : ''}`]"
			:style="avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : null "
			class="autocomplete-result__icon">
			<span v-if="status.icon"
				class="autocomplete-result__status autocomplete-result__status--icon">
				{{ status && status.icon || '' }}
			</span>
			<NcUserStatusIcon v-else-if="status.status && status.status !== 'offline'"
				class="autocomplete-result__status"
				:status="status.status" />
		</div>

		<!-- Label and subline -->
		<span class="autocomplete-result__content">
			<span class="autocomplete-result__title" :title="labelWithFallback">
				{{ labelWithFallback }}
			</span>
			<span v-if="subline" class="autocomplete-result__subline">
				{{ subline }}
			</span>
		</span>
	</div>
</template>

<script>
import { getAvatarUrl } from '../../utils/getAvatarUrl.ts'

import NcUserStatusIcon from '../NcUserStatusIcon/index.js'

export default {
	name: 'NcAutoCompleteResult',

	components: {
		NcUserStatusIcon,
	},

	props: {
		/**
		 * @deprecated Use `label` instead
		 */
		title: {
			type: String,
			required: false,
			default: null,
		},
		label: {
			type: String,
			required: false,
			default: null,
		},
		subline: {
			type: String,
			default: null,
		},
		id: {
			type: String,
			default: null,
		},
		icon: {
			type: String,
			required: true,
		},
		iconUrl: {
			type: String,
			default: null,
		},
		source: {
			type: String,
			required: true,
		},
		status: {
			type: [Object, Array],
			default: () => ({}),
		},
	},
	computed: {
		avatarUrl() {
			if (this.iconUrl) {
				return this.iconUrl
			}

			return this.id && this.source === 'users'
				? this.getAvatarUrl(this.id, 44)
				: null
		},
		// For backwards compatibility
		labelWithFallback() {
			return this.label || this.title
		},
	},

	methods: {
		getAvatarUrl,
	},
}
</script>

<style lang="scss" scoped>
.autocomplete-result {
	display: flex;
	height: var(--default-clickable-area);
	padding: var(--default-grid-baseline) 0;

	&__icon {
		position: relative;
		flex: 0 0 var(--default-clickable-area);
		width: var(--default-clickable-area);
		min-width: var(--default-clickable-area);
		height: var(--default-clickable-area);
		border-radius: var(--default-clickable-area);
		background-color: var(--color-background-darker);
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		&--with-avatar {
			color: inherit;
			background-size: cover;
		}
	}

	&__status {
		box-sizing: border-box;
		position: absolute;
		right: -4px;
		bottom: -4px;
		min-width: 18px;
		min-height: 18px;
		width: 18px;
		height: 18px;
		border: 2px solid var(--color-main-background);
		border-radius: 50%;
		background-color: var(--color-main-background);
		font-size: var(--default-font-size);
		line-height: 15px;
		background-repeat: no-repeat;
		background-size: 16px;
		background-position: center;

		&--icon {
			border: none;
			background-color: transparent;
		}
	}

	&__content {
		display: flex;
		flex: 1 1 100%;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
		padding-left: calc(var(--default-grid-baseline) * 2);
	}

	&__title,
	&__subline {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&__subline {
		color: var(--color-text-maxcontrast);
	}
}

</style>
