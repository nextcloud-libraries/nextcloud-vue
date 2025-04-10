<!--
  - SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# @nextcloud/vue

[![REUSE status](https://api.reuse.software/badge/github.com/nextcloud-libraries/nextcloud-vue)](https://api.reuse.software/info/github.com/nextcloud-libraries/nextcloud-vue)
[![npm last version](https://img.shields.io/npm/v/@nextcloud/vue.svg?style=flat)](https://www.npmjs.com/package/@nextcloud/vue)
[![Dependabot status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?longCache=true&style=flat&logo=dependabot)](https://dependabot.com)

> 🖼️ UI Kit for building Nextcloud apps with Vue

- ✨ Standardized UI Components
- 🛠️ Composables and frontend utilities
- 🔗 [Reference providers](https://docs.nextcloud.com/server/latest/developer_manual/digging_deeper/reference.html) utilities

## 📄 Documentation

| Version        | Target                | Documentation                                         |
|----------------|-----------------------|-------------------------------------------------------|
| v9.x [main]    | Nextcloud 30+ (Vue 3) | https://nextcloud-vue-components.netlify.app          |
| v8.x [stable8] | Nextcloud 28+ (Vue 2) | https://stable8--nextcloud-vue-components.netlify.app |
| v7.x [stable7] | Nextcloud 25 - 27     | https://stable7--nextcloud-vue-components.netlify.app |
| v6.x [stable6] | Nextcloud 24 - 25     | https://stable6--nextcloud-vue-components.netlify.app |

## 📦 Install

```bash
npm i @nextcloud/vue
```

## 🚀 Usage

Import corresponding components and other modules on use. Check the documentation for more details.

```js static
import NcButton from '@nextcloud/vue/components/NcButton'
import { useHotKey } from '@nextcloud/vue/composables/useHotKey'

// (Deprecated) Old import path 
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import { useHotKey } from '@nextcloud/vue/dist/Composables/useHotKey.js'
```

Import from a single root is available as well. Use with caution: this might lead to slower build time and larger bundles in some cases.

```js static
import { NcButton, useHotKey } from '@nextcloud/vue'
```

### (Deprecated) Registering all components

`NextcloudVuePlugin` registers all the components and directives globally.

> ⚠️ This installation method leads to extremely large bundle and removed in v9.\
> If you don't want to import component on usage you may use [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) instead.

```js static
import Vue from 'vue'
import { NextcloudVuePlugin } from '@nextcloud/vue'

Vue.use(NextcloudVuePlugin)
```
