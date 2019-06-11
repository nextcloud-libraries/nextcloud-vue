<!--
 - @copyright Copyright (c) 2019 Christoph Wurst <christoph@winzerhof-wurst.at>
 -
 - @author Christoph Wurst <christoph@winzerhof-wurst.at>
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
	<a id="app-navigation-toggle" tabindex="0" href="#"
		@click.prevent="emitClick" @keydown.space.exact.prevent="emitClick" />
</template>

<script>
export default {
	name: 'AppNavigationToggle',
	methods: {
		emitClick() {
			this.$emit('click')
		}
	}
}
</script>

<style scoped lang="scss">
@import '~Fonts/scss/iconfont-vue';

#app-navigation-toggle {
	display: none;
	position: fixed;
	z-index: 1050; // above app-content
	left: 0;
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
// mobile only
@media only screen and (max-width: 768px) {
	#app-navigation-toggle {
		display: inline-block !important;
	}
}
</style>
