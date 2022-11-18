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
	<span class="icon-vue"
		role="img"
		:aria-hidden="!title"
		:aria-label="title"
		v-html="htmlString" /> <!-- eslint-disable-line vue/no-v-html -->
</template>

<script>
import { sanitizeSVG } from '@skjnldsv/sanitize-svg'

import { t } from '../../l10n.js'
import logger from '../../utils/logger.js'

export default {
	name: 'NcIconSvgWrapper',

	props: {
		svg: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			cleanSvg: '',
			htmlString: '',
		}
	},

	async beforeMount() {
		await this.sanitizeSVG()
		this.renderHtmlString()
	},

	methods: {
		async sanitizeSVG() {
			if (!this.svg) {
				return
			}
			this.cleanSvg = await sanitizeSVG(this.svg)
		},

		renderHtmlString() {
			if (!this.cleanSvg) {
				return
			}

			const parser = new DOMParser()
			const parsedDocument = parser.parseFromString(this.cleanSvg, 'image/svg+xml')

			const errorNode = parsedDocument.querySelector('parsererror')
			if (errorNode) {
				logger.error(t('Error parsing svg'), errorNode)
			}
			const element = parsedDocument.documentElement
			element.classList.add('icon-vue__svg')

			if (this.title) {
				const titleElement = document.createElement('title')
				titleElement.textContent = this.title
				if (element.firstElementChild) {
					element.firstElementChild.prepend(titleElement)
				}
			}

			this.htmlString = element.outerHTML
		},
	},
}
</script>

<style lang="scss" scoped>
.icon-vue {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 44px;
	height: 44px;
	opacity: 1;

	&:deep(.icon-vue__svg) {
		fill: currentColor;
		max-width: 20px;
		max-height: 20px;
	}
}
</style>
