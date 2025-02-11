<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to be used in the Nextcloud top header.

```
<template>
	<div id="nextcloud-header">
		<NcHeaderMenu id="search"
			aria-label="Search">
			<template #trigger>
				<Magnify />
			</template>
			<div>
				<NcTextField label="Search for files, comments, contacts…"
				style="padding-inline: 8px;"
				type="search"
				:value.sync="query" />
				<NcEmptyContent
					name="Search"
					:description="query ? `No results for '${query}'` : 'Start typing to search'">
					<template #icon>
						<Magnify />
					</template>
				</NcEmptyContent>
			</div>
		</NcHeaderMenu>
	</div>
</template>
<script>
import Magnify from 'vue-material-design-icons/Magnify'

export default {
	components: {
		Magnify,
	},
	data() {
		return {
			query: '',
		}
	},
}
</script>
<style>
#nextcloud-header {
	display: flex;
	justify-content: right;
	background-color: var(--color-primary);
	height: var(--header-height, 50px);
	padding-inline-end: 12px;
}
</style>
```
</docs>

<template>
	<component :is="wrapperTag"
		:id="id"
		ref="headerMenu"
		v-click-outside="clickOutsideConfig"
		:aria-labelledby="isNav ? triggerId : null"
		:class="{ 'header-menu--opened': opened }"
		class="header-menu"
		v-on="listeners">
		<!-- Trigger -->
		<NcButton :id="isNav ? triggerId : null"
			ref="trigger"
			type="tertiary-no-background"
			class="header-menu__trigger"
			:aria-label="ariaLabel"
			:aria-describedby="description ? descriptionId : null"
			:aria-controls="`header-menu-${id}`"
			:aria-expanded="opened.toString()"
			size="large"
			@click.prevent="toggleMenu">
			<template #icon>
				<!-- @slot Icon trigger slot. Make sure the svg path
				is at least 16px. Usually mdi icon works at 20px -->
				<slot name="trigger" />
			</template>
		</NcButton>

		<span v-if="description"
			:id="descriptionId"
			class="header-menu__description hidden-visually">
			{{ description }}
		</span>

		<!-- Visual triangle -->
		<div v-show="opened" class="header-menu__carret" />

		<!-- Menu opened content -->
		<div v-show="opened"
			:id="`header-menu-${id}`"
			class="header-menu__wrapper">
			<div ref="content" class="header-menu__content">
				<!-- @slot Main content -->
				<slot />
			</div>
		</div>
	</component>
</template>

<script>
import { vOnClickOutside as ClickOutside } from '@vueuse/components'
import { createFocusTrap } from 'focus-trap'

import GenRandomId from '../../utils/GenRandomId.js'
import { clickOutsideOptions } from '../../mixins/index.js'
import { getTrapStack } from '../../utils/focusTrap.js'

import NcButton from '../NcButton/index.js'

