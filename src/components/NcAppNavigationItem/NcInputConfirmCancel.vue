<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
# Usage

```
<NcInputConfirmCancel @confirm="alert('confirm')" @cancel="alert('cancel')" />
```
</docs>
<template>
	<div class="app-navigation-input-confirm">
		<form @submit.prevent="confirm"
			@keydown.esc.exact.stop.prevent="cancel"
			@click.stop.prevent>
			<input ref="input"
				v-model="valueModel"
				type="text"
				class="app-navigation-input-confirm__input"
				:placeholder="placeholder">

			<NcButton :aria-label="labelConfirm"
				type="submit"
				variant="primary"
				@click.stop.prevent="confirm">
				<template #icon>
					<IconArrowRight :size="20" />
				</template>
			</NcButton>

			<NcButton :aria-label="labelCancel"
				type="reset"
				:variant="primary ? 'primary' : 'tertiary'"
				@click.stop.prevent="cancel">
				<template #icon>
					<IconClose :size="20" />
				</template>
			</NcButton>
		</form>
	</div>
</template>
<script>
import { t } from '../../l10n.ts'

import IconArrowRight from 'vue-material-design-icons/ArrowRight.vue'
import IconClose from 'vue-material-design-icons/Close.vue'
import NcButton from '../NcButton/index.js'

export default {
	name: 'NcInputConfirmCancel',

	components: {
		IconArrowRight,
		IconClose,
		NcButton,
	},

	props: {
		/**
		 * If this element is used on a primary element set to true for primary styling.
		 */
		primary: {
			default: false,
			type: Boolean,
		},

		placeholder: {
			default: '',
			type: String,
		},

		modelValue: {
			default: '',
			type: String,
		},
	},

	emits: [
		'cancel',
		'confirm',
		'update:modelValue',
	],

	data() {
		return {
			labelConfirm: t('Confirm changes'),
			labelCancel: t('Cancel changes'),
		}
	},

	computed: {
		valueModel: {
			get() { return this.modelValue },
			set(newValue) {
				this.$emit('update:modelValue', newValue)
			},
		},
	},

	methods: {
		confirm() {
			this.$emit('confirm')
		},
		cancel() {
			this.$emit('cancel')
		},
		focusInput() {
			this.$refs.input.focus()
		},
	},
}
</script>

<style scoped lang="scss">
$input-height: 34px;
$input-padding: 7px;
$input-margin: 5px;

.app-navigation-input-confirm {
	flex: 1 0 100%;
	width: 100%;

	form {
		display: flex;
	}

	&__input {
		height: $input-height;
		flex: 1 1 100%;
		font-size: 100% !important;
		margin: $input-margin !important;
		margin-inline-start: -1px - $input-padding !important;
		padding: $input-padding !important;

		&:active,
		&:focus,
		&:hover {
			outline: none;
			background-color: var(--color-main-background);
			color: var(--color-main-text);
			border-color: var(--color-primary-element);
		}
	}
}
</style>
