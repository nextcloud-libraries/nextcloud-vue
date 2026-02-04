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
import type { PropType } from 'vue'

import { ref, watch } from 'vue'
import NcListItemIcon from '../NcListItemIcon/NcListItemIcon.vue'
import NcSelect from '../NcSelect/NcSelect.vue'
import { t } from '../../l10n.js'
import createElementId from '../../utils/GenRandomId.js'

export interface NcSelectUsersModel {
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

const props = defineProps({
	/**
	 * `aria-label` for the clear input button
	 */
	ariaLabelClearSelected: {
		type: String,
		default: t('Clear selected'),
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
	 */
	ariaLabelDeselectOption: {
		type: Function as PropType<(optionLabel: string) => string>,
		default: (optionLabel: string) => t('Deselect {option}', { option: optionLabel }),
	},

	/**
	 * Keep the dropdown open after selecting an entry.
	 */
	keepOpen: {
		type: Boolean,
		default: false,
	},

	/**
	 * Disable the component
	 */
	disabled: {
		type: Boolean,
		default: false,
	},

	/**
	 * Callback to determine if the provided option should match the current search text.
	 * Used to determine if the option should be displayed.
	 *
	 * By default it filters by the `displayName` and `subname` properties of the user
	 * option object unless this prop is set explicitly
	 */
	filterBy: {
		type: Function as PropType<(option: NcSelectUsersModel, label: string, search: string) => boolean>,
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
	 *
	 * @default 'Select account'
	 */
	inputLabel: {
		type: String,
		default: t('Select account'),
	},

	/**
	 * Pass true if you are using an external label.
	 * In this case make sure you set the `for` attribute of your `<label>` to the `inputId` of this component.
	 */
	labelOutside: {
		type: Boolean,
		default: false,
	},

	/**
	 * Show a loading icon.
	 *
	 * @default false
	 */
	loading: {
		type: Boolean,
		default: false,
	},

	/**
	 * Allow selection of multiple options
	 *
	 * @default false
	 */
	multiple: {
		type: Boolean,
		default: false,
	},

	/**
	 * Disable automatic wrapping when selected options overflow the width.
	 *
	 * @default false
	 */
	noWrap: {
		type: Boolean,
		default: false,
	},

	/**
	 * Array of users.
	 */
	options: {
		type: Array as PropType<NcSelectUsersModel[]>,
		default: () => [],
	},

	/**
	 * Placeholder text.
	 */
	placeholder: {
		type: String,
		default: '',
	},

	/**
	 * Enable if a value is required for native form validation
	 */
	required: {
		type: Boolean,
		default: false,
	},

	/**
	 * Currently selected value
	 *
	 * The `v-model` directive may be used for two-way data binding
	 */
	modelValue: {
		type: Object,
		default: null,
	},
})

const emit = defineEmits(['search', 'update:modelValue'])

const search = ref('')
watch(search, () => {
	/**
	 * Emitted when the user enters some query.
	 * This can be used to asynchronously fetch more options.
	 */
	emit('search', search.value)
})

// Avatar size so the component has the same size as Nc*Field
const clickableArea = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue('--default-clickable-area'))
const gridBaseLine = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue('--default-grid-baseline'))
const avatarSize = clickableArea - 2 * gridBaseLine

/**
 * Filter function to search users.
 *
 * @param option - The option to check
 * @param label - The label of the option
 * @param search - The current search string
 */
function localFilterBy(option: NcSelectUsersModel, label: string, search: string) {
	if (props.filterBy) {
		return props.filterBy
	}

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

<script lang="ts">
/** For backward compatibility with Vue 2 */
export default {
	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
	},
}
</script>

<template>
	<NcSelect
		class="nc-select-users"
		v-bind="$props"
		:filter-by="localFilterBy"
		label="displayName"
		@search="search = $event"
		@update:model-value="$emit('update:modelValue', $event)">
		<template #option="option">
			<NcListItemIcon
				v-bind="option"
				:avatar-size="32"
				:name="option.displayName"
				:search="search" />
		</template>
		<template #selected-option="selectedOption">
			<NcListItemIcon
				v-bind="selectedOption"
				:avatar-size="avatarSize"
				:name="selectedOption.displayName"
				no-margin
				:search="search" />
		</template>
	</NcSelect>
</template>

<style scoped lang="css">
.nc-select-users :deep(.vs__selected) {
	padding-inline: 0 5px !important;
}
</style>
