<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component lets the user pick an icon, for example for a project or a menu item. Like `NcEmojiPicker` and `NcColorPicker`, it opens from a trigger in the default slot, with a search field and a grid of icons.

The app passes the icons to offer in `icons`, so only those end up in its bundle. The picker stores nothing itself: the app keeps the `name` of the picked icon.

### Usage

```vue
<template>
	<div class="icon-picker-example">
		<NcIconPicker v-model="icon" :icons="icons">
			<NcButton>
				<template #icon>
					<NcIconSvgWrapper :path="selected.path" />
				</template>
				Pick an icon
			</NcButton>
		</NcIconPicker>
		<p>Picked: {{ icon }}</p>
	</div>
</template>

<script>
import {
	mdiAccountGroupOutline,
	mdiBriefcaseOutline,
	mdiCalendarOutline,
	mdiChartBar,
	mdiCogOutline,
	mdiEmailOutline,
	mdiFileDocumentOutline,
	mdiFolderOutline,
	mdiHomeOutline,
	mdiMapMarkerOutline,
	mdiStarOutline,
	mdiTagOutline,
} from '@mdi/js'

export default {
	data() {
		return {
			icon: 'folder',
			icons: [
				{ name: 'account-group', path: mdiAccountGroupOutline, label: 'Team', aliases: ['people', 'users'] },
				{ name: 'briefcase', path: mdiBriefcaseOutline, label: 'Work', aliases: ['job'] },
				{ name: 'calendar', path: mdiCalendarOutline, label: 'Calendar', aliases: ['date', 'event'] },
				{ name: 'chart-bar', path: mdiChartBar, label: 'Chart', aliases: ['statistics'] },
				{ name: 'cog', path: mdiCogOutline, label: 'Settings', aliases: ['gear'] },
				{ name: 'email', path: mdiEmailOutline, label: 'Email', aliases: ['mail', 'message'] },
				{ name: 'file-document', path: mdiFileDocumentOutline, label: 'Document', aliases: ['file'] },
				{ name: 'folder', path: mdiFolderOutline, label: 'Folder', aliases: ['directory'] },
				{ name: 'home', path: mdiHomeOutline, label: 'Home', aliases: ['house'] },
				{ name: 'map-marker', path: mdiMapMarkerOutline, label: 'Location', aliases: ['place', 'pin'] },
				{ name: 'star', path: mdiStarOutline, label: 'Star', aliases: ['favorite'] },
				{ name: 'tag', path: mdiTagOutline, label: 'Tag', aliases: ['label'] },
			],
		}
	},

	computed: {
		selected() {
			return this.icons.find((icon) => icon.name === this.icon)
		},
	},
}
</script>

<style scoped>
.icon-picker-example {
	display: flex;
	align-items: center;
	gap: 16px;
}
</style>
```
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'

import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { n, t } from '../../l10n.ts'
import { createElementId } from '../../utils/createElementId.ts'
import { isRtl } from '../../utils/rtl.ts'
import NcEmptyContent from '../NcEmptyContent/index.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'
import NcPopover from '../NcPopover/index.js'
import NcTextField from '../NcTextField/index.ts'

export interface NcIconPickerIcon {
	/** The unique name of the icon, which is bound with v-model and emitted when it is picked */
	name: string
	/** The SVG path of the icon, for example one from `@mdi/js` */
	path: string
	/** The name shown to the user and read by assistive technology, the `name` when not set */
	label?: string
	/** Other words to find the icon by in the search */
	aliases?: string[]
}

/**
 * The `name` of the picked icon.
 */
const modelValue = defineModel<string>()

/**
 * The open state of the picker.
 */
const open = defineModel<boolean>('open')

const props = withDefaults(defineProps<{
	/**
	 * The icons to choose from, in the order they are shown.
	 */
	icons: NcIconPickerIcon[]

	/**
	 * Leave the picker open when an icon is picked.
	 */
	keepOpen?: boolean

	/**
	 * Selector for the popover container.
	 */
	container?: string | Element
}>(), {
	container: 'body',
})

const emit = defineEmits<{
	/**
	 * An icon was picked.
	 *
	 * @param name - The `name` of the picked icon
	 */
	select: [name: string]
}>()

defineSlots<{
	/**
	 * The trigger that opens the picker, for example a button.
	 */
	default?: Slot
}>()

/** The number of icons in a row of the grid, also used to move up and down with the keyboard */
const COLUMNS = 6

const id = createElementId()
const query = ref('')
const focusedName = ref<string>()
const listElement = useTemplateRef<HTMLUListElement>('list')
const dialogElement = useTemplateRef<HTMLDivElement>('dialog')

/**
 * The name of an icon for the user.
 *
 * @param icon - The icon
 */
function labelOf(icon: NcIconPickerIcon): string {
	return icon.label ?? icon.name
}

const filteredIcons = computed(() => {
	const words = query.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
	if (words.length === 0) {
		return props.icons
	}
	return props.icons.filter((icon) => {
		const text = [icon.name.replaceAll('-', ' '), labelOf(icon), ...(icon.aliases ?? [])].join(' ').toLocaleLowerCase()
		return words.every((word) => text.includes(word))
	})
})

// Announced while searching, so it is clear whether the search found anything
const searchResult = computed(() => {
	if (!query.value.trim()) {
		return ''
	}
	return filteredIcons.value.length === 0
		? t('No icons found')
		: n('%n icon found', '%n icons found', filteredIcons.value.length)
})

// The icon that can be reached with Tab: the focused one, else the picked one, else the first
const tabbableName = computed(() => {
	const names = filteredIcons.value.map((icon) => icon.name)
	for (const name of [focusedName.value, modelValue.value]) {
		if (name && names.includes(name)) {
			return name
		}
	}
	return names[0]
})

