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
		<NcCheckboxRadioSwitch v-model="style" value="text" name="style" type="radio">Text only</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="style" value="icon" name="style" type="radio">Icon only</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="style" value="icontext" name="style" type="radio">Icon and text</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="disabled" type="checkbox">Disabled</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="size" value="small" name="size" type="radio">Small</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="size" value="normal" name="size" type="radio">Normal (default)</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="size" value="large" name="size" type="radio">Large</NcCheckboxRadioSwitch>
	</div>

	<h5>Standard buttons</h5>
	<div class="grid">
		<p>Tertiary, no background</p>
		<p>Tertiary</p>
		<p>Secondary</p>
		<p>Primary</p>
		<NcButton
			aria-label="Example text"
			:disabled
			:size
			:text
			variant="tertiary-no-background">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled
			:size
			:text
			variant="tertiary">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled
			:size
			:text>
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled
			:size
			:text
			variant="primary">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
	</div>

	<!-- Wide button -->
	<h5>Wide button</h5>
	<NcButton
		:disabled="disabled"
		:size="size"
		:text="text"
		:wide="true"
		text="Example text">
		<template #icon>
			<Video
				:size="20" />
		</template>
	</NcButton>

	<!-- Special buttons -->
	<h5>Special buttons</h5>
	<div class="grid">
		<p>Success</p>
		<p>Warning</p>
		<p>Error</p>
		<p> - </p>
		<NcButton
			:disabled
			:size
			text="Example text"
			variant="success">
			<template #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			:disabled
			:size
			text="Example text"
			variant="warning">
			<template #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			:disabled
			:size
			text="Example text"
			variant="error">
			<template #icon>
				<Video
					:size="20" />
			</template>
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
	},
	computed: {
		text() {
			if (this.style.includes('text')) {
				return 'Example text'
			}
		},
	},
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
		<NcButton text="center (default)" variant="secondary" wide>
			<template #icon>
				<IconLeft :size="20" />
			</template>
		</NcButton>
		<NcButton alignment="center-reverse" text="center-reverse" variant="secondary" wide>
			<template #icon>
				<IconRight :size="20" />
			</template>
		</NcButton>
		<div style="display: flex; gap: 12px;">
			<div style="display: flex; flex-direction: column; gap: 12px; flex: 1">
				<NcButton alignment="start" text="start" variant="secondary" wide>
					<template #icon>
						<IconLeft :size="20" />
					</template>
				</NcButton>
				<NcButton alignment="start-reverse" text="start-reverse" variant="secondary" wide>
					<template #icon>
						<IconRight :size="20" />
					</template>
				</NcButton>
			</div>
			<div style="display: flex; flex-direction: column; gap: 12px; flex: 1">
				<NcButton alignment="end" text="end" variant="secondary" wide>
					<template #icon>
						<IconLeft :size="20" />
					</template>
				</NcButton>
				<NcButton alignment="end-reverse" text="end-reverse" variant="secondary" wide>
					<template #icon>
						<IconRight :size="20" />
					</template>
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
The button will have the required `aria` attribute for accessibility and visual style (`primary` when pressed, and the configured variant otherwise).

Do not change `text` or `aria-label` of the pressed/unpressed button. See: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed

```vue
<template>
	<div>
		<div style="display: flex; gap: 12px;">
			<NcButton v-model:pressed="isFavorite" aria-label="Favorite" variant="tertiary-no-background">
				<template #icon>
					<IconStar v-if="isFavorite" :size="20" />
					<IconStarOutline v-else :size="20" />
				</template>
			</NcButton>
			<NcButton v-model:pressed="isFavorite" text="Favorite" variant="tertiary">
				<template #icon>
					<IconStar v-if="isFavorite" :size="20" />
					<IconStarOutline v-else :size="20" />
				</template>
			</NcButton>
			<NcButton v-model:pressed="isFavorite" aria-label="Favorite">
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

### Usage example: Custom content
Sometimes custom content, meaning more than text and icon, is required.
For this the `default`-slot can be used.

**Important**: Never include interactive elements inside the button,
this results in invalid HTML and is not accessible!

```vue
<template>
	<NcButton>
		Some <del>formatted</del> content
	</NcButton>
