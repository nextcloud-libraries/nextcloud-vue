<!--
 - @copyright Copyright (c) 2019 Christoph Wurst <christoph@winzerhof-wurst.at>
 -
 - @author Christoph Wurst <christoph@winzerhof-wurst.at>
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
	<div id="app-navigation" class="vue">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'AppNavigation',
}
</script>

<style lang="scss" scoped>
@import '../assets/variables.scss';

#app-navigation {
	will-change: transform;
	transition: transform var(--animation-quick);
	width: $navigation-width;
	position: fixed;
	top: $header-height;
	left: 0;
	z-index: 500;
	overflow-y: auto;
	overflow-x: hidden;
	// Do not use vh because of mobile headers
	// are included in the calculation
	height: calc(100% - #{$header-height});
	box-sizing: border-box;
	background-color: var(--color-main-background);
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	border-right: 1px solid var(--color-border);
	display: flex;
	flex-direction: column;
	flex-grow: 0;
	flex-shrink: 0;
}

//list of navigation items
ul {
	position: relative;
	height: 100%;
	width: inherit;
	overflow-x: hidden;
	overflow-y: auto;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

// mobile view only
@media only screen and (max-width: $breakpoint-mobile) {
	// if navigation is shown
	.nav-open #app-navigation {
		transform: translateX(0);
	}
}
</style>
