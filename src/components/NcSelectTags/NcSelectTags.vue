<!--
  - @copyright 2022 Christopher Ng <chrng8@gmail.com>
  -
  - @author Christopher Ng <chrng8@gmail.com>
  - @author Julius Härtl <jus@bitgrid.net>
  -
  - @license AGPL-3.0-or-later
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
### Editable
```vue
<template>
	<div class="wrapper">
		<NcSelectTags :editable="true"
			:file-id="1" />
	</div>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	methods: {

	},
}
</script>
```

### Single tag selector

```vue
<template>
	<div class="wrapper">
		<NcSelectTags v-model="value" :multiple="false" />
		{{ value }}
	</div>
</template>

<script>
export default {
	data() {
		return {
			value: 1,
		}
	}
}
</script>
```

### Multiple tag selector
```vue
<template>
	<div class="wrapper">
		<NcSelectTags v-model="value" :multiple="true" />
		{{ value }}
	</div>
</template>

<script>
export default {
	data() {
		return {
			value: [
				1,
				2,
			],
		}
	}
}
</script>
```

### Custom filter
Because of compatibility reasons only 5 tag entries are shown by default. If you want to show all available tags set the `limit` prop to `null`:
```vue
<template>
	<div class="wrapper">
		<NcSelectTags v-model="value" :limit="null" />
		{{ value }}
	</div>
</template>

<script>
export default {
	data() {
		return {
			value: [
				1,
				2,
			],
		}
	}
}
</script>
```

It's also possible to apply any custom filter logic by setting the `optionsFilter` function-prop to any custom function receiving the tag element and the index:
```vue
<template>
	<div class="wrapper">
		<NcSelectTags v-model="value" :options-filter="customFilter" />
		{{ value }}
	</div>
</template>

<script>
export default {
	data() {
		return {
			value: [
				3,
			],
		}
	},
	methods: {
		/**
		* Implement your custom filter logic to filter tags delivered
		* by the server
		*
		* @param {object} the tag object
		* @param {int} the index of the object inside the collection
		*/
		customFilter(element, index) {
			/*
			* Tag objects returned by the server will have the
			* following properties (see also api.js):
			* id, displayName, canAssign, userAssignable, userVisible
			*/
			return element.id >= 2 && element.displayName !== '' && element.canAssign && element.userAssignable && element.userVisible
		}
	}
}
</script>
```
</docs>

<template>
	<NcSelect v-bind="propsToForward"
		:options="availableOptions"
		:close-on-select="!multiple"
		:value="localValue"
		@search="searchString => search = searchString"
		@option:selected="handleSelect"
		@option:created="handleCreate"
		@option:deselected="handleDeselect"
		@input="handleInput"
		v-on="{ ...$listeners, input: () => {} }">
		<!-- Do not forward input event listener to NcSelect as we emit custom input events programmatically -->
		<template #option="option">
			<NcEllipsisedOption :name="getOptionLabel(option)"
				:search="search" />
		</template>
		<template #selected-option="selectedOption">
			<NcEllipsisedOption :name="getOptionLabel(selectedOption)"
				:search="search" />
		</template>
		<template v-for="(_, name) in $scopedSlots" #[name]="data">
			<!-- @slot Any combination of slots from https://vue-select.org/api/slots.html -->
			<slot :name="name" v-bind="data" />
		</template>
	</NcSelect>
</template>

<script>
/* eslint-disable */
import VueSelect from '@nextcloud/vue-select'

import NcEllipsisedOption from '../NcEllipsisedOption/index.js'
import NcSelect from '../NcSelect/index.js'

import api from './mixins/api.js'
import { t } from '../../l10n.js'

