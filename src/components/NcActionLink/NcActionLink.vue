<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
This component is made to be used inside of the [NcActions](#NcActions) component slots.

```
<template>
	<div style="display: flex; align-items: center;">
		<NcActions>
			<NcActionLink href="https://nextcloud.com">
				<template #icon>
					<OpenInNew :size="20" />
				</template>
				Nextcloud website
			</NcActionLink>
		</NcActions>

		<NcActions>
			<NcActionLink href="https://www.gnu.org/licenses/gpl.odt"
				  download="AGPL License text.odt">
				<template #icon>
					<Download :size="20" />
				</template>
				Download AGPL license text
			</NcActionLink>
		</NcActions>

		<NcActions>
			<NcActionLink href="https://nextcloud.com">
				<template #icon>
					<OpenInNew :size="20" />
				</template>
				Nextcloud website
			</NcActionLink>
			<NcActionLink href="https://www.gnu.org/licenses/gpl.odt"
				  download="AGPL License text.odt">
				<template #icon>
					<Download :size="20" />
				</template>
				Download AGPL license text
			</NcActionLink>
		</NcActions>
	</div>
</template>
<script>
import Download from 'vue-material-design-icons/Download.vue'
import OpenInNew from 'vue-material-design-icons/OpenInNew.vue'

export default {
	components: {
		Download,
		OpenInNew,
	},
}
</script>
```
</docs>

<template>
	<li class="action" :role="isInSemanticMenu && 'presentation'">
		<a :download="download"
			:href="href"
			:aria-label="ariaLabel"
			:target="target"
			:title="title"
			class="action-link focusable"
			rel="nofollow noreferrer noopener"
			:role="isInSemanticMenu && 'menuitem'"
			@click="onClick">

			<!-- @slot Manually provide icon -->
			<slot name="icon">
				<span :class="[isIconUrl ? 'action-link__icon--url' : icon]"
					:style="{ backgroundImage: isIconUrl ? `url(${icon})` : null }"
					aria-hidden="true"
					class="action-link__icon" />
			</slot>

			<!-- long text with name -->
			<span v-if="name"
				class="action-link__longtext-wrapper">
				<strong class="action-link__name">
					{{ name }}
				</strong>
				<br>
				<!-- white space is shown on longtext, so we can't
				put {{ text }} on a new line for code readability -->
				<span class="action-link__longtext" v-text="text" />
			</span>

			<!-- long text only -->
			<!-- white space is shown on longtext, so we can't
			put {{ text }} on a new line for code readability -->
			<span v-else-if="isLongText"
				class="action-link__longtext"
				v-text="text" />

			<!-- default text display -->
			<span v-else class="action-link__text">{{ text }}</span>

			<!-- fake slot to gather inner text -->
			<slot v-if="false" />
		</a>
	</li>
</template>

<script>
import ActionTextMixin from '../../mixins/actionText.js'
import { NC_ACTIONS_IS_SEMANTIC_MENU } from '../NcActions/useNcActions.ts'

export default {
	name: 'NcActionLink',

	mixins: [ActionTextMixin],

	inject: {
		isInSemanticMenu: {
			from: NC_ACTIONS_IS_SEMANTIC_MENU,
			default: false,
		},
	},

	props: {
		/**
		 * destionation to link to
		 */
		href: {
			type: String,
			default: '#',
			required: true,
			validator: value => {
				// href is either an anchor or a valid url starting with a scheme or a relative path
				try {
					return new URL(value)
				} catch (error) {
					return value.startsWith('#') || value.startsWith('/')
				}
			},
		},
		/**
		 * download the link instead of opening
		 */
		download: {
			type: String,
			default: null,
		},
		/**
		 * target to open the link
		 */
		target: {
			type: String,
			default: '_self',
			validator: value => {
				return value && (!value.startsWith('_') || ['_blank', '_self', '_parent', '_top'].indexOf(value) > -1)
			},
		},
		/**
		 * Declares a native tooltip when not null
		 */
		title: {
			type: String,
			default: null,
		},
	},
}
</script>

<style lang="scss" scoped>
@use '../../assets/action.scss' as *;
@include action-active;
@include action-item('link');
</style>
