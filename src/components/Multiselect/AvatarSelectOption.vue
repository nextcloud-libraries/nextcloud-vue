<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template>
	<span class="option">
		<Avatar :display-name="option.displayName" :user="option.user" :disable-tooltip="true"
			:is-no-user="option.isNoUser" class="option__avatar" />
		<div class="option__desc">
			<span class="option__desc--lineone">
				{{ option.displayName }}
			</span>
			<span v-if="option.desc" class="option__desc--linetwo">
				{{ option.desc }}
			</span>
		</div>
		<span v-if="option.icon" class="icon option__icon" :class="option.icon" />
	</span>
</template>

<script>
import Avatar from 'Components/Avatar'

export default {
	name: 'AvatarSelectOption',
	components: {
		Avatar
	},
	props: {
		option: {
			type: Object,
			default() {
				return {
					desc: '',
					displayName: 'Admin',
					icon: 'icon-user',
					user: 'admin',
					isNoUser: false
				}
			},
			validator: (option) => {
				// minimum required is displayName
				return 'displayName' in option
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.option {
	display: flex;
	align-items: center;
	height: 32px;
	width: 100%;
	&__avatar {
		flex: 0 0 32px;
		width: 32px;
		height: 32px;
		margin-right: 6px;
	}
	&__desc {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1 1;
		min-width: 0;
		&--lineone {
			color: var(--color-text-light);
			&--highlight {
				font-weight: 600;
			}
		}
		&--linetwo {
			opacity: $opacity_normal;
		}
		&--lineone,
		&--linetwo {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	&__icon {
		width: $clickable-area;
		height: $clickable-area;
		flex: 0 0 $clickable-area;
		margin: -6px;
		opacity: $opacity_disabled;
	}
}
</style>
