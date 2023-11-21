<!--
  - @copyright Copyright (c) 2019 Julius Härtl <jus@bitgrid.net>
  -
  - @author Julius Härtl <jus@bitgrid.net>
  - @author Greta Doci <gretadoci@gmail.com>
  - @author Ferdinand Thiessen <opensource@fthiessen.de>
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
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
		<NcSelect :value="inputValue"
			:options="groupsArray"
			:placeholder="placeholder || label"
			:filter-by="filterGroups"
			:input-id="id"
			:limit="5"
			label="displayname"
			:multiple="true"
			:close-on-select="false"
			:disabled="disabled"
			@input="update"
			@search="onSearch" />
		<div v-show="hasError" class="select-group-error">
			{{ errorMessage }}
		</div>
	</div>
</template>

<script>
import NcSelect from '../../components/NcSelect/index.js'
import { t } from '../../l10n.js'
import GenRandomId from '../../utils/GenRandomId.js'

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
			default: () => 'action-' + GenRandomId(),
			validator: id => id.trim() !== '',
		},

		/**
		 * value of the select group input
		 * A list of group IDs can be provided
		 */
		value: {
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
		'input',
		'error',
	],
	data() {
		return {
			/** Temporary store to cache groups */
			groups: {},
			randId: GenRandomId(),
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
			return this.value.filter((group) => group !== '' && typeof group === 'string')
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
			return Object.values(this.groups).filter(g => !this.value.includes(g.id))
		},
	},
	watch: {
		/**
		 * If the value is changed, check that all groups are loaded so we show the correct display name
		 */
		value: {
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
			this.$emit('input', value)
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
	padding-inline-start: var(--border-radius-large);
}
</style>
