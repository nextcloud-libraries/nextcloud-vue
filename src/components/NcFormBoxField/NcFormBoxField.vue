<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'
import type { VueClassType } from '../../utils/VueTypes.ts'

import { mdiCheck, mdiPencilOutline } from '@mdi/js'
import { useEventListener } from '@vueuse/core'
import { computed, nextTick, ref, useAttrs, useTemplateRef, watch } from 'vue'
import NcButton from '../NcButton/NcButton.vue'
import NcFormBoxItem from '../NcFormBox/NcFormBoxItem.vue'
import NcFormBoxButton from '../NcFormBoxButton/NcFormBoxButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcLoadingIcon from '../NcLoadingIcon/NcLoadingIcon.vue'
import NcPasswordField from '../NcPasswordField/NcPasswordField.vue'
import NcTextField from '../NcTextField/NcTextField.vue'
import { t } from '../../l10n.ts'
import { createElementId } from '../../utils/createElementId.ts'
import { isLegacy } from '../../utils/legacy.ts'

// Attributes go to the inner field and only exist while editing, `class` goes to the row in both states
defineOptions({ inheritAttrs: false })

/**
 * Edit state. Set on click, cleared on Escape or when an unchanged value is applied.
 * Leaving it after a successful submit is up to the parent.
 */
const editing = defineModel<boolean>('editing', { default: false })

const {
	modelValue = '',
	label,
	type = 'text',
	placeholder = undefined,
	helperText = '',
	error = '',
	loading = false,
	disabled = false,
	submitLabel = t('Submit'),
	class: rootClasses = '',
} = defineProps<{
	/** Saved value, shown in the button state. Passwords show a fixed row of dots instead. The parent updates it after a successful `submit`. */
	modelValue?: string
	/** Label of the row and of the input. Change it while editing to move to the next step. */
	label: string
	/** Input type */
	type?: 'text' | 'password'
	/** Input placeholder */
	placeholder?: string
	/** Hint, visible in both states. Not for errors, use `error`. */
	helperText?: string
	/** Error message, shown by the browser's validation popup while editing. Typing clears it until the next submit. */
	error?: string
	/** Submit in progress. The input stays focusable but read-only. */
	loading?: boolean
	/** Disable the row */
	disabled?: boolean
	/** Accessible label of the submit button, which only passwords have */
	submitLabel?: string
	/** Row classes, applied in both states */
	class?: VueClassType
}>()

const emit = defineEmits<{
	/** Changed value applied (Enter, or leaving a text field), or password submitted (Enter or submit button) */
	submit: [value: string]
	/** Never emitted, the value only changes through `submit`. Declared so a `v-model` listener stays off the inner input. */
	'update:modelValue': [value: string]
}>()

defineSlots<{
	/** Row icon in the button state, defaults to a pencil */
	icon?: Slot
	/** Submit button icon for passwords, defaults to a checkmark */
	submitIcon?: Slot
}>()

// A consumer's `id` goes to the input, so the label has to point at it too
const attrs = useAttrs()
const generatedId = createElementId()
const inputId = computed(() => (attrs.id as string | undefined) || generatedId)

const draft = ref(modelValue)
// Leaving the field after a rejected submit must not send the same value again
let lastSubmitted: string | undefined
// Chrome blurs the old input when a step change replaces it, which isn't the user leaving
let replacingField = false
// The pencil icon is hidden from screen readers, so the verb goes into the name
const editLabel = computed(() => t('Edit {label}', { label }) /* TRANSLATORS: {label} is the field's label, e.g. "Device name". Read by screen readers on the button that opens the input. */)
// Fixed length, so the dots don't give away the real one
const shownValue = computed(() => type === 'password' ? '•'.repeat(20) : modelValue)

const itemRef = useTemplateRef('item')
const fieldRef = useTemplateRef('field')

/**
 * Whether focus is inside the component. Call before the DOM swaps, the focused element is about to unmount.
 */
function hasFocus() {
	return !!itemRef.value?.$el?.contains(document.activeElement)
}

// The focused element unmounts on every swap. Move focus to its replacement, otherwise it drops to <body>.
watch(editing, async (isEditing) => {
	draft.value = modelValue
	lastSubmitted = undefined
	const hadFocus = hasFocus()
	await nextTick()
	if (isEditing) {
		fieldRef.value?.focus()
		fieldRef.value?.select()
	} else if (hadFocus) {
		itemRef.value?.focus()
	}
})

