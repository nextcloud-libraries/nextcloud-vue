<!--
 - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

### Registration

To use any composable, import and use it according to documentation or Vue guidelines, for example:

```js static
import { useIsMobile } from '@nextcloud/vue/dist/composables/useIsMobile.js'

export default {
	setup() {
		return {
			isMobile: useIsMobile(),
		}
	},
}
```
or in `<script setup>`:

```js static
import { useIsMobile } from '@nextcloud/vue/dist/composables/useIsMobile.js'

const isMobile = useIsMobile()
```
