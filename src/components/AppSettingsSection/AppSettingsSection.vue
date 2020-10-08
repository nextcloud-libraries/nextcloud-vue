<!--
 - @copyright Copyright (c) 2020 Marco Ambrosini <marcoambrosini@pm.me>
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
 -->`

<template>
	<div :id="id" class="app-settings-section">
		<h3 :id="title"
			class="app-settings-section__title">
			{{ title }}
		</h3>
		<slot />
	</div>
</template>

<script>
export default {
	name: 'AppSettingsSection',

	props: {
		title: {
			type: String,
			required: true,
		},
	},
	computed: {
		// generate an id for each settingssection based on the title without whitespaces
		id() {
			return 'settings-section_' + this.title.replace(/\s+/g, '')
		},
	},
}

</script>

<style lang="scss" scoped>
.app-settings-section {
	margin-bottom: 80px;
	&__title {
		font-size: 20px;
		font-weight: bold;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}
</style>
