<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component shows a card: a heading with an optional icon, description, actions, content and footer, for example one card per item in a grid, or a section of a detail page.

With `href` or `to` the whole card becomes one link, while the controls in its actions, content and footer stay clickable. For a section, `collapsible` lets the heading show and hide the rest, and `flush` lets a table or list run to the edges.

### Usage

```vue
<template>
	<div class="cards">
		<NcCard
			label="Meeting notes"
			description="The notes of the weekly team meeting, with the decisions and the action points.">
			<template #footer>
				<NcChip text="Published" variant="success" no-close />
			</template>
		</NcCard>
		<NcCard
			label="Budget 2026"
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
			:label="team.label"
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
				{ id: 'design', label: 'Design', description: '6 members' },
				{ id: 'development', label: 'Development', description: '14 members' },
				{ id: 'support', label: 'Support', description: '4 members' },
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

### Sections of a page

```vue
<template>
	<div class="sections">
		<NcCard
			v-model:expanded="expanded"
			label="Details"
			:icon-path="mdiInformationOutline"
			collapsible>
			<template #actions>
				<NcActions>
					<NcActionButton close-after-click>
						Edit
					</NcActionButton>
				</NcActions>
			</template>
			<p>Created on 3 November by Jane Doe.</p>
		</NcCard>
		<NcCard label="Members" :icon-path="mdiAccountGroupOutline" flush>
			<ul class="members">
				<li v-for="member in members" :key="member">
					{{ member }}
				</li>
			</ul>
		</NcCard>
		<p>The details are {{ expanded ? 'shown' : 'hidden' }}.</p>
	</div>
</template>

<script>
import { mdiAccountGroupOutline, mdiInformationOutline } from '@mdi/js'

export default {
	setup() {
		return {
			mdiAccountGroupOutline,
			mdiInformationOutline,
		}
	},

	data() {
		return {
			expanded: true,
			members: ['Jane Doe', 'John Doe', 'Alex Smith'],
		}
	},
}
</script>

<style scoped>
.sections {
	display: flex;
	flex-direction: column;
	gap: 16px;
	max-width: 500px;
}

.members {
	margin: 0;
	padding: 0;
	list-style: none;
}

