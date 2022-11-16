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
Note: the inner html `input` element inherits all the attributes from the
NcTextField component so you can add things like `autocomplete`, `maxlength`
and `minlength`.

```
<template>
	<div class="wrapper">
		<NcTextField :value.sync="text1"
			label="Leading icon and clear trailing button"
			trailing-button-icon="close"
			:show-trailing-button="text1 !== ''"
			@trailing-button-click="clearText">
			<Magnify :size="16" />
		</NcTextField>
		<NcTextField :value.sync="text2"
			label="Success state"
			:success="true"
			@trailing-button-click="clearText">
		</NcTextField>
		<NcTextField :value.sync="text3"
			label="Error state"
			:error="true"
			@trailing-button-click="clearText">
		</NcTextField>
		<NcTextField :value.sync="text4"
			label="Internal label"
			placeholder="That can be used together with placeholder"
			:label-visible="true"
			trailing-button-icon="close"
			:show-trailing-button="text4 !== ''"
			@trailing-button-click="clearText">
			<Lock :size="16" />
		</NcTextField>
		<div class="external-label">
			<label for="textField">External label</label>
			<NcTextField :value.sync="text5"
				id="textField"
				:label-outside="true"
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
	<NcInputField v-bind="{...$attrs, ...$props }"
		ref="inputField"
		:trailing-button-label="clearTextLabel"
		v-on="$listeners"
		@input="handleInput">
		<!-- Default slot for the leading icon -->
		<slot />

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

	// Allow forwarding all attributes
	inheritAttrs: false,

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
		handleInput(event) {
			this.$emit('update:value', event.target.value)
		},
	},
}
</script>
