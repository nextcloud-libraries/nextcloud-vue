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
		<button slot="trigger"> I am the trigger </button>
		<template>
		<h2>this is some content</h2>
		</template>
	</Popover>
</template>
```
</docs>

<template>
	<VPopover
		v-bind="$attrs"
		popover-base-class="popover"
		popover-wrapper-class="popover__wrapper"
		popover-arrow-class="popover__arrow"
		popover-inner-class="popover__inner"
		v-on="$listeners">
		<!-- This will be the popover target (for the events and position) -->
		<slot name="trigger" />
		<!-- This will be the content of the popover -->
		<template slot="popover">
			<slot />
		</template>
	</VPopover>
</template>

<script>
import { VPopover } from 'v-tooltip'

export default {
	name: 'Popover',
	components: {
		VPopover,
	},
}
</script>

<style lang="scss">
$arrow-width: 10px;

.popover {
	z-index: 100000;
	display: block !important;

	filter: drop-shadow(0 1px 10px var(--color-box-shadow));

	&__inner {
		padding: 0;
		color: var(--color-main-text);
		border-radius: var(--border-radius);
		background: var(--color-main-background);
	}

	&__arrow {
		position: absolute;
		z-index: 1;
		width: 0;
		height: 0;
		margin: $arrow-width;
		border-style: solid;
		border-color: var(--color-main-background);
	}

	&[x-placement^='top'] {
		margin-bottom: $arrow-width;

		.popover__arrow {
			bottom: -$arrow-width;
			left: calc(50% - $arrow-width);
			margin-top: 0;
			margin-bottom: 0;
			border-width: $arrow-width $arrow-width 0 $arrow-width;
			border-right-color: transparent !important;
			border-bottom-color: transparent !important;
			border-left-color: transparent !important;
		}
	}

	&[x-placement^='bottom'] {
		margin-top: $arrow-width;

		.popover__arrow {
			top: -$arrow-width;
			left: calc(50% - $arrow-width);
			margin-top: 0;
			margin-bottom: 0;
			border-width: 0 $arrow-width $arrow-width $arrow-width;
			border-top-color: transparent !important;
			border-right-color: transparent !important;
			border-left-color: transparent !important;
		}
	}

	&[x-placement^='right'] {
		margin-left: $arrow-width;

		.popover__arrow {
			top: calc(50% - $arrow-width);
			left: -$arrow-width;
			margin-right: 0;
			margin-left: 0;
			border-width: $arrow-width $arrow-width $arrow-width 0;
			border-top-color: transparent !important;
			border-bottom-color: transparent !important;
			border-left-color: transparent !important;
		}
	}

	&[x-placement^='left'] {
		margin-right: $arrow-width;

		.popover__arrow {
			top: calc(50% - $arrow-width);
			right: -$arrow-width;
			margin-right: 0;
			margin-left: 0;
			border-width: $arrow-width 0 $arrow-width $arrow-width;
			border-top-color: transparent !important;
			border-right-color: transparent !important;
			border-bottom-color: transparent !important;
		}
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

</style>
