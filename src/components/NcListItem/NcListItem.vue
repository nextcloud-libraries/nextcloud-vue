<!--
  - @copyright Copyright (c) 2021 Marco Ambrosini <marcoambrosini@icloud.com>
  -
  - @author Marco Ambrosini <marcoambrosini@icloud.com>
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

### Default Usage

```vue
<template>
	<ul>
		<NcListItem
			:title="'Title of the element'"
			:bold="false"
			:details="'1h'"
			:counter-number="44"
			counterType="highlighted">
			<template #icon>
				<NcAvatar :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subtitle>
				In this slot you can put both text and other components such as icons
			</template>
			<template #indicator>
				<!-- Color dot -->
				<CheckboxBlankCircle :size="16" fill-color="#0082c9" />
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
				<NcActionButton>
					Button three
				</NcActionButton>
			</template>
		</NcListItem>
		<NcListItem
			:title="'Title of the element'"
			:bold="false"
			:force-display-actions="true"
			:details="'1h'"
			:counter-number="44"
			counterType="highlighted">
			<template #icon>
				<NcAvatar :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subtitle>
				In this slot you can put both text and other components such as icons
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
				<NcActionButton>
					Button three
				</NcActionButton>
			</template>
		</NcListItem>
		<NcListItem
			:title="'Title of the element'"
			:bold="false">
			<template #icon>
				<NcAvatar :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subtitle>
				In this slot you can put both text and other components such as icons
			</template>
			<template #indicator>
				<!-- Color dot -->
				<CheckboxBlankCircle :size="16" fill-color="#0082c9"/>
			</template>
			<template #actions>
				<NcActionButton>
					Button one
				</NcActionButton>
				<NcActionButton>
					Button two
				</NcActionButton>
				<NcActionButton>
					Button three
				</NcActionButton>
			</template>
		</NcListItem>
		<NcListItem
			:title="'Title of the element'"
			:bold="false"
			:details="'1h'">
			<template #icon>
				<NcAvatar :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subtitle>
				In this slot you can put both text and other components such as icons
			</template>
			<template #indicator>
				<!-- Color dot -->
				<CheckboxBlankCircle :size="16" fill-color="#0082c9"/>
			</template>
		</NcListItem>
	</ul>
</template>

<script>
	import CheckboxBlankCircle from 'vue-material-design-icons/CheckboxBlankCircle'

	export default {
		components: {
			CheckboxBlankCircle,
		}
	}
</script>

```

### NcListItem compact mode
```
<ul style="width: 350px;">
	<NcListItem
		:title="'Title of the element'"
		:counter-number="1"
		:compact="true" >
		<template #icon>
			<div class="icon-edit" />
		</template>
		<template #subtitle>
			This one is with subtitle
		</template>
		<template #actions>
			<NcActionButton>
				Button one
			</NcActionButton>
			<NcActionButton>
				Button two
			</NcActionButton>
		</template>
	</NcListItem>
	<NcListItem
		:title="'Title of the element'"
		:compact="true" >
		<template #icon>
			<div class="icon-edit" />
		</template>
	</NcListItem>
	<NcListItem
		:title="'Title of the element'"
		:counter-number="3"
		:compact="true" >
		<template #icon>
			<div class="icon-edit" />
		</template>
		<template #subtitle>
			This one is with subtitle
		</template>
		<template #actions>
			<NcActionButton>
				Button one
			</NcActionButton>
			<NcActionButton>
				Button two
			</NcActionButton>
		</template>
	</NcListItem>
	<NcListItem
		:title="'Title of the element'"
		:compact="true"
		:counter-number="4"
		href="https://nextcloud.com">
		<template #icon>
			<div class="icon-edit" />
		</template>
		<template #subtitle>
			This one is with an external link
		</template>
	</NcListItem>
</ul>
```
</docs>

