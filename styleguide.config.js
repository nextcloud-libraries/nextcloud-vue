const path = require('path')
const { merge } = require('webpack-merge')
const webpackConfig = require('./webpack.config.js')

module.exports = async () => {
	const base = await webpackConfig()
	const newConfig = Object.assign({}, base, {
		externals: {},
		module: {
			// Ignore eslint
			rules: base.module.rules.filter(
				rule => rule.use !== 'eslint-loader'
			),
		},
	})

	return {
		require: [
			path.join(__dirname, 'styleguide/global.requires.js'),
			path.join(__dirname, 'styleguide/assets/icons.css'),
			path.join(__dirname, 'styleguide/assets/additional.css'),
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
					'src/components/NcAction*/*.vue',
					'src/components/NcAppContent*/*.vue',
					'src/components/NcAppNavigation*/*.vue',
					'src/components/NcAppSidebar*/*.vue',
					'src/components/NcBreadcrumb*/*.vue',
					'src/components/NcContent/*.vue',
					'src/components/NcDashboard*/*.vue',
					'src/components/NcMultiselect*/*.vue',
					'src/components/NcPopoverMenu/!(NcPopoverMenu).vue',
					'src/components/NcListItem*/*.vue',
					'src/components/NcAppSettings*/*.vue',
					'src/components/Nc*Picker/*.vue',
					'src/components/NcRichContenteditable/!(NcRichContenteditable).vue',
					'src/components/NcSettings*/*.vue',
					'src/components/NcUserBubble/NcUserBubbleDiv.vue',
					'src/components/Nc*Field/*.vue',
				],
				sections: [
					{
						name: 'NcActions',
						components: [
							// Put Actions component first
							'src/components/NcActions/*.vue',
							'src/components/NcAction[A-Z]*/*.vue',
						],
					},
					{
						name: 'App containers',
						components: [
							'src/components/NcContent/*.vue',
						],
						sections: [
							{
								name: 'NcAppNavigation',
								components: [
									'src/components/NcAppNavigation*/*.vue',
								],
							},
							{
								name: 'NcAppContent',
								components: [
									'src/components/NcAppContent*/*.vue',
								],
							},
							{
								name: 'NcAppSidebar',
								components: [
									'src/components/NcAppSidebar*/*.vue',
								],
							},
							{
								name: 'NcAppSettings',
								components: [
									'src/components/NcAppSettings*/*.vue',
								],
							},
						],
					},
					{
						name: 'NcBreadcrumbs',
						components: [
							'src/components/NcBreadcrumb*/*.vue',
						],
					},
					{
						name: 'NcDashboard',
						components: [
							'src/components/NcDashboard*/*.vue',
						],
					},
					{
						name: 'NcFields',
						components: [
							'src/components/Nc*Field/*.vue',
						],
					},
					{
						name: 'NcListItems',
						components: [
							'src/components/NcListItem*/*.vue',
						],
					},
					{
						name: 'NcMultiselect',
						components: [
							'src/components/NcMultiselect*/*.vue',
						],
					},
					{
						name: 'NcPickers',
						components: [
							'src/components/Nc*Picker/*.vue',
						],
					},
					{
						name: 'NcSettings',
						components: [
							'src/components/NcSettings*/*.vue',
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
}
