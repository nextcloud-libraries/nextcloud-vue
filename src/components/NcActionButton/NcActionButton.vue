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
This component is made to be used inside of the [NcActions](#NcActions) component slots.

```vue
	<template>
		<NcActions>
			<NcActionButton @click="showMessage('Delete')">
				<template #icon>
					<Delete :size="20" />
				</template>
				Delete
			</NcActionButton>
			<NcActionButton :close-after-click="true" @click="showMessage('Delete and close menu')">
				<template #icon>
					<Delete :size="20" />
				</template>
				Delete and close
			</NcActionButton>
			<NcActionButton :is-menu="true">
				<template #icon>
					<Plus :size="20" />
				</template>
				Create
			</NcActionButton>
			<NcActionButton :disabled="true" @click="showMessage('Disabled')">
				<template #icon>
					<Delete :size="20" />
				</template>
				Disabled button
			</NcActionButton>
		</NcActions>
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
		},
	}
	</script>
```

If you're using a long text you can specify a name

```vue
	<template>
		<NcActions>
			<NcActionButton @click="showMessage('Add')">
				<template #icon>
					<Plus :size="20" />
				</template>
				Add new
			</NcActionButton>
			<NcActionButton name="Long button" @click="showMessage('Delete')">
				<template #icon>
					<Delete :size="20" />
				</template>
				This button is associated with a very long text.\nAnd with new lines too.
			</NcActionButton>
		</NcActions>
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
		},
	}
	</script>

```

Action icon attribute with a single action

```vue
	<template>
		<NcActions>
			<NcActionButton @click="showMessage('Add')">
				<template #icon>
					<Plus :size="20" />
				</template>
				Add new
			</NcActionButton>
		</NcActions>
	</template>
	<script>
	import Plus from 'vue-material-design-icons/Plus'

	export default {
		components: {
			Plus,
		},
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
	<NcActions>
		<NcActionButton>
			<template #icon>
				<HandBackLeft :size="20" />
			</template>
			Raise left hand
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<HandBackRight :size="20" />
			</template>
			Raise right hand
		</NcActionButton>
	</NcActions>
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

### With different model behavior
By default the button will act like a normal button, but it is also possible to change the behavior to a toggle button, checkbox button or radio button.

For example to have the button act like a toggle button just set the `modelValue` property to the toggle state:

```vue
<template>
	<NcActions>
		<NcActionButton :model-value.sync="fullscreen">
			<template #icon>
				<Fullscreen :size="20" />
			</template>
			Fullscreen
		</NcActionButton>
	</NcActions>
</template>
<script>
import Fullscreen from 'vue-material-design-icons/Fullscreen.vue'

export default {
	components: {
		Fullscreen,
	},
	data() {
		return {
			fullscreen: true,
		}
	},
}
</script>
```

Another example would be using it with checkbox semantics, to enable or disable features.
This also allows tri-state behavior (`true`, `false`, `null`) in which case `aria-checked` will be either `true`, `false` or `mixed`.

```vue
<template>
	<NcActions>
		<NcActionButton :model-value.sync="handRaised" type="checkbox">
			<template #icon>
				<HandBackLeft :size="20" />
			</template>
			Raise hand
		</NcActionButton>
		<NcActionButton :model-value.sync="fullscreen" type="checkbox">
			<template #icon>
				<Fullscreen :size="20" />
			</template>
			Fullscreen
		</NcActionButton>
	</NcActions>
</template>
<script>
import HandBackLeft from 'vue-material-design-icons/HandBackLeft.vue'
import Fullscreen from 'vue-material-design-icons/Fullscreen.vue'

export default {
	components: {
		HandBackLeft,
		Fullscreen,
	},
	data() {
		return {
			fullscreen: true,
			handRaised: false,
		}
	},
}
</script>
```

It is also possible to use the button with radio semantics, this is only possible in menus and not for inline actions!

```vue
<template>
	<NcActions>
		<NcActionButton :model-value.sync="payment" type="radio" value="cash">
			<template #icon>
				<Cash :size="20" />
			</template>
			Pay with cash
		</NcActionButton>
		<NcActionButton :model-value.sync="payment" type="radio" value="card">
			<template #icon>
				<CreditCard :size="20" />
			</template>
			Pay by card
		</NcActionButton>
	</NcActions>
</template>
<script>
import Cash from 'vue-material-design-icons/Cash.vue'
import CreditCard from 'vue-material-design-icons/CreditCard.vue'

export default {
	components: {
		Cash,
		CreditCard,
	},
	data() {
		return {
			payment: 'card',
		}
	},
}
</script>
```
</docs>

<template>
	<li class="action" :class="{ 'action--disabled': disabled }" :role="isInSemanticMenu && 'presentation'">
		<button :aria-label="ariaLabel"
			:class="['action-button button-vue', {
				'action-button--active': isChecked,
				focusable: isFocusable,
			}]"
			:title="title"
			:type="nativeType"
			v-bind="buttonAttributes"
			@click="handleClick">
			<!-- @slot Manually provide icon -->
			<slot name="icon">
				<span :class="[isIconUrl ? 'action-button__icon--url' : icon]"
					:style="{ backgroundImage: isIconUrl ? `url(${icon})` : null }"
					aria-hidden="true"
					class="action-button__icon" />
			</slot>

			<!-- long text with name -->
			<span v-if="name"
				class="action-button__longtext-wrapper">
				<strong class="action-button__name">
					{{ name }}
				</strong>
				<br>
				<!-- white space is shown on longtext, so we can't
					put {{ text }} on a new line for code readability -->
				<span class="action-button__longtext" v-text="text" />
			</span>

			<!-- long text only -->
			<!-- white space is shown on longtext, so we can't
				put {{ text }} on a new line for code readability -->
			<span v-else-if="isLongText"
				class="action-button__longtext"
				v-text="text" />

			<!-- default text display -->
			<span v-else class="action-button__text">{{ text }}</span>

			<!-- right arrow icon when there is a sub-menu -->
			<ChevronRightIcon v-if="isMenu" :size="20" class="action-button__menu-icon" />
			<CheckIcon v-else-if="isChecked === true" :size="20" class="action-button__pressed-icon" />
			<span v-else-if="isChecked === false" class="action-button__pressed-icon material-design-icon" />

			<!-- fake slot to gather inner text -->
			<slot v-if="false" />
		</button>
	</li>
</template>

<script>
import CheckIcon from 'vue-material-design-icons/Check.vue'
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue'
import ActionTextMixin from '../../mixins/actionText.js'

/**
 * Button component to be used in Actions
 */
export default {
	name: 'NcActionButton',

	components: {
		CheckIcon,
		ChevronRightIcon,
	},
	mixins: [ActionTextMixin],

	inject: {
		isInSemanticMenu: {
			from: 'NcActions:isSemanticMenu',
			default: false,
		},
	},

	props: {
		/**
		 * @deprecated To be removed in @nextcloud/vue 9. Migration guide: remove ariaHidden prop from NcAction* components.
		 * @todo Add a check in @nextcloud/vue 9 that this prop is not provided,
		 * otherwise root element will inherit incorrect aria-hidden.
		 */
		ariaHidden: {
			type: Boolean,
			default: null,
		},

		/**
		 * disabled state of the action button
		 */
		disabled: {
			type: Boolean,
			default: false,
		},

		/**
		 * If this is a menu, a chevron icon will
		 * be added at the end of the line
		 */
		isMenu: {
			type: Boolean,
			default: false,
		},

		/**
		 * The button's behavior, by default the button acts like a normal button with optional toggle button behavior if `modelValue` is `true` or `false`.
		 * But you can also set to checkbox button behavior with tri-state or radio button like behavior.
		 * This extends the native HTML button type attribute.
		 */
		type: {
			type: String,
			default: 'button',
			validator: (behavior) => ['button', 'checkbox', 'radio', 'reset', 'submit'].includes(behavior),
		},

		/**
		 * The buttons state if `type` is 'checkbox' or 'radio' (meaning if it is pressed / selected)
		 * Either boolean for checkbox and toggle button behavior or `value` for radio behavior
		 */
		modelValue: {
			type: [Boolean, String],
			default: null,
		},

		/**
		 * The value used for the `modelValue` when this component is used with radio behavior
		 * Similar to the `value` attribute of `<input type="radio">`
		 */
		value: {
			type: String,
			default: null,
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

		/**
		 * The current "checked" or "pressed" state for the model behavior
		 */
		isChecked() {
			if (this.type === 'radio') {
				return this.modelValue === this.value
			}
			return this.modelValue
		},

		/**
		 * The native HTML type to set on the button
		 */
		nativeType() {
			if (this.type === 'submit' || this.type === 'reset') {
				return this.type
			}
			return 'button'
		},

		/**
		 * HTML attributes to bind to the <button>
		 */
		buttonAttributes() {
			const attributes = {}

			if (this.isInSemanticMenu) {
				// By default it needs to be a menu item in semantic menus
				attributes.role = 'menuitem'

				if (this.type === 'radio') {
					attributes.role = 'menuitemradio'
					attributes['aria-checked'] = this.isChecked ? 'true' : 'false'
				} else if (this.type === 'checkbox' || this.modelValue !== null) {
					// either if checkbox behavior was set or the model value is not unset
					attributes.role = 'menuitemcheckbox'
					attributes['aria-checked'] = this.modelValue === null ? 'mixed' : (this.modelValue ? 'true' : 'false')
				}
			} else if (this.modelValue !== null) {
				// In case this has a modelValue it is considered a toggle button, so we need to set the aria-pressed
				attributes['aria-pressed'] = this.modelValue ? 'true' : 'false'
			}

			return attributes
		},
	},

	methods: {
		/**
		 * Forward click event, let mixin handle the close-after-click and emit new modelValue if needed
		 * @param {MouseEvent} event The click event
		 */
		handleClick(event) {
			this.onClick(event)
			// If modelValue or type is set (so modelValue might be null for tri-state) we need to update it
			if (this.modelValue !== null || this.type !== 'button') {
				if (this.type === 'radio') {
					if (!this.isChecked) {
						this.$emit('update:modelValue', this.value)
					}
				} else {
					this.$emit('update:modelValue', !this.isChecked)
				}
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../assets/action';
@include action-active;
@include action--disabled;
@include action-item('button');

.action-button__pressed-icon {
	margin-left: auto;
	margin-right: -$icon-margin;
}
</style>
