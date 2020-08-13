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

```vue
	<Actions>
		<ActionButton icon="icon-delete" @click="alert('Delete')">Delete</ActionButton>
		<ActionButton icon="icon-delete" :close-after-click="true" @click="alert('Delete and close menu')">Delete and close</ActionButton>
		<ActionButton icon="icon-delete" :disabled="true" @click="alert('Disabled')">Disabled button</ActionButton>
	</Actions>
```

If you're using a long text you can specify a title

```vue
	<Actions>
		<ActionButton icon="icon-add" @click="alert('Add')">Add new</ActionButton>
		<ActionButton icon="icon-delete" title="Long button" @click="alert('Delete')">This button is associated with a very long text.\nAnd with new lines too.</ActionButton>
	</Actions>
```
</docs>

<template>
	<li class="action" :class="{ 'action--disabled': disabled }">
		<button
			class="action-button"
			:aria-label="ariaLabel"
			:class="{ focusable: isFocusable }"
			@click="onClick">
			<!-- @slot Manually provide icon -->
			<slot name="icon">
				<span :class="[isIconUrl ? 'action-button__icon--url' : icon]"
					:style="{ backgroundImage: isIconUrl ? `url(${icon})` : null }"
					class="action-button__icon" />
			</slot>

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
				class="action-button__longtext"
				v-text="text" />

			<!-- default text display -->
			<span v-else class="action-button__text">{{ text }}</span>

			<!-- fake slot to gather inner text -->
			<slot v-if="false" />
		</button>
	</li>
</template>

<script>
import ActionTextMixin from '../../mixins/actionText'

/**
 * Button component to be used in Actions
*/
export default {
	name: 'ActionButton',

	mixins: [ActionTextMixin],

	props: {
		/**
		 * disabled state of the action button
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		/**
		 * determines if the action is focusable
		 * @returns {boolean} is the action focusable ?
		 */
		isFocusable() {
			return !this.disabled
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../assets/action';
@include action-active;
@include action--disabled;
@include action-item('button');
</style>