// Start afresh each time the picker opens
watch(open, (isOpen) => {
	if (isOpen) {
		query.value = ''
		focusedName.value = undefined
	}
})

/**
 * The id of the element of an icon.
 *
 * @param index - The position of the icon in the shown icons
 */
function optionId(index: number): string {
	return `${id}-icon-${index}`
}

/**
 * Pick an icon.
 *
 * @param icon - The icon
 */
function pick(icon: NcIconPickerIcon) {
	modelValue.value = icon.name
	emit('select', icon.name)
	if (!props.keepOpen) {
		open.value = false
	}
}

/**
 * Move the focus to an icon.
 *
 * @param index - The position of the icon in the shown icons
 */
async function focusIcon(index: number) {
	const icon = filteredIcons.value[index]
	if (!icon) {
		return
	}
	focusedName.value = icon.name
	await nextTick()
	listElement.value?.querySelector<HTMLElement>(`#${optionId(index)}`)?.focus()
}

/**
 * Move into the icons from the search field.
 *
 * @param event - The keydown event
 */
function onSearchKeydown(event: KeyboardEvent) {
	if (event.key === 'ArrowDown' && filteredIcons.value.length > 0) {
		event.preventDefault()
		focusIcon(filteredIcons.value.findIndex((icon) => icon.name === tabbableName.value))
	}
}

/**
 * Move the focus back to the search field.
 */
function focusSearch() {
	dialogElement.value?.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
}

/**
 * Move between the icons and pick one with the keyboard.
 *
 * @param event - The keydown event
 * @param index - The position of the focused icon in the shown icons
 */
function onIconKeydown(event: KeyboardEvent, index: number) {
	if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
		return
	}

	const last = filteredIcons.value.length - 1
	const moves: Record<string, number> = {
		[isRtl ? 'ArrowLeft' : 'ArrowRight']: Math.min(index + 1, last),
		[isRtl ? 'ArrowRight' : 'ArrowLeft']: Math.max(index - 1, 0),
		ArrowDown: Math.min(index + COLUMNS, last),
		ArrowUp: Math.max(index - COLUMNS, 0),
		Home: 0,
		End: last,
	}

	if (event.key === 'ArrowUp' && index < COLUMNS) {
		// From the first row back up to the search field, as the arrow down key came from there
		event.preventDefault()
		focusSearch()
	} else if (event.key in moves) {
		event.preventDefault()
		focusIcon(moves[event.key]!)
	} else if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault()
		pick(filteredIcons.value[index]!)
	}
}
</script>

<template>
	<NcPopover
		v-model:shown="open"
		:container="container"
		popupRole="dialog">
		<template #trigger="slotProps">
			<slot v-bind="slotProps" />
		</template>
		<div
			ref="dialog"
			role="dialog"
			aria-modal="true"
			:aria-label="t('Icon picker')"
			:class="$style.ncIconPicker">
			<NcTextField
				v-model="query"
				type="search"
				:label="t('Search icons')"
				:aria-controls="filteredIcons.length > 0 ? `${id}-list` : undefined"
				@keydown="onSearchKeydown" />
			<p class="hidden-visually" aria-live="polite">
				{{ searchResult }}
			</p>
			<ul
				v-if="filteredIcons.length > 0"
				:id="`${id}-list`"
				ref="list"
				role="listbox"
				:aria-label="t('Icons')"
				:class="$style.ncIconPicker__icons"
				:style="{ '--icon-picker-columns': COLUMNS }">
				<li
					v-for="(icon, index) in filteredIcons"
					:id="optionId(index)"
					:key="icon.name"
					role="option"
					:aria-selected="icon.name === modelValue ? 'true' : 'false'"
					:aria-label="labelOf(icon)"
					:title="labelOf(icon)"
					:tabindex="icon.name === tabbableName ? 0 : -1"
					:class="[$style.ncIconPicker__icon, { [$style.ncIconPicker__icon_selected]: icon.name === modelValue }]"
					@click="pick(icon)"
					@focus="focusedName = icon.name"
					@keydown="onIconKeydown($event, index)">
					<NcIconSvgWrapper :path="icon.path" :size="20" />
				</li>
			</ul>
			<NcEmptyContent
				v-else
				:class="$style.ncIconPicker__empty"
				:name="t('No icons found')" />
		</div>
	</NcPopover>
</template>

<style lang="scss" module>
.ncIconPicker {
	display: flex;
	flex-direction: column;
	gap: calc(2 * var(--default-grid-baseline));
	padding: calc(2 * var(--default-grid-baseline));
}

.ncIconPicker__icons {
	display: grid;
	grid-template-columns: repeat(var(--icon-picker-columns), var(--default-clickable-area));
	gap: var(--default-grid-baseline);
	max-height: calc(6 * var(--default-clickable-area) + 5 * var(--default-grid-baseline));
	margin: 0;
	// Room for the focus outline, as the list scrolls and clips what is outside it
	padding: 4px;
	overflow-y: auto;
	list-style: none;
}

.ncIconPicker__icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: var(--default-clickable-area);
	height: var(--default-clickable-area);
	border-radius: var(--border-radius-element);
	cursor: pointer;

	&:hover {
		background-color: var(--color-background-hover);
	}

	&:focus-visible {
		outline: 2px solid var(--color-main-text);
		outline-offset: 2px;
	}
}

.ncIconPicker__icon_selected {
	&,
	&:hover {
		color: var(--color-primary-element-text);
		background-color: var(--color-primary-element);
	}
}

// Forced colors replace the background that marks the picked icon
@media (forced-colors: active) {
	.ncIconPicker__icon_selected {
		outline: 2px solid Highlight;
	}
}

.ncIconPicker__empty {
	margin: calc(2 * var(--default-grid-baseline)) 0;
}
</style>
