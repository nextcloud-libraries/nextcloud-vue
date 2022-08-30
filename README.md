# Vue components

[![npm last version](https://img.shields.io/npm/v/@nextcloud/vue.svg?style=flat-square)](https://www.npmjs.com/package/@nextcloud/vue)
[![Dependabot status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?longCache=true&style=flat-square&logo=dependabot)](https://dependabot.com)

This repo contains the various Vue.js components that Nextcloud uses for its internal design and structure. It provides standardized UI elements for building Nextcloud app frontends with Vue.js.

## Documentation

A list of available components with examples to try out is available in the [documentation](https://nextcloud-vue-components.netlify.app).

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
import { AppNavigation } from '@nextcloud/vue'
```

Depending on which components you use, you might want to only import individual (separately bundled) components:

```js
import Avatar from '@nextcloud/vue/dist/Components/Avatar'
```


## Development setup

If you want to work on improving the components it’s best to run the latest code and link it to your local Nextcloud installation:

1. Install the dependencies with `npm ci`
2. Build the components every time you do changes: `npm run build`
3. Connect it to your local Nextcloud development setup:
    - In this repository do `npm link`
    - In the repository of an app do `npm link @nextcloud/vue` (you need to re-link any time you do `npm ci` in the app)
4. Then build the app with: `npm run build` (or watch for changes with `npm run watch`)

### Styleguide

When developing new components or extending compnents, make sure to also have some bits of related documentation like examples, where applicable.
To test components and the documentation in that context, you can run `npm run styleguide` to run a local server that serves the style guide
with all the components.

### Using vue-devtools in Firefox

If you want to use [vue-devtools](https://github.com/vuejs/vue-devtools) in Firefox, you need to patch your nextcloud instance as follow:

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

- Pull the latest changes from `master` or `stableX`;
- Checkout a new branch with the tag name (e.g `v4.0.1`): `git checkout -b v<version>`;
- Run `npm version patch --no-git-tag-version` (`npm version minor --no-git-tag-version` if minor). This will return a new version name, make sure it matches what you expect;
- Commit, push and create PR;
- Add the change log content from the 'Changelog' action on Github to `CHANGELOG.md`;
- Commit and push;
- Get your PR reviewed and merged;
- Create a milestone with the follow up version at https://github.com/nextcloud/nextcloud-vue/milestones
- Move all open tickets and PRs to the follow up
- Close the milestone of the version you release
- Create a release on github with the version as tag (e.g `v4.0.1`) and add the changelog content as description (https://github.com/nextcloud/nextcloud-vue/releases);
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
