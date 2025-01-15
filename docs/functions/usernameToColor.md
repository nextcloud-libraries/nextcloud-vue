<!--
 - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
```js static
import usernameToColor from '@nextcloud/vue/functions/usernameToColor'
```

## Definition

```ts static
/**
 * Generate a color from a username
 * Originally taken from https://github.com/nextcloud/server/blob/master/core/js/placeholder.js
 *
 * @param {string} username Display name or user id to generate from
 * @return {{ r: number, g: number, b: number }} the RGB color
 */
declare function usernameToColor(username: string): { r: number, g: number, b: number }
```

## Usage

```vue
<template>
    <div>
        <NcTextField label="username" :value.sync="username" />
        <hr />
        <p class="color" :style="{ backgroundColor: color }">
            <span class="color-text">{{ color }}</span>
        </p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: 'alice',
        }
    },

    computed: {
        color() {
            const { r, g, b } = usernameToColor(this.username)
            return `rgb(${r}, ${g}, ${b})`
        },
    },
}
</script>

<style scoped>
.color {
    border-radius: var(--border-radius-large);
    width: 100%;
    padding: var(--default-grid-baseline);
    display: flex;
    align-items: center;
    justify-content: center;
}

.color-text {
    border-radius: var(--border-radius-large);
    background-color: white;
    color: black;
    padding: var(--default-grid-baseline);
}
</style>
```
