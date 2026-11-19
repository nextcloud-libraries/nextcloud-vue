<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component shows a single statistic, such as a number of items on a dashboard: a label, the value in large type and an optional icon. It draws no box of its own, so it fits in a card or a grid.

Long words are hyphenated by the rules of the language of the page, or of a `lang` attribute set on the statistic.

### Usage

```vue
<template>
	<div class="stats">
		<NcStatsBlock label="Open cases" :value="42" />
		<NcStatsBlock label="Documents" :value="12873" value-label="this year" :icon-path="mdiFileDocumentOutline" />
		<NcStatsBlock label="Budget used" value="78%" variant="warning" :icon-path="mdiCashMultiple" />
	</div>
</template>

<script>
import { mdiCashMultiple, mdiFileDocumentOutline } from '@mdi/js'

export default {
	setup() {
		return {
			mdiCashMultiple,
			mdiFileDocumentOutline,
		}
	},
}
</script>

<style scoped>
.stats {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 16px;
}
</style>
```

### Variants

```vue
<template>
	<div class="stats">
		<NcStatsBlock label="Primary" :value="12" :icon-path="mdiChartBar" />
		<NcStatsBlock label="Info" :value="3" variant="info" :icon-path="mdiInformationOutline" />
		<NcStatsBlock label="Success" :value="98" variant="success" :icon-path="mdiCheckCircleOutline" />
		<NcStatsBlock label="Warning" :value="7" variant="warning" :icon-path="mdiAlertOutline" />
		<NcStatsBlock label="Error" :value="1" variant="error" :icon-path="mdiAlertCircleOutline" />
	</div>
</template>

<script>
import { mdiAlertCircleOutline, mdiAlertOutline, mdiChartBar, mdiCheckCircleOutline, mdiInformationOutline } from '@mdi/js'

export default {
	setup() {
		return {
			mdiAlertCircleOutline,
			mdiAlertOutline,
			mdiChartBar,
			mdiCheckCircleOutline,
			mdiInformationOutline,
		}
	},
}
</script>

<style scoped>
.stats {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 16px;
}
</style>
```

### Long words

Hyphenation needs a language. This page sets none, so each statistic here sets its own with `lang`. In an app, the language of the page is used, so `lang` is only needed for text in another language.

```vue
<template>
	<div class="stats">
		<NcStatsBlock
			lang="en"
			label="Antidisestablishmentarianism"
			:value="42"
			:icon-path="mdiFileDocumentOutline" />
		<NcStatsBlock
			lang="de"
			label="Donaudampfschifffahrtsgesellschaft"
			:value="7"
			:icon-path="mdiFileDocumentOutline" />
		<NcStatsBlock
			lang="nl"
			label="Arbeidsongeschiktheidsverzekeringen"
			:value="128"
			:icon-path="mdiFileDocumentOutline" />
	</div>
</template>

<script>
import { mdiFileDocumentOutline } from '@mdi/js'

export default {
	setup() {
		return {
			mdiFileDocumentOutline,
		}
	},
}
</script>

<style scoped>
.stats {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(180px, 220px));
	gap: 16px;
}
</style>
```

### Link, loading and extra content

```vue
<template>
	<div class="stats">
		<NcStatsBlock
			label="Unread messages"
			:value="5"
			href="#"
			:icon-path="mdiEmailOutline" />
		<NcStatsBlock
			label="Storage"
			loading
			:icon-path="mdiHarddisk" />
		<NcStatsBlock
			label="Tasks"
			:value="24"
			value-label="in total"
			:icon-path="mdiCheckboxMarkedOutline">
			<p class="breakdown">
				18 done, 6 open
			</p>
		</NcStatsBlock>
	</div>
</template>

<script>
import { mdiCheckboxMarkedOutline, mdiEmailOutline, mdiHarddisk } from '@mdi/js'

export default {
	setup() {
		return {
			mdiCheckboxMarkedOutline,
			mdiEmailOutline,
			mdiHarddisk,
		}
	},
}
</script>

<style scoped>
.stats {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 16px;
}

.breakdown {
	margin: 0;
	color: var(--color-text-maxcontrast);
}
</style>
```
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { getCanonicalLocale } from '@nextcloud/l10n'
import { computed, inject } from 'vue'
import { routerKey } from 'vue-router'
import { t } from '../../l10n.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'
import NcLoadingIcon from '../NcLoadingIcon/index.ts'

const props = withDefaults(defineProps<{
	/**
	 * The label of the statistic, shown above the value.
	 */
	label: string

	/**
	 * The value of the statistic.
	 * A number is formatted for the user's locale, a string is shown as it is.
	 * It can be left out while `loading` is set.
	 */
	value?: number | string

	/**
	 * A short label shown next to the value, for example a unit or "this week".
	 */
	valueLabel?: string

	/**
	 * The SVG path of an icon, for example one from `@mdi/js`.
	 * The `icon` slot takes precedence.
	 */
	iconPath?: string

	/**
	 * The color of the icon and the value.
	 */
	variant?: 'primary' | 'info' | 'success' | 'warning' | 'error'

	/**
	 * Show a loading icon instead of the value.
	 */
	loading?: boolean

	/**
	 * Turns the statistic into a link to this address.
	 */
	href?: string

	/**
	 * Turns the statistic into a `router-link` to this route.
	 * Takes precedence over `href`.
	 */
	to?: RouteLocationRaw
}>(), {
	value: undefined,
	valueLabel: undefined,
	iconPath: undefined,
	variant: 'primary',
	href: undefined,
	to: undefined,
})

