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
			:disabled="disabled"
			:size="size"
			:text="text"
			type="tertiary-no-background">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:size="size"
			:text="text"
			type="tertiary">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:size="size"
			:text="text">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:size="size"
			:text="text"
			type="primary">
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
			:disabled="disabled"
			:size="size"
			text="Example text"
			type="success">
			<template #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			:disabled="disabled"
			:size="size"
			text="Example text"
			type="warning">
			<template #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			:disabled="disabled"
			:size="size"
			text="Example text"
			type="error">
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
		<NcButton text="center (default)" type="secondary" wide>
			<template #icon>
				<IconLeft :size="20" />
			</template>
		</NcButton>
		<NcButton alignment="center-reverse" text="center-reverse" type="secondary" wide>
			<template #icon>
				<IconRight :size="20" />
			</template>
		</NcButton>
		<div style="display: flex; gap: 12px;">
			<div style="display: flex; flex-direction: column; gap: 12px; flex: 1">
				<NcButton alignment="start" text="start" type="secondary" wide>
					<template #icon>
						<IconLeft :size="20" />
					</template>
				</NcButton>
				<NcButton alignment="start-reverse" text="start-reverse" type="secondary" wide>
					<template #icon>
						<IconRight :size="20" />
					</template>
				</NcButton>
			</div>
			<div style="display: flex; flex-direction: column; gap: 12px; flex: 1">
				<NcButton alignment="end" text="end" type="secondary" wide>
					<template #icon>
						<IconLeft :size="20" />
					</template>
				</NcButton>
				<NcButton alignment="end-reverse" text="end-reverse" type="secondary" wide>
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
The button will have the required `aria` attribute for accessibility and visual style (`primary` when pressed, and the configured type otherwise).

Do not change `text` or `aria-label` of the pressed/unpressed button. See: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed

