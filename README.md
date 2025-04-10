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

```js
import NcButton from '@nextcloud/vue/components/NcButton'
import { useHotKey } from '@nextcloud/vue/composables/useHotKey'

// (Deprecated) Old import path 
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import { useHotKey } from '@nextcloud/vue/dist/Composables/useHotKey.js'
```

Import from a single root is available as well. Use with caution: this might lead to slower build time and larger bundles in some cases.

```js
import { NcButton, useHotKey } from '@nextcloud/vue'
```

### (Deprecated) Registering all components

`NextcloudVuePlugin` registers all the components and directives globally.

> ⚠️ This installation method leads to extremely large bundle and removed in v9.\
> If you don't want to import component on usage you may use [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) instead.

```js
import Vue from 'vue'
import { NextcloudVuePlugin } from '@nextcloud/vue'

Vue.use(NextcloudVuePlugin)
```

## 🤝 Contributing

### 📜 How to contribute

1. It's always good to check/create an issue first and discuss the problem or feature you want to work on
2. Fork the repository and create a new branch
3. Make the changes
4. Check the change in Vue-Styleguidist and/or Nextcloud apps
   - Do not forget to `lint` and `test` your changes
   - If possible, add tests for your changes
5. Commit and push your changes, create a Pull Request
   - Make sure to follow the [Conventional Commits](https://www.conventionalcommits.org) in commit messages, and PR titles, for example:\
     `fix(NcButton): correct layout on Safari`
   - Make sure to follow the **Pull Request template**
   - Sign-off you commits for the [Developer Certificate of Origin (DCO)](https://developercertificate.org/)
6. Get your PR reviewed
   - If you don't receive a feedback in a week, feel free to mention the maintainers, for example, last developers worked on the module
7. Get your PR merged 

Please read the [Code of Conduct](https://nextcloud.com/community/code-of-conduct/). This document offers some guidance to ensure Nextcloud participants can cooperate effectively in a positive and inspiring atmosphere and to explain how together we can strengthen and support each other.

More information on how to contribute: [https://nextcloud.com/contribute/](https://nextcloud.com/contribute/)

### 🧑‍💻 Development setup

If you want to work on improving the components it’s best to run the latest code and link it to your local Nextcloud installation:

1. Install the dependencies with `npm ci`
2. Build the components every time you do changes: `npm run build`
    - To make development build: `npm run dev`
    - To watch for changes and rebuild automatically: `npm run watch`
    - To watch for changes and rebuild development build: `npm run dev:watch`
3. Connect it to your local Nextcloud development setup:
    - In this repository do `npm link`
    - In the repository of an app do `npm link @nextcloud/vue` (you need to re-link any time you do `npm ci` in the app)
4. Then build the app with: `npm run build` (or watch for changes with `npm run watch`)

### 🌐 Translations

Use `t` and `n` functions from `src/l10n.js` to display translated strings. They follow `gettext` and `ngettext` interface from [`@nextcloud/l10n/gettext`](https://nextcloud-libraries.github.io/nextcloud-l10n/modules/_nextcloud_l10n_gettext.html).

```vue
<script setup lang="ts">
import { t } from '../../l10n.js'
</script>

<template>
	<element>
		{{ t('Choose') }}
	</element>
</template>
```

When you edit/create a translated string, you need to update the l10n files.
Our awesome translation community will then be notified and a bot will sync translations automatically.

```sh
npm run l10n:extract
```

### 🐸 Styleguidist

When developing new components or extending components, make sure to also have some bits of related documentation like examples, where applicable.
To test components and the documentation in that context, you can run `npm run styleguide` to run a local server that serves the style guide
with all the components.

#### Using vue-devtools in Firefox

If you want to use [vue-devtools](https://github.com/vuejs/vue-devtools) in Firefox, you need to:

* Either enable the [HMR Enabler](https://github.com/nextcloud/hmr_enabler) app …
* … or patch your nextcloud instance as follows:

```diff
diff --git a/lib/public/AppFramework/Http/ContentSecurityPolicy.php b/lib/public/AppFramework/Http/ContentSecurityPolicy.php
index 0e3a6a705d..416b8b0fb9 100644
--- a/lib/public/AppFramework/Http/ContentSecurityPolicy.php
+++ b/lib/public/AppFramework/Http/ContentSecurityPolicy.php
@@ -41,9 +41,9 @@ namespace OCP\AppFramework\Http;
  */
 class ContentSecurityPolicy extends EmptyContentSecurityPolicy {
        /** @var bool Whether inline JS snippets are allowed */
-       protected $inlineScriptAllowed = false;
+       protected $inlineScriptAllowed = true;
        /** @var bool Whether eval in JS scripts is allowed */
-       protected $evalScriptAllowed = false;
+       protected $evalScriptAllowed = true;
        /** @var bool Whether strict-dynamic should be set */
        protected $strictDynamicAllowed = false;
        /** @var array Domains from which scripts can get loaded */
```

## 📤 Releasing a new version

- Pull the latest changes from `master` or `stableX`
- Checkout a new branch with the tag name (e.g `v4.0.1`): `git checkout -b v<version>`
- Run `npm version patch --no-git-tag-version` (`npm version minor --no-git-tag-version` if minor).
  This will return a new version name, make sure it matches what you expect
- Generate the changelog content from the [release](https://github.com/nextcloud-libraries/nextcloud-vue/releases) page.
  Create a draft release, select the previous tag, click `generate` then paste the content to the `CHANGELOG.md` file
  1. adjust the links to the merged pull requests and authors so that the changelog also works outside of GitHub
     by running `npm run prerelease:format-changelog`.
     This will apply this regex: `by @([^ ]+) in ((https://github.com/)nextcloud-libraries/nextcloud-vue/pull/(\d+))`
     Which this as the replacement: `[\#$4]($2) \([$1]($3$1)\)`
  2. use the the version as tag AND title (e.g `v4.0.1`)
  3. add the changelog content as description (https://github.com/nextcloud-libraries/nextcloud-vue/releases)
- Commit, push and create PR
- Get your PR reviewed and merged
- Create a milestone with the follow-up version at https://github.com/nextcloud-libraries/nextcloud-vue/milestones
- Move all open tickets and PRs to the follow-up
- Close the milestone of the version you release
- Publish the previously drafted release on GitHub
  ![image](https://user-images.githubusercontent.com/14975046/124442568-2a952500-dd7d-11eb-82a2-402f9170231a.png)

<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-dark.svg"/>
</a>

### Releasing a pre-release

A pre-release can be built in the same way as described above, however it requires manual adjustments to avoid that npm ships the pre-release to all users:

1. Retag latest to the last stable release

    npm dist-tag add @nextcloud/vue@5.4.0 latest

2. Tag the new pre-release as next

    npm dist-tag add @nextcloud/vue@6.0.0-beta.2 next
