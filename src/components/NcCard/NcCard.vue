<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders a card: a bordered box with a heading, an optional icon in front of it, actions at the end of the heading row, an optional description, content and a footer. Cards are meant to be shown side by side in a grid, for example one card per item of an overview.

The heading is an `h3` by default, one level below the `h2` of a page header. Set `heading-level` to the level that fits where the cards are shown.

With `href` or `to` the heading becomes a link that covers the whole card, so the whole card can be clicked, while it is announced to assistive technology as a single link with the name of the card. Set `target` to open it in another tab or window. Links, buttons and other controls in the `actions` slot, the content and the footer stay clickable on their own. As the rest of the content is part of the link, its text cannot be selected. The `active` prop highlights a card, for example the selected one, and marks its link as the current one for assistive technology.

### Usage

```vue
<template>
	<div class="cards">
		<NcCard
			name="Meeting notes"
			description="The notes of the weekly team meeting, with the decisions and the action points.">
			<template #footer>
				<NcChip text="Published" variant="success" no-close />
			</template>
		</NcCard>
		<NcCard
			name="Budget 2026"
			description="The budget proposal for next year."
			:icon-path="mdiFileChartOutline">
			<template #actions>
				<NcActions>
					<NcActionButton close-after-click>
						Rename
					</NcActionButton>
					<NcActionButton close-after-click>
						Delete
					</NcActionButton>
				</NcActions>
			</template>
			<p>Last changed by Jane Doe.</p>
		</NcCard>
	</div>
</template>

<script>
import { mdiFileChartOutline } from '@mdi/js'

export default {
	setup() {
		return {
			mdiFileChartOutline,
		}
	},
}
</script>

<style scoped>
.cards {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
	gap: 16px;
}
</style>
```

### Link and active cards

```vue
<template>
	<div class="cards">
		<NcCard
			v-for="team in teams"
			:key="team.id"
			:name="team.name"
			:description="team.description"
			:icon-path="mdiAccountGroupOutline"
			:active="team.id === selected"
			:href="'/apps/teams/' + team.id"
			@click.prevent="selected = team.id" />
	</div>
</template>

<script>
import { mdiAccountGroupOutline } from '@mdi/js'

export default {
	setup() {
		return {
			mdiAccountGroupOutline,
		}
	},

	data() {
		return {
			selected: 'design',
			teams: [
				{ id: 'design', name: 'Design', description: '6 members' },
				{ id: 'development', name: 'Development', description: '14 members' },
				{ id: 'support', name: 'Support', description: '4 members' },
			],
		}
	},
}
</script>

<style scoped>
.cards {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 16px;
}
</style>
```
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { computed, inject } from 'vue'
import { routerKey } from 'vue-router'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'

const props = withDefaults(defineProps<{
	/**
	 * The name of the card, shown as its heading.
	 */
	name: string

	/**
	 * A short description shown below the heading.
	 */
	description?: string

	/**
	 * The SVG path of an icon shown in front of the heading, for example one from `@mdi/js`.
	 * The `icon` slot takes precedence.
	 */
	iconPath?: string

	/**
	 * The level of the heading, from 2 to 6.
	 */
	headingLevel?: 2 | 3 | 4 | 5 | 6

	/**
	 * Highlights the card, for example the selected one.
	 */
	active?: boolean

	/**
	 * Turns the card into a link to this address.
	 */
	href?: string

	/**
	 * Turns the card into a `router-link` to this route.
	 * Takes precedence over `href`.
	 */
	to?: RouteLocationRaw

	/**
	 * Where the `href` link opens, for example `_blank` for a new tab.
	 */
	target?: string
}>(), {
	description: undefined,
	iconPath: undefined,
	headingLevel: 3,
	href: undefined,
	to: undefined,
	target: undefined,
})

const slots = defineSlots<{
	/**
	 * The content of the card, below the description.
	 */
	default?: Slot

	/**
	 * A custom icon shown in front of the heading. It replaces the `icon-path` icon.
	 */
	icon?: Slot

	/**
	 * Actions shown at the end of the heading row, for example an `NcActions` menu.
	 */
	actions?: Slot

	/**
	 * Content shown at the bottom of the card, for example chips or links.
	 */
	footer?: Slot
}>()

const hasVueRouterContext = inject(routerKey, null) !== null

const headingTag = computed(() => `h${Math.min(6, Math.max(2, props.headingLevel))}`)

const linkTag = computed(() => {
	if (hasVueRouterContext && props.to) {
		// RouterLink is used by name, so the app's own router is used and not bundled here
		return 'RouterLink'
	}
	return props.href ? 'a' : undefined
})

