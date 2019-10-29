[![npm last version](https://img.shields.io/npm/v/@nextcloud/vue.svg?style=flat-square)](https://www.npmjs.com/package/@nextcloud/vue)
[![travis build status](https://img.shields.io/travis/com/nextcloud/nextcloud-vue/master.svg?style=flat-square)](https://travis-ci.com/nextcloud/nextcloud-vue)
[![Dependabot status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?longCache=true&style=flat-square&logo=dependabot)](https://dependabot.com)
[![Codacy Badge](https://img.shields.io/codacy/grade/57e9764b68904cbf8f9e050c33340ab4.svg?style=flat-square)](https://app.codacy.com/app/nextcloud/nextcloud-vue)
[![Code coverage](https://img.shields.io/codecov/c/github/nextcloud/nextcloud-vue.svg?style=flat-square)](https://codecov.io/gh/nextcloud/nextcloud-vue/)
[![irc](https://img.shields.io/badge/IRC-%23nextcloud--dev%20on%20freenode-blue.svg?style=flat-square)](https://webchat.freenode.net/?channels=nextcloud-dev)

This repo contains the various Vue.js components that Nextcloud uses for its internal design and structure.

# Installation

```bash
npm i --save @nextcloud/vue
```

# Usage
```js static
import { AppNavigation } from '@nextcloud/vue'

export default {
    name: 'MyComponent',
    components: {
        AppNavigation
    }
}
```

You can also import individual module without bundling the full library.


```js static
import Avatar from '@nextcloud/vue/dist/Components/Avatar'
```

## Recommendations

Some components require Nextcloud functionality to work, so it is currently recommended to extend Vue with the following:

```js static
Vue.prototype.t = window.t
Vue.prototype.n = window.n
Vue.prototype.OC = window.OC
Vue.prototype.OCA = window.OCA
```

<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-dark.svg"/>
</a>
