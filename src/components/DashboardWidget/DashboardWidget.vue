<!--
 - @copyright Copyright (c) 2020 Julien Veyssier <eneiluj@posteo.net>
 -
 - @author Julien Veyssier <eneiluj@posteo.net>
 -
 - @license GNU AGPL version 3 or any later version
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<template>
	<div>
		<EmptyContent v-if="showItemsAndEmptyContent && halfEmptyContentString && items.length !== 0"
			class="half-screen"
			:icon="halfEmptyContentIcon">
			<template #desc>
				{{ halfEmptyContentString }}
			</template>
		</EmptyContent>
		<ul>
			<li v-for="item in displayedItems" :key="item.id">
				<slot name="default" :item="item">
					<DashboardWidgetItem :id="item.id"
						:target-url="item.targetUrl"
						:avatar-url="item.avatarUrl"
						:avatar-username="item.avatarUsername"
						:avatar-is-no-user="item.avatarIsNoUser"
						:overlay-icon-url="item.overlayIconUrl"
						:main-text="item.mainText"
						:sub-text="item.subText"
						:item-menu="itemMenu"
						v-on="handlers" />
				</slot>
			</li>
		</ul>
		<div v-if="loading">
			<div v-for="i in 7" :key="i" class="item-list__entry">
				<Avatar class="item-avatar" :size="44" />
				<div class="item__details">
					<h3>&nbsp;</h3>
					<p class="message">
&nbsp;
					</p>
				</div>
			</div>
		</div>
		<slot v-else-if="items.length === 0" name="empty-content">
			<EmptyContent v-if="emptyContentMessage"
				:icon="emptyContentIcon">
				<template #desc>
					{{ emptyContentMessage }}
				</template>
			</EmptyContent>
		</slot>
		<a v-else-if="showMore"
			:href="showMoreUrl"
			target="_blank"
			class="more"
			tabindex="0">
			{{ showMoreLabel }}
		</a>
	</div>
</template>

<script>
import Avatar from '../Avatar/index.js'
import DashboardWidgetItem from '../DashboardWidgetItem/index.js'
import EmptyContent from '../EmptyContent/index.js'

import { t } from '../../l10n.js'

export default {
	name: 'DashboardWidget',
	components: {
		Avatar,
		DashboardWidgetItem,
		EmptyContent,
	},

	props: {
		items: {
			type: Array,
			default: () => { return [] },
		},
		showMoreUrl: {
			type: String,
			default: '',
		},
		showMoreText: {
			type: String,
			default: t('items'),
		},
		loading: {
			type: Boolean,
			default: false,
		},
		itemMenu: {
			type: Object,
			default: () => { return {} },
		},
		showItemsAndEmptyContent: {
			type: Boolean,
			default: false,
		},
		emptyContentIcon: {
			type: String,
			default: '',
		},
		emptyContentMessage: {
			type: String,
			default: '',
		},
		halfEmptyContentIcon: {
			type: String,
			default: 'icon-checkmark',
		},
		halfEmptyContentMessage: {
			type: String,
			default: '',
		},
	},

	computed: {
		// forward menu events to my parent
		handlers() {
			const h = {}
			for (const evName in this.itemMenu) {
				h[evName] = (it) => {
					this.$emit(evName, it)
				}
			}
			return h
		},
		displayedItems() {
			const nbItems = (this.showMoreUrl && this.items.length >= this.maxItemNumber)
				? this.maxItemNumber - 1
				: this.maxItemNumber
			return this.items.slice(0, nbItems)
		},

		halfEmptyContentString() {
			return this.halfEmptyContentMessage || this.emptyContentMessage
		},

		maxItemNumber() {
			return this.showItemsAndEmptyContent ? 5 : 7
		},

		showMore() {
			return this.showMoreUrl && this.items.length >= this.maxItemNumber
		},

		showMoreLabel() {
			return t('More {what} …', { what: this.showMoreText })
		},
	},
}
</script>

<style scoped lang="scss">
.empty-content {
	text-align: center;
	margin-top: 5vh;

	&.half-screen {
		margin-top: 0;
		margin-bottom: 1vh;
	}
}

.more {
	display: block;
	text-align: center;
	color: var(--color-text-maxcontrast);
	line-height: 60px;
	cursor: pointer;

	&:hover,
	&:focus {
		background-color: var(--color-background-hover);
		border-radius: var(--border-radius-large);
		color: var(--color-main-text);
	}
}

/* skeleton */
.item-list__entry {
	display: flex;
	align-items: flex-start;
	padding: 8px;

	.item-avatar {
		position: relative;
		margin-top: auto;
		margin-bottom: auto;
		background-color: var(--color-background-dark) !important;
	}
	.item__details {
		padding-left: 8px;
		max-height: 44px;
		flex-grow: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		h3,
		.message {
			white-space: nowrap;
			background-color: var(--color-background-dark);
		}
		h3 {
			font-size: 100%;
			margin: 0;
		}
		.message {
			width: 80%;
			height: 15px;
			margin-top: 5px;
		}
	}
}
</style>
