<!--
  - @copyright Copyright (c) 2019 Julius Härtl <jus@bitgrid.net>
  -
  - @author Julius Härtl <jus@bitgrid.net>
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
### Single tag selector

```vue
<template>
	<div class="wrapper">
		<MultiselectTags v-model="value" :multiple="false" />
		{{ value }}
	</div>
</template>

<script>
export default {
	data() {
		return {
			value: 1
		}
	}
}
</script>
```

### Multiple tag selector
```vue
<template>
	<div class="wrapper">
		<MultiselectTags v-model="value" :multiple="true" />
		{{ value }}
	</div>
</template>

<script>
export default {
	data() {
		return {
			value: [1, 2]
		}
	}
}
</script>
```

### Custom filter
Because of compatibility reasons only 5 tag entries are shown by default. If you want to show all available tags set the `filter` function-prop to `null`:
```vue
<template>
	<div class="wrapper">
		<MultiselectTags v-model="value" :filter="null" />
		{{ value }}
	</div>
</template>

<script>
export default {
	data() {
		return {
			value: [1, 2]
		}
	}
}
</script>
```

It's also possible to apply any custom filter logic by setting the `filter` function-prop to any custom function receiving the tag element and the index:
```vue
<template>
	<div class="wrapper">
		<MultiselectTags v-model="value" :filter="customFilter" />
		{{ value }}
	</div>
</template>

<script>
export default {
	data() {
		return {
			value: [1, 2]
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
	<Multiselect :value="inputValue"
		:options="availableOptions"
		:placeholder="label"
		track-by="id"
		:custom-label="tagLabel"
		:multiple="multiple"
		:close-on-select="!multiple"
		:tag-width="60"
		:disabled="disabled"
		@input="update">
		<template #noResult>
			<span>{{ t('No results') }}</span>
		</template>
		<template #option="scope">
			{{ tagLabel(scope.option) }}
		</template>
	</multiselect>
</template>

<script>
import { searchTags } from './api.js'
import Multiselect from '../Multiselect/index.js'
import l10n from '../../mixins/l10n.js'
import { t } from '../../l10n.js'

export default {
	name: 'MultiselectTags',
	components: {
		Multiselect,
	},
	mixins: [l10n],
	props: {
		label: {
			type: String,
			default: t('Select a tag'),
		},
		value: {
			type: [Number, Array],
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		multiple: {
			type: Boolean,
			default: true,
		},
		filter: {
			type: Function,
			default: (_element, index) => index < 5,
		},
	},
	data() {
		return {
			tags: [],
		}
	},
	computed: {
		inputValue() {
			return this.getValueObject()
		},
		availableOptions() {
			if (this.filter) {
				return this.tags.filter(this.filter)
			}
			return this.tags
		},
	},
	async beforeCreate() {
		try {
			const result = await searchTags()
			this.tags = result
		} catch (error) {
			console.error('Loading systemtags failed', error)
		}
	},
	methods: {
		getValueObject() {
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
		update(value) {
			if (this.multiple) {
				/**
				 * Emitted on input events of the multiselect field
				 *
				 * @type {number|number[]}
				 */
				this.$emit('input', value.map((element) => element.id))
			} else {
				if (value === null) {
					this.$emit('input', null)
				} else {
					this.$emit('input', value.id)
				}
			}
		},
		/**
		 * @param {object} tag destructuring object
		 * @param {string} tag.displayName the tag display name
		 * @param {boolean} tag.userVisible is the tag visible
		 * @param {boolean} tag.userAssignable is the tag restricted
		 * @return {string}
		 */
		tagLabel({ displayName, userVisible, userAssignable }) {
			if (userVisible === false) {
				return t('{tag} (invisible)', { tag: displayName })
			}
			if (userAssignable === false) {
				return t('{tag} (restricted)', { tag: displayName })
			}
			return displayName
		},
	},
}
</script>
