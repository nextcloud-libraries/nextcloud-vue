<!--
  - @copyright Copyright (c) 2022 Marco Ambrosini <marcoambrosini@pm.me>
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
-->

<docs>
### Description
See [NcInputField](#/Components/NcFields?id=ncinputfield) for a list of all available props.

General purpose text field component.
It is recommended to not only provide a placeholder, but also a label.
The label should describe what input is expected and the placehold what format the input should have.

Note: the inner html `input` element inherits all the attributes from the
NcTextField component so you can add things like `autocomplete`, `maxlength`
and `minlength`.

```
<template>
	<div class="wrapper">
		<NcTextField v-model:value="text1"
			label="Leading icon and clear trailing button"
			trailing-button-icon="close"
			:show-trailing-button="text1 !== ''"
			@trailing-button-click="clearText">
			<template #icon>
				<Magnify :size="20" />
			</template>
		</NcTextField>
		<NcTextField :value.sync="text4"
			label="Internal label"
			placeholder="That can be used together with placeholder"
			trailing-button-icon="close"
			:show-trailing-button="text4 !== ''"
			@trailing-button-click="clearText">
			<template #icon>
				<Lock :size="20" />
			</template>
		</NcTextField>
		<NcTextField v-model:value="text2"
			label="Success state"
			placeholder="Placeholders are possible"
			:success="true"
			@trailing-button-click="clearText">
		</NcTextField>
		<NcTextField v-model:value="text3"
			label="Error state"
			placeholder="Enter something valid"
			:error="true"
			@trailing-button-click="clearText">
		</NcTextField>
		<NcTextField :value=""
			label="Disabled"
			:disabled="true" />
		<NcTextField :value=""
			label="Disabled + Success"
			:success="true"
			:disabled="true" />
		<div class="external-label">
			<label for="textField">External label</label>
			<NcTextField v-model:value="text5"
				id="textField"
				:label-outside="true"
				placeholder="Input with external label"
				@trailing-button-click="clearText" />
		</div>
	</div>
</template>
<script>
import Magnify from 'vue-material-design-icons/Magnify'
import Lock from 'vue-material-design-icons/Lock'
import Close from 'vue-material-design-icons/Close'

export default {
	data() {
		return {
			text1: '',
			text2: '',
			text3: '',
			text4: '',
			text5: '',
		}
	},

	components: {
		Magnify,
		Lock,
		Close,
	},

	methods: {
		clearText() {
			this.text1 = ''
			this.text3 = ''
		}
	}
}
</script>
<style lang="scss" scoped>
.wrapper {
	display: flex;
	gap: 4px;
	align-items: flex-end;
	flex-wrap: wrap;
}

.external-label {
	display: flex;
	width: 100%;
	margin-top: 1rem;
}

.external-label label {
	padding-top: 7px;
	padding-right: 14px;
	white-space: nowrap;
}
</style>
```
</docs>

<template>
	<NcInputField v-bind="$props"
		ref="inputField"
		:trailing-button-label="clearTextLabel"
		@input="handleInput">
		<template v-if="!!$slots.icon" #icon>
			<!-- Default slot for the leading icon -->
			<slot name="icon" />
		</template>

		<!-- Trailing icon slot, except for search type input as the browser already adds a trailing close icon -->
		<template v-if="type !== 'search'" #trailing-button-icon>
			<Close v-if="trailingButtonIcon === 'close'" :size="20" />
			<ArrowRight v-else-if="trailingButtonIcon === 'arrowRight'" :size="20" />
			<Undo v-else-if="trailingButtonIcon === 'undo'" :size="20" />
		</template>
	</NcInputField>
</template>

<script>

import NcInputField from '../NcInputField/NcInputField.vue'

import Close from 'vue-material-design-icons/Close.vue'
import ArrowRight from 'vue-material-design-icons/ArrowRight.vue'
import Undo from 'vue-material-design-icons/UndoVariant.vue'

import { t } from '../../l10n.js'

export default {
	name: 'NcTextField',

	components: {
		NcInputField,
		Close,
		ArrowRight,
		Undo,
	},

	props: {
		...NcInputField.props,

		/**
		 * Specifies which material design icon should be used for the trailing
		 * button. Value can be `close`, `arrowRight`, or `undo`.
		 */
		trailingButtonIcon: {
			type: String,
			default: 'close',
			validator: (value) => [
				'close',
				'arrowRight',
				'undo',
			].includes(value),
		},
	},

	emits: [
		'update:value',
	],

	computed: {
		clearTextLabel() {
			return this.trailingButtonLabel || t('Clear text')
		},
	},

	methods: {
		/**
		 * Focus the input element
		 *
		 * @public
		 */
		focus() {
			this.$refs.inputField.focus()
		},

		/**
		 * Select all the text in the input
		 *
		 * @public
		 */
		select() {
			this.$refs.inputField.select()
		},

		handleInput(event) {
			this.$emit('update:value', event.target.value)
		},
	},
}
</script>
