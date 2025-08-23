<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div>
		<NcInputField ref="input" v-model="inputText" label="input field" />
		<NcPasswordField ref="password" v-model="passwordField" label="password field" />
		<NcTextField ref="text" v-model="textField" label="text field" />

		<NcButton @click="inputElement?.focus()">
			Focus input
		</NcButton>
		<NcButton @click="passwordElement?.focus()">
			Focus password
		</NcButton>
		<NcButton @click="textElement?.focus()">
			Focus text
		</NcButton>

		<NcButton @click="inputElement?.select()">
			Select input
		</NcButton>
		<NcButton @click="passwordElement?.select()">
			Select password
		</NcButton>
		<NcButton @click="textElement?.select()">
			Select text
		</NcButton>
	</div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import NcButton from '../../../../src/components/NcButton/NcButton.vue'
import NcInputField from '../../../../src/components/NcInputField/NcInputField.vue'
import NcPasswordField from '../../../../src/components/NcPasswordField/NcPasswordField.vue'
import NcTextField from '../../../../src/components/NcTextField/NcTextField.vue'

const inputText = ref('')
const passwordField = ref('')
const textField = ref('')

const inputElement = useTemplateRef('input')
const passwordElement = useTemplateRef('password')
const textElement = useTemplateRef('text')
</script>
