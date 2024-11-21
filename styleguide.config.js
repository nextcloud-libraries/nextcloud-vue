/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

const path = require('path')
const { merge } = require('webpack-merge')
const webpackConfig = require('./webpack.config.js')

module.exports = async () => {
	const base = await webpackConfig()
	const newConfig = Object.assign({}, base, {
		// Necessary, because vue-styleguidist runs an old version of webpack-dev-server
		devServer: {
			historyApiFallback: true,
			noInfo: true,
			overlay: true,
		},
		externals: {},
		module: {
			// Ignore eslint
			rules: base.module.rules.filter(
				rule => rule.use !== 'eslint-loader',
			),
		},
	})

	return {
		require: [
			path.join(__dirname, 'styleguide/global.requires.js'),
			path.join(__dirname, 'styleguide/assets/icons.css'),
			path.join(__dirname, 'styleguide/assets/additional.css'),
			path.join(__dirname, 'styleguide/assets/styleguide.css'),
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
						target: 'https://raw.githubusercontent.com/nextcloud/promo/master/nextcloud-icon.png',
						changeOrigin: true,
						ignorePath: true,
						secure: false,
					},
				},
			},
			resolve: {
				alias: {
					vue$: 'vue/dist/vue.js',
				},
			},
		}),

		exampleMode: 'collapse',
		usageMode: 'collapse',

		components: 'src/components/*/*.vue',
		getComponentPathLine(componentPath) {
			const name = path.basename(componentPath, '.vue')
			return `import ${name} from '@nextcloud/vue/dist/Components/${name}.js'`
		},

		compilerConfig: {
			transforms: { asyncAwait: false },
		},

		sections: [
			{
				name: 'Introduction',
				content: 'docs/index.md',
				exampleMode: 'hide',
				usageMode: 'hide',
			},
			{
				name: 'Versions',
				sections: [
					{
						name: 'next v9.x (Nextcloud 28+ on Vue 3)',
						href: 'https://next--nextcloud-vue-components.netlify.app',
					},
					{
						name: 'current v8.x (Nextcloud 28+)',
						href: 'https://nextcloud-vue-components.netlify.app',
					},
					{
						name: 'v7.x (Nextcloud 25 - 27)',
						href: 'https://stable7--nextcloud-vue-components.netlify.app',
					},
					{
						name: 'v6.x (Nextcloud 24 - 25)',
						href: 'https://stable6--nextcloud-vue-components.netlify.app',
					},
				],
			},
			{
				name: 'Directives',
				content: 'docs/directives.md',
				sectionDepth: 1,
				sections: [
					{
						name: 'Focus',
						content: 'docs/directives/focus.md',
					},
					{
						name: 'Linkify',
						content: 'docs/directives/linkify.md',
					},
					{
						name: 'Tooltip',
						content: 'docs/directives/tooltip.md',
					},
				],
			},
			{
				name: 'Functions',
				content: 'docs/functions.md',
				sectionDepth: 1,
				sections: [
					{
						name: 'a11y',
						content: 'docs/functions/a11y.md',
					},
					{
						name: 'emoji',
						content: 'docs/functions/emoji.md',
					},
					{
						name: 'isDarkTheme',
						content: 'docs/functions/isDarkTheme.md',
					},
					{
						name: 'usernameToColor',
						content: 'docs/functions/usernameToColor.md',
					},
					{
						name: 'reference',
						content: 'docs/functions/reference.md',
					},
					{
						name: 'registerReference',
						content: 'docs/functions/registerReference.md',
					},
					{
						name: 'spawnDialog',
						content: 'docs/functions/spawnDialog.md',
					},
				],
			},
			{
				name: 'Composables',
				content: 'docs/composables.md',
				sectionDepth: 1,
				sections: [
					{
						name: 'useHotKey',
						content: 'docs/composables/useHotKey.md',

					},
					{
						name: 'useIsDarkTheme',
						content: 'docs/composables/useIsDarkTheme.md',
					},
				],
			},
			{
				name: 'Components',
				content: 'docs/components.md',
				components: 'src/components/*/*.vue',
				sectionDepth: 1,
				ignore: [
					'src/components/Nc*Field/*.vue',
					'src/components/Nc*Picker*/*.vue',
					'src/components/NcAction*/*.vue',
					'src/components/NcAppContent*/*.vue',
					'src/components/NcAppNavigation*/*.vue',
					'src/components/NcAppSettings*/*.vue',
					'src/components/NcAppSidebar*/*.vue',
					'src/components/NcBreadcrumb*/*.vue',
					'src/components/NcCheckboxRadioSwitch/NcCheckboxContent.vue',
					'src/components/NcCollectionList/!(NcCollectionList).vue',
					'src/components/NcContent/*.vue',
					'src/components/NcDashboard*/*.vue',
					'src/components/NcDialog*/*.vue',
					'src/components/NcHeader*/*.vue',
					'src/components/NcListItem*/*.vue',
					'src/components/NcMultiselect*/*.vue',
					'src/components/NcRichContenteditable/!(NcRichContenteditable).vue',
					'src/components/NcRichText*/*.vue',
					'src/components/NcSelect*/*.vue',
					'src/components/NcSettings*/*.vue',
					'src/components/NcUserBubble/NcUserBubbleDiv.vue',
					'src/components/NcTextArea/*.vue',
					'src/components/NcPopover/NcPopoverTriggerProvider.vue',
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
								ignore: [
									'src/components/NcAppNavigationItem/NcAppNavigationIconCollapsible.vue',
									'src/components/NcAppNavigationItem/NcInputConfirmCancel.vue',
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
									'src/components/NcAppSidebar/NcAppSidebar.vue',
									'src/components/NcAppSidebarTab/NcAppSidebarTab.vue',
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
						name: 'NcDialog',
						components: [
							'src/components/NcDialog*/*.vue',
						],
					},
					{
						name: 'NcFields',
						components: [
							'src/components/Nc*Field/*.vue',
							'src/components/NcTextArea/*.vue',
						],
					},
					{
						name: 'NcHeader',
						components: [
							'src/components/NcHeader*/*.vue',
						],
					},
					{
						name: 'NcListItems',
						components: [
							'src/components/NcListItem*/*.vue',
						],
					},
					{
						name: 'NcSelect',
						components: [
							'src/components/NcSelect*/*.vue',
						],
					},
					{
						name: 'NcPickers',
						components: [
							'src/components/Nc*Picker*/*.vue',
						],
					},
					{
						name: 'NcRichText',
						components: [
							'src/components/NcRichText/NcRichText.vue',
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
			url: 'https://github.com/nextcloud-libraries/nextcloud-vue',
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
