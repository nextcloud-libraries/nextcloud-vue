<!--
 - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

```js static
import Linkify from '@nextcloud/vue/directives/Linkify'
```

Automatically make links in rendered text clickable.

To use the directive, bind object with `linkify === true` and the text in the `text` property:

```vue
<template>
    <p v-linkify="{ linkify: true, text: 'Read more about Nextcloud on https://nextcloud.com' }"></p>
</template>
```