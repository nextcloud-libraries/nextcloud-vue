<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description

This component renders a breadcrumb bar. It adjusts to the available width
by hiding breadcrumbs in a dropdown menu and emits an event when something
is dropped on a creadcrumb.

### Usage

```vue
<template>
	<div>
		<div class="container" @click.capture="stayOnPage">
			<NcBreadcrumbs @dropped="dropped">
				<NcBreadcrumb name="Home"
					title="Title of the Home folder"
					href="/"
					@dropped="droppedOnCrumb">
					<template #icon>
						<Folder :size="20" />
					</template>
				</NcBreadcrumb>
				<NcBreadcrumb name="Folder 1"
					title="Folder 1"
					href="/Folder 1" />
				<NcBreadcrumb name="Folder 2"
					href="/Folder 1/Folder 2"
					:disable-drop="true" />
				<NcBreadcrumb name="Folder 3"
					title="Folder 3"
					href="/Folder 1/Folder 2/Folder 3" />
				<NcBreadcrumb name="Folder 4"
					title="Folder 4"
					href="/Folder 1/Folder 2/Folder 3/Folder 4" />
				<NcBreadcrumb name="Folder 5 with an overflowing long name"
					title="Folder 5"
					href="/Folder 1/Folder 2/Folder 3/Folder 4/Folder 5"
					:disable-drop="true">
					<template #menu-icon>
						<MenuDown :size="20" />
					</template>
					<NcActionButton @click="alert('Share')">
						<template #icon>
							<ShareVariant :size="20" />
						</template>
						Share
					</NcActionButton>
					<NcActionButton @click="alert('Download')">
						<template #icon>
							<Download :size="20" />
						</template>
						Download
					</NcActionButton>
				</NcBreadcrumb>
				<template #actions>
					<NcButton>
						<template #icon>
							<Plus :size="20" />
						</template>
						New
					</NcButton>
				</template>
			</NcBreadcrumbs>
		</div>
		<div class="drag-area">
			<div class="dragme" draggable="true" @dragstart="dragStart">
				<DragVertical :size="20" />
				<span>Drag me onto a folder</span>
			</div>
			<p class="drop-result" aria-live="polite">
				{{ lastDrop }}
				<template v-if="droppedOnHome">
					<br>The Home crumb handled the drop itself as well.
				</template>
			</p>
		</div>
	</div>
</template>

<script>
import Download from 'vue-material-design-icons/Download'
import DragVertical from 'vue-material-design-icons/DragVertical'
import Folder from 'vue-material-design-icons/Folder'
import MenuDown from 'vue-material-design-icons/MenuDown'
import Plus from 'vue-material-design-icons/Plus'
import ShareVariant from 'vue-material-design-icons/ShareVariant'

export default {
	components: {
		Download,
		DragVertical,
		Folder,
		MenuDown,
		Plus,
		ShareVariant,
	},
	data() {
		return {
			lastDrop: 'Not dropped yet. Folder 2 and Folder 5 do not accept drops.',
			droppedOnHome: false,
		}
	},
	methods: {
		dropped(e, path) {
			this.lastDrop = 'Dropped on ' + path
		},
		droppedOnCrumb(e, path) {
			this.droppedOnHome = true
		},
		dragStart(e) {
			e.dataTransfer.setData('text/plain', 'dragging')
			this.lastDrop = 'Not dropped yet. Folder 2 and Folder 5 do not accept drops.'
			this.droppedOnHome = false
		},
		// The example only shows the breadcrumbs, so their links do not leave the page
		stayOnPage(e) {
			if (e.target.closest('a')) {
				e.preventDefault()
			}
		},
	}
}
</script>
<style>
.container {
	display: inline-flex;
	width: 100%;
}

.drag-area {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 12px;
	margin-top: 12px;
}

.dragme {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	height: var(--default-clickable-area);
	padding: 0 12px 0 8px;
	border: 2px dashed var(--color-border-maxcontrast);
	border-radius: var(--border-radius-element);
	background-color: var(--color-background-hover);
	white-space: nowrap;
	cursor: grab;
}

.drop-result {
	margin: 0;
	color: var(--color-text-maxcontrast);
}
</style>
```

