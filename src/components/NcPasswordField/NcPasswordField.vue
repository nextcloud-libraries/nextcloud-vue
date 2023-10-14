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
See [NcInputField](#/Components/NcFields?id=ncinputfield) for a list of all available props.

General purpose password field component.

```
<template>
	<div class="wrapper">
		<NcPasswordField v-model:value="text1"
			label="Old password" />
		<div class="external-label">
			<label for="textField">New password</label>
			<NcPasswordField v-model:value="text2"
				id="textField"
				:label-outside="true"
				placeholder="Min. 12 characters" />
		</div>
		<div class="external-label">
			<label for="textField2">New password</label>
			<NcPasswordField v-model:value="text3"
				id="textField2"
				:error="true"
				:label-outside="true"
				placeholder="Min. 12 characters"
				helper-text="Password is insecure" />
		</div>

		<NcPasswordField v-model:value="text4"
			label="Good new password"
			:success="true"
			placeholder="Min. 12 characters"
			helper-text="Password is secure">
			<template #icon>
				<Lock :size="20" />
			</template>
		</NcPasswordField>

		<NcPasswordField v-model:value="text5"
			:disabled="true"
			label="Disabled" />
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
		:show-trailing-button="showTrailingButton"
		:trailing-button-label="trailingButtonLabelPassword"
		:helper-text="computedHelperText"
		:error="computedError"
		:success="computedSuccess"
		:minlength="rules.minlength"
		@trailing-button-click="togglePasswordVisibility"
		@input="handleInput">
		<template v-if="!!$slots.icon" #icon>
			<!-- Default slot for the leading icon -->
			<slot name="icon" />
		</template>
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

export default {
	name: 'NcPasswordField',

	components: {
		NcInputField,
		Eye,
		EyeOff,
	},

	props: {
		...NcInputField.props,

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
		 * Controls whether to display the trailing button.
		 */
		showTrailingButton: {
			type: Boolean,
			default: true,
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
			passwordPolicy: loadState('core', 'capabilities', {}).password_policy || null,
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

		trailingButtonLabelPassword() {
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
