<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
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
	<!--
	# This is the original Multiselect !
	## tag-placeholder="create"
	-> Hack to allow us to detect when an option needs
	-  to be created (with css) and apply the proper
	-  styling to this entry, @see [data-select='create']
	## :close-on-select="!multiple"
	-> If multiple choice allowed, leave the dropdown
	-  open after select
	## v-on="$listeners", v-bind="$attrs"
	-> Forward all undeclared props to the vue-multiselect child
	-->
	<vue-multiselect
		:value="value"
		v-bind="$attrs"
		:class="[
			{
				'icon-loading-small': loading
			},
			multiple ? 'multiselect--multiple': 'multiselect--single'
		]"
		:limit="maxOptions"
		:close-on-select="!multiple"
		:multiple="multiple"
		:label="label"
		:track-by="trackBy"
		tag-placeholder="create"
		v-on="$listeners"
		@update:value="$emit('update:value', value)">
		<!-- This is the scope to format the list of available options in the dropdown
			Two templates to avoid registering the slot unnecessary -->
		<template #option="scope">
			<!-- Avatar display select slot override.
				You CANNOT use this scope, we will replace it by this -->
			<avatar-select-option v-if="userSelect && !$scopedSlots['option']"
				:option="scope.option" />

			<!-- ellipsis in the middle if no option slot
				is defined in the parent -->
			<ellipsised-option v-else-if="!$scopedSlots['option']"
				:option="scope.option" :label="label" />

			<!-- Passing the singleLabel slot -->
			<slot v-else name="option" v-bind="scope" />
		</template>

		<!-- Registering the limit slot to get the +xxx tooltip.
			You CANNOT use this scope, we will replace it by this -->
		<span v-if="multiple" slot="limit" v-tooltip.auto="formatLimitTitle(value)"
			class="multiselect__limit">
			{{ limitString }}
		</span>

		<!-- Passing the singleLabel slot, this is used to format the selected
			option on NON-multiple multiselects -->
		<template v-if="$scopedSlots['singleLabel']" slot="singleLabel" slot-scope="scope">
			<slot name="singleLabel" v-bind="scope" />
		</template>

		<!-- TODO add translation system
		<span slot="noResult">{{ t('core', 'No results') }}</span> -->
	</vue-multiselect>
</template>

<script>
import AvatarSelectOption from './AvatarSelectOption'
import EllipsisedOption from './EllipsisedOption'
import Tooltip from 'Directives/Tooltip'
import VueMultiselect from 'vue-multiselect'

export default {
	name: 'Multiselect',
	components: {
		AvatarSelectOption,
		EllipsisedOption,
		VueMultiselect
	},
	directives: {
		tooltip: Tooltip
	},
	inheritAttrs: false,

	/**
	 * Every prop that is defined here will break the auto
	 * forward to the vue-multiselect component
	 * You will have to specify it as a prop on the template
	 */
	props: {
		// eslint-disable-next-line
		value: {
			default() {
				return []
			}
		},
		// you need to declare props here if you want
		// to use them on this component
		// otherwise they're just sent to the child
		// component and are not accessible here
		multiple: {
			type: Boolean,
			default: false
		},
		limit: {
			type: Number,
			default: 99999
		},
		label: {
			type: String,
			default: ''
		},
		trackBy: {
			type: String,
			default: ''
		},

		/**
		 * Enable the big user selector w/ avatar
		 * Make sure your objects fit the requirements
		 * @default true
		 * @type {Boolean}
		 */
		userSelect: {
			type: Boolean,
			default: false
		},
		/**
		 * Overriding the default slot. Only showing a spiner.
		 * @default true
		 * @type {Boolean}
		 */
		loading: {
			type: Boolean,
			default: false
		},
		/**
		 * Enable the automatic limit and width calculation
		 * Only works on multiple
		 * @default true
		 * @type {Boolean}
		 */
		autoLimit: {
			type: Boolean,
			default: true
		},
		/**
		* If autoLimit, allow to specify the min-width of every
		* selected option when calculating the number of options
		* to show. This needs to be a positive integer.
		* @default 150
		* @type {Number}
		*/
		tagWidth: {
			type: Number,
			default: 150,
			validator: (value) => {
				return value > 0
			}
		}
	},

	data() {
		return {
			elWidth: 0
		}
	},
	computed: {
		/**
		 * Calculate the number of options to show
		 * depending on the width of the select.
		 * Only works if `autoLimit` is `true`
		 */
		maxOptions() {
			if (this.autoLimit && this.elWidth > 0 && this.tagWidth !== 0) {
				const limit = Math.floor(this.elWidth / this.tagWidth)
				return limit > 0 ? limit : 1
			}
			return this.limit ? this.limit : 9999
		},
		/**
		 * Make the tooltip limit string for the `autoLimit`
		 */
		limitString() {
			return `+${this.value.length - this.maxOptions}`
		}
	},

	watch: {
		// ensure we update the width when we add or remove data
		value: function() {
			this.updateWidth()
		}
	},

	mounted() {
		this.updateWidth()
		window.addEventListener('resize', this.updateWidth)
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.updateWidth)
	},

	methods: {
		/**
		 * Format array of groups objects to a string
		 * for the limit popup using the label prop
		 *
		 * @param {array} options The selected options
		 * @returns {string}
		 */
		formatLimitTitle(options) {
			if (Array.isArray(options) && options.length > 0) {
				let selection = options
				if (typeof options[0] === 'object') {
					selection = options.map(option => option[this.label])
				}
				return selection.slice(this.maxOptions).join(', ')
			}
			return ''
		},

		/**
		 * Update the component width data
		 */
		updateWidth() {
			// width of the tags wrapper minus the padding
			if (this.$el) {
				this.elWidth = this.$el.querySelector('.multiselect__tags-wrap').offsetWidth - 10
			}
		}
	}
}
</script>
