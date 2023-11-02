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
### Usage

 ```
 <template>
	<NcAppNavigationNew text="New Element">
		<template #icon>
			<Plus :size="20" />
		</template>
	</NcAppNavigationNew>
 </template>
 <script>
 import Plus from 'vue-material-design-icons/Plus'

 export default {
	components: {
		Plus,
	},
 }
 </script>
 ```
 </docs>

<template>
	<div class="app-navigation-new">
		<NcButton :id="buttonId"
			:disabled="disabled"
			:type="type"
			@click="$emit('click')">
			<template #icon>
				<slot name="icon" />
			</template>
			{{ text }}
		</NcButton>
	</div>
</template>

<script>
import NcButton from '../NcButton/index.js'

export default {
	components: {
		NcButton,
	},
	props: {
		buttonId: {
			type: String,
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
		type: {
			type: String,
			default: 'primary',
			validator(value) {
				return ['primary', 'secondary', 'tertiary'].indexOf(value) !== -1
			},
		},
	},

	emits: ['click'],
}
</script>

<style lang="scss" scoped>
/* 'New' button */
.app-navigation-new {
	display: block;
	padding: calc(var(--default-grid-baseline, 4px) * 2);
	button {
		width: 100%;
	}
}
</style>
