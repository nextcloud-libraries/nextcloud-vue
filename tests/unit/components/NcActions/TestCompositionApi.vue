<!--
  - @copyright Copyright (c) 2023 Ferdinand Thiessen <rpm@fthiessen.de>
  -
  - @author Ferdinand Thiessen <rpm@fthiessen.de>
  -
  - @license AGPL-3.0-or-later
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

<!-- Ensure NcActions work with Composition API components (nextcloud/nextcloud-vue#3719) -->

<template>
	<NcActions :force-menu="true">
		<NcActionButton />
	</NcActions>
</template>

<script setup>
import NcActions from '../../../../src/components/NcActions/NcActions.vue'
import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'
</script>
