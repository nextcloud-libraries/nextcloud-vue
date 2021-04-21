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
## This is used to display a avatar-title/subtitle + icon layout
It might be used for list rendering or within the multiselect for example

> **Note:** Any binding will be forwarded on the Avatar component root

```vue
<ListItemIcon title="User 1" />
<ListItemIcon title="User 1" subtitle="Hidden subtitle because size is too small" :avatar-size="24" />
```
```vue
<ListItemIcon title="User 1" :avatar-size="44" icon="icon-user" />
```

### With icon
```vue
<ListItemIcon title="Group 1" subtitle="13 members" icon="icon-group" :is-no-user="true" />
```

### Searching
```vue
<ListItemIcon title="Test user 1" subtitle="callmetest@domain.com" search="test" />
<ListItemIcon title="Testing admin" subtitle="testme@example.com" search="test" />
<ListItemIcon title="Test group 2" subtitle="loremipsum@domain.com" icon="icon-group" :is-no-user="true" search="test" />
```

### With actions
```vue
<ListItemIcon title="Test user 1" subtitle="callmetest@domain.com">
	<Actions>
		<ActionButton icon="icon-edit" @click="alert('Edit')">Edit</ActionButton>
		<ActionButton icon="icon-delete" @click="alert('Delete')">Delete</ActionButton>
	</Actions>
</ListItemIcon>
```
</docs>

<template>
	<span :id="id"
		class="option"
		:style="cssVars"
		v-on="$listeners">
		<Avatar
			v-bind="$attrs"
			:disable-menu="true"
			:disable-tooltip="true"
			:display-name="displayName || title"
			:is-no-user="isNoUser"
			:size="avatarSize"
			class="option__avatar" />
		<div class="option__details">
			<Highlight
				class="option__lineone"
				:text="title"
				:search="search" />
			<Highlight
				v-if="isValidSubtitle && isSizeBigEnough"
				class="option__linetwo"
				:text="subtitle"
				:search="search" />
			<span v-else-if="hasStatus">
				<span>{{ userStatus.icon }}</span>
				<span>{{ userStatus.message }}</span>
			</span>
		</div>

		<!-- @slot use this slot to add a custom icon or actions -->
		<slot />
		<span v-if="hasIcon && !hasSlot" class="icon option__icon" :class="icon" />
	</span>
</template>

<script>
import Avatar from '../Avatar'
import Highlight from '../Highlight'
import { userStatus } from '../../mixins'

// global margin, ^2 ratio
const margin = 8
const defaultSize = 32

export default {
	name: 'ListItemIcon',

	components: {
		Avatar,
		Highlight,
	},
	mixins: [userStatus],

	props: {
		/**
		 * Default first line text
		 */
		title: {
			type: String,
			required: true,
		},

		/**
		 * Secondary optional line
		 * Only visible on size of 32 and above
		 */
		subtitle: {
			type: String,
			default: '',
		},

		/**
		 * Icon class to be displayed at the end of the component
		 */
		icon: {
			type: String,
			default: '',
		},

		/**
		 * Search within the highlight of title/subtitle
		 */
		search: {
			type: String,
			default: '',
		},

		/**
		 * Set a size in px that will define the avatar height/width
		 * and therefore, the height of the component
		 */
		avatarSize: {
			type: Number,
			default: defaultSize,
		},

		/**
		 * Disable the margins of this component.
		 * Useful for integration in Multiselect for example
		 */
		noMargin: {
			type: Boolean,
			default: false,
		},

		/**
		 * See the [Avatar](#Avatar) displayName prop
		 * Fallback to title
		 */
		displayName: {
			type: String,
			default: null,
		},
		/**
		 * See the [Avatar](#Avatar) isNoUser prop
		 * Enable/disable the UserStatus fetching
		 */
		isNoUser: {
			type: Boolean,
			default: false,
		},

		/**
		 * Unique list item ID
		 */
		id: {
			type: String,
			default: null,
		},
	},

	data() {
		return {
			margin,
		}
	},

	computed: {
		hasIcon() {
			return this.icon !== ''
		},
		hasSlot() {
			return !!this.$slots.default
		},

		isValidSubtitle() {
			return this.subtitle?.trim?.() !== ''
		},
		isSizeBigEnough() {
			return this.avatarSize >= defaultSize
		},

		cssVars() {
			// Don't use margin to calculate the height if noMargin
			const margin = this.noMargin ? 0 : this.margin

			return {
				'--height': this.avatarSize + 2 * margin + 'px',
				'--margin': this.margin + 'px',
			}
		},
	},

	beforeMount() {
		// If we don't have a subtitle and if this is a user
		if (!this.isNoUser && !this.subtitle) {
			this.fetchUserStatus(this.user)
		}
	},
}
</script>

<style lang="scss" scoped>
.option {
	display: flex;
	align-items: center;
	width: 100%;
	height: var(--height);

	&__avatar {
		margin-right: var(--margin);
	}

	&__details {
		display: flex;
		flex: 1 1;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
	}

	&__lineone {
		color: var(--color-text-light);
	}
	&__linetwo {
		opacity: $opacity_normal;
	}
	&__lineone,
	&__linetwo {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 1.1em;
		strong {
			font-weight: bold;
		}
	}

	&__icon {
		flex: 0 0 $clickable-area;
		width: $clickable-area;
		height: $clickable-area;
		opacity: $opacity_disabled;
		background-position: center;
		background-size: 16px;
	}
}

</style>
