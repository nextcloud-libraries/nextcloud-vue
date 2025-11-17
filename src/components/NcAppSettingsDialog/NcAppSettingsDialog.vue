<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot, VNode } from 'vue'

import debounce from 'debounce'
import { computed, onBeforeUnmount, provide, ref, toRef, useTemplateRef, warn } from 'vue'
import NcDialog from '../NcDialog/NcDialog.vue'
import NcVNodes from '../NcVNodes/NcVNodes.vue'
import NcAppSettingsDialogVersion from './NcAppSettingsDialogVersion.vue'
import { useIsMobile } from '../../composables/useIsMobile/index.ts'
import { t } from '../../l10n.ts'
import { APP_SETTINGS_LEGACY_DESIGN_KEY, APP_SETTINGS_REGISTRATION_KEY } from './useAppSettingsDialog.ts'

export interface IAppSettingsSection {
	id: string
	name: string
	order?: number
	icon?: VNode[]
}

/**
 * Determines the open / closed state of the modal
 */
const open = defineModel<boolean>('open', { required: true })

const props = withDefaults(defineProps<{
	/**
	 * Shows the navigation on desktop if true
	 */
	showNavigation?: boolean

	/**
	 * Selector for the popover container
	 */
	container?: string

	/**
	 * Name of the settings
	 */
	name?: string

	/**
	 * Additional elements to add to the focus trap
	 */
	additionalTrapElements?: (string | HTMLElement)[]

	/**
	 * Use legacy design without any requirements for the section content
	 *
	 * @deprecated The legacy design will be removed
	 */
	legacy?: boolean

	/**
	 * Do not add the application version at the bottom of the dialog
	 */
	noVersion?: boolean
}>(), {
	container: 'body',
	name: '',
	additionalTrapElements: () => [],
	legacy: false,
	noVersion: false,
})

defineSlots<{
	/**
	 * The NcAppSettingsSections
	 */
	default?: Slot
}>()

provide(APP_SETTINGS_REGISTRATION_KEY, {
	registerSection,
	unregisterSection,
})

provide(APP_SETTINGS_LEGACY_DESIGN_KEY, toRef(() => props.legacy))

const settingsScrollerElement = useTemplateRef('settingsScroller')

const isMobile = useIsMobile()

const selectedSection = ref('')
const linkClicked = ref(false)
const registeredSections = ref<IAppSettingsSection[]>([])

const hasNavigation = computed(() => !isMobile.value && props.showNavigation)

/**
 * Check if one or more navigation entries provide icons
 */
const hasNavigationIcons = computed(() => registeredSections.value.some(({ icon }) => !!icon))

/**
 * Remove selected section once the user starts scrolling
 */
const unfocusNavigationItem = debounce(() => {
	selectedSection.value = ''
	if (document.activeElement?.className.includes('navigation-list__link')) {
		(document.activeElement as HTMLElement).blur()
	}
}, 300)

/**
 * Fallback order map to keep track of section orders if not provided by child components
 */
const sectionsOrderMap = new Map()
onBeforeUnmount(() => {
	sectionsOrderMap.clear()
})

/**
 * Scrolls the content to the selected settings section.absolute
 *
 * @param item - the ID of the section
 */
function handleSettingsNavigationClick(item: string) {
	linkClicked.value = true
	document.getElementById('settings-section_' + item)!.scrollIntoView({
		behavior: 'smooth',
		inline: 'nearest',
	})
	selectedSection.value = item
	setTimeout(() => {
		linkClicked.value = false
	}, 1000)
}

/**
 * Reset the dialog state when closed to have a clean state if re-opened.
 *
 * @param isOpen - The new modal open state
 */
function handleCloseModal(isOpen: boolean) {
	if (isOpen) {
		return
	}

	open.value = false
	// reset the scrolling state if the modal is just hidden
	settingsScrollerElement.value!.scrollTop = 0
}

/**
 * When scrolled manually we remove the focus from the navigation item.
 */
function handleScroll() {
	if (open.value && !linkClicked.value) {
		unfocusNavigationItem()
	}
}

/**
 * Called when a new section is registered
 *
 * @param id - The section ID
 * @param name - The section name
 * @param order - Optional section order in navigation list
 * @param icon - Optional icon component
 */
