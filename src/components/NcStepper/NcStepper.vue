<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import { mdiCheck } from '@mdi/js'
import { useResizeObserver } from '@vueuse/core'
import { computed, onMounted, useTemplateRef, watch } from 'vue'
import { t } from '../../l10n.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'

export interface NcStepperStep {
	/** The unique id of the step */
	id: string
	/** The label of the step */
	label: string
	/** A short description, shown below the label in the vertical orientation */
	description?: string
}

/**
 * The `id` of the current step.
 * When it does not match a step, the first step is the current one.
 */
const modelValue = defineModel<string>()

const props = withDefaults(defineProps<{
	/**
	 * The steps, in order.
	 */
	steps: NcStepperStep[]

	/**
	 * Show the steps in a row, or below each other.
	 * A row that does not fit scrolls sideways; below each other leaves room for a `description` per step and fits a narrow space.
	 */
	orientation?: 'horizontal' | 'vertical'

	/**
	 * Let the user go back to a completed step. Steps after the current one can never be selected.
	 */
	allowGoBack?: boolean

	/**
	 * The name of the steps for assistive technology, for example the name of the form they belong to.
	 */
	ariaLabel?: string
}>(), {
	orientation: 'horizontal',
	ariaLabel: t('Steps'),
})

const currentIndex = computed(() => Math.max(0, props.steps.findIndex((step) => step.id === modelValue.value)))

const listElement = useTemplateRef<HTMLOListElement>('list')

// A row that scrolls keeps the current step in view: when the step changes, when the row
// changes size, and once the font has loaded, as the steps get wider then. Only the row
// scrolls, not the page.
watch([currentIndex, listElement], keepCurrentInView, { flush: 'post' })
useResizeObserver(listElement, keepCurrentInView)
onMounted(() => document.fonts?.ready.then(keepCurrentInView))

/**
 * Scroll a row that does not fit so the current step is in view.
 */
function keepCurrentInView() {
	const list = listElement.value
	const current = list?.children[currentIndex.value] as HTMLElement | undefined
	if (!list || !current || list.scrollWidth <= list.clientWidth) {
		return
	}
	const listBox = list.getBoundingClientRect()
	const box = current.getBoundingClientRect()
	if (box.left < listBox.left || box.right > listBox.right) {
		// Move the current step to the middle, by the difference, so it works in both directions
		list.scrollLeft += (box.left + box.width / 2) - (listBox.left + listBox.width / 2)
	}
}

/**
 * The state of a step, from its position relative to the current step.
 *
 * @param index - The position of the step
 */
function stateOf(index: number): 'completed' | 'current' | 'upcoming' {
	if (index < currentIndex.value) {
		return 'completed'
	}
	return index === currentIndex.value ? 'current' : 'upcoming'
}

/**
 * Whether a step is a button to go back to it.
 *
 * @param index - The position of the step
 */
function canGoBackTo(index: number): boolean {
	return props.allowGoBack && index < currentIndex.value
}

/**
 * Make a completed step the current one, when going back is allowed.
 *
 * @param step - The step
 * @param index - The position of the step
 */
function goBackTo(step: NcStepperStep, index: number) {
	if (canGoBackTo(index)) {
		modelValue.value = step.id
	}
}
</script>

<template>
	<ol
		ref="list"
		:class="[$style.ncStepper, $style[`ncStepper_${orientation}`]]"
		:aria-label="ariaLabel">
		<li
			v-for="(step, index) in steps"
			:key="step.id"
			:class="[$style.ncStepper__item, $style[`ncStepper__item_${stateOf(index)}`]]"
			:aria-current="stateOf(index) === 'current' ? 'step' : undefined">
			<component
				:is="canGoBackTo(index) ? 'button' : 'div'"
				:type="canGoBackTo(index) ? 'button' : undefined"
				:class="[$style.ncStepper__step, { 'button-vue': canGoBackTo(index), [$style.ncStepper__step_button]: canGoBackTo(index) }]"
				@click="goBackTo(step, index)">
				<span :class="$style.ncStepper__marker" aria-hidden="true">
					<NcIconSvgWrapper
						v-if="stateOf(index) === 'completed'"
						inline
						:path="mdiCheck"
						:size="16" />
					<template v-else>
						{{ index + 1 }}
					</template>
				</span>
				<span :class="$style.ncStepper__text">
					<span :class="$style.ncStepper__name">
						{{ step.label }}
						<span v-if="stateOf(index) === 'completed'" class="hidden-visually">{{ t('Completed') }}</span>
					</span>
					<span v-if="orientation === 'vertical' && step.description" :class="$style.ncStepper__description">
						{{ step.description }}
					</span>
				</span>
			</component>
		</li>
	</ol>
</template>

<style lang="scss" module>
.ncStepper {
	--stepper-marker-size: 28px;
	display: flex;
	margin: 0;
	padding: 0;
	list-style: none;
}

.ncStepper__item {
	position: relative;
	display: flex;
	min-width: 0;
	color: var(--color-text-maxcontrast);

	// The line from this step to the next one
	&:not(:last-child)::after {
		content: '';
		position: absolute;
		background-color: var(--color-border-dark);
	}
}

.ncStepper__item_completed {
	color: var(--color-main-text);

	// The line after a completed step leads to a step that has been reached
	&:not(:last-child)::after {
		background-color: var(--color-primary-element);
	}
}

.ncStepper__item_current {
	color: var(--color-main-text);
	font-weight: bold;
}

