<!--
 - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<docs>
### Basic usage

```vue
<template>
	<div style="display: flex; gap: 8px; flex-wrap: wrap;">
		<NcChip text="Notes.txt" />
		<NcChip text="Files" :icon-path="mdiFile" />
		<NcChip text="Color" :icon-path="mdiPalette" variant="tertiary" />
		<NcChip text="Current time" :icon-path="mdiClock" no-close variant="primary" />
	</div>
</template>
<script>
import { mdiClock, mdiFile, mdiPalette } from '@mdi/js'

export default {
	setup() {
		return {
			mdiClock,
			mdiFile,
			mdiPalette,
		}
	}
}
</script>
```

### Advanced usage

It is also possible to use custom components for the icon by using the `icon` slot.
In this example we are using the `NcAvatar` component to render the users avatar as the icon.

*Hint: If you use round icons like avatars you should set their size to `24px` (or use CSS variable `--chip-size`) to make them fully fill and align with the the chip*

Also it is possible to pass custom actions.

```vue
<template>
	<NcChip>
		<!-- The icon slot allow to use custom components as the chip icon -->
		<template #icon>
			<NcAvatar :size="24" user="jdoe" display-name="J. Doe" />
		</template>
		<!-- The actions slot allows to add custom actions -->
		<template #actions>
			<NcActionButton>
				<template #icon>
					<ContactsIcon :size="20" />
				</template>
				Add to contacts
			</NcActionButton>
		</template>
		<!-- The default slot can be used for add content, just like the `text` prop -->
		J. Doe
	</NcChip>
</template>
<script>
import ContactsIcon from 'vue-material-design-icons/Contacts.vue'
export default {
	components: {
		ContactsIcon,
	},
}
</script>
```
</docs>

<template>
	<div class="nc-chip"
		:class="{
			[`nc-chip--${realVariant}`]: true,
			'nc-chip--no-actions': noClose && !hasActions(),
			'nc-chip--no-icon': !hasIcon(),
		}">
		<span v-if="hasIcon()" class="nc-chip__icon">
			<!-- @slot The icon slot can be used to set the chip icon. Make sure that the icon is not exceeding a height of `24px`. For round icons a exact size of `24px` is recommended. -->
			<slot name="icon">
				<!-- The default icon wrapper uses a size of 18px to ensure the icon is not clipped by the round chip style -->
				<NcIconSvgWrapper v-if="iconPath || iconSvg"
					inline
					:path="iconPath"
					:svg="iconPath ? undefined : iconSvg"
					:size="18" />
			</slot>
		</span>
		<span class="nc-chip__text">
			<!-- @slot The default slot can be used to set the text that is shown -->
			<slot>{{ text }}</slot>
		</span>
		<NcActions v-if="canClose || hasActions()"
			class="nc-chip__actions"
			:container="actionsContainer"
			:force-menu="!canClose"
			variant="tertiary-no-background">
			<NcActionButton v-if="canClose"
				close-after-click
				@click="onClose">
				<template #icon>
					<NcIconSvgWrapper :path="mdiClose" :size="20" />
				</template>
				{{ ariaLabelClose }}
			</NcActionButton>
			<!-- @slot The actions slot can be used to add custom actions to the chips actions -->
			<slot name="actions" />
		</NcActions>
	</div>
</template>

<script setup>
import { mdiClose } from '@mdi/js'
import { computed, useSlots } from 'vue'
import { t } from '../../l10n.js'

import NcActions from '../NcActions/NcActions.vue'
import NcActionButton from '../NcActionButton/NcActionButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'

const props = defineProps({
	/**
	 * aria label to set on the close button
	 * @default 'Close'
	 */
	ariaLabelClose: {
		type: String,
		default: t('Close'),
	},

	/**
	 * Container for the actions
	 */
	actionsContainer: {
		type: String,
		default: 'body'
	},

	/**
	 * Main text of the chip.
	 */
	text: {
		type: String,
		default: '',
	},

	/**
	 * Set the chips design variant-
	 *
	 * This sets the background style of the chip, similar to NcButton's `variant`.
	 * @deprecated will be removed with v9 - use `variant` instead.
	 */
	type: {
		type: String,
		default: 'secondary',
		validator: (value) => ['primary', 'secondary', 'tertiary'].includes(value),
	},

	/**
	 * SVG path of the icon to use, this takes precedence over `iconSVG`.
	 * For example icon paths from `@mdi/js` can be used.
	 */
	iconPath: {
		type: String,
		default: null,
	},

	/**
	 * Inline SVG to use as the icon
	 */
	iconSvg: {
		type: String,
		default: null,
	},

	/**
	 * Set to true to prevent the close button to be shown
	 */
	noClose: {
		type: Boolean,
		default: false,
	},

	/**
	 * Set the chips design variant-
	 *
	 * This sets the background style of the chip, similar to NcButton's `variant`.
	 * @since 8.24.0
	 */
	variant: {
		type: String,
		default: 'secondary',
		validator: (value) => ['primary', 'secondary', 'tertiary'].includes(value),
	},
})

const emit = defineEmits(['close'])
const slots = useSlots()

// TODO: Replace with just `variant` in v9
const realVariant = computed(() => props.type !== 'secondary' ? props.type : props.variant)

const canClose = computed(() => !props.noClose)
const hasActions = () => Boolean(slots.actions?.())
const hasIcon = () => Boolean(props.iconPath || props.iconSvg || !!slots.icon?.())

const onClose = () => {
	/**
	 * Emitted when the close button is clicked
	 */
	emit('close')
}
</script>

<style scoped lang="scss">
.nc-chip {
	--chip-size: 24px;
	--chip-radius: calc(var(--chip-size) / 2);
	// Setup size of wrapper
	height: var(--chip-size);
	max-width: fit-content;
	display: flex;
	flex-direction: row;
	align-items: center;
	border-radius: var(--chip-radius);
	background-color: var(--color-background-hover);

	&--primary {
		background-color: var(--color-primary-element);
		color: var(--color-primary-element-text);
	}

	&--secondary {
		background-color: var(--color-primary-element-light);
		color: var(--color-primary-element-light-text);
	}

	&--no-actions &__text {
		// If there are no actions we need to add some padding to ensure the text is not cut-off
		padding-inline-end: calc(1.5 * var(--default-grid-baseline));
	}

	&--no-icon &__text {
		// Add some more space to the border
		padding-inline-start: calc(1.5 * var(--default-grid-baseline));
	}

	&__text {
		// Allow to grow the text
		// this is only used if an app forces a width of the chip
		flex: 1 auto;

		overflow: hidden;
		text-overflow: ellipsis;
		text-wrap: nowrap;
	}

	&__icon {
		// Do neither grow nor shrink, size is fixed
		flex: 0 0 var(--chip-size);
		margin-inline-end: var(--default-grid-baseline);

		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;

		// Force size
		overflow: hidden;
		height: var(--chip-size);
		width: var(--chip-size);
	}

	&__actions {
		// Do neither grow nor shrink, size is fixed
		flex: 0 0 var(--chip-size);
		// Adjust action size to match chip size
		--default-clickable-area: var(--chip-size);
		--border-radius-element: var(--chip-radius);
	}
}
</style>
