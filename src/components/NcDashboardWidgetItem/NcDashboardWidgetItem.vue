<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description

This component is meant to be used inside a DashboardWidget component.

</docs>

<template>
	<div @mouseover="hovered = true" @mouseleave="hovered = false">
		<component :is="targetUrl ? 'a' : 'div'"
			:href="targetUrl || undefined"
			:target="targetUrl ? '_blank' : undefined"
			:class="{ 'item-list__entry': true, 'item-list__entry--has-actions-menu': gotMenu }"
			@click="onLinkClick">
			<!-- @slot Slot for passing a user avatar. -->
			<slot name="avatar" :avatar-url="avatarUrl" :avatar-username="avatarUsername">
				<NcAvatar class="item-avatar"
					:size="44"
					:url="avatarUrl"
					:user="avatarUsername"
					:is-no-user="avatarIsNoUser"
					:show-user-status="!gotOverlayIcon" />
			</slot>
			<img v-if="overlayIconUrl"
				class="item-icon"
				alt=""
				:src="overlayIconUrl">
			<div class="item__details">
				<h3 :title="mainText">
					{{ mainText }}
				</h3>
				<span v-if="subText !== ''" class="message" :title="subText">
					{{ subText }}
				</span>
			</div>
			<NcActions v-if="gotMenu" :force-menu="forceMenu">
				<!-- @slot This slot can be used to provide actions for each dashboard widget item. -->
				<slot name="actions">
					<NcActionButton v-for="(m, menuItemId) in itemMenu"
						:key="menuItemId"
						:icon="m.icon"
						:close-after-click="true"
						@click.prevent.stop="$emit(menuItemId, item)">
						{{ m.text }}
					</NcActionButton>
				</slot>
			</NcActions>
		</component>
	</div>
</template>

<script>
import NcAvatar from '../NcAvatar/index.js'
import NcActions from '../NcActions/index.js'
import NcActionButton from '../NcActionButton/index.js'

export default {
	name: 'NcDashboardWidgetItem',
	components: {
		NcAvatar,
		NcActions,
		NcActionButton,
	},

	props: {
		/**
		 * The item id (optional)
		 */
		id: {
			type: [String, Number],
			default: undefined,
		},
		/**
		 * The item element is a link to this URL (optional)
		 */
		targetUrl: {
			type: String,
			default: undefined,
		},
		/**
		 * Where to get the avatar image. (optional) Used if avatarUsername is not defined.
		 */
		avatarUrl: {
			type: String,
			default: undefined,
		},
		/**
		 * Name to provide to the Avatar. (optional) Used if avatarUrl is not defined.
		 */
		avatarUsername: {
			type: String,
			default: undefined,
		},
		/**
		 * Is the avatarUsername not a user's name? (optional, false by default)
		 */
		avatarIsNoUser: {
			type: Boolean,
			default: false,
		},
		/**
		 * Small icon to display on the bottom-right corner of the avatar (optional)
		 */
		overlayIconUrl: {
			type: String,
			default: undefined,
		},
		/**
		 * Item main text (mandatory)
		 */
		mainText: {
			type: String,
			required: true,
		},
		/**
		 * Item subline text (optional)
		 */
		subText: {
			type: String,
			default: '',
		},
		/**
		 * An object containing context menu entries that will be displayed for each items (optional)
		 */
		itemMenu: {
			type: Object,
			default: () => { return {} },
		},

		/**
		 * Specify whether the 3 dot menu is forced when only one action is present
		 */
		forceMenu: {
			type: Boolean,
			default: true,
		},
	},

	data() {
		return {
			hovered: false,
		}
	},

	computed: {
		item() {
			return {
				id: this.id,
				targetUrl: this.targetUrl,
				avatarUrl: this.avatarUrl,
				avatarUsername: this.avatarUsername,
				overlayIconUrl: this.overlayIconUrl,
				mainText: this.mainText,
				subText: this.subText,
			}
		},
		gotMenu() {
			return Object.keys(this.itemMenu).length !== 0 || !!this.$slots.actions
		},
		gotOverlayIcon() {
			return this.overlayIconUrl && this.overlayIconUrl !== ''
		},
	},

	methods: {
		onLinkClick(event) {
			if (event.target.closest('.action-item')) {
				event.preventDefault()
			}
		},
	},
}
</script>

<style scoped lang="scss">
.item-list__entry {
	display: flex;
	align-items: center;
	position: relative;
	padding: 8px;

	&:hover,
	&:focus {
		background-color: var(--color-background-hover);
		border-radius: var(--border-radius-large);
	}
	.item-avatar {
		position: relative;
		margin-top: auto;
		margin-bottom: auto;
	}
	.item__details {
		padding-inline-start: 8px;
		max-height: fit-content;
		flex-grow: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: var(--default-clickable-area);

		h3,
		.message {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.message span {
			width: 10px;
			display: inline-block;
			margin-bottom: -3px;
		}
		h3 {
			font-size: 100%;
			margin: 0;
		}
		.message {
			width: 100%;
			color: var(--color-text-maxcontrast);
		}
	}

	.item-icon {
		position: relative;
		width: 14px;
		height: 14px;
		margin-top: 25px;
		margin-inline: -10px -2px;
	}

	button.primary {
		padding: 21px;
		margin: 0;
	}
}
/*
.content-popover {
	height: 0px;
	width: 0px;
	margin-inline: auto;
}
.popover-container {
	width: 100%;
	height: 0px;
}
*/
</style>
