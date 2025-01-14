<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

```ts static
import {
    isDarkTheme,
    checkIfDarkTheme,
} from '@nextcloud/vue/functions/isDarkTheme'
```

Check whether the dark theme is enabled in Nextcloud. 

You should not use `window.matchMedia.('(prefers-color-scheme: dark)')`. It checks for the user's system theme, but Nextcloud Dark theme could be enabled even on the light system theme.

You should not use `[data-themes*=dark]` or `[data-theme-dark]` attributes on the body. It checks for explicitly set dark theme, but a user may use the system or custom theme.

## Definitions

```ts static
/**
 * Check whether the dark theme is used on a specific element
 * @param el - Element to check for dark theme, which is used for `data-theme-*` checking (default is `document.body`)
 * @return - Whether the dark theme is enabled via Nextcloud theme
 */
declare function checkIfDarkTheme(el: HTMLElement = document.body): boolean;

/**
 * Whether the dark theme is enabled in Nextcloud.
 * The variable is defined on page load and not reactive.
 * Use `checkIfDarkTheme` if you need to check it at a specific moment.
 * Use `useDarkTheme` if you need a reactive variable in a Vue component.
 */
declare var isDarkTheme
```
