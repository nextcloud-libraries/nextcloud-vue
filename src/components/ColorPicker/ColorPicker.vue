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

 <docs>
</docs>

<template>
	<div class="color-picker">
		<transition name="slide" mode="out-in">
			<div v-if="!advanced" class="color-picker-simple">
				<button
					v-for="simpleColor in palette"
					:key="simpleColor.id"
					:style="{'background-color': simpleColor.hex}"
					class="color-picker-simple-color-circle"
					@click="handleSimpleClick(simpleColor)"
					:class="{ 'color-picker-simple-color-circle--active' : simpleColor === color }" />
			</div>
			<Chrome
				v-if="advanced"
				v-model="color"
				class="color-picker-advanced"
				:disable-alpha="true"
				:disable-fields="true" />
		</transition>
		<div class="color-picker-navigation">
			<button
				v-if="advanced"
				class="color-picker-navigation-button back"
				@click='handleBack' />
			<button
				v-if="advanced"
				class="color-picker-navigation-button confirm"
				@click='handleConfirm' />
			<button
				v-if="!advanced"
				class="color-picker-navigation-button more-settings"
				@click='handleMoreSettings' />
		</div>
	</div>
</template>

<script>
import { Chrome } from 'vue-color'

export default {
	name: 'ColorPicker',
	components: {
		Chrome
	},

	data() {
		return {
			color: '#FF5722',
			advanced: false,
			palette: [{ hex: '#FF5722', id: 0 }, { hex: '#3F51B5', id: 1 }, { hex: '#009688', id: 2 }, { hex: '#FFEB3B', id: 3 }, { hex: '#E91E63', id: 4 }, { hex: '#2196F3', id: 5 }, { hex: '#4CAF50', id: 6 }, { hex: '#FF9800', id: 7 }, { hex: '#9C27B0', id: 8 }, { hex: '#00BCD4', id: 9 }, { hex: '#CDDC39', id: 10 }, { hex: '#795548', id: 11 }]
		}
	},

	methods: {
		handleConfirm() {
			alert(`You've chosen the color ${this.color.hex}`)
		},
		handleBack() {
			this.advanced = false
		},
		handleMoreSettings() {
			this.advanced = true
		},
		handleSimpleClick(simpleColor) {
			this.color = simpleColor
		}
	}
}

</script>

<style lang="scss" scoped>
@import '~Fonts/scss/iconfont-vue';

.color-picker {
	width: 176px;
	margin: 100px;
	box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.25);
	padding: 14px;
	border-radius: 3px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-content: flex-end;
	overflow: hidden;
	box-sizing: content-box !important;
	&-simple {
		display: grid;
		grid-template-columns: repeat(4, $clickable-area);
		grid-template-rows: repeat(3, $clickable-area);
		&-color-circle {
			width: 34px;
			height: 34px;
			min-height: 34px;
			border-radius: 17px;
			color: white;
			margin:auto;
			padding: 0;
			font-size: 16px;
			border: none;
			display: flex;
			align-content: center;
			justify-content: center;
			&:hover {
				opacity: 0.6;
			}
			&--active {
				@include iconfont('checkmark');
				opacity: 1 !important;
			}
		}
	}
	&-advanced {
		box-shadow: none !important;
	}
	&-navigation {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 10px;
		&-button {
			width: $clickable-area;
			height: $clickable-area;
			border-radius: calc($clickable-area/2);
			border: none;
			background: none;
			justify-self: flex-end;
			font-size: $icon-size;
			padding: 0;
			margin: 0;
			display: flex;
			align-content: center;
			justify-content: center;
			&:hover {
				background-color: $icon-focus-bg;
			}
			&.back{
				@include iconfont('arrow-left');
			}
			&.confirm {
				@include iconfont('checkmark');
				color: white;
				background-color: var(--color-primary);
				&:hover {
					background-color: var(--color-primary-element-light);
				}
			}
			&.more-settings {
				@include iconfont('more');
				margin-left: auto;
			}
		}
	}
}

::v-deep .vc {
	&-chrome {
		width: 176px;
		height: 132px;
		&-color-wrap {
			width: 30px;
			height: 30px;
		}
		&-active-color {
			height: 34px;
			width: 34px;
			border-radius: 17px;
		}
		&-body {
			padding: 14px 0 0 0;
		}
		&-saturation {
			&-wrap {
				border-radius: 3px;
			}
			&-circle {
				width: 20px;
				height: 20px;
			}
		}
	}
}

.slide {
	&-enter {
		transform: translateY(-50%);
		opacity: 0;
	}
	&-enter-to {
		transform: translateY(0);
		opacity: 1;
	}&-leave {
		transform: translateY(0);
		opacity: 1;
	}&-leave-to {
		transform: translateY(-50%);
		opacity: 0;
	}&-enter-active, &-leave-active {
		transition: all 80ms ease-in-out;
	}
}

</style>
