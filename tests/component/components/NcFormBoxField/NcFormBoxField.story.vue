<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div>
		<button type="button">
			Before
		</button>
		<NcFormBox>
			<NcFormBoxField
				v-model:editing="nameEditing"
				:modelValue="name"
				label="Device name"
				:loading="nameLoading"
				:error="nameError"
				@submit="saveName" />
			<NcFormBoxField
				v-model:editing="passwordEditing"
				type="password"
				:label="step === 'current' ? 'Current password' : 'New password'"
				:loading="passwordLoading"
				:error="passwordError"
				@submit="submitPassword" />
			<NcFormBoxField
				v-model:editing="stepEditing"
				:label="textStep === 1 ? 'Step one' : 'Step two'"
				@submit="textStep = 2" />
		</NcFormBox>
		<span data-test="name-submits">{{ nameSubmits }}</span>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import NcFormBox from '../../../../src/components/NcFormBox/NcFormBox.vue'
import NcFormBoxField from '../../../../src/components/NcFormBoxField/NcFormBoxField.vue'

const wait = () => new Promise((resolve) => setTimeout(resolve, 50))

const name = ref('YubiKey')
const nameEditing = ref(false)
const nameLoading = ref(false)
const nameError = ref('')
const nameSubmits = ref(0)

async function saveName(value: string) {
	nameSubmits.value++
	nameLoading.value = true
	nameError.value = ''
	await wait()
	nameLoading.value = false
	if (!value.trim()) {
		nameError.value = 'Name cannot be empty'
		return
	}
	name.value = value
	nameEditing.value = false
}

const textStep = ref(1)
const stepEditing = ref(false)

const step = ref<'current' | 'new'>('current')
const passwordEditing = ref(false)
const passwordLoading = ref(false)
const passwordError = ref('')

watch(passwordEditing, (editing) => {
	if (!editing) {
		step.value = 'current'
		passwordError.value = ''
	}
})

async function submitPassword(value: string) {
	passwordLoading.value = true
	passwordError.value = ''
	await wait()
	passwordLoading.value = false
	if (step.value === 'current') {
		if (value !== 'nextcloud') {
			passwordError.value = 'Wrong password'
			return
		}
		step.value = 'new'
	} else {
		passwordEditing.value = false
	}
}
</script>