function registerSection(id: string, name: string, order?: number, icon?: VNode[]) {
	// Check for the uniqueness of section names
	if (registeredSections.value.some(({ id: otherId }) => id === otherId)) {
		throw new Error(`Duplicate section id found: ${id}. Settings navigation sections must have unique section ids.`)
	}
	if (registeredSections.value.some(({ name: otherName }) => name === otherName)) {
		warn(`Duplicate section name found: ${name}. Settings navigation sections must have unique section names.`)
	}

	// Ensure tab order is set
	if (order !== undefined) {
		sectionsOrderMap.set(id, order)
	} else if (sectionsOrderMap.has(id)) {
		order = sectionsOrderMap.get(id)
	} else {
		// Fallback to the closest positive number that isn't already taken
		order = Math.max(0, ...sectionsOrderMap.values()) + 1
		sectionsOrderMap.set(id, order)
	}

	// Sort sections by order in slots
	registeredSections.value = [...registeredSections.value, { id, name, order, icon }]
		.sort(({ order: orderA }, { order: orderB }) => {
			return orderA! - orderB!
		})

	// If this is the first section registered, set it as selected
	if (registeredSections.value.length === 1) {
		selectedSection.value = id
	}
}

/**
 * Called when a section is unregistered to remove it from dialog
 *
 * @param id - The section ID
 */
function unregisterSection(id: string) {
	registeredSections.value = registeredSections.value
		.filter(({ id: otherId }) => id !== otherId)

	// If the current section is unregistered, set the first section as selected
	if (selectedSection.value === id) {
		selectedSection.value = registeredSections.value[0]?.id ?? ''
	}
}
</script>

<template>
	<NcDialog
		v-if="open"
		class="app-settings"
		content-classes="app-settings__content"
		navigation-classes="app-settings__navigation"
		:additional-trap-elements
		:container
		close-on-click-outside
		:navigation-aria-label="t('Settings navigation')"
		size="large"
		:name
		@update:open="handleCloseModal">
		<template v-if="hasNavigation" #navigation="{ isCollapsed }">
			<ul
				v-if="!isCollapsed"
				class="navigation-list">
				<li v-for="section in registeredSections" :key="section.id">
					<a
						:aria-current="`${section.id === selectedSection}`"
						class="navigation-list__link"
						:class="{
							'navigation-list__link--active': section.id === selectedSection,
							'navigation-list__link--icon': hasNavigationIcons,
						}"
						:href="`#settings-section_${section.id}`"
						tabindex="0"
						@click.prevent="handleSettingsNavigationClick(section.id)"
						@keydown.enter="handleSettingsNavigationClick(section.id)">
						<div v-if="hasNavigationIcons" class="navigation-list__link-icon">
							<NcVNodes v-if="section.icon" :vnodes="section.icon" />
						</div>
						<span class="navigation-list__link-text">
							{{ section.name }}
						</span>
					</a>
				</li>
			</ul>
		</template>
		<div ref="settingsScroller" @scroll="handleScroll">
			<slot />
			<NcAppSettingsDialogVersion v-if="!noVersion" />
		</div>
	</NcDialog>
</template>

<style lang="scss" scoped>
.app-settings {
	:deep(.app-settings__navigation) {
		min-width: 200px;
		margin-inline-end: calc(4 * var(--default-grid-baseline));
		overflow-x: hidden;
		overflow-y: auto;
		position: relative;
	}

	:deep(.app-settings__content) {
		padding-inline: calc(4 * var(--default-grid-baseline));
	}
}

.navigation-list {
	height: 100%;
	overflow-y: auto;
	padding: calc(3 * var(--default-grid-baseline));

	&__link {
		display: flex;
		align-content: center;
		font-size: 16px;
		height: var(--default-clickable-area);
		margin: 4px 0;
		line-height: var(--default-clickable-area);
		border-radius: var(--border-radius-element);
		font-weight: bold;
		padding: 0 calc(4 * var(--default-grid-baseline));
		cursor: pointer;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		background-color: transparent;
		border: none;

		&:hover,
		&:focus {
			background-color: var(--color-background-hover);
		}

		&--active {
			background-color: var(--color-primary-element-light) !important;
		}

		&--icon {
			padding-inline-start: calc(2 * var(--default-grid-baseline));
			gap: var(--default-grid-baseline);
		}

		&-icon {
			display: flex;
			justify-content: center;
			align-content: center;
			width: calc(var(--default-clickable-area) - 2 * var(--default-grid-baseline));
			max-width: calc(var(--default-clickable-area) - 2 * var(--default-grid-baseline));
		}
	}
}

