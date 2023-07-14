const webpackConfig = require('@nextcloud/webpack-vue-config')
const webpackRules = require('@nextcloud/webpack-vue-config/rules')

const { globSync } = require('glob')
const md5 = require('md5')
const path = require('path')

const { DefinePlugin } = require('webpack')
const BabelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except')
const nodeExternals = require('webpack-node-externals')
const { loadTranslations } = require('./build/translations.js')

const buildMode = process.env.NODE_ENV
const isDev = buildMode === 'development'

// scope variable
// fallback for cypress testing
const appVersion = JSON.stringify(process.env.npm_package_version || 'nextcloud-vue')
const versionHash = md5(appVersion).slice(0, 7)
const SCOPE_VERSION = JSON.stringify(versionHash)

console.info('This build version hash is', versionHash, '\n')

webpackConfig.entry = {
	install: path.join(__dirname, 'src', 'install.js'),

	...globSync('src/components/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/components/', 'Components/')
		acc[name] = path.join(__dirname, item)
		return acc
	}, {}),

	...globSync('src/directives/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/directives/', 'Directives/')
		acc[name] = path.join(__dirname, item)
		return acc
	}, {}),

	...globSync('src/functions/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/functions/', 'Functions/')
		acc[name] = path.join(__dirname, item)
		return acc
	}, {}),

	...globSync('src/mixins/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/mixins/', 'Mixins/')
		acc[name] = path.join(__dirname, item)
		return acc
	}, {}),
}

webpackConfig.devtool = isDev ? false : 'source-map'
webpackConfig.output = {
	path: path.resolve(__dirname, './dist'),
	publicPath: '/dist/',
	filename: '[name].js',
	library: {
		type: 'umd',
		name: ['NextcloudVue', '[name]'],
	},
	umdNamedDefine: true,
}

webpackConfig.externals = [nodeExternals()]

webpackRules.RULE_SCSS = {
	test: /\.scss$/,
	use: [
		'style-loader',
		'css-loader',
		'resolve-url-loader',
		{
			loader: 'sass-loader',
			options: {
				additionalData: `@use 'sass:math'; $scope_version:${SCOPE_VERSION}; @import 'variables'; @import 'material-icons';`,
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
		},
	],
}

webpackRules.RULE_JS.exclude = BabelLoaderExcludeNodeModulesExcept([
	'@nextcloud/calendar-js',
	'tributejs',
])

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
	}
}

webpackConfig.module.rules = Object.values(webpackRules)

module.exports = async () => {
	const translations = await loadTranslations(path.resolve(__dirname, './l10n'))

	webpackConfig.plugins.push(new DefinePlugin({
		PRODUCTION: JSON.stringify(!isDev),
		SCOPE_VERSION,
		TRANSLATIONS: JSON.stringify(translations),
	}))

	return webpackConfig
}
