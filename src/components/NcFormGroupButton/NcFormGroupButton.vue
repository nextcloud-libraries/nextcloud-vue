<!--
  - SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { AnchorHTMLAttributes, Slot } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { mdiOpenInNew } from '@mdi/js'
import { computed, defineProps, toRef } from 'vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { useButtonLink } from '../../composables/useButtonLink.ts'
import { isLegacy } from '../../utils/legacy.ts'

const {
	text,
	supline = undefined,
	subline = undefined,
	to = undefined,
	href = undefined,
	target = undefined,
	disabled = false,
} = defineProps<{
	/**
	 * The main text content
	 */
	text: string
	/**
	 * Additional optional text above the main text
	 */
	supline?: string
	/**
	 * Additional optional text below the main text
	 */
	subline?: string
	/**
	 * RouterLink's to props and a trigger to use RouterLink.
	 * Note: This takes precedence over the href attribute.
	 */
	to?: RouteLocationRaw
	/**
	 * HyperLink href attribute and a trigger to use <a> hyperlink.
	 */
	href?: string
	/**
	 * <a> hyperlink's target attribute
	 */
	target?: AnchorHTMLAttributes['target']
	/**
	 * <button>'s disabled attribute. Not applied to links.
	 */
	disabled?: boolean
}>()

defineEmits<{
	/**
	 * Click
	 */
	click: [event: MouseEvent]
}>()

defineSlots<{
	/**
	 * Text/label custom content
	 */
	default?: Slot
	/**
	 * Custom supline content
	 */
	supline?: Slot
	/**
	 * Custom subline content
	 */
	subline?: Slot
	/**
	 * Custom Icon. Only links have a default icon.
	 */
	icon?: Slot
}>()

const { tag, attrs, isLink } = useButtonLink({
	to: toRef(() => to),
	href: toRef(() => href),
	target: toRef(() => target),
	disabled: toRef(() => disabled),
})

const icon = computed(() => {
	if (isLink.value) {
		return mdiOpenInNew
	}
	return undefined
})
</script>

<template>
	<component
		:is="tag"
		v-bind="attrs"
		class="button-vue"
		:class="[
			$style.ncFormGroupButton,
			{
				[$style.ncFormGroupButton_legacy]: isLegacy,
			},
		]"
		tabindex="0"
		@click="$emit('click', $event)">
		<span :class="$style.ncFormGroupButton__content">
			<span v-if="$slots.supline || supline" :class="$style.ncFormGroupButton__supline">
				<slot name="supline">
					{{ supline }}
				</slot>
			</span>
			<span>
				<slot>
					{{ text }}
				</slot>
			</span>
			<span v-if="$slots.subline || subline" :class="$style.ncFormGroupButton__subline">
				<slot name="subline">
					{{ subline }}
				</slot>
			</span>
		</span>
		<span v-if="$slots.icon || icon" :class="$style.ncFormGroupButton__icon">
			<slot name="icon">
				<NcIconSvgWrapper v-if="icon" :path="icon" inline />
			</slot>
		</span>
	</component>
</template>

<style lang="scss" module>
// Note: some <button> element server styles are prevented by adding button-vue class on the element
.ncFormGroupButton {
	--nc-form-group-button-icon-size: 20px;
	--nc-form-group-button-min-height: 40px; // Special size defined by the design
	// New colors we don't yet have in theming
	// TODO: add new colors to the theming
	--color-primary-element-extra-light: color(from var(--color-primary-element-light) srgb r g b / 0.45);
	--color-primary-element-extra-light-hover: color(from var(--color-primary-element-light-hover) srgb r g b / 0.45);
	display: flex;
	align-items: center;
	width: 100%;
	min-height: var(--nc-form-group-button-min-height);
	margin: 0;
	border: 1px solid var(--color-primary-element-extra-light-hover);
	border-bottom-width: 2px;
	border-radius: var(--border-radius-element);
	padding-inline: calc(3 * var(--default-grid-baseline));
	background-color: var(--color-primary-element-extra-light);
	color: var(--color-primary-element-light-text);
	font-weight: normal;
	font-size: var(--default-font-size);
	text-align: start;
	transition-property: color, border-color, background-color;
	transition-duration: var(--animation-quick);
	transition-timing-function: linear;
	cursor: pointer;

	&:disabled {
		cursor: not-allowed;
	}

	* {
		cursor: inherit;
	}

	&:hover:not(:disabled) {
		color: var(--color-primary-element-light-text);
		background-color: var(--color-primary-element-extra-light-hover);
	}

	&.ncFormGroupButton_legacy {
		border: none;
	}
}

.ncFormGroupButton__content {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding-block: calc(2 * var(--default-grid-baseline));
}

.ncFormGroupButton__supline,
.ncFormGroupButton__subline {
	color: var(--color-text-maxcontrast);
}

.ncFormGroupButton__subline {
	color: var(--color-text-maxcontrast);
}

.ncFormGroupButton__icon {
	display: flex;
	align-items: center;
	width: var(--nc-form-group-button-icon-size);
}
</style>

<docs>
An interactive button-like element of a form group. Can be a button, or a link/RouterLink.

```vue
<template>
	<div class="sample">
		<NcFormGroupButton
			text="Nextcloud"
			href="https://nextcloud.com"
			target="_blank" />

		<NcFormGroupButton
			text="Nextcloud Docs"
			href="https://docs.nextcloud.com"
			target="_blank"
			show-href />

		<NcFormGroupButton
			supline="WebDAV URL"
			text="https://nextcloud.ltd/remote.php/dav/files/admin"
			aria-description="Click to copy the URL">
			<template #icon>
				<NcIconSvgWrapper :path="mdiContentCopy" inline />
			</template>
		</NcFormGroupButton>

		<NcFormGroupButton
			text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
			href="https://en.wikipedia.org/wiki/Lorem_ipsum"
			target="_blank">
			<template #subline>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
				dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
				ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
				fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
				mollit anim id est laborum.
			</template>
		</NcFormGroupButton>
	</div>
</template>

<script>
import { mdiContentCopy } from '@mdi/js'

export default {
	setup() {
		return {
			mdiContentCopy,
		}
	},
}
</script>

<style scoped>
.sample {
	display: flex;
	flex-direction: column;
	gap: var(--default-grid-baseline);
}
</style>
```
</docs>
