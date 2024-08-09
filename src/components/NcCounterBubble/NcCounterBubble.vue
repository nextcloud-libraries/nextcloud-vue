<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

 <docs>

### Normal Counter

```
<NcCounterBubble>314+</NcCounterBubble>
```

### Outlined Counter (e.g team mentions)

```
<NcCounterBubble type="outlined">314+</NcCounterBubble>
```

### Highlighted Counter (e.g direct mentions)

```
<NcCounterBubble type="highlighted">314+</NcCounterBubble>
```

</docs>

<template>
	<div :class="counterClassObject"
		class="counter-bubble__counter">
		<slot />
	</div>
</template>

<script>

export default {
	name: 'NcCounterBubble',

	props: {
		type: {
			type: String,
			default: '',
			validator(value) {
				return ['highlighted', 'outlined', ''].indexOf(value) !== -1
			},
		},

		/**
		 * Specifies whether the component is used within a component that is
		 * active and therefore has a primary background. Inverts the color of
		 * this component when that is the case.
		 */
		active: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		counterClassObject() {
			return {
				'counter-bubble__counter--highlighted': this.type === 'highlighted',
				'counter-bubble__counter--outlined': this.type === 'outlined',
				active: this.active,
			}
		},
	},
}

</script>

<style lang="scss" scoped>
.counter-bubble__counter {
	--counter-bubble-line-height: 1em;
	font-size: calc(var(--default-font-size) * .8);
	overflow: hidden;
	width: fit-content;
	max-width: var(--default-clickable-area);
	min-width: calc(var(--counter-bubble-line-height) + 2 * var(--default-grid-baseline)); // Make it not narrower than a circle
	text-align: center;
	text-overflow: ellipsis;
	line-height: var(--counter-bubble-line-height);
	padding: var(--default-grid-baseline);
	border-radius: var(--border-radius-pill);
	background-color: var(--color-primary-element-light);
	font-weight: bold;
	color: var(--color-primary-element-light-text);

	& .active {
		color: var(--color-main-background);
		background-color: var(--color-primary-element-light);
	}

	&--highlighted {
		color: var(--color-primary-element-text);
		background-color: var(--color-primary-element);
	}

	&--highlighted.active {
		color: var(--color-primary-element);
		background-color: var(--color-main-background);
	}

	&--outlined {
		color: var(--color-primary-element);
		background: transparent;
		box-shadow: inset 0 0 0 2px;
	}
	&--outlined.active {
		color: var(--color-main-background);
		box-shadow: inset 0 0 0 2px;
	}
}

// Make it pixel perfect aligned
@supports (line-height: 1cap) {
	.counter-bubble__counter {
		// 1em is higher than one digit and makes it not perfectly vertically aligned
		// 1cap = hight of a digit (T character)
		--counter-bubble-line-height: 1cap;
	}
}
</style>
