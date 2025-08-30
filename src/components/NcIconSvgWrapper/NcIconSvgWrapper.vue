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

### Directional usage

The `directional` property allows to enable a language direction aware icon.
This icon component can be used in places where an language direction aware icon should be used,
for example if an arrow pointing to the left it used it often points in the wrong direction for right-to-left languages.
In this cases this icon can be used which will always point into the logical "start" direction.

```vue
<template>
	<div class="wrapper">
		<NcButton @click="isRtl = !isRtl">Toggle RTL</NcButton>
		<div class="directional" :dir="isRtl ? 'rtl' : 'ltr'">
			<NcButton alignment="start">
				<template #icon>
					<NcIconSvgWrapper directional :path="mdiChevronLeft" />
				</template>
				Previous
			</NcButton>
			<NcButton alignment="end-reverse">
				<template #icon>
					<NcIconSvgWrapper directional :path="mdiChevronRight" />
				</template>
				Next
			</NcButton>
		</div>
	</div>
</template>

<script>
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

export default {
	setup() {
		return {
			mdiChevronLeft,
			mdiChevronRight,
		}
	},
	data() {
		return {
			isRtl: false
		}
	},
}
</script>
<style scoped>
.wrapper {
	display: flex;
	flex-direction: column;
	gap: calc(2 * var(--default-grid-baseline));
	max-width: 300px;
}

.directional {
	display: flex;
	flex-direction: row;
	gap: calc(2 * var(--default-grid-baseline));
}

.directional * {
	flex: 1 50%;
}
</style>
```
</docs>

<template>
	<span :aria-hidden="name ? undefined : 'true'"
		:aria-label="name || undefined"
		class="icon-vue"
		:class="{
			'icon-vue--directional': directional,
			'icon-vue--inline': inline,
		}"
		role="img">
		<svg v-if="!cleanSvg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path :d="path" />
		</svg>
		<!-- eslint-disable-next-line vue/no-v-text-v-html-on-component,vue/no-v-html -->
		<span v-else v-html="cleanSvg" />
	</span>
</template>

<script>
import DOMPurify from 'dompurify'
import Vue from 'vue'

export default {
	name: 'NcIconSvgWrapper',

	props: {
		/**
		 * Make the icon directional, meaning it is langauge direction aware.
		 * If the icon is placed in a right-to-left context it will be mirrored vertically.
		 */
		directional: {
			type: Boolean,
			default: false,
		},

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
	},
}
</script>

<style lang="scss" scoped>
.icon-vue {
	--icon-size: v-bind('iconSize');
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

	// Icon svg wrapper
	span {
		line-height: 0;
	}

	&:deep(svg) {
		fill: currentColor;
		width: var(--icon-size, 20px);
		height: var(--icon-size, 20px);
		max-width: var(--icon-size, 20px);
		max-height: var(--icon-size, 20px);
	}

	&--directional:deep(svg:dir(rtl)) {
		transform: scaleX(-1);
	}
}
</style>
