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
	<section v-show="isActive"
		:id="`tab-${id}`"
		:aria-hidden="!isActive"
		:aria-labelledby="name"
		tabindex="0"
		role="tabpanel">
		<slot />
	</section>
</template>

<script>
export default {
	name: 'AppSidebarTab',

	props: {
		name: {
			type: String,
			default: '',
			required: true
		},
		icon: {
			type: String,
			default: '',
			required: true
		},
		order: {
			type: Number,
			default: 0,
			required: false
		}
	},

	computed: {
		id() {
			return this.name.toLowerCase().replace(/ /g, '-')
		},
		isActive() {
			return this.$parent.activeTab === this.id
		}
	}
}
</script>

<style lang="scss" scoped>
section {
	padding: 10px;
	min-height: 100%; // fill available height
	&:focus {
		border-color: var(--color-primary);
		box-shadow: 0 0 0.2em var(--color-primary);
		outline: 0;
	}
}
</style>
