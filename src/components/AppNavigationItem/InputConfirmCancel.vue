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
	<div class="app-navigation-entry__inline-input-container">
		<form @submit.prevent="confirm" @keydown.esc.exact.prevent="cancel" @click.stop.prevent>
			<input ref="input"
				v-model="valueModel"
				type="text"
				class="app-navigation-entry__inline-input"
				:placeholder="placeholder">
			<button type="submit"
				class="icon-confirm"
				@click.stop.prevent="confirm" />
			<button type="reset"
				class="icon-close"
				@click.stop.prevent="cancel" />
		</form>
	</div>
</template>
<script>
export default {
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
@import '../../fonts/scss/iconfont-vue';

.app-navigation-entry__inline-input-container {
	flex: 1 0 100%;
	width: 100%;
	form {
		display: flex;
		.app-navigation-entry__inline-input {
			flex: 1 1 100%;
			font-size: 14px;
		}

		// submit and cancel buttons
		button {
			display: flex;
			align-items: center;
			justify-content: center;
			width: $clickable-area !important;
			color: var(--color-main-text);
			background: none;
			font-size: 16px;

			// icon hover/focus feedback
			&::before {
				opacity: $opacity_normal;
			}
			&:hover,
			&:focus {
				&::before {
					opacity: $opacity_full;
				}
			}

			&.icon-confirm {
				@include iconfont('confirm');
				border-left: none;
			}
			&.icon-confirm:hover {
				border-radius: 0px var(--border-radius) var(--border-radius) 0px !important;
			}

			&.icon-close {
				@include iconfont('close');
			}
		}
		.icon-close {
			margin: 0;
			border: none;
			background-color: transparent;
		}
	}
}
</style>
