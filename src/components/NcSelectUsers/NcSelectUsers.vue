<!--
	- SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
	- SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Nextcloud user picker

#### Examples

```vue
<template>
	<div class="grid">
		<div v-for="{ props } in selectArray"
			class="container">
			<NcSelectUsers v-bind="props"
				v-model="props.value" />
		</div>
	</div>
</template>

<script>
import svgAccountGroup from '@mdi/svg/svg/account-group.svg?raw'
import svgEmail from '@mdi/svg/svg/email.svg?raw'

const selectArray = [
	{
		props: {
			inputLabel: 'User select',
			options: [
				{
					id: '0-john',
					displayName: 'John',
					isNoUser: false,
					subname: 'john@example.org',
					// Example of how to show the user status within the option
					user: '0-john',
					preloadedUserStatus: {
						status: 'online',
						message: 'I am online',
					},
				},
				{
					id: '0-emma',
					displayName: 'Emma',
					isNoUser: false,
					subname: 'emma@example.org',
				},
				{
					id: '0-olivia',
					displayName: 'Olivia',
					isNoUser: false,
					subname: 'olivia@example.org',
				},
				{
					id: '0-noah',
					displayName: 'Noah',
					isNoUser: false,
					subname: 'noah@example.org',
				},
				{
					id: '0-oliver',
					displayName: 'Oliver',
					isNoUser: false,
					subname: 'oliver@example.org',
				},
				{
					id: '1-admin',
					displayName: 'Admin',
					isNoUser: true,
					iconSvg: svgAccountGroup,
					iconName: 'Group icon',
				},
				{
					id: '2-org@example.org',
					displayName: 'Organization',
					isNoUser: true,
					subname: 'org@example.org',
					iconSvg: svgEmail,
					iconName: 'Email icon',
				},
			],
		},
	},

	{
		props: {
			inputLabel: 'Multiple user select (stay open on select)',
			keepOpen: true,
			multiple: true,
			options: [
				{
					id: '0-john',
					displayName: 'John',
					isNoUser: false,
					subname: 'john@example.org',
				},
				{
					id: '0-emma',
					displayName: 'Emma',
					isNoUser: false,
					subname: 'emma@example.org',
				},
				{
					id: '0-olivia',
					displayName: 'Olivia',
					isNoUser: false,
					subname: 'olivia@example.org',
				},
				{
					id: '0-noah',
					displayName: 'Noah',
					isNoUser: false,
					subname: 'noah@example.org',
				},
				{
					id: '0-oliver',
					displayName: 'Oliver',
					isNoUser: false,
					subname: 'oliver@example.org',
				},
				{
					id: '1-admin',
					displayName: 'Admin',
					isNoUser: true,
					iconSvg: svgAccountGroup,
					iconName: 'Group icon',
				},
				{
					id: '2-org@example.org',
					displayName: 'Organization',
					isNoUser: true,
					subname: 'org@example.org',
					iconSvg: svgEmail,
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

<script setup lang="ts">
import { ref, watch } from 'vue'

import NcListItemIcon from '../NcListItemIcon/index.js'
import NcSelect from '../NcSelect/index.js'

export interface IUserData {
	id: string

	/**
	 * Main display name
	 */
	displayName: string

	/**
	 * The user id.
	 * Will be used to fetch the user status if not disabled.
	 */
	user?: string

	/**
	 * The secondary displayname (e.g. the email address).
	 */
	subname?: string

	/**
	 * Optional icon to use as the avatar.
	 * Setting this will disable the automatic avatar loading.
	 */
	iconSvg?: string

	/**
	 * Accessible name for the icon.
	 */
	iconName?: string

	/**
	 * If this is a guest user.
	 * Needed as guest users have a different API endpoint for avatar loading.
	 */
	isGuest?: boolean

	/**
	 * Set if this is not a regular user.
	 * This will disable user status and avatar loading.
	 */
	isNoUser?: boolean
}

defineProps<{
	/**
	 * `aria-label` for the clear input button.
	 *
	 * @default 'Clear selected'
	 */
	ariaLabelClearSelected?: string

	/**
	 * `aria-label` for the listbox element.
	 *
	 * @default 'Options'
	 */
	ariaLabelListbox?: string

	/**
	 * Allows to customize the `aria-label` for the deselect-option button.
	 *
	 * @default (label) => `Deselect ${label}`
	 */
	ariaLabelDeselectOption?: (label: string) => string

	/**
	 * Disable the component.
	 */
	disabled?: boolean

	/**
	 * Input element id.
	 *
	 * @default random generated id
	 */
	inputId?: string

	/**
	 * Visible label for the input element
	 *
	 * @default 'Select account'
	 */
	inputLabel?: string

	/**
	 * Pass true if you are using an external label.
	 * In this case make sure you set the `for` attribute of your `<label>` to the `inputId` of this component.
	 */
	labelOutside?: boolean

	/**
	 * Keep the dropdown open after selecting an entry.
	 */
	keepOpen?: boolean

	/**
	 * Show a loading icon.
	 */
	loading?: boolean

	/**
	 * Allow selection of multiple options
	 */
	multiple?: boolean

	/**
	 * Disable automatic wrapping when selected options overflow the width.
	 */
	noWrap?: boolean

	/**
	 * Array of users or similar object (e.g. groups or guest users).
	 */
	options: IUserData[]

	/**
	 * Placeholder text.
	 *
	 * @default ''
	 */
	placeholder?: string

	/**
	 * Enable if a value is required for native form validation.
	 */
	required?: boolean
}>()

/**
 * Currently selected value.
 * The `v-model` directive may be used for two-way data binding.
 */
defineModel<IUserData>('modelValue')

const emit = defineEmits<{
	/**
	 * Emitted when the user enters some query.
	 * This can be used to asynchronously fetch more options.
	 */
	search: [string]
}>()

const search = ref('')
watch(search, () => emit('search', search.value))

// Avatar size so the component has the same size as Nc*Field
const clickableArea = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue('--default-clickable-area'))
const gridBaseLine = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue('--default-grid-baseline'))
const avatarSize = clickableArea - 2 * gridBaseLine

/**
 * Filter function to search users.
 *
 * @param option - The option to check
 * @param option.subname - The second line to check (often the email address)
 * @param label - The label of the option
 * @param search - The current search string
 */
function filterBy(option: { subname?: string }, label: string, search: string) {
	// Match the email notation like "Jane <j.doe@example.com>" with the email address as matching group
	const EMAIL_NOTATION = /[^<]*<([^>]+)/

	const match = search.match(EMAIL_NOTATION)
	const subname = option.subname?.toLocaleLowerCase() ?? ''
	return (match && subname.indexOf(match[1].toLocaleLowerCase()) > -1)
		|| (`${label} ${option.subname}`
			.toLocaleLowerCase()
			.indexOf(search.toLocaleLowerCase()) > -1)
}
</script>

<template>
	<NcSelect class="nc-select-users"
		v-bind="$props"
		:filter-by
		label="displayName"
		@search="search = $event"
		@update:model-value="$emit('update:modelValue', $event)">
		<template #option="option">
			<NcListItemIcon v-bind="option"
				:avatar-size="32"
				:name="option.displayName"
				:search />
		</template>
		<template #selected-option="selectedOption">
			<NcListItemIcon v-bind="selectedOption"
				:avatar-size
				:name="selectedOption.displayName"
				no-margin
				:search />
		</template>
	</NcSelect>
</template>

<style scoped lang="css">
.nc-select-users :deep(.vs__selected) {
	padding-inline: 0 5px !important;
}
</style>
