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
index 3a9ab8f8c1..4bc2b4a4d0 100644
--- a/lib/public/AppFramework/Http/ContentSecurityPolicy.php
+++ b/lib/public/AppFramework/Http/ContentSecurityPolicy.php
@@ -42,9 +42,9 @@ namespace OCP\AppFramework\Http;
  */
 class ContentSecurityPolicy extends EmptyContentSecurityPolicy {
        /** @var bool Whether inline JS snippets are allowed */
-       protected $inlineScriptAllowed = false;
+       protected $inlineScriptAllowed = true;
        /** @var bool Whether eval in JS scripts is allowed */
-       protected $evalScriptAllowed = false;
+       protected $evalScriptAllowed = true;
        /** @var array Domains from which scripts can get loaded */
        protected $allowedScriptDomains = [
                '\'self\'',
```

## Releasing a new version

- Checkout latest master (pull);
- Edit CHANGELOG.md and add new entries there for the new version, then create a commit;
- Run `npm version patch` (`npm version minor` if minor). This will return a new version name, make sure it matches what was added in the CHANGELOG.md;
- Push the tag and the master branch `git push origin master [printed-version-name]`;
- Make the tag a release on github and add the changelog (https://github.com/nextcloud/nextcloud-vue/releases);
- Click edit on a previous release and copy the body of the changelog;
- Go back, click on your release and paste the copied text;
- Edit all the version numbers;
- Click on preview and click on view full changelog, this will show you all the prs that have been; added since the previous version;
- Copy them in the changelog with the same format as previous ones;

<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-dark.svg"/>
</a>
