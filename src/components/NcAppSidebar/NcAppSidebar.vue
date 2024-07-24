<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component provides a way to include the standardised sidebar.
The standard properties like name, subname, starred, etc. allow to automatically
include a standard-header like it's used by the files app.

To conditionally show the sidebar either use `v-if` on the sidebar component,
or use the `open` property of the component to controll the state.
Using `v-show` directly will result in usability issues due to internal focus trap handling.

### Standard usage

```vue
<template>
	<NcAppSidebar
		:starred="starred"
		name="cat-picture.jpg"
		subname="last edited 3 weeks ago">
		<NcAppSidebarTab name="Search" id="search-tab">
			<template #icon>
				<Magnify :size="20" />
			</template>
			Search tab content
		</NcAppSidebarTab>
		<NcAppSidebarTab name="Settings" id="settings-tab">
			<template #icon>
				<Cog :size="20" />
			</template>
			Settings tab content
		</NcAppSidebarTab>
		<NcAppSidebarTab name="Sharing" id="share-tab">
			<template #icon>
				<ShareVariant :size="20" />
			</template>
			Sharing tab content
		</NcAppSidebarTab>
	</NcAppSidebar>
</template>
<script>
	import Magnify from 'vue-material-design-icons/Magnify.vue'
	import Cog from 'vue-material-design-icons/Cog.vue'
	import ShareVariant from 'vue-material-design-icons/ShareVariant.vue'

	export default {
		components: {
			Magnify,
			Cog,
			ShareVariant,
		},
		data() {
			return {
				starred: false,
			}
		},
	}
</script>
```

### One tab

Single tab is rendered without navigation.

```vue
<template>
	<div>
		<NcCheckboxRadioSwitch :checked.sync="forceTabs">Force tab navigation</NcCheckboxRadioSwitch>
		<NcAppSidebar
			name="cat-picture.jpg"
			:force-tabs="forceTabs"
			subname="last edited 3 weeks ago">
			<NcAppSidebarTab name="Settings" id="settings-tab">
				<template #icon>
					<Cog :size="20" />
				</template>
				Single tab content
			</NcAppSidebarTab>
		</NcAppSidebar>
	</div>
</template>
<script>
import Cog from 'vue-material-design-icons/Cog.vue'

export default {
	components: {
		Cog,
	},
	data() {
		return {
			forceTabs: false,
		}
	},
}
</script>
```

### Dynamic tabs

```vue
<template>
	<div>
		<NcCheckboxRadioSwitch :checked.sync="showTabs[0]">Show search tab</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="showTabs[1]">Show settings tab</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="showTabs[2]">Show sharing tab</NcCheckboxRadioSwitch>
		<NcAppSidebar
			name="cat-picture.jpg"
			subname="last edited 3 weeks ago">
			<NcAppSidebarTab v-if="showTabs[0]" name="Search" id="search-tab">
				<template #icon>
					<Magnify :size="20" />
				</template>
				Search tab content
			</NcAppSidebarTab>
			<NcAppSidebarTab v-if="showTabs[1]" name="Settings" id="settings-tab">
				<template #icon>
					<Cog :size="20" />
				</template>
				Settings
			</NcAppSidebarTab>
			<NcAppSidebarTab v-if="showTabs[2]" name="Sharing" id="share-tab">
				<template #icon>
					<ShareVariant :size="20" />
				</template>
				Sharing tab content
			</NcAppSidebarTab>
		</NcAppSidebar>
	</div>
</template>
<script>
import Magnify from 'vue-material-design-icons/Magnify.vue'
import Cog from 'vue-material-design-icons/Cog.vue'
import ShareVariant from 'vue-material-design-icons/ShareVariant.vue'

export default {
	components: {
		Magnify,
		Cog,
		ShareVariant,
	},
	data() {
		return {
			showTabs: [true, true, false],
		}
	},
}
</script>
```

### Custom order

```vue
<template>
	<NcAppSidebar
		name="cat-picture.jpg"
		subname="last edited 3 weeks ago">
		<NcAppSidebarTab name="Search" id="search-tab" :order="3">
			<template #icon>
				<Magnify :size="20" />
			</template>
			Search tab content
		</NcAppSidebarTab>
		<NcAppSidebarTab name="Settings" id="settings-tab" :order="2">
			<template #icon>
				<Cog :size="20" />
			</template>
			Settings tab content
		</NcAppSidebarTab>
		<NcAppSidebarTab name="Sharing" id="share-tab" :order="1">
			<template #icon>
				<ShareVariant :size="20" />
			</template>
			Sharing tab content
		</NcAppSidebarTab>
	</NcAppSidebar>
</template>
<script>
import Magnify from 'vue-material-design-icons/Magnify.vue'
import Cog from 'vue-material-design-icons/Cog.vue'
import ShareVariant from 'vue-material-design-icons/ShareVariant.vue'

export default {
	components: {
		Magnify,
		Cog,
		ShareVariant,
	},
}
</script>
```

