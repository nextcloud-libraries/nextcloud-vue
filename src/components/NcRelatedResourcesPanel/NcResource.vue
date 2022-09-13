<!--
  - @copyright 2022 Christopher Ng <chrng8@gmail.com>
  -
  - @author Christopher Ng <chrng8@gmail.com>
  -
  - @license AGPL-3.0-or-later
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

<template>
	<li class="resource">
		<div v-tooltip="tooltip" class="resource__desc">
			<h5>{{ title }}</h5>
			<p v-if="subtitle">
				{{ subtitle }}
			</p>
		</div>
		<NcButton :aria-label="labelTranslated"
			type="tertiary"
			:href="url">
			<template #icon>
				<ArrowRight :size="20" />
			</template>
		</NcButton>
	</li>
</template>

<script>
import NcButton from '../NcButton/index.js'
import Tooltip from '../../directives/Tooltip/index.js'
import { t } from '../../l10n.js'

import ArrowRight from 'vue-material-design-icons/ArrowRight.vue'

export default {
	name: 'NcResource',

	components: {
		ArrowRight,
		NcButton,
	},

	directives: {
		Tooltip,
	},

	props: {
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			default: null,
		},
		tooltip: {
			type: String,
			default: null,
		},
		url: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			labelTranslated: t('Open link to "{resourceTitle}"', { resourceTitle: this.title }),
		}
	},
}
</script>

<style lang="scss" scoped>
.resource {
	display: flex;
	align-items: center;
	height: 44px;

	&__desc {
		padding: 8px;
		line-height: 1.2em;
		position: relative;
		flex: 1 1;
		min-width: 0;

		h5 {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			max-width: inherit;
		}

		p {
			color: var(--color-text-maxcontrast);
		}
	}
}
</style>
