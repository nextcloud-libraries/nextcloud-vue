<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description
General purpose button component. See props for different options.
[Use material design icons only for icons](https://www.npmjs.com/package/vue-material-design-icons) and remember to set their size to 20.

### Usage
### Custom icon slot
To be used with `vue-material-design-icons` only. For icon classes use the `default-icon` slot.
It can be used with one or multiple actions.
```
<template>
<div class="wrapper">
	<!-- Style selector -->
	<div class="grid">
		<NcCheckboxRadioSwitch :checked.sync="style" value="text" name="style" type="radio">Text only</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="style" value="icon" name="style" type="radio">Icon only</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="style" value="icontext" name="style" type="radio">Icon and text</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="disabled" type="checkbox">Disabled</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="size" value="small" name="size" type="radio">Small</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="size" value="normal" name="size" type="radio">Normal (default)</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="size" value="large" name="size" type="radio">Large</NcCheckboxRadioSwitch>
	</div>

	<h5>Standard buttons</h5>
	<div class="grid">
		<p>Tertiary, no background</p>
		<p>Tertiary</p>
		<p>Secondary</p>
		<p>Primary</p>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:size="size"
			type="tertiary-no-background">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
			<template v-if="style.indexOf('text') !== -1">Example text</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:size="size"
			type="tertiary">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
			<template v-if="style.indexOf('text') !== -1">Example text</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:size="size">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
			<template v-if="style.indexOf('text') !== -1">Example text</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:size="size"
			type="primary">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
			<template v-if="style.indexOf('text') !== -1">Example text</template>
		</NcButton>
	</div>

	<!-- Wide button -->
	<h5>Wide button</h5>
	<NcButton
		:disabled="disabled"
		:size="size"
		:wide="true"
		text="Example text">
		<template #icon>
			<Video
				:size="20" />
		</template>
		Example text
	</NcButton>

	<!-- Special buttons -->
	<h5>Special buttons</h5>
	<div class="grid">
		<p>Success</p>
		<p>Warning</p>
		<p>Error</p>
		<p> - </p>
		<NcButton
			:disabled="disabled"
			:size="size"
			type="success">
			<template #icon>
				<Video
					:size="20" />
			</template>
			Example text
		</NcButton>
		<NcButton
			:disabled="disabled"
			:size="size"
			type="warning">
			<template #icon>
				<Video
					:size="20" />
			</template>
			Example text
		</NcButton>
		<NcButton
			:disabled="disabled"
			:size="size"
			type="error">
			<template #icon>
				<Video
					:size="20" />
			</template>
			Example text
		</NcButton>
		<p> - </p>
	</div>
</div>

</template>
<script>
import Video from 'vue-material-design-icons/Video.vue'

export default {
	components: {
		Video,
	},
	data() {
		return {
			toggled: false,
			disabled: false,
			size: 'normal',
			style: 'icontext',
		}
	}
}
</script>

<style lang="scss" scoped>
.wrapper {
	padding: 0 12px;
}

.grid {
	display: grid;
	gap: 12px;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: repeat(auto-fill, auto);
	position: relative;
	margin: 12px 0;
}

h5 {
	font-weight: bold;
	margin: 40px 0 20px 0;
}

p {
	text-align: center;
	margin: 4px 0 12px 0;
	color: var(--color-text-maxcontrast)
}

button {
	margin: auto;
}
</style>
```

### Alignment
Sometimes it is required to change the icon alignment on the button, like for switching between pages as in following example:

```vue
<template>
	<div style="display: flex; flex-direction: column; gap: 12px;">
		<NcButton aria-label="center (default)" type="secondary" wide>
			<template #icon>
				<IconLeft :size="20" />
			</template>
			center (default)
		</NcButton>
		<NcButton alignment="center-reverse" aria-label="center-reverse" type="secondary" wide>
			<template #icon>
				<IconRight :size="20" />
			</template>
			center-reverse
		</NcButton>
		<div style="display: flex; gap: 12px;">
			<div style="display: flex; flex-direction: column; gap: 12px; flex: 1">
				<NcButton alignment="start" aria-label="start" type="secondary" wide>
					<template #icon>
						<IconLeft :size="20" />
					</template>
					start
				</NcButton>
				<NcButton alignment="start-reverse" aria-label="start-reverse" type="secondary" wide>
					<template #icon>
						<IconRight :size="20" />
					</template>
					start-reverse
				</NcButton>
			</div>
			<div style="display: flex; flex-direction: column; gap: 12px; flex: 1">
				<NcButton alignment="end" aria-label="end" type="secondary" wide>
					<template #icon>
						<IconLeft :size="20" />
					</template>
					end
				</NcButton>
				<NcButton alignment="end-reverse" aria-label="end-reverse" type="secondary" wide>
					<template #icon>
						<IconRight :size="20" />
					</template>
					end-reverse
				</NcButton>
			</div>
		</div>
	</div>
</template>
<script>
import IconLeft from 'vue-material-design-icons/ArrowLeft.vue'
import IconRight from 'vue-material-design-icons/ArrowRight.vue'

export default {
	components: {
		IconLeft,
		IconRight,
	},
}
</script>
```

### Pressed state

It is possible to make the button stateful by adding a pressed state, e.g. if you like to create a favorite button.
The button will have the required `aria` attribute for accessibility and visual style (`primary` when pressed, and the configured type otherwise).

Do not change `text` or `aria-label` of the pressed/unpressed button. See: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed

```vue
<template>
	<div>
		<div style="display: flex; gap: 12px;">
			<NcButton :pressed.sync="isFavorite" aria-label="Favorite" type="tertiary-no-background">
				<template #icon>
					<IconStar v-if="isFavorite" :size="20" />
					<IconStarOutline v-else :size="20" />
				</template>
			</NcButton>

			<NcButton :pressed.sync="isFavorite" type="tertiary">
				<template #icon>
					<IconStar v-if="isFavorite" :size="20" />
					<IconStarOutline v-else :size="20" />
				</template>
				Favorite
			</NcButton>

			<NcButton :pressed.sync="isFavorite" aria-label="Favorite">
				<template #icon>
					<IconStar v-if="isFavorite" :size="20" />
					<IconStarOutline v-else :size="20" />
				</template>
			</NcButton>
		</div>
		<div>
			It is {{ isFavorite ? 'a' : 'not a' }} favorite.
		</div>
	</div>
</template>
<script>
import IconStar from 'vue-material-design-icons/Star.vue'
import IconStarOutline from 'vue-material-design-icons/StarOutline.vue'

export default {
	components: {
		IconStar,
		IconStarOutline,
	},
	data() {
		return {
			isFavorite: false,
		}
	},
	methods: {
		toggleFavorite() {
			this.isFavorite = !this.isFavorite
		},
	},
}
</script>
```

### Usage example: Sorting table columns
The standard way to implement sortable table column headers should be like this:

```vue
<template>
	<table>
		<thead>
			<tr>
				<th :aria-sorted="sortedName" class="row-name">
					<NcButton alignment="start-reverse"
						:wide="true"
						type="tertiary"
						@click="sortName">
						<template #icon>
							<IconDown v-if="sortedName === 'ascending'" class="sort-icon" :size="20" />
							<IconUp v-else-if="sortedName === 'descending'" class="sort-icon" :size="20" />
						</template>
						<span class="table-header">Name</span>
					</NcButton>
				</th>
				<th :aria-sorted="sortedSize" class="row-size">
					<NcButton alignment="end"
						:wide="true"
						type="tertiary"
						@click="sortSize">
						<template #icon>
							<IconDown v-if="sortedSize === 'ascending'" class="sort-icon" :size="20" />
							<IconUp v-else-if="sortedSize === 'descending'" class="sort-icon" :size="20" />
						</template>
						<span class="table-header">Size</span>
					</NcButton>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="row-name">Lorem ipsum</td>
				<td class="row-size">8 MiB</td>
			</tr>
		</tbody>
	</table>
</template>
<script>
import IconUp from 'vue-material-design-icons/MenuUp.vue'
import IconDown from 'vue-material-design-icons/MenuDown.vue'

export default {
	components: {
		IconUp,
		IconDown,
	},
	data() {
		return {
			sortedName: null,
			sortedSize: null,
		}
	},
	methods: {
		sortName() {
			if (this.sortedName === 'ascending') {
				this.sortedName = 'descending'
			} else if (this.sortedName === 'descending') {
				this.sortedName = null
			} else {
				this.sortedName = 'ascending'
			}
		},
		sortSize() {
			if (this.sortedSize === 'ascending') {
				this.sortedSize = 'descending'
			} else if (this.sortedSize === 'descending') {
				this.sortedSize = null
			} else {
				this.sortedSize = 'ascending'
			}
		},
	},
}
</script>
<style>
table {
	table-layout: fixed;
	width: 300px;
}

td.row-name {
	padding-inline-start: 16px;
}

td.row-size {
	text-align: end;
	padding-inline-end: 16px;
}

.table-header {
	font-weight: normal;
	color: var(--color-text-maxcontrast);
}

.sort-icon {
	color: var(--color-text-maxcontrast);
	position: relative;
	inset-inline: -10px;
}

.row-size .sort-icon {
	inset-inline: 10px;
}
</style>
```

</docs>

<script>

export default {
	name: 'NcButton',

	inject: {
		getNcPopoverTriggerAttrs: {
			from: 'NcPopover:trigger:attrs',
			default: () => () => ({}),
		},
	},

	props: {
		/**
		 * Set the text and icon alignment
		 *
		 * @default 'center'
		 */
		alignment: {
			type: String,
			default: 'center',
			validator: (alignment) => ['start', 'start-reverse', 'center', 'center-reverse', 'end', 'end-reverse'].includes(alignment),
		},

		/**
		 * Toggles the disabled state of the button on and off.
		 */
		disabled: {
			type: Boolean,
			default: false,
		},

		/**
		 * Specify the button size
		 * Accepted values: `'small'`, `'normal'` (default), `'large'`
		 */
		size: {
			type: String,
			default: 'normal',
			validator(value) {
				return ['small', 'normal', 'large'].includes(value)
			},
		},

		/**
		 * Specifies the button type
		 * Accepted values: primary, secondary, tertiary, tertiary-no-background, tertiary-on-primary, error, warning, success. If left empty,
		 * the default button style will be applied.
		 */
		type: {
			type: String,
			validator(value) {
				return ['primary', 'secondary', 'tertiary', 'tertiary-no-background', 'tertiary-on-primary', 'error', 'warning', 'success'].includes(value)
			},
			default: 'secondary',
		},

		/**
		 * Specifies the button native type
		 * Accepted values: submit, reset, button. If left empty,
		 * the default "button" type will be used.
		 */
		nativeType: {
			type: String,
			validator(value) {
				return ['submit', 'reset', 'button'].indexOf(value) !== -1
			},
			default: 'button',
		},

		/**
		 * Specifies whether the button should span all the available width.
		 * By default, buttons span the whole width of the container.
		 */
		wide: {
			type: Boolean,
			default: false,
		},

		/**
		 * Always try to provide an aria-label to your button. Make it more
		 * specific than the button's name by provide some more context. E.g. if
		 * the name of the button is "send" in the Mail app, the aria label could
		 * be "Send email".
		 */
		ariaLabel: {
			type: String,
			default: null,
		},

		/**
		 * Providing the href attribute turns the button component into an `a`
		 * element.
		 */
		href: {
			type: String,
			default: null,
		},

		/**
		 * Target for the `a` element if `href` is set.
		 */
		target: {
			type: String,
			default: '_self',
		},

		/**
		 * Providing the download attribute with href downloads file when clicking.
		 */
		download: {
			type: String,
			default: null,
		},

		/**
		 * Providing the to attribute turns the button component into a `router-link`
		 * element. Takes precedence over the href attribute.
		 */
		to: {
			type: [String, Object],
			default: null,
		},

		/**
		 * Pass in `true` if you want the matching behaviour of `router-link` to
		 * be non-inclusive: https://router.vuejs.org/api/#exact
		 */
		exact: {
			type: Boolean,
			default: false,
		},
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
		 * The pressed state of the button if it has a checked state
		 * This will add the `aria-pressed` attribute and for the button to have the primary style in checked state.
		 *
		 * Pressed state is not supported for links
		 */
		pressed: {
			type: Boolean,
			default: null,
		},
	},

	emits: ['update:pressed', 'click'],

	computed: {
		/**
		 * The real type to be used for the button, enforces `primary` for pressed state and, if stateful button, any other type for not pressed state
		 * Otherwise the type property is used.
		 */
		realType() {
			// Force *primary* when pressed
			if (this.pressed) {
				return 'primary'
			}
			// If not pressed but button is configured as stateful button then the type must not be primary
			if (this.pressed === false && this.type === 'primary') {
				return 'secondary'
			}
			return this.type
		},

		/**
		 * The flexbox alignment of the button content
		 */
		flexAlignment() {
			return this.alignment.split('-')[0]
		},

		/**
		 * If the button content should be reversed (icon on the end)
		 */
		isReverseAligned() {
			return this.alignment.includes('-')
		},

		ncPopoverTriggerAttrs() {
			return this.getNcPopoverTriggerAttrs()
		},
	},

	/**
	 * The render function to display the component
	 *
	 * @param {Function} h The function to create VNodes
	 * @return {object|undefined} The created VNode
	 */
	render(h) {
		const hasText = !!this.$slots.default
		const hasIcon = this.$slots?.icon

		/**
		 * Always fill either the text prop or the ariaLabel one.
		 */
		if (!hasText && !this.ariaLabel) {
			console.warn('You need to fill either the text or the ariaLabel props in the button component.', {
				text: this.$slots.default?.[0]?.text,
				ariaLabel: this.ariaLabel,
			},
			this)
		}

		const isLink = (this.to || this.href)

		const hasPressed = !isLink && typeof this.pressed === 'boolean'

		const renderButton = ({ href, navigate, isActive, isExactActive } = {}) => h(isLink ? 'a' : 'button',
			{
				class: [
					'button-vue',
					`button-vue--size-${this.size}`,
					{
						'button-vue--icon-only': hasIcon && !hasText,
						'button-vue--text-only': hasText && !hasIcon,
						'button-vue--icon-and-text': hasIcon && hasText,
						[`button-vue--vue-${this.realType}`]: this.realType,
						'button-vue--wide': this.wide,
						[`button-vue--${this.flexAlignment}`]: this.flexAlignment !== 'center',
						'button-vue--reverse': this.isReverseAligned,
						active: isActive,
						'router-link-exact-active': isExactActive,
					},
				],
				attrs: {
					'aria-label': this.ariaLabel,
					'aria-pressed': hasPressed ? this.pressed.toString() : undefined,
					disabled: this.disabled,
					type: isLink ? null : this.nativeType,
					role: isLink ? 'button' : null,
					href: this.to ? href : (this.href || null),
					target: isLink ? (this.target || '_self') : null,
					rel: isLink ? 'nofollow noreferrer noopener' : null,
					download: (!this.to && this.href && this.download) ? this.download : null,
					// If this button is used as a popover trigger, we need to apply trigger attrs, e.g. aria attributes
					...this.ncPopoverTriggerAttrs,
					// Inherit all the component attrs
					...this.$attrs,
				},
				on: {
					...this.$listeners,
					click: ($event) => {
						if (hasPressed) {
							/**
							 * Update the current pressed state of the button (if the `pressed` property was configured)
							 *
							 * @property {boolean} newValue The new `pressed`-state
							 */
							this.$emit('update:pressed', !this.pressed)
						}
						// We have to both navigate and emit the click event
						this.$emit('click', $event)
						navigate?.($event)
					},
				},
			},
			[
				h('span', { class: 'button-vue__wrapper' }, [
					hasIcon
						? h('span', {
							class: 'button-vue__icon',
							attrs: {
								'aria-hidden': 'true',
							},
						},
						[this.$slots.icon],
						)
						: null,
					hasText ? h('span', { class: 'button-vue__text' }, [this.$slots.default]) : null,
				]),
			],
		)

		// If we have a router-link, we wrap the button in it
		if (this.to) {
			return h('router-link', {
				props: {
					custom: true,
					to: this.to,
					exact: this.exact,
				},
				scopedSlots: {
					default: renderButton,
				},
			})
		}
		// Otherwise we simply return the button
		return renderButton()
	},
}

</script>

<style lang="scss" scoped>
.button-vue {
	// Setup different button sizes
	--button-size: var(--default-clickable-area);
	--button-radius: var(--border-radius-element, calc(var(--button-size) / 2));
	--button-padding: clamp(var(--default-grid-baseline), var(--button-radius), calc(var(--default-grid-baseline) * 4));

	&--size-small {
		--button-size: var(--clickable-area-small, 24px);
		--button-radius: var(--border-radius); // make the border radius even smaller for small buttons
	}

	&--size-large {
		--button-size: var(--clickable-area-large, 48px);
	}

	// General styles
	position: relative;
	width: fit-content;
	overflow: hidden;
	border: 0;
	padding: 0;
	font-size: var(--default-font-size);
	font-weight: bold;
	min-height: var(--button-size);
	min-width: var(--button-size);
	display: flex;
	align-items: center;
	justify-content: center;

	// Cursor pointer on element and all children
	cursor: pointer;
	& *,
	span {
		cursor: pointer;
	}
	border-radius: var(--button-radius);
	transition-property: color, border-color, background-color;
	transition-duration: 0.1s;
	transition-timing-function: linear;

	// No outline feedback for focus. Handled with a toggled class in js (see data)
	&:focus {
		outline: none;
	}

	&:disabled {
		cursor: default;
		& * {
			cursor: default;
		}
		opacity: $opacity_disabled;
		// Gives a wash out effect
		filter: saturate($opacity_normal);
	}

	// Default button type
	color: var(--color-primary-element-light-text);
	background-color: var(--color-primary-element-light);
	&:hover:not(:disabled) {
		background-color: var(--color-primary-element-light-hover);
	}

	// Back to the default color for this button when active
	// TODO: add ripple effect
	&:active {
		background-color: var(--color-primary-element-light);
	}

	&__wrapper {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	&--end &__wrapper {
		justify-content: end;
	}
	&--start &__wrapper {
		justify-content: start;
	}
	&--reverse &__wrapper {
		flex-direction: row-reverse;
	}

	&--reverse#{&}--icon-and-text {
		padding-inline: var(--button-padding) var(--default-grid-baseline);
	}

	&__icon {
		height: var(--button-size);
		width: var(--button-size);
		min-height: var(--button-size);
		min-width: var(--button-size);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	// For small buttons we need to adjust the icon size
	&--size-small &__icon {
		:deep(> *) {
			max-height: 16px;
			max-width: 16px;
		}
		:deep(svg) {
			height: 16px;
			width: 16px;
		}
	}

	&__text {
		font-weight: bold;
		margin-bottom: 1px;
		padding: 2px 0;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	// Icon-only button
	&--icon-only {
		line-height: 1;
		width: var(--button-size) !important;
	}

	// Text-only button
	&--text-only {
		padding: 0 var(--button-padding);
		& .button-vue__text {
			margin-left: 4px;
			margin-right: 4px;
		}
	}

	// Icon and text button
	&--icon-and-text {
		// icon and text means the icon adds "visual" padding thus we need to adjust the text padding
		--button-padding: min(calc(var(--default-grid-baseline) + var(--button-radius)), calc(var(--default-grid-baseline) * 4));
		// Adjust padding as the icon already got some padding we need to reduce the padding on the icon side and only add larger padding to the text side
		padding-block: 0;
		padding-inline: var(--default-grid-baseline) var(--button-padding);
	}

	// Wide button spans the whole width of the container
	&--wide {
		width: 100%;
	}

	&:focus-visible {
		outline: 2px solid var(--color-main-text) !important;
		box-shadow: 0 0 0 4px var(--color-main-background) !important;
		&.button-vue--vue-tertiary-on-primary {
			outline: 2px solid var(--color-primary-element-text);
			border-radius: var(--border-radius-element, var(--border-radius));
			background-color: transparent;
		}
	}

	// Button types

	// Primary
	&--vue-primary {
		background-color: var(--color-primary-element);
		color: var(--color-primary-element-text);
		&:hover:not(:disabled) {
			background-color: var(--color-primary-element-hover);
		}
		// Back to the default color for this button when active
		// TODO: add ripple effect
		&:active {
			background-color: var(--color-primary-element);
		}
	}

	// Secondary
	&--vue-secondary {
		color: var(--color-primary-element-light-text);
		background-color: var(--color-primary-element-light);
		&:hover:not(:disabled) {
			color: var(--color-primary-element-light-text);
			background-color: var(--color-primary-element-light-hover);
		}
	}

	// Tertiary
	&--vue-tertiary {
		color: var(--color-main-text);
		background-color: transparent;
		&:hover:not(:disabled) {
			background-color: var(--color-background-hover);
		}
	}

	// Tertiary, no background
	&--vue-tertiary-no-background {
		color: var(--color-main-text);
		background-color: transparent;
		&:hover:not(:disabled) {
			background-color: transparent;
		}
	}

	// Tertiary on primary color (like the header)
	&--vue-tertiary-on-primary {
		color: var(--color-primary-element-text);
		background-color: transparent;

		&:hover:not(:disabled) {
			background-color: transparent;
		}
	}

	// Success
	&--vue-success {
		background-color: var(--color-success);
		color: white;
		&:hover:not(:disabled) {
			background-color: var(--color-success-hover);
		}
		// Back to the default color for this button when active
		// : add ripple effect
		&:active {
			background-color: var(--color-success);
		}
	}

	// Warning
	&--vue-warning {
		background-color: var(--color-warning);
		color: white;
		&:hover:not(:disabled) {
			background-color: var(--color-warning-hover);
		}
		// Back to the default color for this button when active
		// TODO: add ripple effect
		&:active {
			background-color: var(--color-warning);
		}
	}

	// Error
	&--vue-error {
		background-color: var(--color-error);
		color: white;
		&:hover:not(:disabled) {
			background-color: var(--color-error-hover);
		}
		// Back to the default color for this button when active
		// TODO: add ripple effect
		&:active {
			background-color: var(--color-error);
		}
	}
}

</style>