</template>
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
						variant="tertiary"
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
						variant="tertiary"
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

<script setup lang="ts">
import type { Slot } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { computed, inject } from 'vue'
import { routerKey } from 'vue-router'
import { isLegacy } from '../../utils/legacy.ts'

export type ButtonAlignment = 'start'
	| 'start-reverse'
	| 'center'
	| 'center-reverse'
	| 'end'
	| 'end-reverse'

export type ButtonSize = 'small'
	| 'normal'
	| 'large'

export type ButtonType =
	| 'submit'
	| 'reset'
	| 'button'

export type ButtonVariant = 'primary'
	| 'secondary'
	| 'tertiary'
	| 'tertiary-no-background'
	| 'tertiary-on-primary'
	| 'error'
	// Design-wise not recommended for new code
	| 'warning'
	| 'success'

const props = withDefaults(defineProps<{
	/**
	 * Set the text and icon alignment
	 *
	 * @default 'center'
	 */
	alignment?: ButtonAlignment

	/**
	 * Always try to provide an aria-label to your button.
	 *
	 * Make it more specific than the button's name by provide some more context.
	 * E.g. if the name of the button is "send" in the Mail app,
	 * the aria label could be "Send email".
	 */
	ariaLabel?: string

	/**
	 * Toggles the disabled state of the button on and off.
	 * @default false
	 */
	disabled?: boolean

	/**
	 * When `href` is set this will make the browser try to download the target.
	 * If a string is passed the browser will use it as the filename.
	 *
	 * Note that the browser might adjust it for allowed characters (e.g. '/' or '\').
	 * Also this only works with same-origin URLs and `blob:` or `data:` schemas.
	 * Moreover a `Content-Disposition` header set by the server will override the filename.
	 */
	download?: string|true

	/**
	 * Providing the href attribute turns the button component into an `a` element.
	 */
	href?: string

	/**
	 * The pressed state of the button if it has a checked state.
	 * This will add the `aria-pressed` attribute and for the button to have the primary style in checked state.
	 *
	 * Note: Pressed state is not supported for links.
	 */
	pressed?: boolean

	/**
	 * Specify the button size.
	 * @default 'normal'
	 */
	size?: ButtonSize

	/**
	 * Target for the `a` element if `href` is set.
	 * @default '_self'
	 */
	target?: string

	/**
	 * The main button text.
	 * This can be overwritten by using the *default* slot.
	 * @since 9.0.0
	 */
	text?: string

	/**
	 * Providing the to attribute turns the button component into a `router-link` element.
	 *
	 * Note: This takes precedence over the href attribute.
	 */
	to?: RouteLocationRaw

	/**
	 * Specifies the button native type
	 * If left empty, the default "button" type will be used.
	 *
	 * @default 'button'
	 */
	type?: ButtonType

	/**
	 * Specifies the button variant.
	 * If left empty, the default button style will be applied.
	 *
	 * @default 'secondary'
	 */
	variant?: ButtonVariant

	/**
	 * Specifies whether the button should span all the available width.
	 * By default, buttons span the whole width of the container.
	 * @default false
	 */
	wide?: boolean
}>(), {
	ariaLabel: undefined,
	alignment: 'center',
	download: undefined,
	href: undefined,
	pressed: undefined,
	size: 'normal',
	target: '_self',
	text: undefined,
	to: undefined,
	type: 'button',
	variant: 'secondary',
})

const emit = defineEmits<{
	/**
	 * Emitted when the button was clicked.
	 */
	 click: [e: MouseEvent]

	/**
	 * Update the current pressed state of the button (if the `pressed` property was configured).
	 * If the button is a toggle button (`pressed` state is boolean),
	 * then this will be emitted if the user toggled the state.
	 */
	'update:pressed': [pressed: boolean]
}>()

