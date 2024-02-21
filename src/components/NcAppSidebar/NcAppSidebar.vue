<!--
  - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<docs>
### General description

This component provides a way to include the standardised sidebar.
The standard properties like name, subname, starred, etc. allow to automatically
include a standard-header like it's used by the files app.

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
	import Magnify from 'vue-material-design-icons/Magnify'
	import Cog from 'vue-material-design-icons/Cog'
	import ShareVariant from 'vue-material-design-icons/ShareVariant'

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
		<NcAppSidebar
			name="cat-picture.jpg"
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
import Cog from 'vue-material-design-icons/Cog'

export default {
	components: {
		Cog,
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
import Magnify from 'vue-material-design-icons/Magnify'
import Cog from 'vue-material-design-icons/Cog'
import ShareVariant from 'vue-material-design-icons/ShareVariant'

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
import Magnify from 'vue-material-design-icons/Magnify'
import Cog from 'vue-material-design-icons/Cog'
import ShareVariant from 'vue-material-design-icons/ShareVariant'

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
import Magnify from 'vue-material-design-icons/Magnify'
import Cog from 'vue-material-design-icons/Cog'
import ShareVariant from 'vue-material-design-icons/ShareVariant'

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
	import Magnify from 'vue-material-design-icons/Magnify'

	export default {
		components: {
			Magnify,
		},
	}
	</script>
```
</docs>

<template>
	<transition appear
		name="slide-right"
		@before-enter="onBeforeEnter"
		@after-enter="onAfterEnter"
		@before-leave="onBeforeLeave"
		@after-leave="onAfterLeave">
		<aside id="app-sidebar-vue"
			ref="sidebar"
			class="app-sidebar"
			:aria-labelledby="`app-sidebar-vue-${uid}__header`"
			@keydown.esc.stop="isMobile && closeSidebar()">
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
import NcAppSidebarTabs from './NcAppSidebarTabs.vue'
import NcActions from '../NcActions/index.js'
import NcLoadingIcon from '../NcLoadingIcon/index.js'
import NcButton from '../NcButton/index.js'
import NcEmptyContent from '../NcEmptyContent/index.js'
import Focus from '../../directives/Focus/index.js'
import Linkify from '../../directives/Linkify/index.js'
import Tooltip from '../../directives/Tooltip/index.js'
import { useIsSmallMobile } from '../../composables/useIsMobile/index.js'
import GenRandomId from '../../utils/GenRandomId.js'
import { getTrapStack } from '../../utils/focusTrap.js'
import { t } from '../../l10n.js'

import ArrowRight from 'vue-material-design-icons/ArrowRight.vue'
import Close from 'vue-material-design-icons/Close.vue'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'

import { vOnClickOutside as ClickOutside } from '@vueuse/components'
import { createFocusTrap } from 'focus-trap'

export default {
	name: 'NcAppSidebar',

	components: {
		NcActions,
		NcAppSidebarTabs,
		ArrowRight,
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
		Tooltip,
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
	},

	emits: [
		'close',
		'closing',
		'closed',
		'opening',
		'opened',
		'figure-click',
		'update:starred',
		'update:nameEditable',
		'update:name',
		'update:active',
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
	},

	created() {
		this.preserveElementToReturnFocus()
	},

	mounted() {
		// Focus sidebar on open only if it was opened by a user interaction
		if (this.elementToReturnFocus) {
			this.focus()
		}

		this.toggleFocusTrap()
	},

	beforeDestroy() {
		// Make sure that the 'closed' event is dispatched even if this element is destroyed before the 'after-leave' event is received.
		this.$emit('closed')
		this.focusTrap?.deactivate()
	},

	methods: {
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
				// The app navigation toggle. Navigation can be opened above the sidebar
				// Take the parent element, because the focus-trap requires a container with elements, not the element itself
				document.querySelector('[aria-controls="app-navigation-vue"]')?.parentElement,
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
			if (this.isMobile) {
				this.initFocusTrap()
				this.focusTrap.activate()
			} else {
				this.focusTrap?.deactivate()
			}
		},

		onBeforeEnter(element) {
			/**
			 * The sidebar is opening and the transition is in progress
			 *
			 * @type {HTMLElement}
			 */
			this.$emit('opening', element)
		},
		onAfterEnter(element) {
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
<style lang="scss" scoped>
$sidebar-min-width: 300px;
$sidebar-max-width: 500px;

$desc-vertical-padding: 18px;
$desc-vertical-padding-compact: 10px;
$desc-input-padding: 7px;

// name and subname
$desc-name-height: 30px;
$desc-subname-height: 22px;
$desc-height: $desc-name-height + $desc-subname-height;

$top-buttons-spacing: 6px;

/*
	Sidebar: to be used within #content
	app-content will be shrinked properly
*/
.app-sidebar {
	z-index: 1500;
	top: 0;
	right: 0;
	display: flex;
	overflow-x: hidden;
	overflow-y: auto;
	flex-direction: column;
	flex-shrink: 0;
	width: 27vw;
	min-width: $sidebar-min-width;
	max-width: $sidebar-max-width;
	height: 100%;
	border-left: 1px solid var(--color-border);
	background: var(--color-main-background);

	.app-sidebar-header {
		> .app-sidebar__close {
			position: absolute;
			z-index: 100;
			top: $top-buttons-spacing;
			right: $top-buttons-spacing;
			width: $clickable-area;
			height: $clickable-area;
			opacity: $opacity_normal;
			border-radius: math.div($clickable-area, 2);
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
					z-index: 2;
					width: $desc-height + $desc-vertical-padding;
					height: $desc-height + $desc-vertical-padding;
					margin: math.div($desc-vertical-padding, 2);
					border-radius: 3px;
					flex: 0 0 auto;
				}
				.app-sidebar-header__desc {
					padding-left: 0;
					flex: 1 1 auto;
					min-width: 0;
					padding-right: 2 * $clickable-area + $top-buttons-spacing;
					padding-top: $desc-vertical-padding-compact;

					&.app-sidebar-header__desc--without-actions {
						padding-right: #{$clickable-area + $top-buttons-spacing};
					}

					.app-sidebar-header__tertiary-actions {
						z-index: 3; // above star
						position: absolute;
						top: math.div($desc-vertical-padding, 2);
						left: -1 * $clickable-area;
						gap: 0; // override gap
					}
					.app-sidebar-header__menu {
						top: $top-buttons-spacing;
						right: $clickable-area + $top-buttons-spacing; // left of the close button
						background-color: transparent;
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
				top: $top-buttons-spacing;
				right: $top-buttons-spacing + $clickable-area;
			}
			// increase the padding to not overlap the menu
			.app-sidebar-header__desc {
				padding-right: #{$clickable-area * 2 + $top-buttons-spacing};

				&.app-sidebar-header__desc--without-actions {
					padding-right: #{$clickable-area + $top-buttons-spacing};
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
			padding: #{$desc-vertical-padding} #{$top-buttons-spacing} #{$desc-vertical-padding} #{math.div($desc-vertical-padding, 2)};
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
				height: $clickable-area;
				width: $clickable-area;
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
					min-height: $clickable-area;

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
						height: $clickable-area;
						width: $clickable-area;
						border-radius: math.div($clickable-area, 2);
						background-color: $action-background-hover;
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
		width: 100vw;
		max-width: 100vw;
	}
}

.slide-right-leave-active,
.slide-right-enter-active {
	transition-duration: var(--animation-quick);
	transition-property: max-width, min-width;
}

.slide-right-enter-to,
.slide-right-leave {
	min-width: $sidebar-min-width;
	max-width: $sidebar-max-width;
}

.slide-right-enter,
.slide-right-leave-to {
	min-width: 0 !important;
	max-width: 0 !important;
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
