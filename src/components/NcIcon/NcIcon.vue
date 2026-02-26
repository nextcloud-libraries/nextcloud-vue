<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
Universal component to render any icon. It can render:

- A Vue component icon like `vue-material-design-icons/Account.vue`
- An SVG icon like `@mdi/svg/svg/account.svg`
- A path icon like `@mdi/js/account.js`
- An URL icon like `https://path/to/icon.svg` or `data:image/svg+xml;base64,...`
- A class icon like `icon-account` (not recommended)

Using this component, you can develop a component with a single `icon`` prop and `#icon` slot to support all types of icons.

```vue
<script>
import IconAccountComp from 'vue-material-design-icons/Account.vue'
import IconAccountSvg from '@mdi/svg/svg/account.svg?raw'
import { mdiAccount } from '@mdi/js'

export default {
  setup() {
    return { IconAccountComp, IconAccountSvg, mdiAccount }
  },
}
</script>

<template>
    <div>
        <NcIcon :icon="IconAccountComp" />
        <NcIcon :icon="IconAccountSvg" />
        <NcIcon :icon="mdiAccount" />
        <NcIcon icon="icon-user-white" />
    </div>
</template>
```
</docs>

<script setup>
import { computed } from 'vue'
import { useIcon } from './useIcon.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'

const props = defineProps({
	icon: { type: [Object, String], required: true },
	size: { type: [Number, String], default: 20 },
	inline: { type: Boolean, default: false },
})

const normalizedIcon = useIcon(() => props.icon)
const normalizedSize = computed(() => typeof props.size === 'number' ? `${props.size}px` : props.size)
</script>

<template>
	<component :is="icon" v-if="normalizedIcon.type === 'component'" :size="normalizedSize" />
	<NcIconSvgWrapper v-else-if="normalizedIcon.type === 'svg'" :svg="normalizedIcon.icon" :inline="inline" />
	<NcIconSvgWrapper v-else-if="normalizedIcon.type === 'path'" :path="normalizedIcon.icon" :inline="inline" />
	<span v-else-if="normalizedIcon.type === 'class'"
		class="icon"
		:class="[normalizedIcon.icon, { inline }]"
		:style="'--icon-size: ' + normalizedSize"
		aria-hidden="true" />
	<span v-else-if="normalizedIcon.type === 'url'"
		class="icon icon-url"
		:class="{ inline }"
		:style="`background-image: url('${normalizedIcon.icon}')`"
		aria-hidden="true" />
</template>

<style scoped>
.icon {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: var(--default-clickable-area);
    min-height: var(--default-clickable-area);
    height: var(--icon-size);
	width: var(--icon-size);

    &.inline {
		display: inline-flex;
		min-width: fit-content;
		min-height: fit-content;
		vertical-align: text-bottom;
	}
}
</style>
