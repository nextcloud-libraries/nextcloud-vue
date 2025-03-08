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
			multiple: true,
			closeOnSelect: false,
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
		closeOnSelect: false,
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
		multiple: true,
		closeOnSelect: false,
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

### User select examples

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
import AccountGroup from '@mdi/svg/svg/account-group.svg?raw'
import Email from '@mdi/svg/svg/email.svg?raw'

const selectArray = [
	{
		props: {
			inputLabel: 'User select',
			userSelect: true,
			options: [
				{
					id: '0-john',
					displayName: 'John',
					isNoUser: false,
					subname: 'john@example.org',
					icon: '',
					// Example of how to show the user status within the option
					user: '0-john',
					preloadedUserStatus: {
						icon: '',
						status: 'online',
						message: 'I am online',
					},
				},
				{
					id: '0-emma',
					displayName: 'Emma',
					isNoUser: false,
					subname: 'emma@example.org',
					icon: '',
				},
				{
					id: '0-olivia',
					displayName: 'Olivia',
					isNoUser: false,
					subname: 'olivia@example.org',
					icon: '',
				},
				{
					id: '0-noah',
					displayName: 'Noah',
					isNoUser: false,
					subname: 'noah@example.org',
					icon: '',
				},
				{
					id: '0-oliver',
					displayName: 'Oliver',
					isNoUser: false,
					subname: 'oliver@example.org',
					icon: '',
				},
				{
					id: '1-admin',
					displayName: 'Admin',
					isNoUser: true,
					subname: null,
					iconSvg: AccountGroup,
					iconName: 'Group icon',
				},
				{
					id: '2-org@example.org',
					displayName: 'Organization',
					isNoUser: true,
					subname: 'org@example.org',
					iconSvg: Email,
					iconName: 'Email icon',
				},
			],
		},
	},

	{
		props: {
			inputLabel: 'Multiple user select (stay open on select)',
			userSelect: true,
			multiple: true,
			closeOnSelect: false,
			options: [
				{
					id: '0-john',
					displayName: 'John',
					isNoUser: false,
					subname: 'john@example.org',
					icon: '',
				},
				{
					id: '0-emma',
					displayName: 'Emma',
					isNoUser: false,
					subname: 'emma@example.org',
					icon: '',
				},
				{
					id: '0-olivia',
					displayName: 'Olivia',
					isNoUser: false,
					subname: 'olivia@example.org',
					icon: '',
				},
				{
					id: '0-noah',
					displayName: 'Noah',
					isNoUser: false,
					subname: 'noah@example.org',
					icon: '',
				},
				{
					id: '0-oliver',
					displayName: 'Oliver',
					isNoUser: false,
					subname: 'oliver@example.org',
					icon: '',
				},
				{
					id: '1-admin',
					displayName: 'Admin',
					isNoUser: true,
					subname: null,
					iconSvg: AccountGroup,
					iconName: 'Group icon',
				},
				{
					id: '2-org@example.org',
					displayName: 'Organization',
					isNoUser: true,
					subname: 'org@example.org',
					iconSvg: Email,
					iconName: 'Email icon',
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
	grid-template-columns: repeat(1, 500px);
	gap: 10px;
}

.container {
	display: flex;
	flex-direction: column;
	gap: 2px 0;
}
</style>
```
</docs>

<template>
	<VueSelect class="select"
		:class="{
			'select--no-wrap': noWrap,
			'user-select': userSelect,
		}"
		v-bind="propsToForward"
		v-on="listenersToForward"
		@search="searchString => search = searchString">
		<template v-if="!labelOutside && inputLabel" #header>
			<label :for="inputId"
				class="select__label">
				{{ inputLabel }}
			</label>
		</template>
		<template #search="{ attributes, events }">
			<input :class="['vs__search', inputClass]"
				v-bind="attributes"
				:required="inputRequired"
				dir="auto"
				v-on="events">
		</template>
		<template #open-indicator="{ attributes }">
			<ChevronDown v-bind="attributes"
				fill-color="var(--vs-controls-color)"
				:style="{
					cursor: !disabled ? 'pointer' : null,
				}"
				:size="26" />
				<!-- Set size to 26 to make up for the increased padding of this icon -->
		</template>
		<template #option="option">
			<NcListItemIcon v-if="userSelect"
				v-bind="option"
				:avatar-size="32"
				:name="option[localLabel]"
				:search="search" />
			<NcEllipsisedOption v-else
				:name="String(option[localLabel])"
				:search="search" />
		</template>
		<template #selected-option="selectedOption">
			<NcListItemIcon v-if="userSelect"
				v-bind="selectedOption"
				:avatar-size="avatarSize"
				:name="selectedOption[localLabel]"
				no-margin
				:search="search" />
			<NcEllipsisedOption v-else
				:name="String(selectedOption[localLabel])"
				:search="search" />
		</template>
		<template #spinner="spinner">
			<NcLoadingIcon v-if="spinner.loading" />
		</template>
		<template #no-options>
			{{ t('No results') }}
		</template>
		<template v-for="(_, name) in $scopedSlots" #[name]="data">
			<!-- @slot Any combination of slots from https://vue-select.org/api/slots.html -->
			<slot :name="name" v-bind="data" />
		</template>
	</VueSelect>
</template>

<script>
import { VueSelect } from '@nextcloud/vue-select'
import {
	autoUpdate,
	computePosition,
	flip,
	limitShift,
	offset,
	shift,
} from '@floating-ui/dom'
import Vue from 'vue'
import { t } from '../../l10n.js'

import ChevronDown from 'vue-material-design-icons/ChevronDown.vue'
import Close from 'vue-material-design-icons/Close.vue'

import NcEllipsisedOption from '../NcEllipsisedOption/index.js'
import NcListItemIcon from '../NcListItemIcon/index.js'
import NcLoadingIcon from '../NcLoadingIcon/index.js'

import GenRandomId from '../../utils/GenRandomId.js'
import { useModelMigration } from '../../composables/useModelMigration.ts'

import '@nextcloud/vue-select/dist/vue-select.css'

export default {
	name: 'NcSelect',

	components: {
		ChevronDown,
		NcEllipsisedOption,
		NcListItemIcon,
		NcLoadingIcon,
		VueSelect,
	},

	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
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
		 * Close the dropdown when selecting an option
		 *
		 * @see https://vue-select.org/api/props.html#closeonselect
		 */
		closeOnSelect: {
			type: Boolean,
			default: true,
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
					render: createElement => createElement(Close, {
						props: {
							size: 20,
							fillColor: 'var(--vs-controls-color)',
						},
						style: {
							cursor: 'pointer',
						},
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
		 * Enabling `userSelect` will automatically set this to filter by the
		 * `displayName` and `subname` properties of the user option object
		 * unless this prop is set explicitly
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
			default: () => `select-input-${GenRandomId()}`,
		},

		/**
		 * Visible label for the input element
		 *
		 * @todo Set default for @nextcloud/vue 9
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
		 * Enabling `userSelect` will automatically set this to `'displayName'`
		 * unless this prop is set explicitly
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
			 * @param {Record<number, Function>} map - Mapped keyCode to handlers { <keyCode>:<callback> }
			 * @param {import('@nextcloud/vue-select').VueSelect} vm - VueSelect instance
			 * @return {Record<number, Function>} patched keydown event handlers
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
			default: () => GenRandomId(),
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
		 * Enable the user selector with avatars
		 *
		 * Objects must contain the data expected by the
		 * [NcListItemIcon](#/Components/NcListItemIcon) and
		 * [NcAvatar](#/Components/NcAvatar) components
		 */
		userSelect: {
			type: Boolean,
			default: false,
		},

		/**
		 * Removed in v9 - use `modelValue` (`v-model`) instead
		 * @deprecated
		 */
		value: {
			type: [String, Number, Object, Array],
			default: undefined,
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
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 * @deprecated
		 */
		'input',
		'update:modelValue',
		/** Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
	],

	setup(props, {emit}) {
		const clickableArea = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue('--default-clickable-area'))
		const gridBaseLine = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue('--default-grid-baseline'))
		const avatarSize = clickableArea - 2 * gridBaseLine

		const model = useModelMigration(props, emit, 'value', 'input')

		return {
			avatarSize,
			model,
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
			return this.model === null || (Array.isArray(this.model) && this.model.length === 0)
		},

		localCalculatePosition() {
			if (this.calculatePosition !== null) {
				return this.calculatePosition
			}

			return (dropdownMenu, component, { width }) => {
				dropdownMenu.style.width = width

				const addClass = {
					name: 'addClass',
					fn(_middlewareArgs) {
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
							offset(-1),
							addClass,
							togglePlacementClass,
							// Match popperjs default collision prevention behavior by appending the following middleware in order
							flip(),
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
			// Match the email notation like "Jane <j.doe@example.com>" with the email address as matching group
			const EMAIL_NOTATION = /[^<]*<([^>]+)/

			if (this.filterBy !== null) {
				return this.filterBy
			}
			if (this.userSelect) {
				return (option, label, search) => {
					const match = search.match(EMAIL_NOTATION)
					return (match && option.subname?.toLocaleLowerCase?.()?.indexOf(match[1].toLocaleLowerCase()) > -1)
						|| (`${label} ${option.subname}`
							.toLocaleLowerCase()
							.indexOf(search.toLocaleLowerCase()) > -1)
				}
			}
			return VueSelect.props.filterBy.default
		},

		localLabel() {
			if (this.label !== null) {
				return this.label
			}
			if (this.userSelect) {
				return 'displayName'
			}
			return VueSelect.props.label.default
		},

		propsToForward() {
			const vueSelectKeys = [
				...Object.keys(VueSelect.props),
				...VueSelect.mixins.flatMap(mixin => Object.keys(mixin.props ?? {})),
			]
			const initialPropsToForward = Object.fromEntries(
				Object.entries(this.$props)
					.filter(([key, _value]) => vueSelectKeys.includes(key)),
			)
			const propsToForward = {
				...initialPropsToForward,
				// Custom overrides of vue-select props
				value: this.model,
				calculatePosition: this.localCalculatePosition,
				filterBy: this.localFilterBy,
				label: this.localLabel,
			}
			return propsToForward
		},

		listenersToForward() {
			return {
				...this.$listeners,
				input: ($event) => {
					this.model = $event
				},
			}
		},
	},

	mounted() {
		if (!this.labelOutside && !this.inputLabel && !this.ariaLabelCombobox) {
			Vue.util.warn('[NcSelect] An `inputLabel` or `ariaLabelCombobox` should be set. If an external label is used, `labelOutside` should be set to `true`.')
		}
		if (this.inputLabel && this.ariaLabelCombobox) {
			Vue.util.warn('[NcSelect] Only one of `inputLabel` or `ariaLabelCombobox` should to be set.')
		}
	},

	methods: {
		t,
	},
}
</script>

<style lang="scss">
body {
	/**
	 * Set custom vue-select CSS variables.
	 * Needs to be on the body (not :root) for theming to apply (see nextcloud/server#36462)
	 */

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
	--vs-border-radius: var(--border-radius-large);

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
	--vs-actions-padding: 0 8px 0 4px;
}

.v-select.select {
	/* Override default vue-select styles */
	min-height: var(--default-clickable-area);
	min-width: 260px;
	margin: 0 0 var(--default-grid-baseline);

	&.vs--open {
		--vs-border-width: var(--border-width-input-focused, 2px);
	}

	.select__label {
		display: block;
		margin-bottom: 2px;
	}

	.vs__selected {
		height: calc(var(--default-clickable-area) - 2 * var(--vs-border-width) - var(--default-grid-baseline));
		margin: calc(var(--default-grid-baseline) / 2);
		padding-block: 0;
		padding-inline: 12px 8px;
		border-radius: 16px !important;
		background: var(--color-primary-element-light);
		border: none;
	}

	&.vs--open .vs__selected:first-of-type {
		margin-inline-start: calc(var(--default-grid-baseline) / 2 - (var(--border-width-input-focused, 2px) - var(--border-width-input, 2px))) !important; // prevent jumping
	}

	.vs__search {
		text-overflow: ellipsis;
		color: var(--color-main-text);
		min-height: unset !important;
		height: calc(var(--default-clickable-area) - 2 * var(--vs-border-width)) !important;

		&::placeholder {
			color: var(--color-text-maxcontrast);
		}
	}

	.vs__search, .vs__search:focus {
		margin: 0;
	}

	.vs__dropdown-toggle {
		position: relative;
		max-height: 100px;
		padding: 0;
		overflow-y: auto;
	}

	.vs__actions {
		position: sticky;
		top: 0;
	}

	.vs__clear {
		margin-right: 2px;
	}

	&.vs--open .vs__dropdown-toggle {
		border-width: var(--border-width-input-focused);
		outline: 2px solid var(--color-main-background);
		border-color: var(--color-main-text);
		border-bottom-color: transparent;
	}

	&:not(.vs--disabled, .vs--open) .vs__dropdown-toggle:hover {
		outline: 2px solid var(--color-main-background);
		border-color: var(--color-main-text);
	}

	&.vs--disabled {
		.vs__search,
		.vs__selected {
			color: var(--color-text-maxcontrast);
		}

		.vs__clear,
		.vs__deselect {
			display: none;
		}
	}

	&--no-wrap {
		.vs__selected-options {
			flex-wrap: nowrap;
			overflow: auto;
			min-width: unset;
			.vs__selected {
				min-width: unset;
			}
		}
	}

	&--drop-up {
		&.vs--open {
			.vs__dropdown-toggle {
				border-radius: 0 0 var(--vs-border-radius) var(--vs-border-radius);
				border-top-color: transparent;
				border-bottom-color: var(--color-main-text);
			}
		}
	}

	.vs__selected-options {
		// If search is hidden, ensure that the height of the search is the same
		min-height: calc(var(--default-clickable-area) - 2 * var(--vs-border-width));

		// Hide search from dom if unused to prevent unneeded flex wrap
		.vs__selected ~ .vs__search[readonly] {
			position: absolute;
		}
		padding: 0 5px;
	}

	&.vs--single {
		&.vs--loading,
		&.vs--open {
			.vs__selected {
				// Fix `max-width` for `position: absolute`
				max-width: 100%;
				// Fix color to be accessible
				opacity: 1;
				color: var(--color-text-maxcontrast);
			}
		}
		.vs__selected-options {
			flex-wrap: nowrap;
		}
		.vs__selected {
			background: unset !important;
		}
	}
}

.vs__dropdown-menu {
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
		left: 0;

		&-placement-top {
			border-radius: var(--vs-border-radius) var(--vs-border-radius) 0 0 !important;
			border-top-style: var(--vs-border-style) !important;
			border-bottom-style: none !important;
			box-shadow:
				0 -2px 0 var(--color-main-background), // Top
				-2px 0 0 var(--color-main-background), // Right
				2px 0 0 var(--color-main-background), // Left
				!important
		}
	}

	.vs__dropdown-option {
		border-radius: 6px !important;
	}

	.vs__no-options {
		color: var(--color-text-lighter) !important;
	}
}

// Selected users require slightly different padding
.user-select .vs__selected {
	padding-inline: 0 5px !important;
}
</style>
