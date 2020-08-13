<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  - @author Marco Ambrosini <marcoambrosini@pm.me>
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

<docs>
This component is made to be used inside of the [Actions](#Actions) component slots.

```
<Actions>
	<ActionLink icon="icon-external" href="https://nextcloud.com">
		Nextcloud website
	</ActionLink>
</Actions>
```
</docs>

<template>
	<li class="action">
		<a
			:download="download"
			:href="href"
			:aria-label="ariaLabel"
			:target="target"
			class="action-link focusable"
			rel="noreferrer noopener"
			@click="onClick">

			<!-- @slot Manually provide icon -->
			<slot name="icon">
				<span :class="[isIconUrl ? 'action-link__icon--url' : icon]"
					:style="{ backgroundImage: isIconUrl ? `url(${icon})` : null }"
					class="action-link__icon" />
			</slot>

			<!-- long text with title -->
			<p v-if="title">
				<strong class="action-link__title">
					{{ title }}
				</strong>
				<br>
				<!-- white space is shown on longtext, so we can't
				put {{ text }} on a new line for code readability -->
				<span class="action-link__longtext" v-text="text" />
			</p>

			<!-- long text only -->
			<!-- white space is shown on longtext, so we can't
			put {{ text }} on a new line for code readability -->
			<p v-else-if="isLongText"
				class="action-link__longtext"
				v-text="text" />

			<!-- default text display -->
			<span v-else class="action-link__text">{{ text }}</span>

			<!-- fake slot to gather inner text -->
			<slot v-if="false" />
		</a>
	</li>
</template>

<script>
import ActionTextMixin from '../../mixins/actionText'

export default {
	name: 'ActionLink',

	mixins: [ActionTextMixin],

	props: {
		/**
		 * destionation to link to
		 */
		href: {
			type: String,
			default: '#',
			required: true,
			validator: value => {
				// href is either an anchor or a valid url starting with a scheme or a relative path
				try {
					return new URL(value)
				} catch (error) {
					return value.startsWith('#') || value.startsWith('/')
				}
			},
		},
		/**
		 * download the link instead of opening
		 */
		download: {
			type: String,
			default: null,
		},
		/**
		 * target to open the link
		 */
		target: {
			type: String,
			default: '_self',
			validator: value => {
				return ['_blank', '_self', '_parent', '_top'].indexOf(value) > -1
			},
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../assets/action';
@include action-active;
@include action-item('link');

</style>
