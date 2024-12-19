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
			<NcPasswordField id="textField"
				v-model="text2"
				:label-outside="true"
				placeholder="Min. 12 characters" />
		</div>
		<div class="external-label">
			<label for="textField2">New password</label>
			<NcPasswordField id="textField2"
				v-model="text3"
				:error="true"
				:label-outside="true"
				placeholder="Min. 12 characters"
				helper-text="Password is insecure" />
		</div>

		<NcPasswordField v-model="text4"
			label="Good new password"
			:success="true"
			placeholder="Min. 12 characters"
			helper-text="Password is secure" />

		<NcPasswordField v-model="text5"
			:disabled="true"
			label="Disabled" />

		<NcPasswordField v-model="text6"
			label="Secret token"
			as-text />
	</div>
</template>
<script>
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
	<NcInputField v-bind="propsAndAttrsToForward"
		ref="inputField"
		:type="isPasswordHidden && !asText ? 'password' : 'text'"
		:trailing-button-label="trailingButtonLabelPassword"
		:helper-text="computedHelperText"
		:error="computedError"
		:success="computedSuccess"
		:minlength="rules.minlength"
		:input-class="{ 'password-field__input--secure-text': isPasswordHidden && asText }"
		v-on="$listeners"
		@trailing-button-click="togglePasswordVisibility"
		@input="handleInput">
		<!-- Default slot for the leading icon -->
		<slot />
		<template #trailing-button-icon>
			<Eye v-if="isPasswordHidden" :size="18" />
			<EyeOff v-else :size="18" />
		</template>
	</NcInputField>
</template>

<script>
import { generateOcsUrl } from '@nextcloud/router'
import { loadState } from '@nextcloud/initial-state'
import axios from '@nextcloud/axios'
import debounce from 'debounce'

import Eye from 'vue-material-design-icons/Eye.vue'
import EyeOff from 'vue-material-design-icons/EyeOff.vue'

import { logger } from '../../utils/logger.ts'
import { t } from '../../l10n.js'
import { useModelMigration } from '../../composables/useModelMigration.ts'
import NcInputField from '../NcInputField/NcInputField.vue'

/**
 * @typedef PasswordPolicy
 * @property {object} api - The URLs to the password_policy app methods
 * @property {string} api.generate - The URL to the password generator
 * @property {string} api.validate - The URL to the password validator
 * @property {boolean} enforceNonCommonPassword - Whether to enforce non common passwords
 * @property {boolean} enforceNumericCharacters - Whether to enforce numeric characters
 * @property {boolean} enforceSpecialCharacters - Whether to enforce special characters
 * @property {boolean} enforceUpperLowerCase - Whether to enforce upper and lower case
 * @property {number} minLength - The minimum length of the password
 */

/** @type {PasswordPolicy|null} */
const passwordPolicy = loadState('core', 'capabilities', {}).password_policy || null

const NcInputFieldProps = new Set(Object.keys(NcInputField.props))

export default {
	name: 'NcPasswordField',

	components: {
		NcInputField,
		Eye,
		EyeOff,
	},

	// Allow forwarding all attributes
	inheritAttrs: false,

	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
	},

	props: {
		/**
		 * Any [NcInputField](#/Components/NcFields?id=ncinputfield) props
		 */
		// Not an actual prop but needed to show in vue-styleguidist docs
		// eslint-disable-next-line
		' ': {},

		// Reuse all the props from NcInputField for better typing and documentation
		...NcInputField.props,

		// Redefined props

		/**
		 * Controls whether to display the trailing button.
		 */
		 showTrailingButton: {
			type: Boolean,
			default: true,
		},

		// Removed NcInputField props, defined only by this component

		trailingButtonLabel: undefined,

		// Custom props

		/**
		 * Check if the user entered a valid password using the password_policy
		 * app if available.
		 *
		 * Warning: this doesn't replace server side checking and will do nothing
		 * if the password_policy app is disabled.
		 */
		checkPasswordStrength: {
			type: Boolean,
			default: false,
		},

		/**
		 * The minlength property defines the minimum number of characters
		 * (as UTF-16 code units) the user can enter
		 */
		minlength: {
			type: Number,
			default: 0,
		},

		/**
		 * The maxlength property defines the maximum number of characters
		 * (as UTF-16 code units) the user can enter
		 */
		maxlength: {
			type: Number,
			default: null,
		},

		/**
		 * Render as input[type=text] that looks like password field.
		 * Allows to avoid unwanted password-specific browser behavior,
		 * such as save or generate password prompt.
		 * Useful for secret token fields.
		 * Note: autocomplete="off" is ignored by browsers.
		 */
		asText: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'valid',
		'invalid',
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 * @deprecated
		 */
		'update:value',
		/**
		 * Triggers when the value inside the password field is
		 * updated.
		 *
		 * @property {string} The new value
		 */
		'update:modelValue',
		/** Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
	],

	setup() {
		const model = useModelMigration('value', 'update:value')
		return {
			model,
		}
	},

	data() {
		return {
			isPasswordHidden: true,
			internalHelpMessage: '',
			isValid: null,
		}
	},

	computed: {
		computedError() {
			return this.error || this.isValid === false
		},
		computedSuccess() {
			return this.success || this.isValid === true
		},
		computedHelperText() {
			if (this.helperText.length > 0) {
				return this.helperText
			}
			return this.internalHelpMessage
		},

		rules() {
			const { minlength } = this
			return {
				minlength: minlength ?? passwordPolicy?.minLength,
			}
		},

		trailingButtonLabelPassword() {
			return this.isPasswordHidden ? t('Show password') : t('Hide password')
		},

		propsAndAttrsToForward() {
			return {
				// Proxy all the HTML attributes
				...this.$attrs,
				// Proxy original NcInputField's props
				...Object.fromEntries(
					Object.entries(this.$props).filter(([key]) => NcInputFieldProps.has(key)),
				),
			}
		},
	},

	watch: {
		model(newValue) {
			if (this.checkPasswordStrength) {
				if (passwordPolicy === null) {
					return
				}
				this.checkPassword(newValue)
			}
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
			this.model = event.target.value
		},
		togglePasswordVisibility() {
			this.isPasswordHidden = !this.isPasswordHidden
		},
		checkPassword: debounce(async function(password) {
			try {
				const { data } = await axios.post(generateOcsUrl('apps/password_policy/api/v1/validate'), { password })
				this.isValid = data.ocs.data.passed
				if (data.ocs.data.passed) {
					this.internalHelpMessage = t('Password is secure')
					/**
					 * Triggers when the internal password_policy detect that the
					 * password entered is valid.
					 */
					this.$emit('valid')
					return
				}

				this.internalHelpMessage = data.ocs.data.reason
				/**
				 * Triggers when the internal password_policy detect that the
				 * password entered is invalid.
				 */
				this.$emit('invalid')
			} catch (e) {
				logger.error('Password policy returned an error', e)
			}
		}, 500),
	},
}
</script>

<style lang="scss" scoped>
:deep(.password-field__input--secure-text) {
	// Emulate password field look
	// This is not a part of the standard but well supported
	-webkit-text-security: disc;
}
</style>