export default {
	name: 'NcHeaderMenu',

	components: {
		NcButton,
	},

	directives: {
		ClickOutside,
	},

	mixins: [
		clickOutsideOptions,
	],

	props: {
		/**
		 * Unique id for this menu
		 */
		id: {
			type: String,
			required: true,
		},

		/**
		 * aria-label attribute of the menu open button
		 */
		ariaLabel: {
			type: String,
			default: '',
		},

		/**
		 * Current menu open state
		 */
		open: {
			type: Boolean,
			default: false,
		},

		/**
		 * Pass `true` if the header menu is used for website navigation
		 *
		 * The wrapper tag will be set to `nav` and its `aria-labelledby`
		 * will be associated with the menu open button
		 */
		isNav: {
			type: Boolean,
			default: false,
		},

		/**
		 * Additional visually hidden description text for the menu
		 * open button
		 */
		description: {
			type: String,
			default: null,
		},
	},

	emits: [
		'close',
		'closed',
		'open',
		'opened',
		'update:open',
		'cancel',
	],

	data() {
		return {
			focusTrap: null,
			opened: this.open,
			shortcutsDisabled: window.OCP?.Accessibility?.disableKeyboardShortcuts?.(),
			triggerId: GenRandomId(),
			descriptionId: GenRandomId(),
		}
	},

	computed: {
		wrapperTag() {
			return this.isNav ? 'nav' : 'div'
		},

		clickOutsideConfig() {
			return [
				this.closeMenu,
				this.clickOutsideOptions,
			]
		},

		listeners() {
			if (this.isNav) {
				return {
					focusout: this.onFocusOut,
				}
			}
			return null
		},
	},

	watch: {
		open(open) {
			if (open) {
				this.openMenu()
			} else {
				this.closeMenu()
			}
		},
	},

	mounted() {
		document.addEventListener('keydown', this.onKeyDown)
	},
	beforeDestroy() {
		document.removeEventListener('keydown', this.onKeyDown)
	},

	methods: {
		/**
		 * Toggle the current menu open state
		 */
		toggleMenu() {
			// Toggling current state
			if (!this.opened) {
				this.openMenu()
			} else {
				this.closeMenu()
			}
		},

		/**
		 * Close the current menu
		 *
		 * @param {boolean} cancelled emit a cancel event instead of close
		 */
		closeMenu(cancelled = false) {
			// Close the menu
			this.opened = false
			this.$emit(cancelled ? 'cancel' : 'close')
			this.$emit('update:open', false)

			// Kill focus trap
			this.clearFocusTrap()

			// Wait for component to finish rendering
			this.$nextTick(() => {
				this.$emit('closed')
			})
		},

		/**
		 * Open the current menu
		 */
		openMenu() {
			// Open the menu
			this.opened = true
			this.$emit('open')
			this.$emit('update:open', true)

			// Wait for component to finish rendering
			this.$nextTick(() => {
				this.useFocusTrap()
				this.$emit('opened')
			})
		},

		onKeyDown(event) {
			if (this.shortcutsDisabled || !this.opened) {
				return
			}

			// If escape have been pressed, we close
			if (event.key === 'Escape') {
				event.preventDefault()

				/** User cancelled the menu by pressing escape */
				this.closeMenu(true)
			}
		},

		/**
		 * @param {FocusEvent} event The focus event
		 */
		onFocusOut(event) {
			if (!this.$refs.headerMenu.contains(event.relatedTarget)) {
				this.closeMenu()
			}
		},

		/**
		 * Add focus trap for accessibility.
		 * Shall only be used when all children are mounted
		 * and available in the DOM. We use $nextTick for that.
		 */
		async useFocusTrap() {
			if (this.isNav || this.focusTrap) {
				return
			}
			// Init focus trap
			const contentContainer = this.$refs.content
			this.focusTrap = createFocusTrap(contentContainer, {
				allowOutsideClick: true,
				trapStack: getTrapStack(),
				fallbackFocus: this.$refs.trigger,
			})
			this.focusTrap.activate()
		},
		clearFocusTrap() {
			this.focusTrap?.deactivate()
			this.focusTrap = null
		},
	},
}
</script>

<style lang="scss" scoped>
// content inner and outer margin
// Also used for menu top-right positioning
$externalMargin: 8px;

@import './header-menu__trigger';

.header-menu {
	&__wrapper {
		position: fixed;
		z-index: 2000;
		top: var(--header-height);
		inset-inline-end: 0;
		box-sizing: border-box;
		margin: 0 $externalMargin;
		border-radius: 0 0 var(--border-radius) var(--border-radius);
		border-radius: var(--border-radius-large);
		background-color: var(--color-main-background);

		filter: drop-shadow(0 1px 5px var(--color-box-shadow));
	}

	&__carret {
		position: absolute;
		z-index: 2001; // Because __wrapper is 2000.
		bottom: 0;
		inset-inline-start: calc(50% - 10px);
		width: 0;
		height: 0;
		content: ' ';
		pointer-events: none;
		border: 10px solid transparent;
		border-bottom-color: var(--color-main-background);
	}

	&__content {
		overflow: auto;
		width: 350px;
		max-width: calc(100vw - 2 * $externalMargin);
		min-height: calc(var(--default-clickable-area) * 1.5);
		max-height: calc(100vh - var(--header-height) * 2);
		:deep(.empty-content) {
			margin: 12vh 10px;
		}
	}
}
</style>
