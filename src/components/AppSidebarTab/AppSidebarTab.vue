<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
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

<!-- Follows the tab aria guidelines
	https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html -->

<template>
	<section
		:id="`tab-${id}`"
		:class="{'app-sidebar__tab--active': isActive}"
		:aria-hidden="!isActive"
		:aria-labelledby="name"
		class="app-sidebar__tab"
		tabindex="0"
		role="tabpanel">
		<slot />
	</section>
</template>

<script>
export default {
	name: 'AppSidebarTab',

	props: {
		id: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
		order: {
			type: Number,
			default: 0,
		},
	},

	computed: {
		// TODO: implement a better way to force pass a prop fromm Sidebar
		isActive() {
			return this.$parent.activeTab === this.id
		},
	},
}
</script>

<style lang="scss" scoped>
.app-sidebar__tab {
	display: none;
	padding: 10px;
	min-height: 100%; // fill available height

	&:focus {
		border-color: var(--color-primary);
		box-shadow: 0 0 0.2em var(--color-primary);
		outline: 0;
	}

	&--active {
		display: block;
	}
}
</style>
