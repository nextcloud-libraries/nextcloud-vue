const webpackConfig = require('@nextcloud/webpack-vue-config')
const webpackRules = require('@nextcloud/webpack-vue-config/rules')

const glob = require('glob')
const md5 = require('md5')
const path = require('path')
const translations = require('./build/translations')

const { DefinePlugin } = require('webpack')
const nodeExternals = require('webpack-node-externals')

// scope variable
// fallback for cypress testing
const appVersion = JSON.stringify(process.env.npm_package_version || 'nextcloud-vue')
const versionHash = md5(appVersion).substr(0, 7)
const SCOPE_VERSION = JSON.stringify(versionHash)

console.info('This build version hash is', versionHash, '\n')

webpackConfig.entry = {
	ncvuecomponents: path.join(__dirname, 'src', 'index.js'),
	...glob.sync('src/components/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/components/', 'Components/')
		acc[name] = path.join(__dirname, item)
		return acc
	}, {}),
	...glob.sync('src/directives/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/directives/', 'Directives/')
		acc[name] = path.join(__dirname, item)
		return acc
	}, {}),
	...glob.sync('src/functions/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/functions/', 'Functions/')
		acc[name] = path.join(__dirname, item)
		return acc
	}, {}),
	...glob.sync('src/mixins/*/index.js').reduce((acc, item) => {
		const name = item
			.replace('/index.js', '')
			.replace('src/mixins/', 'Mixins/')
		acc[name] = path.join(__dirname, item)
		return acc
	}, {}),
}
webpackConfig.output = {
	path: path.resolve(__dirname, './dist'),
	publicPath: '/dist/',
	filename: '[name].js',
	libraryTarget: 'umd',
	library: ['NextcloudVue', '[name]'],
	umdNamedDefine: true,
}
webpackConfig.externals = [nodeExternals()]

webpackConfig.plugins.push(new DefinePlugin({
	SCOPE_VERSION,
	TRANSLATIONS: JSON.stringify(translations),
}))
// Alias the default server assets path to link to local one
webpackConfig.resolve.alias = {
	'/core/css/../img': path.join(__dirname, 'styleguide/assets/img'),
	'/core/css/../fonts': path.join(__dirname, 'styleguide/assets/fonts'),
}
webpackRules.RULE_CSS = {
	test: /\.css$/,
	use: [
		'style-loader',
		'css-loader',
		'resolve-url-loader',
	],
}
webpackRules.RULE_SCSS = {
	test: /\.scss$/,
	use: [
		'style-loader',
		'css-loader',
		'resolve-url-loader',
		{
			loader: 'sass-loader',
			options: {
				additionalData: `$scope_version:${SCOPE_VERSION}; @import 'variables'; @import 'material-icons';`,
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
webpackConfig.module.rules = Object.values(webpackRules)

module.exports = webpackConfig