<template>
	<!-- This wrapper can be either a router link or a `<li>` -->
	<nav-element class="list-item__wrapper"
		:class="{ 'list-item__wrapper--active' : active }"
		v-bind="navElement">
		<a :id="anchorId"
			ref="list-item"
			:href="href"
			:target="href === '#' ? undefined : '_blank'"
			:rel="href === '#' ? undefined : 'noopener noreferrer'"
			class="list-item"
			:aria-label="linkAriaLabel"
			@mouseover="handleMouseover"
			@mouseleave="handleMouseleave"
			@focus="handleFocus"
			@blur="handleBlur"
			@keydown.tab.exact="handleTab"
			@click="onClick"
			@keydown.esc="hideActions">

			<div class="list-item-content__wrapper"
				:class="{ 'list-item-content__wrapper--compact': compact }">
				<!-- @slot This slot is used for the NcAvatar or icon -->
				<slot name="icon" />

				<!-- Main content -->
				<div class="list-item-content">
					<div class="list-item-content__main"
						:class="{ 'list-item-content__main--oneline': oneLine }">

						<!-- First line, title and details -->
						<div class="line-one">
							<span class="line-one__title">
								{{ title }}
							</span>
							<span v-if="showDetails"
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

							<!-- Counter and indicator -->
							<span v-if="showAdditionalElements" class="line-two__additional_elements">
								<NcCounterBubble v-if="counterNumber != 0"
									class="line-two__counter"
									:type="counterType">
									{{ counterNumber }}
								</NcCounterBubble>

								<span v-if="hasIndicator" class="line-two__indicator">
									<!-- @slot This slot is used for some indicator in form of icon -->
									<slot name="indicator" />
								</span>
							</span>
						</div>
					</div>

					<!-- Actions -->
					<div v-show="displayActionsOnHoverFocus && !forceDisplayActions"
						class="list-item-content__actions"
						@click.prevent.stop="">
						<NcActions ref="actions"
							:aria-label="computedActionsAriaLabel"
							@update:open="handleActionsUpdateOpen">
							<!-- @slot Provide the actions for the right side quick menu -->
							<slot name="actions" />
						</NcActions>
					</div>
				</div>
				<!-- Actions -->
				<div v-show="forceDisplayActions"
					class="list-item-content__actions"
					@click.prevent.stop="">
					<NcActions ref="actions"
						:aria-label="computedActionsAriaLabel"
						@update:open="handleActionsUpdateOpen">
						<!-- @slot Provide the actions for the right side quick menu -->
						<slot name="actions" />
					</NcActions>
				</div>
			</div>

			<!-- @slot Extra elements below the item -->
			<div v-if="$slots.extra" class="list-item__extra">
				<slot name="extra" />
			</div>
		</a>
	</nav-element>
</template>

<script>
import NcActions from '../NcActions/index.js'
import NcCounterBubble from '../NcCounterBubble/index.js'
import { t } from '../../l10n.js'