export default {
	name: 'NcSelectTags',

	components: {
		NcEllipsisedOption,
		NcSelect,
	},

	mixins: [
		api,
	],

	props: {
		// Add NcSelect prop defaults and populate $props
		...NcSelect.props,

		/**
		 * User defined function for adding Options
		 *
		 * Defaults to the internal vue-select function documented at the link
		 * below
		 *
		 * Enabling `editable` will automatically set this to create a tag
		 * object unless this prop is set explicitly
		 *
		 * @see https://vue-select.org/api/props.html#createoption
		 */
		createOption: {
			type: Function,
			default: null,
		},

		// TODO Handle systemtags here or create a separate component with duplicated code?
		// TODO Add prop to passthrough `value` directly as alternative?
		/**
		 * NOTE Cannot use NcSelectTags with custom props for editable
		 *      systemtags due to conflicting handling of internal and external
		 *      state
		 */

		/**
		 * Enable selection, creation, and deletion of tags for the file with
		 * id `fileId`
		 *
		 * Requires the `fileId` prop to be set if `true`
		 */
		editable: {
			type: Boolean,
			default: false,
		},

		/**
		 * Callback to generate the label text
		 *
		 * @see https://vue-select.org/api/props.html#getoptionlabel
		 */
		getOptionLabel: {
			type: Function,
			default: (option) => {
				const { displayName, userVisible, userAssignable } = option
				if (userVisible === false) {
					return t('{tag} (invisible)', { tag: displayName })
				}
				if (userAssignable === false) {
					return t('{tag} (restricted)', { tag: displayName })
				}
				return displayName
			},
		},

		/**
		 * The id of the file
		 *
		 * Required if `editable` is `true`
		 */
		fileId: {
			type: [String, Number],
			default: null,
		},

		/**
		 * Sets the maximum number of tags to display in the dropdown list
		 *
		 * Because of compatibility reasons only 5 tag entries are shown by
		 * default
		 */
		limit: {
			type: Number,
			default: 5,
		},

		/**
		 * Allow selection of multiple options
		 *
		 * This prop automatically sets the internal `closeOnSelect` prop to
		 * its boolean opposite
		 *
		 * @see https://vue-select.org/api/props.html#multiple
		 */
		multiple: {
			type: Boolean,
			default: true,
		},

		/**
		 * Callback to filter available options
		 */
		optionsFilter: {
			type: Function,
			default: null,
		},

		/**
		 * Placeholder text
		 *
		 * @see https://vue-select.org/api/props.html#placeholder
		 */
		placeholder: {
			type: String,
			default: t('Select a tag'),
		},

		/**
		 * Enable/disable creating options from searchEl.
		 *
		 * Defaults to the internal vue-select boolean documented at the link
		 * below
		 *
		 * Enabling `editable` will automatically set this to `true`
		 * unless this prop is set explicitly
		 *
		 * @see https://vue-select.org/api/props.html#taggable
		 */
		taggable: {
			type: Boolean,
			default: null,
		},

		/**
		 * Currently selected value
		 */
		value: {
			type: [Number, Array],
			default: null,
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
		'input',
		/**
		 * All events from https://vue-select.org/api/events.html
		 */
		// Not an actual event but needed to show in vue-styleguidist docs
		' ',
	],

	data() {
		return {
			search: '',
			tags: [],
			selectedTags: [],
		}
	},

	computed: {
		availableOptions() {
			if (this.optionsFilter) {
				return this.tags.filter(this.optionsFilter)
			}
			return this.tags
		},

		localCreateOption() {
			if (this.createOption !== null) {
				return this.createOption
			}
			if (this.editable) {
				return (displayName) => {
					return {
						displayName,
						userVisible: true,
						userAssignable: true,
						canAssign: true,
					}
				}
			}
			return VueSelect.props.createOption.default
		},

		localTaggable() {
			if (this.taggable !== null) {
				return this.taggable
			}
			if (this.editable) {
				return true
			}
			return VueSelect.props.taggable.default
		},

		localValue() {
			if (this.fileId) {
				return this.selectedTags
			}
			if (this.tags.length === 0) {
				return []
			}
			if (this.multiple) {
				return this.value
					.filter(tag => tag !== '')
					.map(id => this.tags.find(tag2 => tag2.id === id))
			} else {
				return this.tags.find(tag => tag.id === this.value)
			}
		},

		propsToForward() {
			const {
				// Props handled by this component
				editable,
				fileId,
				optionsFilter,
				// Props to forward
				...initialPropsToForward
			} = this.$props

			const propsToForward = {
				...initialPropsToForward,
				// Custom overrides of vue-select props
				createOption: this.localCreateOption,
				taggable: this.localTaggable,
			}

			return propsToForward
		},
	},

	async created() {
		try {
			const tags = await this.searchTags()
			this.tags = tags
			if (this.fileId) {
				const selectedTags = await this.searchSelectedTags()
				this.selectedTags = selectedTags
			}
		} catch (error) {
			console.error('Loading tags failed', error)
		}
	},

	methods: {
		async handleSelect(tags) {
			if (!this.editable || !this.fileId) {
				return
			}
			const selectedTag = tags[tags.length - 1]
			try {
				await this.selectTag(selectedTag)
				this.selectedTags.push(selectedTag)
			} catch (error) {
				console.error('Selecting tag failed', error)
			}
		},

		async handleCreate(tag) {
			if (!this.editable || !this.fileId) {
				return
			}
			console.log(tag)

			try {
				const id = await this.createTag(tag)
				// Add id in available tags
				this.tags.push({ ...tag, id })
				// Add to selected tags
				this.value.push(this.tags[this.tags.length - 1])
				// Emit input event with selected ids
				this.$emit('input', this.localValue.map(({ id }) => id))
			} catch (error) {
				this.tags.pop()
				console.error('Creating tag failed', error)
			}
		},

		async handleDeselect(tag) {
			if (!this.editable || !this.fileId) {
				return
			}
			console.log(tag)
			this.$emit('input', this.localValue
				.flter(selectedTag => selectedTag.id !== tag.id)
				.map(({ id }) => id)
			)
			try {
				await this.deleteTag(tag)
			} catch (error) {
				console.error('Deleting tag failed', error)
			}
		},

		handleInput(value) {
			// TODO Handle editable input?
			console.log('NcSelect @input', value)

			if (this.multiple) {
				/**
				 * Emitted on input events of the multiselect field
				 *
				 * @type {number|number[]}
				 */
				this.$emit('input', value.map(({ id }) => id))
			} else {
				if (value === null) {
					this.$emit('input', null)
				} else {
					this.$emit('input', value.id)
				}
			}
		},
	},
}
</script>