### Breadcrumbs as data

Instead of `NcBreadcrumb` components, the trail can be passed as an array in `crumbs`, root first. Each crumb has a `name`, and a `to` for vue-router or an `href` to link to, an optional `title`, an optional `iconPath`, for example one from `@mdi/js`, and `disableDrop` to not accept drops on it. Like the `icon` slot of `NcBreadcrumb`, an icon is shown instead of the name, and the name becomes its accessible label. The first crumb gets the `root-icon` the same way, unless it has an `iconPath`. The last crumb is the current location and is marked with `aria-current="page"`. Give it its link as well: it then stays a link, as the breadcrumb pattern asks, keeps the keyboard focus when a click on a crumb makes that one the last, and reports its link when something is dropped on it. When `crumbs` is set, the `NcBreadcrumb` components in the default slot are not used.

A click on a crumb emits `crumbClick` with the crumb, its index and the click event, for an app that navigates without vue-router. Call `preventDefault()` on the event to stop the link from being followed, with `href` and with `to`. In the example below, a click on a crumb goes up to that folder, and the buttons go back down.

```vue
<template>
	<div>
		<NcBreadcrumbs :crumbs="crumbs" @crumb-click="goUp" />
		<div v-if="deeper.length > 0" class="deeper">
			<NcButton
				v-for="(name, index) in deeper"
				:key="name"
				size="small"
				variant="tertiary"
				@click="depth += index + 1">
				Go to {{ name }}
			</NcButton>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			trail: ['Home', 'Team vault', 'Secrets', 'Production'],
			depth: 3,
		}
	},

	computed: {
		crumbs() {
			return this.trail.slice(0, this.depth + 1).map((name) => ({ name, href: '#' }))
		},

		deeper() {
			return this.trail.slice(this.depth + 1)
		},
	},

	methods: {
		goUp(crumb, index, event) {
			// Stay on this page: the example only shows the trail
			event.preventDefault()
			this.depth = index
		},
	},
}
</script>

<style scoped>
.deeper {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	margin-top: 8px;
}
</style>
```
</docs>

<script>
import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import debounce from 'debounce'
import { cloneVNode, Fragment, h } from 'vue'
import IconFolder from 'vue-material-design-icons/Folder.vue'
import { isSlotPopulated } from '../../utils/isSlotPopulated.ts'
import NcActionButton from '../NcActionButton/index.js'
import NcActionLink from '../NcActionLink/index.js'
import NcActionRouter from '../NcActionRouter/index.js'
import NcActions from '../NcActions/index.js'
import NcBreadcrumb from '../NcBreadcrumb/index.js'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'

const crumbClass = 'vue-crumb'

