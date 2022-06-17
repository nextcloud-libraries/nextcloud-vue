<!--
 - @copyright Copyright (c) 2020 Jonathan Treffler <mail@jonathan-treffler.de>
 -
 - @author Jonathan Treffler <mail@jonathan-treffler.de>
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
 -
 -->

<docs>
# Usage

```
<InputConfirmCancel @confirm="alert('confirm')" @cancel="alert('cancel')" />
```
</docs>
<template>
	<div class="app-navigation-input-confirm">
		<form @submit.prevent="confirm"
			@keydown.esc.exact.prevent="cancel"
			@click.stop.prevent>
			<input ref="input"
				v-model="valueModel"
				type="text"
				class="app-navigation-input-confirm__input"
				:placeholder="placeholder">

			<ButtonVue native-type="submit"
				type="primary"
				:aria-label="labelConfirm"
				@click.stop.prevent="confirm">
				<template #icon>
					<ArrowRight :size="20" decorative title="" />
				</template>
			</ButtonVue>

			<ButtonVue native-type="reset"
				type="tertiary"
				:aria-label="labelCancel"
				@click.stop.prevent="cancel">
				<template #icon>
					<Close :size="20" decorative title="" />
				</template>
			</ButtonVue>
		</form>
	</div>
</template>
<script>
import ButtonVue from '../Button/index.js'
import { t } from '../../l10n.js'

import ArrowRight from 'vue-material-design-icons/ArrowRight'
import Close from 'vue-material-design-icons/Close'

export default {
	name: 'InputConfirmCancel',

	components: {
		ButtonVue,
		ArrowRight,
		Close,
	},

	props: {
		placeholder: {
			default: '',
			type: String,
		},
		value: {
			default: '',
			type: String,
		},
	},

	data() {
		return {
			labelConfirm: t('Confirm changes'),
			labelCancel: t('Cancel changes'),
		}
	},

	computed: {
		valueModel: {
			get() { return this.value },
			set(newValue) {
				this.$emit('input', newValue)
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

<style lang="scss">
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
		font-size: 100%;
		margin: $input-margin !important;
		margin-left: -1px - $input-padding !important;
		padding: $input-padding !important;

		&:active,
		&:focus,
		&:hover {
			outline: none;
			background-color: var(--color-main-background);
			color: var(--color-text-light);
			border-color: var(--color-primary-element);
		}
	}
}
</style>
