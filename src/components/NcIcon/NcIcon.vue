<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { generateFilePath } from '@nextcloud/router'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
	/**
	 * The name of the icon to use.
	 */
	icon: string

	/**
	 * If set the icon will be mirrored in right-to-left languages.
	 * This is useful for icons that should point into the "start" direction like arrows.
	 */
	directional?: boolean

	/**
	 * Set if the icon should be used as inline content e.g. within text.
	 * By default the icon is made a block element for use inside `icon`-slots.
	 */
	inline?: boolean

	/**
	 * Label of the icon, used in aria-label.
	 * If not label is set the icon will be hidden from assistive technologies.
	 */
	label?: string

	/**
	 * Size of the icon to show.
	 * Defaults to 20px which is the Nextcloud icon size for all icon slots.
	 */
	size?: number
}>(), {
	label: undefined,
	size: 20,
})

const href = computed(() => generateFilePath('core', 'img', 'icons.svg') + `#i-${props.icon}`)
const cssSize = computed(() => `${props.size}px`)
</script>

<template>
	<span
		:aria-hidden="label ? undefined : 'true'"
		:aria-label="label || undefined"
		:class="[$style.icon, {
			[$style.icon_directional]: directional,
			[$style.icon_inline]: inline,
		}]"
		role="img">
		<svg
			:class="$style.icon__svg"
			xmlns="http://www.w3.org/2000/svg">
			<use :href />
		</svg>
	</span>
</template>

<style module>
.icon {
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: var(--default-clickable-area);
	min-height: var(--default-clickable-area);
	opacity: 1;
}

.icon_inline {
	display: inline-flex !important;
	min-width: fit-content;
	min-height: fit-content;
	vertical-align: text-bottom;
}

.icon_directional :global(svg:dir(rtl)) {
	transform: scaleX(-1);
}

.icon__svg {
	fill: currentColor;
	width: v-bind('cssSize');
	height: v-bind('cssSize');
	max-width: v-bind('cssSize');
	max-height: v-bind('cssSize');
}
</style>

<docs>
### Description

Render a Nextcloud icon.

#### Available icons

The following icons are available, besides searching by icon name,
the search also allows to search by icon tags, for example searching for "trash" will also show the "delete" icon.

```vue
<script setup>
import { computed, ref, onMounted, watch } from 'vue'
const useVirtualList = window.useVirtualList

const metadata = ref({})
onMounted(async () => {
	metadata.value = await window.fetch('./icons-metadata.json').then((r) => r.json())
})

const query = ref('')
const nameOnly = ref(true)
const fullMatch = ref(false)

const allIcons = computed(() => Object.keys(metadata.value))
const visibleIcons = computed(() => {
	const search = query.value.toLowerCase().trim() || ''
	const searchParts = search.split(/\s+/).filter(Boolean)

	if (!search) {
		return allIcons.value
	}

	return Object.entries(metadata.value)
		.filter(([name, tags]) => {
			const nameParts = name.split(/[_-]+/)
				.filter(Boolean)

			if (fullMatch.value) {
				if (name === search) {
					return true
				}
				if (searchParts.every(part => nameParts.includes(part))) {
					return true
				}
			} else {
				if (searchParts.some((part) => nameParts.some((namePart) => namePart.includes(part)))) {
					return true
				}
			}

			if (nameOnly.value) {
				return false
			}
			// otherwise also search in tags
			return fullMatch.value ? tags.includes(search) : tags.some((tag) => tag.includes(search))
		})
		.map(([icon]) => icon)
		.sort((a, b) => {
			if (a === search || a.startsWith(search + '_') && !b.startsWith(search + '_')) {
				return -1
			} else if (b === search || b.startsWith(search + '_') && !a.startsWith(search + '_')) {
				return 1
			}
			const aParts = a.split('_')
			const bParts = b.split('_')
			const aHasSearch = aParts.some((part) => searchParts.includes(part))
			const bHasSearch = bParts.some((part) => searchParts.includes(part))
			if (aHasSearch && !bHasSearch) {
				return -1
			} else if (!aHasSearch && bHasSearch) {
				return 1
			}

			const aPartyHasSearch = searchParts.some((part) => a.includes(part))
			const bPartyHasSearch = searchParts.some((part) => b.includes(part))
			return bPartyHasSearch - aPartyHasSearch || a.localeCompare(b)
		})
})

const rows = computed(() => {
	const chunkSize = 5;
	const list = []
	for (let i = 0; i < visibleIcons.value.length; i += chunkSize) {
		list.push(visibleIcons.value.slice(i, i + chunkSize))
	}
	return list
})

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(rows, {
	itemHeight: 80,
})

watch(query, () => {
	scrollTo(0)
})
</script>

<template>
	<div class="search-container">
		<NcInputField
			v-model="query"
			label="Search"
			type="search" />
		<NcCheckboxRadioSwitch
			v-model="nameOnly"
			class="search-filter"
			type="switch">
			Name only
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch
			v-model="fullMatch"
			class="search-filter"
			type="switch">
			Full match
		</NcCheckboxRadioSwitch>
	</div>
	<div class="icon-container" v-bind="containerProps">
		<ul v-bind="wrapperProps" class="icon-grid">
			<template v-for="chunk of list" :key="chunk.index">
				<li
					v-for="icon of chunk.data"
					:key="icon"
					class="icon-entry"
					:title="icon">
					<NcIcon :icon="icon" :size="36" />
					<div class="icon-label">{{ icon }}</div>
				</li>
			</template>
		</ul>
	</div>
</template>

<style scoped>
.search-container {
	display: flex;
	gap: 4px;
	align-items: center;
}

.search-filter {
	margin-top: 6px;
	min-width: fit-content;
}

.icon-entry {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	height: 80px;
}

.icon-label {
	overflow: hidden;
	text-align: center;
	text-overflow: ellipsis;
	width: 100%;
}

.icon-container {
	height: 400px;
}

.icon-grid {
	display: grid;
	grid-auto-rows: 80px;
	grid-template-columns: repeat(5, 120px);
	gap: 0 8px;
}
</style>
```

