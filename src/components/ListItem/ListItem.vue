<!--
  - @copyright Copyright (c) 2021 Marco Ambrosini <marcoambrosini@pm.me>
  -
  - @author Marco Ambrosini <marcoambrosini@pm.me>
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
-->
<docs>

# Usage
```
<ul>
	<listItem
		:title="'Title of the element'"
		:bold="false"
		:details="'One hour ago'"
		:counter-number="44"
		:counter-highlighted="true">
		<template #icon>
			<avatar size="44" user="janedoe" display-name="Jane Doe" />
		</template>
		<template #subtitle>
			In this slot you can put both text and other components such as icons
		</template>
		<AppNavigationCounter #counter>
			7
		</AppNavigationCounter>
		<template #actions>
			<ActionButton>
				Button one
			</ActionButton>
			<ActionButton>
				Button two
			</ActionButton>
			<ActionButton>
				Button three
			</ActionButton>
		</template>
	</listItem>
	<listItem
		:title="'Title of the element'"
		:bold="false">
		<template #icon>
			<avatar size="44" user="janedoe" display-name="Jane Doe" />
		</template>
		<template #subtitle>
			In this slot you can put both text and other components such as icons
		</template>
		<AppNavigationCounter #counter>
			7
		</AppNavigationCounter>
		<template #actions>
			<ActionButton>
				Button one
			</ActionButton>
			<ActionButton>
				Button two
			</ActionButton>
			<ActionButton>
				Button three
			</ActionButton>
		</template>
	</listItem>
	<listItem
		:title="'Title of the element'"
		:bold="false"
		:details="'One hour ago'">
		<template #icon>
			<avatar size="44" user="janedoe" display-name="Jane Doe" />
		</template>
		<template #subtitle>
			In this slot you can put both text and other components such as icons
		</template>
		<AppNavigationCounter #counter>
			7
		</AppNavigationCounter>
	</listItem>
</ul>

```
</docs>

<template>
	<!-- This wrapper can be either a router link or a `<li>` -->
	<nav-element
		class="list-item__wrapper"
		v-bind="navElement">
		<a
			:id="anchorId"
			ref="list-item"
			:class="{ 'list-item--active' : active }"
			href="#"
			class="list-item"
			:aria-label="linkAriaLabel"
			@mouseover="handleMouseover"
			@mouseleave="handleMouseleave"
			@focus="handleFocus"
			@blur="handleBlur"
			@keydown.tab="handleTab"
			@click="onClick"
			@keydown.esc="hideActions">

			<!-- @slot This slot is used for the avatar or icon -->
			<slot name="icon" />

			<!-- Main content -->
			<div class="list-item-content">
				<div class="list-item-content__main">

					<!-- First line, title and details -->
					<div class="line-one"
						:class="{'line-one--bold': bold}">
						<span
							class="line-one__title">
							{{ title }}
						</span>
						<span
							v-if="hasDetails && !displayActions"
							class="line-one__details">
							{{ details }}
						</span>
					</div>

					<!-- Second line, subtitle and counter -->
					<div class="line-two"
						:class="{'line-one--bold': bold}">
						<span v-if="hasSubtitle" class="line-two__subtitle">
							<!-- @slot Slot for the second line of the component -->
							<slot name="subtitle" />
						</span>

						<!-- Counter -->
						<span v-if="!displayActions" class="line-two__counter">
							<AppNavigationCounter
								v-if="counterNumber != 0"
								:highlighted="counterHighlighted">
								{{ counterNumber }}
							</AppNavigationCounter>
						</span>
					</div>
				</div>

				<!-- Actions -->
				<div
					v-show="displayActions"
					class="list-item-content__actions"
					@click.prevent.stop="">
					<Actions
						ref="actions"
						menu-align="right"
						:aria-label="actionsAriaLabel"
						@update:open="handleActionsUpdateOpen">
						<!-- @slot Provide the actions for the right side quick menu -->
						<slot
							name="actions" />
					</Actions>
				</div>
			</div>
		</a>
	</nav-element>
</template>

<script>
import Actions from '../Actions'
import AppNavigationCounter from '../AppNavigationCounter'

