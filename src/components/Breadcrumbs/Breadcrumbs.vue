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
		<div class="container container__wide">
			<Breadcrumbs :breadcrumbs="breadcrumbs" @dropped="dropped" />
		</div>
		<br />
		<div class="container container__narrow">
			<Breadcrumbs :breadcrumbs="breadcrumbs" @dropped="dropped" />
		</div>
		<br />
		<div class="dragme" draggable="true">
			<span>Drag me onto the breadcrumbs.</span>
		</div>
	</div>
</template>

<script>
export default {
	computed: {
		breadcrumbs() {
			const path = 'Folder 1/Folder 2/Folder 3/Folder 4'
			const crumbs = (path === '') ? [] : path.split('/')
			return [{ name: 'Home', path: '/' }].concat(crumbs.map((crumb, i) => {
				return {
					name: crumb,
					path: '/' + crumbs.slice(0, i + 1).join('/'),
				}
			}))
		},
	},
	methods: {
		dropped(path) {
			alert('Dropped something on ' + path)
		},
	}
}
</script>
<style>
.container {
	display: inline-flex;
}

.container__wide {
	width: 800px;
}

.container__narrow {
	width: 250px;
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

<template>
	<div ref="container" class="breadcrumb">
		<div v-for="(crumb, index) in crumbs1"
			:key="`f1${index}`"
			:ref="`crumb_${index}`"
			class="crumb svg folder"
			:class="{'hidden': isHidden(index)}"
			draggable="false"
			@dragstart="dragstart"
			@drop="dropped(index, $event)"
			@dragover="dragOver($event)"
			@dragenter="($event) => dragEnter(index, $event)"
			@dragleave="dragLeave">
			<a :href="'#' + crumb.path">
				<span v-if="!index" :class="rootIcon" class="icon" />
				<span v-else>{{ crumb.name }}</span>
			</a>
		</div>
		<div v-if="hiddenCrumbs.length" class="crumb svg">
			<Actions class="dropdown"
				:force-menu="true"
				:open.sync="actionsOpen"
				draggable="false"
				@dragstart.native="dragstart"
				@dragover.native="dragOver($event)"
				@drop.native="dropOnActions"
				@dragenter.native="actionsOpen = true"
				@dragleave.native="closeActions">
				<ActionRouter
					v-for="(crumb, index) in hiddenCrumbs"
					:key="`dropdown${index}`"
					:to="crumb.path"
					icon="icon-folder"
					class="crumb"
					draggable="false"
					@dragstart.native="dragstart"
					@drop.native="dropped(hiddenIndices[index], $event)"
					@dragover.native="dragOver($event)"
					@dragenter.native="($event) => dragEnter(hiddenIndices[index], $event)"
					@dragleave.native="dragLeave">
					{{ crumb.name }}
				</ActionRouter>
			</Actions>
		</div>
		<div v-for="(crumb, index) in crumbs2"
			:key="`f2${index}`"
			:ref="`crumb_${index + crumbs1.length}`"
			class="crumb svg folder"
			:class="{'hidden': isHidden(index + crumbs1.length)}"
			draggable="false"
			@dragstart="dragstart"
			@drop="dropped(index + crumbs1.length, $event)"
			@dragover="dragOver($event)"
			@dragenter="($event) => dragEnter(index + crumbs1.length, $event)"
			@dragleave="dragLeave">
			<a :href="'#' + crumb.path">
				<span>{{ crumb.name }}</span>
			</a>
		</div>
	</div>
</template>

<script>
import debounce from 'debounce'
import { Actions } from 'Components/Actions'
import { ActionRouter } from 'Components/ActionRouter'

export default {
	components: {
		Actions,
		ActionRouter
	},
	props: {
		breadcrumbs: {
			type: Array,
			required: true,
			default: () => []
		},
		rootIcon: {
			type: String,
			required: false,
			default: 'icon-home'
		}
	},
	data: function() {
		return {
			hiddenIndices: [],
			actionsOpen: false
		}
	},
	computed: {
		crumbs1() {
			if (this.hiddenIndices.length) {
				return this.breadcrumbs.slice(0, Math.round(this.breadcrumbs.length / 2))
			}
			return this.breadcrumbs
		},

		crumbs2() {
			if (this.hiddenIndices.length) {
				return this.breadcrumbs.slice(Math.round(this.breadcrumbs.length / 2))
			}
			return []
		},

		hiddenCrumbs() {
			const crumbs = []
			for (let jj = 0; jj < this.hiddenIndices.length; jj++) {
				crumbs.push(this.breadcrumbs[this.hiddenIndices[jj]])
			}
			return crumbs
		}
	},
	watch: {
		breadcrumbs: function(val) {
			this.actionsOpen = false
			this.$nextTick(() => this.handleWindowResize())
		}
	},
	created() {
		window.addEventListener('resize', debounce(() => {
			this.handleWindowResize()
		}, 100))
	},
	mounted() {
		this.handleWindowResize()
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleWindowResize)
	},
	methods: {
		closeActions(e) {
			// Get the correct element, the events are bound to the <a>
			if (e.target.closest) {
				const target = e.target.closest('.crumb .dropdown')
				// Don't do anything if we leave towards a child element.
				if (target.contains(e.relatedTarget)) {
					return
				}
				this.actionsOpen = false
			}
		},

		isHidden(index) {
			return this.hiddenIndices.includes(index)
		},

		handleWindowResize() {
			if (this.$refs.container) {
				const nrCrumbs = this.breadcrumbs.length
				const hiddenIndices = []
				const availableWidth = this.$refs.container.offsetWidth
				const totalWidth = this.getTotalWidth()
				let overflow = totalWidth - availableWidth
				// If we overflow, we have to take the action-item width into account as well.
				overflow += (overflow > 0) ? 51 : 0
				let i = 0
				const startIndex = Math.floor(nrCrumbs / 2)
				while (overflow > 0 && i < nrCrumbs - 2) {
					const currentIndex = startIndex + ((i % 2) ? i + 1 : i) / 2 * Math.pow(-1, i + (nrCrumbs % 2))
					overflow -= this.getWidth(this.$refs[`crumb_${currentIndex}`][0])
					hiddenIndices.push(currentIndex)
					i++
				}
				this.hiddenIndices = hiddenIndices.sort()
			}
		},

		getTotalWidth() {
			return this.breadcrumbs.reduce((width, crumb, index) => width + this.getWidth(this.$refs[`crumb_${index}`][0]), 0)
		},

		getWidth(el) {
			const hide = el.classList.contains('hidden')
			el.classList.remove('hidden')
			const w = el.offsetWidth
			if (hide) {
				el.classList.add('hidden')
			}
			return w
		},
		cancelEvent(e) {
			e.stopPropagation()
			e.preventDefault()
			return false
		},
		dropOnActions(e) {
			this.actionsOpen = false
			return this.cancelEvent(e)
		},
		dragstart(e) {
			return this.cancelEvent(e)
		},
		dropped(index, e) {
			this.cancelEvent(e)
			// If it is the last element in the path,
			// don't do anything
			if (index === (this.breadcrumbs.length - 1)) {
				return
			}
			this.$emit('dropped', this.breadcrumbs[index].path)
			this.actionsOpen = false
			const crumbs = document.querySelectorAll('.crumb')
			crumbs.forEach((f) => { f.classList.remove('over') })
			return false
		},
		dragOver(e) {
			if (e.preventDefault) {
				e.preventDefault()
			}
			return false
		},
		dragEnter(index, e) {
			// If it is the last element in the path,
			// don't do anything
			if (index === (this.breadcrumbs.length - 1)) {
				return
			}
			// Get the correct element, in case we hover a child.
			if (e.target.closest) {
				const target = e.target.closest('.crumb')
				if (target.classList && target.classList.contains('crumb')) {
					const crumbs = document.querySelectorAll('.crumb')
					crumbs.forEach((f) => { f.classList.remove('over') })
					target.classList.add('over')
				}
			}
		},
		dragLeave(e) {
			// Don't do anything if we leave towards a child element.
			if (e.target.contains(e.relatedTarget)) {
				return
			}
			// Get the correct element, in case we leave directly from a child.
			if (e.target.closest) {
				const target = e.target.closest('.crumb')
				if (target.contains(e.relatedTarget)) {
					return
				}
				if (target.classList && target.classList.contains('crumb')) {
					target.classList.remove('over')
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.breadcrumb {
	width: calc(100% - 88px);
	flex-grow: 1;

	.crumb {
		&.over {
			background-color: var(--color-primary-light);
		}
		&.action-item {
			ul {
				overflow-y: auto;
				-webkit-overflow-scrolling: touch;
				min-height: calc(44px * 1.5);
				max-height: calc(100vh - 50px * 2);
			}
		}
		> a {
			align-items: center;
			display: inline-flex;

			> span {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
}
</style>
