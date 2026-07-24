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
static highlight while the motion stays continuous. If JavaScript does not run
the per-entry hover background is used as a fallback.

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
		:class="{ 'app-navigation-list--animated-highlight': enabled }"
		@pointerover="handle"
		@pointerleave="hide"
		@focusin="handle"
		@focusout="onFocusOut">
		<div
			v-if="enabled"
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

export default defineComponent({
	name: 'NcAppNavigationList',

	data() {
		return {
			/** Whether the moving highlight is active (JS mounted) */
			enabled: false,
			/** Whether the highlight is currently shown */
			visible: false,
			/** Whether position changes should transition (slide) or snap */
			animated: false,
			/** Whether the highlight sits on the active entry (turns transparent) */
			overActive: false,
			/** Vertical offset of the highlight inside the scrollable content */
			top: 0,
			/** Height of the highlight */
			height: 0,
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

	mounted() {
		// Progressive enhancement: the sliding highlight only runs once mounted,
		// otherwise the per-entry hover background (see styles) is the fallback.
		this.enabled = true
	},

	methods: {
		/**
		 * Show the highlight on the given entry. It slides there if already
		 * visible, otherwise it snaps into place to avoid sliding in from a
		 * previously hovered entry. Over the active entry it turns transparent
		 * so the active entry keeps its own static highlight.
		 *
		 * @param entry the entry element to cover
		 */
		showOn(entry: HTMLElement) {
			const list = this.$refs.list as HTMLElement
			const entryRect = entry.getBoundingClientRect()
			const listRect = list.getBoundingClientRect()
			const top = entryRect.top - listRect.top + list.scrollTop
			const height = entryRect.height
			this.overActive = entry.classList.contains('active')
			if (this.visible) {
				this.animated = true
				this.top = top
				this.height = height
				return
			}
			// Re-appearing: snap to the new position without sliding, then fade in
			this.animated = false
			this.top = top
			this.height = height
			this.visible = true
			this.$nextTick(() => requestAnimationFrame(() => {
				this.animated = true
			}))
		},

		/** Hide the highlight */
		hide() {
			this.visible = false
		},

		/**
		 * Find the entry element a given event target belongs to, or null if the
		 * event did not land on an eligible entry of this list.
		 *
		 * @param event the pointer or focus event
		 */
		entryFromEvent(event: Event): HTMLElement | null {
			const target = event.target as HTMLElement | null
			const entry = target?.closest<HTMLElement>('.app-navigation-entry')
			// Ignore entries that are being edited (they have their own UI)
			if (!entry || entry.classList.contains('app-navigation-entry--editing')) {
				return null
			}
			return (this.$refs.list as HTMLElement).contains(entry) ? entry : null
		},

		/**
		 * Move the highlight to the entry under the pointer or focus
		 *
		 * @param event the pointer or focus event
		 */
		handle(event: Event) {
			const entry = this.entryFromEvent(event)
			// Not over an entry (e.g. the gap between entries): keep the current
			// state so the highlight can slide across to the next entry. The
			// highlight slides onto every entry, including the active one (where it
			// becomes transparent), so the motion stays continuous.
			if (entry) {
				this.showOn(entry)
			}
		},

		/**
		 * Hide the highlight once focus leaves the list entirely
		 *
		 * @param event the focusout event
		 */
		onFocusOut(event: FocusEvent) {
			const list = this.$refs.list as HTMLElement
			if (!list.contains(event.relatedTarget as Node | null)) {
				this.hide()
			}
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
		will-change: transform, height;
		// The fade and the background morph are always transitioned; sliding is
		// opt-in via --animated so the highlight snaps when it (re)appears.
		transition:
			opacity var(--animation-quick) ease-in-out,
			background-color var(--animation-quick) ease-in-out;

		&--animated {
			transition:
				transform var(--animation-quick) ease-in-out,
				height var(--animation-quick) ease-in-out,
				opacity var(--animation-quick) ease-in-out,
				background-color var(--animation-quick) ease-in-out;
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
