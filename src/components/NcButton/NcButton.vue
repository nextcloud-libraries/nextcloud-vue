<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>

### General description
General purpose button component. See props for different options.
[Use material design icons only for icons](https://www.npmjs.com/package/vue-material-design-icons) and remember to set their size to 20.

### Usage
### Custom icon slot
To be used with `vue-material-design-icons` only. For icon classes use the `default-icon` slot.
It can be used with one or multiple actions.
```
<template>
<div class="wrapper">
	<!-- Style selector -->
	<div class="grid">
		<NcCheckboxRadioSwitch v-model="style" value="text" name="style" type="radio">Text only</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="style" value="icon" name="style" type="radio">Icon only</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="style" value="icontext" name="style" type="radio">Icon and text</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="disabled" type="checkbox">Disabled</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="size" value="small" name="size" type="radio">Small</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="size" value="normal" name="size" type="radio">Normal (default)</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="size" value="large" name="size" type="radio">Large</NcCheckboxRadioSwitch>
	</div>

	<h5>Standard buttons</h5>
	<div class="grid">
		<p>Tertiary, no background</p>
		<p>Tertiary</p>
		<p>Secondary</p>
		<p>Primary</p>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:size="size"
			:text="text"
			type="tertiary-no-background">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:size="size"
			:text="text"
			type="tertiary">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:size="size"
			:text="text">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			aria-label="Example text"
			:disabled="disabled"
			:size="size"
			:text="text"
			type="primary">
			<template v-if="style.indexOf('icon') !== -1" #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
	</div>

	<!-- Wide button -->
	<h5>Wide button</h5>
	<NcButton
		:disabled="disabled"
		:size="size"
		:text="text"
		:wide="true"
		text="Example text">
		<template #icon>
			<Video
				:size="20" />
		</template>
	</NcButton>

	<!-- Special buttons -->
	<h5>Special buttons</h5>
	<div class="grid">
		<p>Success</p>
		<p>Warning</p>
		<p>Error</p>
		<p> - </p>
		<NcButton
			:disabled="disabled"
			:size="size"
			text="Example text"
			type="success">
			<template #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			:disabled="disabled"
			:size="size"
			text="Example text"
			type="warning">
			<template #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<NcButton
			:disabled="disabled"
			:size="size"
			text="Example text"
			type="error">
			<template #icon>
				<Video
					:size="20" />
			</template>
		</NcButton>
		<p> - </p>
	</div>
</div>

</template>
<script>
import Video from 'vue-material-design-icons/Video.vue'

export default {
	components: {
		Video,
	},
	data() {
		return {
			toggled: false,
			disabled: false,
			size: 'normal',
			style: 'icontext',
		}
	},
	computed: {
		text() {
			if (this.style.includes('text')) {
				return 'Example text'
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.wrapper {
	padding: 0 12px;
}

.grid {
	display: grid;
	gap: 12px;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: repeat(auto-fill, auto);
	position: relative;
	margin: 12px 0;
}

h5 {
	font-weight: bold;
	margin: 40px 0 20px 0;
}

p {
	text-align: center;
	margin: 4px 0 12px 0;
	color: var(--color-text-maxcontrast)
}

button {
	margin: auto;
}
</style>
```

### Alignment
Sometimes it is required to change the icon alignment on the button, like for switching between pages as in following example:

```vue
<template>
	<div style="display: flex; flex-direction: column; gap: 12px;">
		<NcButton text="center (default)" type="secondary" wide>
			<template #icon>
				<IconLeft :size="20" />
			</template>
		</NcButton>
		<NcButton alignment="center-reverse" text="center-reverse" type="secondary" wide>
			<template #icon>
				<IconRight :size="20" />
			</template>
		</NcButton>
		<div style="display: flex; gap: 12px;">
			<div style="display: flex; flex-direction: column; gap: 12px; flex: 1">
				<NcButton alignment="start" text="start" type="secondary" wide>
					<template #icon>
						<IconLeft :size="20" />
					</template>
				</NcButton>
				<NcButton alignment="start-reverse" text="start-reverse" type="secondary" wide>
					<template #icon>
						<IconRight :size="20" />
					</template>
				</NcButton>
			</div>
			<div style="display: flex; flex-direction: column; gap: 12px; flex: 1">
				<NcButton alignment="end" text="end" type="secondary" wide>
					<template #icon>
						<IconLeft :size="20" />
					</template>
				</NcButton>
				<NcButton alignment="end-reverse" text="end-reverse" type="secondary" wide>
					<template #icon>
						<IconRight :size="20" />
					</template>
				</NcButton>
			</div>
		</div>
	</div>
</template>
<script>
import IconLeft from 'vue-material-design-icons/ArrowLeft.vue'
import IconRight from 'vue-material-design-icons/ArrowRight.vue'

export default {
	components: {
		IconLeft,
		IconRight,
	},
}
</script>
```

### Pressed state

It is possible to make the button stateful by adding a pressed state, e.g. if you like to create a favorite button.
The button will have the required `aria` attribute for accessibility and visual style (`primary` when pressed, and the configured type otherwise).

Do not change `text` or `aria-label` of the pressed/unpressed button. See: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed

```vue
<template>
	<div>
		<div style="display: flex; gap: 12px;">
			<NcButton v-model:pressed="isFavorite" aria-label="Favorite" type="tertiary-no-background">
				<template #icon>
					<IconStar v-if="isFavorite" :size="20" />
					<IconStarOutline v-else :size="20" />
				</template>
			</NcButton>
			<NcButton v-model:pressed="isFavorite" text="Favorite" type="tertiary">
				<template #icon>
					<IconStar v-if="isFavorite" :size="20" />
					<IconStarOutline v-else :size="20" />
				</template>
			</NcButton>
			<NcButton v-model:pressed="isFavorite" aria-label="Favorite">
				<template #icon>
					<IconStar v-if="isFavorite" :size="20" />
					<IconStarOutline v-else :size="20" />
				</template>
			</NcButton>
		</div>
		<div>
			It is {{ isFavorite ? 'a' : 'not a' }} favorite.
		</div>
	</div>
</template>
<script>
import IconStar from 'vue-material-design-icons/Star.vue'
import IconStarOutline from 'vue-material-design-icons/StarOutline.vue'

export default {
	components: {
		IconStar,
		IconStarOutline,
	},
	data() {
		return {
			isFavorite: false,
		}
	},
	methods: {
		toggleFavorite() {
			this.isFavorite = !this.isFavorite
		},
	},
}
</script>
```

### Usage example: Custom content
Sometimes custom content, meaning more than text and icon, is required.
For this the `default`-slot can be used.

**Important**: Never include interactive elements inside the button,
this results in invalid HTML and is not accessible!

```vue
<template>
	<NcButton>
		Some <del>formatted</del> content
	</NcButton>
</template>
```

### Usage example: Sorting table columns
The standard way to implement sortable table column headers should be like this:

```vue
<template>
	<table>
		<thead>
			<tr>
				<th :aria-sorted="sortedName" class="row-name">
					<NcButton alignment="start-reverse"
						:wide="true"
						type="tertiary"
						@click="sortName">
						<template #icon>
							<IconDown v-if="sortedName === 'ascending'" class="sort-icon" :size="20" />
							<IconUp v-else-if="sortedName === 'descending'" class="sort-icon" :size="20" />
						</template>
						<span class="table-header">Name</span>
					</NcButton>
				</th>
				<th :aria-sorted="sortedSize" class="row-size">
					<NcButton alignment="end"
						:wide="true"
						type="tertiary"
						@click="sortSize">
						<template #icon>
							<IconDown v-if="sortedSize === 'ascending'" class="sort-icon" :size="20" />
							<IconUp v-else-if="sortedSize === 'descending'" class="sort-icon" :size="20" />
						</template>
						<span class="table-header">Size</span>
					</NcButton>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="row-name">Lorem ipsum</td>
				<td class="row-size">8 MiB</td>
			</tr>
		</tbody>
	</table>
</template>
<script>
import IconUp from 'vue-material-design-icons/MenuUp.vue'
import IconDown from 'vue-material-design-icons/MenuDown.vue'

export default {
	components: {
		IconUp,
		IconDown,
	},
	data() {
		return {
			sortedName: null,
			sortedSize: null,
		}
	},
	methods: {
		sortName() {
			if (this.sortedName === 'ascending') {
				this.sortedName = 'descending'
			} else if (this.sortedName === 'descending') {
				this.sortedName = null
			} else {
				this.sortedName = 'ascending'
			}
		},
		sortSize() {
			if (this.sortedSize === 'ascending') {
				this.sortedSize = 'descending'
			} else if (this.sortedSize === 'descending') {
				this.sortedSize = null
			} else {
				this.sortedSize = 'ascending'
			}
		},
	},
}
</script>
<style>
table {
	table-layout: fixed;
	width: 300px;
}

td.row-name {
	padding-inline-start: 16px;
}

td.row-size {
	text-align: right;
	padding-inline-end: 16px;
}

.table-header {
	font-weight: normal;
	color: var(--color-text-maxcontrast);
}

.sort-icon {
	color: var(--color-text-maxcontrast);
	position: relative;
	inset-inline: -10px;
}

.row-size .sort-icon {
	inset-inline: 10px;
}
</style>
```
</docs>

<template>
	<component :is="to ? 'router-link' : NcButtonWrapper"
		v-slot="{ isActive, href, navigate }"
		custom
		:to="to">
		<NcButtonImplementation v-bind="$props"
			:is-active="isActive"
			:href="href"
			:navigate="navigate"
			@click="(event) => $emit('click', event)"
			@update:pressed="(pressed) => $emit('update:pressed', pressed)">
			<template #default>
				<!-- @slot Custom main content of the button. Note that this **must not** contain any interactive elements -->
				<slot />
			</template>
			<template #icon>
				<!-- @slot Custom button icon -->
				<slot name="icon" />
			</template>
		</NcButtonImplementation>
	</component>
</template>

<script setup lang="ts">
import type { NcButtonEmits } from './types'
import { NcButtonProps } from './types'
import NcButtonImplementation from './NcButtonImplementation.vue'
import NcButtonWrapper from './NcButtonWrapper.vue'

defineEmits<NcButtonEmits>()
defineProps(NcButtonProps)
</script>
