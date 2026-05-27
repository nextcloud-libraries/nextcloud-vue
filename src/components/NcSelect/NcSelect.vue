<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Description

General purpose multiselect component.

### Basic examples

```vue
<template>
	<div class="grid">
		<div v-for="{ props } in selectArray"
			class="container">
			<NcSelect v-bind="props"
				v-model="props.value" />
		</div>
	</div>
</template>

<script>
const selectArray = [
	{
		props: {
			inputLabel: 'Simple',
			options: [
				'foo',
				'bar',
				'baz',
				'qux',
				'quux',
			],
		},
	},

	{
		props: {
			inputLabel: 'Simple (top placement)',
			placement: 'top',
			options: [
				'foo',
				'bar',
				'baz',
				'qux',
				'quux',
			],
		},
	},

	{
		props: {
			inputLabel: 'Multiple (with placeholder)',
			multiple: true,
			placeholder: 'Select multiple options',
			options: [
				'foo',
				'bar',
				'baz',
				'qux',
				'quux',
			],
		},
	},

	{
		props: {
			inputLabel: 'Multiple (objects, pre-selected, stay open on select)',
			keepOpen: true,
			multiple: true,
			options: [
				{
					id: 'foo',
					label: 'Foo',
				},
				{
					id: 'bar',
					label: 'Bar',
				},
				{
					id: 'baz',
					label: 'Baz',
				},
				{
					id: 'qux',
					label: 'Qux',
				},
				{
					id: 'quux',
					label: 'Quux',
				},
				{
					id: 'corge',
					label: 'Corge',
				},
				{
					id: 'grault',
					label: 'Grault',
				},
				{
					id: 'garply',
					label: 'Garply',
				},
				{
					id: 'waldo',
					label: 'Waldo',
				},
				{
					id: 'fred',
					label: 'Fred',
				},
			],
			value: [
				{
					id: 'foo',
					label: 'Foo',
				},
				{
					id: 'bar',
					label: 'Bar',
				},
			],
		},
	},
]

export default {
	data() {
		return {
			selectArray,
		}
	},
}
</script>

<style>
.grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
}

.container {
	display: flex;
	flex-direction: column;
	gap: 2px 0;
}
</style>
```

### Pre-selected and clearable

```vue
<template>
	<div class="grid">
		<div class="container">
			<NcSelect v-model="singleValue"
				input-label="Clearable single"
				:options="options"
				clearable />
		</div>
		<div class="container">
			<NcSelect v-model="singlePlaceholder"
				input-label="With placeholder"
				placeholder="Search for something..."
				:options="options" />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			options: ['foo', 'bar', 'baz', 'qux', 'quux'],
			singleValue: 'bar',
			singlePlaceholder: null,
		}
	},
}
</script>

<style>
.grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
}

.container {
	display: flex;
	flex-direction: column;
}
</style>
```

### Disabled state

```vue
<template>
	<div class="grid">
		<div class="container">
			<NcSelect v-model="singleValue"
				input-label="Disabled single"
				:options="options"
				disabled />
		</div>
		<div class="container">
			<NcSelect v-model="multiValue"
				input-label="Disabled multi"
				:options="options"
				multiple
				disabled />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			options: ['foo', 'bar', 'baz'],
			singleValue: 'foo',
			multiValue: ['foo', 'bar'],
		}
	},
}
</script>

<style>
.grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
}

.container {
	display: flex;
	flex-direction: column;
}
</style>
```

### Label outside

```vue
<template>
	<div class="grid">
		<div class="container">
			<label for="ext-single">External label (single)</label>
			<NcSelect v-model="singleValue"
				input-id="ext-single"
				label-outside
				placeholder="Pick an option"
				:options="options" />
		</div>
		<div class="container">
			<label for="ext-multi">External label (multi)</label>
			<NcSelect v-model="multiValue"
				input-id="ext-multi"
				label-outside
				:options="options"
				multiple />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			options: ['foo', 'bar', 'baz', 'qux', 'quux'],
			singleValue: null,
			multiValue: [],
		}
	},
}
</script>

<style>
.grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
}

.container {
	display: flex;
	flex-direction: column;
	gap: 4px;
}
</style>
```

### Native form validation example

```vue
<template>
	<div class="container">
		<form class="container__form" @submit.prevent>
			<NcSelect class="container__select"
				input-label="Require a selection"
				:options="options"
				v-model="singleValue"
				required />
			<NcButton type="submit">Submit</NcButton>
		</form>

		<form class="container__form" @submit.prevent>
			<NcSelect class="container__select"
				input-label="Require at least one selection"
				:options="options"
				v-model="multiValue"
				multiple
				required />
			<NcButton type="submit">Submit</NcButton>
		</form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			options: ['foo', 'bar', 'baz', 'qux', 'quux'],
			singleValue: null,
			multiValue: [],
		}
	},
}
</script>

<style>
.container {
	display: flex;
	gap: 0 12px;
}

.container__form {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	width: 100%;
	gap: 8px 0;
}

.container__select {
	width: 100%;
}
</style>
```

