<!--
 - @copyright Copyright (c) 2020 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 -
 - @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
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

This component renders a breadcrumb bar. It adjusts to the available width
by hiding breadcrumbs in a dropdown menu and emits an event when something
is dropped on a creadcrumb.

### Usage

```vue
<template>
	<div>
		<div class="container">
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
		<br />
		<div class="dragme" draggable="true" @dragstart="dragStart">
			<span>Drag me onto the breadcrumbs.</span>
		</div>
	</div>
</template>

<script>
import Download from 'vue-material-design-icons/Download'
import Folder from 'vue-material-design-icons/Folder'
import MenuDown from 'vue-material-design-icons/MenuDown'
import Plus from 'vue-material-design-icons/Plus'
import ShareVariant from 'vue-material-design-icons/ShareVariant'

export default {
	components: {
		Download,
		Folder,
		MenuDown,
		Plus,
		ShareVariant,
	},
	methods: {
		dropped(e, path) {
			alert('Global drop on ' + path)
		},
		droppedOnCrumb(e, path) {
			alert('Drop on crumb ' + path)
		},
		dragStart(e) {
			e.dataTransfer.setData('text/plain', 'dragging')
		},
	}
}
</script>
<style>
.container {
	display: inline-flex;
	width: 100%;
}

.dragme {
	display: block;
	width: 100px;
	height: 44px;
	background-color: var(--color-background-dark);
}
</style>
```
</docs>

<script>
import NcActions from '../NcActions/index.js'
import NcActionButton from '../NcActionButton/index.js'
import NcActionRouter from '../NcActionRouter/index.js'
import NcActionLink from '../NcActionLink/index.js'
import NcBreadcrumb from '../NcBreadcrumb/index.js'
import isSlotPopulated from '../../utils/isSlotPopulated.ts'

import { subscribe, unsubscribe } from '@nextcloud/event-bus'

import IconFolder from 'vue-material-design-icons/Folder.vue'

import debounce from 'debounce'
import { cloneVNode, h, Fragment } from 'vue'

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
	},
	emits: ['dropped'],
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
			if (a.length !== b.length) return false
			if (a === b) return true
			if (a === null || b === null) return false

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
			if (!el?.classList) return 0
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
			crumbs.forEach((f) => { f.classList.remove(`${crumbClass}--hovered`) })
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
					crumbs.forEach((f) => { f.classList.remove(`${crumbClass}--hovered`) })
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
	},
	/**
	 * The render function to display the component
	 *
	 * @return {object|undefined} The created VNode
	 */
	render() {
		// Get the breadcrumbs
		let breadcrumbs = []
		// We have to iterate over all slot elements
		this.$slots.default?.().forEach(vnode => {
			if (this.isBreadcrumb(vnode)) {
				breadcrumbs.push(vnode)
				return
			}
			// If we encounter a Fragment, we have to check its children too
			if (vnode?.type === Fragment) {
				vnode?.children?.forEach?.(child => {
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
			 crumbs.splice(Math.round(breadcrumbs.length / 2), 0,

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
					default: () => this.hiddenIndices.map(index => {
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
						},
						{
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
