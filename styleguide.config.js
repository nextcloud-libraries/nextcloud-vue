const path = require('path');

module.exports = {
  require: [
    path.join(__dirname, 'styleguide/global.requires.js'),
    path.join(__dirname, 'styleguide/assets/font.css'),
    path.join(__dirname, 'styleguide/assets/icons.css'),
    path.join(__dirname, 'styleguide/assets/additional.scss'),
  ],
  highlightTheme: '',
  pagePerSection: true,
  minimize: false,
  verbose: false,
  webpackConfig: Object.assign({}, require('./webpack.prod.js'), {
    externals: {},
    module: {
      rules: require('./webpack.prod.js').module.rules.filter((rule) => rule.use !== 'eslint-loader')
    }
  }),
  exampleMode: "expand",
  usageMode: "expand",
  components: 'src/components/*/*.vue',
  getComponentPathLine(componentPath) {
		const name = path.basename(componentPath, '.js')
		return `import { ${name} } from 'nextcloud-vue/dist/Components/${name}';`
	},
  sections: [
    {
      name: 'Introduction',
      content: 'docs/index.md',
      exampleMode: "hide",
      usageMode: "hide",
    },
    {
      name: 'Components',
      content: 'docs/components.md',
      components: 'src/components/*/*.vue',
      ignore: ['src/components/Actions/*.vue', 'src/components/Action[A-Z]*/*.vue'],
      sections: [
        {
          name: 'Actions',
          components: ['src/components/Actions/*.vue', 'src/components/Action[A-Z]*/*.vue'],
        }
      ]
    },
    {
      name: 'Directives',
      content: 'docs/directives.md',
    },
  ],
  ribbon: {
		text: 'Fork me on GitHub',
		url: 'https://github.com/nextcloud/vue-components'
  },
  editorConfig: {
    theme: 'material',
  },
  // see https://github.com/styleguidist/react-styleguidist/blob/master/src/client/styles/theme.js
  theme: {
    maxWidth: '100%',
    sidebarWidth: 280,
    spaceFactor: 20,
    color: {
      link: '#0082c9',
      linkHover: '#0082c9',
      sidebarBackground: '#ffffff',
      errorBackground: '#e22d44',
      ribbonBackground: '#0082c9'
    },
    fontFamily: {
      base: '"Nunito", "Open Sans", sans-serif'
    }
  },
}