// The parent can save a new value while the row is open (another tab, polling).
// Follow it unless the user already typed, otherwise leaving would revert it.
watch(() => modelValue, (value, oldValue) => {
	if (editing.value && draft.value === oldValue) {
		draft.value = value
	}
})

// Multi-step flows: the parent swaps label and/or type while editing stays true
watch([() => label, () => type], async () => {
	if (!editing.value) {
		return
	}
	draft.value = modelValue
	lastSubmitted = undefined
	const hadFocus = hasFocus()
	replacingField = true
	await nextTick()
	replacingField = false
	if (hadFocus) {
		fieldRef.value?.focus()
	}
})

/**
 * The native input. NcTextField and NcPasswordField don't expose it, and the id is ours.
 */
function nativeInput() {
	return document.getElementById(inputId.value) as HTMLInputElement | null
}

watch([() => error, () => loading, fieldRef], () => {
	const input = nativeInput()
	input?.setCustomValidity(loading ? '' : error)
	if (error && !loading) {
		input?.reportValidity()
	}
}, { flush: 'post' })

// Typing clears the error so the popup doesn't block the next attempt
watch(draft, () => nativeInput()?.setCustomValidity(''))

/**
 * Whether the key belongs to an IME (confirming or dismissing a candidate), not to the field.
 * Safari ends composition before the confirming keydown, which then only has keyCode 229.
 *
 * @param event - Keydown event
 */
function isImeKey(event: KeyboardEvent) {
	return event.isComposing || event.keyCode === 229
}

/**
 * Apply on Enter
 *
 * @param event - Keydown event
 */
function onEnter(event: KeyboardEvent) {
	if (isImeKey(event)) {
		return
	}
	event.preventDefault()
	apply()
}

/**
 * Leaving a text field applies it, like a native settings field. Passwords stay open:
 * a click elsewhere or a password manager popup must not change a password.
 *
 * @param event - Focusout event
 */
function onFocusout(event: FocusEvent) {
	if (type === 'password' || !editing.value || replacingField || draft.value === lastSubmitted
		// Switching windows blurs the field too, but the user hasn't left it
		|| !document.hasFocus()
		|| (event.relatedTarget instanceof Node && itemRef.value?.$el?.contains(event.relatedTarget))) {
		return
	}
	apply()
}

/**
 * Keep focus in the input when anything else in the row is pressed. The blur would apply the
 * value first, and Safari and Firefox on macOS don't focus buttons on click, so the
 * relatedTarget check in onFocusout can't tell a click on the row's own buttons from leaving.
 *
 * @param event - Mousedown event
 */
function onMousedown(event: MouseEvent) {
	if (!(event.target instanceof HTMLInputElement)) {
		event.preventDefault()
	}
}

// On the whole row, its padding and icon column are outside the label
useEventListener(() => editing.value ? itemRef.value?.$el : undefined, 'mousedown', onMousedown)

/**
 * Cancel on Escape
 *
 * @param event - Keydown event
 */
function onEscape(event: KeyboardEvent) {
	if (isImeKey(event)) {
		return
	}
	event.preventDefault()
	event.stopPropagation()
	if (!loading) {
		editing.value = false
	}
}

/**
 * Submit the draft
 */
function apply() {
	if (loading) {
		return
	}
	if (type !== 'password' && draft.value === modelValue) {
		editing.value = false
		return
	}
	lastSubmitted = draft.value
	emit('submit', draft.value)
}
</script>