const slots = defineSlots<{
	/**
	 * Extra content shown below the value, for example a short breakdown.
	 * With `href` or `to` it is inside the link, so it must not contain links or buttons.
	 */
	default?: Slot

	/**
	 * A custom icon. It replaces the `icon-path` icon.
	 */
	icon?: Slot
}>()

const hasVueRouterContext = inject(routerKey, null) !== null

const tag = computed(() => {
	if (hasVueRouterContext && props.to) {
		// RouterLink is used by name, so the app's own router is used and not bundled here
		return 'RouterLink'
	}
	return props.href ? 'a' : 'div'
})

const linkAttrs = computed(() => {
	if (tag.value === 'RouterLink') {
		return { to: props.to }
	}
	if (tag.value === 'a') {
		return { href: props.href }
	}
	return {}
})

const formattedValue = computed(() => {
	if (typeof props.value === 'number') {
		return new Intl.NumberFormat(getCanonicalLocale()).format(props.value)
	}
	return props.value
})
</script>

<template>
	<component
		:is="tag"
		:class="[$style.ncStatsBlock, $style[`ncStatsBlock_${variant}`], { [$style.ncStatsBlock_link]: tag !== 'div' }]"
		:aria-busy="loading ? 'true' : undefined"
		v-bind="linkAttrs">
		<div v-if="slots.icon || iconPath" :class="$style.ncStatsBlock__icon">
			<slot name="icon">
				<NcIconSvgWrapper :path="iconPath" />
			</slot>
		</div>
		<div :class="$style.ncStatsBlock__body">
			<p :class="$style.ncStatsBlock__name">
				{{ label }}
			</p>
			<p v-if="loading" :class="$style.ncStatsBlock__value">
				<NcLoadingIcon :name="t('Loading …')" />
			</p>
			<p v-else :class="$style.ncStatsBlock__value">
				<span :class="$style.ncStatsBlock__number">{{ formattedValue }}</span>
				<span v-if="valueLabel" :class="$style.ncStatsBlock__label">{{ valueLabel }}</span>
			</p>
			<slot />
		</div>
	</component>
</template>

<style lang="scss" module>
.ncStatsBlock {
	--stats-block-accent: var(--color-primary-element);
	display: flex;
	// The body moves under the icon only when even the number does not fit next to it
	flex-wrap: wrap;
	align-items: center;
	gap: calc(4 * var(--default-grid-baseline));
	min-width: 0;
	padding: calc(2 * var(--default-grid-baseline));
	border-radius: var(--border-radius-large);
	color: var(--color-main-text);
	text-decoration: none;
}

.ncStatsBlock_info {
	--stats-block-accent: var(--color-info-text);
}

.ncStatsBlock_success {
	--stats-block-accent: var(--color-success-text);
}

.ncStatsBlock_warning {
	--stats-block-accent: var(--color-warning-text);
}

.ncStatsBlock_error {
	--stats-block-accent: var(--color-error-text);
}

.ncStatsBlock_link {
	cursor: pointer;

	&:hover {
		background-color: var(--color-background-hover);
	}

	&:focus-visible {
		outline: 2px solid var(--color-main-text);
		outline-offset: 2px;
	}
}

.ncStatsBlock__icon {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	border-radius: 50%;
	color: var(--stats-block-accent);
	background-color: color-mix(in srgb, var(--stats-block-accent) 12%, transparent);
}

.ncStatsBlock__body {
	display: flex;
	flex: 1 1 min-content;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.ncStatsBlock__name {
	margin: 0;
	font-weight: bold;
	// Breaking anywhere keeps a long word from moving the body under the icon.
	// Where the rules of the language allow it, the word is hyphenated instead.
	overflow-wrap: anywhere;
	hyphens: auto;
}

.ncStatsBlock__value {
	display: flex;
	// The label moves below the number when there is no room next to it, and does not
	// count towards the width the body needs next to the icon
	flex-wrap: wrap;
	align-items: baseline;
	gap: calc(1.5 * var(--default-grid-baseline));
	min-width: 0;
	// One line of the value, so the statistic keeps its height while it loads
	min-height: calc(28px * 1.1);
	margin: 0;
}

.ncStatsBlock__number {
	flex: 0 0 auto;
	color: var(--stats-block-accent);
	font-size: 28px;
	font-weight: bold;
	line-height: 1.1;
	white-space: nowrap;
}

.ncStatsBlock__label {
	min-width: 0;
	color: var(--color-text-maxcontrast);
	// Wraps instead of being cut off; breaking anywhere keeps it out of the width the body needs
	overflow-wrap: anywhere;
	hyphens: auto;
}
</style>
