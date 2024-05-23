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
## This is used to display a avatar-name/subname + icon layout
It might be used for list rendering or within the multiselect for example

> **Note:** Any binding will be forwarded on the Avatar component root

```vue
<NcListItemIcon name="User 1" />
<NcListItemIcon name="User 1" subname="Hidden subname because size is too small" :avatar-size="24" />
```
```vue
	<template>
		<NcListItemIcon name="User 1" :avatar-size="44">
			<template>
				<Account :size="20" />
			</template>
		</NcListItemIcon>
	</template>
	<script>
	import Account from 'vue-material-design-icons/Account.vue'

	export default {
		components: {
			Account,
		},
	}
	</script>
```

### With icon
```vue
	<template>
		<NcListItemIcon name="Group 1" subname="13 members" :is-no-user="true">
			<template>
				<AccountMultiple :size="20" />
			</template>
		</NcListItemIcon>
	</template>
	<script>
	import AccountMultiple from 'vue-material-design-icons/AccountMultiple.vue'

	export default {
		components: {
			AccountMultiple,
		},
	}
	</script>
```

### Searching
```vue
	<template>
		<NcListItemIcon name="Test user 1" subname="callmetest@domain.com" search="test" />
		<NcListItemIcon name="Testing admin" subname="testme@example.com" search="test" />
		<NcListItemIcon name="Test group 2" subname="loremipsum@domain.com" :is-no-user="true" search="test">
			<template>
				<AccountMultiple :size="20" />
			</template>
		</NcListItemIcon>
	</template>
	<script>
	import AccountMultiple from 'vue-material-design-icons/AccountMultiple.vue'

	export default {
		components: {
			AccountMultiple,
		},
	}
	</script>
```

### With actions
```vue
	<template>
		<NcListItemIcon name="Test user 1" subname="callmetest@domain.com">
			<NcActions>
				<NcActionButton @click="alert('Edit')">
					<template #icon>
						<Pencil :size="20" />
					</template>
					Edit
				</NcActionButton>
				<NcActionButton @click="alert('Delete')">
					<template #icon>
						<Delete :size="20" />
					</template>
					Delete
				</NcActionButton>
			</NcActions>
		</NcListItemIcon>
	</template>
	<script>
	import Delete from 'vue-material-design-icons/Delete.vue'
	import Pencil from 'vue-material-design-icons/Pencil.vue'

	export default {
		components: {
			Delete,
			Pencil,
		},
	}
	</script>
```
</docs>

<template>
	<span :id="id"
		class="option"
		:style="cssVars"
		v-on="$listeners">
		<NcAvatar v-bind="$attrs"
			:disable-menu="true"
			:disable-tooltip="true"
			:display-name="displayName || name"
			:is-no-user="isNoUser"
			:size="avatarSize"
			class="option__avatar" />
		<div class="option__details">
			<NcHighlight class="option__lineone"
				:text="name"
				:search="searchParts[0]" />
			<NcHighlight v-if="isValidSubname && isSizeBigEnough"
				class="option__linetwo"
				:text="subname"
				:search="searchParts[1]" />
			<span v-else-if="hasStatus">
				<span>{{ userStatus.icon }}</span>
				<span>{{ userStatus.message }}</span>
			</span>
		</div>

		<!-- @slot use this slot to add a custom icon or actions -->
		<slot>
			<NcIconSvgWrapper v-if="hasIconSvg"
				class="option__icon"
				:svg="iconSvg"
				:name="iconName" />
			<span v-else-if="hasIcon"
				class="icon option__icon"
				:class="icon"
				:aria-label="iconName" />
		</slot>
	</span>
</template>

<script>
import NcAvatar from '../NcAvatar/index.js'
import NcHighlight from '../NcHighlight/index.js'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.js'

import { userStatus } from '../../mixins/index.js'

// global margin, ^2 ratio
const margin = 8
const defaultSize = 32

export default {
	name: 'NcListItemIcon',

	components: {
		NcAvatar,
		NcHighlight,
		NcIconSvgWrapper,
	},

	mixins: [
		userStatus,
	],

	props: {
		/**
		 * Default first line text
		 */
		name: {
			type: String,
			required: true,
		},

		/**
		 * Secondary optional line
		 * Only visible on size of 32 and above
		 */
		subname: {
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
		 * SVG icon to be displayed at the end of the component
		 */
		iconSvg: {
			type: String,
			default: '',
		},

		/**
		 * Descriptive name for the icon
		 */
		iconName: {
			type: String,
			default: '',
		},

		/**
		 * Search within the highlight of name/subname
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
		 * Useful for integration in `NcSelect` for example
		 */
		noMargin: {
			type: Boolean,
			default: false,
		},

		/**
		 * See the [Avatar](#Avatar) displayName prop
		 * Fallback to name
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

		hasIconSvg() {
			return this.iconSvg !== ''
		},

		isValidSubname() {
			return this.subname?.trim?.() !== ''
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

		/**
		 * Seperates the search property into two parts, the first one is the search part on the name, the second on the subname.
		 * @return {[string, string]}
		 */
		searchParts() {
			// Match the email notation like "Jane <j.doe@example.com>" with the email address as matching group
			const EMAIL_NOTATION = /^([^<]*)<([^>]+)>?$/

			const match = this.search.match(EMAIL_NOTATION)
			if (this.isNoUser || !match) {
				return [this.search, this.search]
			}
			return [match[1].trim(), match[2]]
		},
	},

	beforeMount() {
		// If we don't have a subname and if this is a user
		if (!this.isNoUser && !this.subname) {
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
	cursor: inherit;

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
		color: var(--color-main-text);
	}

	&__linetwo {
		color: var(--color-text-maxcontrast);
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
		width: $clickable-area;
		height: $clickable-area;
		color: var(--color-text-maxcontrast);
		&.icon {
			flex: 0 0 $clickable-area;
			opacity: $opacity_normal;
			background-position: center;
			background-size: 16px;
		}
	}

	&__details,
	&__lineone,
	&__linetwo,
	&__icon {
		cursor: inherit;
	}
}
</style>
