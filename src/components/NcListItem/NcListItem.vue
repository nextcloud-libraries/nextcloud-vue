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
			:name="'This is an active element with highlighted counter'"
			:bold="false"
			:active="true"
			:details="'1h'"
			:counter-number="44"
			counterType="highlighted">
			<template #icon>
				<NcAvatar :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
				In this slot you can put both text and other components such as icons
			</template>
			<template #indicator>
				<!-- Color dot -->
				<CheckboxBlankCircle :size="16" fill-color="#fff" />
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
			:name="'This is an active element with outlined counter'"
			:bold="false"
			:active="true"
			:details="'1h'"
			:counter-number="44"
			counterType="outlined">
			<template #icon>
				<NcAvatar :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
				In this slot you can put both text and other components such as icons
			</template>
			<template #indicator>
				<!-- Color dot -->
				<CheckboxBlankCircle :size="16" fill-color="#fff" />
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
			:name="'This is an active element with normal counter'"
			:bold="false"
			:active="true"
			:counter-number="44">
			<template #icon>
				<NcAvatar :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
				In this slot you can put both text and other components such as icons
			</template>
			<template #details>
				<LinkIcon :size="16"/>
			</template>
			<template #indicator>
				<!-- Color dot -->
				<CheckboxBlankCircle :size="16" fill-color="#fff" />
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
			:name="'Name of the element with highlighted counter'"
			:bold="false"
			:force-display-actions="true"
			:details="'1h'"
			:counter-number="44"
			counterType="highlighted">
			<template #icon>
				<NcAvatar :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
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
			:name="'Name of the element with outlined counter'"
			:bold="false"
			:force-display-actions="true"
			:details="'1h'"
			:counter-number="44"
			counterType="outlined">
			<template #icon>
				<NcAvatar :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
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
			:name="'Name of the element with normal counter'"
			:bold="false"
			:force-display-actions="true"
			:details="'1h'"
			:counter-number="44">
			<template #icon>
				<NcAvatar :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
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
			:name="'Name of the element'"
			:bold="false">
			<template #icon>
				<NcAvatar :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
				In this slot you can put both text and other components such as icons
			</template>
			<template #details>
				<LinkIcon :size="16"/>
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
			:name="'Name of the element'"
			:bold="false"
			:details="'1h'">
			<template #icon>
				<NcAvatar :size="44" user="janedoe" display-name="Jane Doe" />
			</template>
			<template #subname>
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
	import LinkIcon from 'vue-material-design-icons/Link'

	export default {
		components: {
			CheckboxBlankCircle,
			LinkIcon,
		}
	}
</script>

```

### NcListItem compact mode
```
<ul style="width: 350px;">
	<NcListItem
		:name="'Name of the element'"
		:counter-number="1"
		:compact="true" >
		<template #icon>
			<div class="icon-edit" />
		</template>
		<template #subname>
			This one is with subname
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
		:name="'Name of the element'"
		:compact="true" >
		<template #icon>
			<div class="icon-edit" />
		</template>
	</NcListItem>
	<NcListItem
		:name="'Name of the element'"
		:counter-number="3"
		:compact="true" >
		<template #icon>
			<div class="icon-edit" />
		</template>
		<template #subname>
			This one is with subname
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
		:name="'Name of the element'"
		:compact="true"
		:counter-number="4"
		href="https://nextcloud.com">
		<template #icon>
			<div class="icon-edit" />
		</template>
		<template #subname>
			This one is with an external link
		</template>
	</NcListItem>
