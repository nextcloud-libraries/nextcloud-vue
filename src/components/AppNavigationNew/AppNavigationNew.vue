<!--
 - @copyright Copyright (c) 2018 Christoph Wurst <christoph@winzerhof-wurst.at>
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
	<div class="app-navigation-new">
		<button :id="buttonId"
			:class="buttonClass"
			type="button"
			:disabled="disabled"
			@click="$emit('click')">
			{{ text }}
		</button>
	</div>
</template>

<script>
export default {
	props: {
		buttonId: {
			type: String,
			required: false,
			default: '',
		},
		buttonClass: {
			type: [String, Array, Object],
			required: false,
			default: '',
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false,
		},
		text: {
			type: String,
			required: true,
		},
	},
}
</script>

 <style lang="scss" scoped>
/* 'New' button */
.app-navigation-new {
	display: block;
	padding: 10px;
	button {
		display: inline-block;
		width: 100%;
		padding: 10px;
		padding-left: 34px;
		background-position: 10px center;
		text-align: left;
		margin: 0;
	}
}
</style>
