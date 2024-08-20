<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

```ts static
import {
    useIsDarkTheme,
    useIsDarkThemeElement,
} from '@nextcloud/vue/dist/Composables/useIsDarkTheme.js'
```

Same as `isDarkTheme` functions, but with reactivity.

## Definition

```ts static
/**
 * Check whether the dark theme is enabled in Nextcloud on a specific element.
 * If you need to check a whole page, use `useIsDarkTheme` instead.
 *
 * @param el - the element to check for the dark theme enabled on
 * @return {ComputedRef<boolean>} - computed boolean whether the dark theme is enabled
 */
declare function useIsDarkThemeElement(el: MaybeRef<HTMLElement> = document.body): ComputedRef<boolean>

/**
 * Shared composable to check whether the dark theme is enabled in Nextcloud
 *
 * @return {ComputedRef<boolean>} - computed boolean whether the dark theme is enabled
 */
declare function useIsDarkTheme(): ComputedRef<boolean>
```

## Example

```vue
<template>
    <div>
        Is dark theme enabled? {{ isDarkTheme }}
        <NcButton type="tertiary" @click="switchTheme">Switch theme</NcButton>
    </div>
</template>

<script>
export default {
    setup() {
        const isDarkTheme = useIsDarkTheme()

        // For documentation only. Do not use in production.
        const switchTheme = () => {
            if (isDarkTheme.value) {
                document.body.setAttribute('data-theme-light')
                document.body.removeAttribute('data-theme-dark')
                document.body.setAttribute('data-themes', 'light')
            } else {
                document.body.setAttribute('data-theme-dark')
                document.body.removeAttribute('data-theme-light')
                document.body.setAttribute('data-themes', 'dark')
            }
        }

        return {
            isDarkTheme,
            switchTheme,
        }
    },
}
</script>
```