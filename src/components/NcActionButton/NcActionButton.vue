<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
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
	import Delete from 'vue-material-design-icons/Delete.vue'
	import Plus from 'vue-material-design-icons/Plus.vue'

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
	import Delete from 'vue-material-design-icons/Delete.vue'
	import Plus from 'vue-material-design-icons/Plus.vue'

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
	import Plus from 'vue-material-design-icons/Plus.vue'

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
import HandBackLeft from 'vue-material-design-icons/HandBackLeft.vue'
import HandBackRight from 'vue-material-design-icons/HandBackRight.vue'

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

With a string `modelValue`, checked state is determined by the `value` property and updates `modelValue` with the new `value` string.

With a boolean `modelValue`, checked state is determined by `modelValue` and updates to `true` on check.

Note: unlike native radio buttons, `NcActionButton` are not grouped by name, so you need to connect them by bind correct `modelValue``.

```vue
<template>
	<div>
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
			<NcActionSeparator />
			<NcActionButton type="radio" :model-value="align.isLeft" @update:modelValue="setAlign('Left', $event)">
				<template #icon>
					<FormatAlignLeft :size="20" />
				</template>
				Left
			</NcActionButton>
			<NcActionButton type="radio" :model-value="align.isCenter" @update:modelValue="setAlign('Center', $event)">
				<template #icon>
					<FormatAlignCenter :size="20" />
				</template>
				Center
			</NcActionButton>
			<NcActionButton type="radio" :model-value="align.isRight" @update:modelValue="setAlign('Right', $event)">
				<template #icon>
					<FormatAlignRight :size="20" />
				</template>
				Right
			</NcActionButton>
		</NcActions>
		<p>payment = "{{ payment }}"</p>
		<p>align.isLeft = {{ align.isLeft }}</p>
		<p>align.isCenter = {{ align.isCenter }}</p>
		<p>align.isRight = {{ align.isRight }}</p>
	</div>
</template>
<script>
import Cash from 'vue-material-design-icons/Cash.vue'
import CreditCard from 'vue-material-design-icons/CreditCard.vue'
import FormatAlignLeft from 'vue-material-design-icons/FormatAlignLeft.vue'
import FormatAlignCenter from 'vue-material-design-icons/FormatAlignCenter.vue'
import FormatAlignRight from 'vue-material-design-icons/FormatAlignRight.vue'

export default {
	components: {
		Cash,
		CreditCard,
		FormatAlignLeft,
		FormatAlignCenter,
		FormatAlignRight,
	},
	data() {
		return {
			payment: 'card',
			align: {
				isLeft: false,
				isCenter: true,
				isRight: false,
			},
		}
	},
	methods: {
		setAlign(direction, value) {
			this.align.isLeft = false
			this.align.isCenter = false
			this.align.isRight = false
			this.align[`is${direction}`] = value
		},
	}
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
			:disabled="disabled"
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

			<!-- right(in LTR) or left(in RTL) arrow icon when there is a sub-menu -->
			<ChevronRightIcon v-if="isMenu && !isRTL" :size="20" class="action-button__menu-icon" />
			<ChevronLeftIcon v-else-if="isMenu && isRTL" :size="20" class="action-button__menu-icon" />
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
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft.vue'
import ActionTextMixin from '../../mixins/actionText.js'
import { isRTL } from '@nextcloud/l10n'

/**
 * Button component to be used in Actions
 */
export default {
	name: 'NcActionButton',

	components: {
		CheckIcon,
		ChevronRightIcon,
		ChevronLeftIcon,
	},
	setup() {
		return {
			isRTL: isRTL(),
		}
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
		 * The buttons state if `type` is 'checkbox' or 'radio' (meaning if it is pressed / selected).
		 * For checkbox and toggle button behavior - boolean value.
		 * For radio button behavior - could be a boolean checked or a string with the value of the button.
		 * Note: Unlike native radio buttons, NcActionButton are not grouped by name, so you need to connect them by bind correct modelValue.
		 *
		 *  **This is not availabe for `type='submit'` or `type='reset'`**
		 *
		 * If using `type='checkbox'` a `model-value` of `true` means checked, `false` means unchecked and `null` means indeterminate (tri-state)
		 * For `type='radio'` `null` is equal to `false`
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
			if (this.type === 'radio' && typeof this.modelValue !== 'boolean') {
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
				} else if (this.type === 'checkbox' || (this.nativeType === 'button' && this.modelValue !== null)) {
					// either if checkbox behavior was set or the model value is not unset
					attributes.role = 'menuitemcheckbox'
					attributes['aria-checked'] = this.modelValue === null ? 'mixed' : (this.modelValue ? 'true' : 'false')
				}
			} else if (this.modelValue !== null && this.nativeType === 'button') {
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
					if (typeof this.modelValue !== 'boolean') {
						// String-value radios behavior is similar to native - click on checked radio does nothing
						if (!this.isChecked) {
							this.$emit('update:modelValue', this.value)
						}
					} else {
						// Boolean radio allows to uncheck
						this.$emit('update:modelValue', !this.isChecked)
					}
				} else {
					// Checkbox toggles value
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
	margin-inline: auto calc($icon-margin * -1);
}
</style>