.ncStepper__step {
	display: flex;
	gap: calc(2 * var(--default-grid-baseline));
	min-width: 0;
	margin: 0;
	padding: var(--default-grid-baseline);
	border: none;
	border-radius: var(--border-radius-element);
	color: inherit;
	background: none;
	font: inherit;
	text-align: inherit;
}

.ncStepper__step_button {
	cursor: pointer;

	&:hover {
		background-color: var(--color-background-hover);
	}

	&:focus-visible {
		outline: 2px solid var(--color-main-text);
		outline-offset: 2px;
	}
}

.ncStepper__marker {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	// The border is part of the size, so the lines line up with the middle of the marker
	box-sizing: border-box;
	width: var(--stepper-marker-size);
	height: var(--stepper-marker-size);
	border: 2px solid var(--color-border-dark);
	border-radius: 50%;
	color: var(--color-text-maxcontrast);
	background-color: var(--color-main-background);
	font-weight: bold;
}

.ncStepper__item_completed .ncStepper__marker,
.ncStepper__item_current .ncStepper__marker {
	border-color: var(--color-primary-element);
	color: var(--color-primary-element-text);
	background-color: var(--color-primary-element);
}

.ncStepper__text {
	display: flex;
	flex-direction: column;
	min-width: 0;
}

.ncStepper__name {
	overflow-wrap: anywhere;
}

.ncStepper__description {
	color: var(--color-text-maxcontrast);
	font-weight: normal;
}

// In a row: the marker above the name, the line between the markers. A name is never broken
// inside a word, the row scrolls instead, with room for the focus outline it would clip.
.ncStepper_horizontal {
	padding: 4px;
	overflow-x: auto;
	scrollbar-width: thin;

	.ncStepper__item {
		flex: 1 1 0;
		justify-content: center;
		min-width: max-content;

		&::after {
			inset-block-start: calc(var(--default-grid-baseline) + var(--stepper-marker-size) / 2 - 1px);
			inset-inline: calc(50% + var(--stepper-marker-size) / 2 + var(--default-grid-baseline)) calc(-50% + var(--stepper-marker-size) / 2 + var(--default-grid-baseline));
			height: 2px;
		}
	}

	.ncStepper__name {
		overflow-wrap: normal;
	}

	.ncStepper__step {
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
}

// Below each other: the marker in front of the name, the line between the markers
.ncStepper_vertical {
	flex-direction: column;
	gap: calc(4 * var(--default-grid-baseline));

	// From just below the marker to just above the marker of the next step
	.ncStepper__item::after {
		inset-block: calc(2 * var(--default-grid-baseline) + var(--stepper-marker-size)) calc(-4 * var(--default-grid-baseline));
		inset-inline-start: calc(var(--default-grid-baseline) + var(--stepper-marker-size) / 2 - 1px);
		width: 2px;
	}

	// The first line of the name is centered on the marker
	.ncStepper__name {
		line-height: var(--stepper-marker-size);
	}
}

// Forced colors replace the fills that mark the state, so mark the current step with the
// system highlight color
@media (forced-colors: active) {
	.ncStepper__item_current .ncStepper__marker {
		border-color: Highlight;
		forced-color-adjust: none;
		color: HighlightText;
		background-color: Highlight;
	}
}
</style>

<docs>
### General description

This component shows a sequence of steps and where the user is in it, such as the pages of a form or the stages an item goes through.

It only shows the steps: moving to another step, for example with a "Next" button, is up to the app.

### Usage

```vue
<template>
	<div class="stepper-example">
		<NcStepper v-model="current" :steps="steps" aria-label="Create a team" />
		<div class="stepper-example__buttons">
			<NcButton :disabled="index === 0" @click="current = steps[index - 1].id">
				Back
			</NcButton>
			<NcButton variant="primary" :disabled="index === steps.length - 1" @click="current = steps[index + 1].id">
				Next
			</NcButton>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			current: 'details',
			steps: [
				{ id: 'name', label: 'Name' },
				{ id: 'details', label: 'Details' },
				{ id: 'members', label: 'Members' },
				{ id: 'review', label: 'Review' },
			],
		}
	},

	computed: {
		index() {
			return this.steps.findIndex((step) => step.id === this.current)
		},
	},
}
</script>

<style scoped>
.stepper-example {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.stepper-example__buttons {
	display: flex;
	gap: 8px;
}
</style>
```

### Going back to a completed step

```vue
<template>
	<div>
		<NcStepper
			v-model="current"
			:steps="steps"
			allow-go-back
			aria-label="Order" />
		<p>Current step: {{ current }}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			current: 'payment',
			steps: [
				{ id: 'cart', label: 'Cart' },
				{ id: 'address', label: 'Address' },
				{ id: 'payment', label: 'Payment' },
				{ id: 'confirm', label: 'Confirmation' },
			],
		}
	},
}
</script>
```

### Vertical, with descriptions

```vue
<template>
	<NcStepper
		v-model="current"
		:steps="steps"
		orientation="vertical"
		aria-label="Application" />
</template>

<script>
export default {
	data() {
		return {
			current: 'review',
			steps: [
				{ id: 'submitted', label: 'Submitted', description: 'Received on 3 November' },
				{ id: 'review', label: 'In review', description: 'A colleague checks the application' },
				{ id: 'decision', label: 'Decision', description: 'Usually within two weeks' },
			],
		}
	},
}
</script>
```
</docs>