```vue
<template>
	<div>
		<div style="display: flex; gap: 12px;">
			<NcButton v-model:pressed="isFavorite" aria-label="Favorite" type="tertiary-no-background">
				<template #icon>
					<IconStar v-if="isFavorite" :size="20" />
					<IconStarOutline v-else :size="20" />
				</template>
			</NcButton>
			<NcButton v-model:pressed="isFavorite" text="Favorite" type="tertiary">
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

<template>
	<component :is="isLink ? 'a' : 'button'"
		:class="[
			'button-vue',
			`button-vue--size-${size}`,
			{
				[`button-vue--vue-${realType}`]: realType,
				'button-vue--wide': wide,
				[`button-vue--${flexAlignment}`]: flexAlignment !== 'center',
				'button-vue--reverse': isReverseAligned,
				active: routerLink?.isActive,
			},
		]"
		:disabled="disabled"
		:aria-label="ariaLabel"
		v-bind="{
			...ncPopoverTriggerAttrs,
			...(isLink ? linkAttrs : buttonAttrs),
		}"
		@click="onClick">
		<span class="button-vue__wrapper">
			<span v-if="hasIcon()"
				:aria-hidden="noIconAriaHidden ? undefined : 'true'"
				class="button-vue__icon">
				<slot name="icon" />
			</span>
			<span v-if="hasText()" class="button-vue__text">
				<slot>
					{{ text }}
				</slot>
			</span>
		</span>
	</component>
</template>

<script setup lang="ts">
import type { PropType, Slot } from 'vue'

import { ButtonAlignment, ButtonNativeType, ButtonType } from './types'
import { computed, inject, toRef, watch } from 'vue'
import { routerKey, useLink } from 'vue-router'
import isSlotPopulated from '../../utils/isSlotPopulated'
import logger from '../../utils/logger'

const props = defineProps({
	/**
	 * Set the text and icon alignment
	 *
	 * @default 'center'
	 * @type {'start' | 'start-reverse' | 'center' | 'center-reverse' | 'end' | 'end-reverse'}
	 */
	 alignment: {
		type: String as PropType<ButtonAlignment>,
		default: ButtonAlignment.Center,
		validator(value: string) {
			return Object.values(ButtonAlignment).includes(value as ButtonAlignment)
		},
	},

	/**
	 * By default the icon is set to `aria-hidden="true"` to hide it from the accessibility tree.
	 * But sometimes this is not desired, e.g. for a loading icon with an accessible name,
	 * setting this prop will make the icon appear in the accessible tree.
	 * @default false
	 * @since 9.0.0
	 */
	noIconAriaHidden: {
		type: Boolean,
		default: false,
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
		validator(value: string) {
			return ['small', 'normal', 'large'].includes(value)
		},
	},

	/**
	 * The main button text.
	 * This can be overwritten by using the *default* slot.
	 * @since 9.0.0
	 */
	text: {
		type: String,
		default: '',
	},

	/**
	 * Specifies the button type
	 * If left empty, the default button style will be applied.
	 *
	 * @default 'secondary'
	 * @type {'primary' | 'secondary' | 'tertiary' | 'tertiary-no-background' | 'tertiary-on-primary' | 'error' | 'warning' | 'success'}
	 */
	type: {
		type: String as PropType<ButtonType>,
		default: ButtonType.Secondary,
		validator(value: string) {
			return Object.values(ButtonType).includes(value as ButtonType)
		},
	},

	/**
	 * Specifies the button native type
	 * If left empty, the default "button" type will be used.
	 *
	 * @default 'button'
	 * @type {'submit' | 'reset' | 'button'}
	 */
	nativeType: {
		type: String as PropType<ButtonNativeType>,
		default: ButtonNativeType.Button,
		validator(value: string) {
			return Object.values(ButtonNativeType).includes(value as ButtonNativeType)
		},
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
	 * @default '_self'
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
	 * The pressed state of the button if it has a checked state
	 * This will add the `aria-pressed` attribute and for the button to have the primary style in checked state.
	 *
	 * Pressed state is not supported for links
	 */
	pressed: {
		type: Boolean,
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
})

const emit = defineEmits<{
	(e: 'click', event: MouseEvent): void
	/**
	 * Update the current pressed state of the button (if the `pressed` property was configured)
	 */
	(e: 'update:pressed', pressed: boolean): void
}>()

const slots = defineSlots<{
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

// Make sure the component also works if the app does not use any router
// And if the app uses a router we need to make sure a `to` prop was passed to use to router
const routerLink = computed(() => inject(routerKey, null) !== null && props.to
	? useLink({ to: toRef(() => props.to) })
	: undefined,
)

/**
 * If this is a link (<a>) element
 */
const isLink = computed(() => props.href)

/**
 * If the button has a pressed state (only if not a link)
 */
const hasPressedState = computed(() => !isLink.value && typeof props.pressed === 'boolean')

/**
 * The real type to be used for the button, enforces `primary` for pressed state and, if stateful button, any other type for not pressed state
 * Otherwise the type property is used.
 */
const realType = computed(() => {
	// Force *primary* when pressed
	if (props.pressed) {
		return 'primary'
	}
	// If not pressed but button is configured as stateful button then the type must not be primary
	if (props.pressed === false && props.type === 'primary') {
		return 'secondary'
	}
	return props.type
})

/**
 * The flexbox alignment of the button content
 */
const flexAlignment = computed(() => props.alignment.split('-')[0])

/**
 * If the button content should be reversed (icon on the end)
 */
const isReverseAligned = computed(() => props.alignment.includes('-'))

const getNcPopoverTriggerAttrs = inject<() => Record<string, string|undefined>>('NcPopover:trigger:attrs', () => ({}), false)
const ncPopoverTriggerAttrs = computed(() => getNcPopoverTriggerAttrs())

/**
 * Attributes to pass to the <a> element
 */
const linkAttrs = computed(() => ({
	role: 'button',
	href: props.href || '#',
	target: props.target,
	rel: 'nofollow noreferrer noopener',
	download: props.download || null,
}))

/**
 * Attribute to pass to the <button> element
 */
const buttonAttrs = computed(() => ({
	'aria-pressed': hasPressedState.value ? String(props.pressed) : undefined,
	type: props.nativeType,
}))

/**
 * Check if the button has a text content (function because slots are not reactive)
 */
function hasText(): boolean {
	return Boolean(props.text) || isSlotPopulated(slots.default?.({}))
}

/**
 * Check if the button has an icon (function because slots are not reactive)
 */
function hasIcon(): boolean {
	return !!slots.icon
}

/**
 * Handle the click on the link / button
 * @param event The mouse click event
 */
function onClick(event: MouseEvent) {
	if (hasPressedState.value) {
		/**
		 * Update the current pressed state of the button (if the `pressed` property was configured)
		 *
		 * @property {boolean} newValue The new `pressed`-state
		 */
		emit('update:pressed', !props.pressed)
	}
	// We have to both navigate and emit the click event
	emit('click', event)
	routerLink.value?.navigate(event)
}

/**
 * Warn developers about missing aria label for icon-only buttons
 */
watch(
	() => props.ariaLabel,
	() => {
		// This is purely for developers
		// So we skip if not in debug mode to prevent performance issues as `hasText` requires a full render function call
		if (window._oc_config?.loglevel !== 0) {
			return
		}

		if (!props.ariaLabel && !hasText()) {
			// Warning but we made sure that the log level is DEBUG above so we do not spam users
			logger.warn('You need to fill either the text or the ariaLabel props in the button component.')
		}
	},
	{ immediate: true },
)
</script>

<style lang="scss" scoped>
.button-vue {
	// Setup different button sizes
	--button-size: var(--default-clickable-area);
	--button-radius: var(--border-radius-element, calc(var(--button-size) / 2));
	--button-padding-default: min(calc(var(--default-grid-baseline) + var(--button-radius)), calc(var(--default-grid-baseline) * 4));
	--button-padding: var(--default-grid-baseline) var(--button-padding-default);

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
	padding-block: 0;
	padding-inline: var(--button-padding);
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
	&:not(:has(#{&}__text)) {
		--button-padding: clamp(var(--default-grid-baseline), var(--button-radius), calc(var(--default-grid-baseline) * 4));
		line-height: 1;
		width: var(--button-size) !important;
	}

	// Text-only button
	&:not(:has(#{&}__icon)) {
		--button-padding: var(--button-padding-default);
		& .button-vue__text {
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
