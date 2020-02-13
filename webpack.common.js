const fs = require('fs')
const gettextParser = require('gettext-parser')
const glob = require('glob')
const md5 = require('md5')
const path = require('path')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const IconfontPlugin = require('iconfont-plugin-webpack')

const { DefinePlugin } = require('webpack')

const nodeExternals = require('webpack-node-externals')

// scope variable
const appVersion = JSON.stringify(process.env.npm_package_version)
const versionHash = md5(appVersion).substr(0, 7)
const SCOPE_VERSION = JSON.stringify(versionHash)
const ICONFONT_NAME = `iconfont-vue-${versionHash}`

console.info('This build version hash is', versionHash, '\n')

// https://github.com/alexanderwallin/node-gettext#usage
// https://github.com/alexanderwallin/node-gettext#load-and-add-translations-from-mo-or-po-files
const translations = fs
	.readdirSync('./l10n')
	.filter(name => name !== 'messages.pot' && name.endsWith('.pot'))
	.map(file => {
		const path = './l10n/' + file
		const locale = file.substr(0, file.length -'.pot'.length)

		const po = fs.readFileSync(path)
		const json = gettextParser.po.parse(po)
		return {
			locale,
			json
		}
	})

module.exports = {
	entry: {
		ncvuecomponents: path.join(__dirname, 'src', 'index.js'),
		...glob.sync('src/components/*/index.js').reduce((acc, item) => {
			const name = item.replace('/index.js', '').replace('src/components/', 'Components/');
			acc[name] = path.join(__dirname, item);
			return acc;
		}, {}),
		...glob.sync('src/directives/*/index.js').reduce((acc, item) => {
			const name = item.replace('/index.js', '').replace('src/directives/', 'Directives/');
			acc[name] = path.join(__dirname, item);
			return acc;
		}, {}),
		...glob.sync('src/mixins/*/index.js').reduce((acc, item) => {
			const name = item.replace('/index.js', '').replace('src/mixins/', 'Mixins/');
			acc[name] = path.join(__dirname, item);
			return acc;
		}, {}),
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/',
		filename: '[name].js',
		libraryTarget: 'umd',
		library: ['NextcloudVue', '[name]'],
		umdNamedDefine: true
	},
	externals: [
		nodeExternals()
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['vue-style-loader', 'css-loader', 'resolve-url-loader']
			},
			{
				test: /\.scss$/,
				use: [
					'vue-style-loader',
					'css-loader',
					'resolve-url-loader',
					{
						loader: 'sass-loader',
						options: {
							loader: 'sass-loader',
							data: `$scope_version:${SCOPE_VERSION}; @import 'variables';`,
							/**
							 * ! needed for resolve-url-loader
							 */
							sourceMap: true,
							sourceMapContents: false,
							includePaths: [path.resolve(__dirname, './src/assets')]
						}
					}
				]
			},
			{
				test: /\.(js|vue)$/,
				use: 'eslint-loader',
				enforce: 'pre'
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/i,
				loader: 'url-loader'
			}
		]
	},
	plugins: [
		new IconfontPlugin({
			src: './src/assets/iconfont',
			family: ICONFONT_NAME,
			dest: {
				font: './src/fonts/[family].[type]',
				css: './src/fonts/scss/iconfont-vue.scss'
			},
			watch: {
				pattern: './src/assets/iconfont/*.svg'
			}
		}),
		new VueLoaderPlugin(),
		new StyleLintPlugin({
			files: ['src/**/*.vue', 'src/**/*.scss', 'src/**/*.css']
		}),
		new DefinePlugin({ 
			SCOPE_VERSION,
			TRANSLATIONS: JSON.stringify(translations)
		})
	],
	resolve: {
		alias: {
			Assets: path.resolve(__dirname, 'src/assets/'),
			Components: path.resolve(__dirname, 'src/components/'),
			Directives: path.resolve(__dirname, 'src/directives/'),
			Mixins: path.resolve(__dirname, 'src/mixins/'),
			Utils: path.resolve(__dirname, 'src/utils/'),
			Fonts: path.resolve(__dirname, 'src/fonts/')
		},
		extensions: ['*', '.js', '.vue'],
		symlinks: false
	}
};
