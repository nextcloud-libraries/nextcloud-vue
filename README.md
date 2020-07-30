# Vue components

[![npm last version](https://img.shields.io/npm/v/@nextcloud/vue.svg?style=flat-square)](https://www.npmjs.com/package/@nextcloud/vue)
[![travis build status](https://img.shields.io/travis/com/nextcloud/nextcloud-vue/master.svg?style=flat-square)](https://travis-ci.com/nextcloud/nextcloud-vue)
[![Dependabot status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?longCache=true&style=flat-square&logo=dependabot)](https://dependabot.com)
[![Codacy Badge](https://img.shields.io/codacy/grade/57e9764b68904cbf8f9e050c33340ab4.svg?style=flat-square)](https://app.codacy.com/app/nextcloud/nextcloud-vue)
[![Code coverage](https://img.shields.io/codecov/c/github/nextcloud/nextcloud-vue.svg?style=flat-square)](https://codecov.io/gh/nextcloud/nextcloud-vue/)
[![irc](https://img.shields.io/badge/IRC-%23nextcloud--dev%20on%20freenode-blue.svg?style=flat-square)](https://webchat.freenode.net/?channels=nextcloud-dev)

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

## Releasing a new version

1. Checkout latest master
2. Run `npm version`
3. Push the tag and the master branch
4. Make the tag a release on github and add the changelog (https://github.com/nextcloud/nextcloud-vue/releases)

<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-dark.svg"/>
</a>