.members li {
	padding: 8px 16px;
	border-top: 1px solid var(--color-border);
}
</style>
```
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { mdiChevronDown } from '@mdi/js'
import { computed, inject } from 'vue'
import { routerKey } from 'vue-router'
import { createElementId } from '../../utils/createElementId.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'

/**
 * Whether the description, the content and the footer of a collapsible card are shown.
 */
const expanded = defineModel<boolean>('expanded', { default: true })

const props = withDefaults(defineProps<{
	/**
	 * The label of the card, shown as its heading.
	 */
	label: string

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
	 * Highlights the card, for example the selected one, and marks its link as the current one.
	 */
	active?: boolean

	/**
	 * Turns the card into a link to this address. The whole card can then be clicked or opened with `Enter` or `Space`,
	 * and its text cannot be selected.
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

	/**
	 * Lets the heading show and hide the description, the content and the footer.
	 * Not used for a card with `href` or `to`, as its heading is the link,
	 * nor for a card without a description, content or footer, as there is nothing to hide.
	 */
	collapsible?: boolean

	/**
	 * Lets the content run to the edges of the card, for example for a table or a list.
	 */
	flush?: boolean
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

// The description, the content and the footer, the part a collapsible card shows and hides
const hasBody = computed(() => Boolean(props.description || slots.default || slots.footer))

// The heading of a link card is the link, so it cannot also toggle the card. Without a body
// there is nothing to toggle, and the button would control an element that is not there.
const isCollapsible = computed(() => props.collapsible && !linkTag.value && hasBody.value)

const bodyId = createElementId()

/**
 * Follow the link with `Space` too, as the whole card looks and acts like one control.
 *
 * @param event - The keydown event
 */
function onLinkKeydown(event: KeyboardEvent) {
	if (event.key !== ' ' || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
		return
	}
	// Without this, Space would scroll the page
	event.preventDefault()
	const link = event.currentTarget as HTMLElement
	link.click()
}
</script>

<template>
	<article :class="[$style.ncCard, { [$style.ncCard_active]: active, [$style.ncCard_link]: linkTag, [$style.ncCard_flush]: flush }]">
		<div :class="$style.ncCard__header">
			<div v-if="slots.icon || iconPath" :class="$style.ncCard__icon">
				<slot name="icon">
					<!-- Inline, so the icon is not centered in a clickable area and lines up with the text below -->
					<NcIconSvgWrapper inline :path="iconPath" />
				</slot>
			</div>
			<component :is="headingTag" :class="$style.ncCard__name">
				<component
					:is="linkTag"
					v-if="linkTag"
					:class="$style.ncCard__link"
					v-bind="linkAttrs"
					@keydown="onLinkKeydown">
					{{ label }}
				</component>
				<button
					v-else-if="isCollapsible"
					type="button"
					class="button-vue"
					:class="$style.ncCard__toggle"
					:aria-expanded="expanded ? 'true' : 'false'"
					:aria-controls="bodyId"
					@click="expanded = !expanded">
					<span :class="$style.ncCard__toggleName">{{ label }}</span>
					<NcIconSvgWrapper
						inline
						:class="[$style.ncCard__chevron, { [$style.ncCard__chevron_expanded]: expanded }]"
						:path="mdiChevronDown" />
				</button>
				<template v-else>
					{{ label }}
				</template>
			</component>
			<div v-if="slots.actions" :class="$style.ncCard__actions">
				<slot name="actions" />
			</div>
		</div>
		<div
			v-if="hasBody"
			v-show="!isCollapsible || expanded"
			:id="bodyId"
			:class="$style.ncCard__body">
			<p v-if="description" :class="$style.ncCard__description">
				{{ description }}
			</p>
			<div v-if="slots.default" :class="$style.ncCard__content">
				<slot />
			</div>
			<div v-if="slots.footer" :class="$style.ncCard__footer">
				<slot name="footer" />
			</div>
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

// The heading of a collapsible card: a button with the label and a chevron
.ncCard__toggle {
	display: flex;
	align-items: center;
	gap: var(--default-grid-baseline);
	width: 100%;
	min-height: var(--default-clickable-area);
	margin: 0;
	padding: 0;
	border: none;
	border-radius: var(--border-radius-element);
	color: inherit;
	background: none;
	font: inherit;
	text-align: start;
	cursor: pointer;

	&:focus-visible {
		outline: 2px solid var(--color-main-text);
		outline-offset: 2px;
	}
}

.ncCard__toggleName {
	flex: 1 1 auto;
	min-width: 0;
}

// Points to the side while collapsed and down while expanded
.ncCard__chevron {
	flex-shrink: 0;
	transform: rotate(-90deg);
	transition: transform var(--animation-quick);

	&:dir(rtl) {
		transform: rotate(90deg);
	}
}

.ncCard__chevron_expanded {
	&,
	&:dir(rtl) {
		transform: none;
	}
}

.ncCard__body {
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	gap: calc(2 * var(--default-grid-baseline));
	min-width: 0;
}

.ncCard__description {
	margin: 0;
	color: var(--color-text-maxcontrast);
}

.ncCard__content {
	min-width: 0;
}

// The content runs to the sides of the card, and to its bottom when it comes last
.ncCard_flush .ncCard__content {
	margin-inline: calc(-4 * var(--default-grid-baseline));

	&:last-child {
		margin-block-end: calc(-4 * var(--default-grid-baseline));
		overflow: hidden;
		border-end-start-radius: var(--border-radius-large);
		border-end-end-radius: var(--border-radius-large);
	}
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
