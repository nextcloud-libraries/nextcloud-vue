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
		<transition name="advancedSlide">
			<div v-if="!advanced" class="color-picker-simple">
				<button v-for="simpleColor in palette" :key="simpleColor.id"
					:style="{'background-color': simpleColor.hex}"
					class="color-picker-simple-color-circle"
					@click="handleSimpleClick(simpleColor)"
					:class="{ 'color-picker-simple-color-circle--active' : simpleColor === color }" />
			</div>
		</transition>
		<transition name="advancedSlide">
			<Chrome v-if="advanced" v-model="color" class="color-picker-advanced"
				:disable-alpha="true"
				:disable-fields="true" />
		</transition>
		<div class="color-picker-navigation">
			<button v-if="advanced" class="color-picker-navigation-button back"
				@click='handleBack' />
			<button v-if="advanced" class="color-picker-navigation-button confirm"
				@click='handleConfirm' />
			<button v-if="!advanced" class="color-picker-navigation-button more-settings"
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
			palette: [{ hex: '#CFCFCF', id: 0 }, { hex: '#CFCFCF', id: 1 }, { hex: '#CFCFCF', id: 2 }, { hex: '#CFCFCF', id: 3 }, { hex: '#CFCFCF', id: 4 }, { hex: '#CFCFCF', id: 5 }, { hex: '#CFCFCF', id: 6 }, { hex: '#CFCFCF', id: 7 }, { hex: '#CFCFCF', id: 8 }, { hex: '#CFCFCF', id: 9 }, { hex: '#CFCFCF', id: 10 }, { hex: '#CFCFCF', id: 11 }, { hex: '#CFCFCF', id: 2 }, { hex: '#CFCFCF', id: 13 }, { hex: '#CFCFCF', id: 14 }, { hex: '#CFCFCF', id: 15 }]
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
	width: 164px;
	height: 208px;
	margin: 100px;
	box-shadow: 0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3);
	padding: 16px;
	border-radius: 3px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-content: flex-end;
	overflow: hidden;
	box-sizing: content-box !important;
	&-simple {
		display: grid;
		grid-template-columns: repeat(4, 41px);
		grid-template-rows: repeat(4, 41px);
		&-color-circle {
			width: 27px;
			height: 27px;
			min-height: 27px;
			border-radius: 13px;
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

::v-deep .vc-chrome {
	width: 164px;
}

::v-deep .vc-chrome-color-wrap {
	display: none;
}

::v-deep .vc-chrome-body {
	padding: 15px 0 0 0;
}

::v-deep .vc-hue.vc-hue--horizontal {
	height: 15px;
}

::v-deep .vc-chrome-saturation-wrap {
	border-radius: 3px;
}

::v-deep .vc-saturation-circle {
	width: 20px;
	height: 20px;
}

::v-deep .vc-chrome-hue-wrap .vc-hue-picker {
	width: 10px;
	height: 15px;
	border-radius: 3px;
	border: 1px solid black;
	transform: translate(-6px, -1px);
	background-color: transparent;
	box-shadow: none;
}

.advancedSlide-enter {
	transform: translateX(50%);
	opacity: 0;
}

.advancedSlide-enter-to {
	transform: translateX(0);
	opacity: 1;
}

.advancedSlide-leave {
	transform: translateX(0);
	opacity: 1;
}

.advancedSlide-leave-to {
	transform: translateX(50%);
	opacity: 0;
}

.advancedSlide-enter-active,
.advancedSlide-leave-active {
	transition: all 0.1s ease-in-out;
}

.simpleSlide-enter {
	transform: translateX(-50%);
	opacity: 0;
}

.simpleSlide-enter-to {
	transform: translateX(0);
	opacity: 1;
}

.simpleSlide-leave {
	transform: translateX(0);
	opacity: 1;
}

.simpleSlide-leave-to {
	transform: translateX(-50%);
	opacity: 0;
}

.simpleSlide-enter-active,
.simpleSlide-leave-active {
	transition: all 0.1s ease-in-out;
}

</style>
