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

			<button type="submit"
				class="app-navigation-input-confirm__confirm"
				:aria-label="labelConfirm"
				@click.stop.prevent="confirm">
				<ArrowRight :size="20" decorative title="" />
			</button>

			<button type="reset"
				class="app-navigation-input-confirm__close"
				:aria-label="labelCancel"
				@click.stop.prevent="cancel">
				<Close :size="20" decorative title="" />
			</button>
		</form>
	</div>
</template>
<script>
import { t } from '../../l10n'

import ArrowRight from 'vue-material-design-icons/ArrowRight'
import Close from 'vue-material-design-icons/Close'

export default {
	name: 'InputConfirmCancel',

	components: {
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
$input-margin: 3px;

.app-navigation-input-confirm {
	flex: 1 0 100%;
	width: 100%;

	form {
		display: flex;
	}

	&__input {
		height: $input-height;
		flex: 1 1 100%;
		font-size: 14px;
		margin: $input-margin;
		margin-left: 0;
		padding: $input-padding;

		&:active,
		&:focus,
		&:hover {
			outline: none;
			background-color: var(--color-main-background);
			color: var(--color-text-light);
			border-color: var(--color-primary-element);

			+ .app-navigation-input-confirm__confirm {
				border-color: var(--color-primary-element);
				border-left-color: transparent !important;
				border-radius: 0 var(--border-radius) var(--border-radius) 0 !important;
			}
		}
	}

	// submit and cancel buttons
	button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: $clickable-area !important;
		color: var(--color-main-text);
		border-radius: 0;

		// icon hover/focus feedback
		span {
			opacity: $opacity_normal;
		}
		&:hover,
		&:focus {
			span {
				opacity: $opacity_full;
			}
		}
	}

	&__confirm {
		margin-left: -8px;
		border-left-color: transparent !important;
		border-radius: 0 var(--border-radius) var(--border-radius) 0 !important;
		background-clip: padding-box;
		background-color: var(--color-main-background);
		opacity: 1;
		height: $input-height;
		width: $input-height;
		padding: $input-padding;
		cursor: pointer;
		margin-right: 0;

		&:focus,
		&:hover {
			border-radius: var(--border-radius) !important;
			border-color: var(--color-primary-element) !important;
		}
	}

	&__close {
		margin: 0;
		border: none;
		background-color: transparent;
	}
}
</style>
