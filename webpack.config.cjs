/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */
// config for the styleguide

const webpackConfig = require('@nextcloud/webpack-vue-config')
const webpackRules = require('@nextcloud/webpack-vue-config/rules')

const crypto = require('crypto')
const path = require('path')

const { DefinePlugin } = require('webpack')
const BabelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except')

const buildMode = process.env.NODE_ENV
const isDev = buildMode === 'development'

// scope variable
// fallback for cypress testing
const appVersion = JSON.stringify(process.env.npm_package_version || 'nextcloud-vue')
const versionHash = crypto.createHash('md5').update(appVersion).digest('hex').slice(0, 7)
const SCOPE_VERSION = JSON.stringify(versionHash)

webpackConfig.devtool = isDev ? false : 'source-map'

const sassLoader = {
	loader: 'sass-loader',
	options: {
		additionalData: `$scope_version:${SCOPE_VERSION}; @use 'sass:math'; @use 'variables' as *; @use 'material-icons' as *;`,
		/**
		 * ! needed for resolve-url-loader
		 */
		sourceMap: true,
		sassOptions: {
			sourceMapContents: false,
			includePaths: [
				path.resolve(__dirname, './src/assets'),
			],
		},
	},
}

webpackRules.RULE_SCSS = {
	test: /\.scss$/,
	oneOf: [
		{
			resourceQuery: /module/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						modules: {
							// Same as in Vite
							localIdentName: '_[local]_[hash:base64:5]',
						},
					},
				},
				'resolve-url-loader',
				sassLoader,
			],
		},
		{
			use: [
				'style-loader',
				'css-loader',
				'resolve-url-loader',
				sassLoader,
			],
		},
	],
}

webpackRules.RULE_CSS = {
	test: /\.css$/,
	oneOf: [
		{
			resourceQuery: /module/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						modules: {
							// Same as in Vite
							localIdentName: '_[local]_[hash:base64:5]',
						},
					},
				},
				'resolve-url-loader',
			],
		},
		{
			use: [
				'style-loader',
				'css-loader',
				'resolve-url-loader',
			],
		},
	],
}

webpackRules.RULE_JS.exclude = BabelLoaderExcludeNodeModulesExcept([
	'tributejs',
])

// Speedup styleguide build
webpackRules.RULE_TS.use = [
	'babel-loader',
	{
		loader: 'ts-loader',
		options: {
			transpileOnly: true,
		},
	},
]

webpackRules.RULE_RAW_SVG = {
	resourceQuery: /raw/,
	type: 'asset/source',
}

webpackRules.RULE_NODE_MJS = {
	test: /\.m?js$/,
	include: /node_modules/,
	type: 'javascript/auto',
	resolve: {
		fullySpecified: false,
	},
}

webpackConfig.module.rules = Object.values(webpackRules)

module.exports = () => {
	webpackConfig.plugins.push(new DefinePlugin({
		PRODUCTION: JSON.stringify(!isDev),
		SCOPE_VERSION,
	}))

	webpackConfig.resolve.extensionAlias = {
		'.js': ['.ts', '.js'],
		'.mjs': ['.mts', '.mjs'],
	}

	return webpackConfig
}
