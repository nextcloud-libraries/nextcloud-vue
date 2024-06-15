<!--
 - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

### Registration

To use any directive, import and register it locally, for example:

```js static
import Tooltip from '@nextcloud/vue/dist/Directives/Tooltip.js'

export default {
    directives: {
        Tooltip,
    },
}
```
or in `<script setup>`:

```js static
import vTooltip from '@nextcloud/vue/dist/Directives/Tooltip.js'
```

You can also register any directive globally. But it is not recommended.

```js static
import Tooltip from '@nextcloud/vue/dist/Directives/Tooltip.js'

Vue.directive('Tooltip', Tooltip)
```
