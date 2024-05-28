<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<li class="action" :role="isInSemanticMenu && 'presentation'">
		<RouterLink :to="to"
			:aria-label="ariaLabel"
			:title="title"
			class="action-router focusable"
			rel="nofollow noreferrer noopener"
			:role="isInSemanticMenu && 'menuitem'"
			@click="onClick">
			<!-- @slot Manually provide icon -->
			<slot name="icon">
				<span :class="[isIconUrl ? 'action-router__icon--url' : icon]"
					:style="{ backgroundImage: isIconUrl ? `url(${icon})` : null }"
					class="action-router__icon"
					aria-hidden="true" />
			</slot>

			<!-- long text with name -->
			<span v-if="name"
				class="action-router__longtext-wrapper">
				<strong class="action-router__name">
					{{ name }}
				</strong>
				<br>
				<!-- white space is shown on longtext, so we can't
				put {{ text }} on a new line for code readability -->
				<span class="action-router__longtext" v-text="text" />
			</span>

			<!-- long text only -->
			<!-- white space is shown on longtext, so we can't
			put {{ text }} on a new line for code readability -->
			<span v-else-if="isLongText"
				class="action-router__longtext"
				v-text="text" />

			<!-- default text display -->
			<span v-else class="action-router__text">{{ text }}</span>

			<!-- fake slot to gather inner text -->
			<slot v-if="false" />
		</RouterLink>
	</li>
</template>

<script>
import ActionTextMixin from '../../mixins/actionText.js'

export default {
	name: 'NcActionRouter',

	mixins: [ActionTextMixin],

	inject: {
		isInSemanticMenu: {
			from: 'NcActions:isSemanticMenu',
			default: false,
		},
	},

	props: {
		/**
		 * router-link to prop [https://router.vuejs.org/api/#to](https://router.vuejs.org/api/#to)
		 */
		to: {
			type: [String, Object],
			default: '',
			required: true,
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../assets/action';
@include action-active;
@include action-item('router');
@include action--disabled;

</style>
