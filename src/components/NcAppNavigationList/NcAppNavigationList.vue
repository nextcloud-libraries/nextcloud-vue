<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Description

List wrapper for use in NcAppNavigation.

The list renders a single hover/focus highlight that slides between entries
instead of every entry painting its own hover background. When it slides onto
the active entry it turns transparent, so the active entry keeps its own
static highlight.

Entries ask for the highlight themselves - `NcAppNavigationItem` does this out
of the box. The list never inspects the DOM to find out what is hovered, so it
also works when entries are rendered by a virtual scroller. If no entry ever
asks for it the per-entry hover background is used as a fallback.

#### Example

Usage with NcAppNavigationCaption as a heading.

```vue
<NcAppNavigation>
	<NcAppNavigationList>
		<NcAppNavigationItem name="First" />
		<NcAppNavigationItem name="Second" />
		<NcAppNavigationItem name="Third" />
	</NcAppNavigationList>
	<NcAppNavigationCaption name="Sections" is-heading />
	<NcAppNavigationList>
		<NcAppNavigationItem name="Foo" />
		<NcAppNavigationItem name="Bar" />
		<NcAppNavigationItem name="Baz" />
	</NcAppNavigationList>
</NcAppNavigation>
```
</docs>

<template>
	<ul
		ref="list"
		class="app-navigation-list"
		:class="{ 'app-navigation-list--animated-highlight': visible }"
		@pointerleave="hideNow"
		@focusout="onFocusOut"
		@scroll.passive="onScroll">
		<div
			class="app-navigation-list__highlight"
			:class="{
				'app-navigation-list__highlight--visible': visible,
				'app-navigation-list__highlight--animated': animated,
				'app-navigation-list__highlight--over-active': overActive,
			}"
			:style="highlightStyle"
			aria-hidden="true" />
		<slot />
	</ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { APP_NAVIGATION_HIGHLIGHT } from './highlight.ts'

export default defineComponent({
	name: 'NcAppNavigationList',

	provide() {
		return {
			[APP_NAVIGATION_HIGHLIGHT]: {
				show: this.show,
				hide: this.hide,
			},
		}
	},

	data() {
		return {
			/** Entry the highlight is on, as reported by that entry itself */
			entry: null as HTMLElement | null,
			/** Whether the highlight is shown */
			visible: false,
			/** Whether position changes should transition (slide) or snap */
			animated: false,
			/** Whether the highlight sits on the active entry (turns transparent) */
			overActive: false,
			/** Vertical offset of the highlight inside the scrollable content */
			top: 0,
			/** Height of the highlight */
			height: 0,
			/** Pending animation frame for re-measuring while scrolling */
			scrollFrame: 0,
		}
	},

	computed: {
		highlightStyle(): Record<string, string> {
			return {
				transform: `translateY(${this.top}px)`,
				height: `${this.height}px`,
			}
		},
	},

	beforeUnmount() {
		if (this.scrollFrame) {
			cancelAnimationFrame(this.scrollFrame)
		}
	},

	methods: {
		/**
		 * Move the highlight onto an entry. It slides there if already visible,
		 * otherwise it snaps into place so it does not slide in from the entry
		 * that was hovered before. Over the active entry it turns transparent so
		 * that entry keeps its own static highlight.
		 *
		 * @param entry the entry element asking for the highlight
		 */
		show(entry: HTMLElement) {
			this.entry = entry
			this.overActive = entry.classList.contains('active')
			if (this.visible) {
				this.animated = true
				this.measure()
				return
			}
			// Re-appearing: snap to the new position, then allow sliding again
			this.animated = false
			this.measure()
			this.visible = true
			this.$nextTick(() => requestAnimationFrame(() => {
				this.animated = true
			}))
		},

		/**
		 * Hide the highlight if it is on the given entry, e.g. because that entry
		 * is being removed. While the pointer only moves between entries the
		 * highlight stays visible, so it can slide on to the next one.
		 *
		 * @param entry the entry element that no longer wants the highlight
		 */
		hide(entry: HTMLElement) {
			if (this.entry === entry) {
				this.hideNow()
			}
		},

		/** Hide the highlight, as the pointer or focus left the list */
		hideNow() {
			this.visible = false
		},

		/**
		 * Hide the highlight once focus leaves the list entirely
		 *
		 * @param event the focusout event
		 */
		onFocusOut(event: FocusEvent) {
			const list = this.$refs.list as HTMLElement
			if (!list.contains(event.relatedTarget as Node | null)) {
				this.hideNow()
			}
		},

		/** Read the current entry's geometry relative to the list content */
		measure() {
			const list = this.$refs.list as HTMLElement | undefined
			if (!list || !this.entry) {
				return
			}
			const entryRect = this.entry.getBoundingClientRect()
			const listRect = list.getBoundingClientRect()
			this.top = entryRect.top - listRect.top + list.scrollTop
			this.height = entryRect.height
		},

		/**
		 * Keep the highlight on its entry while scrolling. Needed because a
		 * virtual scroller repositions its entries as the list scrolls.
		 */
		onScroll() {
			if (!this.visible || this.scrollFrame) {
				return
			}
			this.scrollFrame = requestAnimationFrame(() => {
				this.scrollFrame = 0
				this.measure()
			})
		},
	},
})
</script>

<style lang="scss" scoped>
.app-navigation-list {
	position: relative;
	width: 100%;
	overflow-x: hidden;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: var(--default-grid-baseline, 4px);
	padding: var(--app-navigation-padding);
	isolation: isolate; // keep the highlight layered predictably within the list

	&__highlight {
		// Half of --animation-quick, so the highlight keeps up with the pointer
		--highlight-animation-duration: calc(var(--animation-quick) / 2);
		position: absolute;
		inset-inline: var(--app-navigation-padding);
		top: 0;
		height: 0;
		// As the first positioned child it paints below the entry wrappers
		// (also positioned), so it sits behind the entry content.
		z-index: 0;
		pointer-events: none;
		opacity: 0;
		border-radius: var(--border-radius-element);
		// Matches the per-entry hover background of non-legacy entries.
		background-color: color-mix(in srgb, var(--color-primary-element) 8%, transparent);
		// Only the position is transitioned, height snaps. Entries in a list are
		// usually equally high, so this is not visible, and it keeps the slide off
		// the layout path.
		will-change: transform;
		// The fade and the background morph are always transitioned; sliding is
		// opt-in via --animated so the highlight snaps when it (re)appears.
		// ease-out so it leaves the old entry immediately and feels responsive.
		transition:
			opacity var(--highlight-animation-duration) ease-out,
			background-color var(--highlight-animation-duration) ease-out;

		&--animated {
			transition:
				transform var(--highlight-animation-duration) ease-out,
				opacity var(--highlight-animation-duration) ease-out,
				background-color var(--highlight-animation-duration) ease-out;
		}

		&--visible {
			opacity: 1;
		}

		// Over the active entry the highlight turns transparent so the active
		// entry's own static highlight shows through unchanged, while the
		// highlight still slides on and off it for a continuous motion.
		&--over-active {
			background-color: transparent;
		}
	}
	// Reduced motion is handled globally: the --animation-quick variable is
	// collapsed under a prefers-reduced-motion media query by the server theme,
	// so these transitions become instant without a component-level override.
}
</style>
