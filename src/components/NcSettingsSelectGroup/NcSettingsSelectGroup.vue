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
		<NcSettingsSelectGroup v-model="groups" :disabled="true" label="Also a fallback for the placeholder" />
		<div>You have selected: <code>{{ groups }}</code></div>
	</section>
</template>
<script>
export default {
	data() {
		return {
			groups: []
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
			:input-id="id"
			:limit="5"
			label="displayname"
			:multiple="true"
			:close-on-select="false"
			:disabled="disabled"
			@input="update"
			@search="findGroup" />
	</div>
</template>

<script>
import NcSelect from '../../components/NcSelect/index.js'
import { t } from '../../l10n.js'
import l10n from '../../mixins/l10n.js'
import GenRandomId from '../../utils/GenRandomId.js'

import axios from '@nextcloud/axios'
import { showError } from '@nextcloud/dialogs'
import { generateOcsUrl } from '@nextcloud/router'

export default {
	name: 'NcSettingsSelectGroup',
	components: {
		NcSelect,
	},
	mixins: [l10n],
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
			groups: {},
			randId: GenRandomId(),
		}
	},
	computed: {
		inputValue() {
			return this.getValueObject
		},
		getValueObject() {
			return this.value.filter((group) => group !== '' && typeof group !== 'undefined').map(
				(id) => {
					if (typeof this.groups[id] === 'undefined') {
						return {
							id,
							displayname: id,
						}
					}
					return this.groups[id]
				}
			)
		},
		groupsArray() {
			return Object.values(this.groups)
		},
	},
	methods: {
		update(updatedValue) {
			const value = updatedValue.map((element) => element.id)
			/** Emitted when the groups selection changes<br />**Payload:** `value` (`Array`) - *Ids of selected groups */
			this.$emit('input', value)
		},
		async findGroup(query) {
			try {
				query = typeof query === 'string' ? encodeURI(query) : ''
				const response = await axios.get(generateOcsUrl(`cloud/groups/details?search=${query}&limit=10`, 2))

				if (Object.keys(response.data.ocs.data.groups).length > 0) {
					response.data.ocs.data.groups.forEach((element) => {
						if (typeof this.groups[element.id] === 'undefined') {
							this.$set(this.groups, element.id, element)
						}
					})
					return true
				}
			} catch (error) {
				/** Emitted if groups could not be queried.<br />**Payload:** `error` (`object`) - The Axios error */
				this.$emit('error', error)
				showError(t('Unable to search the group'))
			}
			return false
		},
	},
}
</script>
