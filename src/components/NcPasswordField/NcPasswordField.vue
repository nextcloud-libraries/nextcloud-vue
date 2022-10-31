<!--
  - @copyright Copyright (c) 2022 Marco Ambrosini <marcoambrosini@pm.me>
  -
  - @author Marco Ambrosini <marcoambrosini@pm.me>
  - @author Carl Schwan <carl@carlschwan.eu>
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

General purpose password field component.

```
<template>
	<div class="wrapper">
		<NcPasswordField :value.sync="text1"
			label="Old password" />
		<div class="external-label">
			<label for="textField">New password</label>
			<NcPasswordField :value.sync="text2"
				id="textField"
				:label-outside="true" />
		</div>
		<div class="external-label">
			<label for="textField2">New password</label>
			<NcPasswordField :value.sync="text3"
				:error="true"
				id="textField2"
				:label-outside="true"
				helper-text="Password is insecure" />
		</div>

		<NcPasswordField :value.sync="text4"
			label="Good new password"
			:label-visible="true"
			:success="true"
			helper-text="Password is secure" />

		<NcPasswordField :value.sync="text5"
			:disabled="true"
			label="Disabled" />
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
	<NcInputField v-bind="$props"
		ref="inputField"
		:type="isPasswordHidden ? 'password' : 'text'"
		:show-trailing-button="true"
		:helper-text="computedHelperText"
		:error="computedError"
		:success="computedSuccess"
		:minlength="rules.minlength"
		:trailing-button-label="trailingButtonLabel"
		:disabled="disabled"
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

import Eye from 'vue-material-design-icons/Eye.vue'
import EyeOff from 'vue-material-design-icons/EyeOff.vue'
import NcInputField from '../NcInputField/NcInputField.vue'
import debounce from 'debounce'
import axios from '@nextcloud/axios'
import { loadState } from '@nextcloud/initial-state'
import { generateOcsUrl } from '@nextcloud/router'
import { t } from '../../l10n.js'
import logger from '../../utils/logger.js'

const defaultPasswordPolicy = loadState('core', 'capabilities', {}).password_policy || null

export default {
	name: 'NcPasswordField',

	components: {
		NcInputField,
		Eye,
		EyeOff,
	},

	props: {
		/**
		 * The value of the input field
		 */
		value: {
			type: String,
			required: true,
		},

		/**
		 * The hidden input label for accessibility purposes. This will also
		 * be used as a placeholder unless the placeholder prop is populated
		 * with a different string. This is required if an external label is
		 * not provided.
		 */
		label: {
			type: String,
			default: undefined,
		},

		/**
		 * Pass in true if you want to use an external label. This is useful
		 * if you need a label that looks different from the one provided by
		 * this component
		 */
		labelOutside: {
			type: Boolean,
			default: false,
		},

		/**
		 * We normally have the lable hidden visually and use it for
		 * accessibility only. If you want to have the label visible just above
		 * the input field pass in true to this prop.
		 */
		labelVisible: {
			type: Boolean,
			default: false,
		},

		/**
		 * The placeholder of the input. This defaults as the string that's
		 * passed into the label prop. In order to remove the placeholder,
		 * pass in an empty string.
		 */
		placeholder: {
			type: String,
			default: undefined,
		},

		/**
		 * Toggles the success state of the component. Adds a checkmark icon.
		 * this cannot be used together with canClear.
		 */
		success: {
			type: Boolean,
			default: false,
		},

		/**
		 * Toggles the error state of the component. Adds an error icon.
		 * this cannot be used together with canClear.
		 */
		error: {
			type: Boolean,
			default: false,
		},

		/**
		 * Additional error message
		 *
		 * This will be displayed beneath the input field
		 */
		helperText: {
			type: String,
			default: '',
		},

		/**
		 * The autofocus property defines whether the input should
		 * automatically receive focus on page load
		 */
		autofocus: {
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
		 * Helps the browser identify the type of password field and to provide
		 * autocompletion for the password. Allowed values are off, on, new-password
		 * old-password
		 *
		 * By default try to autocomplete with the current password
		 */
		autocomplete: {
			type: String,
			validator: (value) => [
				'new-password',
				'current-password',
				'one-time-code',
				'on',
				'off',
			].includes(value),
			default: 'current-password',
		},

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
		 * Id of the input field. To use when using an external label
		 */
		id: {
			type: String,
			default: '',
		},

		/**
		 * Disable the password field
		 */
		disabled: {
			type: Boolean,
			default: false,
		},

		/**
		 * Mark the password field as required
		 */
		required: {
			type: Boolean,
			default: false,
		},

		/**
		 * Name of the text field
		 *
		 * This is the key that will be send when sending a form
		 */
		name: {
			type: String,
			default: undefined,
		},
	},

	emits: [
		'valid',
		'invalid',
		'update:value',
	],

	data() {
		return {
			isPasswordHidden: true,
			internalHelpMessage: '',
			passwordPolicy: defaultPasswordPolicy,
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
			const { minlength, passwordPolicy } = this
			return {
				minlength: minlength ?? passwordPolicy?.minLength,
			}
		},
		trailingButtonLabel() {
			return this.isPasswordHidden ? t('Show password') : t('Hide password')
		},
	},

	watch: {
		value(newValue) {
			if (this.checkPasswordStrength) {
				if (this.passwordPolicy === null) {
					return
				}
				if (this.passwordPolicy) {
					this.checkPassword(newValue)
				}
			}
		},
	},

	methods: {
		handleInput(event) {
			/**
			 * Triggers when the value inside the password field is
			 * updated.
			 *
			 * @property {string} The new value
			 */
			this.$emit('update:value', event.target.value)
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
