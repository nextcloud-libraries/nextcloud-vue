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
	<a :href="href"
		class="action-link focusable"
		rel="noreferrer noopener">

		<!-- icon -->
		<span :class="[isIconUrl ? 'action-link__icon--url' : icon]"
			:style="{ backgroundImage: isIconUrl ? `url(${icon})` : null }"
			class="action-link__icon" />

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
			class="action-link__longtext" v-text="text" />

		<!-- default text display -->
		<span v-else class="action-link__text">{{ text }}</span>

		<!-- fake slot to gather inner text -->
		<slot v-if="false" />
	</a>
</template>

<script>
import ActionMixin from 'Mixins/action'

export default {
	name: 'ActionLink',

	mixins: [ActionMixin],

	props: {
		href: {
			type: String,
			default: '#',
			required: true
		}
	}
}
</script>

<style lang="scss" scoped>
@import '../../assets/action';
@include action-item(link);
</style>
