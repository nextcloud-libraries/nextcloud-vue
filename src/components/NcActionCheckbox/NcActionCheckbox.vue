<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to be used inside of the [NcActions](#NcActions) component slots.

```vue
<template>
	<NcActions>
		<NcActionCheckbox @change="log('(un)checked !')">First choice</NcActionCheckbox>
		<NcActionCheckbox value="second" @change="log('(un)checked !')">Second choice</NcActionCheckbox>
		<NcActionCheckbox v-model="checkboxValue" @change="log('(un)checked !')">Third choice (checked)</NcActionCheckbox>
		<NcActionCheckbox :disabled="true" @change="log('(un)checked !')">Second choice (disabled)</NcActionCheckbox>
	</NcActions>
</template>

<script>
export default {
	data() {
		return {
			checkboxValue: true,
		}
	},

	methods: {
		log: console.log,
	},
}
</script>
```
</docs>

<template>
	<li class="action" :class="{ 'action--disabled': disabled }" :role="isInSemanticMenu && 'presentation'">
		<label class="action-checkbox" :role="isInSemanticMenu && 'menuitemcheckbox'" :aria-checked="isInSemanticMenu && localModel.toString()">
			<span class="action-checkbox__icon">
				<input
					:id="id"
					v-model="localModel"
					type="checkbox"
					class="action-checkbox__input"
					:class="{ focusable: !disabled }"
					:value="value"
					:disabled="disabled"
					@change="onChange">
				<NcIconSvgWrapper :path="localModel ? mdiCheckboxMarked : mdiCheckboxBlankOutline" :size="20" />
			</span>
			<span class="action-checkbox__text">{{ text }}</span>
		</label>
	</li>
</template>

<script>
import { mdiCheckboxBlankOutline, mdiCheckboxMarked } from '@mdi/js'
import { ref, watch } from 'vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { useModelMigration } from '../../composables/useModelMigration.ts'
import ActionGlobalMixin from '../../mixins/actionGlobal.js'
import GenRandomId from '../../utils/GenRandomId.js'

export default {
	name: 'NcActionCheckbox',

	components: {
		NcIconSvgWrapper,
	},

	mixins: [ActionGlobalMixin],

	inject: {
		isInSemanticMenu: {
			from: 'NcActions:isSemanticMenu',
			default: false,
		},
	},

	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
	},

	props: {
		/**
		 * id attribute of the checkbox element
		 */
		id: {
			type: String,
			default: () => 'action-' + GenRandomId(),
			validator: (id) => id.trim() !== '',
		},

		/**
		 * Removed in v9 - use `modelValue` (`v-model`) instead
		 *
		 * @deprecated
		 */
		checked: {
			type: Boolean,
			// eslint-disable-next-line vue/no-boolean-default
			default: undefined,
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
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 *
		 * @deprecated
		 */
		'update:checked',
		/**
		 * Emitted when the checkbox state is changed
		 *
		 * @type {boolean}
		 */
		'update:modelValue',
		/** Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
	],

	setup() {
		const model = useModelMigration('checked', 'update:checked')

		// For backward compatibility to support using without v-model binding (passive model)
		const localModel = ref(model.value)
		watch(model, (newValue) => (localModel.value = newValue), { flush: 'sync' })
		watch(localModel, (newValue) => (model.value = newValue), { flush: 'sync' })

		return {
			localModel,
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