defineSlots<{
	/**
	 * Custom button content.
	 * This can be used for custom formatted content, ensure to not include any interactive elements.
	 * For plain text it is preferred to use the `text` prop instead.
	 */
	default?: Slot

	/**
	 * Icon (optional) to show within the button
	 */
	icon?: Slot
}>()

const hasVueRouterContext = inject(routerKey, null) !== null

const tag = computed(() => {
	// TODO: should we warn if props.to is provided but there is no vue-router?
	if (hasVueRouterContext && props.to) {
		// Note: RouterLink is used as globally registered component (by name) and not imported intentionally
		// to use injected component from the app and not bundle it to the button
		return 'RouterLink'
	} else if (props.href) {
		return 'a'
	} else {
		return 'button'
	}
})

const hasPressedState = computed(() => tag.value === 'button' && typeof props.pressed === 'boolean')

const variantWithPressed = computed(() => {
	// Pressed toggle button forced to be primary
	if (props.pressed) {
		return 'primary'
	}
	// Non-pressed toggle button may use passed variant but it cannot be primary
	if (props.pressed === false && props.variant === 'primary') {
		return 'secondary'
	}

	return props.variant
})
const isTertiaryVariant = computed(() => variantWithPressed.value.startsWith('tertiary'))

const flexAlignment = computed(() => props.alignment.split('-')[0])
const isReverseAligned = computed(() => props.alignment.includes('-'))

const getNcPopoverTriggerAttrs = inject<() => Record<string, string|undefined>>('NcPopover:trigger:attrs', () => ({}), false)
const ncPopoverTriggerAttrs = computed(() => getNcPopoverTriggerAttrs())

const attrs = computed(() => {
	if (tag.value === 'RouterLink') {
		return {
			to: props.to,
			activeClass: 'active',
		}
	} else if (tag.value === 'a') {
		return {
			href: props.href || '#',
			target: props.target,
			rel: 'nofollow noreferrer noopener',
			download: props.download || undefined,
		}
	} else if (tag.value === 'button') {
		return {
			...ncPopoverTriggerAttrs.value,
			'aria-pressed': props.pressed,
			type: props.type,
			disabled: props.disabled,
		}
	}

	return undefined
})

/**
 * Handle the click on the link / button
 *
 * @param event - Mouse click event
 */
function onClick(event: MouseEvent) {
	if (hasPressedState.value) {
		emit('update:pressed', !props.pressed)
	}
	emit('click', event)
}
</script>

<template>
	<component :is="tag"
		class="button-vue"
		:class="[
			`button-vue--size-${size}`,
			{
				[`button-vue--${variantWithPressed}`]: variantWithPressed,
				'button-vue--tertiary': isTertiaryVariant,
				'button-vue--wide': wide,
				[`button-vue--${flexAlignment}`]: flexAlignment !== 'center',
				'button-vue--reverse': isReverseAligned,
				'button-vue--legacy': isLegacy,
			},
		]"
		:aria-label
		v-bind="attrs"
		@click="onClick">
		<span class="button-vue__wrapper">
			<span class="button-vue__icon">
				<slot name="icon" />
			</span>
			<span class="button-vue__text">
				<slot>
					{{ text }}
				</slot>
			</span>
		</span>
	</component>
</template>

