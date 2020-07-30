<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template>
	<li>
		<!-- If item.href is set, a link will be directly used -->
		<a v-if="item.href"
			:href="(item.href) ? item.href : '#' "
			:target="(item.target) ? item.target : '' "
			:download="item.download"
			class="focusable"
			rel="noreferrer noopener"
			@click="action">
			<span v-if="!iconIsUrl" :class="item.icon" />
			<img v-else :src="item.icon">
			<p v-if="item.text && item.longtext">
				<strong class="menuitem-text">
					{{ item.text }}
				</strong><br>
				<span class="menuitem-text-detail">
					{{ item.longtext }}
				</span>
			</p>
			<span v-else-if="item.text">
				{{ item.text }}
			</span>
			<p v-else-if="item.longtext">
				{{ item.longtext }}
			</p>
		</a>

		<!-- If item.input is set instead, an put will be used -->
		<span v-else-if="item.input" class="menuitem" :class="{active: item.active}">
			<!-- does not show if input is checkbox -->
			<span v-if="item.input !== 'checkbox'" :class="item.icon" />

			<!-- only shows if input is text -->
			<form v-if="item.input === 'text'"
				:class="item.input"
				@submit.prevent="item.action">
				<input :type="item.input"
					:value="item.value"
					:placeholder="item.text"
					required>
				<input type="submit" value="" class="icon-confirm">
			</form>

			<!-- checkbox -->
			<template v-else>
				<input :id="key"
					v-model="item.model"
					:type="item.input"
					:class="item.input"
					@change="item.action">
				<label :for="key" @click.stop.prevent="item.action">
					{{ item.text }}
				</label>
			</template>
		</span>

		<!-- If item.action is set instead, a button will be used -->
		<button v-else-if="item.action"
			class="menuitem focusable"
			:class="{active: item.active}"
			:disabled="item.disabled"
			@click.stop.prevent="item.action">
			<span :class="item.icon" />
			<p v-if="item.text && item.longtext">
				<strong class="menuitem-text">
					{{ item.text }}
				</strong><br>
				<span class="menuitem-text-detail">
					{{ item.longtext }}
				</span>
			</p>
			<span v-else-if="item.text">
				{{ item.text }}
			</span>
			<p v-else-if="item.longtext">
				{{ item.longtext }}
			</p>
		</button>

		<!-- If item.longtext is set AND the item does not have an action -->
		<span v-else class="menuitem" :class="{active: item.active}">
			<span :class="item.icon" />
			<p v-if="item.text && item.longtext">
				<strong class="menuitem-text">
					{{ item.text }}
				</strong><br>
				<span class="menuitem-text-detail">
					{{ item.longtext }}
				</span>
			</p>
			<span v-else-if="item.text">
				{{ item.text }}
			</span>
			<p v-else-if="item.longtext">
				{{ item.longtext }}
			</p>
		</span>
	</li>
</template>

<style scoped>
	button.menuitem {
		text-align: left;
	}

	button.menuitem * {
		cursor: pointer;
	}

	button.menuitem:disabled {
		opacity: 0.5 !important;
		cursor: default;
	}

	button.menuitem:disabled * {
		cursor: default;
	}

	.menuitem.active {
		box-shadow: inset 2px 0 var(--color-primary);
		border-radius: 0;
	}
</style>

