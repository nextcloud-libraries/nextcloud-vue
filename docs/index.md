[![npm last version](https://img.shields.io/npm/v/@nextcloud/vue.svg?style=flat-square)](https://www.npmjs.com/package/@nextcloud/vue)
[![build status](https://img.shields.io/github/actions/workflow/status/nextcloud-libraries/nextcloud-vue/node.yml?style=flat-square)](https://github.com/nextcloud-libraries/nextcloud-vue/actions/workflows/node.yml?query=branch%3Amaster)
[![Dependabot status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?longCache=true&style=flat-square&logo=dependabot)](https://dependabot.com)
[![Test status](https://img.shields.io/github/actions/workflow/status/nextcloud-libraries/nextcloud-vue/npm-test.yml?style=flat-square&label=Test%20status)](https://github.com/nextcloud-libraries/nextcloud-vue/actions/workflows/npm-test.yml?query=branch%3Amaster)
[![irc](https://img.shields.io/badge/IRC-%23nextcloud--dev%20on%20freenode-blue.svg?style=flat-square)](https://webchat.freenode.net/?channels=nextcloud-dev)

This repo contains the various Vue.js components that Nextcloud uses for its internal design and structure.

# Installation

```bash
npm i --save @nextcloud/vue
```

# Usage
```js static
import { NcAppNavigation } from '@nextcloud/vue'

export default {
    name: 'MyComponent',
    components: {
        NcAppNavigation
    }
}
```

You can also import individual module without bundling the full library.


```js static
import NcAvatar from '@nextcloud/vue/dist/Components/NcAvatar'
```

## Recommendations

Some components require Nextcloud functionality to work, so it is currently recommended to extend Vue with the following:

```js static
Vue.prototype.OC = window.OC
Vue.prototype.OCA = window.OCA
```

<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-dark.svg"/>
</a>
