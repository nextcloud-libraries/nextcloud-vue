<!--
 - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

```js static
import Tooltip from '@nextcloud/vue/directives/Tooltip'
```

Tooltip directive based on [v-tooltip](https://github.com/Akryum/v-tooltip).

Note: it's preferred to use [native HTML title attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title) instead for accessibility.

## Usage

In a component register the directive and use the `v-tooltip` in the template with static or dynamic value:

```vue
<template>
    <button v-tooltip="'A tooltip text'">Hover me</button>
</template>
```

You can specify the tooltip position as a modifier:

```vue
<button v-tooltip.bottom="'You have new messages.'">Hover me</button>
```

The available positions are:
 - `'auto'`
 - `'auto-start'`
 - `'auto-end'`
 - `'top'`
 - `'top-start'`
 - `'top-end'`
 - `'right'`
 - `'right-start'`
 - `'right-end'`
 - `'bottom'`
 - `'bottom-start'`
 - `'bottom-end'`
 - `'left'`
 - `'left-start'`
 - `'left-end'`

You can also specify more options. 

```vue
<button v-tooltip="{ content: 'I\'m a tooltip', show: true, placement: 'right' }">
    I'm a button with a tooltip
</button>
```

For a full documentation see: [v-tooltip/README](https://github.com/Akryum/v-tooltip/blob/master/README.md#directive).