### Activating tab programmatically

```vue
<template>
	<div>
		<NcSelect v-model="active" :options="['search-tab', 'settings-tab', 'share-tab']" />
		<NcAppSidebar
			name="cat-picture.jpg"
			subname="last edited 3 weeks ago"
			:active.sync="active">
			<NcAppSidebarTab name="Search" id="search-tab">
				<template #icon>
					<Magnify :size="20" />
				</template>
				Search tab content
			</NcAppSidebarTab>
			<NcAppSidebarTab name="Settings" id="settings-tab">
				<template #icon>
					<Cog :size="20" />
				</template>
				Settings
			</NcAppSidebarTab>
			<NcAppSidebarTab name="Sharing" id="share-tab">
				<template #icon>
					<ShareVariant :size="20" />
				</template>
				Sharing tab content
			</NcAppSidebarTab>
		</NcAppSidebar>
	</div>
</template>
<script>
import Magnify from 'vue-material-design-icons/Magnify.vue'
import Cog from 'vue-material-design-icons/Cog.vue'
import ShareVariant from 'vue-material-design-icons/ShareVariant.vue'

export default {
	components: {
		Magnify,
		Cog,
		ShareVariant,
	},
	data() {
		return {
			active: 'search-tab',
		}
	},
}
</script>
```

### Editable name

```vue
<template>
	<NcAppSidebar
		:name.sync="name"
		:name-editable="true"
		name-placeholder="Filename"
		subname="last edited 3 weeks ago">
		<!-- Insert your slots and tabs here -->
	</NcAppSidebar>
</template>
<script>
	export default {
		data() {
			return {
				name: 'cat-picture.jpg',
			}
		},
	}
</script>
```

### Editable name after click with custom tertiary action

```vue
<template>
	<NcAppSidebar
		:name="name"
		:name-editable.sync="nameEditable"
		:name-placeholder="namePlaceholder"
		:subname="subname"
		@update:name="nameUpdate">
		<template #tertiary-actions>
			<form>
				<input type="checkbox" @click="toggledCheckbox"/>
			</form>
		</template>
	</NcAppSidebar>
</template>
<script>
	export default {
		data() {
			return {
				name: 'cat-picture.jpg',
				namePlaceholder: 'Filename',
				subname: 'last edited 3 weeks ago',
				nameEditable: false
			}
		},
		methods: {
			nameUpdate(e) {
				this.name = e
			},
			toggledCheckbox() {
				alert('toggle')
			}
		}
	}
</script>
```

### Custom subname

Instead of using the `subname` prop you can use the same called slot. This is handy if you need to add accessible information.
Like in the following example where the goal is to show a star icon to mark the file a favorite.
Simplying adding `★` would not work as screen readers might not or wrongly announce the icon meaning this information is lost.

A working alternative would be using an icon together with an `aria-label`:

```vue
	<template>
		<NcAppSidebar name="cat-picture.jpg">
			<template #subname>
				<NcIconSvgWrapper inline :path="mdiStar" name="Favorite" />
				123 KiB, a month ago
			</template>
		</NcAppSidebar>
	</template>
	<script>
	import { mdiStar } from '@mdi/js'

	export default {
		setup() {
			return {
				mdiStar,
			}
		}
	}
	</script>
```

### Empty sidebar for e.g. empty content component.

```vue
	<template>
		<NcAppSidebar
			name="cat-picture.jpg"
			:empty="true">
			<NcEmptyContent name="Content not found.">
				<template #icon>
					<Magnify :size="20" />
				</template>
			</NcEmptyContent>
		</NcAppSidebar>
	</template>
	<script>
	import Magnify from 'vue-material-design-icons/Magnify.vue'

	export default {
		components: {
			Magnify,
		},
	}
	</script>
```

### Conditionally show the sidebar with `open`

If the sidebar should be shown conditionally, you can use `open` prop to define sidebar visibility.
It automatically shows a toggle button to open the sidebar if it is closed.

You can also use `--app-sidebar-offset` CSS variable to preserve space
for the toggle button, for example, in top bar of `NcAppContent`.

The built-in toggle button can be removed with `no-toggle` prop.

Note: the built-in toggle button is only available then NcAppSidebar is used in NcContent.