<script>
export default {
	name: 'PopoverMenuItem',
	props: {
		item: {
			type: Object,
			required: true,
			default: () => {
				return {
					key: 'nextcloud-link',
					href: 'https://nextcloud.com',
					icon: 'icon-links',
					text: 'Nextcloud',
				}
			},
			// check the input types
			// TODO: add more validation of types
			validator: item => {
				// TODO: support radio
				if (item.input) {
					return ['text', 'checkbox'].indexOf(item.input) !== -1
				}
				return true
			},
		},
	},
	computed: {
		// random key for inputs binding if not provided
		key() {
			return this.item.key
				? this.item.key
				: Math.round(Math.random() * 16 * 1000000).toString(16)
		},
		iconIsUrl() {
			try {
				// eslint-disable-next-line no-new
				new URL(this.item.icon)
				return true
			} catch (_) {
				return false
			}
		},
	},
	methods: {
		// allow us to use both link and an action on `a`
		// we still need to make sure item.action exists
		action(event) {
			if (this.item.action) {
				this.item.action(event)
			}
		},
	},
}
</script>
<style lang="scss" scoped>
li {
	display: flex;
	flex: 0 0 auto;

	&.hidden {
		display: none;
	}

	> button,
	> a,
	> .menuitem {
		cursor: pointer;
		line-height: $clickable-area;
		border: 0;
		border-radius: 0; // otherwise Safari will cut the border-radius area
		background-color: transparent;
		display: flex;
		align-items: flex-start;
		height: auto;
		margin: 0;
		padding: 0;
		font-weight: normal;
		box-shadow: none;
		width: 100%;
		color: var(--color-main-text);
		white-space: nowrap;
		opacity: $opacity_normal;

		// TODO split into individual components for readability
		span[class^='icon-'],
		span[class*=' icon-'],
		&[class^='icon-'],
		&[class*=' icon-'] {
			min-width: 0; /* Overwrite icons*/
			min-height: 0;
			background-position: #{$icon-margin} center;
			background-size: $icon-size;
		}

		span[class^='icon-'],
		span[class*=' icon-'] {
			/* Keep padding to define the width to
				assure correct position of a possible text */
			padding: #{$clickable-area / 2} 0 #{$clickable-area / 2} $clickable-area;
		}

		// If no icons set, force left margin to align
		&:not([class^='icon-']):not([class*='icon-']) {
			> span,
			> input,
			> form {
				&:not([class^='icon-']):not([class*='icon-']):first-child {
					margin-left: $clickable-area;
				}
			}
		}

		&[class^='icon-'],
		&[class*=' icon-'] {
			padding: 0 $icon-margin 0 $clickable-area;
		}

		&:not(:disabled):hover,
		&:not(:disabled):focus,
		&:not(:disabled).active {
			opacity: $opacity_full !important;
		}

		/* prevent .action class to break the design */
		&.action {
			padding: inherit !important;
		}

		> span {
			cursor: pointer;
			white-space: nowrap;
		}

		// long text area
		> p {
			width: 150px;
			line-height: 1.6em;
			padding: 8px 0;
			white-space: normal;
		}

		// TODO: do we really supports it?
		> select {
			margin: 0;
			margin-left: 6px;
		}

		/* Add padding if contains icon+text */
		&:not(:empty) {
			padding-right: $icon-margin !important;
		}

		/* DEPRECATED! old img in popover fallback
			* TODO: to remove */
		> img {
			width: $clickable-area;
			padding: $icon-margin;
		}

		/* checkbox/radio fixes */
		> input.radio + label,
		> input.checkbox + label {
			padding: 0 !important;
			width: 100%;
		}
		> input.checkbox + label::before {
			margin: -2px 13px 0;
		}
		> input.radio + label::before {
			margin: -2px 12px 0;
		}
		> input:not([type=radio]):not([type=checkbox]):not([type=image]) {
			width: 150px;
		}

		// Forms & text inputs
		form {
			display: flex;
			flex: 1 1 auto;
			/* put a small space between text and form
				if there is an element before */
			&:not(:first-child)  {
				margin-left: 5px;
			}
		}
		/* no margin if hidden span before */
		> span.hidden + form,
		> span[style*='display:none'] + form {
			margin-left: 0;
		}
		/* Inputs inside popover supports text, submit & reset */
		input {
			min-width: $clickable-area;
			max-height: #{$clickable-area - 4px}; /* twice the element margin-y */
			margin: 2px 0;
			flex: 1 1 auto;
			// space between inline inputs
			&:not(:first-child) {
				margin-left: 5px;
			}
		}
	}

	// TODO: do that in js, should be cleaner
	/* css hack, only first not hidden */
	&:not(.hidden):not([style*='display:none']) {
		&:first-of-type {
			> button, > a, > .menuitem {
				> form, > input {
					margin-top: $icon-margin - 2px; // minus the input margin
				}
			}
		}
		&:last-of-type {
			> button, > a, > .menuitem {
				> form, > input {
					margin-bottom: $icon-margin - 2px; // minus the input margin
				}
			}
		}
	}
	> button {
		padding: 0;
		span {
			opacity: $opacity_full;
		}
	}
}
</style>
