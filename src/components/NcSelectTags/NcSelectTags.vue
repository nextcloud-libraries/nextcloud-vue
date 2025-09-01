<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Single tag selector

```vue
<template>
	<div class="wrapper">
		<NcSelectTags v-model="value" input-label="Tag" :multiple="false" />
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
		<NcSelectTags v-model="value" input-label="Tags" :multiple="true" />
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
		<NcSelectTags v-model="value" input-label="Tags" :limit="null" />
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
		<NcSelectTags v-model="value" input-label="Tags" :options-filter="customFilter" />
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
	<NcSelect
		v-bind="propsToForward"
		:options="availableOptions"
		:close-on-select="!multiple"
		:value="passthru ? model : localValue"
		@search="searchString => search = searchString"
		v-on="{
			...$listeners,
			input: passthru ? $listeners.input : noop,
			'update:modelValue': passthru ? $listeners['update:modelValue'] : handleInput,
			'update:model-value': passthru ? $listeners['update:model-value'] : noop,
		}">
		<template #option="option">
			<NcEllipsisedOption
				:name="getOptionLabel(option)"
				:search="search" />
		</template>
		<template #selected-option="selectedOption">
			<NcEllipsisedOption
				:name="getOptionLabel(selectedOption)"
				:search="search" />
		</template>
		<template v-for="(_, name) in $scopedSlots" #[name]="data">
			<!-- @slot Any combination of slots from https://vue-select.org/api/slots.html -->
			<slot :name="name" v-bind="data" />
		</template>
	</NcSelect>
</template>

<script>
import { useModelMigration } from '../../composables/useModelMigration.ts'
import { t } from '../../l10n.js'
import { logger } from '../../utils/logger.ts'
import NcEllipsisedOption from '../NcEllipsisedOption/index.js'
import NcSelect from '../NcSelect/index.js'
import { searchTags } from './api.js'

export default {
	name: 'NcSelectTags',

	components: {
		NcEllipsisedOption,
		NcSelect,
	},

	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
	},

	props: {
		// Add NcSelect prop defaults and populate $props
		...NcSelect.props,

		/**
		 * Enable automatic fetching of tags
		 *
		 * If `false`, available tags must be passed using the `options` prop
		 */
		fetchTags: {
			type: Boolean,
			// eslint-disable-next-line vue/no-boolean-default
			default: true,
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
			// eslint-disable-next-line vue/no-boolean-default
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
		 * Enable passing of `value` prop and emitted `input` events as-is
		 * i.e. for usage with `v-model`
		 *
		 * If `true`, custom internal `value` and `input` handling is disabled
		 */
		passthru: {
			type: Boolean,
			default: false,
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
		 * Removed in v9 - use `modelValue` (`v-model`) instead
		 *
		 * @deprecated
		 */
		value: {
			type: [Number, Array, Object],
			default: undefined,
		},

		/**
		 * Currently selected value
		 */
		modelValue: {
			type: [Number, Array, Object],
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
		/**
		 * Removed in v9 - use `update:modelValue` (`v-model`) instead
		 */
		'input',
		/**
		 * Emitted on input events of the multiselect field
		 *
		 * @type {number|number[]}
		 */
		'update:modelValue',
		/** Same as update:modelValue for Vue 2 compatibility */
		'update:model-value',
		/**
		 * All events from https://vue-select.org/api/events.html
		 */
		// Not an actual event but needed to show in vue-styleguidist docs
		' ',
	],

	setup() {
		const model = useModelMigration('value', 'input')
		const noop = () => {}
		return {
			model,
			noop,
		}
	},

	data() {
		return {
			search: '',
			availableTags: [],
		}
	},

	computed: {
		availableOptions() {
			if (this.optionsFilter) {
				return this.tags.filter(this.optionsFilter)
			}
			return this.tags
		},

		localValue() {
			if (this.tags.length === 0) {
				return []
			}
			if (this.multiple) {
				return this.model
					.filter((tag) => tag !== '')
					.map((id) => this.tags.find((tag2) => tag2.id === id))
			} else {
				return this.tags.find((tag) => tag.id === this.model)
			}
		},

		propsToForward() {
			/* eslint-disable @typescript-eslint/no-unused-vars */
			const {
				// Props handled by this component
				fetchTags,
				optionsFilter,
				passthru,
				// Props to forward
				...propsToForward
			} = this.$props
			/* eslint-enable @typescript-eslint/no-unused-vars */

			return propsToForward
		},

		tags() {
			if (!this.fetchTags) {
				return this.options
			}
			return this.availableTags
		},
	},

	async created() {
		if (!this.fetchTags) {
			return
		}
		try {
			const result = await searchTags()
			this.availableTags = result
		} catch (error) {
			logger.error('Loading systemtags failed', error)
		}
	},

	methods: {
		handleInput(value) {
			if (this.multiple) {
				/**
				 * Emitted on input events of the multiselect field
				 *
				 * @type {number|number[]}
				 */
				this.model = value.map((element) => element.id)
			} else {
				if (value === null) {
					this.model = null
				} else {
					this.model = value.id
				}
			}
		},
	},
}
</script>
