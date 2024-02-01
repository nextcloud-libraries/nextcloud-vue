<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  - @author Marco Ambrosini <marcoambrosini@icloud.com>
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
	<li class="action" :role="liRole">
		<span class="action-text"
			@click="onClick">
			<!-- @slot Manually provide icon -->
			<slot name="icon">
				<span v-if="icon !== ''"
					:class="[isIconUrl ? 'action-text__icon--url' : icon]"
					aria-hidden="true"
					:style="{ backgroundImage: isIconUrl ? `url(${icon})` : null }"
					class="action-text__icon" />
			</slot>

			<!-- long text with name -->
			<span v-if="name"
				class="action-text__longtext-wrapper">
				<strong class="action-text__name">
					{{ name }}
				</strong>
				<br>
				<!-- white space is shown on longtext, so we can't
				put {{ text }} on a new line for code readability -->
				<span class="action-text__longtext" v-text="text" />
			</span>

			<!-- long text only -->
			<!-- white space is shown on longtext, so we can't
			put {{ text }} on a new line for code readability -->
			<span v-else-if="isLongText"
				class="action-text__longtext"
				v-text="text" />

			<!-- default text display -->
			<span v-else class="action-text__text">{{ text }}</span>

			<!-- fake slot to gather inner text -->
			<slot v-if="false" />
		</span>
	</li>
</template>

<script>
import ActionTextMixin from '../../mixins/actionText.js'
import { useNcActionsContext } from '../NcActions/composables/useNcActionsContext.js'

export default {
	name: 'NcActionText',

	mixins: [ActionTextMixin],

	setup() {
		const { liRole } = useNcActionsContext()
		return {
			liRole,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '../../assets/action';
@include action-active;
@include action-item('text');
@include action--disabled;

.action-text {
	&,
	span {
		cursor: default;
	}
}
</style>
