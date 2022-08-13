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

<docs>
This component is made to be used inside of the [Actions](#Actions) component slots.

```vue
	<template>
		<div style="display: flex; align-items: center;">
			<Actions>
				<ActionButton @click="showMessage('Delete')">
					<template #icon>
						<Delete :size="20" />
					</template>
					Delete
				</ActionButton>
				<ActionButton :close-after-click="true" @click="showMessage('Delete and close menu')">
					<template #icon>
						<Delete :size="20" />
					</template>
					Delete and close
				</ActionButton>
				<ActionButton :close-after-click="true" @click="focusInput">
					<template #icon>
						<Plus :size="20" />
					</template>
					Create
				</ActionButton>
				<ActionButton :disabled="true" @click="showMessage('Disabled')">
					<template #icon>
						<Delete :size="20" />
					</template>
					Disabled button
				</ActionButton>
			</Actions>
			<input ref="input" />
		</div>
	</template>
	<script>
	import Delete from 'vue-material-design-icons/Delete'
	import Plus from 'vue-material-design-icons/Plus'

	export default {
		components: {
			Delete,
			Plus,
		},
		methods: {
			showMessage(msg) {
				alert(msg)
			},
			focusInput() {
				this.$nextTick(() => this.$refs.input.focus())
			},
		},
	}
	</script>
```

If you're using a long text you can specify a title

```vue
	<template>
		<Actions>
			<ActionButton icon="icon-add" @click="showMessage('Add')">
				Add new
			</ActionButton>
			<ActionButton title="Long button" @click="showMessage('Delete')">
				<template #icon>
					<Delete :size="20" />
				</template>
				This button is associated with a very long text.\nAnd with new lines too.
			</ActionButton>
		</Actions>
	</template>
	<script>
	import Delete from 'vue-material-design-icons/Delete'

	export default {
		components: {
			Delete,
		},
		methods: {
			showMessage(msg) {
				alert(msg)
			},
		},
	}
	</script>

```

Action icon attribute with a single action

```vue
	<template>
		<Actions>
			<ActionButton icon="icon-add" @click="showMessage('Add')">
				Add new
			</ActionButton>
		</Actions>
	</template>
	<script>
	export default {
		methods: {
			showMessage(msg) {
				alert(msg)
			},
		},
	}
	</script>

```

You can also use a custom icon, for example from the vue-material-design-icons library:

```vue
<template>
	<Actions>
		<ActionButton>
			<template #icon>
				<HandBackLeft :size="20" />
			</template>
			Raise left hand
		</ActionButton>
		<ActionButton>
			<template #icon>
				<HandBackRight :size="20" />
			</template>
			Raise right hand
		</ActionButton>
	</Actions>
</template>
<script>
import HandBackLeft from 'vue-material-design-icons/HandBackLeft'
import HandBackRight from 'vue-material-design-icons/HandBackRight'

export default {
	components: {
		HandBackLeft,
		HandBackRight,
	},
}
</script>
```
</docs>

<template>
	<li class="action" role="presentation" :class="{ 'action--disabled': disabled }">
		<button class="action-button"
			:class="{ focusable: isFocusable }"
			:aria-label="ariaLabel"
			role="menuitem"
			type="button"
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
import ActionTextMixin from '../../mixins/actionText.js'

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
		 *
		 * @return {boolean} is the action focusable ?
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
