const path = require('path')
const { merge } = require('webpack-merge')
const webpackConfig = require('./webpack.config.js')

const newConfig = Object.assign({}, webpackConfig, {
	externals: {},
	module: {
		// Ignore eslint
		rules: webpackConfig.module.rules.filter(
			rule => rule.use !== 'eslint-loader'
		),
	},
})

module.exports = {
	require: [
		path.join(__dirname, 'styleguide/global.requires.js'),
		path.join(__dirname, 'styleguide/assets/icons.css'),
		path.join(__dirname, 'styleguide/assets/additional.scss'),
	],
	pagePerSection: true,
	minimize: true,
	verbose: false,

	webpackConfig: merge(newConfig, {
		// https://webpack.js.org/configuration/dev-server/#devserverproxy
		devServer: {
			proxy: {
				// redirect to the guest avatar endpoint
				'/index.php/avatar': {
					target: 'https://nextcloud.com/wp-content/themes/next/assets/img/common/nextcloud-square-logo.png',
					changeOrigin: true,
					ignorePath: true,
					secure: false,
				},
			},
		},
	}),

	exampleMode: 'expand',
	usageMode: 'expand',

	components: 'src/components/*/*.vue',
	getComponentPathLine(componentPath) {
		const name = path.basename(componentPath, '.vue')
		return `import ${name} from '@nextcloud/vue/dist/Components/${name}'`
	},

	sections: [
		{
			name: 'Introduction',
			content: 'docs/index.md',
			exampleMode: 'hide',
			usageMode: 'hide',
		},
		{
			name: 'Directives',
			content: 'docs/directives.md',
		},
		{
			name: 'Components',
			content: 'docs/components.md',
			components: 'src/components/*/*.vue',
			sectionDepth: 1,
			ignore: [
				'src/components/Action*/*.vue',
				'src/components/AppContent*/*.vue',
				'src/components/AppNavigation*/*.vue',
				'src/components/AppSidebar*/*.vue',
				'src/components/Breadcrumb*/*.vue',
				'src/components/Content/*.vue',
				'src/components/Dashboard*/*.vue',
				'src/components/Multiselect*/*.vue',
				'src/components/PopoverMenu/!(PopoverMenu).vue',
				'src/components/ListItem*/*.vue',
				'src/components/AppSettings*/*.vue',
				'src/components/*Picker/*.vue',
				'src/components/RichContenteditable/!(RichContenteditable).vue',
				'src/components/Settings*/*.vue',
				'src/components/UserBubble/UserBubbleDiv.vue',
				'src/components/InputField/InputField.vue',
			],
			sections: [
				{
					name: 'Actions',
					components: [
						// Put Actions component first
						'src/components/Actions/*.vue',
						'src/components/Action[A-Z]*/*.vue',
					],
				},
				{
					name: 'App containers',
					components: [
						'src/components/Content/*.vue',
					],
					sections: [
						{
							name: 'AppNavigation',
							components: [
								'src/components/AppNavigation*/*.vue',
							],
						},
						{
							name: 'AppContent',
							components: [
								'src/components/AppContent*/*.vue',
							],
						},
						{
							name: 'AppSidebar',
							components: [
								'src/components/AppSidebar*/*.vue',
							],
						},
						{
							name: 'AppSettings',
							components: [
								'src/components/AppSettings*/*.vue',
							],
						},
					],
				},
				{
					name: 'Breadcrumbs',
					components: [
						'src/components/Breadcrumb*/*.vue',
					],
				},
				{
					name: 'Dashboard',
					components: [
						'src/components/Dashboard*/*.vue',
					],
				},
				{
					name: 'List items',
					components: [
						'src/components/ListItem*/*.vue',
					],
				},
				{
					name: 'Multiselect',
					components: [
						'src/components/Multiselect*/*.vue',
					],
				},
				{
					name: 'Pickers',
					components: [
						'src/components/*Picker/*.vue',
					],
				},
				{
					name: 'Settings',
					components: [
						'src/components/Settings*/*.vue',
					],
				},
			],
		},
	],

	ribbon: {
		text: 'Fork me on GitHub',
		url: 'https://github.com/nextcloud/nextcloud-vue',
	},

	// see https://github.com/styleguidist/react-styleguidist/blob/master/src/client/styles/theme.js
	theme: {
		maxWidth: '900px',
		sidebarWidth: 280,
		spaceFactor: 20,
		color: {
			link: '#0082c9',
			linkHover: '#0082c9',
			sidebarBackground: '#ffffff',
			errorBackground: '#e22d44',
			ribbonBackground: '#0082c9',
		},
		fontFamily: {
			base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
		},
	},
}
