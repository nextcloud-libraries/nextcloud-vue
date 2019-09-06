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
			color: '#194d33',
			advanced: false,
			palette: [{ hex: '#CFCFCF', id: 0 }, { hex: '#CFCFCF', id: 1 }, { hex: '#CFCFCF', id: 2 }, { hex: '#CFCFCF', id: 3 }, { hex: '#CFCFCF', id: 4 }, { hex: '#CFCFCF', id: 5 }, { hex: '#CFCFCF', id: 6 }, { hex: '#CFCFCF', id: 7 }, { hex: '#CFCFCF', id: 8 }, { hex: '#CFCFCF', id: 9 }, { hex: '#CFCFCF', id: 10 }, { hex: '#CFCFCF', id: 11 }, { hex: '#CFCFCF', id: 12 }, { hex: '#CFCFCF', id: 13 }, { hex: '#CFCFCF', id: 14 }, { hex: '#CFCFCF', id: 15 }]
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
		grid-template-rows: repeat(4, $clickable-area);
		&-color-circle {
			width: 28px;
			height: 28px;
			min-height: 28px;
			border-radius: 14px;
			margin:auto;
			padding: 0;
			&--active {
				@include iconfont('checkmark');
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
		margin-top: 5px;
		&-button {
			justify-self: flex-end;
			&.back{
				@include iconfont('arrow-left');
			}
			&.confirm {
				@include iconfont('checkmark');
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
		height: 176px;
		&-color-wrap {
			display: none;
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
	&-hue {
		&--horizontal {
			height: 16px;
		}
		&-picker {
			width: 10px !important;
			height: 14px !important;
			border-radius: 3px !important;
			border: 1px solid black !important;
			transform: translate(-6px, -1px) !important;
			background-color: transparent !important;
			box-shadow: none !important;
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
		transition: all 60ms ease-in-out;
	}
}

</style>
