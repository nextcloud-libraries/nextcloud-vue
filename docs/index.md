[![npm last version](https://img.shields.io/npm/v/@nextcloud/vue.svg?style=flat-square)](https://www.npmjs.com/package/@nextcloud/vue)

This repo contains the various Vue.js components that Nextcloud uses for its internal design and structure.

Version | Supported Nextcloud versions | Documentation
--------|------------------------------|--------------
main    | Latest version               | https://nextcloud-vue-components.netlify.app
v8.x    | Nextcloud 28+                | https://stable8--nextcloud-vue-components.netlify.app
v7.x    | Nextcloud 25 - 27            | https://stable7--nextcloud-vue-components.netlify.app
v6.x    | Nextcloud 24 - 25            | https://stable6--nextcloud-vue-components.netlify.app

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
