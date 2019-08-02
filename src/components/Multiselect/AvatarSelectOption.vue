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
<docs>
### User layout
By specifying `:user-select="true"`, you can benefit from a fully formatted layout.
```vue
<template>
	<Multiselect v-model="value" :options="formatedOptions"
		label="displayName" track-by="user"
		:user-select="true"
		style="width: 250px" />
</template>

<script>
import Multiselect from '../index'
export default {
	data() {
		return {
			value: null,
			options: ['admin', 'user1', 'user2', 'guest', 'group1']
		}
	},

	computed: {
		formatedOptions() {
			return this.options.map(item => {
				return {
					user: item,
					displayName: item,
					desc: `This is the ${item.startsWith('group') ? 'group' : 'user'} ${item}`,
					icon: item.startsWith('group') ? 'icon-group' : 'icon-user',
					isNoUser: item.startsWith('group')
				}
			})
		}
	}
}
</script>
```
</docs>

<template>
	<span class="option" v-bind="dataBind">
		<Avatar :display-name="displayName" :user="user"
			:is-no-user="isNoUser"
			:disable-menu="true" :disable-tooltip="true"
			class="option__avatar" />
		<div class="option__desc">
			<span class="option__desc--lineone">
				{{ displayName }}
			</span>
			<span v-if="desc !== ''" class="option__desc--linetwo">
				{{ desc }}
			</span>
		</div>
		<span v-if="icon !== ''" class="icon option__icon" :class="icon" />
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
		/**
		 * Secondary optional line
		 */
		desc: {
			type: String,
			default: ''
		},
		/**
		 * Default text
		 */
		displayName: {
			type: String,
			required: true
		},
		/**
		 * Icon class to be displayed at the end of the component
		 */
		icon: {
			type: String,
			default: ''
		},
		/**
		 * See the [Avatar](#Avatar) user prop
		 */
		user: {
			type: String,
			default: ''
		},
		/**
		 * See the [Avatar](#Avatar) isNoUser prop
		 */
		isNoUser: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		dataBind() {
			return Object.keys(this.$attrs).reduce((obj, key) => {
				obj[`data-${this.toKebabCase(key)}`] = this.$attrs[key]
				return obj
			}, {})
		}
	},

	methods: {
		toKebabCase: (string) => {
			return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
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
