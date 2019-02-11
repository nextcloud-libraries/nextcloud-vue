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
	<div id="content" :class="'app-' + appName">
		<div v-if="$slots['navigation'] !== undefined"
			id="app-navigation"
			:class="navigationClass">
			<slot name="navigation" />
		</div>
		<div v-if="$slots['content'] !== undefined"
			id="app-content"
			:class="contentClass">
			<slot name="content" />
		</div>
		<slot />
		<div v-if="$slots['sidebar'] !== undefined"
			id="app-sidebar">
			<slot name="sidebar" />
		</div>
	</div>
</template>

<script>
export default {
	props: {
		appName: {
			type: String,
			required: true
		},
		navigationClass: {
			type: [String, Array, Object],
			required: false,
			default: ''
		},
		contentClass: {
			type: [String, Array, Object],
			required: false,
			default: ''
		}
	}
}
</script>
