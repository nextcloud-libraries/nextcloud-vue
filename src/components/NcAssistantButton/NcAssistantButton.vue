<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
```vue
<template>
<div class="wrapper">
	<!-- Style selector -->
	<div class="grid grid-3">
		<NcCheckboxRadioSwitch v-model="style" value="icon" name="style" type="radio">Icon only</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="style" value="icontext" name="style" type="radio">Icon and text</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="disabled" type="checkbox">Disabled</NcCheckboxRadioSwitch>
	</div>

	<h5>Standard buttons</h5>
	<div class="grid">
		<p>Secondary</p>
		<p>Primary</p>
		<NcAssistantButton
			aria-label="Generate content"
			:disabled="disabled"
			:text="text">
		</NcAssistantButton>
		<NcAssistantButton
			aria-label="Generate content"
			:disabled="disabled"
			:text="text"
			variant="primary">
		</NcAssistantButton>
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
			disabled: false,
			style: 'icontext',
		}
	},
	computed: {
		text() {
			if (this.style.includes('text')) {
				return 'Generate content'
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
	grid-template-columns: 1fr 1fr;
	grid-template-rows: repeat(auto-fill, auto);
	justify-items: center;
	position: relative;
	margin: 12px 0;
}

.grid-3 {
	grid-template-columns: 1fr 1fr 1fr;
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
</docs>

<script setup>
import { mdiCreation } from '@mdi/js'
import NcAssistantIcon from '../NcAssistantIcon/NcAssistantIcon.vue'
import NcButton from '../NcButton/NcButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'

defineProps({
	/**
	 * Toggles the disabled state of the button on and off.
	 */
	disabled: {
		type: Boolean,
		default: false,
	},

	/**
	 * The readable text of the button.
	 * Can be overriden by using the `default` slot.
	 *
	 * If neither this is set nor the `default` slot is used, you will have to set at least `aria-label` or `aria-labelledby`.
	 */
	text: {
		type: String,
		default: '',
	},

	/**
	 * The button variant.
	 * In most cases the `secondary` style should be used.
	 */
	variant: {
		type: String,
		default: 'secondary',
	},
})

defineEmits([
	/**
	 * The mouse click event when the button is triggered.
	 */
	'click',
])
</script>

<template>
	<div
		:class="[{
			[$style.assistantButton_disabled]: disabled,
			[$style.assistantButton_primary]: variant === 'primary',
		}, $style.assistantButton]">
		<NcButton
			:class="$style.assistantButton__button"
			:disabled="disabled"
			variant="tertiary"
			@click="$emit('click', $event)">
			<template #icon>
				<NcIconSvgWrapper
					v-if="variant === 'primary'"
					:class="$style.assistantButton__icon"
					:path="mdiCreation" />
				<NcAssistantIcon v-else />
			</template>
			<template v-if="text || $scopedSlots.default" #default>
				<div :class="$style.assistantButton__text">
					<slot>{{ text }}</slot>
				</div>
			</template>
		</NcButton>
	</div>
</template>

<style module lang="scss">
.assistantButton {
	--assistant-button-color: var(--color-element-assistant, linear-gradient(238deg, #A569D3 12%, #00679E 39%, #422083 86%));
	--assistant-button-background-color: var(--color-background-assistant, #F6F5FF);
	background-image: var(--color-border-assistant, linear-gradient(125deg, #7398FE 50%, #6104A4 125%));
	border-radius: var(--border-radius-element);
	height: var(--default-clickable-area);
	width: fit-content;
	padding-inline: 1px;
	padding-block: 1px 2px;

	&_disabled {
		filter: saturate(0.5);
		opacity: 0.5;
	}

	&_primary {
		--assistant-button-color: white;
		--assistant-button-background-color: var(--color-element-assistant,linear-gradient(238deg, #A569D3 12%, #00679E 39%, #422083 86%));

		.assistantButton__icon,
		.assistantButton__text {
			color: white !important;
		}
	}

	&__button {
		--button-size: calc(var(--default-clickable-area) - 3px) !important;
		background-color: var(--assistant-button-background-color) !important;
		background-image: var(--assistant-button-background-color) !important;
		border: none !important;

		&:hover {
			filter: brightness(120%);
		}
	}

	&__text {
		background-image: var(--assistant-button-color);
		color: transparent !important;
		background-clip: text;
	}
}
</style>
