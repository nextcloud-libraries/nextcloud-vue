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
<docs>
## Multiselect
We're wrapping the awesome vue-multiselect library to add our own styling and default props/methods
You can use all the properties from https://vue-multiselect.js.org that are not declared/overrided here.

### Simple examples
```vue
<template>
	<div class="wrapper">
		<Multiselect v-model="value1" :options="options" />
		<Multiselect v-model="value2" :options="options" :multiple="true" />
	</div>
</template>

<script>
import Multiselect from '../index'
export default {
	data() {
		return { value1: '2', value2: ['2'], options: ['0', '1', '2', '3', '4'] }
	}
}
</script>
```

### Simple example with objects
You can either use the exact object or the track-by key to match against your options

```vue
<template>
	<div class="wrapper">
		<Multiselect v-model="value1" :options="options" track-by="id" label="label" />
		<pre>Selected option: {{ value1 }}</pre>
		<br />
		<Multiselect v-model="value2" :options="options" track-by="id" label="label" />
		<pre>Selected option: {{ value2 }}</pre>
	</div>
</template>

<script>
import Multiselect from '../index'
const options = [
	{ id: 1, label: 'Option 1' },
	{ id: 2, label: 'Option 2' },
	{ id: 3, label: 'Option 3' },
	{ id: 4, label: 'Option 4' }
]
export default {
	data() {
		return {
			value1: options[1],
			value2: 2,
			options
		}
	}
}
</script>
```

### Limit with automated tooltip
```vue
<template>
	<Multiselect v-model="value"
		:options="options" :multiple="true"
		:tag-width="80" />
</template>

<script>
import Multiselect from '../index'
export default {
	data() {
		return {
			value: ['eirmod', 'et', 'magna', 'invidunt', 'tempor'],
			options: ['Consetetur', 'sadipscing', 'elitr', 'sed',
				'diam', 'nonumy', 'eirmod', 'tempor', 'invidunt',
				'ut', 'labore', 'et', 'dolore', 'magna', 'aliquyam', 'erat']
		}
	}
}
</script>
```

### User layout
Please see the [AvatarSelectOption](#AvatarSelectOption) component
</docs>

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
	<VueMultiselect
		ref="VueMultiselect"
		v-model="localValue"
		v-bind="$attrs"
		:class="[
			{
				'icon-loading-small': loading
			},
			multiple ? 'multiselect--multiple': 'multiselect--single'
		]"
		:options="options"
		:limit="maxOptions"
		:close-on-select="!multiple"
		:multiple="multiple"
		:label="label"
		:track-by="trackBy"
		tag-placeholder="create"
		v-on="$listeners">
		<!-- This is the scope to format the list of available options in the dropdown
			Two templates to avoid registering the slot unnecessary -->
		<template #option="scope">
			<!-- Avatar display select slot override.
				You CANNOT use this scope, we will replace it by this -->
			<AvatarSelectOption v-if="userSelect && !$scopedSlots['option']"
				v-bind="scope.option"
				:search="scope.search" />

			<!-- Ellipsis in the middle if no option slot
				is defined in the parent -->
			<EllipsisedOption v-else-if="!$scopedSlots['option']"
				:name="getOptionLabel(scope.option)"
				:option="scope.option"
				:search="scope.search"
				:label="label" />

			<!-- Passing the singleLabel slot -->
			<slot v-else name="option" v-bind="scope" />
		</template>

		<!-- Registering the limit slot to get the +xxx tooltip.
			You CANNOT use this scope, we will replace it by this -->
		<template v-if="multiple" #limit>
			<span v-tooltip.auto="formatLimitTitle(value)"
				class="multiselect__limit">
				{{ limitString }}
			</span>
		</template>

		<!-- Passing the singleLabel slot, this is used to format the selected
			option on NON-multiple multiselects -->
		<template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>

		<span slot="noResult">{{ t('No results') }}</span>
	</VueMultiselect>
</template>

<script>
import AvatarSelectOption from './AvatarSelectOption'
import EllipsisedOption from './EllipsisedOption'
import l10n from '../../mixins/l10n'
import Tooltip from '../../directives/Tooltip'
import VueMultiselect from 'vue-multiselect'

export default {
	name: 'Multiselect',
	components: {
		AvatarSelectOption,
		EllipsisedOption,
		VueMultiselect,
	},
	directives: {
		tooltip: Tooltip,
	},
	mixins: [l10n],
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
			},
		},

		/**
		 * Allow multiple select ?
		 */
		multiple: {
			type: Boolean,
			default: false,
		},

		/**
		 * Limit the number of results
		 */
		limit: {
			type: Number,
			default: 99999,
		},

		/**
		 * key to use as label on object options
		 */
		label: {
			type: String,
			default: '',
		},
		/**
		 * key to use as id on object options
		 */
		trackBy: {
			type: String,
			default: '',
		},

		/**
		 * Array of available options: Objects, Strings or Integers.
		 * If array of objects, visible label will default to option.label.
		 * If `labal` prop is passed, label will equal option['label']
		 */
		options: {
			type: Array,
			required: true,
		},

		/**
		 * Enable the big user selector w/ avatar
		 * Make sure your objects fit the requirements
		 */
		userSelect: {
			type: Boolean,
			default: false,
		},
		/**
		 * Overriding the default slot. Only showing a spiner.
		 */
		loading: {
			type: Boolean,
			default: false,
		},
		/**
		 * Enable the automatic limit and width calculation
		 * Only works on multiple
		 */
		autoLimit: {
			type: Boolean,
			default: true,
		},
		/**
		* If autoLimit, allow to specify the min-width of every
		* selected option when calculating the number of options
		* to show. This needs to be a positive integer.
		*/
		tagWidth: {
			type: Number,
			default: 150,
			validator: (value) => {
				return value > 0
			},
		},
	},

	data() {
		return {
			elWidth: 0,
		}
	},
	computed: {
		/**
		 * Calculate the number of options to show
		 * depending on the width of the select.
		 * Only works if `autoLimit` is `true`
		 * @returns {number}
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
		 * @returns {string}
		 */
		limitString() {
			return `+${this.value.length - this.maxOptions}`
		},

		localValue: {
			get() {
				if (this.trackBy && this.options
					&& typeof this.value !== 'object'
					&& this.options[this.value]) {
					return this.options[this.value]
				}
				return this.value
			},
			set(value) {
				this.$emit('update:value', value)
				this.$emit('change', value)
			},
		},
	},

	watch: {
		// ensure we update the width when we add or remove data
		value() {
			this.updateWidth()
		},
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
		 * Returns the option label
		 *
		 * @param {String} option The selected option
		 * @returns {string}
		 */
		getOptionLabel(option) {
			return String(this.$refs.VueMultiselect?.getOptionLabel(option))
		},
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
			if (this.$el && this.$el.querySelector('.multiselect__tags-wrap')) {
				this.elWidth = this.$el.querySelector('.multiselect__tags-wrap').offsetWidth - 10
			}
		},
	},
}
</script>
