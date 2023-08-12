<!--
  - @copyright Copyright (c) 2023 Ferdinand Thiessen
  -
  - @author Ferdinand Thiessen <opensource@fthiessen.de>
  -
  - @license AGPL-3.0-or-later
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
  -
  -->
<docs>
Dialog button component used by NcDialog in the actions slot to display the buttons passed by the `buttons` prop.
</docs>
<template>
	<NcButton :aria-label="props.label" :type="props.type" @click="handleClick">
		{{ props.label }}
		<template v-if="props.icon !== undefined" #icon>
			<component :is="props.icon" :size="20" />
		</template>
	</NcButton>
</template>

<script setup lang="ts">
import type { AsyncComponent, Component } from 'vue'
import NcButton from '../NcButton/index.js'

/**
 * Keep in sync with ./types.ts, can be dropped with Vue 3.3 which supports imported property types
 */
interface IDialogButton {
    label: string,
    icon?: Component | AsyncComponent,
    callback: () => void,
    type?: 'primary' | 'secondary' | 'error' | 'warning' | 'success'
}

const props = defineProps<IDialogButton>()
const emit = defineEmits<(e: 'click', event: MouseEvent) => void>()

/**
 * Handle clicking the button by calling the callback and emitting the `click` event
 *
 * @param e The click event
 */
const handleClick = (e: MouseEvent) => {
	props.callback?.()
	emit('click', e)
}

</script>