</ul>
```
</docs>

<template>
	<!-- This wrapper can be either a router link or a `<li>` -->
	<component :is="to ? 'router-link' : 'NcVNodes'"
		v-slot="{ href: routerLinkHref, navigate, isActive }"
		:custom="to ? true : null"
		:to="to"
		:exact="to ? exact : null">
		<li class="list-item__wrapper"
			:class="{ 'list-item__wrapper--active' : isActive || active }">
			<a :id="anchorId"
				ref="list-item"
				:href="routerLinkHref || href"
				:target="target || (href === '#' ? undefined : '_blank')"
				:rel="href === '#' ? undefined : 'noopener noreferrer'"
				class="list-item"
				:aria-label="linkAriaLabel"
				@mouseover="handleMouseover"
				@mouseleave="handleMouseleave"
				@focus="handleFocus"
				@blur="handleBlur"
				@keydown.tab.exact="handleTab"
				@click="onClick($event, navigate, routerLinkHref)"
				@keydown.esc="hideActions">

				<div class="list-item-content__wrapper"
					:class="{ 'list-item-content__wrapper--compact': compact }">
					<!-- @slot This slot is used for the NcAvatar or icon -->
					<slot name="icon" />

					<!-- Main content -->
					<div class="list-item-content">
						<div class="list-item-content__main"
							:class="{ 'list-item-content__main--oneline': oneLine }">

							<!-- First line, name and details -->
							<div class="line-one">
								<span class="line-one__name">
									{{ name }}
								</span>
								<span v-if="showDetails"
									class="line-one__details">
									<!-- @slot This slot is used for some details in form of icon (prop `details` as a fallback) -->
									<slot name="details">{{ details }}</slot>
								</span>
							</div>

							<!-- Second line, subname and counter -->
							<div class="line-two"
								:class="{'line-two--bold': bold}">
								<span v-if="hasSubname" class="line-two__subname">
									<!-- @slot Slot for the second line of the component -->
									<slot name="subname" />
								</span>

								<!-- Counter and indicator -->
								<span v-if="counterNumber != 0 || hasIndicator"
									v-show="showAdditionalElements"
									class="line-two__additional_elements">
									<NcCounterBubble v-if="counterNumber != 0"
										:active="isActive || active"
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
					</div>
					<!-- Actions -->
					<div v-show="forceDisplayActions || displayActionsOnHoverFocus"
						class="list-item-content__actions"
						@click.prevent.stop="">
						<NcActions ref="actions"
							:primary="isActive || active"
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
		</li>
	</component>
</template>

<script>
import NcActions from '../NcActions/index.js'
import NcCounterBubble from '../NcCounterBubble/index.js'
import NcVNodes from '../NcVNodes/index.js'
import { t } from '../../l10n.js'

export default {
	name: 'NcListItem',

	components: {
		NcActions,
		NcCounterBubble,
		NcVNodes,
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
		 * Name (first line of text)
		 */
		name: {
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
			default: null,
		},

		/**
		 * The value for the external link
		 */
		href: {
			type: String,
			default: '#',
		},

		target: {
			type: String,
			default: '',
		},

		/**
		 * Id for the `<a>` element
		 */
		anchorId: {
			type: String,
			default: '',
		},

		/**
		 * Make subname bold
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
		 * If different from 0 this component will display the
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
			hasSubname: false,
			displayActionsOnHoverFocus: false,
			menuOpen: false,
			hasIndicator: false,
			hasDetails: false,
		}
	},

	computed: {
		oneLine() {
			return !this.hasSubname && !this.showDetails
		},

		showAdditionalElements() {
			return !this.displayActionsOnHoverFocus || this.forceDisplayActions
		},

		showDetails() {
			return (this.details !== '' || this.hasDetails)
				&& (!this.displayActionsOnHoverFocus || this.forceDisplayActions)
		},

		computedActionsAriaLabel() {
			return this.actionsAriaLabel || t('Actions for item with name "{name}"', { name: this.name })
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
		/**
		 * Handle link click
		 *
		 * @param {PointerEvent} event - Native click event
		 * @param {Function} [navigate] - VueRouter link's navigate if any
		 * @param {string} [routerLinkHref] - VueRouter link's href
		 */
		onClick(event, navigate, routerLinkHref) {
			// Always forward native event
			this.$emit('click', event)
			// Do not navigate with control keys - it is opening in a new tab
			if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
				return
			}
			// Prevent default link behaviour if it's a router-link and navigate manually
			if (routerLinkHref) {
				navigate?.(event)
				event.preventDefault()
			}
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
			}
		},

		handleActionsUpdateOpen(e) {
			this.menuOpen = e
			this.$emit('update:menuOpen', e)
		},

		// Check if subname and actions slots are populated
		checkSlots() {
			if (this.hasActions !== !!this.$slots.actions) {
				this.hasActions = !!this.$slots.actions
			}
			if (this.hasSubname !== !!this.$slots.subname) {
				this.hasSubname = !!this.$slots.subname
			}
			if (this.hasIndicator !== !!this.$slots.indicator) {
				this.hasIndicator = !!this.$slots.indicator
			}
			if (this.hasDetails !== !!this.$slots.details) {
				this.hasDetails = !!this.$slots.details
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
			background-color: var(--color-primary-element);
			&:active,
			&:hover,
			&:focus,
			&:focus-visible {
				background-color: var(--color-primary-element-hover);
			}
		}

		.line-one__name, .line-one__details {
			color: var(--color-primary-element-text) !important;
		}

		.line-two__subname {
			color: var(--color-primary-element-text) !important;
		}
	}
}

// NcListItem
.list-item {
	box-sizing: border-box;
	display: block;
	position: relative;
	flex: 0 0 auto;
	justify-content: flex-start;
	padding: 8px 10px;
	// Fix for border-radius being too large for 3-line entries like in Mail
	// 44px avatar size / 2 + 8px padding, and 2px for better visual quality
	border-radius: 32px;
	margin: 2px 0;
	width: 100%;
	cursor: pointer;
	transition: background-color var(--animation-quick) ease-in-out;
	list-style: none;
	&:active,
	&:hover,
	&:focus,
	&:focus-visible {
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

.line-one {
	display: flex;
	align-items: center;
	justify-content: space-between;
	white-space: nowrap;
	margin: 0 auto 0 0;
	overflow: hidden;

	&__name {
		overflow: hidden;
		flex-grow: 1;
		cursor: pointer;
		text-overflow: ellipsis;
		color: var(--color-main-text);
		font-weight: bold;
	}

	&__details {
		color: var(--color-text-maxcontrast);
		margin: 0 9px;
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

	&__subname {
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