<template>
	<NcFormBoxButton
		v-if="!editing"
		ref="item"
		:class="rootClasses"
		:label
		invertedAccent
		:aria-label="editLabel"
		:disabled
		@click="editing = true">
		<template v-if="shownValue || helperText" #description>
			<!-- Screen readers would read the dots one by one.
				bdi keeps a value's own text direction while it aligns with the row in RTL. -->
			<span
				v-if="shownValue"
				:class="$style.formBoxField__value"
				:aria-hidden="type === 'password' || undefined"><bdi>{{ shownValue }}</bdi></span>
			<span v-if="helperText" :class="$style.formBoxField__helper">{{ helperText }}</span>
		</template>
		<template #icon>
			<slot name="icon">
				<NcIconSvgWrapper :path="mdiPencilOutline" inline />
			</slot>
		</template>
	</NcFormBoxButton>
	<!-- The label's overlay covers the text column, so a click there focuses the input -->
	<NcFormBoxItem
		v-else
		ref="item"
		tag="label"
		:for="inputId"
		invertedAccent
		:class="[rootClasses, $style.formBoxField_editing, { [$style.formBoxField_legacy]: isLegacy }]"
		:label>
		<template #description>
			<!-- Catches Escape from the input and the password toggle -->
			<div :class="$style.formBoxField__field" @keydown.esc="onEscape" @focusout="onFocusout">
				<!-- Keyed on the step: a new element gets a real focus event, so screen readers read the new label -->
				<component
					:is="type === 'password' ? NcPasswordField : NcTextField"
					:id="inputId"
					:key="`${label}:${type}`"
					ref="field"
					v-model="draft"
					enterkeyhint="done"
					v-bind="$attrs"
					labelOutside
					:placeholder
					:helperText
					:disabled
					:readonly="loading"
					:aria-disabled="loading || undefined"
					:aria-invalid="!!error || undefined"
					@keydown.enter="onEnter" />
			</div>
		</template>
		<template #icon>
			<!-- Always rendered: an empty slot would show NcFormBoxItem's "Icon is missing" fallback.
				Passwords don't apply when leaving the field, so pointer users need a button.
				Escape must not reach a surrounding NcDialog, which would close on it. -->
			<span :class="$style.formBoxField__actions" @keydown.esc="onEscape">
				<NcButton
					v-if="type === 'password'"
					:class="$style.formBoxField__submit"
					:aria-label="submitLabel"
					:disabled
					:aria-disabled="loading || undefined"
					variant="tertiary-no-background"
					@click="apply">
					<template #icon>
						<NcLoadingIcon v-if="loading" />
						<slot v-else name="submitIcon">
							<NcIconSvgWrapper :path="mdiCheck" />
						</slot>
					</template>
				</NcButton>
				<NcLoadingIcon v-else-if="loading" />
			</span>
		</template>
	</NcFormBoxItem>
</template>

<style lang="scss" module>
// Own line above the helper text
.formBoxField__value {
	display: block;
}

// Same as NcInputField's helper text, so the row keeps its look and height when editing starts
.formBoxField__helper {
	display: flex;
	align-items: center;
	color: var(--color-text-maxcontrast);
}

// !important: NcFormBoxItem's :hover, :active and :has(:focus-visible) rules are more specific,
// and an input row must not act like a button
.formBoxField_editing {
	--nc-form-box-field-border: var(--color-border-maxcontrast);
	color: var(--color-main-text) !important;
	background-color: var(--color-main-background) !important;
	border-color: var(--nc-form-box-field-border) !important;
	// Even 1px border. The padding makes up for the item's 2px bottom border so the row keeps its height
	border-block-end-width: 1px !important;
	padding-block-end: 1px;
	box-shadow: none !important;
	// The border is the focus indicator here, the buttons keep their own
	outline: none !important;
	transform: none !important;
	cursor: text !important;

	&:has(:disabled) {
		cursor: default !important;
	}

	&:focus-within {
		--nc-form-box-field-border: var(--color-main-text);
	}

	// Legacy items have no border, draw it with a shadow instead
	&.formBoxField_legacy {
		padding-block-end: 0;
		box-shadow: 0 0 0 1px var(--nc-form-box-field-border) !important;
	}

	// Forced colors flatten the border and drop the box-shadow
	@media (forced-colors: active) {
		&:focus-within {
			outline: 2px solid CanvasText !important;
			outline-offset: 2px;
		}
	}

	// NcFormBoxItem's content column positions the password toggle, so it centers on the row next to the submit button.
	// It also confines the label's click overlay to that column.
	> :first-child {
		position: relative;
	}

	// The row is the frame, so the field drops its own, like NcSelect does in multi mode.
	// Selectors follow the field's DOM to outweigh its scoped and !important rules.
	.formBoxField__field {
		:global(.input-field) {
			// Without padding the radius would clip the caret and selection
			--input-border-radius: 0;
			--input-padding-start: 0;
			position: static;
		}

		:global(.input-field__main-wrapper) {
			position: static;
			height: auto;
			padding: 0;
		}

		:global(.input-field .input-field__main-wrapper .input-field__input) {
			// Above the label's click overlay
			position: relative;
			margin: 0;
			background: transparent;
			box-shadow: none !important;
			cursor: inherit;
		}

		// The row already fades when disabled
		:global(.input-field--disabled) {
			opacity: 1;
			filter: none;
		}

		// Reaches into the row's gap to sit next to ✓, leaving a baseline so their forced-colours borders don't touch
		// NcInputField shrinks it to fit inside the input's border, which the row doesn't have. Same size as ✓.
		:global(.input-field__trailing-button.button-vue) {
			--button-size: var(--default-clickable-area) !important;
			--button-radius: var(--border-radius-element);
			inset-block-start: 50%;
			inset-inline-end: calc(-1 * var(--default-grid-baseline));
			translate: 0 -50%;
		}

		:global(.input-field__helper-text-message) {
			padding: 0;
		}
	}
}

