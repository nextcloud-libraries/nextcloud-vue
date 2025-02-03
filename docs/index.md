[![npm last version](https://img.shields.io/npm/v/@nextcloud/vue.svg?style=flat-square)](https://www.npmjs.com/package/@nextcloud/vue)
[![build status](https://img.shields.io/github/actions/workflow/status/nextcloud-libraries/nextcloud-vue/node.yml?style=flat-square)](https://github.com/nextcloud-libraries/nextcloud-vue/actions/workflows/node.yml?query=branch%3Amaster)
[![Dependabot status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?longCache=true&style=flat-square&logo=dependabot)](https://dependabot.com)
[![Test status](https://img.shields.io/github/actions/workflow/status/nextcloud-libraries/nextcloud-vue/npm-test.yml?style=flat-square&label=Test%20status)](https://github.com/nextcloud-libraries/nextcloud-vue/actions/workflows/npm-test.yml?query=branch%3Amaster)
[![irc](https://img.shields.io/badge/IRC-%23nextcloud--dev%20on%20freenode-blue.svg?style=flat-square)](https://webchat.freenode.net/?channels=nextcloud-dev)

<!--
 - SPDX-FileCopyrightText: 2020-2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

> 🖼️ Nextcloud UI Kit for building Nextcloud apps with Vue

- ✨ Standardized UI Components
- 🛠️ Composables and frontend utilities
- 🔗 [Reference providers](https://docs.nextcloud.com/server/latest/developer_manual/digging_deeper/reference.html) utilities

## 📄 Documentation

| Version        | Target                | Documentation                                         |
|----------------|-----------------------|-------------------------------------------------------|
| v9.x [next]    | Nextcloud 30+ (Vue 3) | https://next--nextcloud-vue-components.netlify.app    |
| v8.x [master]  | Nextcloud 28+ (Vue 2) | https://nextcloud-vue-components.netlify.app          |
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
