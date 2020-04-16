<!--
 - @copyright Copyright (c) 2019 Christoph Wurst <christoph@winzerhof-wurst.at>
 -
 - @author Christoph Wurst <christoph@winzerhof-wurst.at>
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 - @author Marco Ambrosini <marcoambrosini@pm.me>
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
	<a class="app-navigation-toggle"
		href="#"
		:aria-expanded="open"
		aria-controls="app-navigation-vue"
		@click.prevent="toggleNavigation"
		@keydown.space.exact.prevent="toggleNavigation" />
</template>

<script>
export default {

	name: 'AppNavigationToggle',

	props: {
		open: {
			type: Boolean,
			required: true,
		},
	},

	methods: {
		toggleNavigation() {
			this.$emit('update:open', !this.open)
		},
	},
}
</script>

<style scoped lang="scss">
@import '../../fonts/scss/iconfont-vue';

.app-navigation-toggle {
	position: absolute;
	top: 0;
	right: 0;
	margin-right: - $clickable-area;
	width: $clickable-area;
	height: $clickable-area;
	padding: $icon-margin;

	cursor: pointer;
	opacity: 0.6;

	font-size: $icon-size;
	line-height: 17px;
	@include iconfont('menu');

	&:hover,
	&:focus {
		opacity: $opacity_full;
	}
}

</style>
