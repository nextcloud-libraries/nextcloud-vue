<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template>
	<li>
		<span class="action-input">
			<!-- icon -->
			<span :class="[isIconUrl ? 'action-input__icon--url' : icon]"
				:style="{ backgroundImage: isIconUrl ? `url(${icon})` : null }"
				class="action-input__icon" />

			<!-- form and input -->
			<form ref="form" class="action-input__form" :disabled="disabled"
				@submit.prevent="onSubmit">
				<input :id="randomId" type="submit" class="action-input__submit">
				<input :type="type" :value="value" :placeholder="text"
					:disabled="disabled" required
					class="action-input__input focusable" @input="onInput">
				<label v-show="!disabled" :for="randomId" class="action-input__label" />
			</form>
		</span>
	</li>
</template>

<script>
import GenRandomId from 'Utils/GenRandomId'

export default {
	name: 'ActionInput',

	props: {
		icon: {
			type: String,
			default: '',
			required: true
		},
		type: {
			type: String,
			default: 'text',
			validator: function(type) {
				return ['date', 'datetime-local', 'month',
					'number', 'password', 'search', 'tel',
					'text', 'time', 'url', 'week'].indexOf(type) > -1
			}
		},
		value: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		isIconUrl() {
			try {
				return new URL(this.icon)
			} catch (error) {
				return false
			}
		},
		text() {
			return this.$slots.default[0].text
		},
		isLongText() {
			return this.text
				? this.text.length > 20
				: 0
		},
		randomId() {
			return GenRandomId()
		}
	},

	methods: {
		onInput(event) {
			this.$emit('input', event)
			this.$emit('update:value', event.target.value)
		},
		onSubmit(event) {
			if (!this.disabled) {
				this.$emit('submit', event)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import '~Fonts/scss/iconfont-vue';
@import '~Assets/inputs';
@import '~Assets/action';
@include action-active;

$input-margin: 4px;

.action-input {
	display: flex;
	align-items: flex-start;

	width: 100%;
	height: auto;
	margin: 0;
	padding: 0;

	cursor: pointer;
	white-space: nowrap;

	opacity: .7;
	color: var(--color-main-text);
	border: 0;
	border-radius: 0; // otherwise Safari will cut the border-radius area
	background-color: transparent;
	box-shadow: none;

	font-weight: normal;
	line-height: $popoveritem-height;

	&:hover,
	&:focus {
		opacity: 1;
	}

	& > span {
		cursor: pointer;
		white-space: nowrap;
	}

	&__icon {
		min-width: 0; /* Overwrite icons*/
		min-height: 0;
		/* Keep padding to define the width to
			assure correct position of a possible text */
		padding: #{$popoveritem-height / 2} 0 #{$popoveritem-height / 2} $popoveritem-height;

		background-position: #{($popoveritem-height - $popovericon-size) / 2} center;
		background-size: $popovericon-size;
	}

	// Forms & text inputs
	&__form {
		display: flex;
		align-items: center;
		flex: 1 1 auto;

		margin: $input-margin 0;
		padding-right: 14px;
	}

	&__submit {
		position: absolute;
		left: -10000px;
		top: auto;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	&__label {
		display: flex;
		align-items: center;
		justify-content: center;

		width: #{$popoveritem-height - $input-margin * 2};
		height: #{$popoveritem-height - $input-margin * 2};
		margin: 0 0 0 -8px;
		padding: 7px 6px;

		cursor: pointer;

		opacity: 1;
		color: var(--color-text-lighter);
		border: 1px solid var(--color-border-dark);
		border-left-color: transparent;
		border-radius: 0 var(--border-radius) var(--border-radius) 0;
		/* Avoid background under border */
		background-color: var(--color-main-background);
		background-clip: padding-box;

		font-size: 16px;

		@include iconfont('confirm');
	}

	/* Inputs inside popover supports text, submit & reset */
	&__input {
		flex: 1 1 auto;

		min-width: $popoveritem-height;
		min-height: #{$popoveritem-height - $input-margin * 2}; /* twice the element margin-y */
		max-height: #{$popoveritem-height - $input-margin * 2}; /* twice the element margin-y */
		margin: 0;

		// if disabled, change cursor
		&:disabled {
			cursor: default;
		}

		/* only show confirm borders if input is not focused */
		&:not(:active):not(:hover):not(:focus) {
			&:invalid {
				& + .action-input__label {
					border-color: var(--color-error);
					border-left-color: transparent;
				}
			}
			&:not(:disabled) + .action-input__label {
				&:active,
				&:hover,
				&:focus {
					border-color: var(--color-primary-element);
					border-radius: var(--border-radius);
				}
			}
		}
		&:active,
		&:hover,
		&:focus {
			&:not(:disabled) + .action-input__label {
				/* above previous input */
				z-index: 2;

				border-color: var(--color-primary-element);
				border-left-color: transparent;
			}
		}
	}
}

</style>
