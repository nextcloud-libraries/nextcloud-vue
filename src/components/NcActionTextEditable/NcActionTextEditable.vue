<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to be used inside of the [Actions](#Actions) component slots.
All undocumented attributes will be bound to the textarea. e.g. `maxlength`

```
<template>
	<NcActions>
		<NcActionTextEditable model-value="This is a textarea">
			<template #icon>
				<Pencil :size="20" />
			</template>
		</NcActionTextEditable>
		<NcActionTextEditable :disabled="true" model-value="This is a disabled textarea">
			<template #icon>
				<Pencil :size="20" />
			</template>
		</NcActionTextEditable>
		<NcActionTextEditable name="Please edit the text" model-value="This is a textarea with name">
			<template #icon>
				<Pencil :size="20" />
			</template>
		</NcActionTextEditable>
	</NcActions>
</template>
<script>
import Pencil from 'vue-material-design-icons/Pencil'

export default {
	components: {
		Pencil,
	},
}
</script>
```
</docs>

<template>
	<li class="action" :class="{ 'action--disabled': disabled }">
		<span class="action-text-editable"
			@click="onClick">
			<!-- @slot Manually provide icon -->
			<slot name="icon">
				<span :class="[isIconUrl ? 'action-text-editable__icon--url' : icon]"
					:style="{ backgroundImage: isIconUrl ? `url(${icon})` : null }"
					class="action-text-editable__icon" />
			</slot>

			<!-- form and input -->
			<form ref="form"
				class="action-text-editable__form"
				:disabled="disabled"
				@submit.prevent="onSubmit">
				<input :id="id" type="submit" class="action-text-editable__submit">

				<!-- name -->
				<label v-if="name"
					class="action-text-editable__name"
					:for="computedId">
					{{ name }}
				</label>

				<textarea :id="computedId"
					:disabled="disabled"
					:value="modelValue"
					v-bind="$attrs"
					:class="['action-text-editable__textarea', { focusable: isFocusable }]"
					@input="onInput" />

				<!-- allow the custom font to inject a ::before
					not possible on input[type=submit] -->
				<label v-show="!disabled" :for="id" class="action-text-editable__label">
					<NcIconSvgWrapper directional :path="mdiArrowRight" />
				</label>
			</form>
		</span>
	</li>
</template>

<script>
import { mdiArrowRight } from '@mdi/js'
import { createElementId } from '../../utils/createElementId.ts'

import ActionTextMixin from '../../mixins/actionText.js'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.js'

export default {
	name: 'NcActionTextEditable',

	components: {
		NcIconSvgWrapper,
	},

	mixins: [ActionTextMixin],

	props: {
		/**
		 * id attribute of the checkbox element
		 */
		id: {
			type: String,
			default: () => 'action-' + createElementId(),
			validator: id => id.trim() !== '',
		},
		/**
		 * disabled state of the text area
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
		/**
		 * value attribute of the input field
		 */
		modelValue: {
			type: String,
			default: '',
		},
	},

	emits: [
		'input',
		'update:modelValue',
		'submit',
	],

	setup() {
		return {
			mdiArrowRight,
		}
	},

	computed: {
		/**
		 * determines if the action is focusable
		 *
		 * @return {boolean} is the action focusable ?
		 */
		isFocusable() {
			return !this.disabled
		},

		computedId() {
			return createElementId()
		},
	},

	methods: {
		onInput(event) {
			/**
			 * Emitted on input events of the text field
			 *
			 * @type {Event|Date}
			 */
			this.$emit('input', event)
			/**
			 * Emitted when the inputs value changes
			 *
			 * @type {string|Date}
			 */
			this.$emit('update:modelValue', event.target.value)
		},
		onSubmit(event) {
			event.preventDefault()
			event.stopPropagation()
			if (!this.disabled) {
				/**
				 * Emitted on submit of the input field
				 *
				 * @type {Event}
				 */
				this.$emit('submit', event)
			} else {
				// ignore submit
				return false
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@use '../../assets/inputs.scss';
@use '../../assets/action.scss' as *;
@include action-active;
@include action--disabled;

$input-margin: 4px;

.action-text-editable {
	display: flex;
	align-items: flex-start;

	width: 100%;
	height: auto;
	margin: 0;
	padding: 0;

	cursor: pointer;
	white-space: nowrap;

	color: var(--color-main-text);
	border: 0;
	border-radius: 0; // otherwise Safari will cut the border-radius area
	background-color: transparent;
	box-shadow: none;

	font-weight: normal;
	line-height: var(--default-clickable-area);

	& > span {
		cursor: pointer;
		white-space: nowrap;
	}

	&__icon {
		min-width: 0; /* Overwrite icons*/
		min-height: 0;
		/* Keep padding to define the width to
			assure correct position of a possible text */
		padding: calc(var(--default-clickable-area) / 2) 0 calc(var(--default-clickable-area) / 2) var(--default-clickable-area);

		background-position: #{$icon-margin} center;
		background-size: $icon-size;
	}

	&:deep(.material-design-icon) {
		width: var(--default-clickable-area);
		height: var(--default-clickable-area);
		opacity: $opacity_full;

		.material-design-icon__svg {
			vertical-align: middle;
		}
	}

	// Forms & text inputs
	&__form {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;

		position: relative;
		margin: $input-margin 0;
		padding-inline-end: $icon-margin;
	}

	&__submit {
		position: absolute;
		inset-inline-start: 0;
		top: auto;
		width: 1px;
		height: 1px;
		overflow: hidden;
		z-index: -1;
		opacity: 0;
	}

	&__label {
		display: flex;
		align-items: center;
		justify-content: center;

		// bottom-right corner
		position: absolute;
		inset-inline-end: calc($icon-margin + 1px);
		bottom: 1px;
		width: calc(var(--default-clickable-area) - $input-margin * 2);
		height: calc(var(--default-clickable-area) - $input-margin * 2);
		box-sizing: border-box;
		margin: 0;
		padding: 7px 6px;

		border: 0;
		border-radius: 50%;
		/* Avoid background under border */
		background-color: var(--color-main-background);
		background-clip: padding-box;

		&, * {
			cursor: pointer;
		}
	}

	/* Inputs inside popover supports text, submit & reset */
	&__textarea {
		flex: 1 1 auto;
		color: inherit;
		border-color: var(--color-border-maxcontrast);

		min-height: calc(var(--default-clickable-area) * 2 - $input-margin * 2); /* twice the element margin-y */
		max-height: calc(var(--default-clickable-area) * 3 - $input-margin * 2); /* twice the element margin-y */
		// block width widening
		min-width: calc(var(--default-clickable-area) * 4);
		width: 100% !important;
		margin: 0;

		// if disabled, change cursor
		&:disabled {
			cursor: default;
		}

		/* only show confirm borders if input is not focused */
		&:not(:active):not(:hover):not(:focus) {
			&:invalid {
				& + .action-text-editable__label {
					background-color: var(--color-error);
				}
			}
			&:not(:disabled) + .action-text-editable__label {
				&:active,
				&:hover,
				&:focus {
					background-color: var(--color-primary-element);
					color: var(--color-primary-element-text);
				}
			}
		}
		&:active,
		&:hover,
		&:focus {
			&:not(:disabled) + .action-text-editable__label {
				/* above previous input */
				z-index: 2;

				border-color: var(--color-primary-element);
				border-inline-start-color: transparent;
			}
		}
	}
}

// if a form is the last of the list
// add the same bottomMargin as the right padding
// for visual balance
li:last-child > .action-text-editable {
	margin-bottom: calc($icon-margin - $input-margin);
}

// same for first item
li:first-child > .action-text-editable {
	margin-top: calc($icon-margin - $input-margin);
}
</style>
