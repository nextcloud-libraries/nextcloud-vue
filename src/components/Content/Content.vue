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

<docs>

	### General description

	This component provides the default container of all apps.
	It _MUST_ be used as the main wrapper of your app.
	It includes the Navigation, the App content and the Sidebar.

	### Standard usage

	```vue
	<template>
		<Content app-name="forms">
			<AppNavigation>
				<AppNavigationItem title="My title" icon="icon-category-enabled">
			</AppNavigation>
			<AppContent>Your main app content here</AppContent>
			<AppSidebar title="cat-picture.jpg"></AppSidebar>
		</Content>
	</template>
	```

</docs>

<template>
	<div id="content-vue"
		:class="`app-${appName.toLowerCase()}`"
		class="content">
		<slot />
	</div>
</template>

<script>
export default {
	props: {
		appName: {
			type: String,
			required: true,
		},
	},
}
</script>

<style lang="scss" scoped>
.content {
	box-sizing: border-box;
	position: relative;
	display: flex;
	padding-top: 50px;
	min-height: 100%;
	::v-deep * {
		box-sizing: border-box;
	}
}
</style>