### Usage within `icon`-slot

```vue
<template>
	<div class="grid">
		<NcButton aria-label="Close">
			<template #icon>
				<NcIcon icon="close" label="Close" />
			</template>
		</NcButton>
		<NcButton aria-label="Settings">
			<template #icon>
				<NcIcon icon="settings" label="Settings" />
			</template>
		</NcButton>
		<NcButton aria-label="Add">
			<template #icon>
				<NcIcon icon="add" label="Add" />
			</template>
		</NcButton>
		<NcButton aria-label="Send">
			<template #icon>
				<NcIcon icon="send" label="Send" />
			</template>
		</NcButton>
		<NcButton aria-label="Star" @click="isStarred = !isStarred">
			<template #icon>
				<NcIcon :icon="isStarred ? 'star_filled' : 'star'" label="Star" />
			</template>
		</NcButton>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const isStarred = ref(false)
</script>

<style>
.grid {
	display: grid;
	grid-template-columns: repeat(5, max-content);
	gap: 10px;
}
</style>
```

### Inline usage inside text

```vue
<template>
	<p>
		I like
		<NcIcon icon="star" inline />
		<NcIcon icon="star_half" inline />
		<NcIcon icon="star_filled" inline />
		stars.
	</p>
</template>
```

### Directional usage

The `directional` property allows to enable a language direction aware icon.
This icon component can be used in places where an language direction aware icon should be used,
for example if an arrow pointing to the left it used it often points in the wrong direction for right-to-left languages.
In this cases this icon can be used which will always point into the logical "start" direction.

```vue
<template>
	<div class="wrapper">
		<NcButton @click="isRtl = !isRtl">Toggle RTL</NcButton>
		<div class="directional" :dir="isRtl ? 'rtl' : 'ltr'">
			<NcButton alignment="start">
				<template #icon>
					<NcIcon icon="chevron_left" label="Previous" directional />
				</template>
				Previous
			</NcButton>
			<NcButton alignment="end-reverse">
				<template #icon>
					<NcIcon icon="chevron_right" label="Next" directional />
				</template>
				Next
			</NcButton>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isRtl: false
		}
	},
}
</script>
<style scoped>
.wrapper {
	display: flex;
	flex-direction: column;
	gap: calc(2 * var(--default-grid-baseline));
	max-width: 300px;
}

.directional {
	display: flex;
	flex-direction: row;
	gap: calc(2 * var(--default-grid-baseline));
}

.directional * {
	flex: 1 50%;
}
</style>
```
</docs>
