<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to be used inside of the [NcActions](#NcActions) component slots.

```vue
	<NcActions>
		<NcActionCheckbox @change="console.log('(un)checked !')">First choice</NcActionCheckbox>
		<NcActionCheckbox value="second" @change="console.log('(un)checked !')">Second choice</NcActionCheckbox>
		<NcActionCheckbox :model-value="true" @change="console.log('(un)checked !')">Third choice (checked)</NcActionCheckbox>
		<NcActionCheckbox :disabled="true" @change="console.log('(un)checked !')">Second choice (disabled)</NcActionCheckbox>
	</NcActions>
```
</docs>

<template>
	<li class="action" :class="{ 'action--disabled': disabled }" :role="isInSemanticMenu && 'presentation'">
		<label class="action-checkbox" :role="isInSemanticMenu && 'menuitemcheckbox'" :aria-checked="isInSemanticMenu && model.toString()">
			<span class="action-checkbox__icon">
				<input
					:id
					v-model="model"
					type="checkbox"
					class="action-checkbox__input"
					:class="{ focusable: !disabled }"
					:value
					:disabled
					@change="onChange">
				<NcIconSvgWrapper :path="model ? mdiCheckboxMarked : mdiCheckboxBlankOutline" :size="20" />
			</span>
			<span class="action-checkbox__text">{{ text }}</span>
		</label>
	</li>
</template>

<script>
import { mdiCheckboxBlankOutline, mdiCheckboxMarked } from '@mdi/js'
import { useModel } from 'vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import ActionGlobalMixin from '../../mixins/actionGlobal.js'
import { createElementId } from '../../utils/createElementId.ts'
import { NC_ACTIONS_IS_SEMANTIC_MENU } from '../NcActions/useNcActions.ts'

export default {
	name: 'NcActionCheckbox',

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
		 * id attribute of the checkbox element
		 */
		id: {
			type: String,
			default: () => 'action-' + createElementId(),
			validator: (id) => id.trim() !== '',
		},

		/**
		 * checked state of the the checkbox element
		 */
		modelValue: {
			type: Boolean,
			default: false,
		},

		/**
		 * value of the checkbox input
		 */
		value: {
			type: [String, Number],
			default: '',
		},

		/**
		 * disabled state of the checkbox element
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		/** Native change event */
		'change',
		/** Checkbox is checked */
		'check',
		/** Checkbox is unchecked */
		'uncheck',
		/** Model value changed */
		'update:modelValue',
	],

	setup(props) {
		const model = useModel(props, 'modelValue')
		return {
			model,
			mdiCheckboxBlankOutline,
			mdiCheckboxMarked,
		}
	},

	methods: {
		onChange(event) {
			this.$emit('change', event)
			if (event.target.checked) {
				this.$emit('check')
			} else {
				this.$emit('uncheck')
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@use '../../assets/action.scss' as *;
@include action-active;
@include action--disabled;
@include action-item('checkbox');

.action:has(:focus-visible) {
	outline: 2px solid currentColor;
}

.action-checkbox {
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
