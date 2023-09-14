const babelConfig = require('@nextcloud/babel-config')
const pluginTransformTypeScript = require('@babel/plugin-transform-typescript')

babelConfig.presets.push('@babel/preset-typescript')
babelConfig.overrides = [
	{
		test: /\.vue$/,
		plugins: [
			pluginTransformTypeScript,
		],
	},
]

module.exports = babelConfig
