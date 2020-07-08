<!--
  - @copyright Copyright (c) 2019 Julius Härtl <jus@bitgrid.net>
  -
  - @author Julius Härtl <jus@bitgrid.net>
  - @author Greta Doci <gretadoci@gmail.com>
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

<template>
	<Multiselect :value="inputValue"
		:options="groupsArray"
		:options-limit="5"
		:placeholder="label"
		track-by="id"
		label="displayname"
		class="multiselect-vue"
		:multiple="true"
		:close-on-select="false"
		:tag-width="60"
		:disabled="disabled"
		@input="update"
		@search-change="findGroup">
		<span slot="noResult">{{ t( 'No results') }}</span>
	</Multiselect>
</template>

<script>
import axios from '@nextcloud/axios'
import Multiselect from '../../components/Multiselect/Multiselect'
import GenRandomId from '../../utils/GenRandomId'
import { generateOcsUrl } from '@nextcloud/router'
import { showError } from '@nextcloud/dialogs'
import l10n from '../../mixins/l10n'
export default {
	name: 'SettingsSelectGroup',
	components: {
		Multiselect,
	},
	mixins: [l10n],
	props: {
		/**
			 * label of the select group element
			 */
		label: {
			type: String,
			required: true,
		},

		/**
			 * hint of the select group input
			 */
		hint: {
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
	data() {
		return {
			groups: {},
			randId: GenRandomId(),
		}
	},
	computed: {
		inputValue() {
			return this.getValueObject()
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
		update() {
			this.$emit('input', this.inputValue.map((element) => element.id))
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
				this.$emit('error', error)
				showError(t('Unable to search the group'))
			}
			return false
		},
	},
}
</script>
