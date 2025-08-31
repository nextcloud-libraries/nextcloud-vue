<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<li class="action" :role="isInSemanticMenu && 'presentation'">
		<span
			class="action-text"
			@click="onClick">
			<!-- @slot Manually provide icon -->
			<slot name="icon">
				<span
					v-if="icon !== ''"
					:class="[isIconUrl ? 'action-text__icon--url' : icon]"
					aria-hidden="true"
					:style="{ backgroundImage: isIconUrl ? `url(${icon})` : null }"
					class="action-text__icon" />
			</slot>

			<!-- long text with name -->
			<span
				v-if="name"
				class="action-text__longtext-wrapper">
				<strong class="action-text__name">
					{{ name }}
				</strong>
				<!-- white space is shown on longtext, so we can't
				put {{ text }} on a new line for code readability -->
				<span class="action-text__longtext" v-text="text" />
			</span>

			<!-- long text only -->
			<!-- white space is shown on longtext, so we can't
			put {{ text }} on a new line for code readability -->
			<span
				v-else-if="isLongText"
				class="action-text__longtext"
				v-text="text" />

			<!-- default text display -->
			<span v-else class="action-text__text">{{ text }}</span>

			<!-- fake slot to gather inner text -->
			<slot v-if="false" />
		</span>
	</li>
</template>

<script>
import ActionTextMixin from '../../mixins/actionText.js'

export default {
	name: 'NcActionText',

	mixins: [ActionTextMixin],

	inject: {
		isInSemanticMenu: {
			from: 'NcActions:isSemanticMenu',
			default: false,
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../assets/action';
@include action-active;
@include action-item('text');
@include action--disabled;

.action-text {
	&,
	span {
		cursor: default;
	}
}
</style>