### No wrap example

The `noWrap` prop is set to `true` and the `max-width` of the multiselect
parent container is limited to `350px`

```vue
<template>
	<div class="grid">
		<div class="container">
			<NcSelect :no-wrap="false"
				v-bind="data1.props"
				v-model="data1.props.value" />
		</div>
		<div class="container">
			<NcSelect :no-wrap="true"
				v-bind="data2.props"
				v-model="data2.props.value" />
		</div>
	</div>
</template>

<script>
const data1 = {
	props: {
		inputLabel: 'Wrapped (Default)',
		multiple: true,
		keepOpen: true,
		options: [
			'foo',
			'bar',
			'baz',
			'qux',
			'quux',
			'corge',
			'grault',
			'garply',
			'waldo',
			'fred',
		],
		value: [
			'foo',
			'bar',
			'baz',
			'qux',
			'quux',
			'corge',
			'grault',
			'garply',
			'waldo',
			'fred',
		],
	},
}

const data2 = {
	props: {
		inputLabel: 'Not wrapped',
		keepOpen: true,
		multiple: true,
		options: [
			'foo',
			'bar',
			'baz',
			'qux',
			'quux',
			'corge',
			'grault',
			'garply',
			'waldo',
			'fred',
		],
		value: [
			'foo',
			'bar',
			'baz',
			'qux',
			'quux',
			'corge',
			'grault',
			'garply',
			'waldo',
			'fred',
		],
	},
}

export default {
	data() {
		return {
			data1,
			data2,
		}
	},
}
</script>

<style>
.grid {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	gap: 10px;
}

.container {
	max-width: 350px;
	display: flex;
	flex-direction: column;
	gap: 2px 0;
}
</style>
```
</docs>

<template>
	<VueSelect
		data-v-new-select
		class="select"
		:class="{
			'select--legacy': isLegacy,
			'select--no-wrap': noWrap,
		}"
		v-bind="propsToForward"
		@search="search = $event"
		@update:modelValue="$emit('update:modelValue', $event)">
		<template v-if="multiple && !labelOutside && inputLabel" #header>
			<label
				:for="inputId"
				class="select__label">
				{{ inputLabel }}
			</label>
		</template>
		<template #search="{ attributes, events }">
			<!--
				v-bind MUST come before explicit props — Vue 3 last-binding-wins.
				We spread vue-select attributes but null out placeholder/value/modelValue
				so our explicit bindings below take precedence.
			-->
			<NcTextField
				v-bind="{ ...attributes, placeholder: undefined, value: undefined, modelValue: undefined }"
				class="vs__search"
				:class="[inputClass]"
				:modelValue="attributes.value"
				:placeholder="multiple || modelValue ? '' : (placeholder || '')"
				:label="!labelOutside && !multiple && inputLabel ? inputLabel : ''"
				:labelOutside="labelOutside || multiple"
				:disabled="disabled"
				:required="inputRequired"
				v-on="filterEvents(events)"
				@update:modelValue="events.input({ target: { value: $event } })" />
			<!-- No placeholder when: multi mode (select__label serves as placeholder)
				 or value selected (vs__selected overlay shows the value instead). -->
		</template>
		<template #open-indicator="{ attributes }">
			<ChevronDown
				v-bind="attributes"
				fillColor="var(--vs-controls-color)"
				:style="{
					cursor: !disabled ? 'pointer' : null,
				}"
				:size="20" />
		</template>
		<template #option="option">
			<!-- @slot Customize how a option is rendered. -->
			<slot name="option" v-bind="option">
				<NcEllipsisedOption
					:name="String(option[localLabel])"
					:search="search" />
			</slot>
		</template>
		<template #selected-option="selectedOption">
			<!-- @slot Customize how a selected option is rendered -->
			<slot name="selected-option" v-bind="selectedOption">
				<NcEllipsisedOption
					:name="String(selectedOption[localLabel])"
					:search="search" />
			</slot>
		</template>
		<template #spinner="spinner">
			<NcLoadingIcon v-if="spinner.loading" />
		</template>
		<template #no-options>
			{{ t('No results') }}
		</template>
		<template v-for="(_, name) in $slots" #[name]="data">
			<!-- @slot Any combination of slots from https://vue-select.org/api/slots.html -->
			<slot :name="name" v-bind="data" />
		</template>
	</VueSelect>
</template>

<script>
import {
	autoUpdate,
	computePosition,
	flip,
	limitShift,
	offset,
	shift,
} from '@floating-ui/dom'
import { VueSelect } from '@nextcloud/vue-select'
import { h, warn } from 'vue'
import ChevronDown from 'vue-material-design-icons/ChevronDown.vue'
import Close from 'vue-material-design-icons/Close.vue'
import NcEllipsisedOption from '../NcEllipsisedOption/NcEllipsisedOption.vue'
import NcLoadingIcon from '../NcLoadingIcon/NcLoadingIcon.vue'
import NcTextField from '../NcTextField/NcTextField.vue'
import { t } from '../../l10n.ts'
import { createElementId } from '../../utils/createElementId.ts'
import { isLegacy } from '../../utils/legacy.ts'

