<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

```ts static
import {
    isDarkTheme,
    checkIfDarkTheme,
} from '@nextcloud/vue/dist/Functions/isDarkTheme.js'
```

Check whether the dark theme is enabled in Nextcloud. 

You should not use `window.matchMedia.('(prefers-color-scheme: dark)')`. It checks for the user's system theme, but Nextcloud Dark theme could be enabled even on the light system theme.

You should not use `[data-themes*=dark]` or `[data-theme-dark]` attributes on the body. It checks for explicitly set dark theme, but a user may use the system theme.

## Definitions

```ts static
/**
 * Check whether the dark theme is enabled in Nextcloud
 *
 * @param el - the element to check for the dark theme
 * @return {boolean}
 */
declare function checkIfDarkTheme(el: HTMLElement = document.body): boolean;

/**
 * Whether the dark theme is enabled in Nextcloud.
 * The variable is defined on page load and not reactive.
 * Use `checkIfDarkTheme` if you need to check it at a specific moment.
 * Use `useDarkTheme` if you need a reactive variable in a Vue component.
 *
 * @type {boolean}
 */
declare var isDarkTheme
```
