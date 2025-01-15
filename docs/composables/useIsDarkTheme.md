<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

```ts static
import {
    useIsDarkTheme,
    useIsDarkThemeElement,
} from '@nextcloud/vue/composables/useIsDarkTheme'
```

Same as `isDarkTheme` functions, but with reactivity.

## Definition

```ts static
/**
 * Check whether the dark theme is enabled on a specific element.
 * If you need to check an entire page, use `useIsDarkTheme` instead for better performance.
 * Reacts on element attributes change and system theme change.
 * @param el - The element to check for the dark theme enabled on, default is document.body
 * @return - computed boolean whether the dark theme is enabled
 */
declare function useIsDarkThemeElement(el: MaybeRef<HTMLElement> = document.body): DeepReadonly<Ref<boolean>>

/**
 * Shared composable to check whether the dark theme is enabled on the page.
 * Reacts on body data-theme-* attributes change and system theme change.
 * @return - computed boolean whether the dark theme is enabled
 */
declare function useIsDarkTheme(): DeepReadonly<Ref<boolean>>
```

## Example

```vue
<template>
    <div>
        <div :style="{ backgroundColor: isDarkTheme ? 'black' : 'white' }">
            Is dark theme enabled? {{ isDarkTheme }}
        </div>
        <NcButton @click="switchTheme">Switch theme</NcButton>
    </div>
</template>

<script>
export default {
    setup() {
        const isDarkTheme = useIsDarkTheme()

        // For documentation only. Do not use in production.
        function switchTheme() {
            if (isDarkTheme.value) {
                document.body.setAttribute('data-theme-light', '')
                document.body.removeAttribute('data-theme-dark')
                document.body.setAttribute('data-themes', 'light')
            } else {
                document.body.setAttribute('data-theme-dark', '')
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