export default {
	name: 'NcSelect',

	components: {
		ChevronDown,
		NcEllipsisedOption,
		NcLoadingIcon,
		NcTextField,
		VueSelect,
	},

	props: {
		// Add VueSelect props to $props
		...VueSelect.props,
		...VueSelect.mixins.reduce((allProps, mixin) => ({ ...allProps, ...mixin.props }), {}),

		/**
		 * `aria-label` for the clear input button
		 */
		ariaLabelClearSelected: {
			type: String,
			default: t('Clear selected'),
		},

		/**
		 * `aria-label` for the search input
		 *
		 * A descriptive `inputLabel` is preferred as this is not visible.
		 */
		ariaLabelCombobox: {
			type: String,
			default: null,
		},

		/**
		 * `aria-label` for the listbox element
		 */
		ariaLabelListbox: {
			type: String,
			default: t('Options'),
		},

		/**
		 * Allows to customize the `aria-label` for the deselect-option button
		 * The default is "Deselect " + optionLabel
		 *
		 * @type {(optionLabel: string) => string}
		 */
		ariaLabelDeselectOption: {
			type: Function,
			default: (optionLabel) => t('Deselect {option}', { option: optionLabel }),
		},

		/**
		 * Append the dropdown element to the end of the body
		 * and size/position it dynamically.
		 *
		 * @see https://vue-select.org/api/props.html#appendtobody
		 */
		appendToBody: {
			type: Boolean,
			default: true,
		},

		/**
		 * When `appendToBody` is true, this function is responsible for
		 * positioning the drop down list.
		 *
		 * If a function is returned from `calculatePosition`, it will
		 * be called when the drop down list is removed from the DOM.
		 * This allows for any garbage collection you may need to do.
		 *
		 * @see https://vue-select.org/api/props.html#calculateposition
		 */
		calculatePosition: {
			type: Function,
			default: null,
		},

		/**
		 * Keep the dropdown open after selecting an option.
		 *
		 * @default false
		 * @since 8.25.0
		 */
		keepOpen: {
			type: Boolean,
			default: false,
		},

		/**
		 * Replace default vue-select components
		 *
		 * @see https://vue-select.org/api/props.html#components
		 */
		components: {
			type: Object,
			default: () => ({
				Deselect: {
					render: () => h(Close, {
						size: 20,
						fillColor: 'var(--vs-controls-color)',
						style: [
							{ cursor: 'pointer' },
						],
					}),
				},
			}),
		},

		/**
		 * Sets the maximum number of options to display in the dropdown list
		 */
		limit: {
			type: Number,
			default: null,
		},

		/**
		 * Disable the component
		 *
		 * @see https://vue-select.org/api/props.html#disabled
		 */
		disabled: {
			type: Boolean,
			default: false,
		},

		/**
		 * Determines whether the dropdown should be open.
		 * Receives the component instance as the only argument.
		 *
		 * @see https://vue-select.org/api/props.html#dropdownshouldopen
		 */
		dropdownShouldOpen: {
			type: Function,
			default: ({ noDrop, open }) => {
				return noDrop ? false : open
			},
		},

		/**
		 * Callback to determine if the provided option should
		 * match the current search text. Used to determine
		 * if the option should be displayed.
		 *
		 * Defaults to the internal vue-select function documented at the link
		 * below
		 *
		 * @see https://vue-select.org/api/props.html#filterby
		 */
		filterBy: {
			type: Function,
			default: null,
		},

		/**
		 * Class for the `input`
		 *
		 * Necessary for use in NcActionInput
		 */
		inputClass: {
			type: [String, Object],
			default: null,
		},

		/**
		 * Input element id
		 */
		inputId: {
			type: String,
			default: () => createElementId(),
		},

		/**
		 * Visible label for the input element
		 */
		inputLabel: {
			type: String,
			default: null,
		},

		/**
		 * Pass true if you are using an external label
		 */
		labelOutside: {
			type: Boolean,
			default: false,
		},

		/**
		 * Display a visible border around dropdown options
		 * which have keyboard focus
		 */
		keyboardFocusBorder: {
			type: Boolean,
			default: true,
		},

		/**
		 * Key of the displayed label for object options
		 *
		 * Defaults to the internal vue-select string documented at the link
		 * below
		 *
		 * @see https://vue-select.org/api/props.html#label
		 */
		label: {
			type: String,
			default: null,
		},

		/**
		 * Show the loading icon
		 *
		 * @see https://vue-select.org/api/props.html#loading
		 */
		loading: {
			type: Boolean,
			default: false,
		},

		/**
		 * Allow selection of multiple options
		 *
		 * @see https://vue-select.org/api/props.html#multiple
		 */
		multiple: {
			type: Boolean,
			default: false,
		},

		/**
		 * Disable automatic wrapping when selected options overflow the width
		 */
		noWrap: {
			type: Boolean,
			default: false,
		},

		/**
		 * Array of options
		 *
		 * @type {Array<string | number | Record<string | number, any>>}
		 *
		 * @see https://vue-select.org/api/props.html#options
		 */
		options: {
			type: Array,
			default: () => [],
		},

		/**
		 * Placeholder text
		 *
		 * @see https://vue-select.org/api/props.html#placeholder
		 */
		placeholder: {
			type: String,
			default: '',
		},

		/**
		 * Customized component's response to keydown events while the search input has focus
		 *
		 * @see https://vue-select.org/guide/keydown.html#mapkeydown
		 */
		mapKeydown: {
			type: Function,
			/**
			 * Patched Vue-Select keydown events handlers map to stop Escape propagation in open select
			 *
			 * @param {Record<number, (event: KeyboardEvent) => void>} map - Mapped keyCode to handlers { <keyCode>:<callback> }
			 * @param {import('vue').ComponentPublicInstance} vm - VueSelect instance
			 * @return {Record<number, (event: KeyboardEvent) => void>} patched keydown event handlers
			 */
			default(map, vm) {
				return {
					...map,
					/**
					 * Patched Escape handler to stop propagation from open select
					 *
					 * @param {KeyboardEvent} event - default keydown event handler
					 */
					27: (event) => {
						if (vm.open) {
							event.stopPropagation()
						}
						// Default VueSelect's handler
						map[27](event)
					},
				}
			},
		},

		/**
		 * A unique identifier used to generate IDs and DOM attributes. Must be unique for every instance of the component.
		 *
		 * @see https://vue-select.org/api/props.html#uid
		 */
		uid: {
			type: String,
			default: () => createElementId(),
		},

		/**
		 * When `appendToBody` is true, this sets the placement of the dropdown
		 *
		 * @type {'bottom' | 'top'}
		 */
		placement: {
			type: String,
			default: 'bottom',
		},

		/**
		 * If false, the focused dropdown option will not be reset when filtered
		 * options change
		 */
		resetFocusOnOptionsChange: {
			type: Boolean,
			default: true,
		},

		/**
		 * Currently selected value
		 *
		 * The `v-model` directive may be used for two-way data binding
		 *
		 * @type {string | number | Record<string | number, any> | Array<any>}
		 *
		 * @see https://vue-select.org/api/props.html#value
		 */
		modelValue: {
			type: [String, Number, Object, Array],
			default: null,
		},

		/**
		 * Enable if a value is required for native form validation
		 */
		required: {
			type: Boolean,
			default: false,
		},

		/**
		 * Any available prop
		 *
		 * @see https://vue-select.org/api/props.html
		 */
		// Not an actual prop but needed to show in vue-styleguidist docs
		// eslint-disable-next-line
		' ': {},
	},

	emits: [
		/**
		 * All events from https://vue-select.org/api/events.html
		 */
		// Not an actual event but needed to show in vue-styleguidist docs
		' ',
		'update:modelValue',
	],

	setup() {
		const clickableArea = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue('--default-clickable-area'))
		const gridBaseLine = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue('--default-grid-baseline'))
		const avatarSize = clickableArea - 2 * gridBaseLine

		return {
			avatarSize,
			isLegacy,
		}
	},

	data() {
		return {
			search: '',
		}
	},

	computed: {
		inputRequired() {
			if (!this.required) {
				return null
			}
			// The <input> itself does not have any value so we set the `required` attribute conditionally
			return this.modelValue === null || (Array.isArray(this.modelValue) && this.modelValue.length === 0)
		},

		localCalculatePosition() {
			if (this.calculatePosition !== null) {
				return this.calculatePosition
			}

			return (dropdownMenu, component, { width }) => {
				dropdownMenu.style.width = width

				const addClass = {
					name: 'addClass',
					fn(/* middlewareArgs */) {
						dropdownMenu.classList.add('vs__dropdown-menu--floating')
						return {}
					},
				}

				const togglePlacementClass = {
					name: 'togglePlacementClass',
					fn({ placement }) {
						component.$el.classList.toggle(
							'select--drop-up',
							placement === 'top',
						)
						dropdownMenu.classList.toggle(
							'vs__dropdown-menu--floating-placement-top',
							placement === 'top',
						)
						return {}
					},
				}

				const updatePosition = () => {
					computePosition(component.$refs.toggle, dropdownMenu, {
						placement: this.placement,
						middleware: [
							// Flip first so the placement-dependent middleware below see the final placement
							flip(),
							addClass,
							togglePlacementClass,
							// On top placement, leave a gap for the floating label overhang
							// (half the 13px/1.5 label line-height) instead of connecting seamlessly
							offset(({ placement }) => (placement.startsWith('top') ? 10 : -1)),
							shift({ limiter: limitShift() }),
						],
					}).then(({ x, y }) => {
						Object.assign(dropdownMenu.style, {
							left: `${x}px`,
							top: `${y}px`,
							width: `${component.$refs.toggle.getBoundingClientRect().width}px`,
						})
					})
				}

				const cleanup = autoUpdate(
					component.$refs.toggle,
					dropdownMenu,
					updatePosition,
				)

				return cleanup
			}
		},

		localFilterBy() {
			return this.filterBy ?? VueSelect.props.filterBy.default
		},

		localLabel() {
			return this.label ?? VueSelect.props.label.default
		},

		propsToForward() {
			const vueSelectKeys = [
				...Object.keys(VueSelect.props),
				...VueSelect.mixins.flatMap((mixin) => Object.keys(mixin.props ?? {})),
			]
			const initialPropsToForward = Object.fromEntries(Object.entries(this.$props)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
				.filter(([key, _value]) => vueSelectKeys.includes(key)))
			const propsToForward = {
				...initialPropsToForward,
				// Custom overrides of vue-select props
				calculatePosition: this.localCalculatePosition,
				closeOnSelect: !this.keepOpen,
				filterBy: this.localFilterBy,
				label: this.localLabel,
			}
			return propsToForward
		},
	},

	mounted() {
		if (!this.labelOutside && !this.inputLabel && !this.ariaLabelCombobox) {
			warn('[NcSelect] An `inputLabel` or `ariaLabelCombobox` should be set. If an external label is used, `labelOutside` should be set to `true`.')
		}
		if (this.inputLabel && this.ariaLabelCombobox) {
			warn('[NcSelect] Only one of `inputLabel` or `ariaLabelCombobox` should to be set.')
		}
	},

	methods: {
		t,

		/**
		 * Filter out the `input` event from vue-select events.
		 * Input is handled via @update:modelValue to avoid double-firing.
		 * All other events (keydown, blur, focus, compositionstart, compositionend)
		 * must reach the native <input> for keyboard nav, dropdown close, and IME.
		 *
		 * @param {object} events vue-select event handlers
		 * @return {object} events without `input`
		 */
		filterEvents(events) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { input, ...rest } = events
			return rest
		},
	},
}
</script>