@media only screen and (max-width: $breakpoint-small-mobile) {
	.app-settings {
		:deep(.dialog__name) {
			padding-inline-start: 16px;
		}
	}
}
</style>

<docs>
Just nest the `AppSettingSections` component into `NcAppSettingsDialog`,
providing the section's name prop. You can put your settings within each
`NcAppSettingsSection` component.

```vue
<template>
	<div>
		<NcButton @click="settingsOpen = true">Show Settings</NcButton>
		<NcAppSettingsDialog v-model:open="settingsOpen" :show-navigation="true" name="Application settings" legacy>
			<NcAppSettingsSection id="asci-name-1" name="Example name 1">
				Some example content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-2" name="Example name 2">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-3" name="Example name 3">
				Some example content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-4" name="Example name 4">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-5" name="Example name 5">
				Some example content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-6" name="Example name 6">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-7" name="Example name 7">
				Some example content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-8" name="Example name 8">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-9" name="Example name 9">
				Some more content
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-10" name="Example name 10">
				Some more content
			</NcAppSettingsSection>
		</NcAppSettingsDialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			settingsOpen: false,
		}
	},
}
</script>
```

You can also add icons to the section navigation:

```vue
<template>
	<div>
		<NcButton @click="settingsOpen = true">Show Settings</NcButton>
		<NcAppSettingsDialog v-model:open="settingsOpen" :show-navigation="true" name="Application settings" legacy>
			<NcAppSettingsSection id="asci-name-1" name="Instagram">
				<template #icon>
					<Instagram :size="20" />
				</template>
				<p style="height: 100vh;">
					Instagram setting
				</p>
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-2" name="Mastodon">
				<template #icon>
					<Mastodon :size="20" />
				</template>
				<p style="height: 100vh;">
					Mastodon setting
				</p>
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-3" name="Twitch">
				<template #icon>
					<Twitch :size="20" />
				</template>
				<p style="height: 100vh;">
					Twitch setting
				</p>
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-4" name="Twitter">
				<template #icon>
					<Twitter :size="20" />
				</template>
				Twitter setting
			</NcAppSettingsSection>
		</NcAppSettingsDialog>
	</div>
</template>

<script>
import Instagram from 'vue-material-design-icons/Instagram.vue'
import Mastodon from 'vue-material-design-icons/Mastodon.vue'
import Twitch from 'vue-material-design-icons/Twitch.vue'
import Twitter from 'vue-material-design-icons/Twitter.vue'

export default {
	components: {
		Instagram,
		Mastodon,
		Twitch,
		Twitter,
	},
	data() {
		return {
			settingsOpen: false,
		}
	},
}
</script>
```

Sections order in navigation list is defined during initial rendering.
In case of dynamic/conditional sections rendering explicit `order` prop must be used for ordering.

```vue
<template>
	<div>
		<NcButton @click="settingsOpen = true">Show Settings</NcButton>
		<NcAppSettingsDialog v-model:open="settingsOpen" :show-navigation="true" name="Application settings" legacy>
			<NcAppSettingsSection id="asci-name-1" name="Example name 1" :order="1">
				Some example content
				<NcCheckboxRadioSwitch v-model="showExtraSections">Show section 3</NcCheckboxRadioSwitch>
			</NcAppSettingsSection>
			<NcAppSettingsSection id="asci-name-2" name="Example name 2" :order="2">
				Some more content
			</NcAppSettingsSection>
			<template v-if="showExtraSections">
				<NcAppSettingsSection id="asci-name-3" name="Example name 3" :order="3">
					Some example content
				</NcAppSettingsSection>
			</template>
			<NcAppSettingsSection id="asci-name-4" name="Example name 4" :order="4">
				Some more content
			</NcAppSettingsSection>
		</NcAppSettingsDialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				settingsOpen: false,
				showExtraSections: true,
			}
		},
	}
</script>
```

### New design

