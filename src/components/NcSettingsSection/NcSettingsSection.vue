<!--
  - @copyright Copyright (c) 2019 Julius Härtl <jus@bitgrid.net>
  -
  - @author Julius Härtl <jus@bitgrid.net>
  - @author Greta Doci <gretadoci@gmail.com>
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

This component is to be used in the settings section of nextcloud.

### Examples

```vue
<template>
	<NcSettingsSection
		name="Two-Factor Authentication"
		description="Two-factor authentication can be enforced for all users and specific groups."
		doc-url="https://docs.nextcloud.com/server/19/go.php?to=admin-2fa">
		<p>Your settings here</p>
	</NcSettingsSection>
</template>
```
</docs>

<template>
	<div class="settings-section">
		<h2 class="settings-section__name">
			{{ name }}
			<a v-if="hasDocUrl"
				:href="docUrl"
				class="settings-section__info"
				:title="docNameTranslated"
				:aria-label="docNameTranslated"
				target="_blank"
				rel="noreferrer nofollow">
				<HelpCircle :size="20" />
			</a>
		</h2>
		<p v-if="hasDescription"
			class="settings-section__desc">
			{{ description }}
		</p>
		<slot />
	</div>
</template>

<script>
import { t } from '../../l10n.js'

import HelpCircle from 'vue-material-design-icons/HelpCircle.vue'

export default {
	name: 'NcSettingsSection',

	components: {
		HelpCircle,
	},

	props: {
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: '',
		},
		docUrl: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			docNameTranslated: t('External documentation for {name}', {
				name: this.name,
			}),
		}
	},

	computed: {
		hasDescription() {
			return this.description.length > 0
		},
		hasDocUrl() {
			return this.docUrl.length > 0
		},
	},
}

</script>

<style lang="scss" scoped>
$maxWidth: 900px;
$sectionMargin: calc(var(--default-grid-baseline) * 7);

.settings-section {
	display: block;
	padding: 0 0 calc(var(--default-grid-baseline) * 5) 0;
	margin: $sectionMargin;
	width: min($maxWidth, 100% - calc($sectionMargin * 2));

	&:not(:last-child) {
		border-bottom: 1px solid var(--color-border);
	}

	&__name {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		max-width: $maxWidth;
	}

	&__info {
		display: flex;
		align-items: center;
		justify-content: center;
		width: $clickable-area;
		height: $clickable-area;
		// make sure to properly align the icon with the text
		margin: -$icon-margin;
		margin-left: 0;
		color: var(--color-text-maxcontrast);

		&:hover, &:focus, &:active {
			color: var(--color-main-text);
		}
	}

	&__desc {
		margin-top: -.2em;
		margin-bottom: 1em;
		color: var(--color-text-maxcontrast);
		max-width: $maxWidth;
	}
}

</style>
