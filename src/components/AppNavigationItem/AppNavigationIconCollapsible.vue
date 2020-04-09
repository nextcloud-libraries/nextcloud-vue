<!--
 - @copyright Copyright (c) 2019 Marco Ambrosini <marcoambrosini@pm.me>
 -
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
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<template>
	<!-- Button to expand or collapse children -->
	<button
		class="icon-collapse"
		:class="{'icon-collapse--rotated':open}"
		@click="onClick" />
</template>

<script>
export default {
	name: 'AppNavigationIconCollapsible',

	props: {
		open: {
			type: Boolean,
			default: true,
		},
	},

	methods: {
		onClick(e) {
			this.$emit('click', e)
		},
	},

}
</script>

<style lang="scss" scoped>
@import '../../fonts/scss/iconfont-vue';

.icon-collapse {
	position: absolute;
	z-index: 105; // above a, under button
	width: 44px;
	height: 44px;
	margin: 0;
	padding: 0;
	transition: opacity var(--animation-quick) ease-in-out;
	-webkit-transform: rotate(-90deg);
	-ms-transform: rotate(-90deg);
	transform: rotate(-90deg);
	color: var(--color-main-text);
	border: none;
	border-radius: 0;
	outline: none !important;
	background-color: transparent;
	box-shadow: none;
	font-size: 18px;

	@include iconfont('triangle-s');

	&:hover{
		color: var(--color-primary);
	}
	&--rotated {
		-webkit-transform: rotate(0deg);
		-ms-transform: rotate(0deg);
		transform: rotate(0deg);
		color: var(--color-main-text);
		&:hover{
			color: var(--color-primary);
		}
	}
}

</style>
