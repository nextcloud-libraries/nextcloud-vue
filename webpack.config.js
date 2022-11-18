const glob = require('glob')
const md5 = require('md5')
const path = require('path')
const { loadTranslations } = require('./resources/translations.js')

const { DefinePlugin } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const BabelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except')
const nodeExternals = require('webpack-node-externals')

const buildMode = process.env.NODE_ENV
const isDev = buildMode === 'development'
const libraryTarget = process.env.LIBRARY_TARGET ?? 'umd'

const { dependencies } = require('./package.json')

// scope variable
// fallback for cypress testing
const appVersion = JSON.stringify(process.env.npm_package_version || 'nextcloud-vue')
const versionHash = md5(appVersion).slice(0, 7)
const SCOPE_VERSION = JSON.stringify(versionHash)

console.info('This build version hash is', versionHash, '\n')

const config = {
	mode: buildMode,
	devtool: isDev ? false : 'source-map',
	devServer: {
		historyApiFallback: true,
		noInfo: true,
		overlay: true,
	},
	entry: {
		ncvuecomponents: path.join(__dirname, 'src', 'index.js'),
		install: path.join(__dirname, 'src', 'install.js'),
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
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/',
		filename: '[name].js',
		library: {
			type: libraryTarget,
			name: ['NextcloudVue', '[name]'],
		},
		umdNamedDefine: true,
	},
	externals: [nodeExternals()],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
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
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: BabelLoaderExcludeNodeModulesExcept([
					'@nextcloud/calendar-js',
					'tributejs',
				]),
			},
			{
				test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/i,
				loader: 'url-loader',
			},
			{
				test: /\.svg/,
				type: 'asset/inline',
			},
			{
				resourceQuery: /raw/,
				type: 'asset/source',
			},
		],
	},
	plugins: [
		new VueLoaderPlugin(),
	],
	resolve: {
		extensions: ['*', '.js', '.vue'],
		symlinks: false,
		// Alias the default server assets path to link to local one
		alias: {
			'/core/css/../img': path.join(__dirname, 'styleguide/assets/img'),
			'/core/css/../fonts': path.join(__dirname, 'styleguide/assets/fonts'),
		},
	},
}

module.exports = async () => {
	const translations = await loadTranslations(path.resolve(__dirname, './l10n'))

	config.plugins.push(new DefinePlugin({
		SCOPE_VERSION,
		TRANSLATIONS: JSON.stringify(translations),
	}))

	if (libraryTarget !== 'umd') {
		config.experiments = {
			outputModule: true,
		}

		config.entry = {
			index: path.join(__dirname, 'src', 'index.js'),
		}

		config.output.filename = `[name].${libraryTarget}.js`

		config.externals = [...config.externals, ...Object.keys(dependencies)]

		delete config.output.library.name
	}

	return config
}
