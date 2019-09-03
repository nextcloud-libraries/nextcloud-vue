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
	<div class='color-picker'>
		<div v-if='!advanced' class="color-picker-simple">

		</div>

		<Chrome v-else class="color-picker-advanced" v-model="color"
			:disableAlpha='true'
			:disableFields='true' />
		<div class="color-picker-navigation">
			<button class="color-picker-navigation-button back"><label>prev</label></button>
			<button class="color-picker-navigation-button chosecolor"><label>confirm</label></button>
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
			advanced: true
		}
	}
}

</script>

<style lang="scss" scoped>

.color-picker {
	width: 255px;
	height:240px;
	margin: 100px;
	box-shadow: 0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3);
	padding: 16px;
	border-radius: 3px;
	&-advanced {
		box-shadow: none !important;
	}
	&-navigation {
		margin: 15px 0 15px 0;
		display: flex;
		flex-direction: row;
		&-button {
			justify-self: flex-end;
		}
	}

}

::v-deep .vc-chrome-color-wrap {
	display: none;
}

::v-deep .vc-chrome-body {
	padding: 16px 0 0 0;
}

::v-deep .vc-hue.vc-hue--horizontal {
	height: 16px;
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
	height: 16px;
	border-radius: 3px;
	border: 1px solid black;
	transform: translate(-6px, -1px);
	background-color: transparent;
	box-shadow: none;
}

</style>
