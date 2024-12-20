<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component is to be used in the settings section of nextcloud.

### Examples

```vue
<template>
	<div>
		<NcSettingsSection name="Two-factor authentication"
			description="Two-factor authentication can be enforced for all accounts and specific groups. If they do not have a two-factor provider configured, they will be unable to log into the system."
			doc-url="https://docs.nextcloud.com/server/19/go.php?to=admin-2fa">
			<NcCheckboxRadioSwitch type="switch">
				Enforce two-factor authentication
			</NcCheckboxRadioSwitch>
		</NcSettingsSection>

		<NcSettingsSection name="Server-side encryption"
			description="Server-side encryption makes it possible to encrypt files which are uploaded to this server. This comes with limitations like a performance penalty, so enable this only if needed.">
			<NcCheckboxRadioSwitch type="switch">
				Enable server-side encryption
			</NcCheckboxRadioSwitch>
		</NcSettingsSection>

		<NcSettingsSection name="OAuth 2.0 clients"
			description="OAuth 2.0 allows external services to request access to Nextcloud."
			doc-url="https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/oauth2.html">

			Any content here

		</NcSettingsSection>
	</div>
</template>
```
</docs>

<template>
	<div class="settings-section" :class="{'settings-section--limit-width': forceLimitWidth}">
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
		/**
		 * Limit the width of the setting's content
		 *
		 * Setting this to false allows unrestricted (width) settings content.
		 * Note that the name and description have always a width limit.
		 * @deprecated Will be removed with next version and will not be used on Nextcloud 30+ (always forced to true)
		 */
		limitWidth: {
			type: Boolean,
			default: true,
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
		forceLimitWidth() {
			if (this.limitWidth) {
				return true
			}
			// Overwrite this on Nextcloud 30+ to always limit the width
			const [major] = window._oc_config?.version.split('.', 2) ?? []
			return major && Number.parseInt(major) >= 30
		},

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

.settings-section {
	display: block;
	margin-bottom: auto;
	padding: 30px;

	&:not(:last-child) {
		border-bottom: 1px solid var(--color-border);
	}

	&--limit-width > * {
		max-width: $maxWidth;
	}

	&__name {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		font-weight: bold;
		max-width: $maxWidth;
		margin-top: 0; // Remove default heading margin
	}

	&__info {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--default-clickable-area);
		height: var(--default-clickable-area);
		// make sure to properly align the icon with the text
		margin: calc($icon-margin * -1);
		margin-inline-start: 0;
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
