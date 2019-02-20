const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const StyleLintPlugin = require('stylelint-webpack-plugin')

const IconfontPlugin = require('iconfont-plugin-webpack')
const IconfontName = 'iconfont-vue'

const { DefinePlugin } = require('webpack')

// scope variable
const md5 = require('md5')
const PACKAGE = require('./package.json')
const SCOPE_VERSION = JSON.stringify(md5(PACKAGE.version).substr(0, 7))

module.exports = {
	entry: path.join(__dirname, 'src', 'index.js'),
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/',
		filename: 'ncvuecomponents.js',
		libraryTarget: 'umd',
		library: 'NextcloudVue',
		umdNamedDefine: true
	},
	externals: {
		vue: {
			commonjs: 'vue',
			commonjs2: 'vue',
			amd: 'vue',
			root: 'Vue'
		}
	},
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
							data: '$scope_version: ' + SCOPE_VERSION + ';',
							/**
							 * ! needed for resolve-url-loader
							 */
							sourceMap: true,
							sourceMapContents: false
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
			family: IconfontName,
			dest: {
				font: './src/fonts/[family].[type]',
				css: './src/fonts/scss/[family].scss'
			},
			watch: {
				pattern: './src/assets/iconfont/*.svg'
			}
		}),
		new VueLoaderPlugin(),
		new StyleLintPlugin(),
		new DefinePlugin({ SCOPE_VERSION })
	],
	resolve: {
		alias: {
			Components: path.resolve(__dirname, 'src/components/'),
			Directives: path.resolve(__dirname, 'src/directives/'),
			Utils: path.resolve(__dirname, 'src/utils/'),
			Fonts: path.resolve(__dirname, 'src/fonts/')
		},
		extensions: ['*', '.js', '.vue', '.json']
	}
};