<style lang="scss" scoped>
.button-vue {
	--button-size: var(--default-clickable-area);
	--button-inner-size: calc(var(--button-size) - 4px); // without the outer border
	--button-radius: var(--border-radius-element);
	--button-padding-default: calc(var(--default-grid-baseline) + var(--button-radius));
	--button-padding: var(--default-grid-baseline) var(--button-padding-default);

	// General styles
	// by default use secondary styling
	color: var(--color-primary-element-light-text);
	background-color: var(--color-primary-element-light);
	border: 1px solid var(--color-primary-element-light-hover);
	border-bottom-width: 2px;
	border-radius: var(--button-radius);
	box-sizing: border-box;
	// adjust position and size
	position: relative;
	width: fit-content;
	overflow: hidden;
	padding-block: 1px 0; // center the content as border is 1px top and 2px bottom
	padding-inline: var(--button-padding);
	min-height: var(--button-size);
	min-width: var(--button-size);
	// display setup
	display: flex;
	align-items: center;
	justify-content: center;
	transition-property: color, border-color, background-color;
	transition-duration: 0.1s;
	transition-timing-function: linear;
	cursor: pointer;
	font-size: var(--default-font-size);
	font-weight: bold;

	// Setup different button sizes
	&--size-small {
		--button-size: var(--clickable-area-small);
		--button-radius: var(--border-radius-small); // make the border radius even smaller for small buttons
	}

	&--size-large {
		--button-size: var(--clickable-area-large);
	}

	// Cursor pointer on element and all children
	* {
		cursor: pointer;
	}

	// No outline feedback for focus. Handled with a toggled class in js (see data)
	&:focus {
		outline: none;
	}

	// Disabled styles
	&:disabled {
		// Gives a wash out effect
		filter: saturate($opacity_normal);
		opacity: $opacity_disabled;

		// Reset the cursor
		cursor: default;
		* {
			cursor: default;
		}
	}

	// Hover styles when not disabled (for the default theming of 'secondary')
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

	&--reverse {
		--button-padding: var(--button-padding-default) var(--default-grid-baseline);
	}

	&__icon {
		--default-clickable-area: var(--button-inner-size); // align icon size with inner button size
		height: var(--button-inner-size);
		width: var(--button-inner-size);
		min-height: var(--button-inner-size);
		min-width: var(--button-inner-size);
		display: flex;
		justify-content: center;
		align-items: center;

		&:empty {
			display: none;
		}
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

		&:empty {
			display: none;
		}
	}

	// Icon-only button
	&:has(#{&}__text:empty) {
		--button-padding: var(--button-radius);
		line-height: 1;
		width: var(--button-size) !important;
	}

	// Text-only button
	&:has(#{&}__icon:empty) {
		--button-padding: var(--button-padding-default);

		.button-vue__text {
			padding-inline: var(--default-grid-baseline);
		}
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
			border-radius: var(--border-radius-element);
			background-color: transparent;
		}
	}

	// Button types

	// Primary
	&--primary {
		background-color: var(--color-primary-element);
		border-color: var(--color-primary-element-hover);
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
	&--secondary {
		background-color: var(--color-primary-element-light);
		border-color: var(--color-primary-element-light-hover);
		color: var(--color-primary-element-light-text);

		&:hover:not(:disabled) {
			color: var(--color-primary-element-light-text);
			background-color: var(--color-primary-element-light-hover);
		}
	}

	// Tertiary
	&--tertiary {
		background-color: transparent;
		border-color: transparent;
		color: var(--color-main-text);

		&:hover:not(:disabled) {
			background-color: var(--color-background-hover);
		}
	}

	// Tertiary, no background
	&--tertiary-no-background {
		&:hover:not(:disabled) {
			background-color: transparent;
		}
	}

	// Tertiary on primary color (like the header)
	&--tertiary-on-primary {
		color: var(--color-primary-element-text);

		&:hover:not(:disabled) {
			background-color: transparent;
		}
	}

	// Success
	&--success {
		border-color: var(--color-success-hover);
		background-color: var(--color-success);
		color: var(--color-success-text);
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
	&--warning {
		border-color: var(--color-warning-hover);
		background-color: var(--color-warning);
		color: var(--color-warning-text);
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
	&--error {
		border-color: var(--color-error-hover);
		background-color: var(--color-error);
		color: var(--color-error-text);
		&:hover:not(:disabled) {
			background-color: var(--color-error-hover);
		}
		// Back to the default color for this button when active
		// TODO: add ripple effect
		&:active {
			background-color: var(--color-error);
		}
	}

	// before Nextcloud 32
	&--legacy {
		--button-inner-size: var(--button-size);
		// no border
		border: none;
	}
}

</style>