export default {
	name: 'ListItem',

	components: {
		Actions,
		AppNavigationCounter,
	},

	props: {
		/**
		 * The details text displayed in the upper right part of the component
		 */
		details: {
			type: String,
			default: '',
		},

		/**
		 * Title (first line of text)
		 */
		title: {
			type: String,
			required: true,
		},

		/**
		* Pass in `true` if you want the matching behavior to
		* be non-inclusive: https://router.vuejs.org/api/#exact
		*/
		exact: {
			type: Boolean,
			default: false,
		},

		/**
		* The route for the router link.
		*/
		to: {
			type: [String, Object],
			default: '',
		},

		/**
		 * Id for the <a> element
		 */
		anchorId: {
			type: String,
			default: '',
		},

		/**
		 * Make title and subtitle bold
		 */
		bold: {
			type: Boolean,
			default: false,
		},

		/**
		 * Toggle the active state of the component
		 */
		active: {
			type: Boolean,
			default: false,
		},

		/**
		 * Aria label for the wrapper element
		 */
		linkAriaLabel: {
			type: String,
			default: '',
		},

		/**
		 * Aria label for the actions toggle
		 */
		actionsAriaLabel: {
			type: String,
			default: '',
		},

		/**
		 * If different from from 0 this component will display the
		 * AppNavigationCounter component
		 */
		 counterNumber: {
			 type: [Number, String],
			 default: 0,
		 },

		/**
		 * Toggles the highlighted state of the counter
		 */
		 counterHighlighted: {
			 type: Boolean,
			 default: false,
		 },

	},

	data() {
		return {
			hovered: false,
			focused: false,
			displayActions: false,
			menuOpen: false,
		}
	},

	computed: {

		hasDetails() {
			return this.details !== ''
		},

		hasActions() {
			return (!!this.$slots.actions)
		},

		// This is used to decide which outer element type to use
		// li or router-link
		navElement() {
			if (this.to !== '') {
				return {
					is: 'router-link',
					tag: 'li',
					to: this.to,
					exact: this.exact,
				}
			}
			return {
				is: 'li',
			}
		},

		// Check if the subtitle slot is populated
		hasSubtitle() {
			return !!this.$slots.subtitle
		},
	},

	watch: {

		menuOpen(newValue) {
			// A click outside both the menu and the root element hides the actions again
			if (!newValue && !this.hovered) {
				this.displayActions = false
			}
		},
	},

	methods: {

		// forward click event
		onClick(event) {
			this.$emit('click', event)
		},

		handleMouseover() {
			this.showActions()
			this.hovered = true
		},

		showActions() {
			if (this.hasActions) {
				this.displayActions = true
			}
			this.hovered = false
		},

		hideActions() {
			this.displayActions = false
		},

		/**
		 * Show actions upon focus
		 */
		handleFocus() {
			this.focused = true
			this.showActions()
		},

		handleBlur() {
			this.focused = false
		},

		/**
		 * Hide the actions on mouseleave unless the menu is open
		 */
		handleMouseleave() {
			if (!this.menuOpen) {
				this.displayActions = false
			}
			this.hovered = false
		},

		/**
		 * This method checks if the root element of the component is focused and
		 * if that's the case it focuses the actions button if available
		 * @param {Event} e the keydown event
		 */
		handleTab(e) {
			if (this.focused && this.hasActions) {
				e.preventDefault()
				this.$refs.actions.$refs.menuButton.focus()
				this.focused = false
			} else {
				this.displayActions = false
				this.$refs.actions.$refs.menuButton.blur()
			}
		},

		handleActionsUpdateOpen(e) {
			this.menuOpen = e
		},
	},
}
</script>

<style lang="scss" scoped>

.list-item__wrapper{
	position: relative;
	width: 100%;
}

// listItem
.list-item {
	position: relative;
	display: flex;
	align-items: center;
	flex: 0 0 auto;
	justify-content: flex-start;
	padding: 2px 2px 2px 8px;
	height: 64px;
	border-radius: 16px;
	margin: 2px 0;
	width: 100%;
	cursor: pointer;
	transition: background-color 200ms ease-in-out;
	list-style: none;
	&:hover,
	&:focus  {
		background-color: var(--color-background-hover);
	}
	&--active,
	&:active,
	&:active ~ .app-navigation-entry__utils {
		background-color: var(--color-primary-light);
	}

	&-content {
		display: flex;
		flex: 1 1 auto;
		justify-content: space-between;
		padding: 0 8px;

		&__main {
			flex: 1 1 auto;
			flex-direction: column;
			width: 0;
			margin: auto 0;
		}

		&__actions {
			flex: 0 0 auto;
			align-self: center;
			justify-content: center;

		}
	}
}

.line-one {
	display: flex;
	align-items: center;
	justify-content: space-between;
	white-space: nowrap;
	margin: 0 auto;
	&--bold {
		font-weight: bold;
	}

	&__title {
		overflow: hidden;
		flex-grow: 1;
		cursor: pointer;
		text-overflow: ellipsis;
		color: var(--color-main-text);
	}

	&__details {
		color: var(--color-text-lighter);
		margin: 0 8px;
	}
}

.line-two {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	white-space: nowrap;
	&--bold {
		font-weight: bold;
	}

	&__subtitle {
		overflow: hidden;
		flex-grow: 1;
		padding-right: 4px;
		cursor: pointer;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--color-text-lighter);
	}

	&__counter {
		margin: 2px 4px 0 0;
	}
}

</style>
