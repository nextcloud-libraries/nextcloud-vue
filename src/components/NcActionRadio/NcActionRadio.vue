<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to be used inside of the [NcActions](#NcActions) component slots.
Usually, you will provide a name prop to bind the radio together.
So that only one of each name set can be selected at the same time.

```vue
<template>
	<div>
		<NcActions>
			<NcActionRadio v-for="option in radioOptions"
				:key="option.value"
				:value="option.value"
				:disabled="option.disabled"
				name="uniqueId"
				v-model="radioValue">
				{{ option.label }}
			</NcActionRadio>
		</NcActions>
		<span>Selected value: {{ radioValue }}</span>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				radioOptions: [
					{ value: 'first', label: 'First choise', disabled: false },
					{ value: 'second', label: 'Second choise', disabled: false },
					{ value: 'third', label: 'Third choise', disabled: false },
					{ value: 'fourth', label: 'Fourth choise (disabled)', disabled: true },
				],
				radioValue: 'first',
			}
		},
	}
</script>
```
</docs>

<template>
	<li class="action" :class="{ 'action--disabled': disabled }" :role="isInSemanticMenu && 'presentation'">
		<label class="action-radio" :role="isInSemanticMenu && 'menuitemradio'" :aria-checked="isInSemanticMenu && checked.toString()">
			<span class="action-radio__icon">
				<input
					:id
					v-model="model"
					type="radio"
					class="action-radio__input"
					:class="{ focusable: !disabled }"
					:value
					:name
					:disabled
					@change="$emit('change', $event)">
				<NcIconSvgWrapper :path="checked ? mdiRadioboxMarked : mdiRadioboxBlank" :size="20" />
			</span>
			<span class="action-radio__text">{{ text }}</span>
		</label>
	</li>
</template>

<script>
import { mdiRadioboxBlank, mdiRadioboxMarked } from '@mdi/js'
import { useModel } from 'vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import ActionGlobalMixin from '../../mixins/actionGlobal.js'
import { createElementId } from '../../utils/createElementId.ts'
import { NC_ACTIONS_IS_SEMANTIC_MENU } from '../NcActions/useNcActions.ts'

export default {
	name: 'NcActionRadio',

	components: {
		NcIconSvgWrapper,
	},

	mixins: [ActionGlobalMixin],

	inject: {
		isInSemanticMenu: {
			from: NC_ACTIONS_IS_SEMANTIC_MENU,
			default: false,
		},
	},

	props: {
		/**
		 * id attribute of the radio element
		 */
		id: {
			type: String,
			default: () => createElementId(),
			validator: (id) => id.trim() !== '',
		},

		/**
		 * checked state of the radio element
		 */
		modelValue: {
			type: [String, Number],
			default: '',
		},

		/**
		 * Define if this radio is part of a set.
		 * Checking the radio will disable all the
		 * others with the same name.
		 */
		name: {
			type: String,
			required: true,
		},

		/**
		 * value of the radio input
		 */
		value: {
			type: [String, Number],
			default: '',
		},

		/**
		 * disabled state of the radio element
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'change',
		'update:modelValue',
	],

	setup(props) {
		return {
			model: useModel(props, 'modelValue'),
			mdiRadioboxBlank,
			mdiRadioboxMarked,
		}
	},

	computed: {
		checked() {
			return this.model === this.value
		},
	},
}
</script>

<style lang="scss" scoped>
@use '../../assets/action.scss' as *;
@include action-active;
@include action--disabled;
@include action-item('radio');

.action:has(:focus-visible) {
	outline: 2px solid currentColor;
}

.action-radio {
	&__icon {
		color: var(--color-primary-element);
	}

	&__input {
		width: 20px;
		height: 20px;
		margin: auto;
		position: absolute;
		z-index: -1;
		opacity: 0 !important;
	}
}
</style>