```vue
<template>
	<!-- This is in most cases NcContent -->
	<NcContent app-name="styleguidist" class="content-styleguidist">
		<NcAppContent>
			<div class="top-bar">
				<NcButton type="primary">Start a call</NcButton>
			</div>
		</NcAppContent>
		<!-- The sidebar -->
		<NcAppSidebar
			:open.sync="showSidebar"
			name="cat-picture.jpg"
			subname="last edited 3 weeks ago">
			<NcAppSidebarTab name="Settings" id="settings-tab">
				<template #icon>
					<Cog :size="20" />
				</template>
				Single tab content
			</NcAppSidebarTab>
		</NcAppSidebar>
	</NcContent>
</template>

<script>
import Cog from 'vue-material-design-icons/Cog'

export default {
	components: {
		Cog,
	},
	data() {
		return {
			showSidebar: true,
		}
	},
}
</script>
<style scoped>
/* This styles just mock NcContent and NcAppContent */
.content-styleguidist {
	position: relative !important;
	/* Just to prevent jumping when the sidebar is hidden */
	min-height: 360px;
}

.main-content {
	position: absolute;
	height: 100%;
	width: 100%;
}

/* Fix styles on this style guide page */
@media only screen and (max-width: 512px) {
	:deep(aside) {
		width: calc(100vw - 64px) !important;
	}
}

.top-bar {
	display: flex;
	justify-content: flex-end;
	/* preserve space for toggle button */
	padding-inline-end: var(--app-sidebar-offset);
	/* same as on toggle button, but doesn't have to be the same */
	margin: var(--app-sidebar-padding);
}
</style>
```

### Conditionally show the sidebar programmatically with `v-if`

If the sidebar should be shown conditionally without any explicit toggle button, you can use `v-if`.

**Note about performance**: using `v-if` might result in bad performance and loosing sidebar content state.

**Note about `v-show`**: using `v-show` to hide sidebar will result in usability issues due to active focus trap on mobile.

```vue
<template>
	<!-- This is in most cases NcContent -->
	<NcContent app-name="styleguidist" class="content-styleguidist">
		<NcAppContent>
			<div class="top-bar">
				<NcButton @click.prevent="showSidebar = true">
					Toggle sidebar
				</NcButton>
			</div>
		</NcAppContent>
		<!-- The sidebar -->
		<NcAppSidebar
			v-if="showSidebar"
			name="cat-picture.jpg"
			subname="last edited 3 weeks ago"
			@close="showSidebar = false">
			<NcAppSidebarTab name="Settings" id="settings-tab">
				<template #icon>
					<Cog :size="20" />
				</template>
				Single tab content
			</NcAppSidebarTab>
		</NcAppSidebar>
	</NcContent>
</template>

<script>
import Cog from 'vue-material-design-icons/Cog'

export default {
	components: {
		Cog,
	},
	data() {
		return {
			showSidebar: true,
		}
	},
}
</script>
<style scoped>
/* This styles just mock NcContent and NcAppContent */
.content-styleguidist {
	position: relative !important;
	/* Just to prevent jumping when the sidebar is hidden */
	min-height: 360px;
}

.main-content {
	position: absolute;
	height: 100%;
	width: 100%;
}

/* Fix styles on this style guide page */
@media only screen and (max-width: 512px) {
	:deep(aside) {
		width: calc(100vw - 64px) !important;
	}
}

.top-bar {
	display: flex;
	justify-content: flex-end;
	/* preserve space for toggle button */
	padding-inline-end: var(--app-sidebar-offset);
	/* same as on toggle button, but doesn't have to be the same */
	margin: var(--app-sidebar-padding);
}
</style>
```
</docs>

