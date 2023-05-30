<!--
  - @copyright Copyright (c) 2023 Ferdinand Thiessen <opensource@fthiessen.de>
  -
  - @author Ferdinand Thiessen <opensource@fthiessen.de>
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
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<docs>
This component is made to be used inside of the [NcActions](#NcActions) component slots.
It allows to show a collapsible list of buttons as an accordion button.

```vue
	<template>
		<div style="display: flex; align-items: center;">
			<NcActions>
				<NcActionAccordion text="Favorites">
					<NcActionCheckbox>First choice</NcActionCheckbox>
					<NcActionCheckbox>Second choice</NcActionCheckbox>
					<NcActionCheckbox :checked="true">Third choice (checked)
				</NcActionAccordion>
				<NcActionAccordion name="Books" text="My favorite books">
					<template #default>
					<NcActionButton>
						Lorem ipsum
						<template #icon>
							<Book :size="20" />
						</template>
					</NcActionButton>
					<NcActionButton>
						Dolor sit amet
						<template #icon>
							<Book :size="20" />
						</template>
					</NcActionButton>
					</template>
				</NcActionAccordion>
			</NcActions>
		</div>
	</template>
	<script>
	import Book from 'vue-material-design-icons/Book.vue'

	export default {
		components: {
			Book,
		},
	}
	</script>
```
</docs>

<template>
	<NcActionButton ref="listToggle"
		v-bind="filteredAttributes"
		:aria-hidden="true"
		@click="toggleList">
		{{ text }}
		<template #content>
			<ul v-show="contentVisible" :id="contentId">
				<slot />
			</ul>
		</template>
		<template #icon>
			<component :is="currentIcon" :size="20" />
		</template>
	</NcActionButton>
</template>

<script>
import NcActionButton from '../NcActionButton/index.js'
import IconUp from 'vue-material-design-icons/ChevronUp.vue'
import IconDown from 'vue-material-design-icons/ChevronDown.vue'
import GenRandomId from '../../utils/GenRandomId.js'

/**
 * Button component to be used in Actions
 */
export default {
	name: 'NcActionAccordion',

	components: { NcActionButton },

	props: {
		/**
		 * The main text content of the entry.
		 */
		name: {
			type: String,
			default: '',
		},
		/**
		 * The title attribute of the element.
		 */
		title: {
			type: String,
			default: '',
		},
		/**
		 * disabled state of the action button
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
		/**
		 * Aria label for the button. Not needed if the button has text.
		 */
		ariaLabel: {
			type: String,
			default: '',
		},
		/**
		 * The subtitle of the entry or if `name` property unset the main text
		 */
		text: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			contentVisible: false,
			contentId: GenRandomId(8),
		}
	},

	computed: {
		currentIcon() {
			return this.contentVisible ? IconUp : IconDown
		},
		filteredAttributes() {
			return { ...this.$props, text: undefined, icon: undefined, closeAfterClick: false }
		},
	},

	mounted() {
		this.injectAriaAttributes()
	},

	updated() {
		this.injectAriaAttributes()
	},

	methods: {
		/**
		 * Inject aria attributes into list toggle button
		 */
		injectAriaAttributes() {
			const button = this.$refs.listToggle.$el.querySelector('button')
			button.setAttribute('aria-controls', this.contentId)
			button.setAttribute('aria-expanded', this.contentVisible ? 'true' : 'false')
		},
		/**
		 * Toggle content visible state and update aria-expanded property
		 */
		toggleList() {
			this.contentVisible = !this.contentVisible
			this.$refs.listToggle.$el.querySelector('button').setAttribute('aria-expanded', this.contentVisible ? 'true' : 'false')
		},
	},
}
</script>