const linkAttrs = computed(() => {
	// Only when active: an `aria-current` key without a value would also remove the one
	// RouterLink sets itself on a link to the current route
	const current = props.active ? { 'aria-current': 'true' } : {}
	if (linkTag.value === 'RouterLink') {
		return { to: props.to, ...current }
	}
	// Like NcButton, so a page opened in a new tab gets no access to this one
	return { href: props.href, target: props.target, rel: 'nofollow noreferrer noopener', ...current }
})
</script>

<template>
	<article :class="[$style.ncCard, { [$style.ncCard_active]: active, [$style.ncCard_link]: linkTag }]">
		<div :class="$style.ncCard__header">
			<div v-if="slots.icon || iconPath" :class="$style.ncCard__icon">
				<slot name="icon">
					<NcIconSvgWrapper :path="iconPath" />
				</slot>
			</div>
			<component :is="headingTag" :class="$style.ncCard__name">
				<component
					:is="linkTag"
					v-if="linkTag"
					:class="$style.ncCard__link"
					v-bind="linkAttrs">
					{{ name }}
				</component>
				<template v-else>
					{{ name }}
				</template>
			</component>
			<div v-if="slots.actions" :class="$style.ncCard__actions">
				<slot name="actions" />
			</div>
		</div>
		<p v-if="description" :class="$style.ncCard__description">
			{{ description }}
		</p>
		<div v-if="slots.default" :class="$style.ncCard__content">
			<slot />
		</div>
		<div v-if="slots.footer" :class="$style.ncCard__footer">
			<slot name="footer" />
		</div>
	</article>
</template>

<style lang="scss" module>
.ncCard {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: calc(2 * var(--default-grid-baseline));
	min-width: 0;
	padding: calc(4 * var(--default-grid-baseline));
	border: 1px solid var(--color-border);
	border-radius: var(--border-radius-large);
	color: var(--color-main-text);
	background-color: var(--color-main-background);
	transition: border-color var(--animation-quick), box-shadow var(--animation-quick);
}

.ncCard_link {
	&:hover {
		border-color: var(--color-border-maxcontrast);
		box-shadow: 0 2px 8px var(--color-box-shadow);
	}

	&:has(.ncCard__link:focus-visible) {
		outline: 2px solid var(--color-main-text);
		outline-offset: 2px;
	}
}

.ncCard_active {
	border-color: var(--color-primary-element);
	box-shadow: 0 0 0 1px var(--color-primary-element);

	&.ncCard_link:hover {
		border-color: var(--color-primary-element);
		box-shadow: 0 0 0 1px var(--color-primary-element), 0 2px 8px var(--color-box-shadow);
	}
}

// Forced colors replace the border color and drop the shadow, so mark the active card with
// a thicker border in the system highlight color
@media (forced-colors: active) {
	.ncCard_active {
		border-color: Highlight;
		outline: 1px solid Highlight;
	}
}

.ncCard__header {
	display: flex;
	align-items: center;
	gap: calc(2 * var(--default-grid-baseline));
	min-height: var(--default-clickable-area);
}

.ncCard__icon {
	display: flex;
	flex-shrink: 0;
	color: var(--color-primary-element);
}

.ncCard__name {
	flex: 1 1 auto;
	min-width: 0;
	margin: 0;
	font-size: var(--default-font-size);
	font-weight: bold;
	line-height: 1.5;
	overflow-wrap: anywhere;
}

.ncCard__link {
	color: inherit;
	text-decoration: none;

	// Covers the whole card, so the whole card is clickable
	&::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: var(--border-radius-large);
	}

	&:focus-visible {
		outline: none;
	}
}

// Above the link that covers the card, so they stay clickable on their own. Only the
// controls in the content and the footer, so the rest of them still follows the link.
.ncCard__actions,
.ncCard__content :is(a, button, input, select, textarea, summary, [tabindex]),
.ncCard__footer :is(a, button, input, select, textarea, summary, [tabindex]) {
	position: relative;
	z-index: 1;
}

.ncCard__actions {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	gap: var(--default-grid-baseline);
	margin-block: calc(-1 * var(--default-grid-baseline));
	margin-inline-end: calc(-2 * var(--default-grid-baseline));
}

.ncCard__description {
	margin: 0;
	color: var(--color-text-maxcontrast);
}

.ncCard__content {
	min-width: 0;
}

.ncCard__footer {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--default-grid-baseline);
	margin-block-start: auto;
	padding-block-start: calc(2 * var(--default-grid-baseline));
}
</style>