<template>
	<transition appear
		name="slide-right"
		@before-enter="onBeforeEnter"
		@after-enter="onAfterEnter"
		@before-leave="onBeforeLeave"
		@after-leave="onAfterLeave">
		<aside v-show="open"
			id="app-sidebar-vue"
			ref="sidebar"
			class="app-sidebar"
			:aria-labelledby="`app-sidebar-vue-${uid}__header`"
			@keydown.esc="onKeydownEsc">
			<!--
				We cannot render toggle button inside sidebar (aside#app-sidebar-vue), because it is hidden then the toggle is needed.
				But we also need transition with the sidebar to be the root of this component to use it as a single UI element, allowing to use `v-show`.
				So we cannot render the toggle button directly in this component.
				As a simple solution - render it in the content to keep correct position.
			-->
			<Teleport v-if="ncContentSelector && !open && !noToggle" :selector="ncContentSelector">
				<NcButton :aria-label="t('Open sidebar')"
					class="app-sidebar__toggle"
					:class="toggleClasses"
					type="tertiary"
					v-bind="toggleAttrs"
					@click="$emit('update:open', true)">
					<template #icon>
						<!-- @slot Custom icon for the toggle button, defaults to the dock-right icon from MDI -->
						<slot name="toggle-icon">
							<IconDockRight :size="20" />
						</slot>
					</template>
				</NcButton>
			</Teleport>

			<header :class="{
					'app-sidebar-header--with-figure': hasFigure,
					'app-sidebar-header--compact': compact,
				}"
				class="app-sidebar-header">
				<!-- container for figure and description, allows easy switching to compact mode -->
				<div class="app-sidebar-header__info">
					<!-- sidebar header illustration/figure -->
					<div v-if="hasFigure && !empty"
						:class="{
							'app-sidebar-header__figure--with-action': hasFigureClickListener
						}"
						class="app-sidebar-header__figure"
						:style="{
							backgroundImage: `url(${background})`
						}"
						tabindex="0"
						@click="onFigureClick"
						@keydown.enter="onFigureClick">
						<slot class="app-sidebar-header__background" name="header" />
					</div>

					<!-- sidebar details -->
					<div v-if="!empty"
						:class="{
							'app-sidebar-header__desc--with-tertiary-action': canStar || $slots['tertiary-actions'],
							'app-sidebar-header__desc--editable': nameEditable && !subname,
							'app-sidebar-header__desc--with-subname--editable': nameEditable && subname,
							'app-sidebar-header__desc--without-actions': !$slots['secondary-actions'],
						}"
						class="app-sidebar-header__desc">
						<!-- favourite icon -->
						<div v-if="canStar || $slots['tertiary-actions']" class="app-sidebar-header__tertiary-actions">
							<slot name="tertiary-actions">
								<NcButton v-if="canStar"
									:aria-label="favoriteTranslated"
									:pressed="isStarred"
									class="app-sidebar-header__star"
									type="secondary"
									@click.prevent="toggleStarred">
									<template #icon>
										<NcLoadingIcon v-if="starLoading" />
										<Star v-else-if="isStarred" :size="20" />
										<StarOutline v-else :size="20" />
									</template>
								</NcButton>
							</slot>
						</div>

						<!-- name -->
						<div class="app-sidebar-header__name-container">
							<div class="app-sidebar-header__mainname-container">
								<!-- main name -->
								<h2 v-show="!nameEditable"
									:id="`app-sidebar-vue-${uid}__header`"
									ref="header"
									v-linkify="{text: name, linkify: linkifyName}"
									:aria-label="title"
									:title="title"
									class="app-sidebar-header__mainname"
									:tabindex="nameEditable ? 0 : -1"
									@click.self="editName">
									{{ name }}
								</h2>
								<template v-if="nameEditable">
									<form v-click-outside="() => onSubmitName()"
										class="app-sidebar-header__mainname-form"
										@submit.prevent="onSubmitName">
										<input ref="nameInput"
											v-focus
											class="app-sidebar-header__mainname-input"
											type="text"
											:placeholder="namePlaceholder"
											:value="name"
											@keydown.esc.stop="onDismissEditing"
											@input="onNameInput">
										<NcButton type="tertiary-no-background"
											:aria-label="changeNameTranslated"
											native-type="submit">
											<template #icon>
												<ArrowRight :size="20" />
											</template>
										</NcButton>
									</form>
								</template>
								<!-- header main menu -->
								<NcActions v-if="$slots['secondary-actions']"
									class="app-sidebar-header__menu"
									:force-menu="forceMenu">
									<slot name="secondary-actions" />
								</NcActions>
							</div>
							<!-- secondary name -->
							<p v-if="subname.trim() !== '' || $slots['subname']"
								:title="subtitle || undefined"
								class="app-sidebar-header__subname">
								<!-- @slot Alternative to the `subname` prop can be used for more complex conent. It will be rendered within a `p` tag. -->
								<slot name="subname">
									{{ subname }}
								</slot>
							</p>
						</div>
					</div>
				</div>

				<NcButton ref="closeButton"
					:title="closeTranslated"
					:aria-label="closeTranslated"
					type="tertiary"
					class="app-sidebar__close"
					@click.prevent="closeSidebar">
					<template #icon>
						<Close :size="20" />
					</template>
				</NcButton>

				<div v-if="$slots['description'] && !empty" class="app-sidebar-header__description">
					<slot name="description" />
				</div>
			</header>

			<NcAppSidebarTabs v-show="!loading"
				ref="tabs"
				:active="active"
				:force-tabs="forceTabs"
				@update:active="onUpdateActive">
				<slot />
			</NcAppSidebarTabs>

			<NcEmptyContent v-if="loading">
				<template #icon>
					<NcLoadingIcon :size="64" />
				</template>
			</NcEmptyContent>
		</aside>
	</transition>
</template>

<script>
// TODO: This is built-in for vue3 just drop the import
import { Portal as Teleport } from '@linusborg/vue-simple-portal'

import NcAppSidebarTabs from './NcAppSidebarTabs.vue'
import NcActions from '../NcActions/index.js'
import NcLoadingIcon from '../NcLoadingIcon/index.js'
import NcButton from '../NcButton/index.js'
import NcEmptyContent from '../NcEmptyContent/index.js'
import Focus from '../../directives/Focus/index.js'
import Linkify from '../../directives/Linkify/index.js'
import { useIsSmallMobile } from '../../composables/useIsMobile/index.js'
import GenRandomId from '../../utils/GenRandomId.js'
import { getTrapStack } from '../../utils/focusTrap.js'
import { t } from '../../l10n.js'

import ArrowRight from 'vue-material-design-icons/ArrowRight.vue'
import Close from 'vue-material-design-icons/Close.vue'
import IconDockRight from 'vue-material-design-icons/DockRight.vue'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'