.formBoxField__actions {
	display: flex;
}

// The icon sits where the pencil was: the button is wider than the bare 20px pencil icon
.formBoxField__submit {
	margin-inline-end: calc((20px - var(--default-clickable-area)) / 2);
}
</style>

<docs>
### General

A form box row that turns into an input in place. It is controlled: the parent saves the value, shows `loading` and `error`, and sets `editing` back to `false` when the save succeeds.

Enter or leaving the field applies a changed value, Escape discards it without closing a surrounding dialog. Focus moves into the input on edit and back to the row after Enter or Escape.

Passwords are the exception: leaving the field does nothing, so a click elsewhere or a password manager popup never changes a password. They apply on Enter or with the submit button.

Errors show in the browser's validation popup, like other Nextcloud forms: pass the message as `error` after a failed save. `helperText` is for hints only.

The row holds only the label and the value. Put explanations on the group with `<NcFormGroup description>`.

`modelValue` is one-way, there is no `v-model` for it: save the value in `@submit` and pass it back.

Attributes such as `autocomplete`, `name` or `checkPasswordStrength` go to the inner `NcTextField` or `NcPasswordField`, so they only apply while editing. `class` styles the row in both states.

```vue
<script>
export default {
	data() {
		return {
			name: 'YubiKey',
			editing: false,
			loading: false,
			error: '',
		}
	},
	watch: {
		editing(value) {
			if (!value) {
				this.error = ''
			}
		},
	},
	methods: {
		async save(value) {
			this.loading = true
			this.error = ''
			await new Promise((resolve) => setTimeout(resolve, 800))
			this.loading = false
			if (!value.trim()) {
				this.error = 'Name cannot be empty'
				return
			}
			this.name = value
			this.editing = false
		},
	},
}
</script>

<template>
	<NcFormBox>
		<NcFormBoxField
			:modelValue="name"
			v-model:editing="editing"
			label="Device name"
			:loading
			:error
			@submit="save" />
	</NcFormBox>
</template>
```

### Multi-step

Steps live in the parent: change `label` (and `type`) while `editing` stays `true`. The input resets to `modelValue`, empty for passwords, and keeps focus. The row can have its own label outside editing, like "Change password" here.

```vue
<script>
import { mdiArrowRight } from '@mdi/js'

export default {
	setup() {
		return { mdiArrowRight }
	},
	data() {
		return {
			step: 'current',
			editing: false,
			loading: false,
			error: '',
		}
	},
	watch: {
		editing(value) {
			if (!value) {
				this.step = 'current'
				this.error = ''
			}
		},
	},
	methods: {
		async submit(value) {
			this.loading = true
			this.error = ''
			await new Promise((resolve) => setTimeout(resolve, 800))
			this.loading = false
			if (this.step === 'current') {
				if (value !== 'nextcloud') {
					this.error = 'Wrong password (hint: nextcloud)'
					return
				}
				this.step = 'new'
			} else {
				this.editing = false
			}
		},
	},
}
</script>

<template>
	<NcFormBox>
		<NcFormBoxField
			v-model:editing="editing"
			type="password"
			:label="!editing ? 'Change password' : step === 'current' ? 'Current password' : 'New password'"
			:autocomplete="step === 'current' ? 'current-password' : 'new-password'"
			:enterkeyhint="step === 'current' ? 'next' : 'done'"
			:submitLabel="step === 'current' ? 'Next' : 'Save'"
			:loading
			:error
			@submit="submit">
			<template v-if="step === 'current'" #submitIcon>
				<NcIconSvgWrapper :path="mdiArrowRight" directional />
			</template>
		</NcFormBoxField>
	</NcFormBox>
</template>
```
</docs>
