<!--
 - @copyright Copyright (c) 2018 Christoph Wurst <christoph@winzerhof-wurst.at>
 -
 - @author Christoph Wurst <christoph@winzerhof-wurst.at>
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
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<docs>

### General description

This component provides the default container of all apps.
It _MUST_ be used as the main wrapper of your app.
It includes the Navigation, the App content and the Sidebar.

It also will set the skip content buttons needed for accessibility.

### Standard usage

```vue
	<template>
		<NcContent app-name="forms">
			<NcAppNavigation>
				<template #list>
					<NcAppNavigationNew text="Create article" />
					<NcAppNavigationItem name="My navigation" title="My title">
						<template #icon>
							<Check :size="20" />
						</template>
					</NcAppNavigationItem>
				</template>
			</NcAppNavigation>
			<NcAppContent>
				<h2>Your main app content here</h2>
				<NcButton @click="opened = !opened">Toggle sidebar</NcButton>
			</NcAppContent>
			<NcAppSidebar v-if="opened" name="cat-picture.jpg" @close="opened=false"></NcAppSidebar>
		</NcContent>
	</template>
	<script>
	import Check from 'vue-material-design-icons/Check'

	export default {
		components: {
			Check,
		},
		data() {
			return {
				opened: false,
			}
		}
	}
	</script>
```

</docs>

<template>
	<div id="content-vue"
		:class="`app-${appName.toLowerCase()}`"
		class="content">
		<!-- TODO: with vue3 the `selector` attribute needs to be changed to `to="#skip-actions"` -->
		<Teleport selector="#skip-actions">
			<div class="skip-actions">
				<NcButton type="primary" href="#app-content-vue">
					{{ t('Skip to main content') }}
				</NcButton>
				<NcButton v-show="hasAppNavigation"
					type="primary"
					href="#app-navigation-vue"
					@click.prevent="openAppNavigation">
					{{ t('Skip to app navigation') }}
				</NcButton>
			</div>
		</Teleport>
		<slot />
	</div>
</template>

<script>
import { emit } from '@nextcloud/event-bus'
import { t } from '../../l10n.js'

import NcButton from '../NcButton/NcButton.vue'
// TODO: This is built-in for vue3 just drop the import
import { Portal as Teleport } from '@linusborg/vue-simple-portal'

export default {
	name: 'NcContent',
	components: {
		NcButton,
		Teleport,
	},
	provide() {
		return {
			'NcContent:setHasAppNavigation': this.setAppNavigation,
		}
	},
	props: {
		appName: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			hasAppNavigation: false,
		}
	},
	beforeMount() {
		const container = document.getElementById('skip-actions')
		if (container) {
			// clear default buttons
			container.innerHTML = ''
		}
	},
	methods: {
		t,
		openAppNavigation() {
			emit('toggle-navigation', { open: true })
			this.$nextTick(() => {
				window.location.hash = 'app-navigation-vue'
				// we need to manually focus if the window location is already set to the app-navigation then it will not focus again
				document.getElementById('app-navigation-vue').focus()
			})
		},
		setAppNavigation(value) {
			this.hasAppNavigation = value
		},
	},
}
</script>

<style lang="scss" scoped>
.skip-actions {
	display: flex;
	gap: 12px;
}

.content {
	box-sizing: border-box;
	margin: var(--body-container-margin);
	margin-top: 50px;
	display: flex;
	width: calc(100% - var(--body-container-margin) * 2);
	border-radius: var(--body-container-radius);
	height: var(--body-height);
	overflow: hidden;
	padding: 0;

	&:not(.with-sidebar--full) {
		position: fixed;
	}

	:deep(*) {
		box-sizing: border-box;
	}
}
</style>