import { vOnClickOutside as ClickOutside } from '@vueuse/components'
import { createFocusTrap } from 'focus-trap'

export default {
	name: 'NcAppSidebar',

	components: {
		Teleport,
		NcActions,
		NcAppSidebarTabs,
		ArrowRight,
		IconDockRight,
		NcButton,
		NcLoadingIcon,
		NcEmptyContent,
		Close,
		Star,
		StarOutline,
	},

	directives: {
		focus: Focus,
		linkify: Linkify,
		ClickOutside,
	},

	inject: {
		ncContentSelector: {
			from: 'NcContent:selector',
			default: undefined,
		},
	},

	props: {
		active: {
			type: String,
			default: '',
		},
		name: {
			type: String,
			default: '',
			required: true,
		},

		/**
		 * Allow to edit the sidebar name.
		 */
		nameEditable: {
			type: Boolean,
			default: false,
		},
		namePlaceholder: {
			type: String,
			default: '',
		},
		subname: {
			type: String,
			default: '',
		},
		/**
		 * Title to display for the subname.
		 */
		subtitle: {
			type: String,
			default: '',
		},

		/**
		 * Url to the top header background image
		 * Applied with css
		 */
		background: {
			type: String,
			default: '',
		},

		/**
		 * Enable the favourite icon if not null
		 * See fired events
		 */
		starred: {
			type: Boolean,
			default: null,
		},
		/**
		 * Show loading spinner instead of the star icon
		 */
		starLoading: {
			type: Boolean,
			default: false,
		},
		/**
		 * Show loading spinner instead of tabs
		 */
		loading: {
			type: Boolean,
			default: false,
		},

		/**
		 * Display the sidebar in compact mode
		 */
		compact: {
			type: Boolean,
			default: false,
		},

		/**
		 * Only display close button and default slot content.
		 * Don't display other header content and primary and secondary actions.
		 * Useful when showing the EmptyContent component as content.
		 */
		empty: {
			type: Boolean,
			default: false,
		},

		/**
		 * Force the actions to display in a three dot menu
		 */
		forceMenu: {
			type: Boolean,
			default: false,
		},
		/**
		 * Force the tab navigation to display even if there is only one tab
		 */
		forceTabs: {
			type: Boolean,
			default: false,
		},
		/**
		 * Linkify the name
		 */
		linkifyName: {
			type: Boolean,
			default: false,
		},
		/**
		 * Title to display for the name.
		 * Can be set to the same text in case it's too long.
		 */
		title: {
			type: String,
			default: '',
		},

		/**
		 * Allow to conditionally show the sidebar
		 * You can also use `v-if` on the sidebar, but using the open prop allow to keep
		 * the sidebar inside the DOM for performance if it is opened and closed multiple times.
		 *
		 * When using the `open` property to close the sidebar a built-in toggle button will be shown to reopen it,
		 * similar to the app navigation. You can remove this button with the `no-toggle` prop.
		 */
		open: {
			type: Boolean,
			default: true,
		},

		/**
		 * Custom classes to assign to the sidebar toggle button.
		 * If needed this can be used to assign styles to the button using `:deep()` selector.
		 */
		toggleClasses: {
			type: [String, Array, Object],
			default: '',
		},

		/**
		 * Custom attrs to assign to the sidebar toggle button.
		 */
		toggleAttrs: {
			type: Object,
			default: undefined,
		},

		/**
		 * Do not add the built-in toggle button with `open` prop.
		 */
		noToggle: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'close',
		'closing',
		'closed',
		'opening',
		'opened',
		'figure-click',
		'update:active',
		'update:name',
		'update:nameEditable',
		'update:open',
		'update:starred',
		'submit-name',
		'dismiss-editing',
	],

	setup() {
		return {
			uid: GenRandomId(),
			isMobile: useIsSmallMobile(),
		}
	},

	data() {
		return {
			changeNameTranslated: t('Change name'),
			closeTranslated: t('Close sidebar'),
			favoriteTranslated: t('Favorite'),
			isStarred: this.starred,
			focusTrap: null,
			elementToReturnFocus: null,
		}
	},

	computed: {
		canStar() {
			return this.isStarred !== null
		},
		hasFigure() {
			return this.$slots.header || this.background
		},
		hasFigureClickListener() {
			return this.$listeners['figure-click']
		},
	},

	watch: {
		starred() {
			this.isStarred = this.starred
		},

		isMobile() {
			this.toggleFocusTrap()
		},

		open() {
			this.checkToggleButtonContainerAvailability()
		},
	},

	created() {
		this.preserveElementToReturnFocus()

		this.checkToggleButtonContainerAvailability()
	},

	beforeDestroy() {
		// Make sure that the 'closed' event is dispatched even if this element is destroyed before the 'after-leave' event is received.
		this.$emit('closed')
		this.focusTrap?.deactivate()
	},

	methods: {
		t,

		preserveElementToReturnFocus() {
			// Save the element that had focus before the sidebar was opened to return back on close
			if (document.activeElement && document.activeElement !== document.body) {
				this.elementToReturnFocus = document.activeElement

				// Special case for menus (NcActions)
				// If a sidebar was opened from a menu item, we want to return focus to the menu trigger instead of the item
				if (this.elementToReturnFocus.getAttribute('role') === 'menuitem') {
					const menu = this.elementToReturnFocus.closest('[role="menu"]')
					if (menu) {
						const menuTrigger = document.querySelector(`[aria-controls="${menu.id}"]`)
						this.elementToReturnFocus = menuTrigger
					}
				}
			}
		},

		initFocusTrap() {
			if (this.focusTrap) {
				return
			}

			this.focusTrap = createFocusTrap([
				// The sidebar itself
				this.$refs.sidebar,
				// Nextcloud Server header navigarion
				document.querySelector('#header'),
			], {
				allowOutsideClick: true,
				fallbackFocus: this.$refs.closeButton,
				trapStack: getTrapStack(),
				escapeDeactivates: false,
			})
		},

		/**
		 * Activate focus trap if it is currently needed, otherwise deactivate
		 */
		toggleFocusTrap() {
			if (this.open && this.isMobile) {
				this.initFocusTrap()
				this.focusTrap.activate()
			} else {
				this.focusTrap?.deactivate()
			}
		},

		/**
		 * Close the sidebar on pressing the escape key on mobile
		 *
		 * @param {KeyboardEvent} event key down event
		 */
		onKeydownEsc(event) {
			if (this.isMobile) {
				event.stopPropagation()
				this.closeSidebar()
			}
		},

		onBeforeEnter(element) {
			/**
			 * The sidebar is opening and the transition is in progress
			 *
			 * @type {HTMLElement}
			 * @deprecated
			 */
			this.$emit('opening', element)
		},
		onAfterEnter(element) {
			// Focus sidebar on open only if it was opened by a user interaction
			if (this.elementToReturnFocus) {
				this.focus()
			}

			this.toggleFocusTrap()

			/**
			 * The sidebar is opened and the transition is complete
			 *
			 * @type {HTMLElement}
			 */
			this.$emit('opened', element)
		},
		onBeforeLeave(element) {
			/**
			 * The sidebar is closing and the transition is in progress
			 *
			 * @type {HTMLElement}
			 * @deprecated
			 */
			this.$emit('closing', element)
		},
		onAfterLeave(element) {
			/**
			 * The sidebar is closed and the transition is complete
			 *
			 * @type {HTMLElement}
			 */
			this.$emit('closed', element)

			this.toggleFocusTrap()

			// Return focus to the element that had focus before the sidebar was opened
			this.elementToReturnFocus?.focus({ focusVisible: true })
			this.elementToReturnFocus = null
		},

		/**
		 * Used to tell parent component the user asked to close the sidebar
		 *
		 * @param {Event} e close icon click event
		 */
		closeSidebar(e) {
			/**
			 * The user clicked to closed the sidebar
			 *
			 * @type {Event}
			 */
			this.$emit('close', e)
			/**
			 * Current open state emitted after the transitions are finished
			 * @type {boolean}
			 */
			this.$emit('update:open', false)
		},

		/**
		 * Emit figure click event to parent component
		 *
		 * @param {Event} e click event
		 */
		onFigureClick(e) {
			/**
			 * The figure/background header has been clicked
			 *
			 * @type {Event}
			 */
			this.$emit('figure-click', e)
		},

		/**
		 * Toggle the favourite state
		 * and emit to the parent component
		 */
		toggleStarred() {
			this.isStarred = !this.isStarred
			/**
			 * Emitted when the starred value changes
			 *
			 * @type {boolean}
			 */
			this.$emit('update:starred', this.isStarred)
		},

		editName() {
			/**
			 * Emitted when the nameEditable value changes
			 *
			 * @type {boolean}
			 */
			this.$emit('update:nameEditable', true)
			// Focus the name input
			if (this.nameEditable) {
				this.$nextTick(
					() => this.$refs.nameInput.focus(),
				)
			}
		},

		/**
		 * Focus the sidebar
		 * @public
		 */
		focus() {
			this.$refs.header.focus()
		},

		/**
		 * Focus the active tab
		 * @public
		 */
		focusActiveTabContent() {
			// If a tab is focused then probably a new trigger element moved the focus to the sidebar
			this.preserveElementToReturnFocus()

			this.$refs.tabs.focusActiveTabContent()
		},

		/**
		 * Check if the toggle button container is available
		 */
		checkToggleButtonContainerAvailability() {
			// Toggle button must be rendered, but there is no element to teleport it to
			if (this.open === false && !this.noToggle && !this.ncContentSelector) {
				console.warn(
					'[NcAppSidebar] It looks like you want to use NcAppSidebar with the built-in toggle button. '
					+ 'This feature is only available when NcAppSidebar is used in NcContent.',
				)
			}
		},

		/**
		 * Emit name change event to parent component
		 *
		 * @param {Event} event input event
		 */
		onNameInput(event) {
			/**
			 * Emitted when the name value changes
			 *
			 * @type {string|Date}
			 */
			this.$emit('update:name', event.target.value)
		},

		/**
		 * Emit when the name form edit confirm button is pressed in order
		 * to change the name.
		 *
		 * @param {Event} event submit event
		 */
		onSubmitName(event) {
			// Disable editing
			this.$emit('update:nameEditable', false)
			/**
			 * Emitted when the name edit input has been submitted
			 *
			 * @type {Event}
			 */
			this.$emit('submit-name', event)
		},
		onDismissEditing() {
			// Disable editing
			this.$emit('update:nameEditable', false)
			/**
			 * Emitted when the name edit has been cancelled
			 *
			 * @type {Event}
			 */
			this.$emit('dismiss-editing')
		},
		onUpdateActive(activeTab) {
			/**
			 * The active tab changed
			 *
			 * @type {string}
			 */
			this.$emit('update:active', activeTab)
		},
	},
}
</script>

