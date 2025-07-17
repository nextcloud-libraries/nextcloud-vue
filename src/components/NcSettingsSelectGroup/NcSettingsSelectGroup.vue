<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
```vue
<template>
	<section>
		<NcSettingsSelectGroup v-model="groups" placeholder="Select user groups" label="The hidden label" />
		<NcSettingsSelectGroup v-model="otherGroups" :disabled="true" label="Also a fallback for the placeholder" />
		<div>You have selected: <code>{{ groups }}</code> and <code>{{ otherGroups }}</code></div>
	</section>
</template>
<script>
export default {
	data() {
		return {
			groups: [],
			otherGroups: ['admin']
		}
	}
}
</script>
<style scoped>
section * {
	padding: 6px 0px;
}
</style>
```
</docs>

<template>
	<div>
		<label v-if="label" :for="id" class="hidden-visually">{{ label }}</label>
		<NcSelect :model-value="inputValue"
			:options="groupsArray"
			:placeholder="placeholder || label"
			:filter-by="filterGroups"
			:input-id="id"
			:limit="5"
			label="displayname"
			:multiple="true"
			:close-on-select="false"
			:disabled="disabled"
			@update:model-value="update"
			@search="onSearch" />
		<div v-show="hasError" class="select-group-error">
			{{ errorMessage }}
		</div>
	</div>
</template>

<script>
import NcSelect from '../../components/NcSelect/index.js'
import { t } from '../../l10n.js'
import { createElementId } from '../../utils/createElementId.ts'

import axios from '@nextcloud/axios'
import debounce from 'debounce'
import { generateOcsUrl } from '@nextcloud/router'

export default {
	name: 'NcSettingsSelectGroup',
	components: {
		NcSelect,
	},

	props: {
		/**
		 * The text of the label element of the select group input
		 */
		label: {
			type: String,
			required: true,
		},

		/**
		 * Placeholder for the input element
		 * For backwards compatibility it falls back to the `label` value
		 */
		placeholder: {
			type: String,
			default: '',
		},

		/**
		 * id attribute of the select group element
		 */
		id: {
			type: String,
			default: () => 'action-' + createElementId(),
			validator: id => id.trim() !== '',
		},

		/**
		 * value of the select group input
		 * A list of group IDs can be provided
		 */
		modelValue: {
			type: Array,
			default: () => [],
		},

		/**
		 * disabled state of the settings select group input
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'error',
		'input',
		'update:modelValue',
	],
	data() {
		return {
			/** Temporary store to cache groups */
			groups: {},
			randId: createElementId(),
			errorMessage: '',
		}
	},
	computed: {
		/**
		 * If the error message should be shown
		 */
		hasError() {
			return this.errorMessage !== ''
		},

		/**
		 * Validate input value and only return valid strings (group IDs)
		 *
		 * @return {string[]}
		 */
		filteredValue() {
			return this.modelValue.filter((group) => group !== '' && typeof group === 'string')
		},

		/**
		 * value property converted to an array of group objects used as input for the NcSelect
		 */
		inputValue() {
			return this.filteredValue.map(
				(id) => {
					if (typeof this.groups[id] === 'undefined') {
						return {
							id,
							displayname: id,
						}
					}
					return this.groups[id]
				},
			)
		},

		/**
		 * Convert groups object to array of groups required for NcSelect.options
		 * Filter out currently selected values
		 *
		 * @return {object[]}
		 */
		groupsArray() {
			return Object.values(this.groups).filter(g => !this.modelValue.includes(g.id))
		},
	},
	watch: {
		/**
		 * If the value is changed, check that all groups are loaded so we show the correct display name
		 */
		modelValue: {
			handler() {
				const loadedGroupIds = Object.keys(this.groups)
				const missing = this.filteredValue.filter(group => !loadedGroupIds.includes(group))
				missing.forEach((groupId) => {
					this.loadGroup(groupId)
				})
			},
			// Run the watch handler also when the component is initially mounted
			immediate: true,
		},
	},
	/**
	 * Load groups matching the empty query to reduce API calls
	 */
	async mounted() {
		// version scoped to prevent issues with different library versions
		const storageName = `${appName}:${appVersion}/initialGroups`

		let savedGroups = window.sessionStorage.getItem(storageName)
		if (savedGroups) {
			savedGroups = Object.fromEntries(JSON.parse(savedGroups).map(group => [group.id, group]))
			this.groups = { ...this.groups, ...savedGroups }
		} else {
			await this.loadGroup('')
			window.sessionStorage.setItem(storageName, JSON.stringify(Object.values(this.groups)))
		}
	},
	methods: {
		t,

		/**
		 * Called when a new group is selected or previous group is deselected to emit the update event
		 *
		 * @param {object[]} updatedValue Array of selected groups
		 */
		update(updatedValue) {
			const value = updatedValue.map((element) => element.id)
			/** Emitted when the groups selection changes<br />**Payload:** `value` (`Array`) - *Ids of selected groups */
			this.$emit('update:modelValue', value)
		},

		/**
		 * Use provisioning API to search for given group and save it in the groups object
		 *
		 * @param {string} query The query like parts of the id oder display name
		 * @return {boolean}
		 */
		async loadGroup(query) {
			try {
				query = typeof query === 'string' ? encodeURI(query) : ''
				const response = await axios.get(generateOcsUrl(`cloud/groups/details?search=${query}&limit=10`, 2))

				// No network error, so reset any error after 5 seconds
				if (this.errorMessage !== '') {
					window.setTimeout(() => {
						this.errorMessage = ''
					}, 5000)
				}

				if (Object.keys(response.data.ocs.data.groups).length > 0) {
					const newGroups = Object.fromEntries(response.data.ocs.data.groups.map((element) => [element.id, element]))
					this.groups = { ...this.groups, ...newGroups }
					return true
				}
			} catch (error) {
				/** Emitted if groups could not be queried.<br />**Payload:** `error` (`object`) - The Axios error */
				this.$emit('error', error)
				this.errorMessage = t('Unable to search the group')
			}
			return false
		},

		/**
		 * Custom filter function for `NcSelect` to filter by ID *and* display name
		 *
		 * @param {object} option One of the groups
		 * @param {string} label The label property of the group
		 * @param {string} search The current search string
		 */
		filterGroups(option, label, search) {
			return `${label || ''} ${option.id}`.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1
		},

		/**
		 * Debounce the group search (reduce API calls)
		 */
		onSearch: debounce(function(query) {
			this.loadGroup(query)
		}, 200),
	},
}
</script>

<style scoped lang="scss">
.select-group-error {
	color: var(--color-error);
	font-size: 13px;
	padding-inline-start: var(--border-radius-element);
}
</style>
