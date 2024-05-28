<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### Description

Render raw SVG string icons.

### Usage within `icon`-slot

```vue
<template>
	<div class="grid">
		<NcButton aria-label="Close">
			<template #icon>
				<NcIconSvgWrapper :svg="closeSvg" name="Close" />
			</template>
		</NcButton>
		<NcButton aria-label="Settings">
			<template #icon>
				<NcIconSvgWrapper :svg="cogSvg" name="Cog" />
			</template>
		</NcButton>
		<NcButton aria-label="Add">
			<template #icon>
				<NcIconSvgWrapper :svg="plusSvg" name="Plus" />
			</template>
		</NcButton>
		<NcButton aria-label="Send">
			<template #icon>
				<NcIconSvgWrapper :path="mdiSend" name="Send" />
			</template>
		</NcButton>
		<NcButton aria-label="Star">
			<template #icon>
				<NcIconSvgWrapper :path="mdiStar" name="Star" />
			</template>
		</NcButton>
	</div>
</template>

<script>
import closeSvg from '@mdi/svg/svg/close.svg?raw'
import cogSvg from '@mdi/svg/svg/cog.svg?raw'
import plusSvg from '@mdi/svg/svg/plus.svg?raw'
import { mdiSend } from '@mdi/js'
import { mdiStar } from '@mdi/js'

export default {
	setup() {
		// This icons are static data, so you do not need to put them into `data` which will make them reactive
		return {
			closeSvg,
			cogSvg,
			plusSvg,
			mdiSend,
			mdiStar,
		}
	},
}
</script>

<style>
.grid {
	display: grid;
	grid-template-columns: repeat(5, max-content);
	gap: 10px;
}
</style>
```

### Inline usage inside text

```vue
<template>
	<p>
		This is my <NcIconSvgWrapper inline :path="mdiStar" /> Favorite
	</p>
</template>
<script>
import { mdiStar } from '@mdi/js'

export default {
	setup() {
		return {
			mdiStar,
		}
	},
}
</script>
```
</docs>

<template>
	<span v-if="!cleanSvg"
		v-bind="attributes">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path :d="path" />
		</svg>
	</span>
	<span v-else
		v-bind="attributes"
		v-html="cleanSvg" /> <!-- eslint-disable-line vue/no-v-html -->
</template>

<script>
import Vue from 'vue'
import DOMPurify from 'dompurify'

export default {
	name: 'NcIconSvgWrapper',

	props: {
		/**
		 * Set if the icon should be used as inline content e.g. within text.
		 * By default the icon is made a block element for use inside `icon`-slots.
		 */
		inline: {
			type: Boolean,
			default: false,
		},

		/**
		 * Raw SVG string to render
		 */
		svg: {
			type: String,
			default: '',
		},

		/**
		 * Label of the icon, used in aria-label
		 */
		name: {
			type: String,
			default: '',
		},

		/**
		 * Raw SVG path to render. Takes precedence over the SVG string in the `svg` prop.
		 */
		path: {
			type: String,
			default: '',
		},

		/**
		 * Size of the icon to show. Only use if not using within an icon slot.
		 * Defaults to 20px which is the Nextcloud icon size for all icon slots.
		 * @default 20
		 */
		size: {
			type: [Number, String],
			default: 20,
			validator: (value) => typeof value === 'number' || value === 'auto',
		},
	},

	computed: {
		/**
		 * Icon size used in CSS
		 */
		iconSize() {
			return typeof this.size === 'number' ? `${this.size}px` : this.size
		},

		cleanSvg() {
			if (!this.svg || this.path) {
				return
			}

			const svg = DOMPurify.sanitize(this.svg)

			const svgDocument = new DOMParser().parseFromString(svg, 'image/svg+xml')

			if (svgDocument.querySelector('parsererror')) {
				Vue.util.warn('SVG is not valid')
				return ''
			}

			if (svgDocument.documentElement.id) {
				svgDocument.documentElement.removeAttribute('id')
			}

			return svgDocument.documentElement.outerHTML
		},
		attributes() {
			return {
				class: ['icon-vue', { 'icon-vue--inline': this.inline }],
				style: {
					'--icon-size': this.iconSize,
				},
				role: 'img',
				'aria-hidden': !this.name ? true : undefined,
				'aria-label': this.name || undefined,
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.icon-vue {
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: var(--default-clickable-area);
	min-height: var(--default-clickable-area);
	opacity: 1;

	&--inline {
		display: inline-flex;
		min-width: fit-content;
		min-height: fit-content;
		vertical-align: text-bottom;
	}

	&:deep(svg) {
		fill: currentColor;
		width: var(--icon-size, 20px);
		height: var(--icon-size, 20px);
		max-width: var(--icon-size, 20px);
		max-height: var(--icon-size, 20px);
	}
}
</style>
