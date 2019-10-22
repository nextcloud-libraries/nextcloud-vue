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
## Single tag selector

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

## Multiple tag selector
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
</docs>

<template>
	<Multiselect :value="inputValue"
		:options="tags"
		:options-limit="5"
		:placeholder="label"
		track-by="id"
		:custom-label="tagLabel"
		:multiple="multiple"
		:close-on-select="multiple"
		:tag-width="60"
		:disabled="disabled"
		@input="update">
		<span slot="noResult">{{ t('core', 'No results') }}</span>
		<template #option="scope">
			{{ tagLabel(scope.option) }}
		</template>
	</multiselect>
</template>

<script>
import { Multiselect } from 'Components/Multiselect'
import { searchTags } from './api'

export default {
	name: 'MultiselectTags',
	components: {
		Multiselect
	},
	props: {
		label: {
			type: String,
			default: t('systemtags', 'Select a tag')
		},
		value: {
			type: [Number, Array],
			required: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		multiple: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			tags: []
		}
	},
	computed: {
		inputValue() {
			return this.getValueObject()
		}
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
		 * @param {Object} tag
		 * @param {string} tag.displayName
		 * @param {bool} tag.userVisible
		 * @param {bool} tag.userAssignable
		 */
		tagLabel({ displayName, userVisible, userAssignable }) {
			if (userVisible === false) {
				// TODO Use proper parameters once the translation is updated in the systemtags app
				return t('systemtags', '%s (invisible)').replace('%s', displayName)
			}
			if (userAssignable === false) {
				// TODO Use proper parameters once the translation is updated in the systemtags app
				return t('systemtags', '%s (restricted)').replace('%s', displayName)
			}
			return displayName
		}
	}
}
</script>