<style lang="scss">
// Allows to use transition over a custom CSS property (CSS Variable)
// Ignored on old browsers resulting in slightly noticeable jump
@property --app-sidebar-offset {
  syntax: '<length>';
  initial-value: 0;
  inherits: true;
}

.content {
	/**
	 * The padding between the toggle button and the page border
	 */
	--app-sidebar-padding: calc(var(--default-grid-baseline, 4px) * 2);
	/**
	 * The minimal offset width required to be reserved for the toggle button.
	 * Automatically changes to 0 when there is no toggle button.
	 */
	--app-sidebar-offset: 0;
	// Explicitly disable transition by default to enable it only when sidebar animation is active
	// !important to override styles from an older version, because it's global non-scoped styles
	transition: --app-sidebar-offset 0ms !important;
}

// When AppSidebar is animation is active - also apply transition for the toggle button offset
.content:has(.app-sidebar.slide-right-enter-active),
.content:has(.app-sidebar.slide-right-leave-active) {
	transition: --app-sidebar-offset var(--animation-quick);
}

.content:has(.app-sidebar__toggle) {
	--app-sidebar-offset: calc(var(--app-sidebar-padding) + var(--default-clickable-area));
}
</style>

<style lang="scss" scoped>
$desc-input-padding: 7px;

