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
	<button class="action-button focusable" :disabled="disabled" @click="onClick">
		<!-- icon -->
		<span :class="[isIconUrl ? 'action-button__icon--url' : icon]"
			:style="{ backgroundImage: isIconUrl ? `url(${icon})` : null }"
			class="action-button__icon" />

		<!-- long text with title -->
		<p v-if="title">
			<strong class="action-button__title">
				{{ title }}
			</strong>
			<br>
			<!-- white space is shown on longtext, so we can't
				put {{ text }} on a new line for code readability -->
			<span class="action-button__longtext" v-text="text" />
		</p>

		<!-- long text only -->
		<!-- white space is shown on longtext, so we can't
			put {{ text }} on a new line for code readability -->
		<p v-else-if="isLongText"
			class="action-button__longtext" v-text="text" />

		<!-- default text display -->
		<span v-else class="action-button__text">{{ text }}</span>

		<!-- fake slot to gather inner text -->
		<slot v-if="false" />
	</button>
</template>

<script>
export default {
	name: 'ActionButton',

	props: {
		icon: {
			type: String,
			default: '',
			required: true
		},
		title: {
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
		}
	},

	methods: {
		onClick(event) {
			this.$emit('click', event)
		}
	}
}
</script>

<style lang="scss" scoped>
.action-button {
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

	// long text area
	p {
		width: 150px;
		padding: 8px 0;

		cursor: pointer;
		text-align: left;

		line-height: 1.6em;
	}

	&__longtext {
		cursor: pointer;
		// allow the use of `\n`
		white-space: pre;
	}

	&__title {
		font-weight: bold;
	}
}

</style>