```vue
<script>
import { mdiPlus, mdiDomain, mdiDockLeft, mdiDockBottom, mdiListBoxOutline, mdiPencilOutline, mdiTrashCanOutline, mdiMedalOutline, mdiEmailOutline } from '@mdi/js'
export default {
	setup() {
		return { mdiPlus, mdiDomain, mdiDockLeft, mdiDockBottom, mdiListBoxOutline, mdiPencilOutline, mdiTrashCanOutline, mdiMedalOutline, mdiEmailOutline }
	},
	data() {
		return {
			settingsOpen: false,
			switchValue: true,
			layout: 'vertical',
			sorting: 'asc',
			reply: 'top',
		}
	},
}
</script>

<template>
	<div>
		<NcButton @click="settingsOpen = true">Mail Settings</NcButton>
		<NcAppSettingsDialog v-model:open="settingsOpen" :show-navigation="true" name="Application settings">
			<NcAppSettingsSection id="general" name="General">
				<NcButton wide>Set as default mail app</NcButton>

				<NcFormGroup label="Account settings">
					<NcFormBox v-slot="{ itemClass }">
						<NcFormBoxButton href="#">user@example.com</NcFormBoxButton>
						<NcFormBoxButton href="#">sales@example.com</NcFormBoxButton>
						<NcButton :class="itemClass" wide>
							<template #icon>
								<NcIconSvgWrapper :path="mdiPlus" />
							</template>
							Add mail account
						</NcButton>
					</NcFormBox>
				</NcFormGroup>
			</NcAppSettingsSection>

			<NcAppSettingsSection id="appearance" name="Appearance">
				<NcFormBox>
					<NcFormBoxSwitch
						v-model="switchValue"
						label="Show all messages in thread"
						description="When off, only the selected messages will be shown" />
				</NcFormBox>
				<NcRadioGroup v-model="layout" label="Layout">
					<NcRadioGroupButton label="Vertical" value="vertical">
						<template #icon>
							<NcIconSvgWrapper :path="mdiDockLeft" />
						</template>
					</NcRadioGroupButton>
					<NcRadioGroupButton label="Horizontal" value="horizontal">
						<template #icon>
							<NcIconSvgWrapper :path="mdiDockBottom" />
						</template>
					</NcRadioGroupButton>
					<NcRadioGroupButton label="List" value="list">
						<template #icon>
							<NcIconSvgWrapper :path="mdiListBoxOutline" />
						</template>
					</NcRadioGroupButton>
				</NcRadioGroup>
				<NcRadioGroup v-model="sorting" label="Sorting">
					<NcRadioGroupButton label="Newest first" value="asc" />
					<NcRadioGroupButton label="Oldest first" value="desc" />
				</NcRadioGroup>
			</NcAppSettingsSection>

			<NcAppSettingsSection id="messages" name="Messages">
				<NcFormBox>
					<NcFormBoxSwitch v-model="switchValue" label="Avatars from Gravatar and favicons" />
					<NcFormBoxSwitch v-model="switchValue" label="Determine importance using machine learning" />
					<NcFormBoxSwitch v-model="switchValue" label="Search the body of messages in Priority inbox" />
				</NcFormBox>
				<NcRadioGroup v-model="reply" label="Reply position">
					<NcRadioGroupButton label="Top" value="top" />
					<NcRadioGroupButton label="Bottom" value="bottom" />
				</NcRadioGroup>
				<NcFormGroup
					label="Text blocks"
					description="Reusable pieces of text that can be inserted in messages">
					<NcListItem name="Title">
						<template #subname>
							Content
						</template>
						<template #extra-actions>
							<NcButton variant="tertiary" #icon>
								<NcIconSvgWrapper :path="mdiPencilOutline" inline />
							</NcButton>
							<NcButton variant="tertiary" #icon>
								<NcIconSvgWrapper :path="mdiTrashCanOutline" inline />
							</NcButton>
						</template>
					</NcListItem>
					<NcListItem name="Reply">
						<template #subname>
							Thank you for contacting us!
						</template>
						<template #extra-actions>
							<NcButton variant="tertiary" #icon>
								<NcIconSvgWrapper :path="mdiPencilOutline" inline />
							</NcButton>
							<NcButton variant="tertiary" #icon>
								<NcIconSvgWrapper :path="mdiTrashCanOutline" inline />
							</NcButton>
						</template>
					</NcListItem>
				</NcFormGroup>
			</NcAppSettingsSection>

			<NcAppSettingsSection id="privacy" name="Privacy">
				<NcFormBox>
					<NcFormBoxSwitch
						v-model="switchValue"
						label="Data collection"
						description="Allow the app to collect and process data locally to adapt to your preferences" />
				</NcFormBox>
				<NcFormGroup label="Always show images from">
					<NcListItem name="example.com">
						<template #icon>
							<NcIconSvgWrapper :path="mdiDomain" inline />
						</template>
						<template #extra-actions>
							<NcButton variant="tertiary" #icon>
								<NcIconSvgWrapper :path="mdiTrashCanOutline" inline />
							</NcButton>
						</template>
					</NcListItem>
					<NcListItem name="example.net">
						<template #icon>
							<NcIconSvgWrapper :path="mdiDomain" inline />
						</template>
						<template #extra-actions>
							<NcButton variant="tertiary" #icon>
								<NcIconSvgWrapper :path="mdiTrashCanOutline" inline />
							</NcButton>
						</template>
					</NcListItem>
					<NcListItem name="mail@example.org">
						<template #icon>
							<NcIconSvgWrapper :path="mdiEmailOutline" inline />
						</template>
						<template #extra-actions>
							<NcButton variant="tertiary" #icon>
								<NcIconSvgWrapper :path="mdiTrashCanOutline" inline />
							</NcButton>
						</template>
					</NcListItem>
				</NcFormGroup>
			</NcAppSettingsSection>

			<NcAppSettingsSection id="security" name="Security">
				<NcFormBox>
					<NcFormBoxSwitch v-model="switchValue" label="Highlight external addresses" />
				</NcFormBox>
				<NcFormGroup label="Internal addresses">
					<NcListItem name="example.com">
						<template #icon>
							<NcIconSvgWrapper :path="mdiDomain" inline />
						</template>
						<template #extra-actions>
							<NcButton variant="tertiary" #icon>
								<NcIconSvgWrapper :path="mdiTrashCanOutline" inline />
							</NcButton>
						</template>
					</NcListItem>
					<NcListItem name="example.company@example.net">
						<template #icon>
							<NcIconSvgWrapper :path="mdiEmailOutline" inline />
						</template>
						<template #extra-actions>
							<NcButton variant="tertiary" #icon>
								<NcIconSvgWrapper :path="mdiTrashCanOutline" inline />
							</NcButton>
						</template>
					</NcListItem>
					<NcButton wide>Add internal address</NcButton>
				</NcFormGroup>
				<NcFormGroup label="S/MIME">
					<NcButton wide>
						<template #icon>
							<NcIconSvgWrapper :path="mdiMedalOutline" inline />
						</template>
						Manage certificates
					</NcButton>
				</NcFormGroup>
				<NcFormGroup label="Mailvelope">
					<NcFormBox>
						<NcFormBoxButton
							label="Step 1"
							description="Install the browser extension"
							href="https://www.mailvelope.com/"
							target="_blank"
							inverted-accent />
						<NcFormBoxButton
							label="Step 2"
							description="Enable the current domain"
							inverted-accent>
							<template #icon>
								<NcIconSvgWrapper :path="mdiDomain" inline />
							</template>
						</NcFormBoxButton>
					</NcFormBox>
				</NcFormGroup>
			</NcAppSettingsSection>

			<NcAppSettingsSection id="about" name="About">
				<NcFormGroup label="Acknowledgements" description="This application includes CKEditor, an open-source editor. Copyright (C) CKEditor contributors. Licensed under GPLv2." />
			</NcAppSettingsSection>

			<NcAppSettingsShortcutsSection>
				<NcHotkeyList>
					<NcHotkey label="Compose new message" hotkey="C" />
					<NcHotkey label="Newer message" hotkey="ArrowLeft" />
					<NcHotkey label="Older message" hotkey="ArrowRight" />
					<NcHotkey label="Toggle star" hotkey="S" />
					<NcHotkey label="Toggle unread" hotkey="U" />
					<NcHotkey label="Archive" hotkey="A" />
					<NcHotkey label="Delete" hotkey="Delete" />
					<NcHotkey label="Search" hotkey="Control F" />
					<NcHotkey label="Send" hotkey="Control Enter" />
					<NcHotkey label="Refresh" hotkey="R" />
				</NcHotkeyList>
			</NcAppSettingsShortcutsSection>
		</NcAppSettingsDialog>
	</div>
</template>
```
</docs>