// name and subname
$desc-name-height: 30px;
$desc-subname-height: 22px;
$desc-height: $desc-name-height + $desc-subname-height;

/*
	Sidebar: to be used within #content
	app-content will be shrinked properly
*/
.app-sidebar {
	--app-sidebar-width: clamp(300px, 27vw, 500px);
	width: var(--app-sidebar-width);

	z-index: 1500;
	top: 0;
	right: 0;
	display: flex;
	overflow-x: hidden;
	overflow-y: auto;
	flex-direction: column;
	flex-shrink: 0;
	height: 100%;
	border-left: 1px solid var(--color-border);
	background: var(--color-main-background);
	// Make close button positioned relative to the header
	position: relative;

	&__toggle {
		position: absolute !important;
		inset-block-start: var(--app-sidebar-padding);
		inset-inline-end: var(--app-sidebar-padding);
		// app-content has z-index 1000 so we need 1001
		z-index: 1001;
	}

	.app-sidebar-header {
		> .app-sidebar__close {
			position: absolute;
			z-index: 100;
			top: var(--app-sidebar-padding);
			right: var(--app-sidebar-padding);
			width: var(--default-clickable-area);
			height: var(--default-clickable-area);
			opacity: $opacity_normal;
			border-radius: calc(var(--default-clickable-area) / 2);
			&:hover,
			&:active,
			&:focus {
				opacity: $opacity_full;
				background-color: $action-background-hover;
			}
		}

		// Compact mode only affects a sidebar with a figure
		&--compact.app-sidebar-header--with-figure {
			.app-sidebar-header__info {
				flex-direction: row;

				.app-sidebar-header__figure {
					--figure-size: calc($desc-height + var(--app-sidebar-padding));
					z-index: 2;
					width: var(--figure-size);
					height: var(--figure-size);
					margin: calc(var(--app-sidebar-padding) / 2);
					border-radius: 3px;
					flex: 0 0 auto;
				}
				.app-sidebar-header__desc {
					padding-left: 0;
					flex: 1 1 auto;
					min-width: 0;
					padding-right: calc(2 * var(--default-clickable-area) + var(--app-sidebar-padding));
					padding-top: var(--app-sidebar-padding);

					&.app-sidebar-header__desc--without-actions {
						padding-right: calc(var(--default-clickable-area) + var(--app-sidebar-padding));
					}

					.app-sidebar-header__tertiary-actions {
						z-index: 3; // above star
						position: absolute;
						top: calc(var(--app-sidebar-padding) / 2);
						left: calc(-1 * var(--default-clickable-area));
						gap: 0; // override gap
					}
					.app-sidebar-header__menu {
						top: var(--app-sidebar-padding);
						right: calc(var(--default-clickable-area) + var(--app-sidebar-padding)); // left of the close button
						position: absolute;
					}
				}
			}
		}

		// sidebar without figure
		&:not(.app-sidebar-header--with-figure) {
			// align the menu with the close button
			.app-sidebar-header__menu {
				position: absolute;
				top: var(--app-sidebar-padding);
				right: calc(var(--app-sidebar-padding) + var(--default-clickable-area));
			}
			// increase the padding to not overlap the menu
			.app-sidebar-header__desc {
				padding-right: calc(var(--default-clickable-area) * 2 + var(--app-sidebar-padding));

				&.app-sidebar-header__desc--without-actions {
					padding-right: calc(var(--default-clickable-area) + var(--app-sidebar-padding));
				}
			}
		}

		// the container with the figure and the description
		.app-sidebar-header__info {
			display: flex;
			flex-direction: column;
		}

		// header background
		&__figure {
			width: 100%;
			height: 250px;
			max-height: 250px;
			background-repeat: no-repeat;
			background-position: center;
			background-size: contain;
			&--with-action {
				cursor: pointer;
			}
		}

		// description
		&__desc {
			position: relative;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding-inline: var(--app-sidebar-padding);
			padding-block: var(--app-sidebar-padding) calc(var(--app-sidebar-padding) / 2);
			gap: 0 4px;

			// custom overrides
			&--with-tertiary-action {
				padding-left: 6px;
			}

			&--editable .app-sidebar-header__mainname-form,
			&--with-subname--editable .app-sidebar-header__mainname-form {
				margin-top: -2px;
				margin-bottom: -2px;
			}

			&--with-subname--editable .app-sidebar-header__subname {
				margin-top: -2px;
			}

			.app-sidebar-header__tertiary-actions {
				display: flex;
				height: var(--default-clickable-area);
				width: var(--default-clickable-area);
				justify-content: center;
				flex: 0 0 auto;

				.app-sidebar-header__star {
					// Override default Button component styles
					box-shadow: none;
					&:not([aria-pressed='true']):hover {
						box-shadow: none;
						background-color: var(--color-background-hover);
					}
				}
			}

			// names
			.app-sidebar-header__name-container {
				flex: 1 1 auto;
				display: flex;
				flex-direction: column;
				justify-content: center;
				min-width: 0;

				.app-sidebar-header__mainname-container {
					display: flex;
					align-items: center;
					min-height: var(--default-clickable-area);

					// main name
					.app-sidebar-header__mainname {
						padding: 0;
						min-height: 30px;
						font-size: 20px;
						line-height: $desc-name-height;

						// Needs 'deep' as the link is generated by the linkify directive
						&:deep(.linkified) {
							cursor: pointer;
							text-decoration: underline;
							margin: 0;
						}
					}

					.app-sidebar-header__mainname-form {
						display: flex;
						flex: 1 1 auto;
						align-items: center;

						input.app-sidebar-header__mainname-input {
							flex: 1 1 auto;
							margin: 0;
							padding: $desc-input-padding;
							font-size: 20px;
							font-weight: bold;
						}
					}

					// main menu
					.app-sidebar-header__menu {
						margin-left: 5px;
					}
				}

				// shared between main and subname
				.app-sidebar-header__mainname,
				.app-sidebar-header__subname {
					overflow: hidden;
					width: 100%;
					margin: 0;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				// subname
				.app-sidebar-header__subname {
					color: var(--color-text-maxcontrast);
					font-size: var(--default-font-size);
					padding: 0;

					* {
						vertical-align: text-bottom;
					}
				}
			}
		}

		// sidebar description slot
		&__description {
			display: flex;
			align-items: center;
			margin: 0 10px;
		}
	}
}

// Make the sidebar full-width on small screens
@media only screen and (max-width: $breakpoint-small-mobile) {
	.app-sidebar {
		position: absolute;
		--app-sidebar-width: 100vw;
	}
}

.slide-right-leave-active,
.slide-right-enter-active {
	transition-duration: var(--animation-quick);
	transition-property: margin-right;
}

.slide-right-enter-to,
.slide-right-leave {
	margin-right: 0;
}

.slide-right-enter,
.slide-right-leave-to {
	margin-right: calc(-1 * var(--app-sidebar-width));
}
</style>

<style lang="scss">
// ! slots specific designs, cannot be scoped
// if any button inside the description slot, increase visual padding
.app-sidebar-header__description {
	button, .button,
	input[type='button'],
	input[type='submit'],
	input[type='reset'] {
		padding: 6px 22px;
	}
}

</style>
