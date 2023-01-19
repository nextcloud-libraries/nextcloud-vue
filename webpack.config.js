const webpackConfig = require('@nextcloud/webpack-vue-config')
const webpackRules = require('@nextcloud/webpack-vue-config/rules')

const glob = require('glob')
const md5 = require('md5')
const path = require('path')

const { DefinePlugin } = require('webpack')
const BabelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except')
const nodeExternals = require('webpack-node-externals')

const buildMode = process.env.NODE_ENV
const isDev = buildMode === 'development'
const libraryTarget = process.env.LIBRARY_TARGET ?? 'umd'

const { loadTranslations } = require('./resources/translations.js')
const { dependencies } = require('./package.json')

// scope variable
// fallback for cypress testing
const appVersion = JSON.stringify(process.env.npm_package_version || 'nextcloud-vue')
const versionHash = md5(appVersion).slice(0, 7)
const SCOPE_VERSION = JSON.stringify(versionHash)

console.info('This build version hash is', versionHash, '\n')

webpackConfig.entry = {
	install: path.join(__dirname, 'src', 'install.js'),
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

webpackConfig.devtool = isDev ? false : 'source-map'
webpackConfig.output = {
	path: path.resolve(__dirname, './dist'),
	publicPath: '/dist/',
	filename: '[name].js',
	library: {
		type: libraryTarget,
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

webpackConfig.module.rules = Object.values(webpackRules)

module.exports = async () => {
	const translations = await loadTranslations(path.resolve(__dirname, './l10n'))

	webpackConfig.plugins.push(new DefinePlugin({
		PRODUCTION: JSON.stringify(!isDev),
		SCOPE_VERSION,
		TRANSLATIONS: JSON.stringify(translations),
	}))

	if (libraryTarget !== 'umd') {
		webpackConfig.experiments = {
			outputModule: true,
		}

		webpackConfig.entry = {
			index: path.join(__dirname, 'src', 'index.js'),
		}
		webpackConfig.output.filename = `[name].${libraryTarget}.js`

		webpackConfig.externals = [...webpackConfig.externals, ...Object.keys(dependencies)]

		delete webpackConfig.output.library.name
	}

	return webpackConfig
}
