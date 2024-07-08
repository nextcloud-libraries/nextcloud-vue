<!--
  - SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Vue components

[![REUSE status](https://api.reuse.software/badge/github.com/nextcloud-libraries/nextcloud-vue)](https://api.reuse.software/info/github.com/nextcloud-libraries/nextcloud-vue)
[![npm last version](https://img.shields.io/npm/v/@nextcloud/vue.svg?style=flat-square)](https://www.npmjs.com/package/@nextcloud/vue)
[![Dependabot status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?longCache=true&style=flat-square&logo=dependabot)](https://dependabot.com)

This repo contains the various Vue.js components that Nextcloud uses for its internal design and structure. It provides standardized UI elements for building Nextcloud app frontends with Vue.js.

## Documentation

A list of available components with examples to try out is available in the [documentation](https://nextcloud-vue-components.netlify.app).

The documentation is built from the latest development branch, for stable releases the documentation can be found matching the latest minor version:

- [master](https://nextcloud-vue-components.netlify.app).
- [7.x.x](https://stable7--nextcloud-vue-components.netlify.app/)
- [6.x.x](https://stable6--nextcloud-vue-components.netlify.app/)

## Getting started

### App example
If you want to check a real live example of a nextcloud app that uses this library, you can head over to https://github.com/skjnldsv/vueexample/
We will try to maintain this repository the best we can, but some example might be obsolete. Always check this [repository documentation](#documentation).

### Install the library

```bash
npm i --save @nextcloud/vue
```

### Usage

To use a component, just import it:

```js
import { NcAppNavigation, NcActions, NcActionButton } from '@nextcloud/vue'
```

### Registering all components.

> Be careful, this will registry all components and directives, even the ones not being used.

```js
import Vue from 'vue'
import { NextcloudVuePlugin } from '@nextcloud/vue'

Vue.use(NextcloudVuePlugin)
```

## Development setup

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

## Translations

This library uses translated strings.
When you edit/create a translated string, you need to run `npm run l10n:extract` to update the source files.
Our awesome translation community will then be notified and a bot will sync those changes automatically.

Nonetheless, it requires a bit of caution.
When you implement a translated string, import the `translate` or `translatePlural` and add it in your methods like so:
```vue
<template>
	<element>
		{{ t('Choose') }}
	</element>
</template>

<script>
import { translate as t } from '@nextcloud/l10n'

export default {
	methods: {
		t,
	},
}
</script>
```

Please note that using a translated string as an attribute will _NOT_ work.
But it will work if it's within an element (like the example above)
```vue
<template>
	<element :prop="t('This will not work')" />
</template>
```

You will instead have to define the string in the data section and use the relevant variable reference.
```vue
<template>
	<element :prop="chooseProp" />
</template>

<script>
export default {
	data() {
		return {
			chooseProp: t('Choose'),
		},
	}
}
</script>
```

## Styleguide

When developing new components or extending components, make sure to also have some bits of related documentation like examples, where applicable.
To test components and the documentation in that context, you can run `npm run styleguide` to run a local server that serves the style guide
with all the components.

### Using vue-devtools in Firefox

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

## Releasing a new version

- Pull the latest changes from `master` or `stableX`
- Checkout a new branch with the tag name (e.g `v4.0.1`): `git checkout -b v<version>`
- Run `npm version patch --no-git-tag-version` (`npm version minor --no-git-tag-version` if minor).
  This will return a new version name, make sure it matches what you expect
- Generate the changelog content from the [release](https://github.com/nextcloud-libraries/nextcloud-vue/releases) page.
  Create a draft release, select the previous tag, click `generate` then paste the content to the `CHANGELOG.md` file
  1. use the the version as tag AND title (e.g `v4.0.1`)
  2. add the changelog content as description (https://github.com/nextcloud-libraries/nextcloud-vue/releases)
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