<style lang="scss">
@use '../../assets/input-border.scss' as border;

[data-v-new-select].v-select.select {
	/* Custom vue-select CSS variables scoped to NcSelect */
	/* Search Input */
	--vs-search-input-color: var(--color-main-text);
	--vs-search-input-bg: var(--color-main-background);
	--vs-search-input-placeholder-color: var(--color-text-maxcontrast);

	/* Font */
	--vs-font-size: var(--default-font-size);
	--vs-line-height: var(--default-line-height);

	/* Disabled State */
	--vs-state-disabled-bg: var(--color-background-hover);
	--vs-state-disabled-color: var(--color-text-maxcontrast);
	--vs-state-disabled-controls-color: var(--color-text-maxcontrast);
	--vs-state-disabled-cursor: not-allowed;
	--vs-disabled-bg: var(--color-background-hover);
	--vs-disabled-color: var(--color-text-maxcontrast);
	--vs-disabled-cursor: not-allowed;

	/* Borders */
	--vs-border-color: var(--color-border-maxcontrast);
	--vs-border-width: var(--border-width-input, 2px) !important;
	--vs-border-style: solid;
	--vs-border-radius: var(--border-radius-element);

	/* Component Controls: Clear, Open Indicator */
	--vs-controls-color: var(--color-main-text);

	/* Selected */
	--vs-selected-bg: var(--color-background-hover);
	--vs-selected-color: var(--color-main-text);
	--vs-selected-border-color: var(--vs-border-color);
	--vs-selected-border-style: var(--vs-border-style);
	--vs-selected-border-width: var(--vs-border-width);

	/* Dropdown */
	--vs-dropdown-bg: var(--color-main-background);
	--vs-dropdown-color: var(--color-main-text);
	--vs-dropdown-z-index: 9999;
	--vs-dropdown-box-shadow: 0px 2px 2px 0px var(--color-box-shadow);

	/* Options */
	--vs-dropdown-option-padding: 8px 20px;

	/* Active State */
	--vs-dropdown-option--active-bg: var(--color-background-hover);
	--vs-dropdown-option--active-color: var(--color-main-text);

	/* Keyboard Focus State */
	--vs-dropdown-option--kb-focus-box-shadow: inset 0px 0px 0px 2px var(--vs-border-color);

	/* Deselect State */
	--vs-dropdown-option--deselect-bg: var(--color-error);
	--vs-dropdown-option--deselect-color: #fff;

	/* Transitions */
	--vs-transition-duration: 0ms;

	/* Actions */
	--vs-actions-padding: 0 8px 0 8px;
	/* Override default vue-select styles */
	min-height: calc(var(--default-clickable-area) - 2 * var(--border-width-input));
	min-width: 260px;
	margin: 0 0 var(--default-grid-baseline);

	&.vs--open {
		--vs-border-width: var(--border-width-input-focused, 2px);
	}

	.vs__selected {
		// min-height (not height) so multi-line entries like NcSelectUsers chips can grow
		min-height: calc(var(--default-clickable-area) - 2 * var(--vs-border-width) - var(--default-grid-baseline));
		margin: calc(var(--default-grid-baseline) / 2);
		padding-block: 0;
		padding-inline: 12px 8px;
		border-radius: 16px !important;
		background: var(--color-primary-element-light);
		border: none;
	}

	.vs__search {
		// NcTextField filling the search area; padding-end reserved for the actions overlay
		width: 100%;
		--input-padding-end: calc(var(--default-clickable-area) + var(--default-grid-baseline));

		// Neutralize vue-select defaults on the wrapper div (no longer the native input)
		border: none !important;
		margin: 0 !important;
		padding: 0 !important;
	}

	// Force floating label when a value is selected (search input is empty but a value exists)
	.vs__selected-options:has(.vs__selected) .vs__search {
		.input-field__input + .input-field__label {
			--input-label-font-size: 13px;
			line-height: 1.5;
			inset-block-start: calc(-1.5 * var(--input-label-font-size) / 2);
			font-weight: 500;
			border-radius: var(--default-grid-baseline) var(--default-grid-baseline) 0 0;
			background-color: var(--color-main-background);
			padding-inline: var(--default-grid-baseline);
			margin-inline: calc(var(--input-padding-start) - var(--default-grid-baseline)) calc(var(--input-padding-end) - var(--default-grid-baseline));
			transition: height var(--animation-quick), inset-block-start var(--animation-quick), font-size var(--animation-quick), color var(--animation-quick);
		}
	}

	// Single mode: border is on NcTextField, dropdown-toggle is invisible
	&:not(.vs--multiple) .vs__dropdown-toggle {
		padding: 0;
		overflow: visible;
		border: none !important;
		box-shadow: none !important;
		background: transparent;
	}

	.vs__actions {
		position: absolute;
		z-index: 999;
		inset-inline-end: 0;
		top: 50%;
		transform: translateY(-50%);
		height: 100%;
		margin-block-start: 1px;
		display: flex;
		align-items: center;
	}

	.vs__clear {
		margin-inline-end: 2px;
	}

	&.vs--open {
		// Remove bottom border-radius when dropdown is open
		.vs__search .input-field__input {
			border-end-start-radius: 0 !important;
			border-end-end-radius: 0 !important;
		}
	}

	&.vs--disabled {
		// Override vue-select's disabled background on all internal elements
		// to prevent stacking with NcInputField's own background
		.vs__clear,
		.vs__dropdown-toggle,
		.vs__open-indicator,
		.vs__open-indicator-button,
		.vs__search,
		.vs__selected {
			background-color: transparent;
			color: var(--color-text-maxcontrast);
		}

		// Lighter border in disabled state to match single mode (NcInputField uses --color-border-dark)
		.vs__dropdown-toggle {
			--input-border-box-shadow-light: 0 -1px var(--color-border-dark),
				0 0 0 1px color-mix(in srgb, var(--color-border-dark), 65% transparent);
			--input-border-box-shadow-dark: 0 1px var(--color-border-dark),
				0 0 0 1px color-mix(in srgb, var(--color-border-dark), 65% transparent);
		}

		.vs__clear,
		.vs__deselect {
			display: none;
		}
	}

	&--no-wrap {
		.vs__dropdown-toggle {
			overflow: hidden;
		}
		.vs__selected-options {
			flex-wrap: nowrap;
			overflow: auto !important;
			min-width: unset;
			.vs__selected {
				min-width: unset;
			}
		}
	}

	// Drop-up: the menu is detached above the select (calculatePosition leaves a
	// gap for the floating label, which stays in its usual top position),
	// so keep the regular fully-rounded borders instead of flattening the seam
	&--drop-up {
		&.vs--open {
			.vs__search .input-field__input {
				border-end-start-radius: var(--border-radius-element) !important;
				border-end-end-radius: var(--border-radius-element) !important;
			}

			// !important to beat the later-defined down-state open rule
			// (.vs--multiple.vs--open .vs__dropdown-toggle) of equal specificity
			&.vs--multiple .vs__dropdown-toggle {
				border-end-start-radius: var(--border-radius-element) !important;
				border-end-end-radius: var(--border-radius-element) !important;
				// Bottom is a regular outer edge here, not a divider seam
				border-block-end-color: var(--color-main-text) !important;
			}
		}
	}

	.vs__selected-options {
		// If search is hidden, ensure that the height of the search is the same
		min-height: unset;

		// Hide search from dom if unused to prevent unneeded flex wrap
		.vs__selected ~ .vs__search:has(.input-field__input[readonly]) {
			position: absolute;
		}
		padding: 0;
		border: none;
		overflow: visible;
	}

	// Multi-select: border on dropdown-toggle (contains tags + input)
	// NcTextField is transparent; floating label via #header slot
	&.vs--multiple {
		.vs__dropdown-toggle {
			// Use transparent border in closed state to reserve the same space
			// as the open state's real border — prevents layout jump on click
			border: var(--border-width-input-focused, 2px) solid transparent;
			box-shadow: var(--input-border-box-shadow);
			// Top padding for floating label clearance, no bottom padding
			padding-block: calc(var(--default-grid-baseline) * 1.5) 0;
			// Left padding so tags don't overlap the border-radius curve,
			// right padding reserved for the actions overlay (chevron)
			padding-inline: var(--default-grid-baseline) calc(var(--default-clickable-area) + var(--default-grid-baseline));
			overflow: visible;
			background: var(--color-main-background);
		}

		// Wider reservation when the clear button is shown next to the chevron
		&:has(.vs__clear) .vs__dropdown-toggle {
			padding-inline-end: calc(2 * var(--default-clickable-area));
		}

		// When open, switch to visible border with subtle bottom divider
		&.vs--open .vs__dropdown-toggle {
			box-shadow: none !important;
			border-color: var(--color-main-text);
			// Subtle divider line between tags and dropdown (not fully transparent)
			border-block-end-color: var(--color-border-maxcontrast);
			border-end-start-radius: 0;
			border-end-end-radius: 0;
			outline: 2px solid var(--color-main-background);
		}

		// Remove NcTextField border in multi mode — border is on dropdown-toggle
		.vs__search .input-field__input {
			box-shadow: none !important;
			background: transparent;
		}

		// NcTextField shares flex row with tags — always inline, no absolute hiding.
		// No min-width: it may shrink fully so it never forces an empty wrap row
		// (matches vue-select's own search sizing)
		.vs__search {
			width: 0;
			flex-grow: 1;
			min-width: 0;
		}

		// No-wrap: clip overflow inside the toggle (needs to be here
		// for specificity to beat the overflow: visible above)
		&.select--no-wrap {
			.vs__dropdown-toggle {
				overflow: hidden;
			}

			.vs__actions {
				// Slight fade for non-wrap tags display
				background: linear-gradient(90deg, transparent, var(--color-main-background) 10%, var(--color-main-background) 100%);
				margin-block: 0px;
				margin-inline-end: 2px;
				border-radius: var(--border-radius-element);
				height: calc(100% - 6px);
			}
		}

		// No label margin needed — label is via #header
		.vs__search .input-field {
			margin-block-start: 0;
		}

		// Match NcTextField height to tag row height for consistent toggle sizing
		.vs__search .input-field__main-wrapper {
			height: calc(var(--default-clickable-area) - 2 * var(--vs-border-width) - var(--default-grid-baseline));
			margin: calc(var(--default-grid-baseline) / 2) 0;
		}

		// Label: centered inside toggle when empty (placeholder-like),
		// floats above border when has value or open (matches NcInputField)
		.select__label {
			position: absolute;
			z-index: 1;
			inset-inline-start: var(--border-width-input-focused, 2px);
			// Center vertically regardless of toggle height
			top: 50%;
			transform: translateY(-50%);
			font-size: var(--default-font-size);
			margin-inline: var(--border-radius-element);
			color: var(--color-text-maxcontrast);
			pointer-events: none;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: calc(100% - var(--clickable-area-large));
			transition: top var(--animation-quick), transform var(--animation-quick), font-size var(--animation-quick), font-weight var(--animation-quick), background-color var(--animation-quick) var(--animation-slow);
		}

		// Float label when has tags or dropdown is open
		&:has(.vs__selected) .select__label,
		&.vs--open .select__label {
			--input-label-font-size: 13px;
			font-size: var(--input-label-font-size);
			line-height: 1.5;
			// Match NcInputField: half the line-height above the border
			top: calc(-1.5 * var(--input-label-font-size) / 2);
			transform: none;
			font-weight: 500;
			border-radius: var(--default-grid-baseline) var(--default-grid-baseline) 0 0;
			background-color: var(--color-main-background);
			padding-inline: var(--default-grid-baseline);
			margin-inline: calc(var(--border-radius-element) - var(--default-grid-baseline));
			transition: top var(--animation-quick), transform var(--animation-quick), font-size var(--animation-quick), font-weight var(--animation-quick), background-color var(--animation-quick);
		}
	}

	&.vs--single {
		// In single mode, overlay the selected value on top of the NcTextField input area
		// so it appears inside the border (which is on the NcTextField, not the toggle)
		.vs__selected-options {
			position: relative;
			flex-wrap: nowrap;
			// Ensure height even when search input is hidden (vs--unsearchable)
			min-height: var(--default-clickable-area);
		}

		.vs__selected {
			position: absolute;
			// Skip the label clearance so the overlay covers only the input box,
			// keeping (multi-line) content like NcSelectUsers centered on the input
			// (6px = NcInputField .input-field margin-block-start)
			inset-block: 6px 0;
			inset-inline-start: 0;
			inset-inline-end: 0;
			margin: 0;
			z-index: 2; // above vs__search (z-index: 1 from vue-select default)
			pointer-events: none;
			display: flex;
			align-items: center;
			padding-block: 0;
			// Match the input text position: main-wrapper padding (border width) + input padding
			padding-inline: calc(var(--border-radius-element) + var(--border-width-input-focused, 2px)) var(--input-padding-end, calc(var(--default-clickable-area) + var(--default-grid-baseline)));
			background: unset !important;
			border: none;
			border-radius: 0;
			height: unset;
			min-height: unset;
			font-size: var(--default-font-size);
			color: var(--color-main-text);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		// No label clearance to skip when the label is external
		&:has(.input-field--label-outside) .vs__selected {
			inset-block-start: 0;
		}

		// Extra padding when clear button visible (clear + chevron need more space)
		&:has(.vs__clear) .vs__selected {
			padding-inline-end: calc(2 * var(--default-clickable-area));
		}

		&.vs--loading,
		&.vs--open {
			.vs__selected {
				// Fix color to be accessible while typing
				opacity: 0.4;
			}
		}

		// Hide the selected value as soon as the user types a query
		// (restores vue-select's default, overridden by our display: flex above)
		&.vs--searching .vs__selected {
			display: none;
		}
	}
}

// Dropdown menu is teleported to body by floating-ui, so it must be
// styled at root level (cannot be nested under .v-select.select).
// CSS variables must also be set here since it can't inherit from .v-select.select.
.vs__dropdown-menu {
	--vs-border-color: var(--color-border-maxcontrast);
	--vs-border-style: solid;
	--vs-border-radius: var(--border-radius-element);
	--vs-dropdown-bg: var(--color-main-background);
	--vs-dropdown-color: var(--color-main-text);
	--vs-dropdown-option-padding: 8px 20px;
	--vs-dropdown-option--active-bg: var(--color-background-hover);
	--vs-dropdown-option--active-color: var(--color-main-text);
	--vs-dropdown-option--kb-focus-box-shadow: inset 0px 0px 0px 2px var(--color-border-maxcontrast);
	--vs-dropdown-option--deselect-bg: var(--color-error);
	--vs-dropdown-option--deselect-color: #fff;
	border-width: var(--border-width-input-focused) !important;
	border-color: var(--color-main-text) !important;
	outline: none !important;
	box-shadow:
		-2px 0 0 var(--color-main-background), // Right
		0 2px 0 var(--color-main-background), // Bottom
		2px 0 0 var(--color-main-background), // Left
		!important;
	padding: 4px !important;

	&--floating {
		/* Fallback styles overidden by programmatically set inline styles */
		width: max-content;
		position: absolute;
		top: 0;
		inset-inline-start: 0;

		// Top placement: the menu is detached from the select (gap for the
		// floating label), so it keeps a full border on all sides
		&-placement-top {
			border-radius: var(--vs-border-radius) !important;
			border-top-style: var(--vs-border-style) !important;
			box-shadow:
				0 -2px 0 var(--color-main-background), // Top
				-2px 0 0 var(--color-main-background), // Right
				0 2px 0 var(--color-main-background), // Bottom
				2px 0 0 var(--color-main-background), // Left
				!important
		}
	}

	.vs__dropdown-option {
		border-radius: 6px !important;
	}

	.vs__no-options {
		color: var(--color-text-maxcontrast) !important;
	}
}

// Border for .vs__dropdown-toggle — inlined from inputLikeBorder mixin
// because the mixin's @media #{&} produces doubled selectors when nested.
[data-v-new-select].v-select.select .vs__dropdown-toggle {
	--input-border-box-shadow-light: 0 -1px var(--vs-border-color),
		0 0 0 1px color-mix(in srgb, var(--vs-border-color), 65% transparent);
	--input-border-box-shadow-dark: 0 -1px var(--vs-border-color),
		0 0 0 1px color-mix(in srgb, var(--vs-border-color), 65% transparent);
	--input-border-box-shadow: var(--input-border-box-shadow-light);
	border: none;
	border-radius: var(--border-radius-element);
	box-shadow: var(--input-border-box-shadow);
}

// Hover: use .vs--disabled on parent (toggle div never has [disabled] attribute)
[data-v-new-select].v-select.select:not(.vs--disabled) .vs__dropdown-toggle:hover {
	box-shadow: 0 0 0 1px var(--vs-border-color);
}

@media (prefers-color-scheme: dark) {
	[data-v-new-select].v-select.select .vs__dropdown-toggle {
		--input-border-box-shadow: var(--input-border-box-shadow-dark);
	}
}

[data-theme-dark] [data-v-new-select].v-select.select .vs__dropdown-toggle {
	--input-border-box-shadow: var(--input-border-box-shadow-dark);
}

[data-theme-light] [data-v-new-select].v-select.select .vs__dropdown-toggle {
	--input-border-box-shadow: var(--input-border-box-shadow-light);
}

.select--legacy[data-v-new-select].v-select.select .vs__dropdown-toggle {
	box-shadow: 0 0 0 1px var(--vs-border-color);

	&:hover:not([disabled]) {
		box-shadow: 0 0 0 2px var(--vs-border-color);
	}
}
</style>
