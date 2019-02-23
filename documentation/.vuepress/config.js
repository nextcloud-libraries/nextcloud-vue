const { sidebarTree } = require('../code/config')

generatedSidebar = sidebarTree('Test');
let componentsSidebar = {
    '/code/': [
        {
            title: 'Components',
            collapsable: false,
            children: generatedSidebar['/code/'].find(entry => entry.title === 'components').children
        },
        {
            title: 'Directives',
            collapsable: false,
            children: ['directives/Tooltip/']
        }
    ]
}
console.log(generatedSidebar)
module.exports = {
    title: 'Nextcloud Vue components',
    description: '',
    themeConfig: {
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Components', link: '/code/'}
        ],
        sidebar: Object.assign({}, componentsSidebar ),
        sidebarDepth: 0,
    },
    // load template compiler as well for VueCodeExample
    chainWebpack(config) {
        config.resolve.alias.set('vue', 'vue/dist/vue.common.js')
    }
};