export default {
	name: 'NcListItem',

	components: {
		NcActions,
		NcCounterBubble,
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
		 * The value for the external link
		 */
		href: {
			type: String,
			default: '#',
		},

		/**
		 * Id for the `<a>` element
		 */
		anchorId: {
			type: String,
			default: '',
		},

		/**
		 * Make subtitle bold
		 */
		bold: {
			type: Boolean,
			default: false,
		},

		/**
		 * Show the NcListItem in compact design
		 */
		compact: {
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
		 * NcCounterBubble component
		 */
		 counterNumber: {
			 type: [Number, String],
			 default: 0,
		 },

		/**
		 * Outlined or highlighted state of the counter
		 */
		counterType: {
			type: String,
			default: '',
			validator(value) {
				return ['highlighted', 'outlined', ''].indexOf(value) !== -1
			},
		},

		/**
		 * To be used only when the elements in the actions menu are very important
		 */
		forceDisplayActions: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'click',
		'update:menuOpen',
	],

	data() {
		return {
			hovered: false,
			focused: false,
			hasActions: false,
			hasSubtitle: false,
			displayActionsOnHoverFocus: false,
			menuOpen: false,
			hasIndicator: false,
		}
	},

	computed: {

		hasDetails() {
			return this.details !== ''
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

		oneLine() {
			return !this.hasSubtitle && !this.showDetails
		},

		showAdditionalElements() {
			return !this.displayActionsOnHoverFocus || this.forceDisplayActions
		},

		showDetails() {
			return this.hasDetails && (!this.displayActionsOnHoverFocus || this.forceDisplayActions)
		},

		computedActionsAriaLabel() {
			return this.actionsAriaLabel || t('Actions for item with title "{title}"', { title: this.title })
		},

	},

	watch: {

		menuOpen(newValue) {
			// A click outside both the menu and the root element hides the actions again
			if (!newValue && !this.hovered) {
				this.displayActionsOnHoverFocus = false
			}
		},
	},

	mounted() {
		this.checkSlots()
	},

	updated() {
		this.checkSlots()
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
				this.displayActionsOnHoverFocus = true
			}
			this.hovered = false
		},

		hideActions() {
			this.displayActionsOnHoverFocus = false
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
				this.displayActionsOnHoverFocus = false
			}
			this.hovered = false
		},

		/**
		 * This method checks if the root element of the component is focused and
		 * if that's the case it focuses the actions button if available
		 *
		 * @param {Event} e the keydown event
		 */
		handleTab(e) {
			if (this.focused && this.hasActions) {
				e.preventDefault()
				this.$refs.actions.$refs.menuButton.$el.focus()
				this.focused = false
			} else {
				this.displayActionsOnHoverFocus = false
				this.$refs.actions.$refs.menuButton.$el.blur()
			}
		},

		handleActionsUpdateOpen(e) {
			this.menuOpen = e
			this.$emit('update:menuOpen', e)
		},

		// Check if subtitle and actions slots are populated
		checkSlots() {
			if (this.hasActions !== !!this.$slots.actions) {
				this.hasActions = !!this.$slots.actions
			}
			if (this.hasSubtitle !== !!this.$slots.subtitle) {
				this.hasSubtitle = !!this.$slots.subtitle
			}
			if (this.hasIndicator !== !!this.$slots.indicator) {
				this.hasIndicator = !!this.$slots.indicator
			}
		},
	},
}
</script>

<style lang="scss" scoped>

.list-item__wrapper {
	position: relative;
	width: 100%;

	&--active,
	&:active,
	&.active {
		.list-item {
			background-color: var(--color-primary-light);
		}
	}
}

// NcListItem
.list-item {
	display: block;
	position: relative;
	flex: 0 0 auto;
	justify-content: flex-start;
	padding: 8px;
	// Fix for border-radius being too large for 3-line entries like in Mail
	// 44px avatar size / 2 + 8px padding, and 2px for better visual quality
	border-radius: 32px;
	margin: 2px 0;
	width: 100%;
	cursor: pointer;
	transition: background-color var(--animation-quick) ease-in-out;
	list-style: none;
	&:hover,
	&:focus {
		background-color: var(--color-background-hover);
	}

	&-content__wrapper {
		display: flex;
		align-items: center;
		height: 48px;

		&--compact {
			height: 36px;

			.line-one, .line-two {
				margin-top: -4px;
				margin-bottom: -4px;
			}
		}
	}

	&-content {
		display: flex;
		flex: 1 1 auto;
		justify-content: space-between;
		padding-left: 8px;

		&__main {
			flex: 1 1 auto;
			width: 0;
			margin: auto 0;

			&--oneline {
				display: flex;
			}
		}

		&__actions {
			flex: 0 0 auto;
			align-self: center;
			justify-content: center;
			margin-left: 4px;
		}
	}

	&__extra {
		margin-top: 4px;
	}
}

// Add more contrast for active entry
[data-themes*="highcontrast"] {
	.list-item__wrapper {
		&--active,
		&:active,
		&.active {
			.list-item {
				background-color: var(--color-primary-light-hover);
			}
		}
	}
}

.line-one {
	display: flex;
	align-items: center;
	justify-content: space-between;
	white-space: nowrap;
	margin: 0 auto 0 0;
	overflow: hidden;

	&__title {
		overflow: hidden;
		flex-grow: 1;
		cursor: pointer;
		text-overflow: ellipsis;
		color: var(--color-main-text);
		font-weight: bold;
	}

	&__details {
		color: var(--color-text-maxcontrast);
		margin: 0 8px;
		font-weight: normal;
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
		cursor: pointer;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--color-text-maxcontrast);
	}

	&__additional_elements {
		margin: 2px 4px 0 4px;
		display: flex;
		align-items: center;
	}

	&__indicator {
		margin: 0 5px;
	}
}

</style>
