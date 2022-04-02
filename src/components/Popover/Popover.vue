<!--
  - @copyright Copyright (c) 2019 Marco Ambrosini <marcoambrosini@pm.me>
  -
  - @author Marco Ambrosini <marcoambrosini@pm.me>
  -
  - @license GNU AGPL version 3 or any later version
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
-->

<docs>

### General description

This component is just a wrapper for the v-component plugin by Akryum,
please refer to this documentation for customization:
https://github.com/Akryum/v-tooltip

This components has two slots:
* 'trigger' which can be any html element and it will trigger the popover
this slot is optional since you can toggle the popover also by updating the
open prop on this component;

* a default slot that is for the content of the popover.

### Examples

With a `<button>` as a trigger:
```vue
<template>
	<Popover>
		<template #trigger>
			<button> I am the trigger </button>
		</template>
		<template>
		<h2>this is some content</h2>
		</template>
	</Popover>
</template>
```
</docs>

<template>
	<Dropdown ref="popover"
		:distance="10"
		:arrow-padding="10"
		v-bind="$attrs"
		v-on="$listeners">
		<!-- This will be the popover target (for the events and position) -->
		<slot name="trigger" />
		<!-- This will be the content of the popover -->
		<template #popper>
			<slot />
		</template>
	</Dropdown>
</template>

<script>
import { Dropdown } from 'floating-vue'

export default {
	name: 'Popover',
	components: {
		Dropdown,
	},

	mounted() {
		this.$watch(
			() => {
				// required because v-tooltip doesn't provide events
				// and @show is too early
				// see https://github.com/Akryum/v-tooltip/issues/661
				return this.$refs.popover.$refs.popper.isShown
			},
			(val) => {
				if (val) {
					/**
					 * Triggered after the tooltip was visually displayed.
					 *
					 * This is different from the 'show' and 'apply-show' which
					 * run earlier than this where there is no guarantee that the
					 * tooltip is already visible and in the DOM.
					 */
					this.$emit('after-show')
				} else {
					/**
					 * Triggered after the tooltip was visually hidden.
					 */
					this.$emit('after-hide')
				}
			}
		)
	},
}
</script>

<style lang="scss">

.resize-observer {
	position:absolute;
	top:0;
	left:0;
	z-index:-1;
	width:100%;
	height:100%;
	border:none;
	background-color:transparent;
	pointer-events:none;
	display:block;
	overflow:hidden;
	opacity:0
}

.resize-observer object {
	display:block;
	position:absolute;
	top:0;
	left:0;
	height:100%;
	width:100%;
	overflow:hidden;
	pointer-events:none;
	z-index:-1
}

$arrow-width: 10px;

.v-popper--theme-dropdown {
	&.v-popper__popper {
		z-index: 100000;
		top: 0;
		left: 0;
		display: block !important;

		filter: drop-shadow(0 1px 10px var(--color-box-shadow));

		.v-popper__inner {
			padding: 0;
			color: var(--color-main-text);
			border-radius: var(--border-radius);
			overflow: hidden;
			background: var(--color-main-background);
		}

		.v-popper__arrow-container {
			position: absolute;
			z-index: 1;
			width: 0;
			height: 0;
			border-style: solid;
			border-color: transparent;
			border-width: $arrow-width;
		}

		&[data-popper-placement^='top'] .v-popper__arrow-container {
			bottom: -$arrow-width;
			border-bottom-width: 0;
			border-top-color: var(--color-main-background);
		}

		&[data-popper-placement^='bottom'] .v-popper__arrow-container {
			top: -$arrow-width;
			border-top-width: 0;
			border-bottom-color: var(--color-main-background);
		}

		&[data-popper-placement^='right'] .v-popper__arrow-container {
			left: -$arrow-width;
			border-left-width: 0;
			border-right-color: var(--color-main-background);
		}

		&[data-popper-placement^='left'] .v-popper__arrow-container {
			right: -$arrow-width;
			border-right-width: 0;
			border-left-color: var(--color-main-background);
		}

		&[aria-hidden='true'] {
			visibility: hidden;
			transition: opacity var(--animation-quick), visibility var(--animation-quick);
			opacity: 0;
		}

		&[aria-hidden='false'] {
			visibility: visible;
			transition: opacity var(--animation-quick);
			opacity: 1;
		}
	}
}

</style>