export default {
	name: 'NcBreadcrumbs',
	components: {
		NcActions,
		NcActionButton,
		NcActionRouter,
		NcActionLink,
		NcBreadcrumb,
		IconFolder,
	},

	props: {
		/**
		 * Set a css icon-class for the icon of the root breadcrumb to be used.
		 */
		rootIcon: {
			type: String,
			default: 'icon-home',
		},

		/**
		 * Set the aria-label of the nav element.
		 */
		ariaLabel: {
			type: String,
			default: null,
		},

		/**
		 * The breadcrumbs as data instead of `NcBreadcrumb` components, root first.
		 * An `iconPath` is shown instead of the name, like the `icon` slot of `NcBreadcrumb`.
		 * The last crumb is the current location and gets `aria-current="page"`.
		 * When set, the `NcBreadcrumb` components in the default slot are not used.
		 *
		 * @type {Array<{name: string, to?: string|object, href?: string, title?: string, iconPath?: string, disableDrop?: boolean}>}
		 * @since 9.15.0
		 */
		crumbs: {
			type: Array,
			default: () => [],
		},
	},

	emits: ['dropped', 'crumbClick'],
	data() {
		return {
			/**
			 * Array to track the hidden breadcrumbs by their index.
			 * Comparing two crumbs somehow does not work, so we use the indices.
			 */
			hiddenIndices: [],

			/**
			 * This is the props of the middle Action menu
			 * that show the ellipsised breadcrumbs
			 */
			menuBreadcrumbProps: {
				// Don't show a name for this breadcrumb, only the Actions menu
				name: '',
				forceMenu: true,
				// Don't allow dropping directly on the actions breadcrumb
				disableDrop: true,
				// Is the menu open or not
				open: false,
			},

			breadcrumbsRefs: [],
		}
	},

	created() {
		/**
		 * Add a listener so the component reacts on resize
		 */
		window.addEventListener('resize', debounce(() => {
			this.handleWindowResize()
		}, 100))
		subscribe('navigation-toggled', this.delayedResize)
	},

	mounted() {
		this.handleWindowResize()
	},

	updated() {
		/**
		 * Check the size on update
		 */
		this.delayedResize()
		/**
		 * Check that crumbs to hide are hidden
		 */
		this.$nextTick(() => {
			this.hideCrumbs()
		})
	},

	beforeUnmount() {
		window.removeEventListener('resize', this.handleWindowResize)
		unsubscribe('navigation-toggled', this.delayedResize)
	},

	methods: {
		/**
		 * Close the actions menu
		 *
		 * @param {object} e The event
		 */
		closeActions(e) {
			// Don't do anything if we leave towards a child element.
			if (this.$refs.actionsBreadcrumb.$el.contains(e.relatedTarget)) {
				return
			}
			this.menuBreadcrumbProps.open = false
		},

		/**
		 * Call the resize function after a delay
		 */
		async delayedResize() {
			await this.$nextTick()
			this.handleWindowResize()
		},

		/**
		 * Check the width of the breadcrumb and hide breadcrumbs
		 * if we overflow otherwise.
		 */
		handleWindowResize() {
			// If there is no container yet, we cannot determine its size
			if (!this.$refs.container) {
				return
			}

			const nrCrumbs = this.breadcrumbsRefs.length
			const hiddenIndices = []
			const availableWidth = this.$refs.container.offsetWidth
			let totalWidth = this.getTotalWidth()
			// If we have breadcrumbs actions, we have to take their width into account too.
			if (this.$refs.breadcrumb__actions) {
				totalWidth += this.$refs.breadcrumb__actions.offsetWidth
			}
			let overflow = totalWidth - availableWidth
			// If we overflow, we have to take the action-item width into account as well.
			overflow += (overflow > 0) ? 64 : 0
			let i = 0
			// We start hiding the breadcrumb in the center
			const startIndex = Math.floor(nrCrumbs / 2)
			// Don't hide the first and last breadcrumb
			while (overflow > 0 && i < nrCrumbs - 2) {
				// We hide elements alternating to the left and right
				const currentIndex = startIndex + ((i % 2) ? i + 1 : i) / 2 * Math.pow(-1, i + (nrCrumbs % 2))
				// Calculate the remaining overflow width after hiding this breadcrumb
				overflow -= this.getWidth(this.breadcrumbsRefs[currentIndex]?.$el, currentIndex === (this.breadcrumbsRefs.length - 1))
				hiddenIndices.push(currentIndex)
				i++
			}
			// We only update the hidden crumbs if they have changed,
			// otherwise we will run into an infinite update loop.
			if (!this.arraysEqual(this.hiddenIndices, hiddenIndices.sort((a, b) => a - b))) {
				this.hiddenIndices = hiddenIndices
			}
		},

		/**
		 * Checks if two arrays are equal.
		 * Only works for primitive arrays, but that's enough here.
		 *
		 * @param {Array} a The first array
		 * @param {Array} b The second array
		 * @return {boolean} Wether the arrays are equal
		 */
		arraysEqual(a, b) {
			if (a.length !== b.length) {
				return false
			} else if (a === b) {
				return true
			} else if (a === null || b === null) {
				return false
			}

			for (let i = 0; i < a.length; ++i) {
				if (a[i] !== b[i]) {
					return false
				}
			}
			return true
		},

		/**
		 * Calculates the total width of all breadcrumbs
		 *
		 * @return {number} The total width
		 */
		getTotalWidth() {
			return this.breadcrumbsRefs.reduce((width, crumb, index) => width + this.getWidth(crumb.$el, index === (this.breadcrumbsRefs.length - 1)), 0)
		},

		/**
		 * Calculates the width of the provided element
		 *
		 * @param {object} el The element
		 * @param {boolean} isLast Is this the last crumb
		 * @return {number} The width
		 */
		getWidth(el, isLast) {
			if (!el?.classList) {
				return 0
			}

			const hide = el.classList.contains(`${crumbClass}--hidden`)
			el.style.minWidth = 'auto'
			// For the last crumb, we calculate with a max-width of 210px,
			// but don't set it in CSS to allow it to grow.
			if (isLast) {
				el.style.maxWidth = '210px'
			}
			el.classList.remove(`${crumbClass}--hidden`)
			const w = el.offsetWidth
			if (hide) {
				el.classList.add(`${crumbClass}--hidden`)
			}
			el.style.minWidth = ''
			el.style.maxWidth = ''
			return w
		},

		/**
		 * Prevents the default of a provided event
		 *
		 * @param {object} e The event
		 * @return {boolean}
		 */
		preventDefault(e) {
			if (e.preventDefault) {
				e.preventDefault()
			}
			return false
		},

		/**
		 * Handles the drag start.
		 * Prevents a breadcrumb from being draggable.
		 *
		 * @param {object} e The event
		 * @return {boolean}
		 */
		dragStart(e) {
			return this.preventDefault(e)
		},

		/**
		 * Handles when something is dropped on the breadcrumb.
		 *
		 * @param {object} e The drop event
		 * @param {string} path The path of the breadcrumb
		 * @param {boolean} disabled Whether dropping is disabled for this breadcrumb
		 * @return {boolean}
		 */
		dropped(e, path, disabled) {
			/**
			 * Don't emit if dropping is disabled.
			 */
			if (!disabled) {
				/**
				 * Event emitted when something is dropped on the breadcrumb.
				 *
				 * @param {Event} e the drop DOM event
				 * @param {string} path The path of the breadcrumb
				 */
				this.$emit('dropped', e, path)
			}
			// Close the actions menu after the drop
			this.menuBreadcrumbProps.open = false

			// Remove all hovering classes
			const crumbs = document.querySelectorAll(`.${crumbClass}`)
			for (const crumb of crumbs) {
				crumb.classList.remove(`${crumbClass}--hovered`)
			}
			return this.preventDefault(e)
		},

		/**
		 * Handles the drag over event
		 *
		 * @param {object} e The drag over event
		 * @return {boolean}
		 */
		dragOver(e) {
			return this.preventDefault(e)
		},

		/**
		 * Handles the drag enter event
		 *
		 * @param {object} e The drag over event
		 * @param {boolean} disabled Whether dropping is disabled for this breadcrumb
		 */
		dragEnter(e, disabled) {
			/**
			 * Don't do anything if dropping is disabled.
			 */
			if (disabled) {
				return
			}
			// Get the correct element, in case we hover a child.
			if (e.target.closest) {
				const target = e.target.closest(`.${crumbClass}`)
				if (target.classList && target.classList.contains(crumbClass)) {
					const crumbs = document.querySelectorAll(`.${crumbClass}`)
					for (const crumb of crumbs) {
						crumb.classList.remove(`${crumbClass}--hovered`)
					}
					target.classList.add(`${crumbClass}--hovered`)
				}
			}
		},

		/**
		 * Handles the drag leave event
		 *
		 * @param {object} e The drag leave event
		 * @param {boolean} disabled Whether dropping is disabled for this breadcrumb
		 */
		dragLeave(e, disabled) {
			/**
			 * Don't do anything if dropping is disabled.
			 */
			if (disabled) {
				return
			}
			// Don't do anything if we leave towards a child element.
			if (e.target.contains(e.relatedTarget)) {
				return
			}
			// Get the correct element, in case we leave directly from a child.
			if (e.target.closest) {
				const target = e.target.closest(`.${crumbClass}`)
				if (target.contains(e.relatedTarget)) {
					return
				}
				if (target.classList && target.classList.contains(crumbClass)) {
					target.classList.remove(`${crumbClass}--hovered`)
				}
			}
		},

		/**
		 * Check for each crumb if we have to hide it and
		 * add it to the array of all crumbs.
		 */
		hideCrumbs() {
			this.breadcrumbsRefs.forEach((crumb, i) => {
				if (crumb?.$el?.classList) {
					if (this.hiddenIndices.includes(i)) {
						crumb.$el.classList.add(`${crumbClass}--hidden`)
					} else {
						crumb.$el.classList.remove(`${crumbClass}--hidden`)
					}
				}
			})
		},

		isBreadcrumb(vnode) {
			return vnode?.type?.name === 'NcBreadcrumb'
		},

		/**
		 * Create the NcBreadcrumb components for the `crumbs` prop.
		 * The last crumb is the current location, still linked like the others.
		 *
		 * @return {Array} The created VNodes
		 */
		crumbsFromProp() {
			return this.crumbs.map((crumb, index) => {
				const isCurrent = index === this.crumbs.length - 1
				return h(NcBreadcrumb, {
					key: `crumb-${index}`,
					name: crumb.name,
					title: crumb.title ?? null,
					to: crumb.to,
					href: crumb.href,
					disableDrop: crumb.disableDrop ?? false,
					'aria-current': isCurrent ? 'page' : undefined,
					// Capture, so the listener runs before a RouterLink starts to navigate
					// and preventDefault() can still stop it
					onClickCapture: (event) => {
						/**
						 * A crumb of the `crumbs` prop was clicked.
						 * Call `preventDefault()` on the event to stop its link from being followed.
						 *
						 * @param {object} crumb The clicked crumb
						 * @param {number} index Its index in `crumbs`
						 * @param {MouseEvent} event The click event
						 * @since 9.15.0
						 */
						this.$emit('crumbClick', crumb, index, event)
					},
				}, crumb.iconPath ? { icon: () => h(NcIconSvgWrapper, { path: crumb.iconPath, size: 20 }) } : undefined)
			})
		},
	},

	/**
	 * The render function to display the component
	 *
	 * @return {object|undefined} The created VNode
	 */
	render() {
		// Get the breadcrumbs, from the crumbs prop or else from the slot
		let breadcrumbs = this.crumbs.length > 0 ? this.crumbsFromProp() : []
		// We have to iterate over all slot elements
		const slotNodes = this.crumbs.length > 0 ? [] : (this.$slots.default?.() ?? [])
		slotNodes.forEach((vnode) => {
			if (this.isBreadcrumb(vnode)) {
				breadcrumbs.push(vnode)
				return
			}
			// If we encounter a Fragment, we have to check its children too
			if (vnode?.type === Fragment) {
				vnode?.children?.forEach?.((child) => {
					if (this.isBreadcrumb(child)) {
						breadcrumbs.push(child)
					}
				})
			}
		})

		// Check that we have at least one breadcrumb
		if (breadcrumbs.length === 0) {
			return
		}

		// Add the root icon to the first breadcrumb
		breadcrumbs[0] = cloneVNode(breadcrumbs[0], {
			icon: this.rootIcon,
			ref: 'breadcrumbs',
		})

		/**
		 * Use a proxy object to store breadcrumbs refs
		 * and don't write to this.breadcrumbsRefs directly
		 * to not trigger a myriad of re-renders.
		 */
		const breadcrumbsRefs = []
		// Add the breadcrumbs to the array of the created VNodes, check if hiding them is necessary.
		breadcrumbs = breadcrumbs.map((crumb, index) => cloneVNode(crumb, {
			ref: (crumb) => {
				breadcrumbsRefs[index] = crumb
			},
		}))

		// The array of all created VNodes
		const crumbs = [...breadcrumbs]
		if (this.hiddenIndices.length) {
			/**
			 * We show the first half of the breadcrumbs before the Actions dropdown menu
			 * which shows the hidden breadcrumbs.
			 */
			crumbs.splice(
				Math.round(breadcrumbs.length / 2),
				0,

				// The Actions menu
				// Use a breadcrumb component for the hidden breadcrumbs

				h(NcBreadcrumb, {
					class: 'dropdown',
					...this.menuBreadcrumbProps,
					// Hide the dropdown menu from screen-readers,
					// since the crumbs in the menu are still in the list.
					'aria-hidden': true,
					// Add a ref to the Actions menu
					ref: 'actionsBreadcrumb',
					key: 'actions-breadcrumb-1',
					// Add handlers so the Actions menu opens on hover
					onDragenter: () => { this.menuBreadcrumbProps.open = true },
					onDragleave: this.closeActions,
					// Make sure we keep the same open state
					// as the Actions component
					'onUpdate:open': (open) => {
						this.menuBreadcrumbProps.open = open
					},
				// Add all hidden breadcrumbs as ActionRouter or ActionLink
				}, {
					default: () => this.hiddenIndices.filter((index) => index <= breadcrumbs.length - 1).map((index) => {
						const crumb = breadcrumbs[index]
						const {
							// Get the parameters from the breadcrumb component props
							to,
							href,
							disableDrop,
							name,
							// Props to forward
							...propsToForward
						} = crumb.props
						// Do not forward the ref, otherwise it will be null if the hidden crumb gets destroyed
						delete propsToForward.ref

						// Decide whether to show the breadcrumbs as ActionButton, ActionRouter or ActionLink
						let element = NcActionButton
						let path = ''
						if (href) {
							element = NcActionLink
							path = href
						}
						if (to) {
							element = NcActionRouter
							path = to
						}
						const folderIcon = h(IconFolder, {
							size: 20,
						})
						return h(element, {
							...propsToForward,
							class: crumbClass,
							href: href || null,
							to: to || null,
							// Prevent the breadcrumbs from being draggable
							draggable: false,
							// Add the drag and drop handlers
							onDragstart: this.dragStart,
							onDrop: ($event) => this.dropped($event, path, disableDrop),
							onDragover: this.dragOver,
							onDragenter: ($event) => this.dragEnter($event, disableDrop),
							onDragleave: ($event) => this.dragLeave($event, disableDrop),
						}, {
							default: () => name,
							icon: () => folderIcon,
						})
					}),
				}),
			)
		}

		const wrapper = [h('nav', { 'aria-label': this.ariaLabel }, [h('ul', { class: 'breadcrumb__crumbs' }, [crumbs])])]
		// Append the actions slot if it is populated
		if (isSlotPopulated(this.$slots.actions?.())) {
			wrapper.push(h('div', { class: 'breadcrumb__actions', ref: 'breadcrumb__actions' }, this.$slots.actions?.()))
		}

		this.breadcrumbsRefs = breadcrumbsRefs

		return h('div', { class: ['breadcrumb', { 'breadcrumb--collapsed': (this.hiddenIndices.length === breadcrumbs.length - 2) }], ref: 'container' }, wrapper)
	},
}
</script>

<style lang="scss" scoped>
.breadcrumb {
	width: 100%;
	flex-grow: 1;
	display: inline-flex;
	align-items: center;

	&--collapsed :deep(.vue-crumb:last-child) {
		min-width: 100px;
	}

	nav {
		flex-shrink: 1;
		min-width: 0;
	}

	& #{&}__crumbs {
		max-width: 100%;
	}

	& #{&}__crumbs,
	& #{&}__actions {
		display: inline-flex;
	}
}
</style>
