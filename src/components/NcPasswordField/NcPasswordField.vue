<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Description
See [NcInputField](#/Components/NcFields?id=ncinputfield) for a list of all available props.

General purpose password field component.

```
<template>
	<div class="wrapper">
		<NcPasswordField v-model="text1"
			label="Old password" />
		<div class="external-label">
			<label for="textField">New password</label>
			<NcPasswordField v-model="text2"
				id="textField"
				:label-outside="true"
				placeholder="Min. 12 characters" />
		</div>
		<div class="external-label">
			<label for="textField2">New password</label>
			<NcPasswordField v-model="text3"
				id="textField2"
				:error="true"
				:label-outside="true"
				placeholder="Min. 12 characters"
				helper-text="Password is insecure" />
		</div>

		<NcPasswordField v-model="text4"
			label="Good new password"
			:success="true"
			placeholder="Min. 12 characters"
			helper-text="Password is secure">
			<template #icon>
				<Lock :size="20" />
			</template>
		</NcPasswordField>

		<NcPasswordField v-model="text5"
			:disabled="true"
			label="Disabled" />

		<NcPasswordField :value.sync="text6"
			label="Secret token"
			as-text />
	</div>
</template>
<script>
import Lock from 'vue-material-design-icons/Lock'

export default {
	data() {
		return {
			text1: '',
			text2: '',
			text3: 'hunter',
			text4: '',
			text5: '',
			text6: 'secret-token',
		}
	},

	components: {
		Lock,
	},
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
	gap: 14px;
	width: 100%;
	margin-top: 1rem;
}

.external-label label {
	padding-top: 7px;
	white-space: nowrap;
}
</style>
```
</docs>

<script setup lang="ts">
import type { Writable } from '../../utils/VueTypes.ts'
import type { NcInputFieldProps } from '../NcInputField/NcInputField.vue'

import { mdiEye, mdiEyeOff } from '@mdi/js'
import axios from '@nextcloud/axios'
import { getCapabilities } from '@nextcloud/capabilities'
import { generateOcsUrl } from '@nextcloud/router'
import debounce from 'debounce'
import { computed, ref, useTemplateRef, watch } from 'vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcInputField from '../NcInputField/NcInputField.vue'
import { t } from '../../l10n.ts'
import logger from '../../utils/logger.ts'

const modelValue = defineModel<string>({ default: '' })

/**
 * The visibility of the password.
 * If this is set to true then the password will not be obfuscated by the browser.
 */
const visible = defineModel<boolean>('visible', { default: false })

const props = withDefaults(defineProps<Omit<NcInputFieldProps, 'trailingButtonLabel' | 'type'> & {
	/**
	 * Check if the user entered a valid password using the password_policy
	 * app if available.
	 *
	 * Warning: this doesn't replace server side checking and will do nothing
	 * if the password_policy app is disabled.
	 */
	checkPasswordStrength?: boolean

	/**
	 * The minlength property defines the minimum number of characters
	 * (as UTF-16 code units) the user can enter.
	 */
	minlength?: number

	/**
	 * Render as input[type=text] that looks like password field.
	 * Allows to avoid unwanted password-specific browser behavior,
	 * such as save or generate password prompt.
	 * Useful for secret token fields.
	 * Note: autocomplete="off" is ignored by most browsers.
	 */
	asText?: boolean
}>(), {
	inputClass: '',
	minlength: undefined,
	// overwrite default
	showTrailingButton: true,
})

const emit = defineEmits<{
	valid: []
	invalid: []
}>()

watch(modelValue, debounce(checkPassword, 500))

// public API
defineExpose({
	focus,
	select,
})

// password policy
interface PasswordPolicy {
	/**
	 * The URLs to the password_policy app methods
	 */
	api: {
		/**
		 * The URL to the password generator
		 */
		generate: string

		/**
		 * The URL to the password validator
		 */
		validate: string
	}

	/**
	 * Whether to enforce non common passwords
	 */
	enforceNonCommonPassword: boolean

	/**
	 * Whether to enforce numeric characters
	 */
	enforceNumericCharacters: boolean

	/**
	 * Whether to enforce special characters
	 */
	enforceSpecialCharacters: boolean

	/**
	 * Whether to enforce upper and lower case
	 */
	enforceUpperLowerCase: boolean

	/**
	 * The minimum length of the password
	 */
	minLength: number
}

const { password_policy: passwordPolicy } = getCapabilities() as { password_policy?: PasswordPolicy }

// internal state
const inputField = useTemplateRef('input-field-key')

const internalHelpMessage = ref('')
const isValid = ref<boolean>()

const propsToForward = computed<Partial<NcInputFieldProps>>(() => {
	const all = { ...props } as Partial<Writable<typeof props>>
	// our props
	delete all.checkPasswordStrength
	delete all.minlength
	delete all.asText
	// other props already set in template
	delete all.error
	delete all.helperText
	delete all.inputClass
	delete all.success

	return all satisfies Partial<NcInputFieldProps>
})

/**
 * Validate the entered password.
 * If available this method will use the password-policy app API to validate the password.
 */
async function checkPassword() {
	if (!props.checkPasswordStrength) {
		return
	}

	try {
		const { data } = await axios.post(generateOcsUrl('apps/password_policy/api/v1/validate'), { password: modelValue.value })
		isValid.value = data.ocs.data.passed
		if (data.ocs.data.passed) {
			internalHelpMessage.value = t('Password is secure')
			/**
			 * Triggers when the internal password_policy detect that the
			 * password entered is valid.
			 */
			emit('valid')
			return
		}

		internalHelpMessage.value = data.ocs.data.reason
		/**
		 * Triggers when the internal password_policy detect that the
		 * password entered is invalid.
		 */
		emit('invalid')
	} catch (error) {
		logger.error('Password policy returned an error', { error })
	}
}

/**
 * Toggle the visibility of the password
 */
function toggleVisibility() {
	visible.value = !visible.value
}

/**
 * Focus the input element
 *
 * @param options - Focus options
 * @public
 */
function focus(options?: FocusOptions) {
	inputField.value!.focus(options)
}

/**
 * Select all the text in the input
 *
 * @public
 */
function select() {
	inputField.value!.select()
}
</script>

<template>
	<NcInputField
		v-bind="propsToForward"
		ref="input-field-key"
		v-model="modelValue"
		:error="error || isValid === false"
		:helper-text="helperText || internalHelpMessage"
		:input-class="[inputClass, { 'password-field__input--secure-text': !visible && asText }]"
		:minlength="minlength ?? passwordPolicy?.minLength ?? 0"
		:success="success || isValid === true"
		:trailing-button-label="visible ? t('Hide password') : t('Show password')"
		:type="visible || asText ? 'text' : 'password'"
		@trailing-button-click="toggleVisibility">
		<template v-if="!!$slots.icon" #icon>
			<!-- @slot Leading icon -->
			<slot name="icon" />
		</template>
		<template #trailing-button-icon>
			<NcIconSvgWrapper :path="visible ? mdiEyeOff : mdiEye" />
		</template>
	</NcInputField>
</template>

<style lang="scss" scoped>
:deep(.password-field__input--secure-text) {
	// Emulate password field look
	// This is not a part of the standard but well supported
	-webkit-text-security: disc;
}
</style>
